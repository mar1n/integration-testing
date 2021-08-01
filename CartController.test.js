const { inventory } = require("./InventoryController");
const { addItemItemToCart, carts } = require("./CartController");

//const fetch = require("isomorphic-fetch");

//const apiRoot = "http://localhost:3000";

//afterAll(() => app.close());

afterEach(() => inventory.clear());
afterEach(() => carts.clear());

describe("add Items to Cart", () => {
    test("adding anavailable items to cart", () => {
        carts.set("test_user", []);
        inventory.set("cheesecake", 0);
    
        try {
          addItemItemToCart("test_user", "cheesecake");
        } catch (e) {
          const expectedError = new Error(`cheesecake is unavailable`);
          expectedError.code = 400;
    
          expect(e.code).toEqual(expectedError.code);
        }
    
        expect(carts.get("test_user")).toEqual([]);
        expect.assertions(2);
    } )
});
