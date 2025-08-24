export type VariantOption = {
  id: string;
  label: string;
  priceChange?: { type: "fixed" | "percent"; amount?: number; percent?: number };
};

export type VariantSchema = {
  id: string;
  label: string;
  type: "single" | "multiple";
  default?: string | string[];
  options: VariantOption[];
};

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  categoryId?: string[];
  variantId?: string[];
  sale?: { type: "fixed" | "percent"; amount?: number; percent?: number };
};

export type CartItem = {
  product: Product;
  quantity: number;
  selected?: Record<string, string | string[]>;
  note?: string;
};

export type Address = {
  id: string;
  fullname: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
};
