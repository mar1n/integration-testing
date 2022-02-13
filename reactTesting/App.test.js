import React from "react";
import { App } from "./App.jsx";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { screen } from "@testing-library/dom";
import nock from "nock";
import { API_ADDR } from "./constants.js";

beforeEach(() => {
  nock(API_ADDR)
    .get("/inventory")
    .reply(200, { cheesecake: 2, croissant: 5, macaroon: 96 });
});

afterEach(() => {
  if (!nock.isDone()) {
    nock.cleanAll();
    throw new Error("Not all mocked endpoints received requests.");
  }
});

test("renders the approprate header", () => {
  act(() => {
    render(<App />);
  });
  expect(screen.getByText("Inventory Contents")).toBeInTheDocument();
});

test("rendering the server's list of items", async () => {
  const { findByText } = render(<App />);

  expect(await findByText("cheesecake - Quantity: 2")).toBeInTheDocument();
  expect(await findByText("croissant - Quantity: 5")).toBeInTheDocument();
  expect(await findByText("macaroon - Quantity: 96")).toBeInTheDocument();

  const listElement = document.querySelector("ul");
  expect(listElement.childElementCount).toBe(3);
});
