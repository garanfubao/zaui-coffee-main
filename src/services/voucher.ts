export interface Voucher {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface VoucherValidationResult {
  isValid: boolean;
  message: string;
  voucher?: Voucher;
  discountAmount?: number;
}

// Load vouchers from localStorage
export const getVouchers = (): Voucher[] => {
  try {
    const savedVouchers = localStorage.getItem('adminVouchers');
    return savedVouchers ? JSON.parse(savedVouchers) : [];
  } catch (error) {
    console.error('Error loading vouchers:', error);
    return [];
  }
};

// Save vouchers to localStorage
export const saveVouchers = (vouchers: Voucher[]): void => {
  try {
    localStorage.setItem('adminVouchers', JSON.stringify(vouchers));
  } catch (error) {
    console.error('Error saving vouchers:', error);
  }
};

// Validate voucher code
export const validateVoucher = (code: string, orderAmount: number): VoucherValidationResult => {
  const vouchers = getVouchers();
  const voucher = vouchers.find(v => 
    v.code.toUpperCase() === code.toUpperCase() && 
    v.isActive
  );

  if (!voucher) {
    return {
      isValid: false,
      message: 'Mã voucher không tồn tại hoặc đã bị khóa'
    };
  }

  // Check expiry date
  if (new Date(voucher.expiryDate) < new Date()) {
    return {
      isValid: false,
      message: 'Voucher đã hết hạn'
    };
  }

  // Check minimum order amount
  if (orderAmount < voucher.minOrderAmount) {
    return {
      isValid: false,
      message: `Đơn hàng tối thiểu ${voucher.minOrderAmount.toLocaleString()}đ`
    };
  }

  // Calculate discount amount
  const discountAmount = Math.min(
    (orderAmount * voucher.discountPercent) / 100,
    voucher.maxDiscountAmount || Infinity
  );

  return {
    isValid: true,
    message: `Giảm ${voucher.discountPercent}% - Tối đa ${voucher.maxDiscountAmount?.toLocaleString()}đ`,
    voucher,
    discountAmount
  };
};

// Apply voucher to order
export const applyVoucher = (code: string, orderAmount: number): VoucherValidationResult => {
  return validateVoucher(code, orderAmount);
};

// Get voucher by code
export const getVoucherByCode = (code: string): Voucher | null => {
  const vouchers = getVouchers();
  return vouchers.find(v => v.code.toUpperCase() === code.toUpperCase()) || null;
};

// Create new voucher
export const createVoucher = (voucherData: Omit<Voucher, 'id' | 'createdAt'>): Voucher => {
  const vouchers = getVouchers();
  const newVoucher: Voucher = {
    ...voucherData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  const updatedVouchers = [...vouchers, newVoucher];
  saveVouchers(updatedVouchers);
  
  return newVoucher;
};

// Update voucher
export const updateVoucher = (id: string, updates: Partial<Voucher>): Voucher | null => {
  const vouchers = getVouchers();
  const index = vouchers.findIndex(v => v.id === id);
  
  if (index === -1) return null;
  
  vouchers[index] = { ...vouchers[index], ...updates };
  saveVouchers(vouchers);
  
  return vouchers[index];
};

// Delete voucher
export const deleteVoucher = (id: string): boolean => {
  const vouchers = getVouchers();
  const filteredVouchers = vouchers.filter(v => v.id !== id);
  
  if (filteredVouchers.length === vouchers.length) {
    return false; // Voucher not found
  }
  
  saveVouchers(filteredVouchers);
  return true;
};

// Toggle voucher status
export const toggleVoucherStatus = (id: string): Voucher | null => {
  const vouchers = getVouchers();
  const voucher = vouchers.find(v => v.id === id);
  
  if (!voucher) return null;
  
  return updateVoucher(id, { isActive: !voucher.isActive });
};
