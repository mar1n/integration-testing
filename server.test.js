const { app, carts, inventory } = require("./server.js");

const fetch = require("isomorphic-fetch");

const apiRoot = "http://localhost:3000";

afterAll(() => app.close());

afterEach(() => inventory.clear());
afterEach(() => carts.clear());

describe("Adding Items", () => {
    test("adding items", async () => {
        inventory.set("t-shirt", 1);
        const response = await fetch(
            `${apiRoot}/carts/test_user/items/t-shirt`,
            { method: "POST"}
        )

        expect(response.status).toEqual(200);
        expect(await response.json()).toEqual(["t-shirt"]);
        expect(inventory.get("t-shirt")).toEqual(0);
        expect(carts.get("test_user")).toEqual(["t-shirt"]);
    })
    test("adding items", async () => {
        inventory.set("t-shirt", 1);
        const response = await fetch(
            `${apiRoot}/carts/test_user/items/t-shirt`,
            { method: "POST"}
        )

        expect(response.status).toEqual(200);
        expect(await response.json()).toEqual(["t-shirt"]);
        expect(inventory.get("t-shirt")).toEqual(0);
        expect(carts.get("test_user")).toEqual(["t-shirt"]);
    })
    test("item doesn't exist", async () => {
        const response = await fetch (
            `${apiRoot}/carts/test_user/items/t-shirt`,
            { method: "POST"}
        )
        expect(response.status).toEqual(200);
    })
})

describe("getting items", () => {
    
})