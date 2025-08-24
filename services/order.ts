interface OrderData {
  orderId: string;
  address: {
    fullname: string;
    phone: string;
    detail: string;
    ward: string;
    district: string;
    province: string;
  };
  items: Array<{
    product: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  total: number;
  discount: number;
  voucherCode?: string | null;
  orderDate: string;
}

// TODO: Replace with actual Zalo OA API key
const ZALO_OA_API_KEY = import.meta.env.VITE_ZALO_OA_API_KEY || '';

export const sendOrderToZaloOA = async (orderData: OrderData): Promise<boolean> => {
  try {
    if (!ZALO_OA_API_KEY) {
      console.warn('Zalo OA API key not configured');
      return false;
    }

    // Format order message for Zalo OA
    const orderMessage = formatOrderMessage(orderData);
    
    // TODO: Implement actual Zalo OA API call
    // This is a placeholder for the actual implementation
    const response = await fetch('https://api.zalo.me/v2.0/oa/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZALO_OA_API_KEY}`,
      },
      body: JSON.stringify({
        recipient: {
          user_id: 'YOUR_USER_ID' // This should be the business owner's Zalo ID
        },
        message: {
          text: orderMessage
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Order sent to Zalo OA successfully');
    return true;
  } catch (error) {
    console.error('Error sending order to Zalo OA:', error);
    return false;
  }
};

const formatOrderMessage = (orderData: OrderData): string => {
  const itemsList = orderData.items
    .map(item => `• ${item.product.name} x${item.quantity} - ${formatVND(item.product.price * item.quantity)}`)
    .join('\n');

  const message = `🛒 **ĐƠN HÀNG MỚI** 🛒

📋 **Mã đơn hàng:** ${orderData.orderId}
📅 **Ngày đặt:** ${new Date(orderData.orderDate).toLocaleString('vi-VN')}

👤 **Thông tin khách hàng:**
• Tên: ${orderData.address.fullname}
• SĐT: ${orderData.address.phone}
• Địa chỉ: ${orderData.address.detail}, ${orderData.address.ward}, ${orderData.address.district}, ${orderData.address.province}

🛍️ **Sản phẩm đã đặt:**
${itemsList}

💰 **Tổng tiền:** ${formatVND(orderData.total)}
${orderData.discount > 0 ? `🎫 **Giảm giá:** ${formatVND(orderData.discount)}` : ''}
${orderData.voucherCode ? `🎁 **Mã voucher:** ${orderData.voucherCode}` : ''}

---
*Đơn hàng được tạo từ Gà Rán FKT Mini App*`;

  return message;
};

const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
