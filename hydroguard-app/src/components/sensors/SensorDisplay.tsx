import type { SensorData } from '../../types';
import { getPHStatus, getTDSStatus, getTurbidityStatus } from '../../utils';

// ── Circular Gauge ─────────────────────────────────────────────────────────────
interface GaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  color: string;
  size?: number;
}

export function CircularGauge({ value, min, max, unit, label, color, size = 120 }: GaugeProps) {
  const radius = (size / 2) - 12;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const offset = circumference * (1 - percentage);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="drop-shadow-sm">
          {/* Background ring */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none" stroke="#e2e8f0" strokeWidth="8"
          />
          {/* Value ring */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="gauge-ring transition-all duration-700"
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-slate-800">
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
          <span className="text-xs text-slate-500">{unit}</span>
        </div>
      </div>
      <span className="mt-1.5 text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}

// ── Sensor Grid ────────────────────────────────────────────────────────────────
interface SensorCardItemProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  color: string;
  status: { label: string; color: string };
  icon: string;
}

function SensorCardItem({ label, value, unit, min, max, color, status, icon }: SensorCardItemProps) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div className="sensor-card hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-semibold text-slate-600">{label}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="mb-3">
        <span className="text-2xl font-bold text-slate-800">{value.toFixed(1)}</span>
        <span className="text-slate-400 text-sm ml-1">{unit}</span>
      </div>

      {/* Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-slate-400">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

interface SensorGridProps {
  data: SensorData;
}

export function SensorGrid({ data }: SensorGridProps) {
  const phStatus = getPHStatus(data.ph);
  const tdsStatus = getTDSStatus(data.tds);
  const turbStatus = getTurbidityStatus(data.turbidity);
  const tempStatus = data.temperature < 30
    ? { label: 'Normal', color: 'text-emerald-600' }
    : { label: 'High', color: 'text-red-600' };

  const sensors: SensorCardItemProps[] = [
    { label: 'pH Level', value: data.ph, unit: 'pH', min: 0, max: 14, color: '#8b5cf6', status: phStatus, icon: '🧪' },
    { label: 'Temperature', value: data.temperature, unit: '°C', min: 0, max: 100, color: '#f97316', status: tempStatus, icon: '🌡️' },
    { label: 'TDS', value: data.tds, unit: 'ppm', min: 0, max: 2000, color: '#06b6d4', status: tdsStatus, icon: '💧' },
    { label: 'Turbidity', value: data.turbidity, unit: 'NTU', min: 0, max: 20, color: '#84cc16', status: turbStatus, icon: '🌊' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {sensors.map(s => <SensorCardItem key={s.label} {...s} />)}
    </div>
  );
}

// ── Live Sensor Gauges (circular) ──────────────────────────────────────────────
export function SensorGauges({ data }: { data: SensorData }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="glass-card p-4 flex flex-col items-center">
        <CircularGauge value={data.ph} min={0} max={14} unit="pH" label="pH Level" color="#8b5cf6" />
      </div>
      <div className="glass-card p-4 flex flex-col items-center">
        <CircularGauge value={data.temperature} min={0} max={100} unit="°C" label="Temperature" color="#f97316" />
      </div>
      <div className="glass-card p-4 flex flex-col items-center">
        <CircularGauge value={data.tds} min={0} max={2000} unit="ppm" label="TDS" color="#06b6d4" />
      </div>
      <div className="glass-card p-4 flex flex-col items-center">
        <CircularGauge value={data.turbidity} min={0} max={20} unit="NTU" label="Turbidity" color="#84cc16" />
      </div>
    </div>
  );
}
