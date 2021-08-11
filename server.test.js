const { app } = require("./server.js");

const { addItemItemToCart, carts } = require("./CartController");
const { inventory } = require("./InventoryController");

const request = require("supertest");

afterAll(() => app.close());

afterEach(() => inventory.clear());
afterEach(() => carts.clear());

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
    console.log("carts", carts);
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
