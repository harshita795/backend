const request = require("supertest");
const { app } = require("../index.js");
const {
  customers,
  getAllShows,
  getshowById,
  addNewShow,
  getCustomers,
  getCustomerById,
  addCustomer,
} = require("../controllers.js");
let http = require("http");

jest.mock("../controllers.js", () => ({
  ...jest.requireActual("../controllers.js"),
  getAllShows: jest.fn(),
  getshowById: jest.fn(),
  addNewShow: jest.fn(),
  getCustomers: jest.fn(),
  getCustomerById: jest.fn(),
  addCustomer: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Endpoints Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET API /shows/ should return all shows", async () => {
    const mockShows = [
      { showId: 1, title: "The Lion King", theatreId: 1, time: "7:00 PM" },
      { showId: 2, title: "Hamilton", theatreId: 2, time: "8:00 PM" },
      { showId: 3, title: "Wicked", theatreId: 3, time: "9:00 PM" },
      { showId: 4, title: "Les Misérables", theatreId: 1, time: "6:00 PM" },
    ];

    getAllShows.mockReturnValue(mockShows);

    const response = await request(server).get("/shows");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockShows);
    expect(response.body.length).toBe(4);
  });

  it("GET API /shows/:id should return show by Id", async () => {
    const mockShow = {
      showId: 1,
      title: "The Lion King",
      theatreId: 1,
      time: "7:00 PM",
    };

    getshowById.mockReturnValue(mockShow);

    const response = await request(server).get("/shows/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockShow);
  });

  it("POST API /shows show add a new show", async () => {
    const newShow = {
      title: "Phantom of the Opera",
      theatreId: 2,
      time: "5:00 PM",
    };

    addNewShow.mockResolvedValue(newShow);

    const response = await request(server).post("/shows").send({
      title: "Phantom of the Opera",
      theatreId: 2,
      time: "5:00 PM",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newShow);
  });
});

describe("Functions test", () => {
  // Mock getAllShows Function
  it("getAllShows should return all shows", async () => {
    let mockShows = [
      { showId: 1, title: "The Lion King", theatreId: 1, time: "7:00 PM" },
      { showId: 2, title: "Hamilton", theatreId: 2, time: "8:00 PM" },
    ];

    getAllShows.mockReturnValue(mockShows);

    const result = getAllShows();

    expect(getAllShows).toHaveBeenCalled();
    expect(result).toEqual(mockShows);
  });

  it("getshowById should return show by Id", async () => {
    let mockShow = {
      showId: 1,
      title: "The Lion King",
      theatreId: 1,
      time: "7:00 PM",
    };

    getshowById.mockReturnValue(mockShow);

    const result = getshowById(1);

    expect(getshowById).toHaveBeenCalled();
    expect(result).toEqual(mockShow);
  });

  // it("addShow should add the new show", async () => {
  //   let newShow = {
  //     showId: 5,
  //     title: "The Lion",
  //     theatreId: 2,
  //     time: "7:10 PM",
  //   };

  //   addNewShow.mockResolvedValue(newShow);

  //   const res = (await request(server).post("/shows")).send({
  //     showId: 5,
  //     title: "The Lion",
  //     theatreId: 2,
  //     time: "7:10 PM",
  //   });

  //   expect(res.status).toBe(201);
  //   expect(res.body).toEqual(newShow);
  // });
});

describe("Functions Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getCustomers function should return all customer records", async () => {
    const mockCustomers = [
      { customerId: 1, name: "Alice Smith", email: "alice@example.com" },
      { customerId: 2, name: "Bob Johnson", email: "bob@example.com" },
    ];

    getCustomers.mockReturnValue(mockCustomers);

    const result = getCustomers();

    expect(getCustomers).toHaveBeenCalled();
    expect(result).toEqual(mockCustomers);
    expect(result.length).toBe(2);
  });

  it("getCustomerById function should return the correct customer", async () => {
    const mockCustomer = {
      customerId: 1,
      name: "Alice Smith",
      email: "alice@example.com",
    };

    getCustomerById.mockReturnValue(mockCustomer);

    const result = getCustomerById(1);

    expect(getCustomerById).toHaveBeenCalled();
    expect(result).toEqual(mockCustomer);
  });

  it("addCustomer function should add a new customer", async () => {
    const newCustomer = { name: "Charlie Brown", email: "charlie@example.com" };
    const mockCustomers = [
      { customerId: 1, name: "Alice Smith", email: "alice@example.com" },
      { customerId: 2, name: "Bob Johnson", email: "bob@example.com" },
    ];
    const addedCustomer = { customerId: 3, ...newCustomer };

    addCustomer.mockReturnValue(addedCustomer);
    getCustomers.mockReturnValue([...mockCustomers, addedCustomer]);

    const postResponse = await request(app)
      .post("/customers/new")
      .send(newCustomer);

    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toEqual(addedCustomer);

    const getResponse = await request(app).get("/customers");

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.length).toBe(mockCustomers.length + 1);
    expect(getResponse.body).toContainEqual(addedCustomer);
  });
});

describe("Endpoints Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /customers should return all customer records", async () => {
    const mockCustomers = [
      { customerId: 1, name: "Alice Smith", email: "alice@example.com" },
      { customerId: 2, name: "Bob Johnson", email: "bob@example.com" },
    ];

    getCustomers.mockResolvedValue(mockCustomers);

    const res = await request(server).get("/customers");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockCustomers);
    expect(res.body.length).toBe(2);
  });

  it("GET /customers/details/:id should return the correct customer", async () => {
    const mockCustomer = {
      customerId: 1,
      name: "Alice Smith",
      email: "alice@example.com",
    };

    getCustomerById.mockResolvedValue(mockCustomer);

    const res = await request(server).get("/customers/details/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockCustomer);
  });

  it("POST /customers/new should add a new customer", async () => {
    const newCustomer = {
      name: "Charlie Brown",
      email: "charlie@example.com",
    };

    addCustomer.mockResolvedValue(newCustomer);

    const res = await request(server).post("/customers/new").send(newCustomer);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(newCustomer);
  });
});
