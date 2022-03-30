describe("item list updates", () => {
  beforeEach(() => cy.task("emptyInventory"));
  describe("as other users add items", () => {
    it("updates the item list", () => {
      cy.visit("http://localhost:8080");
      cy.wait(2000);
      cy.addItem("cheesecake", 22);
      cy.contains("li", "cheesecake - Quantity: 22");
    });
  });

  it.only("can add items through the form", () => {
      cy.visit("http://localhost:8080");
      cy.get('input[placeholder="Item name"]')
        .type("cheesecake");
      cy.get('input[placeholder="Quantity"]')
        .type("10");
      cy.get('button[type="submit"]')
        .contains("Add to inventory")
        .click();

    cy.contains("li", "cheesecake - Quantity: 10");
    console.log("Logged, but the test is still running");
  })
});
