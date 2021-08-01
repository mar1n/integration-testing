const { removeItemFromInventory } = require("./InventoryController");

const carts = new Map();

const addItemItemToCart = (username, item) => {
    removeItemFromInventory(item);
    const newItems = (carts.get(username) || []).concat(item);
    carts.set(username, newItems);
    return newItems;
};

module.exports = { addItemItemToCart, carts };
