import { useState } from "react";
import { validateVietnamesePhone, formatVietnamesePhone } from "../utils/phone";

export const usePhoneValidation = () => {
  const [showPhoneErrorModal, setShowPhoneErrorModal] = useState(false);

  const validatePhone = (phone: string): boolean => {
    if (!validateVietnamesePhone(phone)) {
      setShowPhoneErrorModal(true);
      return false;
    }
    return true;
  };

  const formatPhone = (phone: string): string => {
    return formatVietnamesePhone(phone);
  };

  const closePhoneErrorModal = () => {
    setShowPhoneErrorModal(false);
  };

  return {
    showPhoneErrorModal,
    validatePhone,
    formatPhone,
    closePhoneErrorModal,
  };
};
