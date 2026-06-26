import { User, VitalRecord, LifestyleRecord, Alert } from './types';

export const mockUser: User = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  age: 28,
  gender: 'Male',
  height: 180,
  weight: 75,
  contact: '+1 (555) 123-4567',
  emergency_contact: '+1 (555) 987-6543',
};

export const mockVitals: VitalRecord[] = [
  {
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    spO2: 98,
    timestamp: '2024-03-26T08:00:00Z',
  },
  {
    heartRate: 85,
    bloodPressure: { systolic: 125, diastolic: 82 },
    temperature: 98.8,
    spO2: 97,
    timestamp: '2024-03-26T12:00:00Z',
  },
  {
    heartRate: 105, // Abnormal
    bloodPressure: { systolic: 140, diastolic: 90 }, // Abnormal
    temperature: 99.1,
    spO2: 96,
    timestamp: '2024-03-26T16:00:00Z',
  },
];

export const mockLifestyle: LifestyleRecord[] = [
  {
    steps: 8500,
    sleepHours: 7.5,
    waterIntake: 2.5,
    calories: 2100,
    activity: 'Running',
    timestamp: '2024-03-25T22:00:00Z',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    time: '2 hours ago',
    message: 'High Heart Rate detected (105 bpm)',
    severity: 'High',
  },
  {
    id: '2',
    time: '4 hours ago',
    message: 'Blood Pressure slightly elevated (140/90)',
    severity: 'Medium',
  },
  {
    id: '3',
    time: '1 day ago',
    message: 'Daily step goal reached!',
    severity: 'Low',
  },
];

export const heartRateTrend = [
  { time: '08:00', value: 72 },
  { time: '10:00', value: 75 },
  { time: '12:00', value: 85 },
  { time: '14:00', value: 80 },
  { time: '16:00', value: 105 },
  { time: '18:00', value: 90 },
  { time: '20:00', value: 78 },
];

export const sleepTrend = [
  { day: 'Mon', hours: 7.2 },
  { day: 'Tue', hours: 6.8 },
  { day: 'Wed', hours: 7.5 },
  { day: 'Thu', hours: 8.0 },
  { day: 'Fri', hours: 6.5 },
  { day: 'Sat', hours: 8.5 },
  { day: 'Sun', hours: 7.8 },
];

export const stepsTrend = [
  { day: 'Mon', steps: 8200 },
  { day: 'Tue', steps: 9500 },
  { day: 'Wed', steps: 7800 },
  { day: 'Thu', steps: 10200 },
  { day: 'Fri', steps: 11000 },
  { day: 'Sat', steps: 6500 },
  { day: 'Sun', steps: 8900 },
];
