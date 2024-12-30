const { DataTypes, sequelize } = require("../lib/index.js");
const { employee } = require("./employee.js");
const { department } = require("./department.js");

const employeeDepartment = sequelize.define("employeeDepartment", {
  employeeId: {
    type: DataTypes.INTEGER,
  },
  departmentId: {
    type: DataTypes.INTEGER,
  },
});

employee.belongsToMany(department, { through: employeeDepartment });
department.belongsToMany(employee, { through: employeeDepartment });

module.exports = { employeeDepartment };
