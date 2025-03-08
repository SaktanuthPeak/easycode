import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Teacher from "./teacher";
import ax from "../../conf/ax";
import { MemoryRouter } from "react-router-dom";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock axios
jest.mock("../../conf/ax", () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("Teacher Component", () => {
  const mockTeachers = [
    {
      id: 1,
      documentId: "teacher1",
      users_permissions_user: {
        email: "teacher1@example.com",
        firstname: "John",
        lastname: "Doe",
      },
      courses: [{ Course_name: "Math" }, { Course_name: "Science" }],
    },
    {
      id: 2,
      documentId: "teacher2",
      users_permissions_user: {
        email: "teacher2@example.com",
        firstname: "Jane",
        lastname: "Smith",
      },
      courses: [{ Course_name: "History" }],
    },
    {
      id: 3,
      documentId: "teacher3",
      users_permissions_user: {
        email: "teacher3@example.com",
        firstname: "Robert",
        lastname: "Johnson",
      },
      courses: [{ Course_name: "English" }],
    },
  ];

  const mockCourses = [
    { id: 1, Course_name: "Math" },
    { id: 2, Course_name: "Science" },
    { id: 3, Course_name: "History" },
    { id: 4, Course_name: "English" },
  ];

  beforeEach(() => {
    // Reset mock implementation before each test
    jest.clearAllMocks();

    // Setup default mock responses
    ax.get.mockImplementation((url) => {
      if (url.includes("/instructors")) {
        return Promise.resolve({ data: { data: mockTeachers } });
      } else if (url.includes("/courses")) {
        return Promise.resolve({ data: { data: mockCourses } });
      }
      return Promise.reject(new Error("Not found"));
    });
  });

  test("renders the search field", async () => {
    render(
      <MemoryRouter>
        <Teacher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/ค้นหาครู/i)).toBeInTheDocument();
    });
  });

  test("loads and displays teachers on initial render", async () => {
    render(
      <MemoryRouter>
        <Teacher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ax.get).toHaveBeenCalledWith(
        expect.stringContaining("/instructors")
      );
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("Robert")).toBeInTheDocument();
    });
  });

  test("filters teachers by email when searching", async () => {
    render(
      <MemoryRouter>
        <Teacher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(/ค้นหาครู/i);
    fireEvent.change(searchInput, { target: { value: "teacher1" } });

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.queryByText("Jane")).not.toBeInTheDocument();
      expect(screen.queryByText("Robert")).not.toBeInTheDocument();
    });
  });

  test("filters teachers by firstname when searching", async () => {
    render(
      <MemoryRouter>
        <Teacher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBe(4); // 3 teachers + header row
    });

    const searchInput = screen.getByLabelText(/ค้นหาครู/i);
    fireEvent.change(searchInput, { target: { value: "jane" } });

    await waitFor(() => {
      expect(screen.queryByText("John")).not.toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.queryByText("Robert")).not.toBeInTheDocument();
    });
  });

  test("filters teachers by lastname when searching", async () => {
    render(
      <MemoryRouter>
        <Teacher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBe(4); // 3 teachers + header row
    });

    const searchInput = screen.getByLabelText(/ค้นหาครู/i);
    fireEvent.change(searchInput, { target: { value: "johnson" } });

    await waitFor(() => {
      expect(screen.queryByText("John")).not.toBeInTheDocument();
      expect(screen.queryByText("Jane")).not.toBeInTheDocument();
      expect(screen.getByText("Robert")).toBeInTheDocument();
    });
  });

  test("shows all teachers when search field is cleared", async () => {
    render(
      <MemoryRouter>
        <Teacher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBe(4); // 3 teachers + header row
    });

    const searchInput = screen.getByLabelText(/ค้นหาครู/i);

    // First filter
    fireEvent.change(searchInput, { target: { value: "john" } });

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.queryByText("Jane")).not.toBeInTheDocument();
    });

    // Then clear
    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("Robert")).toBeInTheDocument();
    });
  });

  test("handles case-insensitive search", async () => {
    render(
      <MemoryRouter>
        <Teacher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBe(4); // 3 teachers + header row
    });

    const searchInput = screen.getByLabelText(/ค้นหาครู/i);

    // Test uppercase search term
    fireEvent.change(searchInput, { target: { value: "JOHN" } });

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.queryByText("Jane")).not.toBeInTheDocument();
    });
  });

  test("handles partial search terms", async () => {
    render(
      <MemoryRouter>
        <Teacher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBe(4); // 3 teachers + header row
    });

    const searchInput = screen.getByLabelText(/ค้นหาครู/i);

    // Test partial search term
    fireEvent.change(searchInput, { target: { value: "oh" } });

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.queryByText("Jane")).not.toBeInTheDocument();
    });
  });

  test("shows no results message when no matches are found", async () => {
    // Customize the implementation to return empty array for this test
    ax.get.mockImplementation((url) => {
      if (url.includes("/instructors")) {
        return Promise.resolve({ data: { data: mockTeachers } });
      } else if (url.includes("/courses")) {
        return Promise.resolve({ data: { data: mockCourses } });
      }
      return Promise.reject(new Error("Not found"));
    });

    render(
      <MemoryRouter>
        <Teacher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBe(4); // 3 teachers + header row
    });

    const searchInput = screen.getByLabelText(/ค้นหาครู/i);

    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    await waitFor(() => {
      expect(screen.queryByText("John")).not.toBeInTheDocument();
      expect(screen.queryByText("Jane")).not.toBeInTheDocument();
      expect(screen.queryByText("Robert")).not.toBeInTheDocument();
      // The table should still be there but with no data rows
      expect(screen.getAllByRole("row").length).toBe(1); // Only header row
    });
  });
});
