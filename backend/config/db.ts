import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "", 
    database: "health_monitor", 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL Connected Successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Failed:", err);
  });

export default pool;
