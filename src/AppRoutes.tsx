import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ZMPRouter, Icon } from "zmp-ui";

import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import RewardsPage from "./pages/RewardsPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import AddressBookPage from "./pages/AddressBookPage";
import AddressFormPage from "./pages/AddressFormPage";
import MessagesPage from "./pages/messages";
import CouponPage from "./pages/CouponPage";
import PointsHistoryPage from "./pages/PointsHistoryPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import { CartIcon } from "./components/cart-icon";
import { ErrorBoundary } from "./components/error-boundary";
import BottomNavigation from "./components/BottomNavigation";

const RoutesWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div key="routes-wrapper" className="flex flex-col h-screen">
      <ErrorBoundary>
        <div className="flex-1 overflow-auto pb-20">
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
            <Route path="/coupons" element={<CouponPage />} />
            <Route path="/points-history" element={<PointsHistoryPage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
          </Routes>
        </div>
      </ErrorBoundary>

             <ErrorBoundary>
         <BottomNavigation />
       </ErrorBoundary>
    </div>
  );
};

const AppRoutes: React.FC = () => (
  <ZMPRouter key="zmp-router">
    <RoutesWrapper />
  </ZMPRouter>
);

export default AppRoutes;
