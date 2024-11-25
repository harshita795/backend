const express = require("express");
const app = express();
const { sequelize } = require("./lib/index.js");
const { ticket } = require("./models/ticket.js");
const { ticketCustomer } = require("./models/ticketCustomer.js");
const { ticketAgent } = require("./models/ticketAgent.js");
const { agent } = require("./models/agent.js");
const { customer } = require("./models/customer.js");

app.use(express.json());

app.get("/seed_db", async (req, res) => {
  await sequelize.sync({ force: true });

  let tickets = await ticket.bulkCreate([
    {
      ticketId: 1,
      title: "Login Issue",
      description: "Cannot login to account",
      status: "open",
      priority: 1,
      customerId: 1,
      agentId: 1,
    },
    {
      ticketId: 2,
      title: "Payment Failure",
      description: "Payment not processed",
      status: "closed",
      priority: 2,
      customerId: 2,
      agentId: 2,
    },
    {
      ticketId: 3,
      title: "Bug Report",
      description: "Found a bug in the system",
      status: "open",
      priority: 3,
      customerId: 1,
      agentId: 1,
    },
  ]);

  let customers = await customer.bulkCreate([
    { customerId: 1, name: "Alice", email: "alice@example.com" },
    { customerId: 2, name: "Bob", email: "bob@example.com" },
  ]);

  let agents = await agent.bulkCreate([
    { agentId: 1, name: "Charlie", email: "charlie@example.com" },
    { agentId: 2, name: "Dave", email: "dave@example.com" },
  ]);

  await ticketCustomer.bulkCreate([
    { ticketId: tickets[0].id, customerId: customers[0].id },
    { ticketId: tickets[2].id, customerId: customers[0].id },
    { ticketId: tickets[1].id, customerId: customers[1].id },
  ]);

  await ticketAgent.bulkCreate([
    { ticketId: tickets[0].id, agentId: agents[0].id },
    { ticketId: tickets[2].id, agentId: agents[0].id },
    { ticketId: tickets[1].id, agentId: agents[1].id },
  ]);

  return res.json({ message: "Database seeded successfully" });
});

// Helper function to get ticket's associated customers
async function getTicketCustomers(ticketId) {
  const ticketCustomers = await ticketCustomer.findAll({
    where: { ticketId },
  });

  let customerData;
  for (let cus of ticketCustomers) {
    customerData = await customer.findOne({
      where: { customerId: cus.customerId },
    });
  }

  return customerData;
}

// Helper function to get agent's associated customers
async function getTicketAgents(ticketId) {
  const ticketAgents = await ticketAgent.findAll({ where: { ticketId } });

  let agentData;
  for (const ag of ticketAgents) {
    agentData = await agent.findOne({ where: { agentId: ag.agentId } });
  }

  return agentData;
}

// Helper function to get ticket details with associated customers and agents
async function getTicketDetails(ticketData) {
  const customer = await getTicketCustomers(ticketData.id);

  const agent = await getTicketAgents(ticketData.id);

  return {
    ...ticketData.dataValues,
    customer,
    agent,
  };
}

app.get("/tickets", async (req, res) => {
  try {
    const tickets = await ticket.findAll();

    const ticketDetails = [];
    for (const t of tickets) {
      const details = await getTicketDetails(t);
      ticketDetails.push(details);
    }

    return res.status(200).json({ tickets: ticketDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/tickets/details/:id", async (req, res) => {
  try {
    const oneTicket = await ticket.findOne({
      where: { id: req.params.id },
    });

    const details = await getTicketDetails(oneTicket);

    return res.status(200).json({ ticket: details });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/tickets/status/:status", async (req, res) => {
  try {
    const status = req.params.status;
    const tickets = await ticket.findAll({
      where: { status },
    });
    let ticketDetails = [];

    for (let t of tickets) {
      const details = await getTicketDetails(t);
      ticketDetails.push(details);
    }

    return res.status(200).json({ tickets: ticketDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/tickets/sort-by-priority", async (req, res) => {
  try {
    const tickets = await ticket.findAll({ order: [["priority", "ASC"]] });

    const ticketDetails = [];

    for (let t of tickets) {
      const details = await getTicketDetails(t);
      ticketDetails.push(details);
    }

    return res.status(200).json({ tickets: ticketDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/tickets/new", async (req, res) => {
  try {
    const newTicket = req.body;
    const thisTicket = await ticket.create(newTicket);
    return res.status(200).json({ tickets: thisTicket });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/tickets/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updateTicket = await ticket.findOne({
      where: { id },
    });

    if (!updateTicket) {
      return res.status(404).json({ message: `No ticket Id found.` });
    }

    updateTicket.set(newData);
    let updatedData = await updateTicket.save();

    return res.status(200).json({ message: "Ticket updated", updatedData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/tickets/delete", async (req, res) => {
  try {
    const id = req.body;
    const tickets = await ticket.destroy({
      where: { id },
    });
    if (!tickets) {
      return res.status(404).json({ message: `No id found` });
    }
    return res.status(200).json({ message: "Ticket deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});
