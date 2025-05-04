import LineChart from "../components/chart/LineChart";
import { render, screen } from "@testing-library/react";

test("Renders line chart", async () => {
  render(<LineChart currency={"SGD"} />);
  // screen.debug()
  expect(screen.getByText("Investment Growth (SGD)")).toBeInTheDocument();
});
