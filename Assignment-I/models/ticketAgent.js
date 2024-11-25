let { DataTypes, sequelize } = require("../lib/index");
const { agent } = require("./agent.js");
const { ticket } = require("./ticket.js");

const ticketAgent = sequelize.define("ticketAgent", {
  ticketId: {
    type: DataTypes.INTEGER,
  },
  agentId: {
    type: DataTypes.INTEGER,
  },
});

ticket.belongsToMany(agent, { through: ticketAgent });
agent.belongsToMany(ticket, { through: ticketAgent });

module.exports = {
  ticketAgent,
};
