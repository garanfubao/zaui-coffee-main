import { atom, selector } from "recoil";
import type { CartItem, Address } from "../types";

export const cartState = atom<CartItem[]>({
  key: "cartState",
  default: [],
});

export const cartTotalSelector = selector<number>({
  key: "cartTotalSelector",
  get: ({ get }) => get(cartState).reduce((s, i) => s + i.product.price * i.quantity, 0),
});

export const pointsState = atom<number>({ key: "pointsState", default: 0 });

export const userState = atom<{ name: string } | null>({
  key: "userState",
  default: { name: "Duc Anh Nguyen" },
});

export const addressesState = atom<Address[]>({ key: "addressesState", default: [] });
export const defaultAddressSelector = selector<Address | null>({
  key: "defaultAddressSelector",
  get: ({ get }) => get(addressesState).find((a) => a.isDefault) || null,
});

