import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPlayArrow, MdStop, MdRefresh, MdScience,
  MdCheckCircle, MdWarning,
} from 'react-icons/md';
import { useApp } from '../context/AppContext';
import { Button, Card, Select, ProgressBar } from '../components/ui';
import { SensorGauges } from '../components/sensors/SensorDisplay';
import type { LiquidType, TestResult } from '../types';

const liquidTypes: LiquidType[] = ['Water', 'Juice', 'Milk', 'Tea', 'Coffee', 'Other'];

const liquidIcons: Record<LiquidType, string> = {
  Water: '💧', Juice: '🍊', Milk: '🥛', Tea: '🍵', Coffee: '☕', Other: '🧪',
};

export default function TestScreen() {
  const { state, startTest, resetTest } = useApp();
  const navigate = useNavigate();
  const [selectedLiquid, setSelectedLiquid] = useState<LiquidType>('Water');
  const [isRunning, setIsRunning] = useState(false);
  const [completedResult, setCompletedResult] = useState<TestResult | null>(null);
  const abortRef = useRef(false);
  const { currentTest, sensorData } = state;

  const handleStart = async () => {
    abortRef.current = false;
    setIsRunning(true);
    setCompletedResult(null);
    try {
      const result = await startTest(selectedLiquid);
      if (!abortRef.current) {
        setCompletedResult(result);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    abortRef.current = true;
    setIsRunning(false);
    resetTest();
  };

  const handleReset = () => {
    resetTest();
    setCompletedResult(null);
  };

  const handleViewResults = () => {
    if (completedResult) {
      navigate('/results', { state: { result: completedResult } });
    }
  };

  const progress = currentTest.status === 'running' ? currentTest.progress : completedResult ? 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">New Liquid Test</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time liquid quality analysis</p>
        </div>
        {completedResult && (
          <Button variant="ghost" size="sm" onClick={handleReset} icon={<MdRefresh size={18} />}>
            New Test
          </Button>
        )}
      </div>

      {/* Liquid Type Selection */}
      <Card>
        <h3 className="text-base font-semibold text-slate-700 mb-4">Select Liquid Type</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
          {liquidTypes.map(type => (
            <button
              key={type}
              onClick={() => !isRunning && setSelectedLiquid(type)}
              className={`
                flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200
                ${selectedLiquid === type
                  ? 'border-primary-500 bg-primary-50 shadow-md scale-105'
                  : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                }
                ${isRunning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-2xl">{liquidIcons[type]}</span>
              <span className="text-xs font-medium text-slate-600">{type}</span>
            </button>
          ))}
        </div>

        {/* Also show as dropdown for accessibility */}
        <Select
          label="Or select from dropdown"
          options={liquidTypes.map(t => ({ value: t, label: `${liquidIcons[t]} ${t}` }))}
          value={selectedLiquid}
          onChange={e => !isRunning && setSelectedLiquid(e.target.value as LiquidType)}
          disabled={isRunning}
        />
      </Card>

      {/* Test Control */}
      <Card>
        <div className="flex flex-col items-center gap-6 py-4">
          {/* Status indicator */}
          <div className="text-center">
            {!isRunning && !completedResult && (
              <div>
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <MdScience size={40} className="text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">Ready to test {liquidIcons[selectedLiquid]} {selectedLiquid}</p>
                <p className="text-slate-400 text-sm">Place the sensor in the liquid and press Start</p>
              </div>
            )}
            {isRunning && (
              <div>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r="40" fill="none"
                      stroke="#0369a1" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-700">{progress}%</span>
                  </div>
                </div>
                <p className="text-primary-700 font-semibold">Analyzing {liquidIcons[selectedLiquid]} {selectedLiquid}...</p>
                <p className="text-slate-400 text-sm">Collecting sensor data, please hold steady</p>
              </div>
            )}
            {completedResult && !isRunning && (
              <div>
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <MdCheckCircle size={44} className="text-emerald-500" />
                </div>
                <p className="text-emerald-700 font-semibold text-lg">Analysis Complete!</p>
                <p className="text-slate-500 text-sm">
                  Result: <span className="font-bold text-slate-700">{completedResult.quality}</span>
                  {' · '}
                  Confidence: <span className="font-bold text-primary-600">{completedResult.confidence}%</span>
                </p>
              </div>
            )}
          </div>

          {/* Progress */}
          {(isRunning || completedResult) && (
            <div className="w-full max-w-sm">
              <ProgressBar
                value={progress}
                color={completedResult ? 'bg-emerald-500' : 'bg-primary-500'}
                showLabel
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap justify-center">
            {!isRunning && !completedResult && (
              <Button onClick={handleStart} size="lg" icon={<MdPlayArrow size={22} />}>
                Start Test
              </Button>
            )}
            {isRunning && (
              <Button variant="danger" onClick={handleStop} size="lg" icon={<MdStop size={22} />}>
                Stop Test
              </Button>
            )}
            {completedResult && (
              <>
                <Button onClick={handleViewResults} size="lg" icon={<MdCheckCircle size={20} />}>
                  View Results
                </Button>
                <Button variant="secondary" onClick={handleReset} size="lg" icon={<MdRefresh size={20} />}>
                  New Test
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Live Sensor Data */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-700">Live Sensor Readings</h3>
          {isRunning && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Collecting Data
            </span>
          )}
        </div>
        <SensorGauges data={sensorData} />
      </div>

      {/* Instructions */}
      {!isRunning && !completedResult && (
        <Card>
          <h3 className="text-base font-semibold text-slate-700 mb-3">
            <MdWarning className="inline text-amber-500 mr-1" size={18} />
            Instructions
          </h3>
          <ol className="space-y-2 text-sm text-slate-600">
            {[
              'Ensure the HydroGuard sensor is connected via Bluetooth',
              'Select the liquid type you want to test',
              'Submerge the sensor probe completely in the liquid',
              'Press "Start Test" and hold steady for accurate readings',
              'Wait for the analysis to complete (approx. 30 seconds)',
              'View detailed results and recommendations',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
