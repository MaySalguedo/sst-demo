import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GatewayProviderComponent } from "@app/providers/gateway-provider/gateway-provider.component";
import { AppComponent } from "@app/app/app.component";
import "./styles/main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GatewayProviderComponent>
      <AppComponent />
    </GatewayProviderComponent>
  </StrictMode>,
);
