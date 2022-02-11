import React from "react";

export const ItemForm = () => {
    const [itemName, setItemName] = React.useState("");
    const [quantity, setQuantity] = React.useState(0);

    const onSubmit = (e) => {
        e.preventDefault();

    }

    return(
        <form id="form-cheesecake" onSubmit={onSubmit}>
            <input type="text" onChange={e => setItemName(e.target.value)} placeholder="Item name" />
            <input type="text" onChange={e => setQuantity(parseInt(e.target.value, 10))} placeholder="Quantity" />
            <button type="submit">Add Item</button>
        </form>
    )
}