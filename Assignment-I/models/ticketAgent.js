let { DataTypes, sequelize } = require("../lib/index");
const { agent } = require("./agent.js");
const { ticket } = require("./ticket.js");

const ticketAgent = sequelize.define("ticketAgent", {
  ticketId: {
    type: DataTypes.INTEGER,
    references: {
      model: ticket,
      key: "id",
    },
  },
  agentId: {
    type: DataTypes.INTEGER,
    references: {
      model: agent,
      key: "id",
    },
  },
});

ticket.belongsToMany(agent, { through: ticketAgent });
agent.belongsToMany(ticket, { through: ticketAgent });

module.exports = {
  ticketAgent,
};
