import React from "react";
import { createRoot } from "react-dom/client";
import { configAppView } from "zmp-sdk";

import "swiper/css";
import "swiper/css/pagination";
import "zmp-ui/zaui.css";
import "./css/tailwind.css";
import "./css/app.scss";

import App from "./App"; // App ở src/App.tsx
import appConfig from "../app-config.json";

// Wait for DOM to be ready
const waitForDOM = () => {
  return new Promise<void>((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve());
    } else {
      resolve();
    }
  });
};

// Initialize app when DOM is ready
const initializeApp = async () => {
  await waitForDOM();
  
  // Initialize ZMP SDK
  try {
    configAppView({
      statusBarType: "transparent",
      headerTextColor: "black",
    });
  } catch (error) {
    console.warn("Failed to initialize ZMP SDK:", error);
  }
  
  if (!window.APP_CONFIG) {
    window.APP_CONFIG = appConfig;
  }

  // Function to find or create the root element
  const findOrCreateRootElement = () => {
    // Try to find existing root element
    let rootElement = document.getElementById("root");
    
    // If not found, try common Zalo Mini App container IDs
    if (!rootElement) {
      rootElement = document.getElementById("app") || 
                    document.getElementById("zmp-app") ||
                    document.getElementById("zalo-app");
    }
    
    // If still not found, try to find any element that might be suitable
    if (!rootElement) {
      const body = document.body;
      if (body) {
        // Create a new root element
        rootElement = document.createElement("div");
        rootElement.id = "zmp-root";
        body.appendChild(rootElement);
      }
    }
    
    return rootElement;
  };

  const rootElement = findOrCreateRootElement();

  if (!rootElement) {
    console.error("Could not find or create root element");
    // Fallback: render directly to body
    const fallbackElement = document.createElement("div");
    fallbackElement.id = "zmp-fallback-root";
    document.body.appendChild(fallbackElement);
    
    const root = createRoot(fallbackElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    const root = createRoot(rootElement);

    // Wrap the app render in a try-catch to handle any initialization errors
    try {
      if (import.meta.env.DEV) {
        console.log("Running in development mode");
      }
      
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (error) {
      console.error("Failed to render app:", error);
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Đã xảy ra lỗi</h2>
          <p>Vui lòng thử lại hoặc liên hệ hỗ trợ</p>
          <button onclick="window.location.reload()">Tải lại trang</button>
        </div>
      `;
    }
  }
};

// Start the app initialization
initializeApp().catch((error) => {
  console.error("Failed to initialize app:", error);
  // Last resort fallback
  if (document.body) {
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Không thể khởi tạo ứng dụng</h2>
        <p>Vui lòng thử lại hoặc liên hệ hỗ trợ</p>
        <button onclick="window.location.reload()">Tải lại trang</button>
      </div>
    `;
  }
});
