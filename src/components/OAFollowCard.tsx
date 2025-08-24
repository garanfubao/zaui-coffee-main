import React, { useEffect } from "react";
import { Button, Box, Text } from "zmp-ui";
import { mountOAFollowWidget, requestFollowOA, openOAChat } from "../services/oa";

const OAFollowCard: React.FC = () => {
  useEffect(() => {
    mountOAFollowWidget("oa-follow-widget", "Quan tâm OA để nhận ưu đãi!");
  }, []);
  
  return (
    <div className="fkt-promotion-banner">
      <div className="fkt-promo-icon">
        <span>🍗</span>
      </div>
      <div className="fkt-promo-content">
        <Text className="fkt-promo-title">
          Quan tâm OA để nhận các chương trình đặc quyền ưu đãi
        </Text>
        <Text className="fkt-promo-subtitle">Gà rán FKT - Official Account</Text>
        <div id="oa-follow-widget" className="mt-2 min-h-[40px]" />
      </div>
      <Button className="fkt-promo-button" onClick={() => requestFollowOA()}>
        Quan tâm
      </Button>
    </div>
  );
};

export default OAFollowCard;