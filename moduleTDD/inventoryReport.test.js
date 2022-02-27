const { generateItemRow } = require("./inventoryReport");

test("generating an items row", () => {
  const item = { name: "macaroon", quantity: 12, price: 3 };
  expect(generateItemRow(item)).toBe("macaroon,12,3,36");
  expect(generateItemRow({ name: "cheesecake", quantity: 6, price: 12 })).toBe(
    "cheesecake,6,12,72"
  );
  expect(generateItemRow({ name: "apple pie", quantity: 5, price: 15 })).toBe(
    "apple pie,5,15,75"
  );
});
