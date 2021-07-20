INSERT INTO departements(department_name)
VALUES
("Leadership"),
("Marketing"), 
("Sales");

INSERT INTO managers (manager_name)
VALUES
("Fani DT"),
("George DT");

INSERT INTO roles (title, salary, department_id)
VALUES
("CEO", 100000, 1), 
("COO",80000, 1);


INSERT INTO employee (first_name, last_name, manager_id, role_id )
VALUES 
('Fani', 'DT', 1, null), 
('George', 'DT', 2, 1);