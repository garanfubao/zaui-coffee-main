// Cấu hình đường dẫn icon từ thư mục có sẵn trong code
export const ICON_URLS = {
  POINTS: "/docs/dummy/category-coffee.svg", // Icon cà phê cho tích điểm
  REWARDS: "/docs/dummy/category-bread.svg", // Icon bánh mì cho đổi thưởng
  HISTORY: "/docs/dummy/category-food.svg", // Icon đồ ăn cho lịch sử
  VOUCHER: "/docs/dummy/category-drinks.svg", // Icon đồ uống cho voucher
};

// Hoặc nếu bạn muốn sử dụng đường dẫn tương đối từ thư mục public
export const LOCAL_ICON_URLS = {
  POINTS: "/static/icons-optimized/points-icon.webp", // Sử dụng WebP tối ưu
  REWARDS: "/static/icons-optimized/rewards-icon.webp", // Sử dụng WebP tối ưu
  HISTORY: "/static/icons-optimized/history-icon.webp", // Sử dụng WebP tối ưu
  VOUCHER: "/static/icons-optimized/voucher-icon.webp", // Sử dụng WebP tối ưu
};

// Cấu hình để dễ dàng chuyển đổi giữa các nguồn icon
export const USE_LOCAL_ICONS = true; // Thay đổi thành true để sử dụng icon từ public/static/icons

// Export icon URLs dựa trên cấu hình
export const ACTIVE_ICON_URLS = USE_LOCAL_ICONS ? LOCAL_ICON_URLS : ICON_URLS;
