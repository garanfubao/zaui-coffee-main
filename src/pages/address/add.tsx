import React, { useState } from "react";
import { Box, Button, Header, Input, Page, Switch, Text } from "zmp-ui";
import { useNavigate } from "react-router";
import { useAddress } from "../../hooks/useAddress";
import { getUserInfo } from "zmp-sdk";
import type { Address } from "../../types";

const AddAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const { addAddress } = useAddress();
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detail: ""
  });

  // Đọc địa chỉ đã chọn từ localStorage khi component mount
  React.useEffect(() => {
    const selectedAddress = localStorage.getItem("selectedAddress");
    if (selectedAddress) {
      try {
        const addressData = JSON.parse(selectedAddress);
        setForm(prev => ({
          ...prev,
          province: addressData.province || "",
          district: addressData.district || "",
          ward: addressData.ward || ""
        }));
        // Xóa dữ liệu đã đọc
        localStorage.removeItem("selectedAddress");
      } catch (error) {
        console.error("Error parsing selected address:", error);
      }
    }
  }, []);

  const handleAutoFill = async () => {
    try {
      const { userInfo } = await getUserInfo();
      setForm(prev => ({
        ...prev,
        fullname: userInfo.name || prev.fullname,
        phone: prev.phone // Zalo SDK không cung cấp phone trong userInfo
      }));
    } catch (error) {
      console.error('Auto fill failed:', error);
      alert("Không thể lấy thông tin từ Zalo");
    }
  };

  const handleSave = () => {
    console.log("Form data:", form);
    
    if (!form.fullname || !form.phone || !form.detail) {
      console.warn("Missing required fields:", { fullname: !!form.fullname, phone: !!form.phone, detail: !!form.detail });
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(36),
      fullname: form.fullname,
      phone: form.phone,
      province: form.province,
      district: form.district,
      ward: form.ward,
      detail: form.detail
    };

    console.log("Creating new address:", newAddress);
    addAddress(newAddress);
    console.log("Address added, navigating back");
    navigate(-1);
  };

  return (
    <Page className="flex flex-col">
      <Header title="Thêm địa chỉ" />
      <Box className="p-4 space-y-4 flex-1 overflow-auto">
        <Box>
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={handleAutoFill}
            className="mb-4"
          >
            Tự động điền từ Zalo
          </Button>
        </Box>
        <Box>
          <Text size="small">Họ và tên *</Text>
          <Input 
            placeholder="Nhập họ và tên" 
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
          />
        </Box>
        <Box>
          <Text size="small">Số điện thoại *</Text>
          <Input 
            type="text" 
            placeholder="Nhập số điện thoại" 
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Box>
        <Box onClick={() => navigate("/address/select")}> 
          <Text size="small">
            Thành phố(Tỉnh)/Quận(Huyện)/Phường(Xã)
          </Text>
          <Input 
            placeholder="Chọn" 
            readOnly 
            value={form.province ? `${form.province} - ${form.district} - ${form.ward}` : ""}
          />
        </Box>
        <Box>
          <Text size="small">Địa chỉ cụ thể *</Text>
          <Input 
            placeholder="Nhập địa chỉ cụ thể" 
            value={form.detail}
            onChange={(e) => setForm({ ...form, detail: e.target.value })}
          />
        </Box>

      </Box>
      <Box p={4}>
        <Button fullWidth onClick={handleSave}>
          Thêm mới
        </Button>
      </Box>
    </Page>
  );
};

export default AddAddressPage;