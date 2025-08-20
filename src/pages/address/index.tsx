import React from "react";
import { Box, Header, Page, Text } from "zmp-ui";
import { useNavigate } from "react-router";

const AddressPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Page>
      <Header
        title={(
          <Box flex className="justify-between w-full">
            <Text.Title>Sổ địa chỉ</Text.Title>
            <Text
              size="small"
              className="text-primary"
              onClick={() => navigate("/address/add")}
            >
              Thêm
            </Text>
          </Box>
        ) as unknown as string}
      />
      <Box className="p-4 text-center text-gray">
        <Text>Bạn chưa có địa chỉ</Text>
      </Box>
    </Page>
  );
};

export default AddressPage;