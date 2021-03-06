const inquirer = require("inquirer");
const mySQL = require("mysql2");
const table = require("console.table");

const db = mySQL.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db"
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

function viewDepartments(){
    db.query(
        "SELECT * FROM department",
        function(err, results) {
            console.table(results);
            start();
        }
    );
};

function viewRoles(){
    db.query(
        "SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id;",
        function(err, results) {
            console.table(results);
            start();
        }
    )
};

function addDept() {
    inquirer.prompt([
        {
            type: "input",
            message: "What's the name of the new department?",
            name: "departmentName",
        },
    ])
    .then((response) => {
        db.connect(function (err) {
            if (err) throw err;
            const sql = "INSERT INTO department SET ?";
            const obj = {name: response.departmentName};
            db.query(sql, obj, function (err, results){
                if (err) throw err;
                console.log("A new department has been added.");
            });
        });
        start();
    });
};

function addRole() {
    db.query("SELECT * FROM department", function(err, results) {
        if (err) throw err;
        const departmentRoles = results.map((department) => ({
            name: `${department.name}`,
            value: department.id 
        }));

        inquirer.prompt([
            {
                type: "input",
                message: "What's the name of your role?",
                name: "title",
            },
            {
                type: "input",
                message: "What's the salary of your role?",
                name: "salary",
            },
            {
                type: "list",
                message: "Which department is your role in?",
                choices: departmentRoles,
                name: "department",
            },
        ]).then((results) => {
            const sql = `INSERT INTO role SET?`;
            const obj = {
                title: results.title,
                salary: results.salary,
                department_id: results.department,
            };
            db.query(sql, obj, function(err, result){
                if (err) {
                    console.log(err)
                }
                start();
            });
        });
    });
};

function addEmployee() {
    db.query("SELECT * FROM role", function (err, results){
        if (err) throw err;
        const employeeRoles = results.map((roles) => ({
            name: `${roles.title}`,
            value: roles.id,
        }));
        db.query("SELECT * FROM employee", function (err, results) {
            const managerName = results.map((manager) => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.manager_id,
            }));

            inquirer
            .prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "Whats the employees first name?",
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "Whats the employees last name?",
                },
                {
                    type: "list",
                    name: "role",
                    message: "Whats the employees role?",
                    choices: employeeRoles,
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Who is the employees manager?",
                    choices: managerName,
                },
            ])
            .then((response) => {
                const sql = `INSERT INTO employee SET ?`;
                const obj = {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.role,
                    manager_id: response.manager,
                };
                db.query(sql, obj, function (err, result) {
                    if (err) throw err;
                    console.log(
                        `${response.firstName} ${response.lastName} has been added to database`
                    );
                });
                mainMenu();
            });
        });
    });
};



function updateEmployeeRole() {
    db.query("SELECT * FROM employee", function(err, results){
        if (err) throw err;
        const employeeNames = results.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        db.query("SELECT * FROM role", function(err, results) {
            if (err) throw err;
            const employeeRoles = results.map((roles) => ({
                name: `${roles.title}`,
                value: roles.id,
            }));
            inquirer
            .prompt([
                {
                    type: "list",
                    message: "Who do you need to update?",
                    choices: employeeNames,
                    name: "employeeName",
                },
                {
                    type: "list",
                    message: "Which role do you want to assign to the employee?",
                    choices: employeeRoles,
                    name: "newRole",
                },
            ])
            .then((response) => {
                db.connect(function (err) {
                    if (err) throw err;
                    const sql = `UPDATE employee SET ? WHERE id = ${response.employeeName}`;
                    const obj = {
                        role_id: response.newRole,
                    };
                    db.query(sql, obj, function(err, result){
                        if (err) throw err;
                        mainMenu();
                    });
                });
            });
        });
});
}