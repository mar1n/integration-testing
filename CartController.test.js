const { removeItemFromInventory, inventory } = require("./ItemController");

//const fetch = require("isomorphic-fetch");

//const apiRoot = "http://localhost:3000";

//afterAll(() => app.close());

afterEach(() => inventory.clear());
//afterEach(() => carts.clear());

describe("remove item from collections", () => {
    test("return errors where there is not item in the invntory", () => {
        const ctx = {}
        const removeItem = removeItemFromInventory(ctx, "t-shirt");
        expect(removeItem).toEqual(undefined);
        expect(ctx.status).toEqual(400);
        expect(ctx.body.message).toEqual(`t-shirt is unavailable`);
    })
    test("remove item", () => {
        inventory.set("t-shirt", 100);
        const ctx = {};
        const removeItem = removeItemFromInventory(ctx, "t-shirt");
        expect(inventory.get("t-shirt")).toEqual(99);
    })
});
