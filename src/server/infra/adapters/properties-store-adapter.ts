export class PropertiesStoreAdapter {
  get(key: string): string | null {
    return PropertiesService.getScriptProperties().getProperty(key);
  }

  set(key: string, value: string): void {
    PropertiesService.getScriptProperties().setProperty(key, value);
  }
}
