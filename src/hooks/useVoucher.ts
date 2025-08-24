import { useState } from "react";

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  isActive: boolean;
}

export const useVoucher = () => {
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const availableVouchers: Voucher[] = [
    {
      id: "1",
      code: "GIAM50K",
      title: "Giảm 50K cho đơn từ 500K",
      description: "Áp dụng cho tất cả sản phẩm",
      discountType: 'fixed',
      discountValue: 50000,
      minOrder: 500000,
      isActive: true,
    },
    {
      id: "2",
      code: "GIAM100K",
      title: "Giảm 100K cho đơn từ 1M",
      description: "Chỉ áp dụng cho combo",
      discountType: 'fixed',
      discountValue: 100000,
      minOrder: 1000000,
      isActive: true,
    },
    {
      id: "3",
      code: "GIAM20",
      title: "Giảm 20% tối đa 200K",
      description: "Áp dụng cho bột chiên gà",
      discountType: 'percentage',
      discountValue: 20,
      minOrder: 300000,
      maxDiscount: 200000,
      isActive: true,
    },
  ];

  const applyVoucher = (code: string, orderTotal: number): { success: boolean; message: string; discount: number } => {
    const voucher = availableVouchers.find(v => v.code.toUpperCase() === code.toUpperCase() && v.isActive);
    
    if (!voucher) {
      return { success: false, message: "Mã voucher không hợp lệ", discount: 0 };
    }

    if (orderTotal < voucher.minOrder) {
      return { 
        success: false, 
        message: `Đơn hàng tối thiểu ${voucher.minOrder.toLocaleString()}đ`, 
        discount: 0 
      };
    }

    let discount = 0;
    if (voucher.discountType === 'fixed') {
      discount = voucher.discountValue;
    } else {
      discount = Math.floor(orderTotal * voucher.discountValue / 100);
      if (voucher.maxDiscount) {
        discount = Math.min(discount, voucher.maxDiscount);
      }
    }

    setAppliedVoucher(voucher);
    return { 
      success: true, 
      message: `Áp dụng thành công! Giảm ${discount.toLocaleString()}đ`, 
      discount 
    };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  const getDiscountAmount = (orderTotal: number): number => {
    if (!appliedVoucher) return 0;

    if (orderTotal < appliedVoucher.minOrder) return 0;

    let discount = 0;
    if (appliedVoucher.discountType === 'fixed') {
      discount = appliedVoucher.discountValue;
    } else {
      discount = Math.floor(orderTotal * appliedVoucher.discountValue / 100);
      if (appliedVoucher.maxDiscount) {
        discount = Math.min(discount, appliedVoucher.maxDiscount);
      }
    }

    return discount;
  };

  return {
    availableVouchers,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    getDiscountAmount,
  };
};
