import React from "react";
import { Page, Text, Box, Button, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { useAddress } from "../hooks/useAddress";
import type { Address } from "../types";
import Header from "../components/Header";
import IconImage from "../components/IconImage";

const AddressBookPage: React.FC = () => {
  const navigate = useNavigate();
  const { addresses, removeAddress, setSelectedAddress, selectedAddressId } = useAddress();

  const handleAddAddress = () => {
    navigate('/address/new');
  };

  const handleEditAddress = (address: Address) => {
    navigate(`/address/edit/${address.id}`);
  };

  const handleDeleteAddress = (addressId: string) => {
    removeAddress(addressId);
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddress(addressId);
  };

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title="Sổ địa chỉ" showBack />
      
      {/* Content with top padding for header */}
      <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
        <div className="p-4">
          {addresses.length === 0 ? (
            <div className="text-center py-20">
              <Box className="mb-4 flex justify-center">
                <IconImage 
                  src="/static/icons-optimized/address-book-icon.webp"
                  alt="Sổ địa chỉ"
                  fallbackIcon="📍"
                  style={{ width: '80px', height: '80px' }}
                />
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
                <div 
                  key={address.id} 
                  className={`fkt-card mb-4 address-card ${
                    selectedAddressId === address.id ? 'selected' : ''
                  }`}
                >
                  <div className="flex items-start">
                    {/* Address Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <Text className="font-bold text-lg mb-1">{address.fullname}</Text>
                          <Text className="text-gray-600 mb-2">{address.phone}</Text>
                          <Text className="text-gray-800">
                            {address.detail}
                            {address.ward && `, ${address.ward}`}
                            {address.district && `, ${address.district}`}
                            {address.province && `, ${address.province}`}
                          </Text>
                        </div>
                        
                        {/* Radio Button - Bên phải và căn giữa */}
                        <div className="ml-4 address-radio-container flex items-center">
                          <div className="relative">
                            <input
                              type="radio"
                              name="selectedAddress"
                              id={`address-${address.id}`}
                              checked={selectedAddressId === address.id}
                              onChange={() => handleSelectAddress(address.id)}
                              className="sr-only"
                            />
                            <label 
                              htmlFor={`address-${address.id}`}
                              className={`custom-radio ${
                                selectedAddressId === address.id ? 'selected' : ''
                              }`}
                            >
                              <div className={`radio-dot ${
                                selectedAddressId === address.id ? 'visible' : ''
                              }`}></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons - Xuống dưới text */}
                      <div className="flex gap-2">
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
                </div>
              ))}

              {/* Add New Address Button */}
              <div className="fkt-card cursor-pointer" onClick={handleAddAddress}>
                <div className="flex items-center justify-between">
                  <Text className="text-[#FAC000] font-medium">Thêm địa chỉ mới</Text>
                  <Icon icon="zi-plus" className="text-[#FAC000]" />
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