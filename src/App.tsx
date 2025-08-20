import React from "react";
import { App as ZmpApp, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import AppRoutes from "./AppRoutes";

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <ZmpApp>
        <SnackbarProvider>
          <AppRoutes />
        </SnackbarProvider>
      </ZmpApp>
    </RecoilRoot>
  );
};

export default App;
