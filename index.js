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
let listOfEmployeeNames;

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
        message: `New Department's Name: `,
        name: 'name',
    }
]
const roleQuestions = [
    {
        type: 'input',
        message: `New Role's Title: `,
        name: 'title',
    },
    {
        type: 'input',
        message: `New Role's Salary: `,
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
        message: `New Role's Department Id: `,
        name: 'departmentId',
        choices: () => {
            return listOfDepartmentIds;
        }
    },
]
const employeeQuestions = [
    {
        type: 'input',
        message: `New Employee's First Name: `,
        name: 'firstName',
    },
    {
        type: 'input',
        message: `New Employee's Last Name: `,
        name: 'lastName',
    },
    {
        type: 'list',
        message: `New Employee's Role Id: `,
        name: 'roleId',
        choices: () => {
            return listOfRoleIds;
        }
    },
    {
        type: 'list',
        message: `New Employee's Manager Id: `,
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
            return listOfEmployeeNames;
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
    const decision = await inquirer.prompt(updateQuestions)
    return decision;
}

// - - - - - - - - - - - - - - -
// Database functions
// - - - - - - - - - - - - - - -

//          Getters
const getDepartmentIds = async () => {
    try{
        let results = await new Promise((reject, resolve) => db.query('SELECT id FROM company_db.department', (err, results) => {
            if(err){
                reject(err);
            }else{
                listOfDepartmentIds = ['null']
                results.forEach((cell) => listOfDepartmentIds.push(cell.id.toString()))
                listOfDepartmentIds.sort()
                resolve('')
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
                resolve('')
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
                resolve('')
            }
        }))
    }catch(error){
        console.log(error);
    };
}
const getEmployeeNames = async () => {
    try{
        let results = await new Promise((reject, resolve) => db.query('SELECT first_name,last_name FROM company_db.employee', (err, results) => {
            if(err){
                reject(err);
            }else{
                listOfEmployeeNames = [];
                results.forEach((cell) => {
                    let newString = `${cell.first_name} ${cell.last_name}`;
                    listOfEmployeeNames.push(newString)
                })
            }
            resolve('')
        }))
    }catch(error){
        console.log(error);
    };
}
const getDepartmentTable = async () => {
    try{
        let results = await new Promise((reject, resolve) => db.query('SELECT * FROM company_db.department', (err, results) => {
            if(err){
                reject(err);
            }else{
                console.table(results);
                resolve('')
            }
        }))
    }catch(error){
        console.log(error);
    };
}
const getRoleTable = async () => {
    console.log('hello');
    try{
        console.log('hello2');
        let results = await new Promise((reject, resolve) => db.query('SELECT * FROM company_db.role', (err, results) => {
            if(err){
                reject(err);
            }else{
                console.log('hello3');
                console.table(results);
                resolve('')
            }
        }))
    }catch(error){
        console.log(error);
    };
}
const getEmployeeTable = async () => {
    try{
        let results = await new Promise((reject, resolve) => db.query('SELECT * FROM company_db.employee', (err, results) => {
            if(err){
                reject(err);
            }else{
                console.table(results);
                resolve('')
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
function employeeUpdateInDB(employeeName, roleId) {
    let names = employeeName.split(' ')

    db.query(
        'UPDATE company_db.employee SET role_id = ? WHERE first_name = ? AND last_name = ?',
        [roleId, names[0], names[1]],
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

        if (opt.menuOption == 'View all Departments') {
            await getDepartmentTable();
        }
        if (opt.menuOption == 'View all Roles') {
            await getRoleTable();  
        }
        if (opt.menuOption == 'View all Employees') {
            await getEmployeeTable();
        }
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
                await getEmployeeNames().then(async () => {
                    info = await updateEmployee();
                    employeeUpdateInDB(info.name, info.role);
                })
            })
        }

    } while (opt.menuOption != 'Exit');
}

main();


app.use((req, res) => {
    res.status(404).end();
});
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});