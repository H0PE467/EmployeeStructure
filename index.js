const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// - - - - - - - - - - - - - - -
// Express middleware
// - - - - - - - - - - - - - - -
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// - - - - - - - - - - - - - - -
// Connect to the Database
// - - - - - - - - - - - - - - -
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

let listOfDepartmentIds;
let listOfRoleIds;
let listOfEmployeeIds;


// - - - - - - - - - - - - - - -
// Questions
// - - - - - - - - - - - - - - -
const menuOptions = [
    {
        type: 'list',
        message: 'Choose an Option: ',
        name: 'menuOption',
        choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role','Exit']
    }
]
const departmentQuestions = [
    {
        type: 'input',
        message: `Department's Name: `,
        name: 'name',
    }
]
const roleQuestions = [
    {
        type: 'input',
        message: `Role's Title: `,
        name: 'title',
    },
    {
        type: 'input',
        message: `Role's Salary: `,
        name: 'salary',
        validate: (input) => {
            if (!isNaN(input)) {
                if (input >= 0) {
                    return true;
                }
                let err = new Error('Please enter a positive number')
                return (err)
            }
            let err = new Error('Please enter a number')
            return (err)
        }
    },
    {
        type: 'list',
        message: `Role's Department Id: `,
        name: 'departmentId',
        choices: () => {
            return listOfDepartmentIds;
        }
    },
]
const employeeQuestions = [
    {
        type: 'input',
        message: `Employee's First Name: `,
        name: 'firstName',
    },
    {
        type: 'input',
        message: `Employee's Last Name: `,
        name: 'lastName',
    },
    {
        type: 'list',
        message: `Employee's Role Id: `,
        name: 'roleId',
        choices: () => {
            return listOfRoleIds;
        }
    },
    {
        type: 'list',
        message: `Employee's Manager Id: `,
        name: 'managerId',
        choices: () => {
            return listOfEmployeeIds;
        }
    },
]
const updateQuestions = [
    {
        type: 'list',
        message: `Employee: `,
        name: 'name',
        choices: () => {
            return listOfEmployeeIds;
        } 
    },
    {
        type: 'list',
        message: `New Role: `,
        name: 'role',
        choices: () => {
            return listOfRoleIds;
        }
    }
]

// - - - - - - - - - - - - - - -
// Inquirer Callers
// - - - - - - - - - - - - - - -
const menu = async() => {
    const decision = await inquirer.prompt(menuOptions)
    return decision;
}
const newDepartment = async() => {
    const decision = await inquirer.prompt(departmentQuestions)
    return decision;
}
const newRole = async() => {
    const decision = await inquirer.prompt(roleQuestions)
    return decision;
}
const newEmployee = async() => {
    const decision = await inquirer.prompt(employeeQuestions)
    return decision;
}
const updateEmployee = async() => {
    const decision = await inquirer.prompt([updateQuestions])
    return decision;
}

// - - - - - - - - - - - - - - -
// Database functions
// - - - - - - - - - - - - - - -

//          Getters
// function getDepartmentIds(newRole) {
//     db.query(
//         'SELECT id FROM company_db.department;',
//         function (err, results) {
//             listOfDepartmentIds = ['null']
//             results.forEach((cell) => listOfDepartmentIds.push(cell.id))
//         }
//     );
// }
const getDepartmentIds = async () => {
    try{
        let results = await new Promise((reject, resolve) => db.query('SELECT id FROM company_db.department', (err, results) => {
            if(err){
                reject(err);
            }else{
                listOfDepartmentIds = ['null']
                results.forEach((cell) => listOfDepartmentIds.push(cell.id.toString()))
                listOfDepartmentIds.sort()
                resolve(results)
            }
        }))
    }catch(error){
        console.log(error);
    };
}
const getRoleIds = async () => {
    try{
        let results = await new Promise((reject, resolve) => db.query('SELECT id FROM company_db.role', (err, results) => {
            if(err){
                reject(err);
            }else{
                listOfRoleIds = ['null']
                results.forEach((cell) => listOfRoleIds.push(cell.id.toString()))
                listOfRoleIds.sort()
                resolve(results)
            }
        }))
    }catch(error){
        console.log(error);
    };
}
const getEmployeeIds = async () => {
    try{
        let results = await new Promise((reject, resolve) => db.query('SELECT id FROM company_db.employee', (err, results) => {
            if(err){
                reject(err);
            }else{
                listOfEmployeeIds = ['null']
                results.forEach((cell) => listOfEmployeeIds.push(cell.id.toString()))
                listOfEmployeeIds.sort()
                resolve(results)
            }
        }))
    }catch(error){
        console.log(error);
    };
}

