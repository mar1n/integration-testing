const fs = require("fs");
const initialHTML = fs.readFileSync("./index.html");

const { getByText, screen } = require("@testing-library/dom");

const { updateItemList } = require("./domController");

beforeEach(() => {
  document.body.innerHTML = initialHTML;
});
describe("updateItemList", () => {
  test("updates the DOM with the inventory items", () => {
    const inventory = {
      cheesecake: 5,
      "apple pie": 2,
      "carrot cake": 6,
    };

    updateItemList(inventory);
    const itemList = document.getElementById("item-list");
    expect(itemList.childNodes).toHaveLength(3);

    expect(getByText(itemList, "cheesecake - Quantity: 5")).toBeTruthy();
    expect(getByText(itemList, "apple pie - Quantity: 2")).toBeTruthy();
    expect(getByText(itemList, "carrot cake - Quantity: 6")).toBeTruthy();
  });

  test("adding a paragraph indicating what was the update", () => {
    const inventory = { cheesecake: 5, "apple pie": 2 };
    updateItemList(inventory);
    const paragraphs = Array.from(document.querySelectorAll("p"));
    const updateParagraphs = paragraphs.filter((p) => {
      return p.innerHTML.includes("The inventory has been updated");
    });

    expect(updateParagraphs).toHaveLength(1);
    expect(screen.getByText(`The inventory has been updated - ${JSON.stringify(inventory)}`)).toBeTruthy();
  });

  test("updates the DOM with the inventory items", () => {
    const inventory = {
        cheesecake: 5,
        "apple pie": 2,
        "carrot cake": 6
    };
    updateItemList(inventory);

    const itemList = document.getElementById("item-list");
    expect(itemList.childNodes).toHaveLength(3);

    expect(getByText(itemList, "cheesecake - Quantity: 5", { selector: "li"})).toBeTruthy();
    expect(getByText(itemList, "apple pie - Quantity: 2")).toBeTruthy();
    expect(getByText(itemList, "carrot cake - Quantity: 6")).toBeTruthy();
  })
});
