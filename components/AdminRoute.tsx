import React from "react";
import { Page, Text, Box, Button } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState } from "../state";
import { isAdmin } from "../config/admin";
import Header from "./Header";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  
  // Lấy Zalo User ID từ user state
  const userZaloId = user?.id;
  
  // Kiểm tra quyền admin
  const hasAdminAccess = isAdmin(userZaloId);

  if (!hasAdminAccess) {
    return (
      <Page>
        <Header title="Truy cập bị từ chối" showBack />
        <div style={{ paddingTop: 'calc(60px + env(safe-area-inset-top) + 20px)' }}>
          <div className="p-4">
            <Box className="text-center py-20">
              <Box className="mb-4">
                <span style={{ fontSize: '48px' }}>🚫</span>
              </Box>
              <Text className="font-bold text-lg mb-4">Truy cập bị từ chối</Text>
              <Text className="text-gray-500 mb-6">
                Bạn không có quyền truy cập trang này. Chỉ admin mới có thể truy cập quản lý đơn hàng.
              </Text>
              <Text className="text-sm text-gray-400 mb-6">
                Zalo User ID: {userZaloId || 'Không xác định'}
              </Text>
              <Button 
                className="fkt-checkout-button"
                onClick={() => navigate('/profile')}
              >
                Về trang cá nhân
              </Button>
            </Box>
          </div>
        </div>
      </Page>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
