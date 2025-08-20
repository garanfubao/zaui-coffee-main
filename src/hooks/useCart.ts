import { useRecoilState } from "recoil";
import { cartState } from "../state/index";
import type { Product, CartItem } from "../types";

export const useCart = () => {
  const [cart, setCart] = useRecoilState<CartItem[]>(cartState);

  const add = (product: Product, quantity = 1, patch?: Partial<CartItem>) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], quantity: clone[idx].quantity + quantity };
        return clone;
      }
      return [...prev, { product, quantity, ...patch }];
    });
  };

  const remove = (productId: number) => setCart((prev) => prev.filter((i) => i.product.id !== productId));

  const changeQty = (productId: number, quantity: number) =>
    setCart((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i)));

  const clear = () => setCart([]);

  return { cart, add, remove, changeQty, clear };
};