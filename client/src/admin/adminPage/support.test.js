import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Support from "./support";
import ax from "../../conf/ax";


jest.mock("../../conf/ax", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("ตรวจสอบองค์ประกอบของหน้า support.js", () => {
  const renderComponent = () =>
    render(
      <Router>
        <Support />
      </Router>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    ax.get.mockResolvedValue({
      data: {
        messages: [
          { id: 1, message: "This is the first message" },
          { id: 2, message: "Another message from user 2" },
        ],
      },
    });
    ax.post.mockResolvedValue({});
  });

  test("ตรวจสอบการ render หน้านี้", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Chats/i)).toBeInTheDocument();
    });
  });

  test("ตรวจสอบการแสดงผลข้อความจาก API", async () => {
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getByText(/Select a user to view messages/i)
      ).toBeInTheDocument();
    });
  });

  test("ตรวจสอบการเปิด modal เมื่อกดปุ่ม 'Send Message'", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Send Message/i));

    await waitFor(() => {
      expect(screen.getByText("Send Message")).toBeInTheDocument();
    });
  });

  test("ตรวจสอบการยกเลิกการส่งข้อความ", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Send Message/i));

    await waitFor(() => {
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText(/Cancel/i));

    await waitFor(() => {
      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
    });
  });
});
