const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Get user orders
router.get('/', auth, apiLimiter, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = `
      SELECT o.*, 
             a.fullname as customer_name, 
             a.phone as customer_phone,
             CONCAT(a.detail, ', ', COALESCE(a.ward, ''), ', ', COALESCE(a.district, ''), ', ', COALESCE(a.province, '')) as address
      FROM orders o
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.user_id = $1
    `;
    let params = [userId];

    if (status) {
      query += ' AND o.status = $2';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const result = await pool.query(query, params);

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      result.rows.map(async (order) => {
        const itemsQuery = `
          SELECT oi.*, p.name as product_name, p.image_url
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = $1
        `;
        const itemsResult = await pool.query(itemsQuery, [order.id]);
        
        return {
          ...order,
          items: itemsResult.rows
        };
      })
    );

    res.json({
      success: true,
      data: {
        orders: ordersWithItems
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new order
router.post('/', auth, apiLimiter, [
  body('addressId').isInt().withMessage('Valid address ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('total').isFloat({ min: 0 }).withMessage('Valid total amount is required'),
  body('discount').isFloat({ min: 0 }).withMessage('Valid discount amount is required'),
  body('finalTotal').isFloat({ min: 0 }).withMessage('Valid final total is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { addressId, items, total, discount, finalTotal, voucherCode, note } = req.body;
    const userId = req.user.id;
    const orderId = `FKT${Date.now()}`;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create order
      const orderQuery = `
        INSERT INTO orders (order_id, user_id, address_id, total_amount, discount_amount, final_amount, voucher_code, note)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const orderValues = [orderId, userId, addressId, total, discount, finalTotal, voucherCode, note];
      const orderResult = await client.query(orderQuery, orderValues);
      const order = orderResult.rows[0];

      // Create order items
      for (const item of items) {
        const itemQuery = `
          INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, options)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const itemValues = [
          order.id,
          item.product.id,
          item.product.name,
          item.quantity,
          item.price,
          item.price * item.quantity,
          JSON.stringify(item.options || {})
        ];
        await client.query(itemQuery, itemValues);
      }

      // Calculate points earned (1 point per 1000 VND)
      const pointsEarned = Math.floor(finalTotal / 1000);

      // Update order with points
      const updateOrderQuery = `
        UPDATE orders 
        SET points_earned = $2
        WHERE id = $1
        RETURNING *
      `;
      await client.query(updateOrderQuery, [order.id, pointsEarned]);

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Order created successfully',
        data: {
          order: {
            ...order,
            pointsEarned
          }
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get order by ID
router.get('/:orderId', auth, apiLimiter, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const orderQuery = `
      SELECT o.*, 
             a.fullname as customer_name, 
             a.phone as customer_phone,
             CONCAT(a.detail, ', ', COALESCE(a.ward, ''), ', ', COALESCE(a.district, ''), ', ', COALESCE(a.province, '')) as address
      FROM orders o
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.order_id = $1 AND o.user_id = $2
    `;
    const orderResult = await pool.query(orderQuery, [orderId, userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsQuery = `
      SELECT oi.*, p.name as product_name, p.image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;
    const itemsResult = await pool.query(itemsQuery, [order.id]);

    res.json({
      success: true,
      data: {
        order: {
          ...order,
          items: itemsResult.rows
        }
      }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update order status (Admin only)
router.patch('/:orderId/status', auth, apiLimiter, [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get current order
      const orderQuery = 'SELECT * FROM orders WHERE order_id = $1';
      const orderResult = await client.query(orderQuery, [orderId]);
      
      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const order = orderResult.rows[0];

      // Update order status
      const updateOrderQuery = `
        UPDATE orders 
        SET status = $2, updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $1
        RETURNING *
      `;
      const updateResult = await client.query(updateOrderQuery, [orderId, status]);
      const updatedOrder = updateResult.rows[0];

      // Handle points when order is completed
      if (status === 'completed' && !order.points_claimed) {
        // Add points to user
        const addPointsQuery = `
          UPDATE users 
          SET points = points + $2, updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `;
        await client.query(addPointsQuery, [order.user_id, order.points_earned]);

        // Mark points as claimed
        await client.query(`
          UPDATE orders 
          SET points_claimed = true
          WHERE order_id = $1
        `, [orderId]);

        // Add to points history
        await client.query(`
          INSERT INTO points_history (user_id, order_id, points_change, description)
          VALUES ($1, $2, $3, $4)
        `, [order.user_id, order.id, order.points_earned, `Tích điểm từ đơn hàng #${orderId}`]);
      }

      // Handle points when order is cancelled
      if (status === 'cancelled' && order.points_claimed) {
        // Deduct points from user
        const deductPointsQuery = `
          UPDATE users 
          SET points = points - $2, updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `;
        await client.query(deductPointsQuery, [order.user_id, order.points_earned]);

        // Mark points as not claimed
        await client.query(`
          UPDATE orders 
          SET points_claimed = false
          WHERE order_id = $1
        `, [orderId]);

        // Add to points history
        await client.query(`
          INSERT INTO points_history (user_id, order_id, points_change, description)
          VALUES ($1, $2, $3, $4)
        `, [order.user_id, order.id, -order.points_earned, `Trừ điểm do hủy đơn hàng #${orderId}`]);
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: {
          order: updatedOrder
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
