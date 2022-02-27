const generateItemRow = ({ name, quantity, price}) => {
    return [name, quantity, price, price * quantity].join(",");
}
module.exports = { generateItemRow };