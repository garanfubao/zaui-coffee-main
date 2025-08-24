import React from "react";
import { Box, Header, Page, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "react-router";
import { useAddress } from "../../hooks/useAddress";
import type { Address } from "../../types";

const AddressPage: React.FC = () => {
  const navigate = useNavigate();
  const { addresses, removeAddress, setDefault } = useAddress();
  
  console.log("AddressPage - Current addresses:", addresses);

  const handleAddAddress = () => {
    navigate("/address/add");
  };

  const handleTestPage = () => {
    navigate("/address/test");
  };

  const handleSimpleTestPage = () => {
    navigate("/address/simple-test");
  };

  const handleEditAddress = (address: Address) => {
    // Navigate to edit address page with address data
    navigate(`/address/edit/${address.id}`, { 
      state: { addressData: address } 
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    removeAddress(addressId);
  };

  const handleSetDefault = (addressId: string) => {
    setDefault(addressId);
  };

  return (
    <Page>
      <Header
        title={(
          <Box flex className="justify-between w-full">
            <Text.Title>Sổ địa chỉ</Text.Title>
            <Text
              size="small"
              className="text-primary"
              onClick={handleAddAddress}
            >
              Thêm
            </Text>
          </Box>
        ) as unknown as string}
      />
      
      {addresses.length === 0 ? (
        <Box className="p-4 text-center text-gray">
          <Text>Bạn chưa có địa chỉ</Text>
          <Box mt={4} className="space-y-2">
            <Button onClick={handleAddAddress}>
              Thêm địa chỉ mới
            </Button>
            <Button variant="secondary" onClick={handleTestPage}>
              Test Page
            </Button>
            <Button variant="secondary" onClick={handleSimpleTestPage}>
              Simple Test
            </Button>
          </Box>
        </Box>
      ) : (
        <Box className="p-4 space-y-4">
          {addresses.map((address) => (
            <Box
              key={address.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <Box flex className="justify-between items-start mb-2">
                <Text.Title size="small">{address.fullname}</Text.Title>
              </Box>
              <Text size="small" className="text-gray-600 mb-1">
                {address.phone}
              </Text>
              <Text size="small" className="text-gray-600 mb-3">
                {address.detail}
                {address.province && `, ${address.province}`}
                {address.district && `, ${address.district}`}
                {address.ward && `, ${address.ward}`}
              </Text>
              <Box flex className="space-x-2">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => handleEditAddress(address)}
                >
                  Sửa
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  Xóa
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Page>
  );
};

export default AddressPage;