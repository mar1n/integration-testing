const { app, users, hashPassword } = require("./server.js");

const { addItemItemToCart, carts } = require("./CartController");
const { inventory } = require("./InventoryController");

const request = require("supertest");

afterAll(() => app.close());

afterEach(() => inventory.clear());
afterEach(() => carts.clear());
afterEach(() => users.clear());

describe("Adding Items", () => {
  test("adding items", async () => {
    inventory.set("t-shirt", 1);

    const response = await request(app).post(
      "/carts/test_user/items/t-shirt"
    );

    expect(response.status).toEqual(200);

    expect(response.body).toEqual(true);
    expect(inventory.get("t-shirt")).toEqual(0);
    expect(carts.get("test_user")).toEqual(["t-shirt"]);
  });
  test("adding items", async () => {
    inventory.set("t-shirt", 1);
    const response = await request(app).post(
      "/carts/test_user/items/t-shirt"
    );

    expect(response.status).toEqual(200);
  });
  test("item doesn't exist", async () => {
    const response = await request(app).post(
      "/carts/test_user/items/t-shirt"
    );
    expect(response.status).toEqual(400);
  });
});

describe("deleting items", () => {
  test("delete item", async () => {
    carts.set("Szymon", ["Visa-123"]);
    const response = await request(app).delete(
      "/carts/Szymon/items/Visa-123"
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });
});

describe("getting items", () => {
  test("item is available", async () => {
    carts.set("Szymon", ["Visa-XXX"]);
    const response = await request(app).get(
      "/carts/Szymon/items"
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(["Visa-XXX"]);
  });
});

describe("adding multiply items", () => {
  test("add multiply items", async () => {
    inventory.set("t-shirt", 1);
    inventory.set("shoes", 1);
    const response = await request(app).post(
      "/carts/:username/add_multiple_items"
    ).send(["t-shirt", "shoes"])

    expect(response.status).toEqual(200);
    expect(inventory.get("t-shirt")).toEqual(0);
    expect(inventory.get("shoes")).toEqual(0);
    //expect(response.body).toEqual();
  })
})

describe("authentication", () => {
  
  test("create user in Map Object", async () => {
  
    const response = await request(app).post(
      "/auth/user"
    ).send({ email: "cyckykacz@gmail.com", password: "12345"});

    expect(response.status).toEqual(200);
    expect(users.get("cyckykacz@gmail.com")).toEqual(hashPassword("12345"));
  })

  test("test does not create duplicate users", async () => {
  
    const response = await request(app).post(
      "/auth/user"
    ).send({ email: "cyckykacz@gmail.com", password: "12345"});

    expect(response.status).toEqual(200);
    expect(users.get("cyckykacz@gmail.com")).toEqual(hashPassword("12345"));

    response2 = await request(app).post(
      "/auth/user"
    ).send({ email: "cyckykacz@gmail.com", password: "12345"});
    expect(response2.status).toEqual(400);
    expect(response2.text).toEqual("User already exist");
  })

  test("create hash password", async() =>{
    const response = await request(app).post(
      "/auth/user"
    ).send({ email: "cykcykacz@gmail.com", password: "12345"});
    expect(response.status).toEqual(200);
  })
})
