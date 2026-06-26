
CREATE DATABASE IF NOT EXISTS health_monitor;
USE health_monitor;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    height FLOAT,
    weight FLOAT,
    contact VARCHAR(20),
    emergency_contact VARCHAR(20),
    avatar_url MEDIUMTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS vitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    heart_rate INT,
    systolic_bp INT,
    diastolic_bp INT,
    temperature FLOAT,
    spo2 INT,
    respiratory_rate INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS lifestyle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    steps INT,
    calories INT,
    sleep_hours FLOAT,
    water_intake FLOAT,
    activity VARCHAR(100),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50),
    message TEXT,
    severity ENUM('High', 'Medium', 'Low'),
    value VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
