import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const region = (env.APPSHEET_REGION || "https://www.appsheet.com").replace(
    /\/+$/,
    "",
  );
  const appId = env.APPSHEET_APP_ID || "";
  const accessKey = env.APPSHEET_ACCESS_KEY || "";

  const localConfig = {
    appsheetAppId: appId,
    appsheetRegion: region,
    appsheetDbUrl: env.APPSHEET_DB_URL || "",
    lookerReportUrl: env.LOOKER_REPORT_URL || "",
    lookerEmbedUrl: env.LOOKER_EMBED_URL || "",
    alertDaysBefore: Number(env.ALERT_DAYS_BEFORE || "30"),
    emailSst: env.EMAIL_SST || "",
    hasAccessKey: Boolean(accessKey),
  };

  return {
    root: "src/client",
    plugins: [react(), tailwindcss(), viteSingleFile()],
    define: {
      __LOCAL_CONFIG__: JSON.stringify(localConfig),
    },
    resolve: {
      alias: {
        "@domain": path.resolve(__dirname, "src/client/domain"),
        "@infra": path.resolve(__dirname, "src/client/infra"),
        "@app": path.resolve(__dirname, "src/client/app"),
      },
    },
    server: {
      proxy: {
        "/appsheet-proxy": {
          target: region,
          changeOrigin: true,
          secure: true,
          rewrite: (requestPath) => {
            const table = requestPath
              .replace(/^\/appsheet-proxy\//, "")
              .split("?")[0];
            return `/api/v2/apps/${appId}/tables/${table}/Action`;
          },
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (accessKey) {
                proxyReq.setHeader("ApplicationAccessKey", accessKey);
              }
            });
          },
        },
      },
    },
    build: {
      outDir: "../../dist/client",
      emptyOutDir: true,
    },
  };
});
