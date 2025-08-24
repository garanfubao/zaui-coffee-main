import React, { useState, useEffect } from "react";
import { Box, Button, Header, Page, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { addressesState } from "../../state/index";

const TestAddressPage: React.FC = () => {
  const addresses = useRecoilValue(addressesState);
  const [localStorageData, setLocalStorageData] = useState<string>("");

  useEffect(() => {
    const data = localStorage.getItem("userAddresses");
    setLocalStorageData(data || "No data");
  }, []);

  const testAddAddress = () => {
    const testAddress = {
      id: Date.now().toString(36),
      fullname: "Test User",
      phone: "0123456789",
      province: "Hà Nội",
      district: "Ba Đình",
      ward: "Phúc Xá",
      detail: "123 Test Street",
      isDefault: true
    };

    console.log("Adding test address:", testAddress);
    
    // Test localStorage directly
    const currentData = localStorage.getItem("userAddresses");
    const currentAddresses = currentData ? JSON.parse(currentData) : [];
    const newAddresses = [...currentAddresses, testAddress];
    localStorage.setItem("userAddresses", JSON.stringify(newAddresses));
    
    console.log("Updated localStorage:", newAddresses);
    setLocalStorageData(JSON.stringify(newAddresses));
  };

  const clearData = () => {
    localStorage.removeItem("userAddresses");
    setLocalStorageData("No data");
    console.log("Cleared localStorage");
  };

  return (
    <Page>
      <Header title="Test Address" />
      <Box className="p-4 space-y-4">
        <Box>
          <Text.Title size="small">Recoil State:</Text.Title>
          <Text size="small" className="text-gray-600">
            {JSON.stringify(addresses, null, 2)}
          </Text>
        </Box>
        
        <Box>
          <Text.Title size="small">LocalStorage Data:</Text.Title>
          <Text size="small" className="text-gray-600">
            {localStorageData}
          </Text>
        </Box>
        
        <Box className="space-y-2">
          <Button fullWidth onClick={testAddAddress}>
            Test Add Address
          </Button>
          <Button fullWidth variant="secondary" onClick={clearData}>
            Clear Data
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default TestAddressPage;
