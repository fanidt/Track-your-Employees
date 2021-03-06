DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;

DROP TABLE IF EXISTS departements;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS managers;

CREATE TABLE managers  (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    manager_name VARCHAR(30) NOT NULL
);


CREATE TABLE departements  (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER,
    CONSTRAINT fk_department FOREIGN KEY (department_id)
    REFERENCES departements(id)
    ON DELETE SET NULL
);

CREATE TABLE employee(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager_id INTEGER,
    role_id INTEGER,

    CONSTRAINT fk_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL,

    CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
    REFERENCES managers(id)
    ON DELETE SET NULL
);



SELECT employee.role_id, employee.manager_id FROM employee RIGHT OUTER JOIN roles ON employee.role_id = roles.id;

SELECT roles.department_id FROM roles RIGHT OUTER JOIN departements ON  roles.department_id = departements.id;