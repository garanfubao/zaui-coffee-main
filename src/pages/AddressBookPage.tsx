import React, { useState } from "react";
import { Page, Text, Box, Button, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import Header from "../components/Header";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const AddressBookPage: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleAddAddress = () => {
    navigate('/address/new');
  };

  const handleEditAddress = (address: Address) => {
    navigate(`/address/edit/${address.id}`);
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
  };

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title="Sổ địa chỉ" showBack showClose />
      
      {/* Content with top padding for header */}
      <div style={{ paddingTop: '120px' }}>
        <div className="p-4">
        {addresses.length === 0 ? (
          <div className="text-center py-20">
            <Box className="mb-4">
              <span style={{ fontSize: '48px' }}>📍</span>
            </Box>
            <Text className="text-gray-500 mb-4">Bạn chưa có địa chỉ</Text>
            <Button 
              className="fkt-checkout-button"
              onClick={handleAddAddress}
            >
              Thêm địa chỉ mới
            </Button>
          </div>
        ) : (
          <>
            {/* Existing Addresses */}
            {addresses.map((address) => (
              <div key={address.id} className="fkt-card mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Text className="font-bold text-lg mb-1">{address.name}</Text>
                    <Text className="text-gray-600 mb-2">{address.phone}</Text>
                    <Text className="text-gray-800 mb-3">{address.address}</Text>
                    {address.isDefault && (
                      <div className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                        <span>🏁</span>
                        <Text>Mặc định</Text>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="small" 
                      variant="secondary"
                      onClick={() => handleEditAddress(address)}
                    >
                      Sửa
                    </Button>
                    <Button 
                      size="small" 
                      variant="tertiary"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Address Button */}
            <div className="fkt-card cursor-pointer" onClick={handleAddAddress}>
              <div className="flex items-center justify-between">
                <Text className="text-red-500 font-medium">Thêm địa chỉ mới</Text>
                <Icon icon="zi-plus" className="text-red-500" />
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </Page>
  );
};

export default AddressBookPage;