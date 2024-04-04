const mysql = require('mysql');
require('dotenv').config()
let db = mysql.createConnection({
    host:  process.env.host,
    user:  process.env.user,
    password:  process.env.password,
    database: process.env.database,
    dateStrings: true
});

db.connect(function (err) {
    if (err) throw err;
    console.log("DataBase Connected!");
});

module.exports=db;