import { useCallback, useEffect, useState } from "react";
import type { Extinguisher } from "@domain/types";
import { useGateway } from "@app/hooks/use-gateway";

export function useExtintores() {
  const gateway = useGateway();
  const [items, setItems] = useState<Extinguisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await gateway.getExtintores());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando extintores.");
    } finally {
      setLoading(false);
    }
  }, [gateway]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
}
