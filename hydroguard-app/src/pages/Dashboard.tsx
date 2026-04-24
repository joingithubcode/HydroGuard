import { Link } from 'react-router-dom';
import {
  MdScience, MdHistory, MdTune, MdWaterDrop, MdSpeed,
  MdCheckCircle, MdWarning, MdError, MdTrendingUp,
} from 'react-icons/md';
import { useApp } from '../context/AppContext';
import { Card, StatCard, QualityBadge, Badge } from '../components/ui';
import { PHChart, TDSChart } from '../components/charts/Charts';
import { formatDateTime } from '../utils';
import { qualityStats } from '../data/mockData';

const quickActions = [
  { to: '/test', icon: MdScience, label: 'New Test', color: 'from-blue-500 to-cyan-500', desc: 'Start liquid analysis' },
  { to: '/history', icon: MdHistory, label: 'History', color: 'from-purple-500 to-indigo-500', desc: 'View past tests' },
  { to: '/calibration', icon: MdTune, label: 'Calibrate', color: 'from-emerald-500 to-teal-500', desc: 'Sensor calibration' },
];

const qualityIcon = {
  Excellent: <MdCheckCircle className="text-emerald-500" />,
  Good: <MdCheckCircle className="text-blue-500" />,
  Fair: <MdWarning className="text-amber-500" />,
  Poor: <MdError className="text-red-500" />,
};

export default function Dashboard() {
  const { state } = useApp();
  const { recentResults, sensorData, device } = state;

  const latestResult = recentResults[0];
  const passRate = Math.round(((qualityStats.excellent + qualityStats.good) / qualityStats.total) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0891b2 100%)' }}
      >
        <div className="absolute right-4 top-4 opacity-10">
          <MdWaterDrop size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sky-200 text-sm">
              {device.status === 'connected' ? 'Device Connected' : 'Device Offline'}
            </span>
          </div>
          <h2 className="text-2xl font-bold">Welcome back! 👋</h2>
          <p className="text-sky-200 text-sm mt-1">
            Your liquid quality monitoring system is {device.status === 'connected' ? 'active and ready' : 'offline'}.
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <Link
              to="/test"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-xl font-semibold text-sm shadow hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <MdScience size={18} /> Start Test
            </Link>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-all"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tests"
          value={qualityStats.total}
          icon={<MdScience size={22} />}
          trend={{ value: 12, label: 'this week' }}
        />
        <StatCard
          title="Pass Rate"
          value={`${passRate}%`}
          icon={<MdCheckCircle size={22} />}
          color="text-emerald-600"
          trend={{ value: 5, label: 'vs last week' }}
        />
        <StatCard
          title="Avg Confidence"
          value={`${qualityStats.averageConfidence}%`}
          icon={<MdTrendingUp size={22} />}
          color="text-purple-600"
        />
        <StatCard
          title="pH Level"
          value={sensorData.ph.toFixed(1)}
          unit="pH"
          icon={<MdSpeed size={22} />}
          color="text-blue-600"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(({ to, icon: Icon, label, color, desc }) => (
            <Link
              key={to}
              to={to}
              className="glass-card p-4 flex flex-col items-center gap-2 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-700 text-sm">{label}</p>
                <p className="text-xs text-slate-400 hidden sm:block">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PHChart />
        <TDSChart />
      </div>

      {/* Live Sensor Snapshot */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-700">Live Sensor Readings</h3>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'pH', value: sensorData.ph.toFixed(1), unit: 'pH', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Temperature', value: sensorData.temperature.toFixed(1), unit: '°C', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'TDS', value: sensorData.tds.toFixed(0), unit: 'ppm', color: 'text-cyan-600', bg: 'bg-cyan-50' },
            { label: 'Turbidity', value: sensorData.turbidity.toFixed(1), unit: 'NTU', color: 'text-lime-600', bg: 'bg-lime-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400">{s.unit}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Latest Result */}
      {latestResult && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-700">Latest Test Result</h3>
            <Link to="/history" className="text-sm text-primary-600 font-medium hover:underline">View All</Link>
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="text-4xl">
              {qualityIcon[latestResult.quality]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <QualityBadge quality={latestResult.quality} />
                <Badge variant="default">{latestResult.liquidType}</Badge>
              </div>
              <p className="text-sm text-slate-500">{formatDateTime(latestResult.createdAt)}</p>
              <p className="text-sm text-slate-600 mt-1">
                Confidence: <span className="font-semibold text-primary-600">{latestResult.confidence}%</span>
                {' · '}
                Expires in: <span className="font-semibold text-emerald-600">{latestResult.expiryDays} days</span>
              </p>
            </div>
            <Link
              to="/results"
              state={{ result: latestResult }}
              className="btn-primary text-sm px-4 py-2 rounded-lg"
            >
              View
            </Link>
          </div>
        </Card>
      )}

      {/* Recent History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-700">Recent Tests</h3>
          <Link to="/history" className="text-sm text-primary-600 font-medium hover:underline">See All</Link>
        </div>
        <div className="space-y-2">
          {recentResults.slice(0, 5).map(result => (
            <div
              key={result.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="text-xl">{qualityIcon[result.quality]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 truncate">{result.liquidType}</span>
                  <QualityBadge quality={result.quality} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(result.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary-600">{result.confidence}%</p>
                <p className="text-xs text-slate-400">confidence</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
