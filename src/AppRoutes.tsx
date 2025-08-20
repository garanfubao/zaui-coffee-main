import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ZMPRouter, BottomNavigation, Icon } from "zmp-ui";

import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import RewardsPage from "./pages/RewardsPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import AddressBookPage from "./pages/AddressBookPage";
import AddressFormPage from "./pages/AddressFormPage";
import MessagesPage from "./pages/messages";
import { CartIcon } from "./components/cart-icon";

const RoutesWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div key="routes-wrapper">
      <Routes key="main-routes">
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/addresses" element={<AddressBookPage />} />
        <Route path="/address/new" element={<AddressFormPage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Routes>

      <BottomNavigation key="bottom-nav" activeKey={location.pathname} onChange={navigate}>
        <BottomNavigation.Item
          key="/"
          label="Trang chủ"
          icon={<Icon icon="zi-home" />}
        />
        <BottomNavigation.Item
          key="/cart"
          label="Giỏ hàng"
          icon={<CartIcon key="cart-icon" />}
          activeIcon={<CartIcon key="cart-icon-active" active />}
        />
        <BottomNavigation.Item
          key="/messages"
          label="Tin nhắn"
          icon={<Icon icon="zi-chat" />}
        />
        <BottomNavigation.Item
          key="/profile"
          label="Cá nhân"
          icon={<Icon icon="zi-user" />}
        />
      </BottomNavigation>
    </div>
  );
};

const AppRoutes: React.FC = () => (
  <ZMPRouter key="zmp-router">
    <RoutesWrapper />
  </ZMPRouter>
);

export default AppRoutes;
