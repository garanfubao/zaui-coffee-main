import apiService from './api';

export interface OrderHistoryItem {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  discount: number;
  voucherCode?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  pointsEarned: number;
  pointsClaimed: boolean; // Thêm trường để track điểm đã được cộng chưa
  orderDate: string;
  completedDate?: string;
}

export interface PointsHistoryItem {
  id: string;
  orderId?: string;
  type: 'earned' | 'used' | 'expired';
  points: number;
  description: string;
  date: string;
}

const ORDER_HISTORY_KEY = 'orderHistory';
const POINTS_HISTORY_KEY = 'pointsHistory';
const USER_POINTS_KEY = 'userPoints';

// Order History Management
export const saveOrder = async (orderData: any): Promise<OrderHistoryItem> => {
  try {
    // Calculate points earned (1% of order total after discount)
    const finalAmount = orderData.total - orderData.discount;
    const pointsEarned = Math.floor(finalAmount * 0.01);
    
    const orderPayload = {
      orderId: orderData.orderId,
      customerName: orderData.address.fullname,
      customerPhone: orderData.address.phone,
      address: `${orderData.address.detail}, ${orderData.address.ward}, ${orderData.address.district}, ${orderData.address.province}`,
      items: orderData.items.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: orderData.total,
      discount: orderData.discount,
      voucherCode: orderData.voucherCode,
      pointsEarned,
      orderDate: orderData.orderDate
    };
    
    const response = await apiService.createOrder(orderPayload);
    
    if (response.success) {
      // Also save to localStorage for offline access
      const orders = getOrderHistory();
      const orderHistoryItem: OrderHistoryItem = {
        id: response.data.id,
        orderId: orderData.orderId,
        customerName: orderData.address.fullname,
        customerPhone: orderData.address.phone,
        address: `${orderData.address.detail}, ${orderData.address.ward}, ${orderData.address.district}, ${orderData.address.province}`,
        items: orderData.items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: orderData.total,
        discount: orderData.discount,
        voucherCode: orderData.voucherCode,
        status: 'pending',
        pointsEarned,
        pointsClaimed: false,
        orderDate: orderData.orderDate
      };
      
      orders.unshift(orderHistoryItem);
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
      
      return orderHistoryItem;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error saving order:', error);
    // Fallback to localStorage if API fails
    return saveOrderToLocalStorage(orderData);
  }
};

// Fallback function for localStorage
const saveOrderToLocalStorage = (orderData: any): OrderHistoryItem => {
  const orders = getOrderHistory();
  const finalAmount = orderData.total - orderData.discount;
  const pointsEarned = Math.floor(finalAmount * 0.01);
  
  const orderHistoryItem: OrderHistoryItem = {
    id: `order_${Date.now()}`,
    orderId: orderData.orderId,
    customerName: orderData.address.fullname,
    customerPhone: orderData.address.phone,
    address: `${orderData.address.detail}, ${orderData.address.ward}, ${orderData.address.district}, ${orderData.address.province}`,
    items: orderData.items.map((item: any) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    })),
    total: orderData.total,
    discount: orderData.discount,
    voucherCode: orderData.voucherCode,
    status: 'pending',
    pointsEarned,
    pointsClaimed: false,
    orderDate: orderData.orderDate
  };
  
  orders.unshift(orderHistoryItem);
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
  
  return orderHistoryItem;
};

