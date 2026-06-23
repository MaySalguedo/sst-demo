import type { TrendPoint } from "@domain/types";
import { CardComponent } from "@app/components/ui/card/card.component";
import "./trends-chart.component.css";

export function TrendsChartComponent({ data }: { data: TrendPoint[] }) {
  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <CardComponent className="trends-card">
      <h3 className="trends-title">Inspecciones por área</h3>
      <div className="trends-list">
        {data.map((point) => (
          <div key={point.label}>
            <div className="trends-bar-container">
              <span>{point.label}</span>
              <span>{point.value}</span>
            </div>
            <div className="trends-bar-track">
              <div
                className="trends-bar-fill"
                style={{ width: `${(point.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </CardComponent>
  );
}
