const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console-table");
//const util = require("util");
//util should be built into node
let roles;
let departments;
let managers;
let employees;

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "empDB",
});

connection.connect((err) => {
  if (err) throw err;
  uiStart();
  //add more functions as needed
  fetchRoles();
  fetchDepartments();
  fetchManagers();
  fetchEmployees();
});

uiStart = () => {
  //inquirer uses promises automatically
  inquirer
    .prompt({
      name: "choices",
      type: "list",
      message: "Choose from list.",
      choices: ["ADD", "VIEW", "UPDATE", "DELETE", "EXIT"],
    })
    .then((answers) => {
      if (answers.choices === "ADD") {
        addFunc();
      } else if (answers.choices === "VIEW") {
        viewFunc();
      } else if (answers.choices === "UPDATE") {
        updateFunc();
      } else if (answers.choices === "DELETE") {
        deleteFunc();
      } else if (answers.choices === "EXIT") {
        console.info("Thanks for using our software!");
        connection.end();
      } else {
        connection.end();
      }
    });
};

//FETCH - needed for following functions --COMPLETED
fetchRoles = () => {
  connection.query("SELECT id, title FROM emp_role", (err, res) => {
    if (err) throw err;
    roles = res;
  });
};

fetchDepartments = () => {
  connection.query("SELECT id, dept_name FROM department", (err, res) => {
    if (err) throw err;
    departments = res;
  });
};

fetchManagers = () => {
  connection.query(
    "SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee",
    (err, res) => {
      if (err) throw err;
      managers = res;
    }
  );
};

fetchEmployees = () => {
  connection.query(
    "SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS employee_name FROM employee",
    (err, res) => {
      if (err) throw err;
      employees = res;
    }
  );
};

//CREATE -- COMPLETED
//export file?
addFunc = () => {
  inquirer
    .prompt([
      {
        name: "add",
        type: "list",
        message: "What will you ADD?",
        choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"],
      },
    ])
    .then((answers) => {
      if (answers.add === "DEPARTMENT") {
        console.info("Add a new: " + answers.add);
        addDept();
      } else if (answers.add === "ROLE") {
        console.info("Add a new: " + answers.add);
        addRole();
      } else if (answers.add === "EMPLOYEE") {
        console.info("Add a new: " + answers.add);
        addEmployee();
      } else if (answers.add === "EXIT") {
        console.info("Thanks for using our software!");
        connection.end();
      } else {
        connection.end();
      }
    });
};
// functions from above, update sql using querries

addDept = () => {
  inquirer
    .prompt([
      {
        name: "input_dept",
        type: "input",
        message: "Type name of DEPARTMENT to ADD.",
      },
    ])
    .then((answers) => {
      //backticks needed to properly insert query
      connection.query(
        `INSERT INTO  department(dept_name) VALUES ('${answers.input_dept}')`,
        (err, res) => {
          if (err) throw err;
          console.info("You ADDED one new DEPARTMENT: " + answers.input_dept);
          fetchDepartments();
          uiStart();
        }
      );
    });
};

addRole = () => {
  let deptHolder = [];
  for (i = 0; i < departments.length; i++) {
    deptHolder.push(Object(departments[i]));
  }
  inquirer
    .prompt([
      {
        name: "input_role",
        type: "input",
        message: "Type name of ROLE to ADD.",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter SALARY of new role.",
      },
      {
        name: "input_dept_id",
        type: "list",
        message: "SELECT DEPARTMENT of new role.",
        choices: function () {
          var choicesArray = [];
          for (i = 0; i < deptHolder.length; i++) {
            choicesArray.push(deptHolder[i].dept_name);
          }
          return choicesArray;
        },
      },
    ])
    .then((answers) => {
      for (i = 0; i < deptHolder.length; i++) {
        if (deptHolder[i].dept_name === answers.input_dept_id) {
          input_dept_id = deptHolder[i].id;
        }
      }
      connection.query(
        `INSERT INTO emp_role(title, salary, department_id) VALUES ('${answers.input_role}', '${answers.salary}', '${input_dept_id}')`,
        (err, res) => {
          if (err) throw err;
          console.info("You ADDED one new ROLE: " + answers.input_role);
          table.res;
          fetchRoles();
          uiStart();
        }
      );
    });
};

