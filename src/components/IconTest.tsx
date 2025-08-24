import React from 'react';
import { Box, Text } from 'zmp-ui';
import IconImage from './IconImage';

const IconTest: React.FC = () => {
  return (
    <Box className="p-4">
      <Text className="text-lg font-bold mb-4">Test Icons</Text>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Text>Points Icon:</Text>
          <IconImage 
            src="/static/icons-optimized/points-icon.webp"
            alt="Điểm"
            fallbackIcon="⭐"
            style={{ width: '24px', height: '24px' }}
            webpSupport={true}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Text>Chúc mừng Icon:</Text>
          <IconImage 
            src="/static/icons-optimized/chucmung_icon.webp"
            alt="Chúc mừng"
            fallbackIcon="🎉"
            style={{ width: '24px', height: '24px' }}
            webpSupport={true}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Text>Order Icon:</Text>
          <IconImage 
            src="/static/icons-optimized/order-icon.webp"
            alt="Đơn hàng"
            fallbackIcon="📦"
            style={{ width: '24px', height: '24px' }}
            webpSupport={true}
          />
        </div>
      </div>
    </Box>
  );
};

export default IconTest;
