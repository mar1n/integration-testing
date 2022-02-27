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

test('omitting soldout items', () => {
    expect(generateItemRow({ name: "macaroon", quantity: 0, price: 3})).toBe(null);
    expect(generateItemRow({ name: "cheesecake", quantity: 0, price: 12})).toBe(null);
});

test('omitting free items', () => {
    expect(generateItemRow({name: "plastic cups", quantity: 99, price: 0})).toBe(null);
    expect(generateItemRow({name: "napkins", quantity: 200, price: 0})).toBe(null);
});
