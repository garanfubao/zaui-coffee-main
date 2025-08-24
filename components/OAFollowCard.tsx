import React from "react";
import { Button, Box, Text, Avatar } from "zmp-ui";
import { requestFollowOA } from "../services/oa";

const OAFollowCard: React.FC = () => {
  return (
    <div className="fkt-oa-follow-card">
      {/* Instruction Text */}
      <Text className="fkt-oa-instruction">
        Quan tâm OA để nhận các chương trình đặc quyền ưu đãi
      </Text>
      
      {/* OA Information Section */}
      <div className="fkt-oa-info-section">
        {/* OA Avatar and Info */}
        <div className="fkt-oa-info">
          <div className="fkt-oa-avatar">
            <div className="fkt-oa-avatar-bg">
              <span className="fkt-oa-icon">🍗</span>
              <div className="fkt-oa-verified-badge">✓</div>
            </div>
          </div>
          <div className="fkt-oa-details">
            <Text className="fkt-oa-name">Gà rán FKT</Text>
            <Text className="fkt-oa-type">Official Account</Text>
          </div>
        </div>
        
        {/* Follow Button */}
        <Button 
          className="fkt-oa-follow-button"
          onClick={() => requestFollowOA()}
        >
          Quan tâm
        </Button>
      </div>
    </div>
  );
};

export default OAFollowCard;