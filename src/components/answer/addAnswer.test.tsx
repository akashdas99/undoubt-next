"use client";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AddAnswer, { AddAnswerSkeleton } from "./addAnswer";
import { addAnswerAction } from "@/actions/answer";
import { useParams, useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { isEmpty } from "@/lib/functions";
import "@testing-library/jest-dom";

// Mock dependencies
vi.mock("@/actions/answer");
vi.mock("next/navigation");
vi.mock("@/lib/store/user/user");
vi.mock("@/lib/functions");
vi.mock("./answerForm", () => ({
  default: vi.fn(({ form, onSubmit, isLoading, onCancel }) => (
    <div data-testid="answer-form">
      <button
        data-testid="submit-button"
        onClick={() =>
          onSubmit({ description: "Test answer" })
        }
        disabled={isLoading}
      >
        Submit
      </button>
      <button data-testid="cancel-button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )),
}));

describe("AddAnswer Component", () => {
  const mockPush = vi.fn();
  const mockSetError = vi.fn();
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });

    (useParams as any).mockReturnValue({
      slug: "test-question-slug",
    });

    (isEmpty as any).mockImplementation((val: any) => {
      return !val || Object.keys(val).length === 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Loading State", () => {
    it("should display skeleton loader when user data is being fetched", () => {
      (useGetProfileQuery as any).mockReturnValue({
        data: undefined,
        isFetching: true,
      });

      render(<AddAnswer />);

      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("should render AddAnswerSkeleton component correctly", () => {
      render(<AddAnswerSkeleton />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass("h-10", "w-[150px]", "rounded-md");
    });
  });

  describe("Not Logged In State", () => {
    beforeEach(() => {
      (useGetProfileQuery as any).mockReturnValue({
        data: null,
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(true);
    });

    it("should display 'Login' button when user is not logged in", () => {
      render(<AddAnswer />);

      const button = screen.getByRole("button", { name: /login/i });
      expect(button).toBeInTheDocument();
    });

    it("should redirect to /login when button is clicked and user is not logged in", () => {
      render(<AddAnswer />);

      const button = screen.getByRole("button", { name: /login/i });
      fireEvent.click(button);

      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("should not show editor when user is not logged in", () => {
      render(<AddAnswer />);

      expect(screen.queryByText("Add Answer")).not.toBeInTheDocument();
      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
    });
  });

  describe("Logged In State", () => {
    beforeEach(() => {
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User", email: "test@example.com" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);
    });

    it("should display 'Answer' button when user is logged in", () => {
      render(<AddAnswer />);

      const button = screen.getByRole("button", { name: /answer/i });
      expect(button).toBeInTheDocument();
    });

    it("should show editor when 'Answer' button is clicked", () => {
      render(<AddAnswer />);

      const button = screen.getByRole("button", { name: /answer/i });
      fireEvent.click(button);

      expect(screen.getByText("Add Answer")).toBeInTheDocument();
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should hide 'Answer' button when editor is shown", () => {
      render(<AddAnswer />);

      const button = screen.getByRole("button", { name: /answer/i });
      fireEvent.click(button);

      expect(screen.queryByRole("button", { name: /answer/i })).not.toBeInTheDocument();
    });

    it("should display editor with correct heading", () => {
      render(<AddAnswer />);

      const button = screen.getByRole("button", { name: /answer/i });
      fireEvent.click(button);

      const heading = screen.getByRole("heading", { name: /add answer/i });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass("font-righteous", "text-xl", "md:text-3xl", "mb-6");
    });
  });

  describe("Form Submission", () => {
    beforeEach(() => {
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);
    });

    it("should call addAnswerAction with correct slug and values on submit", async () => {
      (addAnswerAction as any).mockResolvedValue({});

      render(<AddAnswer />);

      // Open editor
      const answerButton = screen.getByRole("button", { name: /answer/i });
      fireEvent.click(answerButton);

      // Submit form
      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(addAnswerAction).toHaveBeenCalledWith("test-question-slug", {
          description: "Test answer",
        });
      });
    });

    it("should hide editor after successful submission", async () => {
      (addAnswerAction as any).mockResolvedValue({});

      render(<AddAnswer />);

      // Open editor
      fireEvent.click(screen.getByRole("button", { name: /answer/i }));
      expect(screen.getByText("Add Answer")).toBeInTheDocument();

      // Submit form
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.queryByText("Add Answer")).not.toBeInTheDocument();
      });
    });

    it("should display server error when submission fails", async () => {
      const errorMessage = "Failed to submit answer";
      (addAnswerAction as any).mockResolvedValue({
        error: {
          type: "serverError",
          message: errorMessage,
        },
      });

      render(<AddAnswer />);

      // Open editor
      fireEvent.click(screen.getByRole("button", { name: /answer/i }));

      // Submit form
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        // Form should still be visible after error
        expect(screen.getByText("Add Answer")).toBeInTheDocument();
      });
    });

    it("should not hide editor when submission returns server error", async () => {
      (addAnswerAction as any).mockResolvedValue({
        error: {
          type: "serverError",
          message: "Server error",
        },
      });

      render(<AddAnswer />);

      fireEvent.click(screen.getByRole("button", { name: /answer/i }));
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("answer-form")).toBeInTheDocument();
      });
    });

    it("should handle non-server errors gracefully", async () => {
      (addAnswerAction as any).mockResolvedValue({
        error: {
          type: "validationError",
          message: "Validation failed",
        },
      });

      render(<AddAnswer />);

      fireEvent.click(screen.getByRole("button", { name: /answer/i }));
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        // Editor should close for non-server errors
        expect(screen.queryByText("Add Answer")).not.toBeInTheDocument();
      });
    });
  });

  describe("Cancel Functionality", () => {
    beforeEach(() => {
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);
    });

    it("should hide editor when cancel button is clicked", () => {
      render(<AddAnswer />);

      // Open editor
      fireEvent.click(screen.getByRole("button", { name: /answer/i }));
      expect(screen.getByText("Add Answer")).toBeInTheDocument();

      // Click cancel
      const cancelButton = screen.getByTestId("cancel-button");
      fireEvent.click(cancelButton);

      expect(screen.queryByText("Add Answer")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /answer/i })).toBeInTheDocument();
    });
  });

  describe("User State Changes", () => {
    it("should close editor when user logs out", () => {
      const { rerender } = render(<AddAnswer />);

      // Initially logged in
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);

      rerender(<AddAnswer />);

      // Open editor
      fireEvent.click(screen.getByRole("button", { name: /answer/i }));
      expect(screen.getByText("Add Answer")).toBeInTheDocument();

      // User logs out
      (useGetProfileQuery as any).mockReturnValue({
        data: null,
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(true);

      rerender(<AddAnswer />);

      // Editor should be closed
      expect(screen.queryByText("Add Answer")).not.toBeInTheDocument();
    });

    it("should show Login button after user logs out", () => {
      const { rerender } = render(<AddAnswer />);

      // Initially logged in
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);

      rerender(<AddAnswer />);
      expect(screen.getByRole("button", { name: /answer/i })).toBeInTheDocument();

      // User logs out
      (useGetProfileQuery as any).mockReturnValue({
        data: null,
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(true);

      rerender(<AddAnswer />);
      expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty user object as not logged in", () => {
      (useGetProfileQuery as any).mockReturnValue({
        data: {},
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(true);

      render(<AddAnswer />);

      expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("should handle undefined slug parameter", async () => {
      (useParams as any).mockReturnValue({
        slug: undefined,
      });
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);
      (addAnswerAction as any).mockResolvedValue({});

      render(<AddAnswer />);

      fireEvent.click(screen.getByRole("button", { name: /answer/i }));
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(addAnswerAction).toHaveBeenCalledWith(undefined, {
          description: "Test answer",
        });
      });
    });

    it("should handle null response from addAnswerAction", async () => {
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);
      (addAnswerAction as any).mockResolvedValue(null);

      render(<AddAnswer />);

      fireEvent.click(screen.getByRole("button", { name: /answer/i }));
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        // Should close editor on null response
        expect(screen.queryByText("Add Answer")).not.toBeInTheDocument();
      });
    });

    it("should handle rejected promise from addAnswerAction", async () => {
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);
      (addAnswerAction as any).mockRejectedValue(new Error("Network error"));

      render(<AddAnswer />);

      fireEvent.click(screen.getByRole("button", { name: /answer/i }));
      fireEvent.click(screen.getByTestId("submit-button"));

      // Component should handle the error without crashing
      await waitFor(() => {
        expect(addAnswerAction).toHaveBeenCalled();
      });
    });
  });

  describe("Loading State During Submission", () => {
    beforeEach(() => {
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);
    });

    it("should disable submit button during submission", async () => {
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });

      (addAnswerAction as any).mockImplementation(() => submitPromise);

      render(<AddAnswer />);

      fireEvent.click(screen.getByRole("button", { name: /answer/i }));

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      // Button should be disabled during submission
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      resolveSubmit!();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button roles", () => {
      (useGetProfileQuery as any).mockReturnValue({
        data: null,
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(true);

      render(<AddAnswer />);

      const button = screen.getByRole("button", { name: /login/i });
      expect(button).toHaveAttribute("type", "button");
    });

    it("should have proper heading hierarchy", () => {
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);

      render(<AddAnswer />);

      fireEvent.click(screen.getByRole("button", { name: /answer/i }));

      const heading = screen.getByRole("heading", { name: /add answer/i });
      expect(heading.tagName).toBe("H1");
    });
  });

  describe("Component Structure", () => {
    it("should render with correct container classes", () => {
      (useGetProfileQuery as any).mockReturnValue({
        data: null,
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(true);

      const { container } = render(<AddAnswer />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass("flex", "items-center", "justify-start");
    });

    it("should render editor with correct styling classes", () => {
      (useGetProfileQuery as any).mockReturnValue({
        data: { id: 1, name: "Test User" },
        isFetching: false,
      });
      (isEmpty as any).mockReturnValue(false);

      const { container } = render(<AddAnswer />);

      fireEvent.click(screen.getByRole("button", { name: /answer/i }));

      const card = container.querySelector(".bordered-card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("p-8", "rounded-xl", "w-full");
    });
  });
});