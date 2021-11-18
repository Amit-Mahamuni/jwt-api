
// const connection = require('./model/mysqlmodel');
const jwt = require('jsonwebtoken');

// const todolist = [
//     {
//         "title": "dsfsdf",
//         "detail": "sdfdsf",
//         "status": 1,
//         "priority": 1,
//         "create_date": "2021-10-19T06:28:42.909Z",
//         "done_date": null,
//         "id": 1
//     }
// ]

// connection.connect();

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

const getList = (req, res) => {
    connection.query('SELECT `id`, `title`, `detail`, `status`, `priority`, `create_date`, `done_date` FROM `todoList` WHERE `u_id` = ? ORDER BY id DESC',
        [req.user.u_id], function (error, results, fields) {
            if (error) throw error;
            res.send({ status: true, data: results })
        });
}

const addList = (req, res) => {
    connection.query('INSERT INTO todoList SET ?',
        { ...req.body, create_date: new Date(req.body.create_date), u_id: req.user.u_id },
        function (error, results, fields) {
            if (error) throw error;
            res.send({ data: results })
        });
}

const updateList = (req, res) => {
    let temp = {
        ...req.body,
        create_date: new Date(req.body.create_date),
        done_date: req.body.done_date ? new Date(req.body.done_date) : null
    }
    connection.query("UPDATE `todoList` SET ? WHERE `id`= ?", [temp, req.params.item_id],
        function (error, results, fields) {
            if (error) throw error;
            res.send({ data: results })
        });
}

const removeList = (req, res) => {
    connection.query("DELETE FROM `todoList` WHERE `id` = " + req.params.item_id,
        function (error, results, fields) {
            if (error) throw error;
            res.send({ data: results })
        });
}

const userLogin = (req, res) => {
    if (req.body.action === "register") {
        connection.query("SELECT `u_id`, `email`, `name` FROM `user_info` WHERE `email` = ? LIMIT 1",
            [req.body.mail], function (error, results, fields) {
                if (error) throw error;
                if (results.length === 1) {
                    res.json({ status: false, data: "User Already Exit." })
                } else {
                    connection.query("INSERT INTO user_info SET ?",
                        [{ email: req.body.mail, password: req.body.passwd, name: req.body.name }],
                        function (error, results, fields) {
                            if (error) throw error;
                            let accessTn = jwt.sign({ email: req.body.mail, u_id: results.insertId, name: req.body.name }, process.env.ACCESS_TOKEN)
                            res.json({ data: { name: req.body.name, email: req.body.mail }, accessToken: accessTn })
                        });
                }

            });

    } else {
        connection.query("SELECT `u_id`, `email`, `name` FROM `user_info` WHERE `email` = ? and `password` = ? LIMIT 1",
            [req.body.mail, req.body.passwd], function (error, results, fields) {
                if (error) throw error;
                if (results.length === 1) {
                    let accessTn = jwt.sign({ ...results[0] }, process.env.ACCESS_TOKEN)
                    res.json({ data: { name: results[0].name, email: results[0].email }, accessToken: accessTn })
                } else {
                    res.json({ status: false, data: "No User Found" })
                }

            });
    }

}

const userAuth = (req, res, next) => {
    let token = req.headers.accesstoken
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) throw err;
        req.user = user
        next()
    });
}

module.exports = {
    getList,
    addList,
    updateList,
    removeList,
    userLogin,
    userAuth
}