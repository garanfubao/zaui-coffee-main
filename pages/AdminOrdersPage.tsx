import React, { useState } from "react";
import { Page, Text, Box, Button, Select, Modal } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import Header from "../components/Header";
import { getOrderHistory, updateOrderStatus, formatDate, getStatusText, getStatusColor, OrderHistoryItem } from "../services/orderHistory";
import { formatVND } from "../utils/price";

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(getOrderHistory());
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderHistoryItem['status']>('pending');

  const handleStatusChange = (orderId: string, newStatus: OrderHistoryItem['status']) => {
    console.log('Changing status for order:', orderId, 'to:', newStatus);
    updateOrderStatus(orderId, newStatus);
    setOrders(getOrderHistory()); // Refresh orders list
    setShowStatusModal(false);
    setSelectedOrder(null);
  };

  const openStatusModal = (order: OrderHistoryItem) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
    console.log('Opening modal for order:', order.orderId, 'Current status:', order.status);
  };

  const filterOrders = (status?: OrderHistoryItem['status']) => {
    if (!status) return orders;
    return orders.filter(order => order.status === status);
  };

  const [filterStatus, setFilterStatus] = useState<OrderHistoryItem['status'] | ''>('');

  return (
    <Page>
      <Header title="Quản lý đơn hàng" showBack />
      <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
        <div className="p-4">
          <Box className="flex justify-between items-center mb-4">
            <Text className="font-bold text-lg">Quản lý đơn hàng ({orders.length})</Text>
            <Button 
              size="small" 
              variant="secondary"
              onClick={() => navigate('/admin/vouchers')}
            >
              Quản lý Voucher
            </Button>
          </Box>

          {/* Filter */}
          <Box className="mb-4">
            <Select
              placeholder="Lọc theo trạng thái"
              value={filterStatus}
              onChange={(value) => setFilterStatus(value as OrderHistoryItem['status'] | '')}
            >
              <Select.Option value="">Tất cả đơn hàng</Select.Option>
              <Select.Option value="pending">Chờ xác nhận</Select.Option>
              <Select.Option value="confirmed">Đã xác nhận</Select.Option>
              <Select.Option value="preparing">Đang chuẩn bị</Select.Option>
              <Select.Option value="delivering">Đang giao hàng</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
            </Select>
            {filterStatus && (
              <Text className="text-sm text-gray-600 mt-2">
                Đang lọc: <span className="font-medium">{getStatusText(filterStatus as OrderHistoryItem['status'])}</span>
              </Text>
            )}
          </Box>

          {filterOrders(filterStatus || undefined).length === 0 ? (
            <Box className="text-center py-20">
              <Box className="mb-4">
                <span style={{ fontSize: '48px' }}>📦</span>
              </Box>
              <Text className="text-gray-500 mb-4">
                {filterStatus ? `Không có đơn hàng nào ở trạng thái "${getStatusText(filterStatus as OrderHistoryItem['status'])}"` : 'Chưa có đơn hàng nào.'}
              </Text>
            </Box>
          ) : (
            <Box className="space-y-4">
              {filterOrders(filterStatus || undefined).map((order) => (
                <div key={order.id} className="fkt-card p-4">
                  <Box className="flex justify-between items-center mb-2">
                    <Text className="font-bold text-md">#{order.orderId}</Text>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </Box>
                  
                  <Text className="text-sm text-gray-500 mb-3">{formatDate(order.orderDate)}</Text>

                  <Text className="font-bold text-sm mb-1">Thông tin khách hàng:</Text>
                  <Text className="text-sm text-gray-600 mb-1">
                    {order.customerName} - {order.customerPhone}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-3">
                    {order.address}
                  </Text>

                  <Text className="font-bold text-sm mb-1">Sản phẩm:</Text>
                  {order.items.map((item, itemIndex) => (
                    <Box key={itemIndex} className="flex justify-between text-sm text-gray-700 mb-1">
                      <Text>{item.name} x{item.quantity}</Text>
                      <Text>{formatVND(item.price * item.quantity)}</Text>
                    </Box>
                  ))}

                  <Box className="border-t pt-3 mt-3 flex justify-between items-center">
                    <Text className="font-bold">Tổng cộng:</Text>
                    <Text className="font-bold text-lg fkt-price">
                      {formatVND(order.total)}
                    </Text>
                  </Box>

                  {order.pointsEarned > 0 && (
                    <Text className="text-sm text-green-600 mt-1">
                      🎉 Khách hàng tích lũy {order.pointsEarned} điểm
                    </Text>
                  )}

                  {/* Admin Actions */}
                  <Box className="mt-4 pt-3 border-t">
                    <Text className="font-bold text-sm mb-2">Thay đổi trạng thái:</Text>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => openStatusModal(order)}
                    >
                      Cập nhật trạng thái
                    </Button>
                  </Box>
                </div>
              ))}
            </Box>
          )}
        </div>
      </div>

      {/* Status Change Modal */}
      <Modal
        visible={showStatusModal}
        title="Thay đổi trạng thái đơn hàng"
        onClose={() => {
          setShowStatusModal(false);
          setSelectedOrder(null);
        }}
        actions={[
          {
            text: "Hủy",
            onClick: () => {
              setShowStatusModal(false);
              setSelectedOrder(null);
            },
          },
          {
            text: "Cập nhật",
            onClick: () => {
              if (selectedOrder) {
                handleStatusChange(selectedOrder.orderId, newStatus);
              }
            },
            highLight: true,
          },
        ]}
      >
        {selectedOrder && (
          <Box className="space-y-4">
            <Box>
              <Text className="font-bold mb-2">Đơn hàng: #{selectedOrder.orderId}</Text>
              <Text className="text-sm text-gray-600">
                Khách hàng: {selectedOrder.customerName}
              </Text>
            </Box>

            <Box>
              <Text className="font-bold mb-2">Trạng thái hiện tại:</Text>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                {getStatusText(selectedOrder.status)}
              </span>
            </Box>

            <Box>
              <Text className="font-bold mb-2">Chọn trạng thái mới:</Text>
              <Select
                placeholder="Chọn trạng thái"
                value={newStatus}
                onChange={(value) => setNewStatus(value as OrderHistoryItem['status'])}
              >
                <Select.Option value="pending">Chờ xác nhận</Select.Option>
                <Select.Option value="confirmed">Đã xác nhận</Select.Option>
                <Select.Option value="preparing">Đang chuẩn bị</Select.Option>
                <Select.Option value="delivering">Đang giao hàng</Select.Option>
                <Select.Option value="completed">Hoàn thành</Select.Option>
                <Select.Option value="cancelled">Đã hủy</Select.Option>
              </Select>
              {newStatus && (
                <Box className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Text className="text-sm text-yellow-800">
                    ✅ Đã chọn: <span className="font-medium">{getStatusText(newStatus)}</span>
                  </Text>
                </Box>
              )}
            </Box>

            <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <Text className="text-sm text-yellow-800">
                💡 <strong>Lưu ý:</strong> Thay đổi trạng thái sẽ được cập nhật ngay lập tức và khách hàng có thể xem trong trang "Đơn hàng của tôi".
              </Text>
            </Box>
          </Box>
        )}
      </Modal>
    </Page>
  );
};

export default AdminOrdersPage;
