const { removeItemFromInventory } = require("./InventoryController");

const carts = new Map();

const addItemItemToCart = (username, item) => {
  removeItemFromInventory(item);

  const newItems = (carts.get(username) || []).concat(item);

  if (!compliesToItemLimit(newItems)) {
    const limitError = new Error(
      "You can't have more than three units of an item in your cart"
    );
    limitError.code = 400;
    throw limitError;
  }

  carts.set(username, newItems);
  //logger.log(`${item} added to ${username}'s cart`);
  return newItems;
};

const addItemsToCart = (username, items) => {
  for(let x = 0; x<items.length; x++) {
    addItemItemToCart(username, items[x])
  }
};

const compliesToItemLimit = cart => {
  const unitsPerItem = cart.reduce((itemMap, itemName) => {
    const quantity = (itemMap[itemName] || 0) + 1;
    return { ...itemMap, [itemName]: quantity };
  }, {});

  return Object.values(unitsPerItem).every(quantity => quantity <= 3);
};

module.exports = { addItemItemToCart, addItemsToCart, carts };
