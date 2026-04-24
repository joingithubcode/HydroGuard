export type QualityGrade = 'Excellent' | 'Good' | 'Fair' | 'Poor';
export type LiquidType = 'Water' | 'Juice' | 'Milk' | 'Tea' | 'Coffee' | 'Other';
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';
export type TestStatus = 'idle' | 'running' | 'completed' | 'error';

export interface SensorData {
  ph: number;
  temperature: number;
  tds: number;
  turbidity: number;
  timestamp: Date;
}

export interface TestResult {
  id: string;
  liquidType: LiquidType;
  quality: QualityGrade;
  confidence: number;
  expiryDate: Date;
  expiryDays: number;
  sensorData: SensorData;
  recommendations: string[];
  notes?: string;
  createdAt: Date;
}

export interface DeviceInfo {
  name: string;
  id: string;
  status: ConnectionStatus;
  batteryLevel: number;
  firmwareVersion: string;
  lastSynced: Date;
}

export interface UserPreferences {
  name: string;
  email: string;
  notifications: boolean;
  autoSave: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  units: 'metric' | 'imperial';
}

export interface CalibrationStep {
  id: number;
  title: string;
  description: string;
  sensor: string;
  referenceValue: string;
  unit: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface HistoryFilter {
  quality?: QualityGrade;
  liquidType?: LiquidType;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface AppState {
  device: DeviceInfo;
  sensorData: SensorData;
  currentTest: {
    status: TestStatus;
    progress: number;
    liquidType: LiquidType;
  };
  recentResults: TestResult[];
  preferences: UserPreferences;
}
