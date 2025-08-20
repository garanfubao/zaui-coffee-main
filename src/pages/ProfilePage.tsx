import React from "react";
import { Page, Box, Avatar, Text, List, Button, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { requestFollowOA, openOAChat, sendMessageFromOA } from "../services/oa";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Page className="p-4">
      <Box className="rounded-xl p-4 bg-red-600 text-white mb-4">
        <Text size="small">Xin chào,</Text>
        <Text.Title className="text-white">Duc Anh Nguyen</Text.Title>
      </Box>

      <List>
        <List.Item title="Chỉnh sửa thông tin" />
        <List.Item title="Đơn hàng" onClick={() => navigate("/checkout")} />
        <List.Item title="Lịch sử tích điểm" onClick={() => navigate("/rewards")} />
        <List.Item title="Sổ địa chỉ" onClick={() => navigate("/addresses")} />
        <List.Item
          title="Quan tâm OA"
          prefix={<Icon icon="zi-heart" />}
          suffix={
            <div className="flex gap-2">
              <Button size="small" variant="secondary" onClick={() => requestFollowOA()}>
                Quan tâm
              </Button>
              <Button size="small" onClick={() => openOAChat()}>
                Nhắn OA
              </Button>
            </div>
          }
        />
        <List.Item
          title="Nhận mã ưu đãi qua OA"
          subTitle="Gửi tin nhắn OA để nhận voucher demo"
          prefix={<Icon icon="zi-gift" />}
          suffix={
            <Button size="small" onClick={() => sendMessageFromOA('Gửi voucher giúp tôi với!')}>
              Gửi
            </Button>
          }
        />
      </List>

      <Box textAlign="center" mt={8}>
        <Avatar src="https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/avatar.webp" size={72} />
        <Text className="mt-2">Gà Rán FKT</Text>
      </Box>
    </Page>
  );
};

export default ProfilePage;