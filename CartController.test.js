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
    } );
    test("customers can't by more then 3 items of the same type", () => {
      const initialCartContent = ["cheesecake", "cheesecake", "cheesecake"];
      carts.set("test_user", initialCartContent);
      inventory.set("cheesecake", 1);
  
      try {
        addItemItemToCart("test_user", "cheesecake");
      } catch (e) {
        const expectedError = new Error(
          "You can't have more than three units of an item in your cart"
        );
        expectedError.code = 400;
        expect(e).toEqual(expectedError);
      }
  
      expect(carts.get("test_user")).toEqual(initialCartContent);
      expect.assertions(2);
    })
});
