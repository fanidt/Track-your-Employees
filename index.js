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
                case 'and update an employee role': ; break;
                default:
                    break;
            }
        })
}

//------------------ GETTING DATA WITH MYSQL :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

function getRoles() {
    return db.promise().query(`SELECT * FROM roles`)
}

function getRoleTitles(){
    return db.promise().query("SELECT title FROM roles")
}

function getEmployees() {
    return db.promise().query(`SELECT * FROM employee`)
}






// function jointtables(){
//     db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title from employee LEFT JOIN roles ON employee.role_id = roles.id; `)
//     .then(([row])=> 
//     console.table(row))
// }



//------------------ VIEW EMPLOYEE :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TABLE NOT WORKING DONT ASK ME WHY I HAVE NO IDEA 


 function viewEmployees() {
    db.promise().query(`SELECT * FROM employee;`)
    .then(([row]) => {
      
       let employees= row;
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
    db.promise().query(`SELECT * FROM roles`)
.then(([row])=> {
    let roles= row;
    console.log('\n');
    console.table(roles)
    start()
})

}


//------------------ ADD EMPLOYEE :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------// Shows undefined in role and department and cant add it to the table
function getDepartments() {
    return db.promise().query(`SELECT department_name FROM departements;`)
     .then(([row]) => {
        let departements = row;
        console.log('\n');
        return row
     })
}


function getManager(){
    return db.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employee')
}

function addEmployee(employees) {
    return db.query(`INSERT INTO employee (first_name, last_name ) VALUES("${employees.first_name}","${employees.lastname}");`)
}

async function addEmpl() {

    let departments = await getDepartments()
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
            choices: roles
        },
        {
            type: 'list',
            name: 'department',
            message: 'What is the employee\'s department',
            choices: departments
        },
        {
            type: 'list',
            name: 'manager',
            message: 'What is the employee\'s manager',
            choices: managers
        }
    ])
    addEmployee(employees)
    start()
}

//------------------ ADD ROLE :) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------//shows undefined in department and cant add it to the table 
function addRole(roles) {
    return db.query(`INSERT INTO roles (title, salary) VALUES("${roles.title}", "${roles.salary}");`)
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
            choices: departments.map(choices => choices.department_name)
        }
    ])
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

// ALL TABLES ARE GETTING ADDED TO MY SQL ITS THE OTHER F THINGS THAT DONT WORK