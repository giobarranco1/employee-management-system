const inquirer = require("inquirer");
const mySQL = require("mysql2");
const table = require("console.table");

const db = mySQL.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employeeDB"
});

function viewEmployees();
function viewDepartments();
function viewRoles();
function addDept();
function addRole();
function addEmployee();
function updateEmployeeRole();
function start();