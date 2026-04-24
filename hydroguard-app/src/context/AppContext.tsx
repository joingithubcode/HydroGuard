import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AppState, SensorData, TestResult, LiquidType, UserPreferences } from '../types';
import { mockDevice, mockSensorData, mockResults } from '../data/mockData';
import { classifyQuality, getRecommendations, generateId } from '../utils';

type Action =
  | { type: 'UPDATE_SENSOR_DATA'; payload: SensorData }
  | { type: 'START_TEST'; payload: LiquidType }
  | { type: 'UPDATE_TEST_PROGRESS'; payload: number }
  | { type: 'COMPLETE_TEST'; payload: TestResult }
  | { type: 'RESET_TEST' }
  | { type: 'ADD_RESULT'; payload: TestResult }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_DEVICE_STATUS'; payload: 'connected' | 'disconnected' | 'connecting' }
  | { type: 'UPDATE_BATTERY'; payload: number };

const initialState: AppState = {
  device: mockDevice,
  sensorData: mockSensorData,
  currentTest: {
    status: 'idle',
    progress: 0,
    liquidType: 'Water',
  },
  recentResults: mockResults,
  preferences: {
    name: 'Ahmad Ali',
    email: 'ahmad@hydroguard.com',
    notifications: true,
    autoSave: true,
    theme: 'light',
    language: 'English',
    units: 'metric',
  },
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_SENSOR_DATA':
      return { ...state, sensorData: action.payload };
    case 'START_TEST':
      return {
        ...state,
        currentTest: { status: 'running', progress: 0, liquidType: action.payload },
      };
    case 'UPDATE_TEST_PROGRESS':
      return {
        ...state,
        currentTest: { ...state.currentTest, progress: action.payload },
      };
    case 'COMPLETE_TEST': {
      const results = [action.payload, ...state.recentResults].slice(0, 50);
      return {
        ...state,
        currentTest: { ...state.currentTest, status: 'completed', progress: 100 },
        recentResults: results,
      };
    }
    case 'RESET_TEST':
      return {
        ...state,
        currentTest: { status: 'idle', progress: 0, liquidType: 'Water' },
      };
    case 'ADD_RESULT':
      return {
        ...state,
        recentResults: [action.payload, ...state.recentResults].slice(0, 50),
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    case 'SET_DEVICE_STATUS':
      return {
        ...state,
        device: { ...state.device, status: action.payload },
      };
    case 'UPDATE_BATTERY':
      return {
        ...state,
        device: { ...state.device, batteryLevel: action.payload },
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  startTest: (liquidType: LiquidType) => Promise<TestResult>;
  resetTest: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startTest = useCallback(
    (liquidType: LiquidType): Promise<TestResult> => {
      return new Promise((resolve) => {
        dispatch({ type: 'START_TEST', payload: liquidType });

        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 8 + 2;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            const sensorData: SensorData = {
              ph: 6.5 + Math.random() * 2,
              temperature: 18 + Math.random() * 15,
              tds: 150 + Math.random() * 500,
              turbidity: Math.random() * 5,
              timestamp: new Date(),
            };

            const quality = classifyQuality(sensorData, liquidType);
            const expiryDays = quality === 'Excellent' ? 7 : quality === 'Good' ? 5 : quality === 'Fair' ? 2 : 0;

            const result: TestResult = {
              id: generateId(),
              liquidType,
              quality,
              confidence: Math.floor(80 + Math.random() * 18),
              expiryDate: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
              expiryDays,
              sensorData,
              recommendations: getRecommendations(quality, liquidType),
              createdAt: new Date(),
            };

            dispatch({ type: 'COMPLETE_TEST', payload: result });
            resolve(result);
          } else {
            dispatch({ type: 'UPDATE_TEST_PROGRESS', payload: Math.floor(progress) });
            // Simulate live sensor data fluctuations
            dispatch({
              type: 'UPDATE_SENSOR_DATA',
              payload: {
                ...state.sensorData,
                ph: 6.8 + Math.random() * 1.5,
                temperature: 20 + Math.random() * 5,
                tds: 200 + Math.random() * 200,
                turbidity: Math.random() * 3,
                timestamp: new Date(),
              },
            });
          }
        }, 300);
      });
    },
    [state.sensorData]
  );

  const resetTest = useCallback(() => {
    dispatch({ type: 'RESET_TEST' });
  }, []);

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: prefs });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, startTest, resetTest, updatePreferences }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
