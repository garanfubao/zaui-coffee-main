import React from "react";
import { Button, Box, Text } from "zmp-ui";
import { useCart } from "../hooks/useCart";
import type { Product } from "../types";
import { formatVND } from "../utils/price";

const ProductItem: React.FC<{ product: Product }> = ({ product }) => {
  const { add } = useCart();
  
  const handleAddToCart = () => {
    add(product, 1);
    // Show success feedback
    console.log(`Đã thêm ${product.name} vào giỏ hàng`);
  };
  
  return (
    <div className="fkt-product-card">
      <img 
        src={product.image} 
        alt={product.name}
        className="fkt-product-image"
      />
      <div className="fkt-product-info">
        <Text className="fkt-product-name">{product.name}</Text>
        <div className="fkt-product-price">
          <Text className="fkt-price">{formatVND(product.price)}</Text>
          <button 
            className="fkt-add-button"
            onClick={handleAddToCart}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;