const inquirer = require("inquirer");
const mySQL = require("mysql2");
const table = require("console.table");

const db = mySQL.createConnecction({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employeeDB"
});

function start() {
    inquirer.prompt([{
        type: "list",
        name: "options",
        message: "Please choose from the following options",
        choices: [
            "View all employees",
            "View all departments",
            "View all roles",
            "Add department",
            "Add role",
            "Add employee",
            "Update employee role",
            "End process"
        ],
    }]).then((response) => {
        switch(response.options) {
            case "View all Employees":
                viewEmployees();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "Add department":
                addDept();
                break;
            case "Add role":
                addRole();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            case "End process":
                return;
        }
    })
};

function viewEmployees() {
    db.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id",
        function(err, results) {
            console.table(results);
            start();
        }
    )
};



function viewDepartments();
function viewRoles();
function addDept();
function addRole();
function addEmployee();
function updateEmployeeRole();