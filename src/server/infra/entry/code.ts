import { getContainer } from "@infra/container";

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("SST Demo Hub")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function runAlertsNow() {
  return getContainer().alerts.execute();
}

Object.assign(globalThis, {
  doGet,
  runAlertsNow,
});
