export class InventoryManagment {
    static visit() {
        cy.visit("http:///localhost:8080");
    }

    static addItem(itemName, quantity) {
        cy.get('input[placeholder="Item name"]')
          .clear()
          .type(itemName);
        cy.get('input[placeholder="Quantity"]')
          .clear()
          .type(quantity);
        cy.get('button[type="submit"]')
          .contains("Add to inventory")
          .click();
    }

    static findItemEntry(itemName, quantity) {
        return cy.contains("li", `${itemName} - Quantity: ${quantity}`);
    }

    static undo() {
        return cy
            .get("button")
            .contains("Undo")
            .click();
    }
}