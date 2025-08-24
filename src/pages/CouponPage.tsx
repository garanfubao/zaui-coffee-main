import React, { useState, useEffect } from "react";
import { Page, Text, Box, Button, Modal } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { formatVND } from "../utils/price";
import Header from "../components/Header";
import IconImage from "../components/IconImage";

interface UserVoucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
}

const CouponPage: React.FC = () => {
  const navigate = useNavigate();
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<UserVoucher | null>(null);

  // Load user vouchers from localStorage
  useEffect(() => {
    const vouchers = JSON.parse(localStorage.getItem('userVouchers') || '[]');
    setUserVouchers(vouchers);
  }, []);

  const handleUseVoucher = (voucher: UserVoucher) => {
    if (voucher.isUsed) {
      alert('Voucher này đã được sử dụng!');
      return;
    }

    const now = new Date();
    const expiryDate = new Date(voucher.expiresAt);
    if (now > expiryDate) {
      alert('Voucher này đã hết hạn!');
      return;
    }

    setSelectedVoucher(voucher);
    setShowVoucherModal(true);
  };

  const confirmUseVoucher = () => {
    if (!selectedVoucher) return;

    // Don't mark voucher as used here - only mark as used when order is placed
    // Navigate to cart with voucher code
    navigate('/cart', { 
      state: { 
        voucherCode: selectedVoucher.code,
        voucherData: selectedVoucher 
      } 
    });
    setShowVoucherModal(false);
    setSelectedVoucher(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const isExpired = (dateString: string) => {
    const now = new Date();
    const expiryDate = new Date(dateString);
    return now > expiryDate;
  };

  const getStatusText = (voucher: UserVoucher) => {
    if (voucher.isUsed) return 'Đã sử dụng';
    if (isExpired(voucher.expiresAt)) return 'Hết hạn';
    return 'Có thể sử dụng';
  };

  const getStatusColor = (voucher: UserVoucher) => {
    if (voucher.isUsed) return 'text-gray-500';
    if (isExpired(voucher.expiresAt)) return 'text-red-500';
    return 'text-green-600';
  };

  const availableVouchers = userVouchers.filter(v => !v.isUsed && !isExpired(v.expiresAt));
  const usedVouchers = userVouchers.filter(v => v.isUsed);
  const expiredVouchers = userVouchers.filter(v => !v.isUsed && isExpired(v.expiresAt));

  return (
    <Page>
      <Header title="Voucher & Coupon" showBack />
      
      <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
        <div className="p-4">
          {/* Available Vouchers */}
          {availableVouchers.length > 0 && (
            <div className="mb-6">
                             <Text className="text-lg font-bold mb-4">Voucher khả dụng ({availableVouchers.length})</Text>
              
              {availableVouchers.map((voucher) => (
                <div key={voucher.id} className="fkt-card mb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8">
                        <IconImage 
                          src="/static/icons-optimized/voucher-icon.webp" 
                          alt="Voucher"
                          fallbackIcon="🎫"
                          style={{ width: '24px', height: '24px' }}
                        />
                      </div>
                      <div className="flex-1">
                        <Text className="font-bold text-lg mb-1">{voucher.title}</Text>
                        <Text className="text-gray-600 text-sm mb-2">{voucher.description}</Text>
                                                 <div className="space-y-1 text-sm mb-2">
                           <div className="text-[#E0A000] font-medium">
                             Giảm tối đa: {formatVND(voucher.maxDiscount)}
                           </div>
                           <div className="text-green-600 font-medium">
                             {getStatusText(voucher)}
                           </div>
                         </div>
                        <Text className="text-xs text-gray-500">
                          Hạn sử dụng: {formatDate(voucher.expiresAt)}
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text className="text-lg font-bold text-[#E0A000] mb-2">
                        {voucher.discountPercent}%
                      </Text>
                      <Button 
                        size="small" 
                        className="fkt-apply-button"
                        onClick={() => handleUseVoucher(voucher)}
                      >
                        Sử dụng
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Used Vouchers */}
          {usedVouchers.length > 0 && (
            <div className="mb-6">
                             <Text className="text-lg font-bold mb-4">Voucher đã sử dụng ({usedVouchers.length})</Text>
              
              {usedVouchers.map((voucher) => (
                <div key={voucher.id} className="fkt-card mb-4 opacity-60">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                                             <div className="flex items-center justify-center w-8 h-8">
                         <IconImage 
                           src="/static/icons-optimized/used-voucher-icon.webp" 
                           alt="Voucher đã sử dụng"
                           fallbackIcon="✅"
                           style={{ width: '24px', height: '24px' }}
                         />
                       </div>
                      <div className="flex-1">
                        <Text className="font-bold text-lg mb-1">{voucher.title}</Text>
                        <Text className="text-gray-600 text-sm mb-2">{voucher.description}</Text>
                                                 <div className="space-y-1 text-sm mb-2">
                           <div className="text-gray-500">
                             Giảm tối đa: {formatVND(voucher.maxDiscount)}
                           </div>
                           <div className="text-gray-500">
                             {getStatusText(voucher)}
                           </div>
                         </div>
                        <Text className="text-xs text-gray-500">
                          Tạo ngày: {formatDate(voucher.createdAt)}
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text className="text-lg font-bold text-gray-400 mb-2">
                        {voucher.discountPercent}%
                      </Text>
                      <Button 
                        size="small" 
                        variant="secondary"
                        disabled
                      >
                        Đã sử dụng
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Expired Vouchers */}
          {expiredVouchers.length > 0 && (
            <div className="mb-6">
                             <Text className="text-lg font-bold mb-4">Voucher hết hạn ({expiredVouchers.length})</Text>
              
              {expiredVouchers.map((voucher) => (
                <div key={voucher.id} className="fkt-card mb-4 opacity-60">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8">
                        <IconImage 
                          src="/static/icons-optimized/voucher-icon.webp" 
                          alt="Voucher hết hạn"
                          fallbackIcon="⏰"
                          style={{ width: '24px', height: '24px' }}
                        />
                      </div>
                      <div className="flex-1">
                        <Text className="font-bold text-lg mb-1">{voucher.title}</Text>
                        <Text className="text-gray-600 text-sm mb-2">{voucher.description}</Text>
                                                 <div className="space-y-1 text-sm mb-2">
                           <div className="text-gray-500">
                             Giảm tối đa: {formatVND(voucher.maxDiscount)}
                           </div>
                           <div className="text-red-500">
                             {getStatusText(voucher)}
                           </div>
                         </div>
                        <Text className="text-xs text-gray-500">
                          Hết hạn: {formatDate(voucher.expiresAt)}
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text className="text-lg font-bold text-gray-400 mb-2">
                        {voucher.discountPercent}%
                      </Text>
                      <Button 
                        size="small" 
                        variant="secondary"
                        disabled
                      >
                        Hết hạn
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {userVouchers.length === 0 && (
            <div className="text-center py-20">
                             <div className="text-6xl mb-4"></div>
              <Text className="text-lg font-bold mb-2">Chưa có voucher nào</Text>
              <Text className="text-gray-500 mb-6">
                Hãy tích điểm và đổi voucher tại trang Đổi thưởng
              </Text>
              <Button 
                className="fkt-checkout-button"
                onClick={() => navigate('/rewards')}
              >
                Đi đến trang Đổi thưởng
              </Button>
            </div>
          )}

          {/* Info Section */}
          {userVouchers.length > 0 && (
            <div className="fkt-card mt-6">
                             <Text className="font-bold mb-3">Hướng dẫn sử dụng</Text>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Mỗi voucher chỉ được sử dụng 1 lần</div>
                <div>• Voucher có hiệu lực trong 30 ngày</div>
                <div>• Không thể kết hợp nhiều voucher trong 1 đơn hàng</div>
                <div>• Voucher sẽ được áp dụng tự động khi đặt hàng</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voucher Usage Modal */}
      <Modal
        visible={showVoucherModal}
        title="Sử dụng voucher"
        onClose={() => {
          setShowVoucherModal(false);
          setSelectedVoucher(null);
        }}
        actions={[
          {
            text: "Hủy",
            onClick: () => {
              setShowVoucherModal(false);
              setSelectedVoucher(null);
            },
          },
          {
            text: "Sử dụng ngay",
            onClick: confirmUseVoucher,
            highLight: true,
          },
        ]}
      >
        {selectedVoucher && (
          <Box className="space-y-4">
            <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <Text className="font-bold text-yellow-800 mb-2">
                {selectedVoucher.title}
              </Text>
              <Text className="text-yellow-700 text-sm mb-2">
                {selectedVoucher.description}
              </Text>
              <Text className="text-sm text-yellow-600">
                Giảm tối đa: {formatVND(selectedVoucher.maxDiscount)}
              </Text>
            </Box>
            
            <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <Text className="font-bold text-yellow-800 mb-2">Mã voucher:</Text>
              <Text className="text-xl font-mono font-bold text-yellow-600 text-center">
                {selectedVoucher.code}
              </Text>
            </Box>
            
            <Text className="text-sm text-gray-600 text-center">
              Bạn sẽ được chuyển đến giỏ hàng để áp dụng voucher này
            </Text>
          </Box>
        )}
      </Modal>
    </Page>
  );
};

export default CouponPage;
