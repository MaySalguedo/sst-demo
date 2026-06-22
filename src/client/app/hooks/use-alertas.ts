import { useCallback, useEffect, useState } from "react";
import type { AlertItem, AlertRunResult } from "@domain/types";
import { useGateway } from "@app/hooks/use-gateway";

export function useAlertas() {
  const gateway = useGateway();
  const [items, setItems] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<AlertRunResult | null>(null);
  const [running, setRunning] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await gateway.getAlertas());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando alertas.");
    } finally {
      setLoading(false);
    }
  }, [gateway]);

  const runNow = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const result = await gateway.runAlertsNow();
      setLastRun(result);
      await refresh();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error enviando alertas.");
      return null;
    } finally {
      setRunning(false);
    }
  }, [gateway, refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, error, lastRun, running, refresh, runNow };
}
