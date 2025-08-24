// Placeholder file to prevent Tailwind cache issues
// This file redirects to cart page since checkout was removed

import React, { useEffect } from "react";
import { Page } from "zmp-ui";
import { useNavigate } from "zmp-ui";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to cart page since checkout was removed
    navigate("/cart", { replace: true });
  }, [navigate]);

  return (
    <Page>
      <div className="p-4 text-center">
        <p>Đang chuyển hướng...</p>
      </div>
    </Page>
  );
};

export default CheckoutPage;
