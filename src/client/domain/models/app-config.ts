export interface AppConfig {
  appsheetAppId: string;
  appsheetRegion: string;
  appsheetDbUrl: string;
  lookerReportUrl: string;
  lookerEmbedUrl: string;
  alertDaysBefore: number;
  emailSst: string;
  hasAccessKey: boolean;
}

export interface AppConfigInput {
  appsheetAppId?: string;
  appsheetRegion?: string;
  appsheetAccessKey?: string;
  appsheetDbUrl?: string;
  lookerReportUrl?: string;
  lookerEmbedUrl?: string;
  alertDaysBefore?: number;
  emailSst?: string;
}
