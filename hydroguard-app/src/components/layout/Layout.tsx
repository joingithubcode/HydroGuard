import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdDashboard, MdScience, MdAssignment, MdHistory, MdTune,
  MdSettings, MdInfo, MdMenu, MdClose, MdWaterDrop, MdNotifications,
  MdPerson, MdBatteryFull, MdBattery80, MdBattery50, MdBattery20,
  MdBatteryAlert, MdWifi, MdWifiOff,
} from 'react-icons/md';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: '/', icon: MdDashboard, label: 'Dashboard' },
  { path: '/test', icon: MdScience, label: 'New Test' },
  { path: '/results', icon: MdAssignment, label: 'Results' },
  { path: '/history', icon: MdHistory, label: 'History' },
  { path: '/calibration', icon: MdTune, label: 'Calibration' },
  { path: '/settings', icon: MdSettings, label: 'Settings' },
  { path: '/about', icon: MdInfo, label: 'About' },
];

function BatteryIcon({ level }: { level: number }) {
  if (level > 80) return <MdBatteryFull className="text-emerald-500" size={20} />;
  if (level > 50) return <MdBattery80 className="text-emerald-400" size={20} />;
  if (level > 20) return <MdBattery50 className="text-amber-500" size={20} />;
  if (level > 10) return <MdBattery20 className="text-red-500" size={20} />;
  return <MdBatteryAlert className="text-red-600 animate-pulse" size={20} />;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { state } = useApp();
  const { device, preferences } = state;

  const isConnected = device.status === 'connected';

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: 'linear-gradient(160deg, #0c4a6e 0%, #0369a1 60%, #0891b2 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
              <MdWaterDrop size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">HydroGuard</h1>
              <p className="text-sky-200 text-xs">Liquid Quality Monitor</p>
            </div>
          </div>
          <button
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Device Status */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-white/10 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected
                ? <MdWifi size={16} className="text-emerald-400" />
                : <MdWifiOff size={16} className="text-red-400" />
              }
              <span className="text-white text-xs font-medium">{device.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BatteryIcon level={device.batteryLevel} />
              <span className="text-white/70 text-xs">{device.batteryLevel}%</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={`text-xs ${isConnected ? 'text-emerald-300' : 'text-red-300'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                  ${isActive
                    ? 'bg-white text-primary-700 shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-primary-600' : ''} />
                <span>{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center shadow">
              <MdPerson size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{preferences.name}</p>
              <p className="text-sky-300 text-xs truncate">{preferences.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top AppBar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <MdMenu size={24} />
              </button>
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-slate-800">
                  {navItems.find(n => n.path === location.pathname)?.label || 'HydroGuard'}
                </h2>
                <p className="text-xs text-slate-400">
                  Liquid Quality Monitoring System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Device status chip */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                {isConnected ? 'ESP32 Online' : 'Disconnected'}
              </div>

              {/* Battery */}
              <div className="hidden sm:flex items-center gap-1.5 text-slate-600">
                <BatteryIcon level={device.batteryLevel} />
                <span className="text-sm font-medium">{device.batteryLevel}%</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                <MdNotifications size={22} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Profile */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow cursor-pointer">
                <MdPerson size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
