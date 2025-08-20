import React from "react";
import { Page, List, Text, Button } from "zmp-ui";
import { useRecoilState } from "recoil";
import { addressesState } from "../state/index";
import type { Address } from "../types";
import { useNavigate } from "zmp-ui";

const AddressBookPage: React.FC = () => {
  const [addresses, setAddresses] = useRecoilState<Address[]>(addressesState);
  const navigate = useNavigate();

  const setDefault = (id: string) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

  return (
    <Page className="p-4">
      <Text.Header>Sổ địa chỉ</Text.Header>
      <Button className="mb-3" onClick={() => navigate("/address/new")}>Thêm địa chỉ</Button>
      <List>
        {addresses.map((a) => (
          <List.Item
            key={a.id}
            title={`${a.fullname} (${a.phone})`}
            subTitle={`${a.detail}, ${a.ward}, ${a.district}, ${a.province}`}
            suffix={
              <Button
                size="small"
                variant={a.isDefault ? "primary" : "secondary"}
                onClick={() => setDefault(a.id)}
              >
                {a.isDefault ? "Mặc định" : "Đặt mặc định"}
              </Button>
            }
          />
        ))}
      </List>
    </Page>
  );
};

export default AddressBookPage;