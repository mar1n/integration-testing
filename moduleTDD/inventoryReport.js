const generateItemRow = ({ name, quantity, price}) => {
    if(quantity === 0 || price === 0) return null;
    return [name, quantity, price, price * quantity].join(",");
};

const generateTotalRow = items => {
    const total = items.reduce(
        (t, { price, quantity }) => t + price * quantity, 0
    );
    return "Total,,," + total;
};

const createInventoryValuesReport = items => {
    const itemRows = items.map(generateItemRow).join("\n");
    const totalRow = generateTotalRow(items);
    return itemRows + "\n" + totalRow;
}

module.exports = { generateItemRow, generateTotalRow, createInventoryValuesReport };