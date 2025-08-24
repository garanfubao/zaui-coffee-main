import React from "react";
import { Page, Text, Box } from "zmp-ui";
import { getOrderHistory, getStatusText, getStatusColor, formatVND, formatDate } from "../services/orderHistory";
import Header from "../components/Header";
import IconImage from "../components/IconImage";

const OrdersPage: React.FC = () => {
  const orders = getOrderHistory();

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title="Đơn hàng của tôi" showBack />
      
      {/* Content with top padding for header */}
              <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
        <div className="p-4">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <Box className="mb-4">
                <span style={{ fontSize: '48px' }}>📦</span>
              </Box>
              <Text className="text-gray-500 mb-4">Chưa có đơn hàng nào</Text>
              <Text className="text-sm text-gray-400">
                Hãy đặt hàng để xem lịch sử đơn hàng tại đây
              </Text>
            </div>
          ) : (
            <>
              <Text className="font-bold text-lg mb-4">
                Lịch sử đơn hàng ({orders.length})
              </Text>
              
              {orders.map((order) => (
                <div key={order.id} className="fkt-card mb-4">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Text className="font-bold text-lg">#{order.orderId}</Text>
                      <Text className="text-sm text-gray-500">
                        {formatDate(order.orderDate)}
                      </Text>
                    </div>
                    <div className="text-right">
                      <span 
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <Text className="font-medium mb-1">Thông tin giao hàng:</Text>
                    <Text className="text-sm text-gray-600 mb-1">
                      {order.customerName} - {order.customerPhone}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {order.address}
                    </Text>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <Text className="font-medium mb-2">Sản phẩm:</Text>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center mb-1">
                        <Text className="text-sm">
                          {item.name} x{item.quantity}
                        </Text>
                        <Text className="text-sm font-medium">
                          {formatVND(item.price * item.quantity)}
                        </Text>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-center mb-1">
                      <Text className="text-sm">Tạm tính:</Text>
                      <Text className="text-sm">
                        {formatVND(order.total + order.discount)}
                      </Text>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between items-center mb-1">
                        <Text className="text-sm">Giảm giá:</Text>
                        <Text className="text-sm text-green-600">
                          -{formatVND(order.discount)}
                        </Text>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <Text className="font-bold">Tổng cộng:</Text>
                      <Text className="font-bold text-lg fkt-price">
                        {formatVND(order.total)}
                      </Text>
                    </div>
                    
                                         {order.pointsEarned > 0 && (
                       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                                                   <Text className="text-sm text-yellow-800 flex items-center">
                            <IconImage 
                              src="/static/icons-optimized/chucmung_icon.webp" 
                              alt="Chúc mừng"
                              fallbackIcon="🎉"
                              style={{ width: '16px', height: '16px', marginRight: '6px' }}
                              webpSupport={true}
                            />
                            {order.status === 'completed' ? (
                              <>Đã tích lũy {order.pointsEarned}<IconImage 
                                src="/static/icons-optimized/points-icon.webp" 
                                alt="Điểm"
                                fallbackIcon="⭐"
                                style={{ width: '12px', height: '12px', marginLeft: '2px', marginRight: '2px' }}
                                webpSupport={true}
                              /></>
                            ) : (
                              <>Sẽ nhận {order.pointsEarned}<IconImage 
                                src="/static/icons-optimized/points-icon.webp" 
                                alt="Điểm"
                                fallbackIcon="⭐"
                                style={{ width: '12px', height: '12px', marginLeft: '2px', marginRight: '2px' }}
                                webpSupport={true}
                              />khi hoàn thành</>
                            )}
                          </Text>
                       </div>
                     )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Page>
  );
};

export default OrdersPage;
