import React, { useState } from "react";
import { Page, Box, Text, Button, Modal } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState } from "../state/index";
import { getUserPoints, usePoints } from "../services/orderHistory";
import { formatVND } from "../utils/price";
import Header from "../components/Header";
import IconImage from "../components/IconImage";

interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  discountPercent: number;
  maxDiscount: number;
  icon: string;
}

const RewardsPage: React.FC = () => {
  const user = useRecoilValue(userState);
  const [userPoints, setUserPoints] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<RewardItem | null>(null);
  const [voucherCode, setVoucherCode] = useState("");

  // Load user points
  React.useEffect(() => {
    const points = getUserPoints();
    setUserPoints(points);
  }, []);

  const rewardItems: RewardItem[] = [
    {
      id: "discount-20",
      title: "Giảm giá 20%",
      description: "Áp dụng cho toàn bộ đơn hàng",
      pointsRequired: 1000,
      discountPercent: 20,
      maxDiscount: 50000,
      icon: "/static/icons-optimized/voucher-icon.webp"
    },
    {
      id: "discount-15",
      title: "Giảm giá 15%",
      description: "Áp dụng cho toàn bộ đơn hàng",
      pointsRequired: 750,
      discountPercent: 15,
      maxDiscount: 40000,
      icon: "/static/icons-optimized/voucher-icon.webp"
    },
    {
      id: "discount-10",
      title: "Giảm giá 10%",
      description: "Áp dụng cho toàn bộ đơn hàng",
      pointsRequired: 500,
      discountPercent: 10,
      maxDiscount: 30000,
      icon: "/static/icons-optimized/voucher-icon.webp"
    },
    {
      id: "free-shipping",
      title: "Miễn phí vận chuyển",
      description: "Áp dụng cho đơn hàng từ 100k",
      pointsRequired: 300,
      discountPercent: 0,
      maxDiscount: 15000,
      icon: "/static/icons-optimized/voucher-icon.webp"
    }
  ];

  const handleRedeemReward = (reward: RewardItem) => {
    if (userPoints < reward.pointsRequired) {
      alert(`Bạn cần ${reward.pointsRequired} điểm để đổi voucher này!`);
      return;
    }

    // Generate voucher code
    const code = `FKT${Date.now().toString(36).toUpperCase()}`;
    setVoucherCode(code);

    // Deduct points using service function
    const success = usePoints(reward.pointsRequired, `Đổi voucher ${reward.title}`);
    if (success) {
      setUserPoints(userPoints - reward.pointsRequired);
    }

    // Save voucher to localStorage
    const vouchers = JSON.parse(localStorage.getItem('userVouchers') || '[]');
    const newVoucher = {
      id: Date.now().toString(),
      code: code,
      title: reward.title,
      description: reward.description,
      discountPercent: reward.discountPercent,
      maxDiscount: reward.maxDiscount,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      isUsed: false
    };
    vouchers.push(newVoucher);
    localStorage.setItem('userVouchers', JSON.stringify(vouchers));

    setRedeemedReward(reward);
    setShowSuccessModal(true);
  };

  return (
    <Page>
      <Header title="Đổi thưởng" showBack />
      
      <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
        <div className="p-4">
                     {/* Points Display */}
           <div className="fkt-card mb-6">
             <div className="text-center">
               <Text className="text-lg text-gray-600 mb-2">Điểm tích lũy hiện tại</Text>
                               <div className="flex items-center justify-center">
                  <Text className="text-4xl font-bold text-[#E0A000] mr-2">{userPoints.toLocaleString()}</Text>
                  <IconImage 
                    src="/static/icons-optimized/points-icon.webp" 
                    alt="Điểm"
                    fallbackIcon="⭐"
                    style={{ width: '32px', height: '32px' }}
                  />
                </div>
             </div>
           </div>

          {/* Rewards List */}
          <div className="space-y-4">
            <Text className="text-lg font-bold mb-4">Voucher có thể đổi</Text>
            
            {rewardItems.map((reward) => (
              <div key={reward.id} className="fkt-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8">
                      <IconImage 
                        src={reward.icon} 
                        alt={reward.title}
                        fallbackIcon="🎫"
                        style={{ width: '24px', height: '24px' }}
                      />
                    </div>
                    <div className="flex-1">
                      <Text className="font-bold text-lg mb-1">{reward.title}</Text>
                      <Text className="text-gray-600 text-sm mb-1">{reward.description}</Text>
                                             <Text className="text-sm">
                         <span className="text-[#E0A000] font-medium">
                           Giảm tối đa: {formatVND(reward.maxDiscount)}
                         </span>
                       </Text>
                    </div>
                  </div>
                                     <Button
                     size="small"
                     className="fkt-apply-button"
                     disabled={userPoints < reward.pointsRequired}
                     onClick={() => handleRedeemReward(reward)}
                   >
                     <div className="flex items-center">
                       <span>Đổi {reward.pointsRequired.toLocaleString()}</span>
                       <IconImage 
                         src="/static/icons-optimized/points-icon.webp" 
                         alt="Điểm"
                         fallbackIcon="⭐"
                         style={{ width: '16px', height: '16px', marginLeft: '4px' }}
                       />
                     </div>
                   </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="fkt-card mt-6">
            <Text className="font-bold mb-3">📋 Hướng dẫn sử dụng</Text>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Mỗi voucher chỉ được sử dụng 1 lần</div>
              <div>• Voucher có hiệu lực trong 30 ngày</div>
              <div>• Không thể kết hợp nhiều voucher trong 1 đơn hàng</div>
              <div>• Điểm tích lũy từ việc đặt hàng (1% giá trị đơn)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        title="🎉 Đổi voucher thành công!"
        onClose={() => {
          setShowSuccessModal(false);
          setRedeemedReward(null);
        }}
        actions={[
          {
            text: "Đóng",
            onClick: () => {
              setShowSuccessModal(false);
              setRedeemedReward(null);
            },
            highLight: true,
          },
        ]}
      >
        {redeemedReward && (
          <Box className="space-y-4">
            <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <Text className="font-bold text-yellow-800 mb-2">
                {redeemedReward.title}
              </Text>
              <Text className="text-yellow-700 text-sm mb-2">
                {redeemedReward.description}
              </Text>
              <Text className="text-sm text-yellow-600">
                Giảm tối đa: {formatVND(redeemedReward.maxDiscount)}
              </Text>
            </Box>
            
            <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <Text className="font-bold text-yellow-800 mb-2">Mã voucher:</Text>
              <Text className="text-2xl font-mono font-bold text-yellow-600 text-center">
                {voucherCode}
              </Text>
              <Text className="text-sm text-yellow-600 text-center mt-2">
                Hãy copy mã này để sử dụng khi đặt hàng
              </Text>
            </Box>
            
            <Box className="text-center">
              <Text className="text-sm text-gray-600">
                Đã trừ {redeemedReward.pointsRequired.toLocaleString()} điểm
              </Text>
              <Text className="text-sm text-gray-600">
                Điểm còn lại: {userPoints.toLocaleString()}
              </Text>
            </Box>
          </Box>
        )}
      </Modal>
    </Page>
  );
};

export default RewardsPage;