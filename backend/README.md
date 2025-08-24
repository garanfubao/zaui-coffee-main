# Zaui Coffee Backend API

Backend API cho Zaui Coffee Mini App với tích hợp Zalo Platform.

## 🚀 Tính năng

- ✅ **Zalo Authentication** - Đăng nhập qua Zalo
- ✅ **JWT Authentication** - Bảo mật API
- ✅ **PostgreSQL Database** - Lưu trữ dữ liệu
- ✅ **Rate Limiting** - Bảo vệ API
- ✅ **Order Management** - Quản lý đơn hàng
- ✅ **Points System** - Hệ thống tích điểm
- ✅ **Zalo Integration** - Tích hợp Zalo Open API

## 📋 Yêu cầu hệ thống

- Node.js 16+
- PostgreSQL 12+
- npm hoặc yarn

## 🛠️ Cài đặt

### 1. Clone và cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình Database

Tạo database PostgreSQL:

```sql
CREATE DATABASE zaui_coffee_db;
```

### 3. Cấu hình Environment

Copy file `config.env.example` thành `config.env` và cập nhật:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=zaui_coffee_db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Zalo Configuration
ZALO_APP_ID=your_zalo_app_id
ZALO_APP_SECRET=your_zalo_app_secret
ZALO_OA_ID=your_zalo_oa_id
```

### 4. Khởi tạo Database

```bash
# Chạy schema SQL
psql -d zaui_coffee_db -f database/schema.sql
```

### 5. Chạy server

```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Documentation

### Authentication

#### POST /api/auth/zalo-login
Đăng nhập qua Zalo

```json
{
  "accessToken": "zalo_access_token"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "zaloId": "zalo_user_id",
      "fullName": "User Name",
      "phone": "0123456789",
      "avatarUrl": "https://...",
      "points": 100
    }
  }
}
```

#### POST /api/auth/update-phone
Cập nhật số điện thoại

```json
{
  "phone": "0123456789"
}
```

#### GET /api/auth/me
Lấy thông tin user hiện tại

### Orders

#### GET /api/orders
Lấy danh sách đơn hàng của user

Headers: `Authorization: Bearer <token>`

Query params:
- `status`: Lọc theo trạng thái (pending, confirmed, preparing, delivering, completed, cancelled)

#### POST /api/orders
Tạo đơn hàng mới

```json
{
  "addressId": 1,
  "items": [
    {
      "product": {
        "id": 1,
        "name": "Cà phê đen"
      },
      "quantity": 2,
      "price": 25000,
      "options": {}
    }
  ],
  "total": 50000,
  "discount": 5000,
  "finalTotal": 45000,
  "voucherCode": "GIAM10",
  "note": "Ghi chú đơn hàng"
}
```

#### GET /api/orders/:orderId
Lấy chi tiết đơn hàng

#### PATCH /api/orders/:orderId/status
Cập nhật trạng thái đơn hàng (Admin)

```json
{
  "status": "completed"
}
```

## 🔐 Security

- **JWT Authentication** - Tất cả API cần token
- **Rate Limiting** - Giới hạn request
- **Input Validation** - Validate dữ liệu đầu vào
- **SQL Injection Protection** - Sử dụng parameterized queries
- **CORS Protection** - Chỉ cho phép domain được cấu hình

## 🗄️ Database Schema

### Users
- `id`: Primary key
- `zalo_id`: Zalo user ID
- `phone`: Số điện thoại
- `full_name`: Họ tên
- `avatar_url`: URL avatar
- `points`: Điểm tích lũy

### Orders
- `id`: Primary key
- `order_id`: Mã đơn hàng
- `user_id`: ID user
- `address_id`: ID địa chỉ
- `total_amount`: Tổng tiền
- `discount_amount`: Giảm giá
- `final_amount`: Thành tiền
- `status`: Trạng thái
- `points_earned`: Điểm nhận được
- `points_claimed`: Đã nhận điểm chưa

### Vouchers
- `id`: Primary key
- `code`: Mã voucher
- `discount_percent`: % giảm giá
- `min_order_amount`: Đơn tối thiểu
- `max_discount_amount`: Giảm tối đa
- `expiry_date`: Ngày hết hạn
- `is_active`: Trạng thái hoạt động

## 🔧 Development

### Scripts

```bash
# Development với nodemon
npm run dev

# Production
npm start

# Test
npm test
```

### Logs

Server logs được ghi ra console với format:
```
[timestamp] method url status response_time
```

### Error Handling

Tất cả errors được handle và trả về format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Validation errors
}
```

## 🚀 Deployment

### Production Checklist

- [ ] Cập nhật `NODE_ENV=production`
- [ ] Cấu hình database production
- [ ] Cập nhật JWT_SECRET
- [ ] Cấu hình Zalo App credentials
- [ ] Setup SSL certificate
- [ ] Cấu hình reverse proxy (nginx)
- [ ] Setup monitoring và logging

### Docker (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📞 Support

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ team development.
