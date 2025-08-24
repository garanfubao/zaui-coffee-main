import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from 'zmp-ui';
import { CartIcon } from './cart-icon';

interface BottomNavItemProps {
  to: string;
  label: string;
  children: React.ReactNode;
}

function BottomNavItem({ to, label, children }: BottomNavItemProps) {
  const { pathname } = useLocation();
  const active = pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`bottom-nav-item ${active ? 'active' : ''}`}
    >
      <div className="bottom-nav-icon">
        {children}
      </div>
      <div className="bottom-nav-label">{label}</div>
    </Link>
  );
}

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white h-20 flex items-center px-2 safe-area z-50">
      <BottomNavItem to="/" label="Trang chủ">
        <Icon icon="zi-home" size={24} />
      </BottomNavItem>
      <BottomNavItem to="/cart" label="Giỏ hàng">
        <CartIcon size={24} />
      </BottomNavItem>
      <BottomNavItem to="/messages" label="Tin nhắn">
        <Icon icon="zi-chat" size={24} />
      </BottomNavItem>
      <BottomNavItem to="/profile" label="Cá nhân">
        <Icon icon="zi-user" size={24} />
      </BottomNavItem>
    </div>
  );
}
