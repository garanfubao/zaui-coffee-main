const fs = require('fs');
const path = require('path');

// Danh sách các file cần cập nhật
const filesToUpdate = [
  'src/pages/PointsHistoryPage.tsx',
  'src/pages/OrdersPage.tsx',
  'src/pages/CouponPage.tsx',
  'src/pages/RewardsPage.tsx',
  'src/pages/CartPage.tsx',
  'src/components/IconTest.tsx'
];

// Hàm cập nhật file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Thay thế đường dẫn
    content = content.replace(/\/static\/icons\//g, '/static/icons-optimized/');
    content = content.replace(/\.webp/g, '.png');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Đã cập nhật: ${filePath}`);
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật ${filePath}:`, error.message);
  }
}

// Cập nhật tất cả file
console.log('🔄 Đang cập nhật đường dẫn icon...');
filesToUpdate.forEach(updateFile);
console.log('🎉 Hoàn thành cập nhật!');