//          Setters
function departmentIntoDB(name) {
    db.query(
        'INSERT INTO company_db.department (name) VALUES (?)',
        [name],
        function (err, results) {
        }
    );
}
function roleIntoDB(title, salary, departmentId) {

    let id;
    if (departmentId.length == 4) {
        id = null;
    }else{
        id = Number(departmentId);
    }

    db.query(
        'INSERT INTO company_db.role (title, salary, department_id) VALUES (?,?,?)', 
        [title, Number(salary) ,id],
        function (err, results) {
        }
    );
}
function employeeIntoDB(first_name, last_name, roleId, managerId) {
    
    let idRole;
    if (roleId.length == 4) {
        idRole = null;
    }else{
        idRole = Number(roleId);
    }

    let idManager;
    if (managerId.length == 4) {
        idManager = null;
    }else{
        idManager = Number(managerId);
    }

    db.query(
        'INSERT INTO company_db.employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
        [first_name, last_name, idRole , idManager],
        function (err, results) {
        }
    );
}
function employeeUpdateInDB(name, role) {
    db.query(
        'INSERT INTO () VALUES (?,?)',
        [name, role],
        function (err, results) {
        }
    );
}

// - - - - - - - - - - - - - - -
// Main
// - - - - - - - - - - - - - - -

const main = async() => {
    
    let opt = '';
    let info = '';

    do {
        opt = await menu();

        if (opt.menuOption == 'Add a Department') {
            info = await newDepartment();
            departmentIntoDB(info.name)
        }
        if (opt.menuOption == 'Add a Role') {
            await getDepartmentIds().then(async () => {
                info = await newRole();
                roleIntoDB(info.title, info.salary, info.departmentId);
            })
        }
        if (opt.menuOption == 'Add an Employee') {
            await getRoleIds().then(async () => {
                await getEmployeeIds().then(async () => {
                    info = await newEmployee();
                    employeeIntoDB(info.firstName, info.lastName, info.roleId ,info.managerId);
                })
            })
        }
        if (opt.menuOption == 'Update an Employee Role') {
            await getRoleIds().then(async () => {
                await getEmployeeIds().then(async () => {
                    info = await updateEmployee();
                    employeeUpdateInDB(info.name, info.role);
                })
            })
        }
        // switch (opt.menuOption) {
        //     case 'View All Departments':
                
        //         break;
        //     case 'View All Roles':
            
        //         break;
        //     case 'View all employees':
                
        //         break;
        //     case 'Add a department':
        //         info = await newDepartment();
        //         departmentIntoDB(info.name)
        //         break;
        //     case 'Add a role':
        //         getDepartmentIds().then(async () => {
        //             info = await newRole();
        //             roleIntoDB(info.title, info.salary, info.departmentId);
        //         }).then(break)
                
        //     case 'Add an Employee':
        //         info = await newEmployee();
        //         employeeIntoDB(info.first_name, info.last_name, info.roleId ,info.managerId);
        //         break;
        //     case 'Update an Employee Role':
        //         info = await updateEmployee();
        //         employeeUpdateInDB(info.name, info.role);
        //         break;
        // }

    } while (opt.menuOption != 'Exit');
}

main();

// getDepartmentIds().then(() => {
//     console.log('Completed');
//     console.log(listOfDepartmentIds);
// })


/*

    Todo:
        -Checar que inserte correctamente
        -Si se puede, updatear las opciones
        -Replace
        -Tablas

*/


app.use((req, res) => {
    res.status(404).end();
});
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});