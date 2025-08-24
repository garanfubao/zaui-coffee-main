import React from "react";
import { Box, Text, Icon } from "zmp-ui";
import { useNavigate } from "zmp-ui";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showClose?: boolean;
  onClose?: () => void;
  showMenu?: boolean;
  onMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showClose = false,
  onClose,
  showMenu = false,
  onMenu,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fkt-zalo-header">
      {/* Header Bar */}
      <div className="fkt-header-bar">
        <div className="fkt-header-left">
          {showBack && (
            <button className="fkt-back-button" onClick={handleBack}>
              <Icon icon="zi-chevron-left" />
            </button>
          )}
        </div>

        <div className="fkt-header-title">
          <Text className="fkt-title-text">{title}</Text>
        </div>

        <div className="fkt-header-right">
          <div className="fkt-mini-app-controls">
            {showMenu && (
              <button className="fkt-control-button" onClick={onMenu}>
                <Icon icon="zi-more-horiz" />
              </button>
            )}
            {showClose && (
              <button className="fkt-control-button" onClick={handleClose}>
                <Icon icon="zi-close" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
