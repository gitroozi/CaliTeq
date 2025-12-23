import { format } from 'date-fns';
import type { MetricHistory } from '../types';

interface MetricChartProps {
  history: MetricHistory;
  unit: string;
}

export default function MetricChart({ history, unit }: MetricChartProps) {
  if (history.dataPoints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        No data available yet
      </div>
    );
  }

  const dataPoints = history.dataPoints;
  const values = dataPoints.map((dp) => dp.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1; // Avoid division by zero

  // Chart dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate points for the line
  const points = dataPoints.map((dp, index) => {
    const x = padding.left + (index / (dataPoints.length - 1 || 1)) * chartWidth;
    const y = padding.top + chartHeight - ((dp.value - minValue) / valueRange) * chartHeight;
    return { x, y, ...dp };
  });

  // Create path for the line
  const linePath = points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x},${point.y}`;
    })
    .join(' ');

  // Create path for the area under the line
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding.bottom} L ${padding.left},${height - padding.bottom} Z`;

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) => {
    return minValue + (valueRange / (yTicks - 1)) * i;
  });

  // X-axis ticks (show max 7 dates)
  const xTickCount = Math.min(7, dataPoints.length);
  const xTickIndices = Array.from({ length: xTickCount }, (_, i) =>
    Math.floor((i / (xTickCount - 1)) * (dataPoints.length - 1))
  );

  // Trend indicator
  const trendColor = {
    increasing: 'text-green-600',
    decreasing: 'text-red-600',
    stable: 'text-slate-600',
    insufficient_data: 'text-slate-400',
  }[history.trend];

  const trendLabel = {
    increasing: '↑ Increasing',
    decreasing: '↓ Decreasing',
    stable: '→ Stable',
    insufficient_data: 'Not enough data',
  }[history.trend];

  return (
    <div className="space-y-4">
      {/* Trend and Average */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className={`font-medium ${trendColor}`}>{trendLabel}</span>
          {history.average !== null && (
            <span className="text-slate-600">
              Average: <span className="font-medium text-slate-900">{history.average.toFixed(1)} {unit}</span>
            </span>
          )}
        </div>
        <span className="text-slate-600">
          {dataPoints.length} data point{dataPoints.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Chart */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ maxHeight: '300px' }}
        >
          {/* Grid lines */}
          {yTickValues.map((value, index) => {
            const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            return (
              <g key={index}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#64748b"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area under line */}
          <path d={areaPath} fill="url(#gradient)" opacity="0.2" />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle cx={point.x} cy={point.y} r="4" fill="#6366f1" />
              <circle cx={point.x} cy={point.y} r="3" fill="white" />
              {/* Tooltip trigger area */}
              <circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill="transparent"
                style={{ cursor: 'pointer' }}
              >
                <title>
                  {format(new Date(point.date), 'MMM d, yyyy')}: {point.value.toFixed(1)} {unit}
                  {point.notes && `\n${point.notes}`}
                </title>
              </circle>
            </g>
          ))}

          {/* X-axis labels */}
          {xTickIndices.map((index) => {
            const point = points[index];
            return (
              <text
                key={index}
                x={point.x}
                y={height - padding.bottom + 25}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
              >
                {format(new Date(point.date), 'MMM d')}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-600" />
          <span>Data points</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-primary-600" />
          <span>Trend line</span>
        </div>
      </div>
    </div>
  );
}
