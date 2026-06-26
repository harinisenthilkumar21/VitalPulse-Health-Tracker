import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Vital, Lifestyle, Alert } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const nullIfBlank = (v: unknown): string | null => {
  if (v === undefined || v === null) return null;
  if (typeof v === 'string') {
    const t = v.trim();
    return t === '' ? null : t;
  }
  return String(v);
};

const intOrNull = (v: unknown): number | null => {
  if (v === undefined || v === null || v === '') return null;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
};

const floatOrNull = (v: unknown): number | null => {
  if (v === undefined || v === null || v === '') return null;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age, gender, height, weight, contact, emergency_contact } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Sanitize numeric fields: convert empty strings to null
    const userData = {
      name,
      email,
      password: hashedPassword,
      age: age === '' ? null : parseInt(age),
      gender,
      height: height === '' ? null : parseFloat(height),
      weight: weight === '' ? null : parseFloat(weight),
      contact,
      emergency_contact
    };

    await User.create(userData);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addVitals = async (req: Request, res: Response) => {
  try {
    const { user_id, heart_rate, systolic_bp, diastolic_bp, temperature, spo2, respiratory_rate } = req.body;
    await Vital.create({ user_id, heart_rate, systolic_bp, diastolic_bp, temperature, spo2, respiratory_rate });

    // Alert Logic
    const alerts = [];
    if (heart_rate > 100) alerts.push({ type: 'Heart Rate', message: `High Heart Rate detected: ${heart_rate} bpm`, severity: 'High', value: heart_rate });
    if (heart_rate < 60) alerts.push({ type: 'Heart Rate', message: `Low Heart Rate detected: ${heart_rate} bpm`, severity: 'Medium', value: heart_rate });
    if (systolic_bp > 140 || diastolic_bp > 90) alerts.push({ type: 'Blood Pressure', message: `High Blood Pressure detected: ${systolic_bp}/${diastolic_bp}`, severity: 'High', value: `${systolic_bp}/${diastolic_bp}` });
    if (spo2 < 95) alerts.push({ type: 'SpO2', message: `Low SpO2 level: ${spo2}%`, severity: 'High', value: spo2 });
    if (temperature > 100) alerts.push({ type: 'Temperature', message: `High Temperature detected: ${temperature}°F`, severity: 'Medium', value: temperature });

    for (const alert of alerts) {
      await Alert.create({ user_id, ...alert });
    }

    res.status(201).json({ message: 'Vitals recorded successfully', alertsGenerated: alerts.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getVitals = async (req: Request, res: Response) => {
  try {
    const vitals = await Vital.findByUserId(parseInt(req.params.user_id));
    res.json(vitals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addLifestyle = async (req: Request, res: Response) => {
  try {
    const { user_id, steps, calories, sleep_hours, water_intake, activity } = req.body;
    await Lifestyle.create({ user_id, steps, calories, sleep_hours, water_intake, activity });
    res.status(201).json({ message: 'Lifestyle data recorded successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLifestyle = async (req: Request, res: Response) => {
  try {
    const lifestyle = await Lifestyle.findByUserId(parseInt(req.params.user_id));
    res.json(lifestyle);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await Alert.findByUserId(parseInt(req.params.user_id));
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (!Number.isFinite(userId) || userId < 1) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    const existing = await User.findById(userId);
    if (!existing) return res.status(404).json({ message: 'User not found' });

    const {
      name,
      email,
      age,
      gender,
      height,
      weight,
      contact,
      emergency_contact,
      avatar_url,
    } = req.body;

    const updatedData = {
      name: nullIfBlank(name) ?? existing.name,
      email: nullIfBlank(email) ?? existing.email,
      age: age === '' || age === undefined ? existing.age : intOrNull(age),
      gender: nullIfBlank(gender) ?? existing.gender,
      height: height === '' || height === undefined ? existing.height : floatOrNull(height),
      weight: weight === '' || weight === undefined ? existing.weight : floatOrNull(weight),
      contact:
        contact === undefined ? existing.contact : nullIfBlank(contact),
      emergency_contact:
        emergency_contact === undefined
          ? existing.emergency_contact
          : nullIfBlank(emergency_contact),
      avatar_url:
        'avatar_url' in req.body
          ? avatar_url === null || avatar_url === ''
            ? null
            : String(avatar_url)
          : existing.avatar_url ?? null,
    };

    await User.update(userId, updatedData);

    const updatedUser = await User.findById(userId);
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const fromBody = req.body?.userId ?? req.body?.id;
    const fromParams = req.params?.id;
    const raw =
      fromBody !== undefined && fromBody !== null && fromBody !== ''
        ? fromBody
        : fromParams;
    const userId = parseInt(String(raw), 10);
    const { currentPassword, newPassword } = req.body;

    if (!Number.isFinite(userId) || userId < 1) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Current password and new password are required' });
    }
    if (String(newPassword).length < 6) {
      return res
        .status(400)
        .json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const passwordRaw = user.password as string | Buffer | null | undefined;

const storedHash = Buffer.isBuffer(passwordRaw)
  ? passwordRaw.toString('utf8').trim()
  : String(passwordRaw ?? '').trim();

    const current = String(currentPassword);
    let isMatch = false;
    try {
      if (storedHash.startsWith('$2')) {
        isMatch = await bcrypt.compare(current, storedHash);
      } else {
        isMatch = current === storedHash;
      }
    } catch {
      isMatch = false;
    }
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(String(newPassword), 10);
    await User.updatePassword(userId, hashed);

    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.delete(parseInt(id));
    res.json({ message: 'Profile deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVitals = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Vital.update(parseInt(id), req.body);
    res.json({ message: 'Vitals updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLifestyle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Lifestyle.update(parseInt(id), req.body);
    res.json({ message: 'Lifestyle data updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
