import { atom, selector } from "recoil";
import type { CartItem } from "../types/cart";
import type { Address } from "../types";
import { calcFinalPrice } from "../utils/product";

export const cartState = atom<CartItem[]>({
  key: "cartState",
  default: [],
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        // Ensure the cart is always an array
        if (!Array.isArray(newValue)) {
          console.warn('Cart state must be an array, resetting to empty array');
          return [];
        }
      });
    },
  ],
});

export const cartTotalSelector = selector<number>({
  key: "cartTotalSelector",
  get: ({ get }) => {
    const cart = get(cartState);
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((s, i) => s + i.quantity * calcFinalPrice(i.product, i.options), 0);
  },
});

export const pointsState = atom<number>({ key: "pointsState", default: 0 });

export const userState = atom<{ name: string; id?: string } | null>({
  key: "userState",
  default: { name: "Duc Anh Nguyen" },
});

export const addressesState = atom<Address[]>({
  key: "addressesState",
  default: [],
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        // Ensure the addresses is always an array
        if (!Array.isArray(newValue)) {
          console.warn('Addresses state must be an array, resetting to empty array');
          return [];
        }
      });
    },
  ],
});
export const defaultAddressSelector = selector<Address | null>({
  key: "defaultAddressSelector",
  get: ({ get }) => get(addressesState).find((a) => a.isDefault) || null,
});