export const getOrderHistory = (): OrderHistoryItem[] => {
  try {
    const orders = localStorage.getItem(ORDER_HISTORY_KEY);
    const parsedOrders = orders ? JSON.parse(orders) : [];
    
    // Xử lý tương thích với đơn hàng cũ (chưa có trường pointsClaimed)
    return parsedOrders.map((order: any) => ({
      ...order,
      pointsClaimed: order.pointsClaimed !== undefined ? order.pointsClaimed : 
        // Nếu đơn hàng đã hoàn thành và chưa có pointsClaimed, coi như đã cộng điểm
        (order.status === 'completed' ? true : false)
    }));
  } catch (error) {
    console.error('Error getting order history:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderHistoryItem['status']): Promise<void> => {
  try {
    // Update via API
    const response = await apiService.updateOrderStatus(orderId, status);
    
    if (response.success) {
      // Update localStorage
      const orders = getOrderHistory();
      const orderIndex = orders.findIndex(order => order.orderId === orderId);
      
      if (orderIndex !== -1) {
        const order = orders[orderIndex];
        order.status = status;
        
        // Chỉ cộng điểm khi đơn hàng hoàn thành và chưa được cộng điểm
        if (status === 'completed' && !order.pointsClaimed) {
          order.completedDate = new Date().toISOString();
          order.pointsClaimed = true; // Đánh dấu đã cộng điểm
          
          // Cộng điểm cho người dùng
          addPointsToUser(order.pointsEarned, order.orderId, order.voucherCode);
        }
        
        // Nếu đơn hàng bị hủy và đã cộng điểm, trừ lại điểm
        if (status === 'cancelled' && order.pointsClaimed) {
          order.pointsClaimed = false; // Đánh dấu chưa cộng điểm
          
          // Trừ điểm từ tài khoản người dùng
          const currentPoints = getUserPoints();
          const newPoints = Math.max(0, currentPoints - order.pointsEarned); // Không để âm
          localStorage.setItem(USER_POINTS_KEY, newPoints.toString());
          
          // Thêm vào lịch sử điểm
          const pointsHistory = getPointsHistory();
          const pointsHistoryItem: PointsHistoryItem = {
            id: `points_${Date.now()}`,
            orderId,
            type: 'used',
            points: -order.pointsEarned,
            description: `Trừ điểm do hủy đơn hàng #${orderId}`,
            date: new Date().toISOString()
          };
          
          pointsHistory.unshift(pointsHistoryItem);
          localStorage.setItem(POINTS_HISTORY_KEY, JSON.stringify(pointsHistory));
        }
        
        localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
      }
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    // Fallback to localStorage only
    updateOrderStatusInLocalStorage(orderId, status);
  }
};

// Fallback function for localStorage only
const updateOrderStatusInLocalStorage = (orderId: string, status: OrderHistoryItem['status']): void => {
  const orders = getOrderHistory();
  const orderIndex = orders.findIndex(order => order.orderId === orderId);
  
  if (orderIndex !== -1) {
    const order = orders[orderIndex];
    order.status = status;
    
    // Chỉ cộng điểm khi đơn hàng hoàn thành và chưa được cộng điểm
    if (status === 'completed' && !order.pointsClaimed) {
      order.completedDate = new Date().toISOString();
      order.pointsClaimed = true; // Đánh dấu đã cộng điểm
      
      // Cộng điểm cho người dùng
      addPointsToUser(order.pointsEarned, order.orderId, order.voucherCode);
    }
    
    // Nếu đơn hàng bị hủy và đã cộng điểm, trừ lại điểm
    if (status === 'cancelled' && order.pointsClaimed) {
      order.pointsClaimed = false; // Đánh dấu chưa cộng điểm
      
      // Trừ điểm từ tài khoản người dùng
      const currentPoints = getUserPoints();
      const newPoints = Math.max(0, currentPoints - order.pointsEarned); // Không để âm
      localStorage.setItem(USER_POINTS_KEY, newPoints.toString());
      
      // Thêm vào lịch sử điểm
      const pointsHistory = getPointsHistory();
      const pointsHistoryItem: PointsHistoryItem = {
        id: `points_${Date.now()}`,
        orderId,
        type: 'used',
        points: -order.pointsEarned,
        description: `Trừ điểm do hủy đơn hàng #${orderId}`,
        date: new Date().toISOString()
      };
      
      pointsHistory.unshift(pointsHistoryItem);
      localStorage.setItem(POINTS_HISTORY_KEY, JSON.stringify(pointsHistory));
    }
    
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
  }
};

// Points Management
export const addPointsToUser = (points: number, orderId: string, voucherCode?: string): void => {
  // Add points to total
  const currentPoints = getUserPoints();
  const newTotal = currentPoints + points;
  localStorage.setItem(USER_POINTS_KEY, newTotal.toString());
  
  // Add to points history
  const pointsHistory = getPointsHistory();
  const pointsHistoryItem: PointsHistoryItem = {
    id: `points_${Date.now()}`,
    orderId,
    type: 'earned',
    points,
    description: voucherCode 
      ? `Tích điểm từ đơn hàng #${orderId} (sau giảm giá)`
      : `Tích điểm từ đơn hàng #${orderId}`,
    date: new Date().toISOString()
  };
  
  pointsHistory.unshift(pointsHistoryItem);
  localStorage.setItem(POINTS_HISTORY_KEY, JSON.stringify(pointsHistory));
};

export const usePoints = (points: number, description: string): boolean => {
  const currentPoints = getUserPoints();
  
  if (currentPoints < points) {
    return false; // Not enough points
  }
  
  const newTotal = currentPoints - points;
  localStorage.setItem(USER_POINTS_KEY, newTotal.toString());
  
  // Add to points history
  const pointsHistory = getPointsHistory();
  const pointsHistoryItem: PointsHistoryItem = {
    id: `points_${Date.now()}`,
    type: 'used',
    points: -points,
    description,
    date: new Date().toISOString()
  };
  
  pointsHistory.unshift(pointsHistoryItem);
  localStorage.setItem(POINTS_HISTORY_KEY, JSON.stringify(pointsHistory));
  
  return true;
};

export const getUserPoints = (): number => {
  try {
    const points = localStorage.getItem(USER_POINTS_KEY);
    return points ? parseInt(points, 10) : 0;
  } catch (error) {
    console.error('Error getting user points:', error);
    return 0;
  }
};

export const getPointsHistory = (): PointsHistoryItem[] => {
  try {
    const history = localStorage.getItem(POINTS_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting points history:', error);
    return [];
  }
};

// Format functions
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusText = (status: OrderHistoryItem['status']): string => {
  const statusMap = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'preparing': 'Đang chuẩn bị',
    'delivering': 'Đang giao hàng',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status];
};

export const getStatusColor = (status: OrderHistoryItem['status']): string => {
  const colorMap = {
    'pending': 'text-yellow-600',
    'confirmed': 'text-blue-600',
    'preparing': 'text-purple-600',
    'delivering': 'text-orange-600',
    'completed': 'text-green-600',
    'cancelled': 'text-red-600'
  };
  return colorMap[status];
};
