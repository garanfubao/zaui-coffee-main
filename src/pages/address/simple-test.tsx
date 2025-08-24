import React, { useState } from "react";
import { Box, Button, Header, Input, Page, Text } from "zmp-ui";
import { useRecoilState } from "recoil";
import { addressesState } from "../../state/index";
import type { Address } from "../../types";

const SimpleTestPage: React.FC = () => {
  const [addresses, setAddresses] = useRecoilState<Address[]>(addressesState);
  const [form, setForm] = useState({
    fullname: "Test User",
    phone: "0123456789",
    detail: "123 Test Street"
  });

  const handleAdd = () => {
    const newAddress: Address = {
      id: Date.now().toString(36),
      fullname: form.fullname,
      phone: form.phone,
      province: "Hà Nội",
      district: "Ba Đình",
      ward: "Phúc Xá",
      detail: form.detail,
      isDefault: true
    };

    console.log("Adding address:", newAddress);
    console.log("Current addresses:", addresses);
    
    const newAddresses = [...addresses, newAddress];
    console.log("New addresses array:", newAddresses);
    
    setAddresses(newAddresses);
    console.log("setAddresses called");
  };

  const handleClear = () => {
    setAddresses([]);
    localStorage.removeItem("userAddresses");
  };

  return (
    <Page>
      <Header title="Simple Test" />
      <Box className="p-4 space-y-4">
        <Box>
          <Text.Title size="small">Form:</Text.Title>
          <Input
            placeholder="Full name"
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            placeholder="Detail"
            value={form.detail}
            onChange={(e) => setForm({ ...form, detail: e.target.value })}
          />
        </Box>

        <Box className="space-y-2">
          <Button fullWidth onClick={handleAdd}>
            Add Address
          </Button>
          <Button fullWidth variant="secondary" onClick={handleClear}>
            Clear All
          </Button>
        </Box>

        <Box>
          <Text.Title size="small">Current Addresses ({addresses.length}):</Text.Title>
          {addresses.map((addr, index) => (
            <Box key={addr.id} className="p-2 border border-gray-200 rounded mt-2">
              <Text size="small">{index + 1}. {addr.fullname} - {addr.phone}</Text>
              <Text size="small" className="text-gray-600">{addr.detail}</Text>
            </Box>
          ))}
        </Box>

        <Box>
          <Text.Title size="small">LocalStorage:</Text.Title>
          <Text size="small" className="text-gray-600">
            {localStorage.getItem("userAddresses") || "Empty"}
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default SimpleTestPage;
