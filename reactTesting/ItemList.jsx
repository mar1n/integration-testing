import React from "react";

export const generateItemText = (itemName, quantity) => {
  return `${itemName} - Quantity: ${quantity}`;
};

export const ItemList = ({ itemList }) => {
  return (
    <ul>
      {Object.entries(itemList).map(([itemName, quantity]) => {
        return (
          <li key={itemName}>
            {generateItemText(itemName, quantity)}
          </li>
        );
      })}
    </ul>
  );
};
