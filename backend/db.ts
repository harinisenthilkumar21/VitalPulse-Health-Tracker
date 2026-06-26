import mysql from "mysql2/promise"; // or import * as mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 23404,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Add this block exactly right here inside the object configurations:
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
