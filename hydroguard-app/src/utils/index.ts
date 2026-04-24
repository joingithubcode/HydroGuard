import type { QualityGrade, LiquidType, SensorData } from '../types';

export function getQualityColor(quality: QualityGrade): string {
  const map: Record<QualityGrade, string> = {
    Excellent: 'text-emerald-600',
    Good: 'text-blue-600',
    Fair: 'text-amber-600',
    Poor: 'text-red-600',
  };
  return map[quality];
}

export function getQualityBg(quality: QualityGrade): string {
  const map: Record<QualityGrade, string> = {
    Excellent: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Good: 'bg-blue-100 text-blue-700 border-blue-200',
    Fair: 'bg-amber-100 text-amber-700 border-amber-200',
    Poor: 'bg-red-100 text-red-700 border-red-200',
  };
  return map[quality];
}

export function getQualityGradient(quality: QualityGrade): string {
  const map: Record<QualityGrade, string> = {
    Excellent: 'from-emerald-400 to-emerald-600',
    Good: 'from-blue-400 to-blue-600',
    Fair: 'from-amber-400 to-amber-600',
    Poor: 'from-red-400 to-red-600',
  };
  return map[quality];
}

export function getQualityEmoji(quality: QualityGrade): string {
  const map: Record<QualityGrade, string> = {
    Excellent: '🟢',
    Good: '🔵',
    Fair: '🟡',
    Poor: '🔴',
  };
  return map[quality];
}

export function getPHStatus(ph: number): { label: string; color: string } {
  if (ph < 6) return { label: 'Acidic', color: 'text-orange-500' };
  if (ph > 8) return { label: 'Alkaline', color: 'text-purple-500' };
  return { label: 'Neutral', color: 'text-emerald-500' };
}

export function getTDSStatus(tds: number): { label: string; color: string } {
  if (tds < 300) return { label: 'Excellent', color: 'text-emerald-500' };
  if (tds < 600) return { label: 'Good', color: 'text-blue-500' };
  if (tds < 900) return { label: 'Fair', color: 'text-amber-500' };
  return { label: 'Poor', color: 'text-red-500' };
}

export function getTurbidityStatus(turbidity: number): { label: string; color: string } {
  if (turbidity < 1) return { label: 'Crystal Clear', color: 'text-emerald-500' };
  if (turbidity < 4) return { label: 'Clear', color: 'text-blue-500' };
  if (turbidity < 10) return { label: 'Slightly Cloudy', color: 'text-amber-500' };
  return { label: 'Turbid', color: 'text-red-500' };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function generateId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function classifyQuality(sensor: SensorData, liquidType: LiquidType): QualityGrade {
  let score = 0;
  const { ph, tds, turbidity, temperature } = sensor;

  if (liquidType === 'Water') {
    if (ph >= 6.5 && ph <= 8.5) score += 25;
    else if (ph >= 6 && ph <= 9) score += 15;
    if (tds < 300) score += 25;
    else if (tds < 600) score += 15;
    if (turbidity < 1) score += 25;
    else if (turbidity < 4) score += 15;
    if (temperature >= 15 && temperature <= 25) score += 25;
    else if (temperature >= 10 && temperature <= 30) score += 15;
  } else {
    score = Math.floor(Math.random() * 40) + 60;
  }

  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 45) return 'Fair';
  return 'Poor';
}

export function getRecommendations(quality: QualityGrade, liquidType: LiquidType): string[] {
  if (quality === 'Excellent') {
    return [
      `This ${liquidType.toLowerCase()} is of excellent quality`,
      'Safe for immediate consumption',
      'Store properly to maintain freshness',
    ];
  }
  if (quality === 'Good') {
    return [
      `This ${liquidType.toLowerCase()} is of good quality`,
      'Suitable for consumption',
      'Use within recommended timeframe',
    ];
  }
  if (quality === 'Fair') {
    return [
      `This ${liquidType.toLowerCase()} shows some quality concerns`,
      'Consider filtering or treating before use',
      'Monitor closely and use soon',
    ];
  }
  return [
    `This ${liquidType.toLowerCase()} has poor quality indicators`,
    'Not recommended for consumption without treatment',
    'Consider discarding or advanced treatment',
  ];
}
