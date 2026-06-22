import { useCallback, useEffect, useState } from "react";
import type { DashboardSummary, TrendPoint } from "@domain/types";
import { useGateway } from "@app/hooks/use-gateway";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useDashboard() {
  const gateway = useGateway();
  const [summary, setSummary] = useState<AsyncState<DashboardSummary>>({
    data: null,
    loading: true,
    error: null,
  });
  const [trends, setTrends] = useState<AsyncState<TrendPoint[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setSummary((state) => ({ ...state, loading: true, error: null }));
    setTrends((state) => ({ ...state, loading: true, error: null }));

    try {
      const [summaryData, trendsData] = await Promise.all([
        gateway.getDashboardSummary(),
        gateway.getTendencias(),
      ]);
      setSummary({ data: summaryData, loading: false, error: null });
      setTrends({ data: trendsData, loading: false, error: null });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo cargar el dashboard.";
      setSummary({ data: null, loading: false, error: message });
      setTrends({ data: null, loading: false, error: message });
    }
  }, [gateway]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { summary, trends, refresh };
}
