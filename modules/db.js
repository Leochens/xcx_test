const DB = require('../config').DB;
const mysql = require('mysql');
const conn = mysql.createConnection(DB);



module.exports = conn;