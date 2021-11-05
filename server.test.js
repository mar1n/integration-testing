const { user: globalUser } = require("./userTestUtils");
const { db } = require("./dbConnection");
const request = require("supertest");

jest.mock("isomorphic-fetch");
const { when } = require("jest-when");

const fetch = require("isomorphic-fetch");
const { app } = require("./server.js");
const { hashPassword } = require("./authenticationController.js");
afterAll(() => app.close());

describe("add items to a cart", () => {
  test("adding available items", async () => {
    await db("inventory").insert({ itemName: "cheesecake", quantity: 3 });
    const response = await request(app)
      .post(`/carts/${globalUser.username}/items`)
      .set("authorization", globalUser.authHeader)
      .send({ item: "cheesecake", quantity: 3 })
      .expect(200)
      .expect("Content-Type", /json/);

    const newItems = [{ itemName: "cheesecake", quantity: 3 }];
    expect(response.body).toEqual(newItems);

    const { quantity: inventoryCheesecakes } = await db
      .select()
      .from("inventory")
      .where({ itemName: "cheesecake" })
      .first();
    expect(inventoryCheesecakes).toEqual(0);

    const finalCartContent = await db
      .select("carts_items.itemName", "carts_items.quantity")
      .from("carts_items")
      .join("users", "users.id", "carts_items.userId")
      .where("users.username", globalUser.username);

    expect(finalCartContent).toEqual(newItems);
  });

  test("adding unavailable items", async () => {
    const response = await request(app)
      .post(`/carts/${globalUser.username}/items`)
      .set("authorization", globalUser.authHeader)
      .send({ item: "cheesecake", quantity: 1 })
      .expect(400)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "cheesecake is unavailable",
    });

    const finalCartContent = await db
      .select("carts_items.itemName", "carts_items.quantity")
      .from("carts_items")
      .join("users", "users.id", "carts_items.userId")
      .where("users.username", globalUser.username);
    expect(finalCartContent).toEqual([]);
  });
});

describe("removing items from a cart", () => {
  test("removing existing items", async () => {
    await db("carts_items").insert({
      userId: globalUser.id,
      itemName: "cheesecake",
      quantity: 1,
    });

    const response = await request(app)
      .del(`/carts/${globalUser.username}/items/cheesecake`)
      .set("authorization", globalUser.authHeader)
      .expect(200)
      .expect("Content-Type", /json/);

    const expectedFinalContent = [{ itemName: "cheesecake", quantity: 0 }];

    expect(response.body).toEqual(expectedFinalContent);

    const finalCartContent = await db
      .select("carts_items.itemName", "carts_items.quantity")
      .from("carts_items")
      .join("users", "users.id", "carts_items.userId")
      .where("users.username", globalUser.username);
    expect(finalCartContent).toEqual(expectedFinalContent);

    const { quantity: inventoryCheesecakes } = await db
      .select()
      .from("inventory")
      .where({ itemName: "cheesecake" })
      .first();
    expect(inventoryCheesecakes).toEqual(1);
  });

  test("removing non-existing items", async () => {
    await db("inventory").insert({
      itemName: "cheesecake",
      quantity: 0,
    });

    const response = await request(app)
      .del(`/carts/${globalUser.username}/items/cheesecake`)
      .set("authorization", globalUser.authHeader)
      .expect(400)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "cheesecake is not in the cart",
    });

    const { quantity: inventoryCheesecakes } = await db
      .select()
      .from("inventory")
      .where({ itemName: "cheesecake" })
      .first();
    expect(inventoryCheesecakes).toEqual(0);
  });
});

describe("create accounts", () => {
  test("creating a new account", async () => {
    const response = await request(app)
      .put("/users/another_user")
      .send({ email: "another_user@example.org", password: "a_password" })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "another_user created successfully",
    });

    const savedUser = await db
      .select("email", "passwordHash")
      .from("users")
      .where({ username: "another_user" })
      .first();

    expect(savedUser).toEqual({
      email: "another_user@example.org",
      passwordHash: hashPassword("a_password"),
    });
  });

  test("creating a duplicate account", async () => {
    const response = await request(app)
      .put(`/users/${globalUser.username}`)
      .send({ email: globalUser.email, password: "a_password" })
      .expect(409)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: `${globalUser.username} already exists`,
    });
  });
});

describe("fetch inventory items", () => {
  const eggs = { itemName: "eggs", quantity: 3 };
  const applePie = { itemName: "apple pie", quantity: 1 };

  beforeEach(async () => {
    await db("inventory").insert([eggs, applePie]);
    const { id: eggsId } = await db
      .select()
      .from("inventory")
      .where({ itemName: "eggs" })
      .first();
    eggs.id = eggsId;
  });

  test("can fetch an item from the inventory", async () => {
    // const thirdPartyResponse = await fetch(
    //   `https://www.themealdb.com/api/json/v1/1/search.php?s=eggs`
    // )

    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ meals: [{ strMeal: `Salmon Eggs Eggs Benedict` }] })
    });

    const title = `Salmon Eggs Eggs Benedict`;

    const response = await request(app)
      .get(`/inventory/eggs`)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(fetch.mock.calls).toHaveLength(1);
    expect(fetch.mock.calls[0]).toEqual(["https://www.themealdb.com/api/json/v1/1/search.php?s=eggs"])

    expect(response.body).toEqual({
      ...eggs,
      info: `Data obtainde with title meal ${title}`,
    });
  });

  // test("using jest.mock to fake api call/request", async () => {
  //   jest.mock
  // })
});
