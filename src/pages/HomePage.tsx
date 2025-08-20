import React from "react";
import { Page, Swiper, Box, Text } from "zmp-ui";
import ProductItem from "../components/ProductItem";
import products from "../data/products";
import OAFollowCard from "../components/OAFollowCard";
import { QuickActions } from "../components/QuickActions";

const banners = [
  "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/banner-1.webp",
  "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/banner-2.webp",
  "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/banner-3.webp",
];

const HomePage: React.FC = () => {
  return (
    <Page className="p-4">
      <Swiper autoplay loop>
        {banners.map((src, idx) => (
          <Swiper.Slide key={idx}>
            <img src={src} alt="banner" className="w-full rounded-xl" />
          </Swiper.Slide>
        ))}
      </Swiper>

      <QuickActions />
      <OAFollowCard />

      <Box mt={4}>
        <Text.Header>COMBO SIU HOT - CHIỀN LÀ MÊ 🔥</Text.Header>
        {products.slice(0, 2).map((p) => (
          <ProductItem key={p.id} product={p} />
        ))}
      </Box>
    </Page>
  );
};

export default HomePage;