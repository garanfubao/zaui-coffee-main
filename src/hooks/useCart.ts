import { useRecoilState } from "recoil";
import { cartState } from "../state/index";
import type { Product, CartItem } from "../types";

export const useCart = () => {
  const [cart, setCart] = useRecoilState<CartItem[]>(cartState);

  const add = (product: Product, quantity = 1, patch?: Partial<CartItem>) => {
    if (!product || !product.id) return;
    
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const idx = safePrev.findIndex((i) => i?.product?.id === product.id);
      if (idx > -1) {
        const clone = [...safePrev];
        clone[idx] = { ...clone[idx], quantity: (clone[idx]?.quantity || 0) + quantity };
        return clone;
      }
      return [...safePrev, { product, quantity, ...patch }];
    });
  };

  const remove = (productId: number) => {
    if (!productId) return;
    
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter((i) => i?.product?.id !== productId);
    });
  };

  const changeQty = (productId: number, quantity: number) => {
    if (!productId) return;
    
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map((i) => (i?.product?.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i));
    });
  };

  const clear = () => setCart([]);

  return { cart: Array.isArray(cart) ? cart : [], add, remove, changeQty, clear };
};