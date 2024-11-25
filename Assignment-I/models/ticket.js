let { DataTypes, sequelize } = require("../lib/index");

let ticket = sequelize.define("ticket", {
  ticketId: DataTypes.INTEGER,
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  status: DataTypes.STRING,
  priority: DataTypes.INTEGER,
  customerId: DataTypes.INTEGER,
  agentId: DataTypes.INTEGER,
});

module.exports = { ticket };
