import React from "react";
import { Box, Button, Header, Input, Page, Switch, Text } from "zmp-ui";
import { useNavigate } from "react-router";

const AddAddressPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Page className="flex flex-col">
      <Header title="Thêm địa chỉ" />
      <Box className="p-4 space-y-4 flex-1 overflow-auto">
        <Box>
          <Text size="small">Họ và tên</Text>
          <Input placeholder="Nhập họ và tên" />
        </Box>
        <Box>
          <Text size="small">Số điện thoại</Text>
          <Input type="number" placeholder="Nhập số điện thoại" />
        </Box>
        <Box onClick={() => navigate("/address/select")}> 
          <Text size="small">
            Thành phố(Tỉnh)/Quận(Huyện)/Phường(Xã)
          </Text>
          <Input placeholder="Chọn" readOnly />
        </Box>
        <Box>
          <Text size="small">Địa chỉ cụ thể</Text>
          <Input placeholder="Nhập địa chỉ cụ thể" />
        </Box>
        <Box flex alignItems="center" className="space-x-2">
          <Switch />
          <Text size="small">Đặt làm địa chỉ mặc định</Text>
        </Box>
      </Box>
      <Box p={4}>
        <Button fullWidth onClick={() => navigate(-1)}>
          Thêm mới
        </Button>
      </Box>
    </Page>
  );
};

export default AddAddressPage;