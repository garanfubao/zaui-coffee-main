import React, { useState } from "react";
import { Page, Text, Button, Box, Icon, Modal } from "zmp-ui";
import { useCart } from "../hooks/useCart";
import { useRecoilValue } from "recoil";
import { cartTotalSelector } from "../state/index";
import { formatVND } from "../utils/price";
import { useNavigate } from "zmp-ui";
import { useVoucher } from "../hooks/useVoucher";
import Header from "../components/Header";

const CartPage: React.FC = () => {
  const { cart, changeQty, remove } = useCart();
  const total = useRecoilValue(cartTotalSelector);
  const navigate = useNavigate();
  const cartLength = cart?.length || 0;
  const { applyVoucher, appliedVoucher, removeVoucher, getDiscountAmount } = useVoucher();
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses] = useState<any[]>([]); // Mock addresses state
  
  const discount = getDiscountAmount(total);
  const finalTotal = total - discount;

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title="Giỏ hàng" showBack showClose />
      
      {/* Content with top padding for header */}
      <div style={{ paddingTop: '120px' }}>
        <div className="p-4">
        {cartLength === 0 ? (
          <Box className="text-center py-20">
            <Box className="mb-4">
              <span style={{ fontSize: '48px' }}>🛒</span>
            </Box>
            <Text className="text-gray-500 mb-4">Giỏ hàng trống</Text>
            <Button 
              className="fkt-checkout-button"
              onClick={() => navigate('/')}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        ) : (
          <>
                         {cart.map((item) => (
               <div key={`${item.product.id}-${item.quantity}`} className="fkt-cart-item">
                 <img 
                   src={item.product.image} 
                   alt={item.product.name}
                   className="fkt-cart-image"
                 />
                 <div className="fkt-cart-info">
                   <Text className="fkt-cart-name">{item.product.name}</Text>
                   <Text className="fkt-cart-price">{formatVND(item.product.price)}</Text>
                 </div>
                 <div className="fkt-quantity-controls">
                   <button 
                     className="fkt-qty-button"
                     onClick={() => changeQty(item.product.id, item.quantity - 1)}
                     disabled={item.quantity <= 1}
                   >
                     -
                   </button>
                   <Text className="fkt-qty-display">{item.quantity}</Text>
                   <button 
                     className="fkt-qty-button"
                     onClick={() => changeQty(item.product.id, item.quantity + 1)}
                   >
                     +
                   </button>
                   <button 
                     className="fkt-qty-button"
                     onClick={() => remove(item.product.id)}
                     style={{ marginLeft: '8px', color: '#E74C3C' }}
                   >
                     <Icon icon="zi-delete" />
                   </button>
                 </div>
               </div>
             ))}



            {/* Address Section */}
            <div className="fkt-card mt-4">
              <Box className="mb-4">
                <Text className="font-bold mb-2">Bạn chưa có địa chỉ</Text>
                <Text className="text-gray-500 text-sm mb-3">
                  Vui lòng thêm địa chỉ để giao hàng
                </Text>
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={() => navigate('/address/new')}
                >
                  Thêm
                </Button>
              </Box>
            </div>

            {/* Selected Products Summary */}
            <div className="fkt-card mt-4">
              <Text className="font-bold mb-4">Sản phẩm đã chọn ({cartLength})</Text>
              {cart.map((item) => (
                <Box key={item.product.id} className="flex justify-between items-center mb-2">
                  <Box className="flex items-center">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg mr-3"
                    />
                    <Box>
                      <Text className="font-medium">{item.product.name}</Text>
                      <Text className="text-gray-500 text-sm">Default Title</Text>
                    </Box>
                  </Box>
                  <Box className="text-right">
                    <Text className="text-sm text-gray-500">{item.quantity}x</Text>
                    <Text className="font-bold fkt-price">
                      {formatVND(item.product.price * item.quantity)}
                    </Text>
                  </Box>
                </Box>
              ))}
            </div>

            {/* Voucher Section */}
            <div className="fkt-card mt-4">
              <Text className="font-bold mb-3">Mã giảm giá</Text>
              
              {appliedVoucher && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <Text className="font-medium text-green-800">{appliedVoucher.title}</Text>
                      <Text className="text-sm text-green-600">Giảm {formatVND(discount)}</Text>
                    </div>
                    <Button 
                      size="small" 
                      variant="tertiary"
                      onClick={removeVoucher}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              )}
              
              {!appliedVoucher && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Nhập mã ưu đãi..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <Button 
                    size="small" 
                    className="fkt-checkout-button"
                    onClick={() => {
                      const result = applyVoucher(voucherCode, total);
                      setVoucherMessage(result.message);
                      if (result.success) {
                        setVoucherCode("");
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
                <Text className="text-sm text-gray-600">Xem tất cả voucher</Text>
                <Button 
                  size="small" 
                  variant="secondary"
                  onClick={() => navigate('/coupons')}
                >
                  Xem tất cả
                </Button>
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
                 onClick={() => {
                   // Check if user has address
                   if (addresses.length === 0) {
                     setShowAddressModal(true);
                   } else {
                     navigate('/checkout');
                   }
                 }}
               >
                 Thanh toán
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
             Vui lòng thêm địa chỉ giao hàng để tiếp tục thanh toán.
           </Text>
         </Modal>
         </div>
       </div>
     </Page>
   );
};

export default CartPage;