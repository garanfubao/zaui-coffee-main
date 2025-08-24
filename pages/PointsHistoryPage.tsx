import React, { useState } from "react";
import { Page, Text, Box, Modal } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { pointsState } from "../state/index";
import { getUserPoints, getPointsHistory, getOrderHistory, formatDate, formatVND } from "../services/orderHistory";
import Header from "../components/Header";
import IconImage from "../components/IconImage";

interface PointsTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  date: string;
  orderId?: string;
}

const PointsHistoryPage: React.FC = () => {
  const userPoints = getUserPoints();
  const pointsHistory = getPointsHistory();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleViewOrder = (orderId: string) => {
    // Tìm thông tin đơn hàng từ lịch sử
    const order = getOrderHistory().find((o: any) => o.orderId === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowOrderModal(true);
    }
  };

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title="Lịch sử tích điểm" showBack />
      
      {/* Content with top padding for header */}
              <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
        <div className="p-4">
        {/* Points Summary */}
        <div className="fkt-card text-center mb-6">
          <Text className="text-2xl font-bold mb-2">Điểm tích lũy hiện tại</Text>
          <div className="flex items-center justify-center mb-4">
            <Text className="text-4xl font-bold text-[#E0A000] mr-2">{userPoints.toLocaleString()}</Text>
            <IconImage 
              src="/static/icons-optimized/points-icon.webp" 
              alt="Điểm"
              fallbackIcon="⭐"
              style={{ width: '32px', height: '32px' }}
            />
          </div>
          <Text className="text-gray-600">
            Tích điểm tự động 1% giá trị đơn hàng
          </Text>
        </div>

        {/* Points Rules */}
        <div className="fkt-card mb-6">
          <Text className="font-bold text-lg mb-3">Quy tắc tích điểm</Text>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <Text>Tích điểm tự động 1% giá trị đơn hàng</Text>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <Text>Điểm có thể dùng để đổi thưởng</Text>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <Text>Điểm không có hạn sử dụng</Text>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <Text className="font-bold text-lg mb-4">Lịch sử giao dịch</Text>
        
        {pointsHistory.map((transaction) => (
          <div key={transaction.id} className="fkt-card mb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Text className="font-medium mb-1">{transaction.description}</Text>
                <Text className="text-sm text-gray-500">{formatDate(transaction.date)}</Text>
                                 {transaction.orderId && (
                   <Text 
                     className="text-xs text-[#E0A000] cursor-pointer hover:underline"
                     onClick={() => handleViewOrder(transaction.orderId!)}
                   >
                     Xem đơn hàng
                   </Text>
                 )}
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end">
                                     <Text 
                     className={`text-lg font-bold ${
                       transaction.type === 'earned' ? 'text-green-500' : 'text-red-500'
                     }`}
                   >
                     {transaction.type === 'earned' ? '+' : '-'}{Math.abs(transaction.points).toLocaleString()}
                   </Text>
                  <IconImage 
                    src="/static/icons-optimized/points-icon.webp" 
                    alt="Điểm"
                    fallbackIcon="⭐"
                    style={{ width: '16px', height: '16px', marginLeft: '4px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {pointsHistory.length === 0 && (
          <div className="text-center py-8">
            <Text className="text-gray-500">Chưa có giao dịch nào</Text>
          </div>
        )}
                 </div>
       </div>

       {/* Order Success Modal */}
       <Modal
         visible={showOrderModal}
         title="Đặt hàng thành công!"
         onClose={() => {
           setShowOrderModal(false);
           setSelectedOrder(null);
         }}
                   actions={[
            {
              text: "Đóng",
              onClick: () => {
                setShowOrderModal(false);
                setSelectedOrder(null);
              },
              highLight: true,
            },
          ]}
       >
         {selectedOrder && (
           <Box className="space-y-4">
             <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
               <Text className="font-bold text-yellow-800 mb-2">
                 Đơn hàng #{selectedOrder.orderId}
               </Text>
               <Text className="text-yellow-700 text-sm mb-2">
                 Khách hàng: {selectedOrder.customerName}
               </Text>
               <Text className="text-yellow-700 text-sm mb-2">
                 Số điện thoại: {selectedOrder.customerPhone}
               </Text>
               <Text className="text-yellow-700 text-sm">
                 Địa chỉ: {selectedOrder.address}
               </Text>
             </Box>
             
                           <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <Text className="font-bold text-yellow-800 mb-2">Chi tiết đơn hàng:</Text>
                {selectedOrder.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center mb-1">
                    <Text className="text-yellow-700 text-sm">
                      {item.name} x{item.quantity}
                    </Text>
                    <Text className="text-yellow-700 text-sm font-medium">
                      {formatVND(item.price * item.quantity)}
                    </Text>
                  </div>
                ))}
                <div className="border-t border-yellow-200 mt-2 pt-2">
                  <div className="flex justify-between items-center">
                    <Text className="text-yellow-800 font-bold">Tổng tiền:</Text>
                    <Text className="text-yellow-800 font-bold">
                      {formatVND(selectedOrder.total)}
                    </Text>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between items-center mt-1">
                      <Text className="text-yellow-700 text-sm">Giảm giá:</Text>
                      <Text className="text-yellow-700 text-sm">
                        -{formatVND(selectedOrder.discount)}
                      </Text>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <Text className="text-yellow-800 font-bold">Thành tiền:</Text>
                    <Text className="text-yellow-800 font-bold">
                      {formatVND(selectedOrder.total - selectedOrder.discount)}
                    </Text>
                  </div>
                </div>
              </Box>
             
                           <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <Text className="font-bold text-yellow-800 mb-2">Điểm tích lũy:</Text>
                <div className="flex items-center">
                  <Text className="text-yellow-700 text-lg font-bold mr-2">
                    +{selectedOrder.pointsEarned.toLocaleString()}
                  </Text>
                  <IconImage 
                    src="/static/icons-optimized/points-icon.webp" 
                    alt="Điểm"
                    fallbackIcon="⭐"
                    style={{ width: '16px', height: '16px' }}
                  />
                  <Text className="text-yellow-700 text-sm ml-2">
                    {selectedOrder.status === 'completed' ? '(Đã nhận)' : '(Sẽ nhận khi hoàn thành)'}
                  </Text>
                </div>
              </Box>
           </Box>
         )}
       </Modal>
     </Page>
   );
 };

export default PointsHistoryPage;
