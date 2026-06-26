import db from "../db";

export class User {

  // 🔍 Find user by email
  static async findByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }

  // 🔍 Find user by ID
  static async findById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE id = ?", [id], (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }

  // ➕ Create user
  static async create(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users 
        (name, email, password, age, gender, height, weight, contact, emergency_contact)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        data.name,
        data.email,
        data.password,
        data.age,
        data.gender,
        data.height,
        data.weight,
        data.contact,
        data.emergency_contact
      ];

      db.query(sql, values, (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // ✏️ Update user
  static async update(id: number, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE users SET 
          name = ?, 
          email = ?, 
          age = ?, 
          gender = ?, 
          height = ?, 
          weight = ?, 
          contact = ?, 
          emergency_contact = ?
        WHERE id = ?
      `;

      const values = [
        data.name,
        data.email,
        data.age,
        data.gender,
        data.height,
        data.weight,
        data.contact,
        data.emergency_contact,
        id,
      ].map((v) => (v === undefined ? null : v));

      db.query(sql, values, (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // ❌ Delete user
  static async delete(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id = ?", [id], (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}