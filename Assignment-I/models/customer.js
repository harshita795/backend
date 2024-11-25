let { DataTypes, sequelize } = require("../lib/index");

const customer = sequelize.define("customer", {
  customerId: DataTypes.INTEGER,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

module.exports = { customer };
