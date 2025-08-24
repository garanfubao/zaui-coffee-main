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
  p(7, "Espresso", 32000, 7, ["coffee"]),
  p(8, "Green Tea Latte", 25000, 8, ["matcha"]),
  { id: 9, name: "Bộ 3 Blue Corner Coffee siêu HOT", price: 25000, image: `https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-rect-1.webp`, description: "Combo siêu hot", categoryId: ["coffee", "milktea", "drinks"], variantId: ["size", "topping"], sale: { type: "percent", percent: 0.2 } },
  { id: 10, name: "Combo Hi Tea Aroma", price: 57000, image: `https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-rect-2.webp`, description: "Combo trà thơm", categoryId: ["coffee", "drinks"], variantId: ["size", "topping"], sale: { type: "fixed", amount: 7000 } },
  { id: 11, name: "Milk Tea Combo", price: 55000, image: `https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-rect-3.webp`, description: "Combo trà sữa", categoryId: ["milktea"], variantId: ["size", "topping"], sale: { type: "percent", percent: 0.5 } },
  p(12, "Cappuccino Mới", 42000, 1, ["coffee"]),
  p(13, "Trà sữa Matcha Đặc Biệt", 38000, 2, ["matcha", "milktea"]),
  p(14, "Americano", 28000, 3, ["coffee"]),
  p(15, "Latte Macchiato", 40000, 4, ["coffee", "milktea"]),
  p(16, "Mocha Latte", 42000, 5, ["coffee", "milktea"]),
  p(17, "Cappuccino Classic", 38000, 6, ["coffee"]),
  p(18, "Flat White", 36000, 7, ["coffee"]),
];

export default products;