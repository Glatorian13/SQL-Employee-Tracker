const mysql = require("mysql");
const inquirer = require("inquirer");
//const util = require("util"); 
//util should be built into node

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'empDB',
})