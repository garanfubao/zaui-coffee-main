import React, { FC } from "react";
import { Box, Icon, Text } from "zmp-ui";

import type { IconProps } from "zmp-ui";

type Feature = {
  icon: IconProps["icon"];
  text: string;
};

const features: Feature[] = [
  { icon: "zi-coin", text: "Tích điểm" },
  { icon: "zi-gift", text: "Đổi thưởng" },
  { icon: "zi-shopping-cart", text: "Đặt hàng" },
  { icon: "zi-call", text: "Liên hệ" },
  { icon: "zi-ticket-percent", text: "Voucher" },
  { icon: "zi-star", text: "Hạng thành viên" },
  { icon: "zi-megaphone", text: "Chương trình" },
  { icon: "zi-clock-1", text: "Lịch sử mua" },
];

export const Features: FC = () => {
  return (
    <Box p={4} className="bg-white">
      <Box className="grid grid-cols-4 gap-4 text-center">
        {features.map((f) => (
          <Box key={f.text} className="space-y-1">
            <Icon icon={f.icon} className="mx-auto" />
            <Text size="xSmall" className="block">
              {f.text}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Features;