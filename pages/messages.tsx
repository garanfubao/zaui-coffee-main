import React from "react";
import { Box, Page, Text, Button } from "zmp-ui";
import { openOAChat } from "../services/oa";
import Header from "../components/Header";

const MessagesPage: React.FC = () => {
  const handleConnectOA = () => {
    openOAChat("Xin chào! Tôi muốn đặt hàng và nhận tư vấn.");
  };

  return (
    <Page>
      {/* Zalo Mini App Header */}
      <Header title="Tin nhắn" showBack showClose />
      
      {/* Content with top padding for header */}
      <div style={{ paddingTop: '120px' }}>
        <div className="p-4 text-center">
        <Box className="mb-8">
          <span style={{ fontSize: '64px' }}>💬</span>
        </Box>
        
        <Text className="text-xl font-bold mb-4">Kết nối với Gà Rán FKT</Text>
        <Text className="text-gray-600 mb-8">
          Nhắn tin trực tiếp với chúng tôi để được tư vấn và hỗ trợ đặt hàng
        </Text>
        
        <Button 
          className="fkt-checkout-button"
          onClick={handleConnectOA}
        >
          Nhắn tin ngay
        </Button>
        
        <div className="mt-8">
          <Text className="text-sm text-gray-500">
            Hoặc gọi hotline: 1900-xxxx
          </Text>
        </div>
        </div>
      </div>
    </Page>
  );
};

export default MessagesPage;