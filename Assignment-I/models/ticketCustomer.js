let { DataTypes, sequelize } = require("../lib/index");
const { customer } = require("./customer.js");
const { ticket } = require("./ticket.js");

const ticketCustomer = sequelize.define("ticketCustomer", {
  ticketId: {
    type: DataTypes.INTEGER,
  },
  customerId: {
    type: DataTypes.INTEGER,
  },
});

ticket.belongsToMany(customer, { through: ticketCustomer });
customer.belongsToMany(ticket, { through: ticketCustomer });

module.exports = {
  ticketCustomer,
};
