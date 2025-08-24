import React, { useState, useEffect } from "react";
import { Page, Input, Button, Text, Modal, Box } from "zmp-ui";
import { useRecoilState } from "recoil";
import { addressesState } from "../state/index";
import type { Address } from "../types";
import { useNavigate, useParams } from "zmp-ui";
import Header from "../components/Header";
import { validateVietnamesePhone, formatVietnamesePhone, getPhoneErrorMessage } from "../utils/phone";

interface Province {
  code: number;
  name: string;
  districts: District[];
}

interface District {
  code: number;
  name: string;
  wards: Ward[];
}

interface Ward {
  code: number;
  name: string;
}

const AddressFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [addresses, setAddresses] = useRecoilState<Address[]>(addressesState);
  const [form, setForm] = useState({ fullname: "", phone: "", province: "", district: "", ward: "", detail: "" });
  const isEditMode = !!id;
  
  // State cho API địa chỉ
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho modals
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);
  const [showPhoneErrorModal, setShowPhoneErrorModal] = useState(false);

  // Fallback data nếu API không hoạt động
  const fallbackProvinces: Province[] = [
    {
      code: 1,
      name: "Thành phố Hà Nội",
      districts: [
        {
          code: 1,
          name: "Quận Ba Đình",
          wards: [
            { code: 1, name: "Phường Phúc Xá" },
            { code: 2, name: "Phường Trúc Bạch" },
            { code: 3, name: "Phường Vĩnh Phúc" },
          ]
        },
        {
          code: 2,
          name: "Quận Hoàn Kiếm",
          wards: [
            { code: 4, name: "Phường Phúc Tân" },
            { code: 5, name: "Phường Đồng Xuân" },
            { code: 6, name: "Phường Hàng Mã" },
          ]
        }
      ]
    },
    {
      code: 79,
      name: "Thành phố Hồ Chí Minh",
      districts: [
        {
          code: 760,
          name: "Quận 1",
          wards: [
            { code: 26734, name: "Phường Bến Nghé" },
            { code: 26737, name: "Phường Bến Thành" },
            { code: 26740, name: "Phường Cầu Kho" },
          ]
        },
        {
          code: 761,
          name: "Quận 2",
          wards: [
            { code: 26743, name: "Phường An Khánh" },
            { code: 26746, name: "Phường An Lợi Đông" },
            { code: 26749, name: "Phường An Phú" },
          ]
        }
      ]
    }
  ];

  // Load address data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const addressToEdit = addresses.find(addr => addr.id === id);
      if (addressToEdit) {
        setForm({
          fullname: addressToEdit.fullname,
          phone: addressToEdit.phone,
          province: addressToEdit.province,
          district: addressToEdit.district,
          ward: addressToEdit.ward,
          detail: addressToEdit.detail
        });
        
        // Load districts and wards for the selected province/district
        if (addressToEdit.province) {
          const selectedProvince = provinces.find(p => p.name === addressToEdit.province);
          if (selectedProvince) {
            setDistricts(selectedProvince.districts);
            
            if (addressToEdit.district) {
              const selectedDistrict = selectedProvince.districts.find(d => d.name === addressToEdit.district);
              if (selectedDistrict) {
                setWards(selectedDistrict.wards);
              }
            }
          }
        }
      }
    }
  }, [isEditMode, id, addresses, provinces]);

  // Fetch provinces từ API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        console.log("Fetching provinces from API...");
        const response = await fetch('https://provinces.open-api.vn/api/?depth=3');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API response length:", data?.length);
        console.log("First few provinces:", data?.slice(0, 3));
        
        if (Array.isArray(data) && data.length > 0) {
          setProvinces(data);
          console.log("Provinces set successfully");
        } else {
          console.warn("API returned empty or invalid data, using fallback");
          setProvinces(fallbackProvinces);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
        console.log("Using fallback provinces");
        setProvinces(fallbackProvinces);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Debug: Log form state changes
  useEffect(() => {
    console.log("Form state updated:", form);
  }, [form]);

  const handleProvinceSelect = (provinceName: string) => {
    console.log("Province selected:", provinceName);
    
    const selectedProvince = provinces.find(p => p.name === provinceName);
    console.log("Found province:", selectedProvince);
    
    setForm(prev => {
      console.log("Updating form with province:", provinceName);
      return { 
        ...prev, 
        province: provinceName, 
        district: "", 
        ward: "" 
      };
    });
    
    if (selectedProvince) {
      console.log("Setting districts for province:", selectedProvince.districts?.length);
      setDistricts(selectedProvince.districts);
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }
    
    setShowProvinceModal(false);
  };

  const handleDistrictSelect = (districtName: string) => {
    console.log("District selected:", districtName);
    
    const selectedDistrict = districts.find(d => d.name === districtName);
    console.log("Found district:", selectedDistrict);
    
    setForm(prev => {
      console.log("Updating form with district:", districtName);
      return { 
        ...prev, 
        district: districtName, 
        ward: "" 
      };
    });
    
    if (selectedDistrict) {
      console.log("Setting wards for district:", selectedDistrict.wards?.length);
      setWards(selectedDistrict.wards);
    } else {
      setWards([]);
    }
    
    setShowDistrictModal(false);
  };

  const handleWardSelect = (wardName: string) => {
    console.log("Ward selected:", wardName);
    
    setForm(prev => {
      console.log("Updating form with ward:", wardName);
      return { 
        ...prev, 
        ward: wardName 
      };
    });
    
    setShowWardModal(false);
  };

  const onSubmit = () => {
    console.log("Form data on submit:", form);
    if (!form.fullname || !form.phone || !form.detail) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Validate số điện thoại
    if (!validateVietnamesePhone(form.phone)) {
      setShowPhoneErrorModal(true);
      return;
    }

    if (isEditMode && id) {
      // Edit mode - update existing address
      const updatedAddresses = addresses.map(addr => {
        if (addr.id === id) {
          return {
            ...addr,
            fullname: form.fullname,
            phone: formatVietnamesePhone(form.phone),
            province: form.province,
            district: form.district,
            ward: form.ward,
            detail: form.detail
          };
        }
        return addr;
      });
      
      setAddresses(updatedAddresses);
      localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
    } else {
      // Add mode - create new address
      const newId = Date.now().toString(36);
      const newAddress: Address = {
        id: newId,
        fullname: form.fullname,
        phone: formatVietnamesePhone(form.phone),
        province: form.province,
        district: form.district,
        ward: form.ward,
        detail: form.detail
      };

      const updatedAddresses = addresses;

      const next = [...updatedAddresses, newAddress];
      setAddresses(next);
      localStorage.setItem("userAddresses", JSON.stringify(next));
    }
    
    navigate("/addresses");
  };

  const handleClose = () => {
    navigate("/addresses");
  };

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title={isEditMode ? "Sửa địa chỉ" : "Thêm địa chỉ"} showBack onBack={handleClose} />
      
      {/* Content with top padding for header */}
              <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
        <div className="p-4">
          <div className="mb-4">
            <Input 
              label="Họ và tên" 
              placeholder="Nhập họ và tên" 
              value={form.fullname} 
              onChange={(e) => setForm({ ...form, fullname: e.target.value })} 
            />
          </div>
          
          <div className="mb-4">
            <Input 
              label="Số điện thoại" 
              type="text" 
              placeholder="Nhập số điện thoại" 
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })} 
            />
          </div>
          
          <div className="mb-4">
            <Text size="small" className="mb-2 block">Tỉnh/Thành phố</Text>
            <Input 
              placeholder="Chọn tỉnh/thành phố"
              value={form.province}
              readOnly
              onClick={() => setShowProvinceModal(true)}
            />
          </div>
          
          <div className="mb-4">
            <Text size="small" className="mb-2 block">Quận/Huyện</Text>
            <Input 
              placeholder="Chọn quận/huyện"
              value={form.district}
              readOnly
              disabled={!form.province || districts.length === 0}
              onClick={() => setShowDistrictModal(true)}
            />
          </div>
          
          <div className="mb-4">
            <Text size="small" className="mb-2 block">Phường/Xã</Text>
            <Input 
              placeholder="Chọn phường/xã"
              value={form.ward}
              readOnly
              disabled={!form.district || wards.length === 0}
              onClick={() => setShowWardModal(true)}
            />
          </div>
          
          <div className="mb-4">
            <Input 
              label="Địa chỉ cụ thể"
              placeholder="Nhập địa chỉ cụ thể" 
              value={form.detail} 
              onChange={(e) => setForm({ ...form, detail: e.target.value })} 
            />
          </div>
          
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
              {isEditMode ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
            </Button>
          </div>
        </div>
      </div>

      {/* Province Modal */}
      <Modal
        visible={showProvinceModal}
        title="Chọn Tỉnh/Thành phố"
        onClose={() => setShowProvinceModal(false)}
        actions={[
          {
            text: "Đóng",
            onClick: () => setShowProvinceModal(false),
          },
        ]}
      >
        <Box className="max-h-96 overflow-y-auto">
          {provinces.map((province) => (
            <Box
              key={province.code}
              className="p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => handleProvinceSelect(province.name)}
            >
              <Text>{province.name}</Text>
            </Box>
          ))}
        </Box>
      </Modal>

      {/* District Modal */}
      <Modal
        visible={showDistrictModal}
        title="Chọn Quận/Huyện"
        onClose={() => setShowDistrictModal(false)}
        actions={[
          {
            text: "Đóng",
            onClick: () => setShowDistrictModal(false),
          },
        ]}
      >
        <Box className="max-h-96 overflow-y-auto">
          {districts.map((district) => (
            <Box
              key={district.code}
              className="p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => handleDistrictSelect(district.name)}
            >
              <Text>{district.name}</Text>
            </Box>
          ))}
        </Box>
      </Modal>

      {/* Ward Modal */}
      <Modal
        visible={showWardModal}
        title="Chọn Phường/Xã"
        onClose={() => setShowWardModal(false)}
        actions={[
          {
            text: "Đóng",
            onClick: () => setShowWardModal(false),
          },
        ]}
      >
        <Box className="max-h-96 overflow-y-auto">
          {wards.map((ward) => (
            <Box
              key={ward.code}
              className="p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => handleWardSelect(ward.name)}
            >
              <Text>{ward.name}</Text>
            </Box>
          ))}
        </Box>
      </Modal>

      {/* Phone Error Modal */}
      <Modal
        visible={showPhoneErrorModal}
        title="Lỗi số điện thoại"
        onClose={() => setShowPhoneErrorModal(false)}
        actions={[
          {
            text: "Đóng",
            onClick: () => setShowPhoneErrorModal(false),
            highLight: true,
          },
        ]}
      >
        <Box className="text-center py-4">
          <Text className="text-red-600 font-medium">
            {getPhoneErrorMessage()}
          </Text>
        </Box>
      </Modal>
    </Page>
  );
};

export default AddressFormPage;
