const inquirer = require('inquirer');

// Questions

const menuOptions = [
    {
        type: 'list',
        message: 'Choose an Option: ',
        name: 'menuOption',
        choices: ['View All Departments', 'View All Roles', 'View all employees', 'Add a department', 'Add a role', 'Add an Employee', 'Update an Employee Role','Exit']
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
        type: 'input',
        message: `Role's Department Id: `,
        name: 'departmentId',
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
        type: 'input',
        message: `Employee's Role Id: `,
        name: 'roleId',
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
        type: 'input',
        message: `Employee's Manager Id: `,
        name: 'managerId',
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
]
const updateQuestions = [
    {
        type: 'input',
        message: `Employee: `,
        name: 'name',
    },
    {
        type: 'input',
        message: `New Role: `,
        name: 'role',
    }
]

// Menus

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



const main = async() => {
    let opt = '';
    let info = '';
    do {
        opt = await menu();

        switch (opt.menuOption) {
            case 'View All Departments':
                
                break;
            case 'View All Roles':
            
                break;
            case 'View all employees':
                
                break;
            case 'Add a department':
                info = await newDepartment();
                break;
            case 'Add a role':
                info = await newRole();
                break;
            case 'Add an Employee':
                info = await newEmployee();
                break;
            case 'Update an Employee Role':
                info = await updateEmployee();
                break;
        }


    } while (opt.menuOption != 'Exit');

}


main();