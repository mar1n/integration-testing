describe("item submission", () => {
  beforeEach(() => cy.task("emptyInventory"));
  it("contains the correct fields and a submission button", () => {
    cy.visit("http://localhost:8080");
    cy.get('input[placeholder="Item name"]').type("cheesecake");
    cy.get('input[placeholder="Quantity"]').type("10");
    cy.get('button[type="submit"]').contains("Add to inventory").click();
    cy.contains("li", "cheesecake - Quantity: 10");
  });
});
