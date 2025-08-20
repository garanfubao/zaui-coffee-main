import React from "react";
import { Page, List, Text, Button, Box, Icon } from "zmp-ui";
import { useCart } from "../hooks/useCart";
import { formatVND } from "../utils/price";
import CartBar from "../components/CartBar";

const CartPage: React.FC = () => {
  const { cart, changeQty, remove } = useCart();

  return (
    <Page className="p-4 pb-24">
      <Text.Header>Giỏ hàng</Text.Header>
      {cart.length === 0 ? (
        <Text>Giỏ hàng trống.</Text>
      ) : (
        <List>
          {cart.map((i) => (
            <List.Item
              key={i.product.id}
              title={i.product.name}
              suffix={
                <Box flex alignItems="center" className="gap-2">
                  <Button size="small" onClick={() => changeQty(i.product.id, i.quantity - 1)}>-</Button>
                  <Text>{i.quantity}</Text>
                  <Button size="small" onClick={() => changeQty(i.product.id, i.quantity + 1)}>+</Button>
                  <Button size="small" variant="tertiary" onClick={() => remove(i.product.id)}>
                    <Icon icon="zi-delete" />
                  </Button>
                </Box>
              }
            >
              <Text className="text-red-500">{formatVND(i.product.price)}</Text>
            </List.Item>
          ))}
        </List>
      )}
      <CartBar />
    </Page>
  );
};

export default CartPage;