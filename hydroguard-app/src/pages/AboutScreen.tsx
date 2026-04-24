import {
  MdWaterDrop, MdScience, MdStar, MdPeople,
  MdCheckCircle, MdCode, MdPhone, MdEmail,
  MdLanguage,
} from 'react-icons/md';
import { Card, Badge } from '../components/ui';

const features = [
  { icon: '🧪', title: 'Real-time Analysis', desc: 'Multi-sensor data collection for instant liquid quality assessment' },
  { icon: '🤖', title: 'AI Classification', desc: 'Machine learning model classifies quality as Excellent/Good/Fair/Poor' },
  { icon: '📊', title: 'Data Visualization', desc: 'Beautiful charts and gauges for sensor data trends' },
  { icon: '📱', title: 'Mobile-First Design', desc: 'Optimized for mobile devices with responsive layouts' },
  { icon: '📡', title: 'Bluetooth Connected', desc: 'Wirelessly connect to ESP32-based HydroGuard sensor device' },
  { icon: '📋', title: 'History & Reports', desc: 'Complete test history with export and sharing capabilities' },
];

const requirements = [
  { id: 'FR-01', title: 'Information Gathering & Sensor Control', status: 'Implemented' },
  { id: 'FR-02', title: 'AI & Data Processing', status: 'Implemented' },
  { id: 'FR-03', title: 'User Interface & Reporting', status: 'Implemented' },
  { id: 'FR-04', title: 'User Account & Data Management', status: 'Implemented' },
  { id: 'FR-05', title: 'Backend & Device Management', status: 'Implemented' },
  { id: 'NFR-01', title: 'Performance & Responsiveness', status: 'Implemented' },
  { id: 'NFR-02', title: 'Security & Privacy', status: 'Implemented' },
  { id: 'NFR-03', title: 'Reliability & Accuracy', status: 'Implemented' },
  { id: 'NFR-04', title: 'Usability & Accessibility', status: 'Implemented' },
  { id: 'NFR-05', title: 'Portability & Compatibility', status: 'Implemented' },
  { id: 'NFR-06', title: 'Maintainability', status: 'Implemented' },
  { id: 'NFR-07', title: 'Scalability', status: 'Implemented' },
];

const techStack = [
  { name: 'React 18', desc: 'UI Framework', color: 'bg-sky-100 text-sky-700' },
  { name: 'TypeScript', desc: 'Type Safety', color: 'bg-blue-100 text-blue-700' },
  { name: 'Tailwind CSS', desc: 'Styling', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'React Router', desc: 'Navigation', color: 'bg-purple-100 text-purple-700' },
  { name: 'Recharts', desc: 'Data Charts', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'React Icons', desc: 'Icons', color: 'bg-amber-100 text-amber-700' },
  { name: 'Vite', desc: 'Build Tool', color: 'bg-violet-100 text-violet-700' },
  { name: 'ESP32', desc: 'Hardware', color: 'bg-red-100 text-red-700' },
];

export default function AboutScreen() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0891b2 100%)' }}
      >
        <div className="absolute inset-0 opacity-5">
          <MdWaterDrop size={400} className="absolute -right-20 -top-20" />
        </div>
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <MdWaterDrop size={44} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-1">HydroGuard</h1>
          <p className="text-sky-200 text-sm mb-3">Liquid Quality Monitoring System</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge className="bg-white/20 text-white border-white/30">Version 2.1.4</Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <MdStar size={12} className="text-yellow-300" /> Production Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* About */}
      <Card>
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <MdScience size={18} className="text-primary-600" />
          About the Project
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          HydroGuard is an AI-powered liquid quality monitoring system designed to analyze and classify
          the quality of various liquids using multi-sensor data. The system combines an ESP32-based
          hardware sensor unit with a modern mobile-first web application to provide real-time,
          accurate liquid quality assessments.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed mt-3">
          The app analyzes pH, temperature, TDS (Total Dissolved Solids), and turbidity to classify
          liquid quality as Excellent, Good, Fair, or Poor, along with expiry predictions and
          actionable recommendations.
        </p>
      </Card>

      {/* Features */}
      <div>
        <h3 className="font-semibold text-slate-700 mb-3">Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map(f => (
            <Card key={f.title}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{f.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <Card>
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <MdCheckCircle size={18} className="text-emerald-600" />
          Project Requirements Status
        </h3>
        <div className="space-y-2">
          {requirements.map(req => (
            <div key={req.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                  {req.id}
                </span>
                <span className="text-sm text-slate-600">{req.title}</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <MdCheckCircle size={14} /> ✓
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Tech Stack */}
      <Card>
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <MdCode size={18} className="text-primary-600" />
          Technology Stack
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {techStack.map(tech => (
            <div key={tech.name} className={`${tech.color} rounded-xl p-3 text-center`}>
              <p className="font-bold text-sm">{tech.name}</p>
              <p className="text-xs opacity-70">{tech.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Team */}
      <Card>
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <MdPeople size={18} className="text-primary-600" />
          Project Team
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Ahmad Ali', role: 'Project Lead & Full Stack Developer', initials: 'AA' },
            { name: 'Sara Khan', role: 'Hardware Engineer & Sensor Integration', initials: 'SK' },
            { name: 'Bilal Ahmed', role: 'AI/ML Model Development', initials: 'BA' },
            { name: 'Fatima Malik', role: 'UI/UX Designer & Frontend', initials: 'FM' },
          ].map(member => (
            <div key={member.name} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
                {member.initials}
              </div>
              <div>
                <p className="font-semibold text-slate-700 text-sm">{member.name}</p>
                <p className="text-xs text-slate-400">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact */}
      <Card>
        <h3 className="font-semibold text-slate-700 mb-4">Contact & Links</h3>
        <div className="space-y-3">
          <a href="mailto:hydroguard@project.com" className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary-600 transition-colors">
            <MdEmail size={18} className="text-primary-500" />
            hydroguard@project.com
          </a>
          <a href="https://github.com/joingithubcode/HydroGuard" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary-600 transition-colors">
            <MdCode size={18} className="text-primary-500" />
            github.com/joingithubcode/HydroGuard
          </a>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <MdLanguage size={18} className="text-primary-500" />
            hydroguard.app
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <MdPhone size={18} className="text-primary-500" />
            +92 300 123 4567
          </div>
        </div>
      </Card>

      {/* Version Info */}
      <div className="text-center py-4">
        <p className="text-slate-400 text-xs">HydroGuard v2.1.4 · Built with ❤️ for liquid quality monitoring</p>
        <p className="text-slate-300 text-xs mt-1">© 2024 HydroGuard Project. All rights reserved.</p>
      </div>
    </div>
  );
}
