import type { QualityGrade } from '../../types';
import { getQualityBg, getQualityEmoji } from '../../utils';

// ── Badge ──────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'quality' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    quality: '',
  };
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ── QualityBadge ───────────────────────────────────────────────────────────────
export function QualityBadge({ quality }: { quality: QualityGrade }) {
  return (
    <span className={`badge border ${getQualityBg(quality)}`}>
      {getQualityEmoji(quality)} {quality}
    </span>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
  };
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all duration-200',
    danger: 'px-6 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-lg',
    success: 'px-6 py-3 rounded-xl font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all duration-200 shadow-lg',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        ${sizes[size]} ${variants[variant]}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </button>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}
export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`glass-card ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        )}
        <input
          className={`input-field ${icon ? 'pl-10' : ''} ${error ? 'border-red-400 ring-red-300' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}
export function Select({ label, options, error, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <select className={`select-field ${error ? 'border-red-400' : ''} ${className}`} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary-600' : 'bg-slate-300'}`}
        onClick={() => onChange(!checked)}
      >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
    </label>
  );
}

// ── Tabs ───────────────────────────────────────────────────────────────────────
interface TabsProps {
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
}
export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            active === i ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => onChange(i)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── ProgressBar ────────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}
export function ProgressBar({ value, max = 100, color = 'bg-primary-500', className = '', showLabel = false }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Progress</span><span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: string;
}
export function StatCard({ title, value, unit, icon, trend, color = 'text-primary-600' }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>
            {value}
            {unit && <span className="text-base font-normal text-slate-400 ml-1">{unit}</span>}
          </p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.value >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
