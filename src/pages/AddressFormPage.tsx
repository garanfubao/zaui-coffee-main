import React, { useState } from "react";
import { Page, Input, Button, Text, Select } from "zmp-ui";
import { useRecoilState } from "recoil";
import { addressesState } from "../state/index";
import type { Address } from "../types";
import { useNavigate } from "zmp-ui";
import Header from "../components/Header";

const AddressFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useRecoilState<Address[]>(addressesState);
  const [form, setForm] = useState({ fullname: "", phone: "", province: "", district: "", ward: "", detail: "", isDefault: true });

  // Vietnam provinces data
  const provinces = [
    { value: "hanoi", label: "Thành phố Hà Nội" },
    { value: "hcm", label: "Thành phố Hồ Chí Minh" },
    { value: "danang", label: "Thành phố Đà Nẵng" },
    { value: "haiphong", label: "Thành phố Hải Phòng" },
    { value: "cantho", label: "Thành phố Cần Thơ" },
    { value: "binhduong", label: "Tỉnh Bình Dương" },
    { value: "dongnai", label: "Tỉnh Đồng Nai" },
    { value: "khanhhoa", label: "Tỉnh Khánh Hòa" },
  ];

  const districts = [
    { value: "thanhxuan", label: "Quận Thanh Xuân" },
    { value: "hoankiem", label: "Quận Hoàn Kiếm" },
    { value: "badinh", label: "Quận Ba Đình" },
    { value: "dongda", label: "Quận Đống Đa" },
    { value: "haibatrung", label: "Quận Hai Bà Trưng" },
  ];

  const wards = [
    { value: "khuongmai", label: "Phường Khương Mai" },
    { value: "khuongtrung", label: "Phường Khương Trung" },
    { value: "khuongdinh", label: "Phường Khương Đình" },
    { value: "thanhxuan", label: "Phường Thanh Xuân" },
    { value: "kimgiang", label: "Phường Kim Giang" },
  ];

  const onSubmit = () => {
    const id = Date.now().toString(36);
    const next = [...addresses.map((a) => ({ ...a, isDefault: false })), { id, ...form }];
    setAddresses(next);
    navigate("/addresses");
  };

  const handleClose = () => {
    navigate("/addresses");
  };

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title="Thêm địa chỉ" showBack showClose onClose={handleClose} />
      
      {/* Content with top padding for header */}
      <div style={{ paddingTop: '120px' }}>
        <div className="p-4">
          <Input 
            label="Họ và tên" 
            placeholder="Nhập họ và tên" 
            value={form.fullname} 
            onChange={(e) => setForm({ ...form, fullname: e.target.value })} 
          />
          
          <Input 
            label="Số điện thoại" 
            type="text" 
            placeholder="Nhập số điện thoại" 
            value={form.phone} 
            onChange={(e) => setForm({ ...form, phone: e.target.value })} 
          />
          
          <Input 
            label="Tỉnh/Thành phố"
            placeholder="Chọn tỉnh/thành phố"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
          />
          
          <Input 
            label="Quận/Huyện"
            placeholder="Chọn quận/huyện"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
          
          <Input 
            label="Phường/Xã"
            placeholder="Chọn phường/xã"
            value={form.ward}
            onChange={(e) => setForm({ ...form, ward: e.target.value })}
          />
          
          <Input 
            label="Địa chỉ cụ thể" 
            placeholder="Nhập địa chỉ cụ thể"
            value={form.detail} 
            onChange={(e) => setForm({ ...form, detail: e.target.value })} 
          />
          
          <div className="flex gap-4 mt-6">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={handleClose}
            >
              Đóng
            </Button>
            <Button 
              className="flex-1 fkt-save-button"
              onClick={onSubmit}
            >
              Lưu địa chỉ
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AddressFormPage;
