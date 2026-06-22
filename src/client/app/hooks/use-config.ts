import { useCallback, useEffect, useState } from "react";
import type {
  AppConfig,
  AppConfigInput,
  ConnectionTestResult,
} from "@domain/types";
import { useGateway } from "@app/providers/gateway-provider";

export function useConfig() {
  const gateway = useGateway();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTest, setLastTest] = useState<ConnectionTestResult | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setConfig(await gateway.getConfig());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando configuración.");
    } finally {
      setLoading(false);
    }
  }, [gateway]);

  const save = useCallback(
    async (partial: AppConfigInput) => {
      setSaving(true);
      setError(null);
      try {
        setConfig(await gateway.saveConfig(partial));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error guardando configuración.");
      } finally {
        setSaving(false);
      }
    },
    [gateway],
  );

  const testConnection = useCallback(
    async (table?: string) => {
      setTesting(true);
      setError(null);
      try {
        const result = await gateway.testConnection(table);
        setLastTest(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error probando la conexión.");
        return null;
      } finally {
        setTesting(false);
      }
    },
    [gateway],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    config,
    loading,
    saving,
    testing,
    error,
    lastTest,
    refresh,
    save,
    testConnection,
  };
}
