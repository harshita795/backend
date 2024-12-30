const { DataTypes, sequelize } = require("../lib/index.js");

const department = sequelize.define("department", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define Role model
const role = sequelize.define("role", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define Employee model
const employee = sequelize.define("employee", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define EmployeeDepartment (junction model)
const employeeDepartment = sequelize.define("employeeDepartment", {});

// Define EmployeeRole (junction model)
const employeeRole = sequelize.define("employeeRole", {});

// Set up associations
employee.belongsToMany(department, { through: employeeDepartment });
department.belongsToMany(employee, { through: employeeDepartment });

employee.belongsToMany(role, { through: employeeRole });
role.belongsToMany(employee, { through: employeeRole });

module.exports = {
  department,
  role,
  employee,
  employeeDepartment,
  employeeRole,
};
