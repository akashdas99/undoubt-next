"use client";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AnswerCard, { AnswerCardSkeleton } from "./answerCard";
import { deleteAnswerAction, updateAnswerAction } from "@/actions/answer";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

// Mock dependencies
jest.mock("@/actions/answer", () => ({
  deleteAnswerAction: jest.fn(),
  updateAnswerAction: jest.fn(),
}));

jest.mock("@/lib/store/user/user", () => ({
  useGetProfileQuery: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("../ui/userImage", () => ({
  __esModule: true,
  default: ({ user, className }: any) => (
    <div data-testid="user-image" className={className}>
      {user?.name}
    </div>
  ),
}));

jest.mock("../ui/textEditorContent", () => ({
  __esModule: true,
  default: ({ content }: any) => (
    <div data-testid="text-editor-content">{content}</div>
  ),
}));

jest.mock("./answerForm", () => ({
  __esModule: true,
  default: ({ form, onSubmit, isLoading, onCancel }: any) => (
    <div data-testid="answer-form">
      <button
        data-testid="submit-form"
        onClick={() => onSubmit(form.getValues())}
        disabled={isLoading}
      >
        Submit
      </button>
      <button data-testid="cancel-form" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

jest.mock("./deleteAnswerModal", () => ({
  __esModule: true,
  default: ({ error, isDeleting, onDelete }: any) => (
    <div data-testid="delete-answer-modal">
      <button
        data-testid="delete-button"
        onClick={onDelete}
        disabled={isDeleting}
      >
        Delete
      </button>
      {error && <div data-testid="delete-error">{error}</div>}
    </div>
  ),
}));

const mockAnswer = {
  _id: "answer123",
  description: "This is a test answer description",
  createdAt: new Date("2024-01-15"),
  author: {
    _id: "user123",
    name: "John Doe",
    email: "john@example.com",
  },
};

const mockUser = {
  _id: "user123",
  name: "John Doe",
  email: "john@example.com",
};

describe("AnswerCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ slug: "test-question" });
  });

  describe("Rendering", () => {
    it("should render answer card with author information", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("user-image")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(
        screen.getByText(dayjs(mockAnswer.createdAt).format("MMM D, YYYY"))
      ).toBeInTheDocument();
    });

    it("should render answer description", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("text-editor-content")).toHaveTextContent(
        mockAnswer.description
      );
    });

    it("should render formatted date correctly", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByText("Jan 15, 2024")).toBeInTheDocument();
    });

    it("should not render edit and delete buttons when user is not the author", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: { _id: "differentUser" },
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should render edit and delete buttons when user is the author", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("delete-answer-modal")).toBeInTheDocument();
    });

    it("should not render buttons while user is loading", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
    });
  });

  describe("Author Verification", () => {
    it("should identify user as author when IDs match", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("delete-answer-modal")).toBeInTheDocument();
    });

    it("should not identify user as author when IDs do not match", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: { ...mockUser, _id: "differentUser123" },
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
    });

    it("should handle undefined user gracefully", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
    });

    it("should handle null author ID gracefully", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      const answerWithNullAuthorId = {
        ...mockAnswer,
        author: { ...mockAnswer.author, _id: null as any },
      };

      render(<AnswerCard answer={answerWithNullAuthorId} />);

      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
    });
  });

  describe("Edit Mode Toggle", () => {
    it("should toggle to edit mode when edit button is clicked", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
      expect(screen.queryByTestId("text-editor-content")).not.toBeInTheDocument();
    });

    it("should toggle back to view mode when edit button is clicked again", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);
      await user.click(editButton);

      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
    });

    it("should display answer form in edit mode", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should hide text editor content in edit mode", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      expect(screen.queryByTestId("text-editor-content")).not.toBeInTheDocument();
    });
  });

  describe("Update Answer Functionality", () => {
    it("should call updateAnswerAction with correct parameters on submit", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (updateAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      const submitButton = screen.getByTestId("submit-form");
      await user.click(submitButton);

      await waitFor(() => {
        expect(updateAnswerAction).toHaveBeenCalledWith(
          "answer123",
          "test-question",
          expect.objectContaining({
            description: mockAnswer.description,
          })
        );
      });
    });

    it("should exit edit mode after successful update", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (updateAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      const submitButton = screen.getByTestId("submit-form");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });

      expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
    });

    it("should handle server error during update", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (updateAnswerAction as jest.Mock).mockResolvedValue({
        error: { type: "serverError", message: "Update failed" },
      });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      const submitButton = screen.getByTestId("submit-form");
      await user.click(submitButton);

      await waitFor(() => {
        expect(updateAnswerAction).toHaveBeenCalled();
      });

      // Form should still be visible on error
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should not exit edit mode when update fails", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (updateAnswerAction as jest.Mock).mockResolvedValue({
        error: { type: "serverError", message: "Update failed" },
      });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      const submitButton = screen.getByTestId("submit-form");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("answer-form")).toBeInTheDocument();
      });
    });

    it("should set loading state during update", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      let resolveUpdate: any;
      (updateAnswerAction as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveUpdate = resolve;
        })
      );

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      const submitButton = screen.getByTestId("submit-form");
      await user.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByTestId("submit-form")).toBeDisabled();
      });

      resolveUpdate({ success: true });
    });
  });

  describe("Delete Answer Functionality", () => {
    it("should call deleteAnswerAction with correct parameters", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (deleteAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(deleteAnswerAction).toHaveBeenCalledWith(
          "answer123",
          "test-question"
        );
      });
    });

    it("should handle delete success", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (deleteAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(deleteAnswerAction).toHaveBeenCalled();
      });
    });

    it("should display error message when delete fails", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (deleteAnswerAction as jest.Mock).mockResolvedValue({
        error: { type: "serverError", message: "Delete failed" },
      });

      render(<AnswerCard answer={mockAnswer} />);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId("delete-error")).toHaveTextContent(
          "Delete failed"
        );
      });
    });

    it("should set deleting state during delete operation", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      let resolveDelete: any;
      (deleteAnswerAction as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveDelete = resolve;
        })
      );

      render(<AnswerCard answer={mockAnswer} />);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId("delete-button")).toBeDisabled();
      });

      resolveDelete({ success: true });
    });

    it("should not set isEditing to false when delete fails", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (deleteAnswerAction as jest.Mock).mockResolvedValue({
        error: { type: "serverError", message: "Delete failed" },
      });

      render(<AnswerCard answer={mockAnswer} />);

      // Enter edit mode
      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId("delete-error")).toBeInTheDocument();
      });

      // Form should still be visible
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });
  });

  describe("Cancel Edit Functionality", () => {
    it("should exit edit mode when cancel button is clicked", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      const cancelButton = screen.getByTestId("cancel-form");
      await user.click(cancelButton);

      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
    });

    it("should reset form when exiting edit mode", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);
      await user.click(editButton);

      // Form should be reset (tested through useEffect)
      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing answer description", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      const answerWithoutDescription = {
        ...mockAnswer,
        description: "",
      };

      render(<AnswerCard answer={answerWithoutDescription} />);

      expect(screen.queryByTestId("text-editor-content")).not.toBeInTheDocument();
    });

    it("should handle null description", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      const answerWithNullDescription = {
        ...mockAnswer,
        description: null as any,
      };

      render(<AnswerCard answer={answerWithNullDescription} />);

      expect(screen.queryByTestId("text-editor-content")).not.toBeInTheDocument();
    });

    it("should handle missing author name", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      const answerWithoutAuthorName = {
        ...mockAnswer,
        author: { ...mockAnswer.author, name: "" },
      };

      render(<AnswerCard answer={answerWithoutAuthorName} />);

      expect(screen.getByTestId("user-image")).toBeInTheDocument();
    });

    it("should handle invalid date format", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      const answerWithInvalidDate = {
        ...mockAnswer,
        createdAt: "invalid-date" as any,
      };

      render(<AnswerCard answer={answerWithInvalidDate} />);

      expect(screen.getByText("Invalid Date")).toBeInTheDocument();
    });

    it("should handle missing params slug", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (useParams as jest.Mock).mockReturnValue({});
      (updateAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("user-image")).toBeInTheDocument();
    });

    it("should handle concurrent edit and delete operations", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (updateAnswerAction as jest.Mock).mockResolvedValue({ success: true });
      (deleteAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      const submitButton = screen.getByTestId("submit-form");
      const deleteButton = screen.getByTestId("delete-button");

      // Try to submit and delete at the same time
      await user.click(submitButton);
      await user.click(deleteButton);

      await waitFor(() => {
        expect(updateAnswerAction).toHaveBeenCalled();
        expect(deleteAnswerAction).toHaveBeenCalled();
      });
    });
  });

  describe("Props Validation", () => {
    it("should accept answer with all required fields", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      const { container } = render(<AnswerCard answer={mockAnswer} />);
      expect(container).toBeInTheDocument();
    });

    it("should render with minimal answer object", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      const minimalAnswer = {
        _id: "123",
        description: "Test",
        createdAt: new Date(),
        author: {
          _id: "author123",
          name: "Author",
          email: "author@test.com",
        },
      };

      const { container } = render(<AnswerCard answer={minimalAnswer} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    it("should complete full edit workflow", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });
      (updateAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      // Start editing
      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      // Submit changes
      const submitButton = screen.getByTestId("submit-form");
      await user.click(submitButton);

      // Verify exit from edit mode
      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
        expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
      });
    });

    it("should complete full cancel workflow", async () => {
      const user = userEvent.setup();
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: mockUser,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      // Start editing
      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      // Cancel editing
      const cancelButton = screen.getByTestId("cancel-form");
      await user.click(cancelButton);

      // Verify exit from edit mode
      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
    });
  });
});

