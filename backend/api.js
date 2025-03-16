// Create a new API instance using nodejs express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = express();
const port = 3000;

// create an API to retrieve data from database named: 'schedule'
// the base has the following schema:
// CREATE TABLE role (
//     role_id INT AUTO_INCREMENT PRIMARY KEY ,
//     role_name VARCHAR(256) NOT NULL,
//     is_delete BOOL default  FALSE
// );
// CREATE TABLE user (
//     user_id INT AUTO_INCREMENT PRIMARY KEY ,
//     username VARCHAR(256) NOT NULL,
//     password VARCHAR(512) NOT NULL,
//     user_role_id INT NOT NULL REFERENCES role(role_id),
//     is_delete BOOL default  FALSE
// );
// CREATE TABLE events (
//     event_id INT AUTO_INCREMENT PRIMARY KEY ,
//     event_name TEXT NOT NULL,
//     event_time DATETIME NOT NULL,
//     created_date DATETIME DEFAULT NOW(),
//     event_place TEXT NOT NULL,
//     created_user_id INT REFERENCES user(user_id),
//     is_delete BOOL default  FALSE
// );

// create a connection to the database
// the database is hosted on localhost
// port: 33061
// user: root
// password: system-3@1357
// database: schedule
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'system-3@1357',
    database: 'schedule',
    port: 33061
});

// connect to the database
connection.connect((err) => {
    if (err) {
        console.log('Error connecting to database', err);
        return;
    }
    console.log('Connection established');
});

// create CRUD API for 4 table in the database
// 1. role
// 2. user
// 3. events
// 4. event_user
api.use(cors());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// create API for retrieve data from events table with specific range of time
api.get('/events/time/:start/:end', (req, res) => {
    connection.query('SELECT * FROM events WHERE event_time BETWEEN ? AND ?', [req.params.start, req.params.end], (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});

// create API for retrive data from events table with specific event_id
api.get('/events/:id', (req, res) => {
    connection.query('SELECT * FROM events WHERE event_id = ?', [req.params.id], (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});

// create API for adding a new events to the events table with all the fields
// the request body is a object that has following property:
//  event_name, event_time, event_place, created_user_id
api.post('/events', (req, res) => {

    // check if the request body has fields that are not allow to insert
    // then return the error message
    if (req.body.event_id || req.body.created_date || req.body.is_delete) {
        res.json({ message: 'The request body contains fields that are not allow to insert' });
        return;
    }

    connection.query('INSERT INTO events SET ?', req.body, (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});


// create API for updating an existing events in the events table with specific event_id
// only allow update the following fields: event_name, event_time, event_place
// the request body is a object that has following property:
//  event_name, event_time, event_place
// only allow update event that is not deleted

api.put('/events/:id', (req, res) => {

    //check if the event is deleted
    connection.query('SELECT * FROM events WHERE event_id = ?', [req.params.id], (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        if (rows[0].is_delete) {
            res.json({ message: 'Event is deleted' });
            return;
        }
    });

    // check if the request body has the fields that are not allowed to update
    // then return the error message
    if (req.body.event_id || req.body.created_date || req.body.created_user_id || req.body.is_delete) {
        res.json({ message: 'The request body contains fields that are not allow to update' });
        return;
    }

    connection.query('UPDATE events SET ? WHERE event_id = ?', [req.body, req.params.id], (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});

// create API for deleting an existing events in the events table with specific event_id
// the delete process is a soft delete, the is_delete field will be set to TRUE
api.delete('/events/:id', (req, res) => {
    connection.query('UPDATE events SET is_delete = TRUE WHERE event_id = ?', [req.params.id], (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});

// create API for retrieve data from role table
api.get('/role', (req, res) => {
    connection.query('SELECT * FROM role', (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});

// create API for retrieve data from user table
api.get('/user', (req, res) => {
    connection.query('SELECT * FROM user', (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});

// create API for insert a new user to the user table
api.post('/user', (req, res) => {
    // check if the request body has fields that are not allow to insert
    // then return the error message
    if (req.body.user_id || req.body.is_delete) {
        res.json({ message: 'The request body contains fields that are not allow to insert' });
        return;
    }

    connection.query('INSERT INTO user SET ?', req.body, (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});

// create API for update an existing user in the user table with specific user_id
api.put('/user/:id', (req, res) => {

    // check if the request body has the fields that are not allowed to update
    // then return the error message
    if (req.body.user_id || req.body.is_delete) {
        res.json({ message: 'The request body contains fields that are not allow to update' });
        return;
    }

    connection.query('UPDATE user SET ? WHERE user_id = ?', [req.body, req.params.id], (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});

// create API for delete an existing user in the user table with specific user_id
// the delete process is a soft delete, the is_delete field will be set to TRUE
api.delete('/user/:id', (req, res) => {
    connection.query('UPDATE user SET is_delete = TRUE WHERE user_id = ?', [req.params.id], (err, rows) => {
        if (err) {
            console.log('Error in query');
            return;
        }
        res.json(rows);
    });
});