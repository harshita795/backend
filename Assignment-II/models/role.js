const { DataTypes, sequelize } = require("../lib/index.js");

const role = sequelize.define("role", {
  title: DataTypes.STRING,
});

module.exports = { role };
