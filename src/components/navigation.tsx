import { useVirtualKeyboardVisible } from "hooks";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem } from "types/menu";
import { BottomNavigation, Icon } from "zmp-ui";
import { CartIcon } from "./cart-icon";

const tabs: Record<string, MenuItem> = {
  "/": {
    label: "Trang chủ",
    icon: <Icon icon="zi-home" />,
  },
  "/cart": {
    label: "Giỏ hàng",
    icon: <CartIcon key="nav-cart-icon" />,
    activeIcon: <CartIcon key="nav-cart-icon-active" active />,
  },
  "/rewards": {
    label: "Tích điểm",
    icon: <Icon icon="zi-star" />,
  },
  "/profile": {
    label: "Cá nhân",
    icon: <Icon icon="zi-user" />,
  },
};

export type TabKeys = keyof typeof tabs;

export const NO_BOTTOM_NAVIGATION_PAGES = [
  "/checkout",
  "/addresses",
  "/address/new",
  "/result",
];

const Navigation = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate();
  const location = useLocation();

  const noBottomNav = NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);

  if (noBottomNav || keyboardVisible) {
    return <></>;
  }

  return (
    <BottomNavigation
      id="footer"
      activeKey={location.pathname}
      onChange={navigate}
      className="z-50"
    >
      {Object.keys(tabs).map((path: TabKeys) => (
        <BottomNavigation.Item
          key={path}
          label={tabs[path].label}
          icon={tabs[path].icon}
          activeIcon={tabs[path].activeIcon}
        />
      ))}
    </BottomNavigation>
  );
};

export default Navigation;