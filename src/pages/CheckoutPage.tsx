import React, { useState } from "react";
import { Page, Box, Text, Button, useSnackbar } from "zmp-ui";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  cartState,
  cartTotalSelector,
  defaultAddressSelector,
  pointsState,
} from "../state/index";

const CheckoutPage: React.FC = () => {
  const cart = useRecoilValue(cartState);
  const total = useRecoilValue(cartTotalSelector);
  const defaultAddress = useRecoilValue(defaultAddressSelector);
  const setPoints = useSetRecoilState(pointsState);

  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      // TODO: gọi API checkout thật sự ở đây
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // cộng điểm thưởng, ví dụ 10%
      setPoints((prev) => prev + Math.floor(total / 10));

      openSnackbar({
        text: "Thanh toán thành công 🎉",
        type: "success",
      });
    } catch (err) {
      openSnackbar({
        text: "Có lỗi xảy ra khi thanh toán",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="p-4">
      <Box className="mb-4">
        <Text.Title size="large">Thanh toán</Text.Title>
      </Box>

      <Box className="mb-2">
        <Text bold>Địa chỉ giao hàng:</Text>
        <Text>{defaultAddress || "Chưa có địa chỉ mặc định"}</Text>
      </Box>

      <Box className="mb-4">
        <Text bold>Giỏ hàng:</Text>
        {cart.length === 0 ? (
          <Text>Không có sản phẩm nào</Text>
        ) : (
          cart.map((item) => (
            <Box key={item.id} className="flex justify-between py-1">
              <Text>
                {item.name} x{item.quantity}
              </Text>
              <Text>{item.price * item.quantity}đ</Text>
            </Box>
          ))
        )}
      </Box>

      <Box className="flex justify-between mb-6">
        <Text bold>Tổng cộng:</Text>
        <Text bold>{total}đ</Text>
      </Box>

      <Button
        fullWidth
        disabled={cart.length === 0 || loading}
        loading={loading}
        onClick={handleCheckout}
      >
        Thanh toán
      </Button>
    </Page>
  );
};

export default CheckoutPage;
