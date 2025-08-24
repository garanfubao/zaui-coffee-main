import React, { useState } from "react";
import { Page, Text, Button, Box, Avatar, Modal } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import Header from "../components/Header";
import { validateVietnamesePhone, formatVietnamesePhone, getPhoneErrorMessage } from "../utils/phone";

interface UserInfo {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | '';
}

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPhoneErrorModal, setShowPhoneErrorModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    // Load saved user info from localStorage
    const saved = localStorage.getItem('userInfo');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      fullName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      gender: ''
    };
  });

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    let formattedValue = value;
    
    // Format phone number for Vietnam
    if (field === 'phone') {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format as Vietnamese phone number
      if (digits.length <= 3) {
        formattedValue = digits;
      } else if (digits.length <= 6) {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else if (digits.length <= 10) {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      } else {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
      }
    }
    
    setUserInfo(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSave = () => {
    // Validate số điện thoại
    if (!validateVietnamesePhone(userInfo.phone)) {
      setShowPhoneErrorModal(true);
      return;
    }

    // Save user info logic here
    console.log("Saving user info:", userInfo);
    
    // Format và save số điện thoại
    const formattedUserInfo = {
      ...userInfo,
      phone: formatVietnamesePhone(userInfo.phone)
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('userInfo', JSON.stringify(formattedUserInfo));
    
    navigate('/profile');
  };

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header 
        title="Chỉnh sửa thông tin" 
        showBack 
      />
      
      {/* Content with top padding for header */}
      <div style={{ paddingTop: '120px' }}>
        {/* Profile Picture */}
        <div className="text-center mb-6">
          <Avatar 
            src="https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/avatar.webp" 
            size={80} 
            className="mx-auto"
          />
        </div>

        {/* Form Fields */}
        <div className="p-4 space-y-6">
          {/* Full Name */}
          <div className="fkt-form-field">
            <label className="fkt-form-label">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="fkt-input-container">
              <input
                type="text"
                value={userInfo.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="fkt-input"
                placeholder="Nhập họ và tên"
              />
              <button className="fkt-clear-button">
                <span>✕</span>
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="fkt-form-field">
            <label className="fkt-form-label">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="fkt-input-container">
              <div className="fkt-phone-prefix">+84</div>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="fkt-input fkt-phone-input"
                placeholder="Nhập số điện thoại"
              />
              <button className="fkt-clear-button">
                <span>✕</span>
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="fkt-form-field">
            <label className="fkt-form-label">Email</label>
            <div className="fkt-input-container">
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="fkt-input"
                placeholder="Nhập địa chỉ email"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="fkt-form-field">
            <label className="fkt-form-label">Ngày sinh</label>
            <div className="fkt-input-container">
              <input
                type="date"
                value={userInfo.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="fkt-input"
                placeholder="Chọn ngày sinh"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="fkt-form-field">
            <label className="fkt-form-label">Giới tính</label>
            <div className="fkt-radio-group">
              <label className="fkt-radio-item">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={userInfo.gender === 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="fkt-radio"
                />
                <span className="fkt-radio-label">Nam</span>
              </label>
              <label className="fkt-radio-item">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={userInfo.gender === 'female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="fkt-radio"
                />
                <span className="fkt-radio-label">Nữ</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4">
          <Button 
            className="fkt-save-button"
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>

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

export default ProfileEditPage;
