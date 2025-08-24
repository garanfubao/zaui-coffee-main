const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Get all vouchers (admin only)
router.get('/', adminAuth, apiLimiter, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM vouchers ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting vouchers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new voucher (admin only)
router.post('/', adminAuth, apiLimiter, [
  body('code').notEmpty().withMessage('Voucher code is required'),
  body('discountPercent').isInt({ min: 1, max: 100 }).withMessage('Discount percent must be between 1-100'),
  body('minOrderAmount').isFloat({ min: 0 }).withMessage('Minimum order amount must be positive'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required')
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

    const { code, discountPercent, minOrderAmount, maxDiscountAmount, expiryDate } = req.body;

    // Check if voucher code already exists
    const existingVoucher = await pool.query(
      'SELECT id FROM vouchers WHERE code = $1',
      [code.toUpperCase()]
    );

    if (existingVoucher.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Voucher code already exists'
      });
    }

    const result = await pool.query(
      `INSERT INTO vouchers (code, discount_percent, min_order_amount, max_discount_amount, expiry_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [code.toUpperCase(), discountPercent, minOrderAmount, maxDiscountAmount || null, expiryDate, req.user.id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update voucher status (admin only)
router.patch('/:id/status', adminAuth, apiLimiter, [
  body('isActive').isBoolean().withMessage('isActive must be boolean')
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

    const { id } = req.params;
    const { isActive } = req.body;

    const result = await pool.query(
      'UPDATE vouchers SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating voucher status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete voucher (admin only)
router.delete('/:id', adminAuth, apiLimiter, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM vouchers WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    res.json({
      success: true,
      message: 'Voucher deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Validate voucher (public)
router.post('/validate', apiLimiter, [
  body('code').notEmpty().withMessage('Voucher code is required'),
  body('orderAmount').isFloat({ min: 0 }).withMessage('Order amount must be positive')
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

    const { code, orderAmount } = req.body;

    const result = await pool.query(
      `SELECT * FROM vouchers 
       WHERE code = $1 
       AND is_active = true 
       AND expiry_date > CURRENT_DATE`,
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: 'Voucher không hợp lệ hoặc đã hết hạn'
      });
    }

    const voucher = result.rows[0];

    if (orderAmount < voucher.min_order_amount) {
      return res.json({
        success: false,
        message: `Đơn hàng tối thiểu ${voucher.min_order_amount.toLocaleString('vi-VN')}đ`
      });
    }

    const discountAmount = Math.min(
      (orderAmount * voucher.discount_percent) / 100,
      voucher.max_discount_amount || Infinity
    );

    res.json({
      success: true,
      data: {
        voucher,
        discountAmount: Math.floor(discountAmount)
      }
    });
  } catch (error) {
    console.error('Error validating voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
