import { createVoucher } from '../services/voucher';

// Khởi tạo voucher mẫu cho admin
export const initializeSampleVouchers = () => {
  const existingVouchers = localStorage.getItem('adminVouchers');
  
  // Chỉ tạo voucher mẫu nếu chưa có voucher nào
  if (!existingVouchers || JSON.parse(existingVouchers).length === 0) {
    console.log('Khởi tạo voucher mẫu...');
    
    // Voucher giảm 10% cho đơn từ 50k
    createVoucher({
      code: 'GIAM10',
      discountPercent: 10,
      minOrderAmount: 50000,
      maxDiscountAmount: 20000,
      expiryDate: '2024-12-31',
      isActive: true
    });

    // Voucher giảm 20% cho đơn từ 100k
    createVoucher({
      code: 'GIAM20',
      discountPercent: 20,
      minOrderAmount: 100000,
      maxDiscountAmount: 50000,
      expiryDate: '2024-12-31',
      isActive: true
    });

    // Voucher giảm 15% cho đơn từ 80k
    createVoucher({
      code: 'KHAITRUONG',
      discountPercent: 15,
      minOrderAmount: 80000,
      maxDiscountAmount: 30000,
      expiryDate: '2024-11-30',
      isActive: true
    });

    // Voucher giảm 25% cho đơn từ 150k
    createVoucher({
      code: 'SALE25',
      discountPercent: 25,
      minOrderAmount: 150000,
      maxDiscountAmount: 75000,
      expiryDate: '2024-10-31',
      isActive: false // Voucher tạm khóa
    });

    console.log('Đã tạo voucher mẫu thành công!');
  }
};
