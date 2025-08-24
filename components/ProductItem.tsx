import React, { useState } from "react";
import { Button, Box, Text } from "zmp-ui";
import type { Product } from "../types";
import { formatVND } from "../utils/price";
import ProductDetailModal from "./ProductDetailModal";

const ProductItem: React.FC<{ product: Product }> = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  
  const handleProductClick = () => {
    setShowModal(true);
  };
  
  return (
    <>
      <div className="fkt-product-card cursor-pointer" onClick={handleProductClick}>
        <img 
          src={product.image} 
          alt={product.name}
          className="fkt-product-image"
        />
                 <div className="fkt-product-info">
           <Text className="fkt-product-name">{product.name}</Text>
           <div className="fkt-product-price">
             <Text className="fkt-price">{formatVND(product.price)}</Text>
             <div className="fkt-add-button">
               +
             </div>
           </div>
         </div>
      </div>

      <ProductDetailModal
        product={product}
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default ProductItem;