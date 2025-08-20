import React from "react";
import { Box, Header, Page, Text } from "zmp-ui";
import { useNavigate } from "react-router";

const provinces = [
  "Tp. Hà Nội",
  "Tp. Hải Phòng",
  "Tp. Hồ Chí Minh",
  "Tp. Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bình Dương",
  "Bình Phước",
  "Bạc Liêu",
];

const SelectAddressPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Page>
      <Header title="Chọn địa chỉ" />
      <Box className="p-4">
        {provinces.map((p) => (
          <Box
            key={p}
            className="py-2 border-b border-divider"
            onClick={() => navigate(-1)}
          >
            <Text>{p}</Text>
          </Box>
        ))}
      </Box>
    </Page>
  );
};

export default SelectAddressPage;