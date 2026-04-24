import type { TestResult, DeviceInfo, SensorData } from '../types';

export const mockDevice: DeviceInfo = {
  name: 'HydroGuard Pro',
  id: 'HG-2024-001',
  status: 'connected',
  batteryLevel: 78,
  firmwareVersion: '2.1.4',
  lastSynced: new Date(Date.now() - 5 * 60 * 1000),
};

export const mockSensorData: SensorData = {
  ph: 7.2,
  temperature: 22.5,
  tds: 245,
  turbidity: 0.8,
  timestamp: new Date(),
};

const sampleResults: TestResult[] = [
  {
    id: 'test_001',
    liquidType: 'Water',
    quality: 'Excellent',
    confidence: 96,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    expiryDays: 7,
    sensorData: { ph: 7.1, temperature: 22, tds: 210, turbidity: 0.5, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    recommendations: ['Excellent water quality', 'Safe for consumption', 'Store at room temperature'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'test_002',
    liquidType: 'Milk',
    quality: 'Good',
    confidence: 88,
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    expiryDays: 3,
    sensorData: { ph: 6.7, temperature: 6, tds: 680, turbidity: 2.1, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    recommendations: ['Good milk quality', 'Consume within 3 days', 'Keep refrigerated'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'test_003',
    liquidType: 'Juice',
    quality: 'Fair',
    confidence: 72,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    expiryDays: 1,
    sensorData: { ph: 3.8, temperature: 8, tds: 1200, turbidity: 5.2, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    recommendations: ['Juice quality is fair', 'Consume today', 'Keep refrigerated'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'test_004',
    liquidType: 'Water',
    quality: 'Good',
    confidence: 91,
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    expiryDays: 5,
    sensorData: { ph: 7.4, temperature: 20, tds: 350, turbidity: 1.2, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    recommendations: ['Good water quality', 'Safe for consumption', 'Slightly elevated TDS'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'test_005',
    liquidType: 'Tea',
    quality: 'Excellent',
    confidence: 94,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    expiryDays: 2,
    sensorData: { ph: 5.5, temperature: 85, tds: 320, turbidity: 3.5, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    recommendations: ['Excellent tea quality', 'Freshly brewed', 'Consume within 2 days'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'test_006',
    liquidType: 'Water',
    quality: 'Poor',
    confidence: 85,
    expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expiryDays: 0,
    sensorData: { ph: 9.2, temperature: 28, tds: 950, turbidity: 12.5, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    recommendations: ['Poor water quality detected', 'Not recommended for consumption', 'Consider treatment'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'test_007',
    liquidType: 'Coffee',
    quality: 'Good',
    confidence: 89,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    expiryDays: 1,
    sensorData: { ph: 5.0, temperature: 90, tds: 2800, turbidity: 45.0, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
    recommendations: ['Good coffee quality', 'Freshly brewed', 'Best consumed hot'],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'test_008',
    liquidType: 'Milk',
    quality: 'Poor',
    confidence: 93,
    expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiryDays: 0,
    sensorData: { ph: 5.8, temperature: 15, tds: 800, turbidity: 8.0, timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
    recommendations: ['Milk has expired', 'Discard immediately', 'Do not consume'],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
];

export const mockResults: TestResult[] = sampleResults;

export const chartData = [
  { date: 'Mon', ph: 7.1, tds: 210, turbidity: 0.5, temperature: 22 },
  { date: 'Tue', ph: 7.3, tds: 235, turbidity: 0.8, temperature: 21 },
  { date: 'Wed', ph: 6.9, tds: 280, turbidity: 1.2, temperature: 23 },
  { date: 'Thu', ph: 7.2, tds: 245, turbidity: 0.6, temperature: 22 },
  { date: 'Fri', ph: 7.5, tds: 310, turbidity: 1.5, temperature: 24 },
  { date: 'Sat', ph: 7.0, tds: 225, turbidity: 0.9, temperature: 20 },
  { date: 'Sun', ph: 7.2, tds: 245, turbidity: 0.8, temperature: 22 },
];

export const qualityStats = {
  total: 8,
  excellent: 2,
  good: 3,
  fair: 1,
  poor: 2,
  averageConfidence: 88.5,
};
