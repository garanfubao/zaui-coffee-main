// Danh sách Zalo User ID của các admin được phép truy cập
export const ADMIN_USER_IDS: string[] = [
  // Thêm Zalo User ID của admin vào đây
  // Ví dụ: "123456789", "987654321"
  // 
  // Cách lấy Zalo User ID:
  // 1. Vào trang Profile
  // 2. Nếu là admin, sẽ thấy "🔐 Thông tin Admin" với Zalo User ID
  // 3. Copy ID đó và thêm vào mảng này
];

// Kiểm tra xem user hiện tại có phải là admin không
export const isAdmin = (userZaloId?: string): boolean => {
  if (!userZaloId) return false;
  return ADMIN_USER_IDS.includes(userZaloId);
};

// Lấy Zalo User ID từ user state (cần implement theo cách lấy user info của bạn)
export const getCurrentUserZaloId = (): string | undefined => {
  // Implement cách lấy Zalo User ID từ user state
  // Ví dụ: return userState.zaloId;
  return undefined;
};
