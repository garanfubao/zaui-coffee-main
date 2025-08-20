import type { Product } from "../types";

const p = (id: number, name: string, price: number, imgIndex: number, categoryId: string[] = ["coffee"]) => ({
  id, name, price, image: `https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-${imgIndex}.webp`,
  description: "Món tiêu chuẩn từ demo zaui-coffee",
  categoryId,
  variantId: ["size", "topping"],
});

const products: Product[] = [
  p(1, "Caramel Latte", 35000, 1, ["coffee", "drinks"]),
  p(2, "Mocha Frappuccino", 45000, 2, ["coffee"]),
  { id: 3, name: "Grilled Pork Banh Mi", price: 30000, image: `https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-3.webp`, description: "Bánh mì thịt nướng", categoryId: ["food", "bread"], variantId: ["size"] },
  p(5, "Vanilla Latte", 35000, 5, ["coffee", "matcha"]),
  p(6, "Caramel Macchiato", 38000, 6, ["coffee", "milktea"]),
];

export default products;