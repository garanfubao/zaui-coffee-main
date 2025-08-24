import React, { useState, useEffect } from "react";
import { Box, Header, Page, Text, Input } from "zmp-ui";
import { useNavigate, useLocation } from "react-router";

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

const SelectAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        console.log("Fetching provinces from API...");
        const response = await fetch('https://provinces.open-api.vn/api/?depth=3');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API response:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setProvinces(data);
        } else {
          console.warn("API returned empty or invalid data, using fallback");
          setProvinces(fallbackProvinces);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
        setError("Không thể tải dữ liệu từ API, sử dụng dữ liệu mẫu");
        setProvinces(fallbackProvinces);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceSelect = (province: Province) => {
    console.log("Selected province:", province);
    setSelectedProvince(province);
    setDistricts(province.districts);
    setSelectedDistrict(null);
    setWards([]);
    setSelectedWard(null);
  };

  const handleDistrictSelect = (district: District) => {
    console.log("Selected district:", district);
    setSelectedDistrict(district);
    setWards(district.wards);
    setSelectedWard(null);
  };

  const handleWardSelect = (ward: Ward) => {
    console.log("Selected ward:", ward);
    setSelectedWard(ward);
    
    // Trả về địa chỉ đã chọn
    const addressData = {
      province: selectedProvince?.name || "",
      district: selectedDistrict?.name || "",
      ward: ward.name || ""
    };

    console.log("Saving address data to localStorage:", addressData);
    // Lưu vào localStorage để form có thể đọc
    localStorage.setItem("selectedAddress", JSON.stringify(addressData));
    navigate(-1);
  };

  const filteredProvinces = provinces.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredWards = wards.filter(w => 
    w.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <Page>
        <Header title="Chọn địa chỉ" />
        <Box className="p-4 text-center">
          <Text>Đang tải dữ liệu...</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page>
      <Header title="Chọn địa chỉ" />
      <Box className="p-4">
        {error && (
          <Box className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
            <Text size="small" className="text-yellow-800">{error}</Text>
          </Box>
        )}
        
        <Input
          placeholder="Tìm kiếm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4"
        />
        
        {!selectedProvince && (
          <Box>
            <Text.Title size="small" className="mb-2">Tỉnh/Thành phố</Text.Title>
            {filteredProvinces.length === 0 ? (
              <Text className="text-gray-500">Không tìm thấy kết quả</Text>
            ) : (
              filteredProvinces.map((province) => (
                <Box
                  key={province.code}
                  className="py-3 border-b border-divider"
                  onClick={() => handleProvinceSelect(province)}
                >
                  <Text>{province.name}</Text>
                </Box>
              ))
            )}
          </Box>
        )}

        {selectedProvince && !selectedDistrict && (
          <Box>
            <Text.Title size="small" className="mb-2">Quận/Huyện</Text.Title>
            <Box 
              className="py-2 border-b border-divider text-gray-500"
              onClick={() => {
                setSelectedProvince(null);
                setDistricts([]);
                setWards([]);
                setSelectedDistrict(null);
                setSelectedWard(null);
              }}
            >
              <Text>← Quay lại chọn tỉnh/thành phố</Text>
            </Box>
            {filteredDistricts.length === 0 ? (
              <Text className="text-gray-500">Không tìm thấy kết quả</Text>
            ) : (
              filteredDistricts.map((district) => (
                <Box
                  key={district.code}
                  className="py-3 border-b border-divider"
                  onClick={() => handleDistrictSelect(district)}
                >
                  <Text>{district.name}</Text>
                </Box>
              ))
            )}
          </Box>
        )}

        {selectedDistrict && (
          <Box>
            <Text.Title size="small" className="mb-2">Phường/Xã</Text.Title>
            <Box 
              className="py-2 border-b border-divider text-gray-500"
              onClick={() => {
                setSelectedDistrict(null);
                setWards([]);
                setSelectedWard(null);
              }}
            >
              <Text>← Quay lại chọn quận/huyện</Text>
            </Box>
            {filteredWards.length === 0 ? (
              <Text className="text-gray-500">Không tìm thấy kết quả</Text>
            ) : (
              filteredWards.map((ward) => (
                <Box
                  key={ward.code}
                  className="py-3 border-b border-divider"
                  onClick={() => handleWardSelect(ward)}
                >
                  <Text>{ward.name}</Text>
                </Box>
              ))
            )}
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default SelectAddressPage;