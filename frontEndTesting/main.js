const { handleAddItem, checkFormValues, updateItemList, handleUndo, handlePopstate } = require("./domController");
const { API_ADDR, data } = require("./inventoryController");

const form = document.getElementById("add-item-form");
form.addEventListener("submit", handleAddItem);
form.addEventListener("input", checkFormValues);

const undoButton = document.getElementById("undo-button");
undoButton.addEventListener("click", handleUndo);

window.addEventListener("popstate", handlePopstate);

checkFormValues();

const loadInitialData = async () => {
    try {
        const inventoryResponse = await fetch(`${API_ADDR}/inventory`);
        if(inventoryResponse.status === 500) throw new Error();
        data.inventory = await inventoryResponse.json();
        return updateItemList(data.inventory);
    } catch(e) {
        const storedInventory = JSON.parse(
            localStorage.getItem("inventory")
        );

        if(storedInventory) {
            data.inventory = storedInventory;
            updateItemList(data.inventory);
        }
    }
}

module.exports = loadInitialData();


