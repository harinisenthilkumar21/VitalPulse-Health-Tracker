import pool from '../config/db';

export const User = {
  create: async (userData: any) => {
    const { name, email, password, age, gender, height, weight, contact, emergency_contact } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, age, gender, height, weight, contact, emergency_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, age, gender, height, weight, contact, emergency_contact]
    );
    return result;
  },
  findByEmail: async (email: string) => {
    const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  findById: async (id: number) => {
    const [rows]: any = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  update: async (id: number, userData: any) => {
    const { name, email, age, gender, height, weight, contact, emergency_contact, avatar_url } = userData;
    const values = [name, email, age, gender, height, weight, contact, emergency_contact, avatar_url, id].map((v) =>
      v === undefined ? null : v
    );
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, email = ?, age = ?, gender = ?, height = ?, weight = ?, contact = ?, emergency_contact = ?, avatar_url = ? WHERE id = ?',
      values
    );
    return result;
  },
  updatePassword: async (id: number, hashedPassword: string) => {
    const [result] = await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result;
  },
  delete: async (id: number) => {
    // Delete related data first due to foreign keys (if any)
    await pool.execute('DELETE FROM vitals WHERE user_id = ?', [id]);
    await pool.execute('DELETE FROM lifestyle WHERE user_id = ?', [id]);
    await pool.execute('DELETE FROM alerts WHERE user_id = ?', [id]);
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
};

export const Vital = {
  create: async (vitalData: any) => {
    const { user_id, heart_rate, systolic_bp, diastolic_bp, temperature, spo2, respiratory_rate } = vitalData;
    const [result] = await pool.execute(
      'INSERT INTO vitals (user_id, heart_rate, systolic_bp, diastolic_bp, temperature, spo2, respiratory_rate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, heart_rate, systolic_bp, diastolic_bp, temperature, spo2, respiratory_rate]
    );
    return result;
  },
  findByUserId: async (userId: number) => {
    const [rows]: any = await pool.execute('SELECT * FROM vitals WHERE user_id = ? ORDER BY recorded_at DESC', [userId]);
    return rows;
  },
  update: async (id: number, vitalData: any) => {
    const { heart_rate, systolic_bp, diastolic_bp, temperature, spo2, respiratory_rate } = vitalData;
    const [result] = await pool.execute(
      'UPDATE vitals SET heart_rate = ?, systolic_bp = ?, diastolic_bp = ?, temperature = ?, spo2 = ?, respiratory_rate = ? WHERE id = ?',
      [heart_rate, systolic_bp, diastolic_bp, temperature, spo2, respiratory_rate, id]
    );
    return result;
  }
};

export const Lifestyle = {
  create: async (lifestyleData: any) => {
    const { user_id, steps, calories, sleep_hours, water_intake, activity } = lifestyleData;
    const [result] = await pool.execute(
      'INSERT INTO lifestyle (user_id, steps, calories, sleep_hours, water_intake, activity) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, steps, calories, sleep_hours, water_intake, activity]
    );
    return result;
  },
  findByUserId: async (userId: number) => {
    const [rows]: any = await pool.execute('SELECT * FROM lifestyle WHERE user_id = ? ORDER BY recorded_at DESC', [userId]);
    return rows;
  },
  update: async (id: number, lifestyleData: any) => {
    const { steps, calories, sleep_hours, water_intake, activity } = lifestyleData;
    const [result] = await pool.execute(
      'UPDATE lifestyle SET steps = ?, calories = ?, sleep_hours = ?, water_intake = ?, activity = ? WHERE id = ?',
      [steps, calories, sleep_hours, water_intake, activity, id]
    );
    return result;
  }
};

export const Alert = {
  create: async (alertData: any) => {
    const { user_id, type, message, severity, value } = alertData;
    const [result] = await pool.execute(
      'INSERT INTO alerts (user_id, type, message, severity, value) VALUES (?, ?, ?, ?, ?)',
      [user_id, type, message, severity, value]
    );
    return result;
  },
  findByUserId: async (userId: number) => {
    const [rows]: any = await pool.execute('SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  }
};
