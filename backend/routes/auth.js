const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const zaloService = require('../services/zaloService');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Zalo Login
router.post('/zalo-login', authLimiter, [
  body('accessToken').notEmpty().withMessage('Access token is required')
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

    const { accessToken } = req.body;

    // Get Zalo profile
    const zaloProfile = await zaloService.getZaloProfile(accessToken);
    if (!zaloProfile.success) {
      return res.status(401).json({
        success: false,
        message: zaloProfile.message
      });
    }

    // Check if user exists
    let userQuery = 'SELECT * FROM users WHERE zalo_id = $1';
    let userResult = await pool.query(userQuery, [zaloProfile.data.zaloId]);

    let user;
    if (userResult.rows.length === 0) {
      // Create new user
      const createUserQuery = `
        INSERT INTO users (zalo_id, full_name, avatar_url)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const createUserResult = await pool.query(createUserQuery, [
        zaloProfile.data.zaloId,
        zaloProfile.data.name,
        zaloProfile.data.picture
      ]);
      user = createUserResult.rows[0];
    } else {
      user = userResult.rows[0];
      
      // Update user info if needed
      if (user.full_name !== zaloProfile.data.name || user.avatar_url !== zaloProfile.data.picture) {
        const updateUserQuery = `
          UPDATE users 
          SET full_name = $2, avatar_url = $3, updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING *
        `;
        const updateUserResult = await pool.query(updateUserQuery, [
          user.id,
          zaloProfile.data.name,
          zaloProfile.data.picture
        ]);
        user = updateUserResult.rows[0];
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, zaloId: user.zalo_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          zaloId: user.zalo_id,
          fullName: user.full_name,
          phone: user.phone,
          email: user.email,
          avatarUrl: user.avatar_url,
          points: user.points
        }
      }
    });

  } catch (error) {
    console.error('Zalo login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update phone number
router.post('/update-phone', [
  body('phone').isMobilePhone('vi-VN').withMessage('Invalid phone number')
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

    const { phone } = req.body;
    const userId = req.user.id;

    // Check if phone already exists
    const existingUserQuery = 'SELECT id FROM users WHERE phone = $1 AND id != $2';
    const existingUserResult = await pool.query(existingUserQuery, [phone, userId]);
    
    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already exists'
      });
    }

    // Update user phone
    const updateQuery = `
      UPDATE users 
      SET phone = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const updateResult = await pool.query(updateQuery, [userId, phone]);

    res.json({
      success: true,
      message: 'Phone number updated successfully',
      data: {
        user: {
          id: updateResult.rows[0].id,
          phone: updateResult.rows[0].phone
        }
      }
    });

  } catch (error) {
    console.error('Update phone error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          zaloId: user.zalo_id,
          fullName: user.full_name,
          phone: user.phone,
          email: user.email,
          avatarUrl: user.avatar_url,
          points: user.points,
          createdAt: user.created_at
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
