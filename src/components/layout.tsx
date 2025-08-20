import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "zmp-ui";
import Navigation from "./navigation";
import HomePage from "../pages/HomePage";
import MenuPage from "../pages/MenuPage";
import RewardsPage from "../pages/RewardsPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/ProfilePage";
import CheckoutPage from "../pages/CheckoutPage";
import AddressBookPage from "../pages/AddressBookPage";
import AddressFormPage from "../pages/AddressFormPage";
import { getSystemInfo } from "zmp-sdk";
import { ScrollRestoration } from "./scroll-restoration";
import { useHandlePayment } from "hooks";

if (import.meta.env.DEV) {
  document.body.style.setProperty("--zaui-safe-area-inset-top", "24px");
} else if (getSystemInfo().platform === "android") {
  const statusBarHeight =
    window.ZaloJavaScriptInterface?.getStatusBarHeight() ?? 0;
  const androidSafeTop = Math.round(statusBarHeight / window.devicePixelRatio);
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`
  );
}

export const Layout = () => {
  useHandlePayment();

  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/menu" element={<MenuPage />}></Route>
          <Route path="/rewards" element={<RewardsPage />}></Route>
          <Route path="/cart" element={<CartPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
          <Route path="/checkout" element={<CheckoutPage />}></Route>
          <Route path="/addresses" element={<AddressBookPage />}></Route>
          <Route path="/address/new" element={<AddressFormPage />}></Route>
        </Routes>
      </Box>
      <Navigation />
    </Box>
  );
};

