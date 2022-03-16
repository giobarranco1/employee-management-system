INSERT INTO department (id, name)
VALUES (1, "Human Resources"),
    (2, "Logistics"),
    (3, "Customer Service"),
    (4, "Marketing"),
    (5, "Sales and Acquisition"),
    (6, "Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 160000, 1),
    ("Supervisor", 80000, 2),
    ("Intern", 80000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jose", "Ortega", 1, 1),
    ("Lebron", "James", 2, 1),
    ("Darnell", "Green", 3, 1),
    ("Richard", "Nixon", 2, 1);
