const { DataTypes, sequelize } = require("../lib/index.js");
const { employee } = require("./employee.js");
const { role } = require("./role.js");

const employeeRole = sequelize.define("employeeRole", {
  employeeId: {
    type: DataTypes.INTEGER,
  },
  roleId: {
    type: DataTypes.INTEGER,
  },
});

employee.belongsToMany(role, { through: employeeRole });
role.belongsToMany(employee, { through: employeeRole });

module.exports = { employeeRole };