addEmployee = () => {
  fetchRoles();
  fetchManagers();
  let roleHolder = [];
  for (i = 0; i < roles.length; i++) {
    roleHolder.push(Object(roles[i]));
  }
  let managerHolder = [];
  for (i = 0; i < managers.length; i++) {
    managerHolder.push(Object(managers[i]));
  }
  inquirer
    .prompt([
      {
        name: "input_first_name",
        type: "input",
        message: "Enter FIRST NAME of EMPLOYEE.",
      },
      {
        name: "input_last_name",
        type: "input",
        message: "Enter LAST NAME of EMPLOYEE",
      },
      {
        name: "input_role_id",
        type: "list",
        message: "SELECT ROLE of EMPLOYEE",
        choices: function () {
          var choicesArray = [];
          for (i = 0; i < roleHolder.length; i++) {
            choicesArray.push(roleHolder[i].title);
          }
          return choicesArray;
        },
      },
      {
        name: "input_manager_id",
        type: "list",
        message: "SELECT MANAGER of EMPLOYEE",
        choices: function () {
          var choicesArray = [];
          for (i = 0; i < managerHolder.length; i++) {
            choicesArray.push(managerHolder[i].managers);
          }
          return choicesArray;
        },
      },
    ])
    .then((answers) => {
      for (i = 0; i < roleHolder.length; i++) {
        if (roleHolder[i].title === answers.input_role_id) {
          input_role_id = roleHolder[i].id;
        }
      }

      for (i = 0; i < managerHolder.length; i++) {
        if (managerHolder[i].managers === answers.input_manager_id) {
          input_manager_id = managerHolder[i].id;
        }
      }

      connection.query(
        `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answers.input_first_name}', '${answers.input_last_name}', '${input_role_id}', '${input_manager_id}')`,
        (err, res) => {
          if (err) throw err;

          console.info(
            "You ADDED one new EMPLOYEE: " +
              answers.input_first_name +
              " " +
              answers.input_last_name
          );
          fetchEmployees();
          uiStart();
        }
      );
    });
};

//////////////////////////////////////////////////
//READ -- COMPLETED, EXCEPT FOR BUDGET
viewFunc = () => {
  inquirer
    .prompt([
      {
        name: "view",
        type: "list",
        message: "What will you VIEW?",
        choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "BUDGET", "EXIT"],
      },
    ])
    .then((answers) => {
      if (answers.view === "DEPARTMENT") {
        viewDept();
      } else if (answers.view === "ROLE") {
        viewRole();
      } else if (answers.view === "EMPLOYEE") {
        viewEmployee();
      } else if (answers.view === "BUDGET") {
        viewBudget();
      } else if (answers.view === "EXIT") {
        console.info("Thanks for using our software!");
        connection.end();
      } else {
        connection.end();
      }
    });
};

viewDept = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    console.log("\n");
  });
  uiStart();
};

viewRole = () => {
  connection.query(
    "SELECT r.id, r.title, r.salary, r.department_id as View_Dept_Name FROM emp_role AS r INNER JOIN department AS d ON r.department_id = d.id",
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table(res);
      console.log("\n");
    }
  );
  uiStart();
};

viewEmployee = () => {
  connection.query(
    'SELECT e.id, e.first_name, e.last_name, d.dept_name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN emp_role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC',
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table(res);
      console.log("\n");
    }
  );
  uiStart();
};

viewBudget = () => {
  console.log("\n");
  console.warn("Sorry, this doesn't work yet.");
  console.log("\n");
  uiStart();
};

