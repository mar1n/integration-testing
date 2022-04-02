import { InventoryManagement } from "../pageObjects/inventoryManagement";

describe("item list updates", () => {
  beforeEach(() => cy.task("emptyInventory"));
  describe("as other users add items", () => {
    it("updates the item list", () => {
      cy.server()
        .route("http://localhost:3000/inventory")
        .as("inventoryRequest");
      cy.visit("http://localhost:8080");
      cy.wait("@inventoryRequest");
      cy.addItem("cheesecake", 22);
      InventoryManagement.findItemEntry("cheesecake", "22");
    });
  });

  it("can add items through the form", () => {
      InventoryManagement.visit();
      InventoryManagement.addItem("cheesecake", "10")
      InventoryManagement.findItemEntry("cheesecake", "10")
  })
});
