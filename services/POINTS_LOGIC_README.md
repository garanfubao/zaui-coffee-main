# Logic Tích Điểm - Bảo Mật & An Toàn

## Vấn đề cũ (Đã sửa)
Trước đây, điểm được cộng ngay khi đơn hàng được tạo, tạo ra lỗ hổng bảo mật:

### Lỗ hổng:
1. **Tạo đơn hàng ảo** với giá trị lớn
2. **Nhận điểm tích lũy ngay lập tức**
3. **Hủy đơn hàng** hoặc tạo đơn thật nhỏ hơn
4. **Lạm dụng điểm** đã tích được

### Ví dụ:
- Tạo đơn 1,000,000đ → Nhận 10,000 điểm ngay
- Hủy đơn → Giữ lại 10,000 điểm
- Tạo đơn thật 100,000đ → Lợi dụng điểm đã có

## Logic mới (Đã sửa)

### 1. Chỉ cộng điểm khi đơn hàng hoàn thành
```typescript
// Khi tạo đơn hàng
const orderHistoryItem: OrderHistoryItem = {
  // ... other fields
  pointsEarned: 1000, // Tính điểm nhưng chưa cộng
  pointsClaimed: false, // Chưa được cộng
  status: 'pending'
};

// Khi đơn hàng hoàn thành
if (status === 'completed' && !order.pointsClaimed) {
  order.pointsClaimed = true; // Đánh dấu đã cộng
  addPointsToUser(order.pointsEarned, order.orderId, order.voucherCode);
}
```

### 2. Trừ điểm khi đơn hàng bị hủy
```typescript
// Nếu đơn hàng bị hủy và đã cộng điểm
if (status === 'cancelled' && order.pointsClaimed) {
  order.pointsClaimed = false; // Đánh dấu chưa cộng
  // Trừ điểm từ tài khoản
  const newPoints = Math.max(0, currentPoints - order.pointsEarned);
  // Thêm vào lịch sử
  addPointsHistory(-order.pointsEarned, `Trừ điểm do hủy đơn hàng #${orderId}`);
}
```

### 3. Tương thích với dữ liệu cũ
```typescript
// Xử lý đơn hàng cũ (chưa có pointsClaimed)
return parsedOrders.map((order: any) => ({
  ...order,
  pointsClaimed: order.pointsClaimed !== undefined ? order.pointsClaimed : 
    (order.status === 'completed' ? true : false)
}));
```

## Quy trình tích điểm mới

### 1. Tạo đơn hàng
- ✅ Tính toán điểm sẽ nhận được
- ❌ **KHÔNG** cộng điểm ngay
- 📝 Lưu trạng thái `pointsClaimed: false`

### 2. Đơn hàng đang xử lý
- 📊 Hiển thị điểm sẽ nhận được
- ⏳ Chờ đơn hàng hoàn thành
- 🔒 Điểm chưa được cộng

### 3. Đơn hàng hoàn thành
- ✅ Cộng điểm vào tài khoản
- 📝 Đánh dấu `pointsClaimed: true`
- 📅 Lưu ngày hoàn thành

### 4. Đơn hàng bị hủy
- ❌ Trừ điểm nếu đã cộng
- 📝 Đánh dấu `pointsClaimed: false`
- 📋 Ghi lại lịch sử trừ điểm

## Lợi ích của logic mới

### 🔒 Bảo mật
- Ngăn chặn tạo đơn hàng ảo
- Không thể lạm dụng điểm trước khi hoàn thành
- Đảm bảo tính toàn vẹn dữ liệu

### 💰 Kinh tế
- Chỉ cộng điểm cho đơn hàng thật
- Tránh thất thoát điểm do đơn hàng hủy
- Tăng độ tin cậy của hệ thống

### 📊 Minh bạch
- Lịch sử điểm rõ ràng
- Track được trạng thái cộng điểm
- Dễ dàng audit và kiểm tra

## Các trạng thái đơn hàng

| Trạng thái | Cộng điểm | Ghi chú |
|------------|-----------|---------|
| `pending` | ❌ | Chờ xác nhận |
| `confirmed` | ❌ | Đã xác nhận |
| `preparing` | ❌ | Đang chuẩn bị |
| `delivering` | ❌ | Đang giao hàng |
| `completed` | ✅ | **Hoàn thành - cộng điểm** |
| `cancelled` | ❌/🔄 | Hủy - trừ điểm nếu đã cộng |

## Migration từ logic cũ

### Tự động xử lý:
- Đơn hàng cũ đã hoàn thành → Coi như đã cộng điểm
- Đơn hàng cũ chưa hoàn thành → Chưa cộng điểm
- Không cần can thiệp thủ công

### Kiểm tra:
```typescript
// Kiểm tra đơn hàng có cộng điểm chưa
const order = getOrderHistory().find(o => o.orderId === 'ORDER_ID');
console.log('Đã cộng điểm:', order?.pointsClaimed);
console.log('Trạng thái:', order?.status);
```
