const { removeItemFromInventory, inventory } = require("./InventoryController");
const { carts } = require("./CartController");

afterEach(() => inventory.clear());
afterEach(() => carts.clear());

describe("removing items from inventory", () => {
    test("remove unavailable item from inventory", () => {
        try {
            removeItemFromInventory("cheesecake");
        } catch(e) {
            const expectedError = new Error(`cheesecake is unavailable`);
            expectedError.code = 400;
            expect(e.code).toEqual(expectedError.code);
        }
    })
    test("remove item from inventory", () => {
        inventory.set("donuts",100);
        removeItemFromInventory("donuts");
        expect(inventory.get("donuts")).toEqual(99);
    })
});