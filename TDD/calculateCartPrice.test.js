const { calculateCartPrice } = require("./calculateCartPrice.js");

test("calculating total values", () => {
  expect(calcaulateCartPrice([1,1,2,3])).toBe(7);
})
