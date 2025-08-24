import { getAccessToken, getUserInfo } from "zmp-sdk";

export interface ZaloUser {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
}

export const getZaloUserInfo = async (): Promise<ZaloUser | null> => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("No access token available");
      return null;
    }

    const userInfo = await getUserInfo();
    return {
      id: userInfo.id,
      name: userInfo.name || "Khách hàng",
      avatar: userInfo.avatar,
      phone: userInfo.phone,
    };
  } catch (error) {
    console.error("Failed to get Zalo user info:", error);
    return null;
  }
};

export const getZaloUsername = async (): Promise<string> => {
  try {
    const userInfo = await getZaloUserInfo();
    return userInfo?.name || "Khách hàng";
  } catch (error) {
    console.error("Failed to get Zalo username:", error);
    return "Khách hàng";
  }
};
