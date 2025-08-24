import React from "react";
import { Modal, Box, Text } from "zmp-ui";
import { getPhoneErrorMessage } from "../utils/phone";

interface PhoneValidationModalProps {
  visible: boolean;
  onClose: () => void;
}

const PhoneValidationModal: React.FC<PhoneValidationModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      title="Lỗi số điện thoại"
      onClose={onClose}
      actions={[
        {
          text: "Đóng",
          onClick: onClose,
          highLight: true,
        },
      ]}
    >
      <Box className="text-center py-4">
        <Text className="text-red-600 font-medium">
          {getPhoneErrorMessage()}
        </Text>
      </Box>
    </Modal>
  );
};

export default PhoneValidationModal;
