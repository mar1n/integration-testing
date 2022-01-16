const nock = require("nock");
const fs = require("fs");
const initialHtml = fs.readFileSync("./index.html");
const { screen, getByText, fireEvent } = require("@testing-library/dom");
const { API_ADDR } = require("./inventoryController");

const { clearHistoryHook, detachPopstateHandlers } = require("./testUtils");

beforeEach(clearHistoryHook);

beforeEach(() => localStorage.clear());

beforeEach(async () => {
  document.body.innerHTML = initialHtml;

  jest.resetModules();
  nock(API_ADDR).get("/inventory").replyWithError({ code: 500 });

  await require("./main");

  jest.spyOn(window, "addEventListener");
});

afterEach(detachPopstateHandlers);

afterEach(() => {
  if (!nock.isDone()) {
    nock.cleanAll();
    throw new Error("Not all mocked endpoints received requests.");
  }
});

test("persists items between sessions", async () => {
  nock(API_ADDR)
    .post(/inventory\/.*$/)
    .reply(200);

  nock(API_ADDR).get("/inventory").replyWithError({ code: 500 });

  const itemField = screen.getByPlaceholderText("Item name");
  fireEvent.input(itemField, {
    target: { value: "cheesecake" },
    bubbles: true,
  });

  const quantityField = screen.getByPlaceholderText("Quantity");
  fireEvent.input(quantityField, { target: { value: "6" }, bubbles: true });

  const submitBtn = screen.getByText("Add to inventory");
  fireEvent.click(submitBtn);

  const itemListBefore = document.getElementById("item-list");
  expect(itemListBefore.childNodes).toHaveLength(1);

  expect(
    getByText(itemListBefore, "cheesecake - Quantity: 6")
  ).toBeInTheDocument();

  document.body.innerHTML = initialHtml;
  jest.resetModules();
  await require("./main");

  const itemListAfter = document.getElementById("item-list");
  expect(itemListAfter.childNodes).toHaveLength(1);
  expect(
    getByText(itemListAfter, "cheesecake - Quantity: 6")
  ).toBeInTheDocument();
});

test("adding items through the form", () => {
  nock(API_ADDR)
      .post(/inventory\/.*$/)
      .reply(200);

    const itemField = screen.getByPlaceholderText("Item name");
    const submitBtn = screen.getByText("Add to inventory");
    fireEvent.input(itemField, {
      target: { value: "cheesecake" },
      bubbles: true
    });

    const quantityField = screen.getByPlaceholderText("Quantity");
    fireEvent.input(quantityField, { target: { value: "6" }, bubbles: true });

    fireEvent.click(submitBtn);

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

describe("adding items", () => {
  test("undo to one item ", (done) => {

    nock(API_ADDR)
      .post("/inventory/carrot%20cake")
      .reply(200);

    nock(API_ADDR)
      .post("/inventory/cheesecake")
      .reply(200);
    
    const itemField = screen.getByPlaceholderText("Item name");
    const quantityField = screen.getByPlaceholderText("Quantity");
    const submitBtn = screen.getByText("Add to inventory");

    //Adding a cheesecake
    fireEvent.input(itemField, {
      target: { value: "cheesecake" },
      bubbles: true,
    });
    fireEvent.input(quantityField, {
      target: { value: "6" },
      bubbles: true,
    });
    fireEvent.click(submitBtn);

    fireEvent.input(itemField, {
      target: { value: "carrot cake" },
      bubbles: true,
    });
    fireEvent.input(quantityField, {
      target: { value: "5" },
      bubbles: true,
    });
    fireEvent.click(submitBtn);

    window.addEventListener("popstate", () => {
      const itemList = document.getElementById("item-list");
      expect(itemList.children).toHaveLength(1);
      expect(
        getByText(itemList, "cheesecake - Quantity: 6")
      ).toBeInTheDocument();
      done();
    });

    fireEvent.click(screen.getByText("Undo"));
  });
  test("undo to empty list", (done) => {
    nock(API_ADDR)
      .post(/inventory\/.*$/)
      .reply(200);
    
    const itemField = screen.getByPlaceholderText("Item name");
    const submitBtn = screen.getByText("Add to inventory");
    fireEvent.input(itemField, {
      target: { value: "cheesecake" },
      bubbles: true,
    });

    const quantityField = screen.getByPlaceholderText("Quantity");
    fireEvent.input(quantityField, {
      target: { value: "6" },
      bubbles: true,
    });

    fireEvent.click(submitBtn);

    expect(history.state).toEqual({ inventory: { cheesecake: 6 } });

    window.addEventListener("popstate", () => {
      const itemList = document.getElementById("item-list");
      expect(itemList).toBeEmptyDOMElement();
      done();
    });
    fireEvent.click(screen.getByText("Undo"));
  });
});
