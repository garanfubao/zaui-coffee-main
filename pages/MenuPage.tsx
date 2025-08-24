import React from "react";
import { Page, Text } from "zmp-ui";
import products from "../data/products";
import ProductItem from "../components/ProductItem";

const MenuPage: React.FC = () => {
  return (
    <Page className="p-4">
      <Text.Header>Menu</Text.Header>
      {products.map((p) => (
        <ProductItem key={p.id} product={p} />
      ))}
    </Page>
  );
};

export default MenuPage;