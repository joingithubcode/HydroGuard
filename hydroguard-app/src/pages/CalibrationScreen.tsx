import { useState } from 'react';
import {
  MdCheckCircle, MdRadioButtonUnchecked, MdScience,
  MdWaterDrop, MdThermostat, MdOpacity,
  MdPlayArrow, MdRefresh, MdInfo,
} from 'react-icons/md';
import { Button, Card, ProgressBar } from '../components/ui';
import type { CalibrationStep } from '../types';

const calibrationSteps: Omit<CalibrationStep, 'status'>[] = [
  {
    id: 1,
    title: 'pH Calibration - Buffer 7.0',
    description: 'Place the pH probe in pH 7.0 buffer solution. Wait for the reading to stabilize, then confirm.',
    sensor: 'pH',
    referenceValue: '7.00',
    unit: 'pH',
  },
  {
    id: 2,
    title: 'pH Calibration - Buffer 4.0',
    description: 'Rinse the probe with distilled water, then place it in pH 4.0 buffer solution.',
    sensor: 'pH',
    referenceValue: '4.00',
    unit: 'pH',
  },
  {
    id: 3,
    title: 'pH Calibration - Buffer 10.0',
    description: 'Rinse the probe again, then place it in pH 10.0 buffer solution.',
    sensor: 'pH',
    referenceValue: '10.00',
    unit: 'pH',
  },
  {
    id: 4,
    title: 'Temperature Calibration',
    description: 'Place the temperature sensor in water at known temperature (use a reference thermometer).',
    sensor: 'Temperature',
    referenceValue: '25.0',
    unit: '°C',
  },
  {
    id: 5,
    title: 'TDS Calibration',
    description: 'Immerse TDS probe in the calibration solution (1413 μS/cm standard).',
    sensor: 'TDS',
    referenceValue: '707',
    unit: 'ppm',
  },
  {
    id: 6,
    title: 'Turbidity Calibration - Zero',
    description: 'Place the turbidity sensor in distilled water for zero-point calibration.',
    sensor: 'Turbidity',
    referenceValue: '0.0',
    unit: 'NTU',
  },
];

const sensorIcons: Record<string, React.ReactNode> = {
  pH: <MdScience size={20} />,
  Temperature: <MdThermostat size={20} />,
  TDS: <MdWaterDrop size={20} />,
  Turbidity: <MdOpacity size={20} />,
};

export default function CalibrationScreen() {
  const [steps, setSteps] = useState<CalibrationStep[]>(
    calibrationSteps.map(s => ({ ...s, status: 'pending' }))
  );
  const [currentStepIdx, setCurrentStepIdx] = useState<number | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [mockValue, setMockValue] = useState('');

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const allComplete = completedCount === steps.length;

  const startStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setMockValue('');
    setSteps(prev => prev.map((s, i) =>
      i === idx ? { ...s, status: 'in_progress' } : s
    ));
    setIsCalibrating(true);

    // Simulate sensor stabilization
    setTimeout(() => {
      const step = calibrationSteps[idx];
      const variance = (Math.random() - 0.5) * 0.2;
      setMockValue((parseFloat(step.referenceValue) + variance).toFixed(2));
    }, 2000);
  };

  const confirmStep = (idx: number) => {
    setSteps(prev => prev.map((s, i) =>
      i === idx ? { ...s, status: 'completed' } : s
    ));
    setIsCalibrating(false);
    setCurrentStepIdx(null);
    // Auto-advance to next step
    if (idx + 1 < steps.length && steps[idx + 1].status === 'pending') {
      setTimeout(() => startStep(idx + 1), 300);
    }
  };

  const resetCalibration = () => {
    setSteps(calibrationSteps.map(s => ({ ...s, status: 'pending' })));
    setCurrentStepIdx(null);
    setIsCalibrating(false);
    setMockValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Sensor Calibration</h1>
          <p className="text-slate-400 text-sm mt-1">Step-by-step calibration wizard</p>
        </div>
        <Button variant="ghost" size="sm" onClick={resetCalibration} icon={<MdRefresh size={18} />}>
          Reset
        </Button>
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-700 text-sm">Overall Progress</h3>
          <span className="text-sm font-bold text-primary-600">{completedCount}/{steps.length} steps</span>
        </div>
        <ProgressBar
          value={completedCount}
          max={steps.length}
          color={allComplete ? 'bg-emerald-500' : 'bg-primary-500'}
          showLabel={false}
        />
        {allComplete && (
          <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
            <MdCheckCircle size={20} className="text-emerald-500" />
            <p className="text-emerald-700 font-medium text-sm">All sensors calibrated successfully! ✅</p>
          </div>
        )}
      </Card>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
        <MdInfo size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Calibrate sensors before each testing session for accurate results.
          Have your calibration solutions ready before starting.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isActive = currentStepIdx === idx;
          const isCompleted = step.status === 'completed';
          const isPending = step.status === 'pending';
          const canStart = isPending && (idx === 0 || steps[idx - 1].status === 'completed') && !isCalibrating;

          return (
            <Card key={step.id} className={`transition-all duration-300 ${isActive ? 'ring-2 ring-primary-400' : ''}`}>
              <div className="flex items-start gap-4">
                {/* Step indicator */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-100 text-emerald-600' :
                  isActive ? 'bg-primary-100 text-primary-600' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? <MdCheckCircle size={22} /> : isPending ? <MdRadioButtonUnchecked size={22} /> : sensorIcons[step.sensor]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-slate-700 text-sm">{step.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isCompleted ? 'bg-emerald-100 text-emerald-700' :
                      isActive ? 'bg-primary-100 text-primary-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {isCompleted ? '✓ Done' : isActive ? '⚡ In Progress' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{step.description}</p>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Sensor:</span>
                    <span className="font-medium text-slate-600">{step.sensor}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">Reference:</span>
                    <span className="font-medium text-slate-600">{step.referenceValue} {step.unit}</span>
                  </div>

                  {/* Live reading during calibration */}
                  {isActive && (
                    <div className="mt-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary-600 font-medium">Current Reading</span>
                        <span className="text-xs text-primary-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                          Stabilizing...
                        </span>
                      </div>
                      <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold text-primary-700">
                          {mockValue || '---'}
                        </span>
                        <span className="text-sm text-primary-500 mb-0.5">{step.unit}</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => confirmStep(idx)}
                          disabled={!mockValue}
                          icon={<MdCheckCircle size={16} />}
                        >
                          Confirm & Continue
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status: 'pending' } : s));
                            setCurrentStepIdx(null);
                            setIsCalibrating(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {canStart && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-3"
                      onClick={() => startStep(idx)}
                      icon={<MdPlayArrow size={16} />}
                    >
                      Start Step
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Save */}
      {allComplete && (
        <Button size="lg" className="w-full" icon={<MdCheckCircle size={20} />}>
          Save Calibration Data
        </Button>
      )}
    </div>
  );
}
