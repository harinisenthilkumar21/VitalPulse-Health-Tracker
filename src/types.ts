export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number;
  weight: number;
  contact: string;
  emergency_contact: string;
  avatar_url?: string | null;
}

export interface VitalRecord {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  temperature: number;
  spO2: number;
  timestamp: string;
}

export interface LifestyleRecord {
  steps: number;
  sleepHours: number;
  waterIntake: number;
  calories: number;
  activity: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  time: string;
  message: string;
  severity: 'High' | 'Medium' | 'Low';
}

export type Page = 'dashboard' | 'track' | 'insights' | 'alerts' | 'profile' | 'settings';
