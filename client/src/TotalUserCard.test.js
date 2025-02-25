import { render, screen, waitFor } from "@testing-library/react";
import TotalUserCard from "./admin/component/totalUserCard"; // Import your original component
import ax from "./conf/ax"; // Import your axios instance

// Mock the axios instance
jest.mock("./conf/ax");

describe("TotalUserCard", () => {
  beforeEach(() => {
    // Create mock data with various dates
    const mockUsers = [
      { id: 1, createdAt: new Date(2025, 1, 5).toISOString() }, // February 2025
      { id: 2, createdAt: new Date(2025, 1, 15).toISOString() }, // February 2025
      { id: 3, createdAt: new Date(2025, 0, 10).toISOString() }, // January 2025
      { id: 4, createdAt: new Date(2024, 11, 20).toISOString() }, // December 2024
      { id: 5, createdAt: new Date(2024, 9, 8).toISOString() }, // October 2024
      { id: 6, createdAt: new Date(2024, 6, 15).toISOString() }, // July 2024
      { id: 7, createdAt: new Date(2023, 11, 25).toISOString() }, // December 2023
      { id: 8, createdAt: new Date(2023, 5, 12).toISOString() }, // June 2023
      { id: 9, createdAt: new Date(2022, 3, 18).toISOString() }, // April 2022
      { id: 10, createdAt: new Date(2021, 7, 30).toISOString() }, // August 2021
    ];

    // Setup the mock response
    ax.get.mockResolvedValue({ data: mockUsers });
  });

  afterEach(() => {
    // Clear mock between tests
    jest.clearAllMocks();
  });

  test("renders total user count correctly", async () => {
    render(<TotalUserCard />);

    // Wait for the API call and component update
    await waitFor(() => {
      expect(ax.get).toHaveBeenCalledWith("/users");
    });

    // Check for the total count (3 users in our mock data)
    const totalElement = await screen.findByText("3");
    expect(totalElement).toBeInTheDocument();

    // Check for the "Total Users" heading
    expect(screen.getByText("Total Users")).toBeInTheDocument();

    // Check for the change indicator (should show +2 as we have 2 users in current month and 1 in last month)
    const changeText = await screen.findByText(/from last month/i);
    expect(changeText).toBeInTheDocument();
  });

  test("handles API error", async () => {
    // Setup error response
    ax.get.mockRejectedValue(new Error("API error"));

    // Need to mock console.log to prevent error output in tests
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    render(<TotalUserCard />);

    // Wait for the API call
    await waitFor(() => {
      expect(ax.get).toHaveBeenCalledWith("/users");
    });

    // Verify error was logged
    expect(console.log).toHaveBeenCalledWith(
      "This is error",
      expect.any(Error)
    );

    // Restore console.log
    console.log = originalConsoleLog;
  });
});
