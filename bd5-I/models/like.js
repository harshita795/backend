let { DataTypes, sequelize } = require("../lib/index");
let { user } = require("./user.js");
let { track } = require("./track.js");

let like = sequelize.define("like", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: user,
      key: "id",
    },
  },
  trackId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: track,
      key: "id",
    },
  },
});

user.belongsToMany(track, { through: like });
track.belongsToMany(user, { through: like });

module.exports = {
  like,
};
