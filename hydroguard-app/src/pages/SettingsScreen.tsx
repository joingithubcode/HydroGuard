import { useState } from 'react';
import {
  MdPerson, MdNotifications, MdStorage,
  MdDevices, MdBluetooth, MdWifi, MdInfo,
  MdSave, MdLogout, MdDeleteForever,
} from 'react-icons/md';
import { useApp } from '../context/AppContext';
import { Button, Card, Input, Select, Toggle, Tabs, Modal } from '../components/ui';

export default function SettingsScreen() {
  const { state, updatePreferences } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const { preferences, device } = state;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = ['Profile', 'Device', 'Notifications', 'Data & Privacy'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your preferences and device settings</p>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Profile Tab */}
      {activeTab === 0 && (
        <div className="space-y-4 animate-in">
          {/* Avatar */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg">
                <MdPerson size={36} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{preferences.name}</h3>
                <p className="text-slate-500 text-sm">{preferences.email}</p>
                <p className="text-xs text-primary-600 mt-0.5">HydroGuard Pro User</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <MdPerson size={18} className="text-primary-600" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={preferences.name}
                onChange={e => updatePreferences({ name: e.target.value })}
                placeholder="Your full name"
              />
              <Input
                label="Email Address"
                type="email"
                value={preferences.email}
                onChange={e => updatePreferences({ email: e.target.value })}
                placeholder="your@email.com"
              />
              <Select
                label="Language"
                value={preferences.language}
                onChange={e => updatePreferences({ language: e.target.value })}
                options={[
                  { value: 'English', label: '🇺🇸 English' },
                  { value: 'Urdu', label: '🇵🇰 Urdu' },
                  { value: 'Arabic', label: '🇸🇦 Arabic' },
                  { value: 'French', label: '🇫🇷 French' },
                ]}
              />
              <Select
                label="Measurement Units"
                value={preferences.units}
                onChange={e => updatePreferences({ units: e.target.value as 'metric' | 'imperial' })}
                options={[
                  { value: 'metric', label: 'Metric (°C, ppm)' },
                  { value: 'imperial', label: 'Imperial (°F, ppm)' },
                ]}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <Button onClick={handleSave} icon={<MdSave size={18} />}>
                {saved ? '✅ Saved!' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
              <MdLogout size={18} />
              Account Actions
            </h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start" icon={<MdLogout size={18} />}>
                Sign Out
              </Button>
              <Button
                variant="danger"
                className="w-full justify-start"
                icon={<MdDeleteForever size={18} />}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Device Tab */}
      {activeTab === 1 && (
        <div className="space-y-4 animate-in">
          <Card>
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <MdDevices size={18} className="text-primary-600" />
              Connected Device
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <MdDevices size={22} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">{device.name}</p>
                    <p className="text-xs text-slate-500">ID: {device.id}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  device.status === 'connected'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {device.status === 'connected' ? 'Connected' : 'Disconnected'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-lg">
                  <p className="text-slate-400">Firmware</p>
                  <p className="font-semibold text-slate-700">{device.firmwareVersion}</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <p className="text-slate-400">Battery</p>
                  <p className="font-semibold text-slate-700">{device.batteryLevel}%</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" icon={<MdBluetooth size={16} />}>
                Reconnect
              </Button>
              <Button variant="ghost" size="sm" icon={<MdInfo size={16} />}>
                Device Info
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <MdWifi size={18} className="text-primary-600" />
              Connectivity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700 text-sm">Bluetooth</p>
                  <p className="text-xs text-slate-400">Auto-connect to device</p>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700 text-sm">WiFi Sync</p>
                  <p className="text-xs text-slate-400">Sync data over WiFi</p>
                </div>
                <Toggle checked={false} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700 text-sm">Background Sync</p>
                  <p className="text-xs text-slate-400">Sync in background</p>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 2 && (
        <div className="space-y-4 animate-in">
          <Card>
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <MdNotifications size={18} className="text-primary-600" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Test Completed', desc: 'Notify when liquid test is done', key: 'notifications' },
                { label: 'Quality Alerts', desc: 'Alert for Poor quality results', key: 'notifications' },
                { label: 'Expiry Reminders', desc: 'Remind before liquid expires', key: 'notifications' },
                { label: 'Device Battery Low', desc: 'Alert when battery < 20%', key: 'notifications' },
                { label: 'Calibration Due', desc: 'Remind to calibrate sensors', key: 'notifications' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <Toggle
                    checked={preferences.notifications}
                    onChange={v => updatePreferences({ notifications: v })}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Data & Privacy Tab */}
      {activeTab === 3 && (
        <div className="space-y-4 animate-in">
          <Card>
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <MdStorage size={18} className="text-primary-600" />
              Data Management
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700 text-sm">Auto-Save Results</p>
                  <p className="text-xs text-slate-400">Automatically save test results</p>
                </div>
                <Toggle
                  checked={preferences.autoSave}
                  onChange={v => updatePreferences({ autoSave: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700 text-sm">Cloud Backup</p>
                  <p className="text-xs text-slate-400">Back up data to cloud</p>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700 text-sm">Analytics</p>
                  <p className="text-xs text-slate-400">Share anonymous usage data</p>
                </div>
                <Toggle checked={false} onChange={() => {}} />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-700 mb-4">Storage Usage</h3>
            <div className="space-y-3">
              {[
                { label: 'Test Results', value: 45, color: 'bg-primary-500' },
                { label: 'Sensor Logs', value: 25, color: 'bg-purple-500' },
                { label: 'Calibration Data', value: 10, color: 'bg-emerald-500' },
                { label: 'Cache', value: 20, color: 'bg-slate-400' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{item.label}</span><span>{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full" icon={<MdDeleteForever size={16} />}>
              Clear Cache
            </Button>
          </Card>
        </div>
      )}

      {/* Delete Account Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <p className="text-slate-600 text-sm mb-4">
          Are you sure you want to delete your account? This will permanently remove all your data
          and cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={() => setShowDeleteModal(false)}>
            Delete Account
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
