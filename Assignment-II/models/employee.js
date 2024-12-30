const { DataTypes, sequelize } = require("../lib/index.js");

const employee = sequelize.define("employee", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

module.exports = { employee };