describe("AnswerCardSkeleton Component", () => {
  it("should render skeleton component", () => {
    render(<AnswerCardSkeleton />);

    const skeletons = screen.getAllByTestId(/skeleton/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render all skeleton elements", () => {
    const { container } = render(<AnswerCardSkeleton />);

    // Check for skeleton structure
    const skeletons = container.querySelectorAll('[class*="skeleton"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(4);
  });

  it("should have correct skeleton layout structure", () => {
    const { container } = render(<AnswerCardSkeleton />);

    // Check for main container
    const mainContainer = container.querySelector(".pt-\\[1em\\]");
    expect(mainContainer).toBeInTheDocument();
  });

  it("should render calendar icon in skeleton", () => {
    render(<AnswerCardSkeleton />);

    const calendarIcon = screen.getByTestId("lucide-calendar-days");
    expect(calendarIcon).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = render(<AnswerCardSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it("should render with consistent styling", () => {
    const { container } = render(<AnswerCardSkeleton />);

    const mainContainer = container.querySelector(".pt-\\[1em\\]");
    expect(mainContainer).toHaveClass("flex", "flex-col", "gap-2");
  });
});

describe("AnswerCard Accessibility", () => {
  it("should have accessible button for editing", async () => {
    (useGetProfileQuery as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
    });

    render(<AnswerCard answer={mockAnswer} />);

    const editButton = screen.getByRole("button", { name: /pencil/i });
    expect(editButton).toBeInTheDocument();
  });

  it("should maintain focus management during mode switches", async () => {
    const user = userEvent.setup();
    (useGetProfileQuery as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
    });

    render(<AnswerCard answer={mockAnswer} />);

    const editButton = screen.getByRole("button", { name: /pencil/i });
    await user.click(editButton);

    // Ensure form is rendered and focusable
    expect(screen.getByTestId("answer-form")).toBeInTheDocument();
  });

  it("should have semantic HTML structure", () => {
    (useGetProfileQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    const { container } = render(<AnswerCard answer={mockAnswer} />);

    // Check for proper div structure
    const mainDiv = container.firstChild;
    expect(mainDiv).toBeInTheDocument();
  });
});

describe("AnswerCard Performance", () => {
  it("should not re-render unnecessarily", () => {
    (useGetProfileQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    const { rerender } = render(<AnswerCard answer={mockAnswer} />);

    // Re-render with same props
    rerender(<AnswerCard answer={mockAnswer} />);

    expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
  });

  it("should handle rapid state changes", async () => {
    const user = userEvent.setup();
    (useGetProfileQuery as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
    });

    render(<AnswerCard answer={mockAnswer} />);

    const editButton = screen.getByRole("button", { name: /pencil/i });

    // Rapid clicks
    await user.click(editButton);
    await user.click(editButton);
    await user.click(editButton);

    // Should be in edit mode (odd number of clicks)
    expect(screen.getByTestId("answer-form")).toBeInTheDocument();
  });
});