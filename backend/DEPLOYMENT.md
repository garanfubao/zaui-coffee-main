# 🚀 Zaui Coffee Backend - Deployment Guide

## 📋 Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git repository

## 🌐 Deployment Options

### 1. Render.com (Recommended - Free)

**Steps:**
1. Đăng ký tài khoản tại [render.com](https://render.com)
2. Connect GitHub repository
3. Tạo new Web Service
4. Cấu hình:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=zaui_coffee_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
ZALO_OA_ID=your-zalo-oa-id
ZALO_OA_SECRET=your-zalo-oa-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. Railway.app (Free with limits)

**Steps:**
1. Đăng ký tại [railway.app](https://railway.app)
2. Connect GitHub repository
3. Railway sẽ tự động detect và deploy
4. Thêm PostgreSQL database từ Railway dashboard

### 3. Heroku (Paid)

**Steps:**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create zaui-coffee-backend`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
5. Deploy: `git push heroku main`

## 🗄️ Database Setup

### Option 1: Railway PostgreSQL (Recommended)
1. Tạo PostgreSQL database trên Railway
2. Copy connection string
3. Update environment variables

### Option 2: Supabase (Free tier)
1. Đăng ký tại [supabase.com](https://supabase.com)
2. Tạo new project
3. Copy connection details
4. Run schema.sql trong SQL Editor

### Option 3: Neon (Free tier)
1. Đăng ký tại [neon.tech](https://neon.tech)
2. Tạo new project
3. Copy connection string
4. Run schema.sql

## 🔧 Environment Variables

Tạo file `.env` hoặc set trong hosting platform:

```env
# Server
NODE_ENV=production
PORT=10000

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=zaui_coffee_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Zalo API
ZALO_OA_ID=your-zalo-oa-id
ZALO_OA_SECRET=your-zalo-oa-secret

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Health Check

Sau khi deploy, test endpoint:
```
GET https://your-backend-url.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Zaui Coffee Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

## 🔄 Update Frontend

Sau khi có backend URL, update `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 🚨 Troubleshooting

### Common Issues:
1. **Database Connection Error**: Check DB credentials
2. **CORS Error**: Update CORS_ORIGIN
3. **JWT Error**: Set JWT_SECRET
4. **Port Error**: Set PORT environment variable

### Logs:
- Render: Dashboard > Logs
- Railway: Deployments > View Logs
- Heroku: `heroku logs --tail`
