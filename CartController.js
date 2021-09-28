const { removeItemFromInventory } = require("./InventoryController");

const carts = new Map();

const addItemItemToCart = (username, item) => {
  removeItemFromInventory(item);

  const newItems = (carts.get(username) || []).concat(item);

  if (newItems.filter((newitem) => newitem === item).length <= 2) {
    carts.set(username, newItems);
    return true;
  } else {
    return false;
  }
};

const addItemsToCart = (username, items) => {
  for(let x = 0; x<items.length; x++) {
    addItemItemToCart(username, items[x])
  }
};

module.exports = { addItemItemToCart, addItemsToCart, carts };
