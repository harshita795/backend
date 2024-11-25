let { DataTypes, sequelize } = require("../lib/index");

const agent = sequelize.define("agent", {
  agentId: DataTypes.INTEGER,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

module.exports = {
  agent,
};
