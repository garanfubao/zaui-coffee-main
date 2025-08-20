import React, { useState } from "react";
import { Page, Input, Button, Text } from "zmp-ui";
import { useRecoilState } from "recoil";
import { addressesState } from "../state/index";
import type { Address } from "../types";
import { useNavigate } from "zmp-ui";

const AddressFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useRecoilState<Address[]>(addressesState);
  const [form, setForm] = useState({ fullname: "", phone: "", province: "", district: "", ward: "", detail: "", isDefault: true });

  const onSubmit = () => {
    const id = Date.now().toString(36);
    const next = [...addresses.map((a) => ({ ...a, isDefault: false })), { id, ...form }];
    setAddresses(next);
    navigate("/checkout");
  };

  return (
    <Page className="p-4">
      <Text.Header>Thêm địa chỉ</Text.Header>
      <Input label="Họ và tên" placeholder="Nhập họ và tên" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
      <Input label="Số điện thoại" type="number" placeholder="Nhập số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label="Tỉnh/Thành phố" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
      <Input label="Quận/Huyện" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
      <Input label="Phường/Xã" value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} />
      <Input label="Địa chỉ cụ thể" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
      <Button className="mt-4" onClick={onSubmit}>Thêm mới</Button>
    </Page>
  );
};

export default AddressFormPage;
