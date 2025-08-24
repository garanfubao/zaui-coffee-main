import React from "react";
import { useRecoilState } from "recoil";
import { addressesState } from "../state/index";
import type { Address } from "../types";

export const useAddress = () => {
  const [addresses, setAddresses] = useRecoilState<Address[]>(addressesState);

  // Load addresses from localStorage on mount
  React.useEffect(() => {
    try {
      const savedAddresses = localStorage.getItem("userAddresses");
      console.log("Loading addresses from localStorage:", savedAddresses);
      
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        if (Array.isArray(parsedAddresses)) {
          console.log("Setting addresses from localStorage:", parsedAddresses);
          setAddresses(parsedAddresses);
        }
      }
    } catch (error) {
      console.error("Error loading addresses from localStorage:", error);
    }
  }, []); // Remove setAddresses from dependency to avoid infinite loop

  // Save addresses to localStorage whenever addresses change
  React.useEffect(() => {
    try {
      console.log("Saving addresses to localStorage:", addresses);
      localStorage.setItem("userAddresses", JSON.stringify(addresses));
    } catch (error) {
      console.error("Error saving addresses to localStorage:", error);
    }
  }, [addresses]);

  const addAddress = (address: Address) => {
    console.log("Adding address:", address);
    
    if (!address.fullname || !address.phone || !address.detail) {
      console.warn("Address must have fullname, phone and detail");
      return;
    }

    setAddresses((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      console.log("Previous addresses:", safePrev);
      
      const newAddresses = [...safePrev, address];
      console.log("New addresses after adding:", newAddresses);
      return newAddresses;
    });
  };

  const removeAddress = (addressId: string) => {
    console.log("Removing address:", addressId);
    
    if (!addressId) return;
    
    // Nếu địa chỉ bị xóa là địa chỉ đang được chọn, thì xóa selectedAddressId
    if (selectedAddressId === addressId) {
      localStorage.removeItem("selectedAddressId");
      setSelectedAddressIdState(null);
    }
    
    setAddresses((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const filtered = safePrev.filter((addr) => addr.id !== addressId);
      console.log("Addresses after removing:", filtered);
      return filtered;
    });
  };

  const setDefault = (addressId: string) => {
    console.log("Setting default address:", addressId);
    
    if (!addressId) return;
    
    // Lưu địa chỉ đã chọn thay vì đặt mặc định
    setSelectedAddress(addressId);
  };

  const updateAddress = (addressId: string, updates: Partial<Address>) => {
    console.log("Updating address:", addressId, updates);
    
    if (!addressId) return;
    
    setAddresses((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.map((addr) => 
        addr.id === addressId ? { ...addr, ...updates } : addr
      );
      console.log("Addresses after updating:", updated);
      return updated;
    });
  };

  const getDefaultAddress = () => {
    // Trả về địa chỉ đã chọn thay vì địa chỉ mặc định
    return getSelectedAddress();
  };

  // Lấy địa chỉ đã chọn từ localStorage
  const getSelectedAddress = () => {
    try {
      const selectedAddressId = localStorage.getItem("selectedAddressId");
      if (selectedAddressId) {
        const safeAddresses = Array.isArray(addresses) ? addresses : [];
        return safeAddresses.find(addr => addr.id === selectedAddressId) || null;
      }
      return null;
    } catch (error) {
      console.error("Error getting selected address:", error);
      return null;
    }
  };

  // Lưu địa chỉ đã chọn vào localStorage và cập nhật state
  const setSelectedAddress = (addressId: string) => {
    try {
      localStorage.setItem("selectedAddressId", addressId);
      setSelectedAddressIdState(addressId); // Cập nhật state để trigger re-render
      console.log("Selected address saved:", addressId);
    } catch (error) {
      console.error("Error saving selected address:", error);
    }
  };

  // Lấy selectedAddressId từ localStorage
  const [selectedAddressId, setSelectedAddressIdState] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const savedSelectedAddressId = localStorage.getItem("selectedAddressId");
      setSelectedAddressIdState(savedSelectedAddressId);
    } catch (error) {
      console.error("Error loading selected address ID:", error);
    }
  }, []);

  return {
    addresses: Array.isArray(addresses) ? addresses : [],
    addAddress,
    removeAddress,
    setDefault,
    updateAddress,
    getDefaultAddress,
    getSelectedAddress,
    setSelectedAddress,
    selectedAddressId,
  };
};