//UPDATE
updateFunc = () => {
  inquirer
    .prompt([
      {
        name: "update",
        type: "list",
        message: "What will you UPDATE?",
        choices: ["Update Employee Roles", "Update Employee Managers", "EXIT"],
      },
    ])
    .then((answers) => {
      if (answers.update === "Update Employee Roles") {
        updateEmpRole();
      } else if (answers.update === "Update Employee Managers") {
        updateEmpManagers();
      } else if (answers.update === "EXIT") {
        console.info("Thanks for using our software!");
        connection.end();
      } else {
        connection.end();
      }
    });
};

updateEmpRole = () => {
  let empHolder = [];
  for (i = 0; i < employees.length; i++) {
    empHolder.push(Object(employees[i]));
  }
  inquirer
    .prompt([
      {
        name: "updateRole",
        type: "list",
        message: "SELECT EMPLOYEE to UPDATE.",
        choices: function () {
          var choicesArray = [];
          for (var i = 0; i < empHolder.length; i++) {
            choicesArray.push(empHolder[i].employee_name);
          }
          return choicesArray;
        },
      },
    ])
    .then((answers) => {
      let empRoleHolder = [];
      for (i = 0; i < roles.length; i++) {
        empRoleHolder.push(Object(roles[i]));
      }
      for (i = 0; i < empHolder.length; i++) {
        if (empHolder[i].employee_name === answers.updateRole) {
          selEmp = empHolder[i].id;
        }
      }
      inquirer
        .prompt([
          {
            name: "selectNewRole",
            type: "list",
            message: "SELECT a new ROLE.",
            choices: function () {
              var choicesArray = [];
              for (i = 0; i < empRoleHolder.length; i++) {
                choicesArray.push(empRoleHolder[i].title);
              }
              return choicesArray;
            },
          },
        ])
        .then((answers) => {
          for (i = 0; i < empRoleHolder.length; i++) {
            if (answers.selectNewRole === empRoleHolder[i].title) {
              selRole = empRoleHolder[i].id;
              connection.query(
                `UPDATE employee SET role_id = ${selRole} WHERE id = ${selEmp}`
              ),
                (err, res) => {
                  if (err) throw err;
                };
            }
          }
          console.log("\n");
          console.info("Employee Role has been updated!");
          console.log("\n");
          fetchEmployees();
          fetchRoles();
          uiStart();
        });
    });
};

updateEmpManagers = () => {
  let empHolder = [];
  for (i = 0; i < employees.length; i++) {
    empHolder.push(Object(employees[i]));
  }
  inquirer
    .prompt([
      {
        name: "updateManager",
        type: "list",
        message: "SELECT EMPLOYEE to UPDATE.",
        choices: function () {
          var choicesArray = [];
          for (var i = 0; i < empHolder.length; i++) {
            choicesArray.push(empHolder[i].employee_name);
          }
          return choicesArray;
        },
      },
    ])
    .then((answers) => {
      fetchEmployees();
      fetchManagers();
      let empManagerHolder = [];
      for (i = 0; i < managers.length; i++) {
        empManagerHolder.push(Object(managers[i]));
      }
      for (i = 0; i < empHolder.length; i++) {
        if (empHolder[i].employee_name === answers.updateManager) {
          selEmp = empHolder[i].id;
        }
      }
      inquirer
        .prompt([
          {
            name: "selectNewManager",
            type: "list",
            message: "\n SELECT a new MANAGER \n",
            choices: function () {
              var choicesArray = [];
              for (i = 0; i < empManagerHolder.length; i++) {
                choicesArray.push(empManagerHolder[i].managers);
              }
              return choicesArray;
            },
          },
        ])
        .then((answers) => {
          for (i = 0; i < empManagerHolder.length; i++) {
            if (answers.selectNewManager === empManagerHolder[i].managers) {
              selManager = empManagerHolder[i].id;
              connection.query(
                `UPDATE employee SET manager_id = ${selManager} WHERE id = ${selEmp}`
              ),
                (err, res) => {
                  if (err) throw err;
                };
              console.log("\n");
              console.info("Employee Manager has been updated!");
              console.log("\n");
            }
          }
          fetchEmployees();
          fetchManagers();
          uiStart();
        });
    });
};

