const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();



const { inventory } = require("./InventoryController");
const {addItemItemToCart, carts } = require("./CartController");

router.get("/carts/:username/items", ctx => {
  const cart = carts.get(ctx.params.username);
  cart ? (ctx.body = cart) : (ctx.status = 404);
});

router.post("/carts/:username/items/:item", ctx => {
  const { username, item } = ctx.params;
  try {
    const newItems = addItemItemToCart(username, item);
    ctx.body = newItems;
  } catch(err) {
    ctx.body = { message: err.message}
    ctx.status = err.code
    return;
  }
});

router.delete("/carts/:username/items/:item", ctx => {
  const { username, item } = ctx.params;
  if (!carts.has(username) || !carts.get(username).includes(item)) {
    ctx.body = { message: `${item} is not in the cart` };
    ctx.status = 400;
    return;
  }

  const newItems = (carts.get(username) || []).filter(i => i !== item);
  inventory.set(item, (inventory.get(item) || 0) + 1);
  carts.set(username, newItems);
  ctx.body = newItems;
});

app.use(router.routes());

module.exports = { app: app.listen(3000), carts, inventory };