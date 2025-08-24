const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Get all products (public)
router.get('/', apiLimiter, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.sort_order, p.name`
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get products by category (public)
router.get('/category/:categorySlug', apiLimiter, async (req, res) => {
  try {
    const { categorySlug } = req.params;
    
    const result = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE c.slug = $1
       ORDER BY p.sort_order, p.name`,
      [categorySlug]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get product by ID (public)
router.get('/:id', apiLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new product (admin only)
router.post('/', adminAuth, apiLimiter, [
  body('name').notEmpty().withMessage('Product name is required'),
  body('categoryId').isInt().withMessage('Valid category ID is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('description').optional().isString(),
  body('imageUrl').optional().isURL().withMessage('Valid image URL is required'),
  body('sortOrder').optional().isInt({ min: 0 })
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

    const { name, categoryId, price, description, imageUrl, sortOrder } = req.body;

    // Check if category exists
    const categoryExists = await pool.query(
      'SELECT id FROM categories WHERE id = $1',
      [categoryId]
    );

    if (categoryExists.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    const result = await pool.query(
      `INSERT INTO products (name, category_id, price, description, image_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, categoryId, price, description || null, imageUrl || null, sortOrder || 0]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, apiLimiter, [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('categoryId').optional().isInt().withMessage('Valid category ID is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('description').optional().isString(),
  body('imageUrl').optional().isURL().withMessage('Valid image URL is required'),
  body('sortOrder').optional().isInt({ min: 0 })
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
    const { name, categoryId, price, description, imageUrl, sortOrder } = req.body;

    // Check if product exists
    const productExists = await pool.query(
      'SELECT id FROM products WHERE id = $1',
      [id]
    );

    if (productExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (categoryId !== undefined) {
      updateFields.push(`category_id = $${paramCount++}`);
      values.push(categoryId);
    }
    if (price !== undefined) {
      updateFields.push(`price = $${paramCount++}`);
      values.push(price);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (imageUrl !== undefined) {
      updateFields.push(`image_url = $${paramCount++}`);
      values.push(imageUrl);
    }
    if (sortOrder !== undefined) {
      updateFields.push(`sort_order = $${paramCount++}`);
      values.push(sortOrder);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, apiLimiter, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