//DELETE

deleteFunc = () => {
  inquirer
    .prompt([
      {
        name: "delete",
        type: "list",
        message: "What will you DELETE?",
        choices: [
          "Delete Department",
          "Delete Role",
          "Delete Employee",
          "EXIT",
        ],
      },
    ])
    .then((answers) => {
      if (answers.delete === "Delete Department") {
        deleteDept();
      } else if (answers.delete === "Delete Role") {
        deleteRole();
      } else if (answers.delete === "Delete Employee") {
        deleteEmployee();
      } else if (answers.delete === "EXIT") {
        console.info("Thanks for using our software!");
        connection.end();
      } else {
        connection.end();
      }
    });
};

deleteDept = () => {
  let delDeptHolder = [];
  for (i = 0; i < departments.length; i++) {
    delDeptHolder.push(Object(departments[i]));
  }
  inquirer
    .prompt([
      {
        name: "selDeleteDept",
        type: "list",
        message: "Which DEPARTMENT would you like to DELETE?",
        choices: function () {
          var choicesArray = [];
          for (i = 0; i < delDeptHolder.length; i++) {
            choicesArray.push(delDeptHolder[i].dept_name);
          }
          return choicesArray;
        }
      }
    ])
    .then((answers) => {
      for (i = 0; i < delDeptHolder.length; i++) {
        if (answers.selDeleteDept === delDeptHolder[i].dept_name) {
          selDept = delDeptHolder[i].id;
          connection.query(`DELETE FROM department WHERE id = ${selDept}`),
            (err, res) => {
              if (err) throw err;
            };
          console.info("Department: " + answers.selDeleteDept + " was deleted!");
        }
      }
      fetchDepartments();
      uiStart();
    });
};

deleteRole = () => {
  let roleHolder = [];
  for (i = 0; i < roles.length; i++) {
    roleHolder.push(Object(roles[i]));
  }

  inquirer
    .prompt([
      {
        name: "selDeleteRole",
        type: "list",
        message: "Which ROLE would you like to DELETE?",
        choices: function () {
          var choicesArray = [];
          for (i = 0; i < roleHolder.length; i++) {
            choicesArray.push(roleHolder[i].title);
          }
          return choicesArray;
        }
      }
    ])
    .then((answers) => {
      for (i = 0; i < roleHolder.length; i++) {
        if (answers.selDeleteRole === roleHolder[i].title) {
          selRole = roleHolder[i].id;
          connection.query(`DELETE FROM emp_role WHERE id = ${selRole}`),
            (err, res) => {
              if (err) throw err;
            };
          console.info("Role: " + answers.selDeleteRole + " was deleted!");
        }
      }
      fetchRoles();
      uiStart();
    });
};

deleteEmployee = () => {
  let empHolder = [];
  for (i = 0; i < employees.length; i++) {
    empHolder.push(Object(roles[i]));
  }

  inquirer
    .prompt([
      {
        name: "selDeleteEmployee",
        type: "list",
        message: "Which EMPLOYEE will you DELETE?",
        choices: function () {
          var choicesArray = [];
          for (i = 0; i < empHolder.length; i++) {
            choicesArray.push(empHolder[i].employee_name);
          }
          return choicesArray;
        }
      }
    ])
    .then((answers) => {
      for (i = 0; i < empHolder.length; i++) {
        if (answers.selDeleteEmployee === empHolder[i].employee_name) {
          selEmp = empHolder[i].id;
          connection.query(`DELETE FROM employee WHERE id = ${selEmp}`),
            (err, res) => {
              if (err) throw err;
            };
          console.info("Employee: " + answers.selDeleteEmployee + " was deleted!");
        }
      }
      fetchEmployees();
      uiStart();
    });
};
