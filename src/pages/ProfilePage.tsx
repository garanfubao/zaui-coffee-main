import React from "react";
import { Page, Box, Avatar, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState, pointsState } from "../state/index";
import { requestFollowOA, openOAChat, sendMessageFromOA } from "../services/oa";
import { isAdmin } from "../config/admin";
import Header from "../components/Header";
import OAFollowCard from "../components/OAFollowCard";
import { PROFILE_ICON_URLS, PROFILE_FALLBACK_ICONS } from "../config/profile-icons";
import IconImage from "../components/IconImage";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const points = useRecoilValue(pointsState);

  const profileItems = [
    {
      icon: PROFILE_ICON_URLS.EDIT_PROFILE,
      fallbackIcon: PROFILE_FALLBACK_ICONS.EDIT_PROFILE,
      title: "Chỉnh sửa thông tin",
      subtitle: "",
      action: () => navigate('/profile/edit')
    },
    {
      icon: PROFILE_ICON_URLS.ORDERS,
      fallbackIcon: PROFILE_FALLBACK_ICONS.ORDERS,
      title: "Đơn hàng",
      subtitle: "Xem tất cả",
      action: () => navigate('/orders')
    },
    // Chỉ hiển thị nút admin cho admin
    ...(isAdmin(user?.id) ? [{
      icon: PROFILE_ICON_URLS.ADMIN_ORDERS,
      fallbackIcon: PROFILE_FALLBACK_ICONS.ADMIN_ORDERS,
      title: "Quản lý đơn hàng",
      subtitle: "Dành cho admin",
      action: () => navigate('/admin/orders')
    }] : []),
    {
      icon: PROFILE_ICON_URLS.POINTS_HISTORY,
      fallbackIcon: PROFILE_FALLBACK_ICONS.POINTS_HISTORY,
      title: "Lịch sử tích điểm",
      subtitle: "",
      action: () => navigate('/points-history')
    },
    {
      icon: PROFILE_ICON_URLS.ADDRESS_BOOK,
      fallbackIcon: PROFILE_FALLBACK_ICONS.ADDRESS_BOOK,
      title: "Sổ địa chỉ",
      subtitle: "",
      action: () => navigate('/addresses')
    }
  ];

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title="Cá nhân" />
      
      {/* Content with top padding for header */}
      <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
        {/* User greeting section */}
        <div className="fkt-greeting-section">
          <Text className="fkt-greeting">Xin chào,</Text>
          <Text className="fkt-username">{user?.name || "Duc Anh Nguyen"}</Text>
        </div>

        <div className="p-4">
        {/* Profile Menu Items */}
        {profileItems.map((item, index) => (
          <div 
            key={index} 
            className="fkt-profile-item cursor-pointer"
            onClick={item.action}
          >
            <div className="fkt-profile-icon">
              <IconImage 
                src={item.icon} 
                alt={item.title}
                fallbackIcon={item.fallbackIcon}
                style={{ width: '24px', height: '24px' }}
              />
            </div>
            <div className="fkt-profile-content">
              <Text className="fkt-profile-title">{item.title}</Text>
              {item.subtitle && (
                <Text className="fkt-profile-subtitle">{item.subtitle}</Text>
              )}
            </div>
            <Icon icon="zi-chevron-right" className="text-gray-400" />
          </div>
        ))}

        {/* OA Follow Card */}
        <div className="mt-6">
          <OAFollowCard />
        </div>

        {/* QR Code Section */}
        <div className="fkt-card text-center mt-6">
          <Text className="font-medium mb-4">
            Chia sẻ mã QR này để kết bạn nhanh chóng, bảo mật
          </Text>
          
          <Box className="mb-4">
            <Avatar src="https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/avatar.webp" size={48} />
            <Text className="font-bold text-lg mt-2">Gà Rán FKT</Text>
          </Box>
          
          {/* Simple QR Code representation */}
          <Box className="w-32 h-32 mx-auto bg-black flex items-center justify-center rounded-lg mb-4">
            <Box className="w-24 h-24 bg-white rounded grid grid-cols-5 gap-1 p-2">
              {[...Array(25)].map((_, i) => (
                <div 
                  key={i} 
                  className={`bg-black rounded-sm ${
                    [0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24].includes(i) ? 'opacity-100' : 
                    [6,7,8,11,13,16,17,18].includes(i) ? 'opacity-0' : 'opacity-60'
                  }`}
                />
              ))}
            </Box>
          </Box>
        </div>

        {/* Admin Info */}
        {isAdmin(user?.id) && (
          <div className="fkt-card mt-4">
            <Text className="font-bold mb-2">🔐 Thông tin Admin</Text>
            <Text className="text-sm text-gray-600 mb-2">
              Zalo User ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{user?.id || 'Chưa có'}</span>
            </Text>
            <Text className="text-xs text-gray-500">
              ID này được sử dụng để xác định quyền admin
            </Text>
          </div>
        )}

        {/* OA Actions */}
        <div className="fkt-card mt-4">
          <Box className="flex gap-2 mb-4">
            <Button 
              size="small" 
              variant="secondary" 
              onClick={() => requestFollowOA()}
              className="flex-1"
            >
              Quan tâm OA
            </Button>
            <Button 
              size="small" 
              onClick={() => openOAChat()}
              className="flex-1 fkt-checkout-button"
            >
              Nhắn OA
            </Button>
          </Box>
          
          <Box className="border-t pt-4">
            <Text className="font-medium mb-2">Nhận mã ưu đãi qua OA</Text>
            <Text className="text-gray-500 text-sm mb-3">
              Gửi tin nhắn OA để nhận voucher demo
            </Text>
            <Button 
              size="small" 
              className="fkt-promo-button"
              onClick={() => sendMessageFromOA('Gửi voucher giúp tôi với!')}
            >
              Gửi tin nhắn
            </Button>
          </Box>
        </div>
        </div>
      </div>
    </Page>
  );
};

export default ProfilePage;