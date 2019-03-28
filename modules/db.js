const DB = require('../config/config').DB;
const mysql = require('mysql');
const conn = mysql.createConnection(DB);



module.exports = conn;