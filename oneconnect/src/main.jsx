import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/queryClient";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConfigProvider as AntdConfigProvider, theme } from "antd";
import App from "@/app/App";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AntdConfigProvider
      theme={{
        token: {
          algorithm: theme.darkAlgorithm, // enable dark mode
          colorPrimary: "#0FA4AF",
        },
      }}
    >
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        localization={{
          language: "th",
        }}
        signInForceRedirectUrl="/"
      >
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </ClerkProvider>
    </AntdConfigProvider>
  </StrictMode>
);
