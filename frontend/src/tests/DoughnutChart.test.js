import DoughnutChart from "../components/chart/DoughnutChart";
import { render, screen } from "@testing-library/react";
import mockData from "./mockData.json";

test("Renders doughnut with no data", async () => {
  render(<DoughnutChart portfolioSum={null} portfolioData={null} />);
  // screen.debug()
  expect(screen.getByText("Portfolio Allocation")).toBeInTheDocument();
});

test("Renders doughnut with data", async () => {
  render(<DoughnutChart portfolioSum={10000000} portfolioData={mockData} />);
  expect(screen.getByText("Portfolio Allocation")).toBeInTheDocument();
  expect(screen.getByText("MockDoughnut")).toBeInTheDocument(); // Mocked canvas in setupTests.js
});
