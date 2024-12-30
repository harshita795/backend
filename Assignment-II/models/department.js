const { DataTypes, sequelize } = require("../lib/index.js");

const department = sequelize.define("department", {
  name: DataTypes.STRING,
});

module.exports = { department };
