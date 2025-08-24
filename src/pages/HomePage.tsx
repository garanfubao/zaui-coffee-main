import React, { useEffect, useState } from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState, cartState } from "../state/index";
import { cartTotalSelector } from "../state/index";
import { formatVND } from "../utils/price";
import ProductItem from "../components/ProductItem";
import products from "../data/products";
import OAFollowCard from "../components/OAFollowCard";
import { getZaloUsername } from "../services/zalo";
import { useNavigate } from "zmp-ui";
import Header from "../components/Header";

const HomePage: React.FC = () => {
  const user = useRecoilValue(userState);
  const cart = useRecoilValue(cartState);
  const total = useRecoilValue(cartTotalSelector);
  const navigate = useNavigate();
  const [username, setUsername] = useState("Khách hàng");

  useEffect(() => {
    const fetchUsername = async () => {
      const zaloUsername = await getZaloUsername();
      setUsername(zaloUsername);
    };
    fetchUsername();
  }, []);

  const iconItems = [
    { 
      icon: "🎁", 
      label: "Tích điểm", 
      action: () => navigate('/points-history')
    },
    { 
      icon: "🏆", 
      label: "Đổi thưởng", 
      action: () => navigate('/rewards')
    },
    { 
      icon: "📋", 
      label: "Lịch sử", 
      action: () => navigate('/orders')
    },
    { 
      icon: "🎫", 
      label: "Voucher", 
      action: () => navigate('/coupons')
    },
  ];

  return (
    <Page className="bg-gray-100" style={{ paddingBottom: cart?.length > 0 ? '100px' : '0' }}>
      {/* Zalo Mini App Header */}
      <Header title="Gà Rán FKT" showMenu showClose />
      
      {/* Content with top padding for header */}
      <div style={{ paddingTop: '120px' }}>
        {/* User greeting section */}
        <div className="fkt-greeting-section">
          <Text className="fkt-greeting">Xin chào,</Text>
          <Text className="fkt-username">{username}</Text>
        </div>
        
        {/* Icons Grid - Centered */}
        <div className="fkt-icon-grid-container">
          <div className="fkt-icon-grid">
            {iconItems.map((item, index) => (
              <div 
                key={index} 
                className="fkt-icon-item cursor-pointer"
                onClick={item.action}
              >
                <div className="icon">
                  <span>{item.icon}</span>
                </div>
                <Text className="label">{item.label}</Text>
              </div>
            ))}
          </div>
        </div>

              {/* Promotion Banner - Compact */}
        <div className="fkt-compact-promo">
          <OAFollowCard />
        </div>

        {/* Hot Combos Section */}
        <div className="fkt-section-title">
          <h2 className="fkt-fire-icon">COMBO SIU HÓT - CHIẾN LÀ MÊ</h2>
          <Text className="fkt-see-all">Tất cả</Text>
        </div>

        <div className="fkt-product-grid">
          {products.slice(0, 2).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>

        {/* Khống lồ Section */}
        <div className="fkt-section-title">
          <h2 className="fkt-fire-icon">COMBO KHỐNG LỒ - SIU LỜI NHUẬN</h2>
          <Text className="fkt-see-all">Tất cả</Text>
        </div>

        <div className="fkt-product-grid">
          {products.slice(2, 4).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>

        {/* Bột Chiên Gà Section */}
        <div className="fkt-section-title">
          <h2>🐔 BỘT CHIÊN GÀ</h2>
          <Text className="fkt-see-all">Tất cả</Text>
        </div>

        <div className="fkt-product-grid">
          {products.slice(4, 6).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>

                 {/* Cart floating button */}
         {cart?.length > 0 && (
           <div className="fkt-cart-floating">
             <Box flex alignItems="center" justifyContent="space-between">
               <Text size="small">
                 Tạm tính: <strong className="fkt-price">{formatVND(total)}</strong>
               </Text>
               <Button 
                 className="fkt-checkout-button"
                 onClick={() => navigate('/cart')}
               >
                 Thanh toán
               </Button>
             </Box>
           </div>
         )}
      </div>
    </Page>
  );
};

export default HomePage;