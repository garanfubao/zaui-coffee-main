import React, { useState, useEffect } from "react";
import { Page, Text, Button, Box, Icon, Modal } from "zmp-ui";
import { useCart } from "../hooks/useCart";
import { useRecoilValue } from "recoil";
import { cartTotalSelector } from "../state/index";
import { formatVND } from "../utils/price";
import { useNavigate, useLocation } from "zmp-ui";
import { useVoucher } from "../hooks/useVoucher";
import { validateVoucher } from "../services/voucher";
import { useAddress } from "../hooks/useAddress";
import Header from "../components/Header";
import { sendOrderToZaloOA } from "../services/order";
import { saveOrder } from "../services/orderHistory";
import { DisplaySelectedOptions } from "../components/display/selected-options";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";
import type { SelectedOptions } from "../types/cart";
import { calcFinalPrice } from "../utils/product";
import IconImage from "../components/IconImage";

const CartPage: React.FC = () => {
  const { cart, changeQty, remove } = useCart();
  const total = useRecoilValue(cartTotalSelector);
  const navigate = useNavigate();
  const location = useLocation();
  const cartLength = cart?.length || 0;
  const { applyVoucher, appliedVoucher, removeVoucher, getDiscountAmount, markVoucherAsUsed } = useVoucher();
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [adminVoucher, setAdminVoucher] = useState<any>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const { addresses, getSelectedAddress } = useAddress();
  
     // Load voucher from navigation state
   useEffect(() => {
     if (location.state?.voucherCode && total > 0) {
       setVoucherCode(location.state.voucherCode);
       // Auto-apply voucher from navigation
       const result = applyVoucher(location.state.voucherCode, total);
       setVoucherMessage(result.message);
       // Clear navigation state
       navigate(location.pathname, { replace: true });
     }
   }, [location.state, total, applyVoucher, navigate]);
  
  const discount = getDiscountAmount(total) + (adminVoucher?.discountAmount || 0);
  const finalTotal = total - discount;

  const handlePlaceOrder = async () => {
    // Check if user has address
    if (addresses.length === 0) {
      setShowAddressModal(true);
      return;
    }

    // Kiểm tra xem đã chọn địa chỉ chưa
    const selectedAddress = getSelectedAddress();
    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng");
      navigate('/addresses');
      return;
    }
    const orderId = `FKT${Date.now()}`;
    
    const orderData = {
      orderId,
      address: selectedAddress,
      items: cart,
      total: total, // Tổng tiền gốc trước khi giảm giá
      discount,
      voucherCode: appliedVoucher?.code || adminVoucher?.voucher?.code || null,
      orderDate: new Date().toISOString()
    };

    // Save order to history and update points
    const savedOrder = saveOrder(orderData);
    setOrderInfo({...orderData, pointsEarned: savedOrder.pointsEarned});
    setShowSuccessModal(true);

    // Mark voucher as used if applied
    if (appliedVoucher) {
      markVoucherAsUsed();
    }
    
    // Clear admin voucher after successful order
    if (adminVoucher) {
      setAdminVoucher(null);
    }

    // Clear cart after successful order
    cart.forEach(item => remove(item.uniqueId || ''));

    // Send order to Zalo OA
    try {
      await sendOrderToZaloOA(orderData);
    } catch (error) {
      console.error('Error sending order to Zalo OA:', error);
    }
  };

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title="Giỏ hàng" showBack />
      
      {/* Content with top padding for header */}
              <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
        <div className="p-4">
        {cartLength === 0 ? (
          <Box className="text-center py-20">
            <Box className="mb-4 flex justify-center">
              <IconImage 
                src="/static/icons-optimized/order-icon.webp" 
                alt="Giỏ hàng trống"
                fallbackIcon="🛒"
                style={{ width: '100px', height: '100px' }}
              />
            </Box>
            <Text className="text-gray-500 mb-4">Ơ hình như bạn quên chưa chọn món</Text>
            <Button 
              className="fkt-checkout-button"
              onClick={() => navigate('/')}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        ) : (
          <>
                         {cart.map((item, index) => (
               <div key={item.uniqueId || `cart-item-${item.product.id}-${index}`} className="fkt-cart-item">
                 <img 
                   src={item.product.image} 
                   alt={item.product.name}
                   className="fkt-cart-image"
                 />
                 <div className="fkt-cart-info">
                   <Text className="fkt-cart-name">{item.product.name}</Text>
                   <Text className="fkt-cart-price">{formatVND(calcFinalPrice(item.product as Product, item.options))}</Text>
                 </div>
                 <div className="fkt-quantity-controls">
                   <button 
                     className="fkt-qty-button"
                     onClick={() => changeQty(item.uniqueId || '', item.quantity - 1)}
                     disabled={item.quantity <= 1}
                   >
                     -
                   </button>
                   <Text className="fkt-qty-display">{item.quantity}</Text>
                   <button 
                     className="fkt-qty-button"
                     onClick={() => changeQty(item.uniqueId || '', item.quantity + 1)}
                   >
                     +
                   </button>
                   <button 
                     className="fkt-qty-button delete"
                     onClick={() => remove(item.uniqueId || '')}
                   >
                     <Icon icon="zi-delete" />
                   </button>
                 </div>
               </div>
             ))}



            {/* Address Section */}
            <div className="fkt-card mt-4">
              <Text className="font-bold mb-3">Địa chỉ giao hàng</Text>
              {addresses.length === 0 ? (
                <Box>
                  <Text className="text-gray-500 text-sm mb-3">
                    Vui lòng thêm địa chỉ để giao hàng
                  </Text>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => navigate('/address/new')}
                  >
                    Thêm địa chỉ
                  </Button>
                </Box>
              ) : (
                <Box>
                  {(() => {
                    const selectedAddress = getSelectedAddress();
                    if (selectedAddress) {
                      return (
                        <div>
                          <div className="border border-gray-200 rounded-lg p-3 mb-3">
                            <Text className="font-medium mb-1">{selectedAddress.fullname} - {selectedAddress.phone}</Text>
                            <Text className="text-sm text-gray-600">
                              {selectedAddress.detail}
                              {selectedAddress.ward && `, ${selectedAddress.ward}`}
                              {selectedAddress.district && `, ${selectedAddress.district}`}
                              {selectedAddress.province && `, ${selectedAddress.province}`}
                            </Text>
                          </div>
                          <Button 
                            variant="secondary" 
                            size="small"
                            onClick={() => navigate('/addresses')}
                          >
                            Thay đổi địa chỉ
                          </Button>
                        </div>
                      );
                    } else {
                      return (
                        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3">
                          <Text className="text-yellow-800 text-sm mb-2">
                            Vui lòng chọn địa chỉ giao hàng
                          </Text>
                          <Button 
                            variant="secondary" 
                            size="small"
                            onClick={() => navigate('/addresses')}
                          >
                            Chọn địa chỉ
                          </Button>
                        </div>
                      );
                    }
                  })()}
                </Box>
              )}
            </div>

            {/* Selected Products Summary */}
            <div className="fkt-card mt-4">
              <Text className="font-bold mb-4">Sản phẩm đã chọn ({cartLength})</Text>
              {cart.map((item) => (
                <Box key={item.product.id} className="flex justify-between items-center mb-2">
                  <Box className="flex items-center flex-1 min-w-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg mr-3 flex-shrink-0"
                    />
                    <Box className="flex-1 min-w-0">
                      <Text className="font-medium truncate">{item.product.name}</Text>
                      <Text className="text-gray-500 text-sm">
                        {item.options && Object.keys(item.options).length > 0 ? (
                          <DisplaySelectedOptions options={item.options}>
                            {item.product as Product}
                          </DisplaySelectedOptions>
                        ) : (
                          "Mặc định"
                        )}
                      </Text>
                    </Box>
                  </Box>
                  <Box className="text-right flex-shrink-0 ml-2">
                    <Text className="text-sm text-gray-500">{item.quantity}x</Text>
                    <Text className="font-bold fkt-price">
                      {formatVND(calcFinalPrice(item.product as Product, item.options) * item.quantity)}
                    </Text>
                  </Box>
                </Box>
              ))}
            </div>

            {/* Voucher Section */}
            <div className="fkt-card mt-4">
              <Text className="font-bold mb-3">Mã giảm giá</Text>
              
              {appliedVoucher && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Text className="font-medium text-yellow-800 mb-1">{appliedVoucher.title}</Text>
                      <Text className="text-sm text-yellow-700 mb-1">{appliedVoucher.description}</Text>
                      <Text className="text-sm text-yellow-600">Giảm {formatVND(getDiscountAmount(total))}</Text>
                      {appliedVoucher.expiresAt && (
                        <Text className="text-xs text-yellow-500 mt-1">
                          Hạn sử dụng: {new Date(appliedVoucher.expiresAt).toLocaleDateString('vi-VN')}
                        </Text>
                      )}
                    </div>
                    <Button 
                      size="small" 
                      variant="tertiary"
                      onClick={() => {
                        removeVoucher();
                        setAdminVoucher(null);
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              )}

              {adminVoucher && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Text className="font-medium text-blue-800 mb-1">Voucher: {adminVoucher.voucher.code}</Text>
                      <Text className="text-sm text-blue-700 mb-1">Giảm {adminVoucher.voucher.discountPercent}% - Tối đa {formatVND(adminVoucher.voucher.maxDiscountAmount)}</Text>
                      <Text className="text-sm text-blue-600">Giảm {formatVND(adminVoucher.discountAmount)}</Text>
                      <Text className="text-xs text-blue-500 mt-1">
                        Hạn sử dụng: {new Date(adminVoucher.voucher.expiryDate).toLocaleDateString('vi-VN')}
                      </Text>
                    </div>
                    <Button 
                      size="small" 
                      variant="tertiary"
                      onClick={() => {
                        setAdminVoucher(null);
                        setVoucherMessage("");
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              )}
              
              {!appliedVoucher && !adminVoucher && (
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    placeholder="Nhập mã ưu đãi..."
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <Button 
                    size="small" 
                    className="fkt-apply-button w-full"
                    onClick={() => {
                      // First try to apply regular voucher
                      const result = applyVoucher(voucherCode, total);
                      if (result.success) {
                        setVoucherMessage(result.message);
                        setVoucherCode("");
                        setAdminVoucher(null);
                      } else {
                        // Try to apply admin voucher
                        const adminResult = validateVoucher(voucherCode, total);
                        if (adminResult.isValid) {
                          setAdminVoucher(adminResult);
                          setVoucherMessage(adminResult.message);
                          setVoucherCode("");
                        } else {
                          setVoucherMessage(adminResult.message);
                        }
                      }
                    }}
                  >
                    Áp dụng
                  </Button>
                </div>
              )}
              
              {voucherMessage && (
                <Text className={`text-sm mb-3 ${voucherMessage.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
                  {voucherMessage}
                </Text>
              )}
              
              <div className="flex justify-between items-center">
                <Text className="text-sm text-gray-600">Quản lý voucher</Text>
                <div className="flex gap-2">
                  <Button 
                    size="small" 
                    variant="secondary"
                    onClick={() => navigate('/rewards')}
                  >
                    Đổi thưởng
                  </Button>
                  <Button 
                    size="small" 
                    variant="secondary"
                    onClick={() => navigate('/coupons')}
                  >
                    Voucher của tôi
                  </Button>
                </div>
              </div>
            </div>

            {/* Note Section */}
            <div className="fkt-card mt-4">
              <Text className="font-bold mb-3">Ghi chú</Text>
              <textarea 
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                rows={3}
                placeholder="Lưu ý cho người bán..."
              />
            </div>

            {/* Total and Checkout */}
            <div className="fkt-card mt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <Text>Tạm tính:</Text>
                  <Text>{formatVND(total)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Phí vận chuyển:</Text>
                  <Text>0đ</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Giảm giá:</Text>
                  <Text className="text-red-500">-{formatVND(discount)}</Text>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <Text className="font-bold text-lg">Thành tiền</Text>
                    <Text className="font-bold text-xl fkt-price">
                      {formatVND(finalTotal)}
                    </Text>
                  </div>
                </div>
              </div>
                             <Button 
                 className="fkt-checkout-button"
                 onClick={handlePlaceOrder}
               >
                 Đặt hàng
               </Button>
            </div>
          </>
                 )}

         {/* Address Required Modal */}
         <Modal
           visible={showAddressModal}
           title="Yêu cầu địa chỉ"
           onClose={() => setShowAddressModal(false)}
           actions={[
             {
               text: "Thêm địa chỉ",
               onClick: () => {
                 setShowAddressModal(false);
                 navigate('/address/new');
               },
               highLight: true,
             },
             {
               text: "Đóng",
               onClick: () => setShowAddressModal(false),
             },
           ]}
         >
           <Text>
             Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng.
           </Text>
         </Modal>

         {/* Order Success Modal */}
         <Modal
           visible={showSuccessModal}
           title="Đã đặt hàng thành công!"
           onClose={() => {
             setShowSuccessModal(false);
             navigate('/');
           }}
           actions={[
             {
               text: "Về trang chủ",
               onClick: () => {
                 setShowSuccessModal(false);
                 navigate('/');
               },
               highLight: true,
             },
           ]}
         >
           {orderInfo && (
             <Box className="space-y-4">
               <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                 <Text className="font-bold text-yellow-800 mb-2">
                   Mã đơn hàng: {orderInfo.orderId}
                 </Text>
                 <Text className="text-yellow-700 text-sm">
                   Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm nhất.
                 </Text>
               </Box>
               
               <Box>
                 <Text className="font-bold mb-2">Thông tin giao hàng:</Text>
                 <Text className="text-sm text-gray-600 mb-1">
                   {orderInfo.address.fullname} - {orderInfo.address.phone}
                 </Text>
                 <Text className="text-sm text-gray-600">
                   {orderInfo.address.detail}, {orderInfo.address.ward}, {orderInfo.address.district}, {orderInfo.address.province}
                 </Text>
               </Box>
               
               <Box>
                 <Text className="font-bold mb-2">Sản phẩm đã đặt:</Text>
                 {orderInfo.items.map((item: any, index: number) => (
                   <Box key={index} className="flex justify-between items-center mb-1">
                     <Text className="text-sm">
                       {item.product.name} x{item.quantity}
                     </Text>
                     <Text className="text-sm font-medium">
                       {formatVND(calcFinalPrice(item.product as Product, item.options) * item.quantity)}
                     </Text>
                   </Box>
                 ))}
               </Box>
               
                               <Box className="border-t pt-3">
                  <Box className="flex justify-between items-center">
                    <Text className="font-bold">Tổng cộng:</Text>
                    <Text className="font-bold text-lg fkt-price">
                      {formatVND(orderInfo.total - orderInfo.discount)}
                    </Text>
                  </Box>
                  {orderInfo.discount > 0 && (
                    <Text className="text-sm text-yellow-600">
                      Đã giảm: {formatVND(orderInfo.discount)}
                    </Text>
                  )}
                  {orderInfo.pointsEarned && (
                    <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2">
                      <Text className="text-sm text-yellow-800 flex items-center">
                        <IconImage 
                          src="/static/icons-optimized/chucmung_icon.webp" 
                          alt="Chúc mừng"
                          fallbackIcon="🎉"
                          style={{ width: '24px', height: '24px', marginRight: '6px' }}
                          webpSupport={true}
                        />
                        Bạn sẽ nhận được {orderInfo.pointsEarned}<IconImage 
                          src="/static/icons-optimized/points-icon.webp" 
                          alt="Điểm"
                          fallbackIcon="⭐"
                          style={{ width: '18px', height: '18px', marginLeft: '2px', marginRight: '2px' }}
                          webpSupport={true}
                        />khi đơn hàng hoàn thành!
                      </Text>
                    </Box>
                  )}
                </Box>
             </Box>
           )}
         </Modal>
         </div>
       </div>
     </Page>
   );
};

export default CartPage;