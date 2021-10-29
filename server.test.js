const { app, users, hashPassword } = require("./server.js");

const { addItemItemToCart, carts } = require("./CartController");
const { inventory } = require("./InventoryController");
const { usersBook, hashPasswordBook } = require("./authenticationController");

const user = "test_user";
const password = "a_password";
const validAuth = Buffer.from(`${user}:${password}`).toString("base64");
const authHeader = `Basic ${validAuth}`;
const createUser = () => {
  usersBook.set(user, {
    email: "test_user@example.org",
    passwordHash: hashPassword(password),
  });
};

const request = require("supertest");

afterAll(() => app.close());

afterEach(() => inventory.clear());
afterEach(() => carts.clear());
afterEach(() => users.clear());
afterEach(() => usersBook.clear());

describe("adding, deleting items", () => {
  beforeEach(createUser);

  test("adding available items xxx", async () => {
    inventory.set("cheesecake", 3);
    const response = await request(app)
      .post("/carts/test_user/items")
      .set("authorization", authHeader)
      .send({ item: "cheesecake", quantity: 3 })
      .expect(200)
      .expect("Content-Type", /json/);

    const newItems = ["cheesecake", "cheesecake", "cheesecake"];
    expect(response.body).toEqual(newItems);
    expect(inventory.get("cheesecake")).toEqual(0);
    expect(carts.get("test_user")).toEqual(newItems);
  });

  test("adding unavailable items", async () => {
    inventory.set("donuts", 2);
    const response = await request(app)
      .post("/carts/test_user/items")
      .set("authorization", authHeader)
      .send({ item: "cheesecake", quantity: 2 })
      .expect(400)
      .expect("Content-Type", /json/);

    expect(response.body.message).toEqual("cheesecake is unavailable");
  });

  test("item is available", async () => {
    carts.set("Szymon", ["Visa-XXX"]);
    const response = await request(app)
      .get("/carts/Szymon/items")
      .set("authorization", authHeader)
      .expect(200);

  });

  test("delete item", async () => {
    carts.set("Szymon", ["Visa-123"]);
    const response = await request(app)
      .delete("/carts/Szymon/items/Visa-123")
      .set("authorization", authHeader)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  test("delete unavailable item", async () => {
    carts.set("Szymon", ["t-shirt"]);
    const response = await request(app)
      .delete("/carts/Szymon/items/apple")
      .set("authorization", authHeader)
      .expect(400);

    expect(response.body.message).toEqual("apple is not in the cart");
  });
});

describe("authentication", () => {
  test("create user in Map Object", async () => {
    const response = await request(app)
      .post("/auth/user")
      .send({ email: "cyckykacz@gmail.com", password: "12345" });

    expect(response.status).toEqual(200);
    expect(users.get("cyckykacz@gmail.com")).toEqual(hashPassword("12345"));
  });

  test("test does not create duplicate users", async () => {
    const response = await request(app)
      .post("/auth/user")
      .send({ email: "cyckykacz@gmail.com", password: "12345" });

    expect(response.status).toEqual(200);
    expect(users.get("cyckykacz@gmail.com")).toEqual(hashPassword("12345"));

    response2 = await request(app)
      .post("/auth/user")
      .send({ email: "cyckykacz@gmail.com", password: "12345" });
    expect(response2.status).toEqual(400);
    expect(response2.text).toEqual("User already exist");
  });

  test("create hash password", async () => {
    const response = await request(app)
      .post("/auth/user")
      .send({ email: "cykcykacz@gmail.com", password: "12345" });
    expect(response.status).toEqual(200);
  });
});

describe("create accounts", () => {
  test("creating a new account --Szymon", async () => {
    const response = await request(app)
      .put("/users/test_user")
      .send({ email: "test_user@example.org", password: "a_password" })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "test_user created successfully",
    });

    expect(usersBook.get("test_user")).toEqual({
      email: "test_user@example.org",
      passwordHash: hashPasswordBook("a_password"),
    });
  });
});
