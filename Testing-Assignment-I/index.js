const express = require("express");
const app = express();
const {
  getAllShows,
  getshowById,
  addNewShow,
  getCustomers,
  getCustomerById,
  addCustomer,
} = require("./controllers.js");

app.use(express.json());

app.get("/shows", (req, res) => {
  try {
    const response = getAllShows();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/shows/:id", (req, res) => {
  try {
    const showId = parseInt(req.params.id);
    const response = getshowById(showId);

    if (!response) {
      return res.status(404).json({ message: `No show found by id ${id}` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/shows", async (req, res) => {
  try {
    const newShow = req.body;
    const response = await addNewShow(newShow);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/customers", async (req, res) => {
  let customers = await getCustomers();
  return res.status(200).json(customers);
});

app.get("/customers/details/:id", async (req, res) => {
  let customerId = parseInt(req.params.id);
  let customer = await getCustomerById(customerId);

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  return res.status(200).json(customer);
});

app.post("/customers/new", async (req, res) => {
  let newCustomer = req.body;
  let response = await addCustomer(newCustomer);
  if (response.error) {
    return res.status(400).json({ message: response.error });
  }

  return res.status(201).json(response);
});

module.exports = { app };
