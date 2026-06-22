import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GatewayProvider } from "@app/providers/gateway-provider";
import { App } from "@app/app";
import "./styles/main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GatewayProvider>
      <App />
    </GatewayProvider>
  </StrictMode>,
);
