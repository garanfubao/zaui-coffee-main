import React from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { pointsState } from "../state/index";

const RewardsPage: React.FC = () => {
  const points = useRecoilValue<number>(pointsState);
  const setPoints = useSetRecoilState(pointsState);

  return (
    <Page className="p-4">
      <Box className="rounded-xl p-4 bg-red-50 mb-4">
        <Text.Title>Đăng ký thành viên</Text.Title>
        <Text>Tích điểm đổi thưởng, mở rộng tiện ích</Text>
      </Box>

      <Box textAlign="center" mb={6}>
        <Text.Title>Điểm thưởng của bạn</Text.Title>
        <Text size="large" className="font-bold text-primary">{points} ⭐</Text>
      </Box>

      <Text.Header>Voucher</Text.Header>
      <Box className="mb-4 p-4 rounded-xl bg-white shadow">
        <Text.Title>Giảm 20%</Text.Title>
        <Text>Áp dụng mọi đồ uống</Text>
        <Button
          size="small"
          className="mt-2"
          disabled={points < 100}
          onClick={() => setPoints((p) => p - 100)}
        >
          Đổi 100 điểm
        </Button>
      </Box>

      <Box className="mb-4 p-4 rounded-xl bg-white shadow">
        <Text.Title>Miễn phí topping</Text.Title>
        <Text>Áp dụng cho một topping</Text>
        <Button
          size="small"
          className="mt-2"
          disabled={points < 50}
          onClick={() => setPoints((p) => p - 50)}
        >
          Đổi 50 điểm
        </Button>
      </Box>
    </Page>
  );
};

export default RewardsPage;