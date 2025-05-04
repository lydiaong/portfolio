import { render, screen } from "@testing-library/react";
import AppTable from "../components/Table";
import mockData from "./mockData.json";

test("Renders table component with no data", async () => {
  render(<AppTable currency={"SGD"} portfolioData={null} />);
  const tableCols = [
    "Mutual Fund",
    "Ticker",
    "Position (10K)",
    "Purchase Price",
    "Last Price",
    "Current Market Value (M)",
  ];
  tableCols.forEach((col) => {
    const element = screen.getByText((content) => content.includes(col));
    expect(element).toBeInTheDocument();
  });
});

test("Renders table component with data", async () => {
  render(<AppTable currency={"SGD"} portfolioData={mockData} />);
  // screen.debug()
  const tableCols = [
    "Mutual Fund",
    "Ticker",
    "Position (10K)",
    "Purchase Price",
    "Last Price",
    "Current Market Value (M)",
  ];
  tableCols.forEach((col) => {
    const element = screen.getByText((content) => content.includes(col));
    expect(element).toBeInTheDocument();
  });

  const fundNames = mockData.map((dat) => dat.shortname);
  fundNames.forEach((fund) => {
    const element = screen.getByText(fund);
    expect(element).toBeInTheDocument();
  });

  const securityNames = mockData.map((dat) => dat.security);
  securityNames.forEach((sec) => {
    const element = screen.getByText(sec);
    expect(element).toBeInTheDocument();
  });

  const totalMktValue = mockData.map((dat) => dat.total_market_value);
  totalMktValue.forEach((val) => {
    const element = screen.queryByText(val.toString());
    expect(element).not.toBeInTheDocument();
  });
});
