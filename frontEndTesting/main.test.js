const fs = require("fs");
const initialHtml = fs.readFileSync("./index.html");
const { screen, getByText, fireEvent } = require("@testing-library/dom");

beforeEach(() => {
  document.body.innerHTML = initialHtml;

  jest.resetModules();
  require("./main");
});

test("adding items through the form", () => {
  screen.getByPlaceholderText("Item name").value = "cheesecake";
  screen.getByPlaceholderText("Quantity").value = "6";

  const event = new Event("submit");
  const form = document.getElementById("add-item-form");
  form.dispatchEvent(event);

  const itemList = document.getElementById("item-list");
  expect(getByText(itemList, "cheesecake - Quantity: 6")).toBeInTheDocument();
});

describe("item name validation", () => {
  test("entering valid item names", () => {
    const itemField = screen.getByPlaceholderText("Item name");
    fireEvent.input(itemField, {
      target: { value: "cheesecake" },
      bubbles: true,
    });

    expect(screen.getByText("cheesecake is valid!")).toBeInTheDocument();
  });
  test("entering wrong item names", () => {
    const itemField = screen.getByPlaceholderText("Item name");
    fireEvent.input(itemField, {
      target: { value: "carrot" },
      bubbles: true,
    });

    expect(screen.getByText("carrot is not a valid item.")).toBeInTheDocument();
  });
  test("entering valid item names fireEvent", () => {
    const itemField = screen.getByPlaceholderText("Item name");

    fireEvent.input(itemField, {
      target: { value: "cheesecake" },
      bubbles: true,
    });

    expect(screen.getByText("cheesecake is valid!")).toBeInTheDocument();
  });
});
