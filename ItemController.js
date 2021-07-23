const inventory = new Map();

const removeItemFromInventory = (ctx, item) => {
  const isAvailable = inventory.has(item) && inventory.get(item) > 0;
  if (!isAvailable) {
    ctx.body = { message: `${item} is unavailable` };
    ctx.status = 400;
    return;
  }
  const currentNumberOfItems = inventory.get(item);
  inventory.set(item, currentNumberOfItems - 1);
};

module.exports = { removeItemFromInventory, inventory };
