import { render, screen, waitFor, act } from "@testing-library/react";
import TotalCourseCard from "./admin/component/totalCourseCard";
import ax from "./conf/ax";
import dayjs from "dayjs";

// Mock the axios instance
jest.mock("./conf/ax");
jest.mock("dayjs");

describe("TotalCourseCard Month Calculation", () => {
  // Get the current date for the test
  const now = new Date(2025, 1, 25); // February 25, 2025

  jest.spyOn(global, "Date").mockImplementation(() => new Date(now));

  // Mock dayjs to return predictable values
  dayjs.mockImplementation((date) => {
    const dateObj = new Date(date);
    return {
      getMonth: () => dateObj.getMonth() + 1,
      getFullYear: () => dateObj.getFullYear(),
    };
  });

  // Create mock data with various dates
  const mockCourses = {
    data: {
      data: [
        { id: 1, createdAt: new Date(2025, 1, 5).toISOString() }, // February 2025 (current month)
        { id: 2, createdAt: new Date(2025, 1, 15).toISOString() }, // February 2025 (current month)
        { id: 3, createdAt: new Date(2025, 1, 16).toISOString() }, // February 2025 (current month)}
        { id: 4, createdAt: new Date(2025, 0, 10).toISOString() }, // January 2025 (last month)
        { id: 5, createdAt: new Date(2025, 0, 20).toISOString() }, // January 2025 (last month)
        { id: 6, createdAt: new Date(2024, 11, 8).toISOString() }, // December 2024
        { id: 7, createdAt: new Date(2024, 6, 15).toISOString() }, // July 2024
      ],
    },
  };

  // Setup the mock response
  beforeEach(() => {
    ax.get.mockResolvedValue(mockCourses);
  });

  it("should display the correct count for the current month", async () => {
    render(<TotalCourseCard />);
    const monthText = await screen.findByText(/from last month/i);

    // Check the specific span content separately
    const parentElement = monthText.parentElement;
    const spanElement = parentElement.querySelector("span");
    await waitFor(() => {
      expect(screen.getByText("Courses This Month: 3")).toBeInTheDocument();
      expect(spanElement).toHaveTextContent("+1");
    });
  });
});
