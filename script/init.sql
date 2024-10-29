drop database squash;
create database squash charset utf8mb4;

USE squash;

CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    compression_level VARCHAR(255), 
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);