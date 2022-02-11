import React from "react";
import { ItemForm } from "./ItemForm";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { screen } from "@testing-library/dom";

describe('Elements exists in form', () => {
    test('Form containes input field item name, Quantity and button', () => {
        const { getByText, getByPlaceholderText } = render(<ItemForm />);
        expect(getByPlaceholderText("Item name")).toBeInTheDocument();
        expect(getByPlaceholderText("Quantity")).toBeInTheDocument();
        expect(getByText("Add Item")).toBeInTheDocument();
    });
});