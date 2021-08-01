const { app } = require("./server.js");

const { addItemItemToCart, carts } = require("./CartController");
const { inventory } = require("./InventoryController");

const fetch = require("isomorphic-fetch");

const apiRoot = "http://localhost:3000";

afterAll(() => app.close());

afterEach(() => inventory.clear());
afterEach(() => carts.clear());

describe("Adding Items", () => {
  test("adding items", async () => {
    inventory.set("t-shirt", 1);

    const response = await fetch(`${apiRoot}/carts/test_user/items/t-shirt`, {
      method: "POST",
    });

    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual(["t-shirt"]);
    expect(inventory.get("t-shirt")).toEqual(0);
    expect(carts.get("test_user")).toEqual(["t-shirt"]);
  });
  test("adding items", async () => {
    inventory.set("t-shirt", 1);
    const response = await fetch(`${apiRoot}/carts/test_user/items/t-shirt`, {
      method: "POST",
    });

    expect(response.status).toEqual(200);
    console.log("await", await response.json());
    // expect(await response.json()).toEqual(["t-shirt"]);
    // expect(inventory.get("t-shirt")).toEqual(0);
    // expect(carts.get("test_user")).toEqual(["t-shirt"]);
  });
  test("item doesn't exist", async () => {
    const response = await fetch(`${apiRoot}/carts/test_user/items/t-shirt`, {
      method: "POST",
    });
    expect(response.status).toEqual(400);
  });
});

describe("deleting items", () => {
  test("delete item", async () => {
    carts.set("Szymon", ["Visa-123"]);
    console.log("carts", carts);
    const response = await fetch(`${apiRoot}/carts/Szymon/items/Visa-123`, {
      method: "DELETE",
    });
    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual([]);
  });
});

describe("getting items", () => {
    test("item is available", async() => {
        carts.set("Szymon", ["Visa-XXX"]);
        const response = await fetch(
            `${apiRoot}/carts/Szymon/items`,
            { method: "GET"}
        );

        expect(response.status).toEqual(200);
        expect(await response.json()).toEqual(["Visa-XXX"]);
    })
})
