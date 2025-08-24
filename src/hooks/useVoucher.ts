import { useState, useEffect } from "react";

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
  isUsed?: boolean;
  expiresAt?: string;
}

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

export const useVoucher = () => {
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);

  // Load user vouchers from localStorage
  useEffect(() => {
    const vouchers = JSON.parse(localStorage.getItem('userVouchers') || '[]');
    setUserVouchers(vouchers);
  }, []);

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
    // Check if already has applied voucher (only allow 1 voucher per order)
    if (appliedVoucher) {
      return { success: false, message: "Mỗi đơn hàng chỉ được áp dụng 1 voucher", discount: 0 };
    }

    // Check if order total is valid
    if (orderTotal <= 0) {
      return { success: false, message: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi áp dụng voucher", discount: 0 };
    }

    // First check user vouchers (from reward system)
    const userVoucher = userVouchers.find(v => 
      v.code.toUpperCase() === code.toUpperCase() && 
      !v.isUsed && 
      new Date() < new Date(v.expiresAt)
    );

    if (userVoucher) {
      // Calculate discount for user voucher
      const discount = Math.floor(orderTotal * userVoucher.discountPercent / 100);
      const finalDiscount = Math.min(discount, userVoucher.maxDiscount);

      const voucher: Voucher = {
        id: userVoucher.id,
        code: userVoucher.code,
        title: userVoucher.title,
        description: userVoucher.description,
        discountType: 'percentage',
        discountValue: userVoucher.discountPercent,
        minOrder: 0,
        maxDiscount: userVoucher.maxDiscount,
        isActive: true,
        isUsed: false,
        expiresAt: userVoucher.expiresAt
      };

      setAppliedVoucher(voucher);
      return { 
        success: true, 
        message: `Áp dụng thành công! Giảm ${finalDiscount.toLocaleString()}đ`, 
        discount: finalDiscount 
      };
    }

    // Then check system vouchers
    const systemVoucher = availableVouchers.find(v => v.code.toUpperCase() === code.toUpperCase() && v.isActive);
    
    if (!systemVoucher) {
      return { success: false, message: "Mã voucher không hợp lệ", discount: 0 };
    }

    if (orderTotal < systemVoucher.minOrder) {
      return { 
        success: false, 
        message: `Đơn hàng tối thiểu ${systemVoucher.minOrder.toLocaleString()}đ`, 
        discount: 0 
      };
    }

    let discount = 0;
    if (systemVoucher.discountType === 'fixed') {
      discount = systemVoucher.discountValue;
    } else {
      discount = Math.floor(orderTotal * systemVoucher.discountValue / 100);
      if (systemVoucher.maxDiscount) {
        discount = Math.min(discount, systemVoucher.maxDiscount);
      }
    }

    setAppliedVoucher(systemVoucher);
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

    // Check if it's a user voucher
    const userVoucher = userVouchers.find(v => v.code === appliedVoucher.code);
    if (userVoucher) {
      const discount = Math.floor(orderTotal * userVoucher.discountPercent / 100);
      return Math.min(discount, userVoucher.maxDiscount);
    }

    // System voucher
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

  const markVoucherAsUsed = () => {
    if (appliedVoucher) {
      // Mark user voucher as used
      const updatedVouchers = userVouchers.map(v => 
        v.code === appliedVoucher.code ? { ...v, isUsed: true } : v
      );
      setUserVouchers(updatedVouchers);
      localStorage.setItem('userVouchers', JSON.stringify(updatedVouchers));
    }
  };

  return {
    availableVouchers,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    getDiscountAmount,
    markVoucherAsUsed,
  };
};
