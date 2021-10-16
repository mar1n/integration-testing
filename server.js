const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-body-parser");
const crypto = require("crypto");
const users = new Map();

const app = new Koa();
app.use(bodyParser());
const router = new Router();

const hashPassword = password => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

const { inventory } = require("./InventoryController");
const {addItemItemToCart, addItemsToCart, carts } = require("./CartController");
const { has } = require("koa/lib/response.js");

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

router.post("/carts/:username/add_multiple_items", ctx => {
  ctx.status = 200;
  const items = ctx.request.body;
  const { username } = ctx.params;
  try {
    addItemsToCart(username, items);
  } catch(err) {
    ctx.status = 400;
    return;
  }
})

router.post("/auth/user", ctx => {
  ctx.status = 200;
  const {email, password } = ctx.request.body;
  if(users.get(email)) {
    ctx.status = 400;
    ctx.body = "User already exist";
    return
  }
  users.set(email, hashPassword(password));
  return;
})

app.use(router.routes());

module.exports = { app: app.listen(3000), carts, inventory, users, hashPassword };