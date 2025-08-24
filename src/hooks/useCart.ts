import { useRecoilState } from "recoil";
import { cartState } from "../state/index";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";

export const useCart = () => {
  const [cart, setCart] = useRecoilState<CartItem[]>(cartState);

  const add = (product: Product, quantity = 1, options?: any) => {
    if (!product || !product.id) return;
    
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      
      // Helper function to normalize options for comparison
      const normalizeOptions = (opts: any) => {
        if (!opts || Object.keys(opts).length === 0) return 'default';
        // Sort keys to ensure consistent comparison
        const sortedKeys = Object.keys(opts).sort();
        const normalized = sortedKeys.reduce((acc, key) => {
          // Sort arrays to ensure consistent comparison
          if (Array.isArray(opts[key])) {
            acc[key] = [...opts[key]].sort();
          } else {
            acc[key] = opts[key];
          }
          return acc;
        }, {} as any);
        return JSON.stringify(normalized);
      };
      
      const itemKey = normalizeOptions(options);
      console.log('Adding product:', product.name, 'with options:', options, 'normalized key:', itemKey);
      
      let existingItemKey = '';
      const idx = safePrev.findIndex((i) => {
        if (i?.product?.id !== product.id) return false;
        const existingKey = normalizeOptions(i.options);
        existingItemKey = existingKey;
        console.log('Comparing with existing item:', i.product.name, 'options:', i.options, 'normalized key:', existingKey);
        return existingKey === itemKey;
      });
      
      console.log('Found existing item at index:', idx);
      
      if (idx > -1) {
        const clone = [...safePrev];
        // Ensure existing item has uniqueId
        if (!clone[idx].uniqueId) {
          clone[idx] = { ...clone[idx], uniqueId: `${product.id}-${existingItemKey}` };
        }
        clone[idx] = { ...clone[idx], quantity: (clone[idx]?.quantity || 0) + quantity };
        console.log('Updated quantity for existing item');
        return clone;
      }
      console.log('Adding new item to cart');
      // Create a unique ID for this cart item
      const uniqueId = `${product.id}-${itemKey}`;
      return [...safePrev, { product, quantity, options, uniqueId }];
    });
  };

  const remove = (uniqueId: string) => {
    if (!uniqueId) return;
    
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter((i) => i?.uniqueId !== uniqueId);
    });
  };

  const changeQty = (uniqueId: string, quantity: number) => {
    if (!uniqueId) return;
    
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map((i) => (i?.uniqueId === uniqueId ? { ...i, quantity: Math.max(1, quantity) } : i));
    });
  };

  const clear = () => setCart([]);

  // Ensure all cart items have uniqueId
  const ensureUniqueIds = (cartItems: CartItem[]) => {
    return cartItems.map((item, index) => {
      if (!item.uniqueId) {
        // Create a fallback uniqueId for items that don't have one
        const normalizeOptions = (opts: any) => {
          if (!opts || Object.keys(opts).length === 0) return 'default';
          const sortedKeys = Object.keys(opts).sort();
          const normalized = sortedKeys.reduce((acc, key) => {
            if (Array.isArray(opts[key])) {
              acc[key] = [...opts[key]].sort();
            } else {
              acc[key] = opts[key];
            }
            return acc;
          }, {} as any);
          return JSON.stringify(normalized);
        };
        const itemKey = normalizeOptions(item.options);
        const fallbackId = `${item.product.id}-${itemKey}-${index}`;
        console.log('Creating fallback uniqueId:', fallbackId, 'for item:', item.product.name);
        return { ...item, uniqueId: fallbackId };
      }
      return item;
    });
  };

  return { 
    cart: Array.isArray(cart) ? ensureUniqueIds(cart) : [], 
    add, 
    remove, 
    changeQty, 
    clear 
  };
};