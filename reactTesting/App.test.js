import React from "react";
import { App } from "./App.jsx";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import { screen } from "@testing-library/dom";

const root = document.createElement("div");
document.body.appendChild(root);

test('renders the approprate header', () => {
    act(() => {
        render(<App />, root);
    });
    expect(screen.getByText("Inventory Contents")).toBeTruthy();
});