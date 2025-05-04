import DropdownBtn from "../components/Dropdown";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("Renders dropdown button based on state input", async () => {
  render(<DropdownBtn dropdownText={"JPY"} setDropdownText={() => null} />);
  // screen.debug()
  expect(screen.getByText("JPY")).toBeInTheDocument();
});

test("Test click functionality of dropdown", async () => {
  render(<DropdownBtn dropdownText={"JPY"} setDropdownText={() => null} />);
  const dropdown = screen.getByTestId("drop-down-button");
  await userEvent.click(dropdown);
  // screen.debug(undefined, Infinity)
  const menuItems = await screen.findAllByRole("menuitem");
  expect(menuItems).toHaveLength(3);
});

test("Test hover functionality of dropdown", async () => {
  render(<DropdownBtn dropdownText={"JPY"} setDropdownText={() => null} />);
  const dropdown = screen.getByTestId("drop-down-button");
  await userEvent.hover(dropdown);
  // screen.debug(undefined, Infinity)
  const menuItems = await screen.findAllByRole("menuitem");
  expect(menuItems).toHaveLength(3);
});
