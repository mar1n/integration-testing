import { InventoryManagment } from "../pageObjects/inventoryManagement";

describe("item submission", () => {
  beforeEach(() => cy.task("emptyInventory"));

  it("can add items through the form", () => {
    InventoryManagment.visit();
    InventoryManagment.addItem("cheesecake", "10");
    InventoryManagment.findItemEntry("cheesecake", 10);
  });

  it("contains the correct fields and a submission button", () => {
    cy.visit("http://localhost:8080");
    cy.get('input[placeholder="Item name"]').type("cheesecake");
    cy.get('input[placeholder="Quantity"]').type("10");
    cy.get('button[type="submit"]').contains("Add to inventory").click();
    cy.contains("li", "cheesecake - Quantity: 10");
  });

  it("can undo submitted items", () => {
    InventoryManagment.visit();
    InventoryManagment.addItem("cheesecake", "10");
    InventoryManagment.addItem("cheesecake", "5");
    InventoryManagment.undo();
    InventoryManagment.findItemEntry("cheesecake", "10");
  });

  it("saves each submission to the action log", () => {
    InventoryManagment.visit();
    InventoryManagment.addItem("cheesecake", "10");
    InventoryManagment.addItem("cheesecake", "5");
    InventoryManagment.undo();
    InventoryManagment.findItemEntry("cheesecake", "10");
    InventoryManagment.findAction({});
    InventoryManagment.findAction({ cheesecake: 10 }).should("have.length", 2);
    InventoryManagment.findAction({ cheesecake: 15 });
  });
  describe("given a user enters an invalid item name", () => {
    it("disables the form's submission button", () => {
      InventoryManagment.visit();
      InventoryManagment.enterItemName("boat");
      InventoryManagment.enterQuantity(10);
      InventoryManagment.getSubmitButton().should("be.disabled");
    });
  });
});

describe("update items in inventory", () => {
  beforeEach(() => {
    cy.task("emptyInventory");
    cy.task("insertRecord");
  });
  it("update inventory", () => {
    cy.visit("http://localhost:8080");
    cy.get('input[placeholder="Item name"]').type("cheesecake");
    cy.get('input[placeholder="Quantity"]').type("10");
    cy.get('button[type="submit"]').contains("Add to inventory").click();

    cy.get("p")
      .then((p) => {
        return Array.from(p).filter((p) => {
          return p.innerText.includes(
            'The inventory has been updated - {"cheesecake":20}'
          );
        });
      })
      .should("have.length", 1);
  });
});
