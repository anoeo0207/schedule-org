drop database schedule;
create database schedule;

use schedule;


CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY ,
    role_name VARCHAR(256) NOT NULL,
    is_delete BOOL default  FALSE
);

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY ,
    username VARCHAR(256) NOT NULL,
    password VARCHAR(512) NOT NULL,
    user_role_id INT NOT NULL REFERENCES role(role_id),
    is_delete BOOL default  FALSE
);


CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY ,
    event_name TEXT NOT NULL,
    event_time DATETIME NOT NULL,
    created_date DATETIME DEFAULT NOW(),
    event_place TEXT NOT NULL,
    created_user_id INT REFERENCES user(user_id),
    is_delete BOOL default  FALSE
);


