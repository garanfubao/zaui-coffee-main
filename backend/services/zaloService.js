const axios = require('axios');
const crypto = require('crypto');

class ZaloService {
  constructor() {
    this.appId = process.env.ZALO_APP_ID;
    this.appSecret = process.env.ZALO_APP_SECRET;
    this.baseUrl = 'https://graph.zalo.me/v2.0';
  }

  // Generate appsecret_proof for security (required from 01/01/2024)
  generateAppSecretProof(accessToken) {
    const message = accessToken + this.appSecret;
    return crypto.createHash('sha256').update(message).digest('hex');
  }

  // Get Zalo user profile from access token
  async getZaloProfile(accessToken) {
    try {
      const appSecretProof = this.generateAppSecretProof(accessToken);
      
      const response = await axios.get(`${this.baseUrl}/me`, {
        headers: {
          'access_token': accessToken,
          'appsecret_proof': appSecretProof
        }
      });

      if (response.data.error === 0) {
        return {
          success: true,
          data: {
            zaloId: response.data.id,
            name: response.data.name,
            picture: response.data.picture?.data?.url,
            isSensitive: response.data.is_sensitive || false
          }
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get Zalo profile'
        };
      }
    } catch (error) {
      console.error('Zalo API error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to get Zalo profile'
      };
    }
  }

  // Send notification to Zalo OA
  async sendNotification(oaId, userId, message) {
    try {
      const response = await axios.post(`${this.baseUrl}/me/message`, {
        recipient: {
          user_id: userId
        },
        message: {
          text: message
        }
      }, {
        headers: {
          'access_token': oaId,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Zalo notification error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to send notification'
      };
    }
  }

  // Validate access token
  async validateAccessToken(accessToken) {
    try {
      const profile = await this.getZaloProfile(accessToken);
      return profile.success;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new ZaloService();
