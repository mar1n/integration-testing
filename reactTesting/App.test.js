import React from "react";
import { App } from "./App.jsx";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import { screen, fireEvent } from "@testing-library/dom";

const root = document.createElement("div");
document.body.appendChild(root);

test('renders the approprate header', () => {
    act(() => {
        render(<App />, root);
    });
    expect(screen.getByText("Cheesecakes: 0")).toBeInTheDocument();

    const addCheesecakeBtn = screen.getByText("Add Cheesecake");
    act(() => {
        fireEvent.click(addCheesecakeBtn);
    });
    expect(screen.getByText("Cheesecakes: 1")).toBeInTheDocument();
});