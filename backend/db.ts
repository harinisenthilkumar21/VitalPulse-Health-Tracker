import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your MySQL password
  database: "health_monitoring" // your DB name
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

export default db;