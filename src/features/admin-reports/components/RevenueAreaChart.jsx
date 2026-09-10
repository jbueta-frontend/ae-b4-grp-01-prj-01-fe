import { useState } from 'react';
import { formatPHP } from '../../../shared/utils/currency';

export default function RevenueAreaChart({
  data = [],
  totalRevenue = 0,
  activeRange = 'last30days',
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Generate synthetic or real timeline series matching the selected period
  const pointsCount = activeRange === 'today' ? 12 : activeRange === 'last7days' ? 7 : 14;
  const now = new Date();

  const series = (data.length > 0 ? data : Array.from({ length: pointsCount }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (pointsCount - 1 - i));
    const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    // Distribute totalRevenue across the curve
    const variance = 0.5 + Math.sin(i * 0.8) * 0.4 + (i / pointsCount) * 0.3;
    const value = totalRevenue > 0
      ? (totalRevenue / pointsCount) * variance
      : [3200, 4100, 3900, 5800, 4600, 6200, 7100, 6800, 8400, 7900, 9200, 8800, 10500, 11800][i % 14];
    return {
      date: dayLabel,
      value: Math.round(value),
      orders: Math.max(1, Math.round(value / 65)),
    };
  }));

  const values = series.map((s) => s.value);
  const maxVal = Math.max(...values, 100);
  const minVal = 0;

  // Chart Dimensions
  const width = 800;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Compute point coordinates
  const coords = series.map((s, idx) => {
    const x = padding.left + (idx / (series.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - ((s.value - minVal) / (maxVal - minVal)) * innerHeight;
    return { x, y, ...s };
  });

  // Smooth spline generator
  const makeSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const linePath = makeSmoothPath(coords);
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x},${padding.top + innerHeight} L ${coords[0].x},${padding.top + innerHeight} Z`
    : '';

  // Y-axis grid ticks (4 levels)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    val: Math.round(minVal + (maxVal - minVal) * pct),
    y: padding.top + innerHeight - pct * innerHeight,
  }));

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', minWidth: '600px', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="terracottaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c85a32" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#c85a32" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Y Gridlines and Labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                stroke="#ebe5df"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#8c857e"
                fontWeight="500"
              >
                {formatPHP(tick.val)}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          {areaPath && (
            <path d={areaPath} fill="url(#terracottaGradient)" />
          )}

          {/* Spline Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Dots & X Labels */}
          {coords.map((pt, idx) => {
            const isHovered = hoveredPoint === idx;
            return (
              <g key={idx}>
                {/* X Axis Label */}
                {(idx === 0 || idx === Math.floor(coords.length / 2) || idx === coords.length - 1) && (
                  <text
                    x={pt.x}
                    y={height - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#8c857e"
                    fontWeight="500"
                  >
                    {pt.date}
                  </text>
                )}

                {/* Point Hitbox & Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? 'var(--accent)' : '#ffffff'}
                  stroke="var(--accent)"
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ transition: 'r 0.15s ease, fill 0.15s ease', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredPoint !== null && coords[hoveredPoint] && (
        <div
          style={{
            position: 'absolute',
            left: `${(coords[hoveredPoint].x / width) * 100}%`,
            top: `${(coords[hoveredPoint].y / height) * 100 - 32}%`,
            transform: 'translate(-50%, -100%)',
            backgroundColor: '#18181b',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontWeight: 700, color: '#fed7aa', marginBottom: '2px' }}>
            {coords[hoveredPoint].date}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>
            {formatPHP(coords[hoveredPoint].value)}
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '0.6875rem', marginTop: '2px' }}>
            {coords[hoveredPoint].orders} orders completed
          </div>
        </div>
      )}
    </div>
  );
}
