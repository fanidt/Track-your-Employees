const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');
const cTable = require('console.table');
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
// app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
// app.use((req, res) => {
//     res.status(404).end();
// });

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function start() {
    askstartQ()
}

// staring question
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

// function to ask starting question
function askstartQ() {
    inquirer.prompt(startingQ)
        .then(answer => {

            switch (answer.startQ) {
                case 'view all departments': ; break;
                case 'view all roles': ; break;
                case 'view all employees': ; break;
                case 'add a department': addDepartment(); break;
                case 'add a role': addRole(); break;
                case 'add an employee': addEmpl(); break;
                case 'and update an employee role': ; break;
                default:
                    break;
            }
        })
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Questions to add employee
const addEmpQue = [
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the employees\'s first name?',

    },
    {
        type: 'input',
        name: 'lastname',
        message: 'What is the employees\'s last name?',

    }
   

]
//function to add employee
function addEmpl() {

    inquirer.prompt(addEmpQue)
        .then(answer => {
            const params=[];

            const fn= answer.first_name
            params.push(fn)
            const ln = answer.lastname
            params.push(ln)

            const sqlRole = `SELECT roles.role_id, roles.title FROM roles`
            const sqlManager = `SELECT * FROM employee`
            db.promise().query(sqlRole, sqlManager, (err, data) => {
                if (err) {
                    console.log(params)
                    return;
                }
                
                const roles = data.map(({ role_id, title }) => ({ name: title, value: role_id }));
                const managers = data.map(({ emp_id, first_name, lastname }) => ({ name: first_name + " "+ lastname, value: emp_id  }));
console.log(managers+roles)
                inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles 
                    }
                  ])
                  .then(data => 
                    {
                        const sql =   `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                        
                        const r = data.role
                        const m =   data.manager
                        params.push(r,m)
                          
                        db.query(sql,params, (err, data) => {
                            if (err) {
                              console.log("error")
                              return;
                            }
                            res.json({
                              message: 'success',
                              data: body
                            });
                          });
                    })



                

           })
        }
        )
        
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// questions to add department
const addDepQue = [
    {
        type: 'input',
        name: 'depname',
        message: 'What is the new department\'s name?',

    }

]
//function to add department
function addDepartment() {

    inquirer.prompt(addDepQue)
}





//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const addRoleQue = [
    {
        type: 'input',
        name: 'rolename',
        message: 'What is the new role\'s name?',

    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the new role\'s salary?',

    },
    {
        type: 'input',
        name: 'department',
        message: 'What is the new role\'s department?',

    }
]

//function to add role
function addRole() {

    inquirer.prompt(addRoleQue)
}

start()