import React from "react";
import { Box, Button, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { cartTotalSelector } from "../state/index";
import { formatVND } from "../utils/price";
import { useNavigate } from "zmp-ui";

const CartBar: React.FC = () => {
  const total = useRecoilValue<number>(cartTotalSelector);
  const navigate = useNavigate();
  if (!total || total <= 0) return null;
  return (
    <Box className="fixed left-0 right-0 bottom-16 bg-white border-t p-3 flex items-center justify-between">
      <Text> Tạm tính: <b>{formatVND(total)}</b></Text>
      <Button onClick={() => navigate("/cart")}>Thanh toán</Button>
    </Box>
  );
};

export default CartBar;