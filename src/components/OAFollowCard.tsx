import React, { useEffect } from "react";
import { Button, Box } from "zmp-ui";
import { mountOAFollowWidget, requestFollowOA, openOAChat } from "../services/oa";

const OAFollowCard: React.FC = () => {
  useEffect(() => {
    mountOAFollowWidget("oa-follow-widget", "Quan tâm OA để nhận ưu đãi!");
  }, []);
  return (
    <Box className="rounded-2xl shadow-md p-4 flex items-center gap-4">
      <div id="oa-follow-widget" className="flex-1 min-h-[60px]" />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => requestFollowOA()}>Quan tâm</Button>
        <Button onClick={() => openOAChat("Mình muốn đặt đơn ạ")}>Nhắn OA</Button>
      </div>
    </Box>
  );
};

export default OAFollowCard;