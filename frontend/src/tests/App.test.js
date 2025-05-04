import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("Renders the page with no data", async () => {
  render(<App />);
  const titleElement = screen.getByText(/Your Portfolio/i);
  const userElement = screen.getAllByText(/Lydia Ong/i);
  const cardTitles = [
    "Portfolio Allocation",
    "Summary",
    "Investment Growth",
    "Holdings",
  ];
  for (const title of cardTitles) {
    const element = await screen.findByText((content) =>
      content.includes(title),
    );
    expect(element).toBeInTheDocument();
  }

  expect(titleElement).toBeInTheDocument();
  expect(userElement.length).toBe(2);
});

test("Renders the page change dropdown option", async () => {
  render(<App />);
  const dropdown = screen.getByTestId("drop-down-button");
  await userEvent.click(dropdown);
  // screen.debug(undefined, Infinity)
  const menuItems = await screen.findAllByRole("menuitem");
  expect(menuItems).toHaveLength(3);
});

test("Renders the page change dropdown option to usd", async () => {
  render(<App />);
  const dropdown = screen.getByTestId("drop-down-button");
  await userEvent.click(dropdown);
  // screen.debug(undefined, Infinity)
  const menuItems = await screen.findAllByRole("menuitem");
  await userEvent.click(menuItems[2]); // this clicks on the usd currency
  const usdTextElement = screen.getAllByText(/USD/i);
  expect(usdTextElement).toHaveLength(5);
});
