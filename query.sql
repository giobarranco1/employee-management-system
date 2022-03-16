SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department,
 role.salary FROM employee
 JOIN role
 ON  role.id = employee.role_id
 JOIN department
 ON department.id = role.department_id