import React from "react";
import { Box, Text, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };



  return (
    <div className="fkt-zalo-header">
      {/* Header Bar */}
      <div className="fkt-header-bar">
        <div className="fkt-header-left-content">
          {showBack && (
            <button className="fkt-back-button" onClick={handleBack}>
              <Icon icon="zi-chevron-left" />
            </button>
          )}
          <div className="fkt-header-title">
            <Text className="fkt-title-text">{title}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
