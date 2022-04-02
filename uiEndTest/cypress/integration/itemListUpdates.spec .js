import { InventoryManagement } from "../pageObjects/inventoryManagement";

describe("item list updates", () => {
  beforeEach(() => cy.task("emptyInventory"));
  describe("as other users add items", () => {
    it("updates the item list", () => {
      InventoryManagement.visit();
      cy.wait(2000);
      InventoryManagement.addItem("cheesecake", "22");
      InventoryManagement.findItemEntry("cheesecake", "22");
    });
  });

  it("can add items through the form", () => {
      InventoryManagement.visit();
      InventoryManagement.addItem("cheesecake", "10")
      InventoryManagement.findItemEntry("cheesecake", "10")
  })
});
