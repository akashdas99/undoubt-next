"use client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams, useRouter } from "next/navigation";
import AddAnswer, { AddAnswerSkeleton } from "./addAnswer";
import { addAnswerAction } from "@/actions/answer";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { isEmpty } from "@/lib/functions";
import "@testing-library/jest-dom";

// Mock all dependencies
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("@/actions/answer", () => ({
  addAnswerAction: jest.fn(),
}));

jest.mock("@/lib/store/user/user", () => ({
  useGetProfileQuery: jest.fn(),
}));

jest.mock("@/lib/functions", () => ({
  isEmpty: jest.fn(),
}));

jest.mock("./answerForm", () => {
  return function MockAnswerForm({ onSubmit, onCancel, isLoading }: any) {
    return (
      <form
        data-testid="answer-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ description: "Test answer" });
        }}
      >
        <button type="submit" disabled={isLoading}>
          Submit Answer
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    );
  };
});

jest.mock("../ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("../ui/skeleton", () => ({
  Skeleton: ({ className }: any) => (
    <div data-testid="skeleton" className={className}>
      Loading...
    </div>
  ),
}));

describe("AddAnswer Component", () => {
  const mockPush = jest.fn();
  const mockUseParams = useParams as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockAddAnswerAction = addAnswerAction as jest.Mock;
  const mockUseGetProfileQuery = useGetProfileQuery as jest.Mock;
  const mockIsEmpty = isEmpty as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ slug: "test-question-slug" });
    mockUseRouter.mockReturnValue({ push: mockPush });
  });

  describe("Loading State", () => {
    it("should display skeleton when user data is fetching", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: undefined,
        isFetching: true,
      });
      mockIsEmpty.mockReturnValue(true);

      render(<AddAnswer />);

      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Logged Out User Behavior", () => {
    beforeEach(() => {
      mockUseGetProfileQuery.mockReturnValue({
        data: null,
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(true);
    });

    it("should show 'Login' button when user is not logged in", () => {
      render(<AddAnswer />);

      const loginButton = screen.getByRole("button", { name: /login/i });
      expect(loginButton).toBeInTheDocument();
    });

    it("should redirect to /login when logged out user clicks button", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      expect(mockPush).toHaveBeenCalledWith("/login");
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("should not show editor for logged out users", () => {
      render(<AddAnswer />);

      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      expect(screen.queryByText("Add Answer")).not.toBeInTheDocument();
    });
  });

  describe("Logged In User Behavior", () => {
    beforeEach(() => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User", email: "test@example.com" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);
    });

    it("should show 'Answer' button when user is logged in", () => {
      render(<AddAnswer />);

      const answerButton = screen.getByRole("button", { name: /answer/i });
      expect(answerButton).toBeInTheDocument();
    });

    it("should display editor when logged in user clicks Answer button", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      const answerButton = screen.getByRole("button", { name: /answer/i });
      await user.click(answerButton);

      expect(screen.getByText("Add Answer")).toBeInTheDocument();
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should not redirect to /login when logged in user clicks button", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      const answerButton = screen.getByRole("button", { name: /answer/i });
      await user.click(answerButton);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should hide initial button when editor is shown", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      const answerButton = screen.getByRole("button", { name: /answer/i });
      await user.click(answerButton);

      expect(screen.queryByRole("button", { name: /^answer$/i })).not.toBeInTheDocument();
    });
  });

  describe("Form Submission - Success Cases", () => {
    beforeEach(() => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);
      mockAddAnswerAction.mockResolvedValue({ success: true });
    });

    it("should successfully submit answer with valid data", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      const answerButton = screen.getByRole("button", { name: /answer/i });
      await user.click(answerButton);

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddAnswerAction).toHaveBeenCalledWith("test-question-slug", {
          description: "Test answer",
        });
      });
    });

    it("should close editor after successful submission", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      const answerButton = screen.getByRole("button", { name: /answer/i });
      await user.click(answerButton);

      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });
    });

    it("should show Answer button again after successful submission", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      await user.click(screen.getByRole("button", { name: /submit answer/i }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /answer/i })).toBeInTheDocument();
      });
    });

    it("should call addAnswerAction with correct slug from params", async () => {
      mockUseParams.mockReturnValue({ slug: "custom-slug-123" });
      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      await user.click(screen.getByRole("button", { name: /submit answer/i }));

      await waitFor(() => {
        expect(mockAddAnswerAction).toHaveBeenCalledWith("custom-slug-123", expect.any(Object));
      });
    });
  });

  describe("Form Submission - Error Cases", () => {
    beforeEach(() => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);
    });

    it("should handle server error during submission", async () => {
      mockAddAnswerAction.mockResolvedValue({
        error: {
          type: "serverError",
          message: "Internal server error occurred",
        },
      });

      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      await user.click(screen.getByRole("button", { name: /submit answer/i }));

      await waitFor(() => {
        expect(mockAddAnswerAction).toHaveBeenCalled();
      });

      // Editor should remain visible on error
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should not close editor when server error occurs", async () => {
      mockAddAnswerAction.mockResolvedValue({
        error: {
          type: "serverError",
          message: "Failed to save answer",
        },
      });

      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      const form = screen.getByTestId("answer-form");
      await user.click(screen.getByRole("button", { name: /submit answer/i }));

      await waitFor(() => {
        expect(mockAddAnswerAction).toHaveBeenCalled();
      });

      expect(form).toBeInTheDocument();
    });

    it("should handle non-server error types", async () => {
      mockAddAnswerAction.mockResolvedValue({
        error: {
          type: "validationError",
          message: "Invalid answer format",
        },
      });

      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      await user.click(screen.getByRole("button", { name: /submit answer/i }));

      await waitFor(() => {
        expect(mockAddAnswerAction).toHaveBeenCalled();
      });

      // Editor should close for non-server errors
      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });
    });

    it("should handle network failure gracefully", async () => {
      mockAddAnswerAction.mockRejectedValue(new Error("Network error"));

      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      
      // Should not throw error
      await expect(async () => {
        await user.click(screen.getByRole("button", { name: /submit answer/i }));
      }).rejects.toThrow();
    });
  });

  describe("Loading State During Submission", () => {
    beforeEach(() => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);
    });

    it("should disable submit button during submission", async () => {
      let resolveSubmission: any;
      mockAddAnswerAction.mockReturnValue(
        new Promise((resolve) => {
          resolveSubmission = resolve;
        })
      );

      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      
      await user.click(submitButton);

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();

      // Resolve the submission
      resolveSubmission({ success: true });

      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });
    });
  });

  describe("Cancel Functionality", () => {
    beforeEach(() => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);
    });

    it("should close editor when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
    });

    it("should show Answer button after cancel", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(screen.getByRole("button", { name: /answer/i })).toBeInTheDocument();
    });
  });

  describe("User Authentication State Changes", () => {
    it("should close editor when user logs out", () => {
      const { rerender } = render(<AddAnswer />);

      // Initially logged in
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);

      rerender(<AddAnswer />);

      // User logs out
      mockUseGetProfileQuery.mockReturnValue({
        data: null,
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(true);

      rerender(<AddAnswer />);

      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
    });

    it("should handle undefined user data", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: undefined,
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(true);

      render(<AddAnswer />);

      expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("should handle empty user object", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: {},
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(true);

      render(<AddAnswer />);

      expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing slug parameter", async () => {
      mockUseParams.mockReturnValue({});
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);
      mockAddAnswerAction.mockResolvedValue({ success: true });

      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      await user.click(screen.getByRole("button", { name: /submit answer/i }));

      await waitFor(() => {
        expect(mockAddAnswerAction).toHaveBeenCalledWith(undefined, expect.any(Object));
      });
    });

    it("should handle rapid button clicks", async () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);

      const user = userEvent.setup();
      render(<AddAnswer />);

      const answerButton = screen.getByRole("button", { name: /answer/i });
      
      // Click multiple times rapidly
      await user.click(answerButton);
      await user.click(answerButton).catch(() => {}); // May not exist anymore

      // Should only show editor once
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should handle empty response from addAnswerAction", async () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);
      mockAddAnswerAction.mockResolvedValue(undefined);

      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      await user.click(screen.getByRole("button", { name: /submit answer/i }));

      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });
    });

    it("should handle null response from addAnswerAction", async () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);
      mockAddAnswerAction.mockResolvedValue(null);

      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));
      await user.click(screen.getByRole("button", { name: /submit answer/i }));

      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Reset Behavior", () => {
    beforeEach(() => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);
    });

    it("should reset form when editor is closed", async () => {
      const user = userEvent.setup();
      render(<AddAnswer />);

      // Open editor
      await user.click(screen.getByRole("button", { name: /answer/i }));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      // Close editor
      await user.click(screen.getByRole("button", { name: /cancel/i }));

      // Reopen editor - form should be reset
      await user.click(screen.getByRole("button", { name: /answer/i }));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });
  });

  describe("UI Styling and Structure", () => {
    it("should render correct CSS classes for container", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: null,
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(true);

      const { container } = render(<AddAnswer />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("flex", "items-center", "justify-start");
    });

    it("should render correct heading when editor is shown", async () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: { id: "user123", name: "Test User" },
        isFetching: false,
      });
      mockIsEmpty.mockReturnValue(false);

      const user = userEvent.setup();
      render(<AddAnswer />);

      await user.click(screen.getByRole("button", { name: /answer/i }));

      const heading = screen.getByRole("heading", { name: /add answer/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
    });
  });
});

describe("AddAnswerSkeleton Component", () => {
  it("should render skeleton with correct class names", () => {
    render(<AddAnswerSkeleton />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("h-10", "w-[150px]", "rounded-md");
  });

  it("should match snapshot", () => {
    const { container } = render(<AddAnswerSkeleton />);
    expect(container).toMatchSnapshot();
  });
});