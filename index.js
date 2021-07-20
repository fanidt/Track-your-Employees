const express = require('express');
const db = require('./db/connection');
//const apiRoutes = require('./routes/apiRoutes');
const cTable = require('console.table');
const inquirer = require("inquirer");


db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    start()
});

//------------------ DATABASE CONNECTED :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------


//------------------ STARTING FUNCTION :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

const startingQ = [
    {
        type: 'list',
        name: 'startQ',
        message: 'What would you like to do?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'and update an employee role']
    },
]

function start() {
    inquirer.prompt(startingQ)
        .then(answer => {

            switch (answer.startQ) {
                case 'view all departments': viewDepartments(); break;
                case 'view all roles': viewRoles(); break;
                case 'view all employees': viewEmployees(); break;
                case 'add a department': adddep(); break;
                case 'add a role': addRoletodb(); break;
                case 'add an employee': addEmpl(); break;
                case 'and update an employee role': updateEmployee(); break;
                default:
                    break;
            }
        })
}


//------------------ VIEW EMPLOYEE :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------// TABLE NOT WORKING DONT ASK ME WHY I HAVE NO IDEA 


function viewEmployees() {
    db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name,departements.department_name, roles.title , roles.salary, managers.manager_name    from employee LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN managers ON employee.manager_id = managers.id
    LEFT JOIN departements ON roles.department_id = departements.id ;`)
        .then(([row]) => {

            let employees = row;
            console.log('\n');
            console.table(employees)
            start()


        })

}

//------------------ VIEW DEPARTEMENT :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------


function viewDepartments() {
    db.promise().query(`SELECT * FROM departements;`)
        .then(([row]) => {

            let departements = row;
            console.log('\n');
            console.table(departements)
            start()

        })

}

//------------------ VIEW ROLES :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------


function viewRoles() {
    db.promise().query(`SELECT roles.id, roles.title, departements.department_name FROM roles LEFT JOIN departements ON roles.department_id = departements.id `)
        .then(([row]) => {
            let roles = row;
            console.log('\n');
            console.table(roles)
            start()
        })

}


//------------------ ADD EMPLOYEE :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------// Shows undefined in role and department and cant add it to the table

function getDepartmentsname() {
    return db.promise().query(`SELECT id, CONCAT (department_name) AS deparetment_name FROM departements;`)
        .then(([row]) => {

            let departements = row;


            return row
        })
}

function getRoleTitles() {
    return db.promise().query("SELECT id, CONCAT(title) AS title FROM roles")
        .then(([row]) => {

            let roles = row;


            return row
        })
}

function getManager() {
    return db.promise().query('SELECT id, CONCAT(manager_name) AS Manager FROM managers')
        .then(([row]) => {

            let manager = row;


            return row
        })
}


function addEmployee(employees) {
    return db.query(`INSERT INTO employee (first_name, last_name ,manager_id, role_id) VALUES("${employees.first_name}","${employees.lastname}","${employees.manager}", "${employees.role}");`)
}

function addManager(employees) {
    return db.query(`INSERT INTO managers  (manager_name) VALUES("${employees.first_name} ${employees.lastname}")`)
}

async function addEmpl() {

    let departments = await getDepartmentsname()
    let roles = await getRoleTitles()
    let managers = await getManager()
    let employees = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is first name of this employee?',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'What is the last name of the employee?',
            name: 'lastname'
        }
        ,
        {
            type: "list",
            name: 'role',
            message: 'What is the employee\'s role',
            choices: roles.map(choices => choices.title)
        },
        {
            type: 'list',
            name: 'department',
            message: 'What is the employee\'s department',
            choices: departments.map(choices => choices.deparetment_name)
        },
        {
            type: 'list',
            name: 'manager',
            message: 'What is the employee\'s manager',
            choices: managers.map(choices => choices.Manager)
        }
    ])
    let man = managers.find(choices => choices.manager === managers.manager_name)
    employees.manager = man.id

    let rol = roles.find(choices => choices.roles === roles.title)
    employees.role = rol.id

    addEmployee(employees)
    addManager(employees)
    start()
}

//------------------ ADD ROLE :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------//shows undefined in department and cant add it to the table 
function addRole(roles) {
    return db.query(`INSERT INTO roles (title, salary, department_id) VALUES("${roles.title}", "${roles.salary}", "${roles.department}");`)
}


async function addRoletodb() {
    let departments = await (getDepartmentsname())
    // console.log(departments.map(choices => choices.department_name)
    // )
    let roles = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the title of this role?',
            name: 'title'
        },
        {
            type: 'number',
            message: 'What is the salary for this role?',
            name: 'salary'
        }
        ,
        {
            type: 'list',
            name: 'department',
            message: 'Select the department for this role',
            choices: departments.map(choices => choices.deparetment_name)
        }
    ])
    let dep = departments.find(choices => choices.deparetment === departments.deparetment_name)
    roles.department = dep.id
    addRole(roles)
    console.log(`Adding ${roles.title} to the database`)
    start()
}

//------------------ ADD DEPARTEMENT :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

function addDEPARTEMENT(departments) {
    return db.query(`INSERT INTO departements (department_name) VALUES("${departments.department_name}");`)
}


async function adddep() {
    let departments = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the new departement?',
            name: 'department_name'
        }])

    addDEPARTEMENT(departments)
    console.log(`Adding ${departments.department_name} to the database`)
    start()
}

//------------------ UPDATE EMPLOYEE :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getEmployeenames() {
    return db.promise().query(`SELECT id, CONCAT (first_name,' ',last_name) AS name FROM employee;`)
        .then(([row]) => {

            let names = row;


            return row
        })
}


async function updateEmployee() {

    let employees = await getEmployeenames()
    let update = await inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to change?',
            name: 'empchange',
            choices: employees.map(choices => choices.name)
        }
    ])


    let choice = employees.find(choices => choices.name === update.empchange)

    let id = choice.id

    findobjectbyid(id)
    return id;
}

function findobjectbyid(id) {
    db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title , roles.salary, managers.manager_name    from employee LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN managers ON employee.manager_id = managers.id  WHERE employee.id = "${id}";`)

        .then(([row]) =>
            inquirer.prompt({
                type: 'list',
                message: 'What would you like to change?',
                name: 'change',
                choices: ['last_name', 'first_name']
                //add , 'title', 'salary', 'manager' to the change
            })
                .then(answer => {
                    if (answer.change == 'last_name') {
                        inquirer.prompt({
                            type: 'input',
                            message: 'What would you like the new last name to be?',
                            name: 'alter'
                        })
                            .then(data => {
                                db.promise().query(`UPDATE employee
                        SET last_name = "${data.alter}"
                        WHERE employee.id= "${id}";`)

                                    .then(start())
                            })


                    }

                    else if (answer.change == 'first_name') {
                        inquirer.prompt({
                            type: 'input',
                            message: 'What would you like the new first name to be?',
                            name: 'alter'
                        })
                            .then(data => {
                                db.promise().query(`UPDATE employee
                        SET first_name = "${data.alter}"
                        WHERE employee.id= "${id}";`)
                                    .then(start())


                            })


                    }



                }



                )






        )

}