const mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'TodoApp_db'
});

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;