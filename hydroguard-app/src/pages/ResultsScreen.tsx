import { useLocation, useNavigate } from 'react-router-dom';
import {
  MdShare, MdDownload, MdCheckCircle, MdWarning, MdError,
  MdThumbUp, MdThumbDown, MdArrowBack, MdCalendarToday,
  MdScience,
} from 'react-icons/md';
import { useApp } from '../context/AppContext';
import { Button, Card, QualityBadge, Badge, ProgressBar } from '../components/ui';
import { formatDate, formatDateTime, getQualityGradient } from '../utils';
import type { TestResult, QualityGrade } from '../types';
import { useState } from 'react';

const qualityIcons: Record<QualityGrade, React.ReactNode> = {
  Excellent: <MdCheckCircle size={48} className="text-white" />,
  Good: <MdCheckCircle size={48} className="text-white" />,
  Fair: <MdWarning size={48} className="text-white" />,
  Poor: <MdError size={48} className="text-white" />,
};

function MetricRow({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm font-bold ${color}`}>
        {value.toFixed(1)} <span className="font-normal text-slate-400 text-xs">{unit}</span>
      </span>
    </div>
  );
}

export default function ResultsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const [feedback, setFeedback] = useState<'accurate' | 'inaccurate' | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Get result from navigation state or use the latest result
  const result: TestResult = location.state?.result || state.recentResults[0];

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <MdScience size={60} className="text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No Results Yet</h3>
        <p className="text-slate-400 text-sm mb-6">Run a test to see your results here</p>
        <Button onClick={() => navigate('/test')} icon={<MdScience size={18} />}>
          Start New Test
        </Button>
      </div>
    );
  }

  const gradientClass = getQualityGradient(result.quality);
  const isExpired = result.expiryDays <= 0;
  const isExpiringSoon = result.expiryDays <= 2 && result.expiryDays > 0;

  const handleDownload = () => {
    const report = `
HydroGuard Liquid Analysis Report
===================================
Date: ${formatDateTime(result.createdAt)}
Liquid Type: ${result.liquidType}
Quality Grade: ${result.quality}
Confidence: ${result.confidence}%
Expiry: ${result.expiryDays > 0 ? `${result.expiryDays} days` : 'Expired'}

Sensor Readings:
- pH: ${result.sensorData.ph.toFixed(2)}
- Temperature: ${result.sensorData.temperature.toFixed(1)}°C
- TDS: ${result.sensorData.tds.toFixed(0)} ppm
- Turbidity: ${result.sensorData.turbidity.toFixed(1)} NTU

Recommendations:
${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydroguard-report-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = `HydroGuard Analysis: ${result.liquidType} - ${result.quality} (${result.confidence}% confidence). Expires: ${formatDate(result.expiryDate)}.`;
    if (navigator.share) {
      await navigator.share({ title: 'HydroGuard Report', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <MdArrowBack size={22} />
        </button>
        <div>
          <h1 className="page-title">Test Results</h1>
          <p className="text-slate-400 text-sm">{formatDateTime(result.createdAt)}</p>
        </div>
      </div>

      {/* Quality Hero Card */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${gradientClass} text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute -right-4 -top-4 opacity-10 text-[200px] leading-none">
          {result.quality[0]}
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  {result.liquidType}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  ID: {result.id.slice(-6)}
                </Badge>
              </div>
              <h2 className="text-4xl font-extrabold mb-1">{result.quality}</h2>
              <p className="text-white/80 text-sm">Quality Classification</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              {qualityIcons[result.quality]}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-white/70 text-xs mb-1">AI Confidence</p>
              <p className="text-2xl font-bold">{result.confidence}%</p>
              <ProgressBar value={result.confidence} color="bg-white/60" className="mt-1" />
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-white/70 text-xs mb-1">
                {isExpired ? 'Status' : 'Expires In'}
              </p>
              <p className={`text-2xl font-bold ${isExpired ? 'text-red-200' : ''}`}>
                {isExpired ? 'Expired' : `${result.expiryDays}d`}
              </p>
              <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                <MdCalendarToday size={12} />
                {formatDate(result.expiryDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expiry Alert */}
      {(isExpired || isExpiringSoon) && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          isExpired ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <MdWarning size={22} className={isExpired ? 'text-red-500' : 'text-amber-500'} />
          <div>
            <p className={`font-semibold text-sm ${isExpired ? 'text-red-700' : 'text-amber-700'}`}>
              {isExpired ? 'This liquid has expired!' : 'Expiring Soon!'}
            </p>
            <p className={`text-xs ${isExpired ? 'text-red-500' : 'text-amber-500'}`}>
              {isExpired
                ? 'Do not consume. Dispose safely.'
                : `Only ${result.expiryDays} day(s) remaining. Use or refrigerate promptly.`
              }
            </p>
          </div>
        </div>
      )}

      {/* Sensor Readings */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-700">Sensor Readings</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-primary-600 font-medium hover:underline"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'pH Level', value: result.sensorData.ph, unit: 'pH', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Temperature', value: result.sensorData.temperature, unit: '°C', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'TDS', value: result.sensorData.tds, unit: 'ppm', color: 'text-cyan-600', bg: 'bg-cyan-50' },
            { label: 'Turbidity', value: result.sensorData.turbidity, unit: 'NTU', color: 'text-lime-600', bg: 'bg-lime-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value.toFixed(1)}</p>
              <p className="text-xs text-slate-400">{s.unit}</p>
            </div>
          ))}
        </div>

        {showDetails && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <MetricRow label="pH Level" value={result.sensorData.ph} unit="pH" color="text-purple-600" />
            <MetricRow label="Temperature" value={result.sensorData.temperature} unit="°C" color="text-orange-600" />
            <MetricRow label="TDS (Total Dissolved Solids)" value={result.sensorData.tds} unit="ppm" color="text-cyan-600" />
            <MetricRow label="Turbidity" value={result.sensorData.turbidity} unit="NTU" color="text-lime-600" />
          </div>
        )}
      </Card>

      {/* Recommendations */}
      <Card>
        <h3 className="text-base font-semibold text-slate-700 mb-4">AI Recommendations</h3>
        <div className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-slate-600">{rec}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Feedback */}
      <Card>
        <h3 className="text-base font-semibold text-slate-700 mb-4">Was this result accurate?</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setFeedback('accurate')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all duration-200 ${
              feedback === 'accurate'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <MdThumbUp size={20} />
            <span className="font-medium text-sm">Accurate</span>
          </button>
          <button
            onClick={() => setFeedback('inaccurate')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all duration-200 ${
              feedback === 'inaccurate'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <MdThumbDown size={20} />
            <span className="font-medium text-sm">Inaccurate</span>
          </button>
        </div>
        {feedback && (
          <p className="mt-3 text-sm text-center text-slate-500">
            {feedback === 'accurate'
              ? '✅ Thank you for your feedback! This helps us improve our AI model.'
              : '📝 Sorry about the inaccuracy. We\'ll use your feedback to improve.'}
          </p>
        )}
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          onClick={handleShare}
          icon={<MdShare size={18} />}
          className="w-full"
        >
          Share Report
        </Button>
        <Button
          onClick={handleDownload}
          icon={<MdDownload size={18} />}
          className="w-full"
        >
          Download
        </Button>
      </div>

      {/* Quality Badge Summary */}
      <div className="flex justify-center">
        <QualityBadge quality={result.quality} />
      </div>
    </div>
  );
}
