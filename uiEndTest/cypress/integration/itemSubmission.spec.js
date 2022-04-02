import { InventoryManagement } from "../pageObjects/inventoryManagement";

describe("item submission", () => {
  beforeEach(() => cy.task("emptyInventory"));

  it("can add items through the form", () => {
    InventoryManagement.visit();
    InventoryManagement.addItem("cheesecake", "10");
    InventoryManagement.findItemEntry("cheesecake", 10);
  });

  it("contains the correct fields and a submission button", () => {
    InventoryManagement.visit();
    InventoryManagement.addItem("cheesecake", "10");
    InventoryManagement.findItemEntry("cheesecake", "10");
  });

  it("can undo submitted items", () => {
    InventoryManagement.visit();
    cy.wait(1000);
    cy.window().then(
      ({ handleAddItem }) => handleAddItem("cheesecake", "10")
    );
    cy.wait(1000);
    cy.window().then(
      ({ handleAddItem }) => handleAddItem("cheesecake", "5")
    );
    cy.wait(1000);
    
    InventoryManagement.undo();
    InventoryManagement.findItemEntry("cheesecake", "10");
    // InventoryManagement.addItem("cheesecake", "10");
    // InventoryManagement.addItem("cheesecake", "5");
    // InventoryManagement.undo();
    // InventoryManagement.findItemEntry("cheesecake", "10");
  });

  it("saves each submission to the action log", () => {
    InventoryManagement.visit();
    InventoryManagement.addItem("cheesecake", "10");
    InventoryManagement.addItem("cheesecake", "5");
    InventoryManagement.undo();
    InventoryManagement.findItemEntry("cheesecake", "10");
    InventoryManagement.findAction({});
    InventoryManagement.findAction({ cheesecake: 10 }).should("have.length", 2);
    InventoryManagement.findAction({ cheesecake: 15 });
  });
  describe("given a user enters an invalid item name", () => {
    it("disables the form's submission button", () => {
      InventoryManagement.visit();
      InventoryManagement.enterItemName("boat");
      InventoryManagement.enterQuantity(10);
      InventoryManagement.getSubmitButton().should("be.disabled");
    });
  });
});

describe("update items in inventory", () => {
  beforeEach(() => {
    cy.task("emptyInventory");
    cy.task("insertRecord");
  });
  it("update inventory", () => {
    InventoryManagement.visit();
    InventoryManagement.addItem("cheesecake", "10");
    InventoryManagement.findAction({ cheesecake: 20});
  });
});
