import React from "react";
import { App as ZmpApp, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import AppRoutes from "./AppRoutes";
import { ErrorBoundary } from "./components/error-boundary";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <RecoilRoot>
        <ZmpApp>
          <SnackbarProvider>
            <AppRoutes />
          </SnackbarProvider>
        </ZmpApp>
      </RecoilRoot>
    </ErrorBoundary>
  );
};

export default App;
