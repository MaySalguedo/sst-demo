import type { TrendPoint } from "@domain/types";
import { CardComponent } from "@app/components/ui/card/card.component";

export function TrendsChartComponent({ data }: { data: TrendPoint[] }) {
  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <CardComponent>
      <h3 className="mb-4 text-sm font-medium text-slate-900">
        Inspecciones por área
      </h3>
      <div className="space-y-3">
        {data.map((point) => (
          <div key={point.label}>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>{point.label}</span>
              <span>{point.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${(point.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </CardComponent>
  );
}
