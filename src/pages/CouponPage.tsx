import React from "react";
import { Page, Text, Box, Button } from "zmp-ui";
import { useNavigate } from "zmp-ui";

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  minOrder: number;
  validUntil: string;
  banner: string;
  isActive: boolean;
}

const CouponPage: React.FC = () => {
  const navigate = useNavigate();

  const coupons: Coupon[] = [
    {
      id: "1",
      title: "Giảm 50K cho đơn từ 500K",
      description: "Áp dụng cho tất cả sản phẩm",
      discount: "50.000đ",
      minOrder: 500000,
      validUntil: "31/12/2024",
      banner: "🎉",
      isActive: true,
    },
    {
      id: "2", 
      title: "Giảm 100K cho đơn từ 1M",
      description: "Chỉ áp dụng cho combo",
      discount: "100.000đ",
      minOrder: 1000000,
      validUntil: "31/12/2024",
      banner: "🔥",
      isActive: true,
    },
    {
      id: "3",
      title: "Giảm 20% tối đa 200K",
      description: "Áp dụng cho bột chiên gà",
      discount: "20%",
      minOrder: 300000,
      validUntil: "31/12/2024", 
      banner: "🎯",
      isActive: true,
    },
  ];

  return (
    <Page>
      {/* Header */}
      <div className="fkt-header">
        <Text className="fkt-username">Voucher & Coupon</Text>
      </div>

      <div className="p-4">
        <Text className="text-lg font-bold mb-4">Mã giảm giá khả dụng</Text>
        
        {coupons.map((coupon) => (
          <div key={coupon.id} className="fkt-card mb-4">
            <div className="flex items-center gap-4">
              <div className="fkt-promo-icon">
                <span>{coupon.banner}</span>
              </div>
              <div className="flex-1">
                <Text className="font-bold text-lg mb-1">{coupon.title}</Text>
                <Text className="text-gray-600 text-sm mb-2">{coupon.description}</Text>
                <Text className="text-sm text-gray-500">
                  Đơn tối thiểu: {coupon.minOrder.toLocaleString()}đ
                </Text>
                <Text className="text-sm text-gray-500">
                  Hạn sử dụng: {coupon.validUntil}
                </Text>
              </div>
              <div className="text-right">
                <Text className="text-2xl font-bold text-red-500 mb-2">
                  {coupon.discount}
                </Text>
                <Button 
                  size="small" 
                  className="fkt-checkout-button"
                  onClick={() => {
                    // Apply coupon logic
                    console.log("Applying coupon:", coupon.id);
                  }}
                >
                  Sử dụng
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6">
          <Text className="text-lg font-bold mb-4">Nhập mã giảm giá</Text>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập mã ưu đãi..."
              className="flex-1 p-3 border border-gray-300 rounded-lg"
            />
            <Button className="fkt-checkout-button">
              Áp dụng
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default CouponPage;
