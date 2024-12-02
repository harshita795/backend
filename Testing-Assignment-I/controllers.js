// dummy data
let theatres = [
  { theatreId: 1, name: "Regal Cinemas", location: "Downtown" },
  { theatreId: 2, name: "AMC Theatres", location: "Midtown" },
  { theatreId: 3, name: "Cinemark", location: "Uptown" },
];

let shows = [
  { showId: 1, title: "The Lion King", theatreId: 1, time: "7:00 PM" },
  { showId: 2, title: "Hamilton", theatreId: 2, time: "8:00 PM" },
  { showId: 3, title: "Wicked", theatreId: 3, time: "9:00 PM" },
  { showId: 4, title: "Les Misérables", theatreId: 1, time: "6:00 PM" },
];

function getAllShows() {
  return shows;
}
function getshowById(showId) {
  return shows.find((show) => show.showId === showId);
}

async function addNewShow(showData) {
  if (!showData.title || typeof showData.title !== "string") {
    return { error: "Title is required an should be a string" };
  }
  if (!showData.theatreId || typeof showData.theatreId !== "number") {
    return { error: "theatreId is required an should be a number" };
  }
  if (!showData.time || typeof showData.time !== "string") {
    return { error: "Time is required an should be a string" };
  }

  let newShow = { showId: shows.length + 1, ...showData };
  shows.push(newShow);
  return newShow;
}

let customers = [
  { customerId: 1, name: "Alice Smith", email: "alice@example.com" },
  { customerId: 2, name: "Bob Johnson", email: "bob@example.com" },
];

function getCustomers() {
  return customers;
}

function getCustomerById(customerId) {
  return customers.find((customer) => customer.customerId === customerId);
}
async function addCustomer(customerData) {
  if (!customerData.name || typeof customerData.name !== "string") {
    return { error: "Name is required and should be a string" };
  }

  if (!customerData.email || typeof customerData.email !== "string") {
    return { error: "Email is required and should be a string" };
  }

  let customer = { customerId: customers.length + 1, ...customerData };
  customers.push(customer);
  return customer;
}

module.exports = {
  customers,
  getAllShows,
  getshowById,
  addNewShow,
  getCustomers,
  getCustomerById,
  addCustomer,
};
