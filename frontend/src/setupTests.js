// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import "jest-canvas-mock";
import { Doughnut, Line } from "react-chartjs-2";

fetchMock.enableMocks();
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});
jest.mock("react-chartjs-2", () => ({
  Doughnut: () => "MockDoughnut",
  Line: () => null,
}));
