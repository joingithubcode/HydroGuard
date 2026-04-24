import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card } from '../ui';
import { chartData } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-xl rounded-xl p-3 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="text-xs">
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PHChart() {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">pH Trend (7 Days)</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="phGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis domain={[6, 9]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="ph" stroke="#8b5cf6" strokeWidth={2} fill="url(#phGrad)" name="pH" dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function TDSChart() {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">TDS Trend (7 Days)</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="tdsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="tds" stroke="#06b6d4" strokeWidth={2} fill="url(#tdsGrad)" name="TDS (ppm)" dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function MultiSensorChart() {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Multi-Sensor Overview (7 Days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line type="monotone" dataKey="ph" stroke="#8b5cf6" strokeWidth={2} name="pH" dot={false} />
          <Line type="monotone" dataKey="turbidity" stroke="#84cc16" strokeWidth={2} name="Turbidity" dot={false} />
          <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} name="Temp" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function QualityDistributionChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Quality Distribution</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Tests" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <rect key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
