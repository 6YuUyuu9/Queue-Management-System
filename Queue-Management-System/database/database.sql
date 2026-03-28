-- ลบตารางเก่าทิ้งถ้ามีอยู่แล้ว (เรียงจากตารางลูกไปตารางแม่ ป้องกัน Error Foreign Key)
DROP TABLE IF EXISTS queues;
DROP TABLE IF EXISTS counters;
DROP TABLE IF EXISTS users;

-- 1. สร้างตาราง users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. สร้างตาราง counters (Updated)
CREATE TABLE counters (
    counter_id INT AUTO_INCREMENT PRIMARY KEY,
    counter_name VARCHAR(50) NOT NULL,
    counter_type VARCHAR(20) NOT NULL, -- New: e.g., '2-people', '4-people', 'VIP'
    status VARCHAR(20) DEFAULT 'active'
);

-- 3. สร้างตาราง queues (Updated)
CREATE TABLE queues (
    queue_id INT AUTO_INCREMENT PRIMARY KEY,
    queue_number VARCHAR(10) NOT NULL,
    user_id INT NOT NULL,
    counter_id INT NULL, 
    requested_type VARCHAR(20) NOT NULL, -- New: User chooses '2-people' when booking
    status VARCHAR(20) DEFAULT 'waiting', 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (counter_id) REFERENCES counters(counter_id)
);