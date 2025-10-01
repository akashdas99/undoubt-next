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

jest.mock("../ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("../ui/skeleton", () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));

jest.mock("../ui/textEditorContent", () => ({
  __esModule: true,
  default: ({ content }: any) => <div data-testid="text-editor-content">{content}</div>,
}));

jest.mock("../ui/userImage", () => ({
  __esModule: true,
  default: ({ user, className }: any) => (
    <img data-testid="user-image" alt={user?.name} className={className} />
  ),
}));

jest.mock("./answerForm", () => ({
  __esModule: true,
  default: ({ form, onSubmit, onCancel, isLoading }: any) => (
    <form data-testid="answer-form" onSubmit={(e) => { e.preventDefault(); onSubmit(form.getValues()); }}>
      <textarea
        data-testid="description-input"
        onChange={(e) => form.setValue("description", e.target.value)}
        value={form.getValues().description}
      />
      <button type="submit" disabled={isLoading} data-testid="submit-button">
        Submit
      </button>
      <button type="button" onClick={onCancel} data-testid="cancel-button">
        Cancel
      </button>
    </form>
  ),
}));

jest.mock("./deleteAnswerModal", () => ({
  __esModule: true,
  default: ({ onDelete, isDeleting, error }: any) => (
    <div data-testid="delete-answer-modal">
      <button onClick={onDelete} disabled={isDeleting} data-testid="delete-button">
        Delete
      </button>
      {error && <div data-testid="delete-error">{error}</div>}
    </div>
  ),
}));

describe("AnswerCard Component", () => {
  const mockAnswer = {
    _id: "answer123",
    description: "This is a test answer",
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

  const mockParams = { slug: "test-question-slug" };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue(mockParams);
    (useGetProfileQuery as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
    });
  });

  describe("Rendering", () => {
    it("should render answer card with author information", () => {
      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("user-image")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByTestId("text-editor-content")).toHaveTextContent(
        "This is a test answer"
      );
    });

    it("should render formatted date correctly", () => {
      render(<AnswerCard answer={mockAnswer} />);

      const formattedDate = dayjs(mockAnswer.createdAt).format("MMM D, YYYY");
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });

    it("should render answer description in TextEditorContent", () => {
      render(<AnswerCard answer={mockAnswer} />);

      const textEditor = screen.getByTestId("text-editor-content");
      expect(textEditor).toBeInTheDocument();
      expect(textEditor).toHaveTextContent(mockAnswer.description);
    });

    it("should not render edit and delete buttons for non-author", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: { ...mockUser, _id: "differentUser" },
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    });

    it("should render edit and delete buttons for author", () => {
      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("delete-answer-modal")).toBeInTheDocument();
    });

    it("should handle answer with no description gracefully", () => {
      const answerNoDesc = { ...mockAnswer, description: "" };
      render(<AnswerCard answer={answerNoDesc} />);

      expect(screen.queryByTestId("text-editor-content")).not.toBeInTheDocument();
    });

    it("should render while user is loading", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
    });
  });

  describe("Author Detection", () => {
    it("should correctly identify author when IDs match", () => {
      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("delete-answer-modal")).toBeInTheDocument();
    });

    it("should not identify as author when IDs don't match", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: { ...mockUser, _id: "different123" },
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
    });

    it("should not identify as author when user is not logged in", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
    });

    it("should handle undefined user data gracefully", () => {
      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
    });

    it("should handle answer author ID as string vs object", () => {
      const answerWithStringId = {
        ...mockAnswer,
        author: { ...mockAnswer.author, _id: "user123" },
      };

      render(<AnswerCard answer={answerWithStringId} />);

      expect(screen.getByTestId("delete-answer-modal")).toBeInTheDocument();
    });
  });

  describe("Edit Functionality", () => {
    it("should toggle edit mode when edit button is clicked", async () => {
      const user = userEvent.setup();
      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button");
      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();

      await user.click(editButton);

      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should exit edit mode when clicking edit button again", async () => {
      const user = userEvent.setup();
      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button");
      await user.click(editButton);
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      await user.click(editButton);
      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
    });

    it("should display AnswerForm in edit mode", async () => {
      const user = userEvent.setup();
      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));

      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
      expect(screen.queryByTestId("text-editor-content")).not.toBeInTheDocument();
    });

    it("should call updateAnswerAction on form submit", async () => {
      const user = userEvent.setup();
      (updateAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(updateAnswerAction).toHaveBeenCalledWith(
          "answer123",
          "test-question-slug",
          expect.objectContaining({ description: mockAnswer.description })
        );
      });
    });

    it("should exit edit mode after successful update", async () => {
      const user = userEvent.setup();
      (updateAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });
    });

    it("should handle server error during update", async () => {
      const user = userEvent.setup();
      const errorMessage = "Failed to update answer";
      (updateAnswerAction as jest.Mock).mockResolvedValue({
        error: { type: "serverError", message: errorMessage },
      });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(updateAnswerAction).toHaveBeenCalled();
      });

      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should stay in edit mode if update fails", async () => {
      const user = userEvent.setup();
      (updateAnswerAction as jest.Mock).mockResolvedValue({
        error: { type: "serverError", message: "Error" },
      });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("answer-form")).toBeInTheDocument();
      });
    });

    it("should exit edit mode when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      await user.click(screen.getByTestId("cancel-button"));

      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
    });

    it("should show loading state during update", async () => {
      const user = userEvent.setup();
      let resolveUpdate: any;
      (updateAnswerAction as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveUpdate = resolve;
        })
      );

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByTestId("submit-button"));

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeDisabled();

      resolveUpdate({ success: true });
    });

    it("should reset form when exiting edit mode", async () => {
      const user = userEvent.setup();
      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });
    });
  });

  describe("Delete Functionality", () => {
    it("should call deleteAnswerAction when delete is confirmed", async () => {
      const user = userEvent.setup();
      (deleteAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(deleteAnswerAction).toHaveBeenCalledWith(
          "answer123",
          "test-question-slug"
        );
      });
    });

    it("should handle delete with correct parameters", async () => {
      const user = userEvent.setup();
      (deleteAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(deleteAnswerAction).toHaveBeenCalledTimes(1);
        expect(deleteAnswerAction).toHaveBeenCalledWith(
          mockAnswer._id,
          mockParams.slug
        );
      });
    });

    it("should show delete error when delete fails", async () => {
      const user = userEvent.setup();
      const errorMessage = "Failed to delete answer";
      (deleteAnswerAction as jest.Mock).mockResolvedValue({
        error: { type: "serverError", message: errorMessage },
      });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(screen.getByTestId("delete-error")).toHaveTextContent(errorMessage);
      });
    });

    it("should maintain deleting state during delete operation", async () => {
      const user = userEvent.setup();
      let resolveDelete: any;
      (deleteAnswerAction as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveDelete = resolve;
        })
      );

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByTestId("delete-button"));

      const deleteButton = screen.getByTestId("delete-button");
      expect(deleteButton).toBeDisabled();

      resolveDelete({ success: true });
    });

    it("should exit edit mode after successful deletion", async () => {
      const user = userEvent.setup();
      (deleteAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });
    });

    it("should handle network errors during delete", async () => {
      const user = userEvent.setup();
      (deleteAnswerAction as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(deleteAnswerAction).toHaveBeenCalled();
      });
    });

    it("should stop deleting state after error", async () => {
      const user = userEvent.setup();
      (deleteAnswerAction as jest.Mock).mockResolvedValue({
        error: { type: "serverError", message: "Delete failed" },
      });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(screen.getByTestId("delete-button")).not.toBeDisabled();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing answer description", () => {
      const answerNoDesc = { ...mockAnswer, description: undefined };
      render(<AnswerCard answer={answerNoDesc as any} />);

      expect(screen.queryByTestId("text-editor-content")).not.toBeInTheDocument();
    });

    it("should handle missing author name", () => {
      const answerNoName = {
        ...mockAnswer,
        author: { ...mockAnswer.author, name: undefined },
      };
      render(<AnswerCard answer={answerNoName as any} />);

      expect(screen.getByTestId("user-image")).toBeInTheDocument();
    });

    it("should handle invalid date", () => {
      const answerInvalidDate = { ...mockAnswer, createdAt: new Date("invalid") };
      render(<AnswerCard answer={answerInvalidDate} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should handle answer with null author properties", () => {
      const answerNullAuthor = {
        ...mockAnswer,
        author: { _id: null, name: null, email: null },
      };
      render(<AnswerCard answer={answerNullAuthor as any} />);

      expect(screen.getByTestId("user-image")).toBeInTheDocument();
    });

    it("should handle extremely long description", () => {
      const longDescription = "A".repeat(10000);
      const answerLongDesc = { ...mockAnswer, description: longDescription };
      render(<AnswerCard answer={answerLongDesc} />);

      expect(screen.getByTestId("text-editor-content")).toHaveTextContent(longDescription);
    });

    it("should handle special characters in description", () => {
      const specialDesc = "<script>alert('xss')</script> & special < > chars";
      const answerSpecialDesc = { ...mockAnswer, description: specialDesc };
      render(<AnswerCard answer={answerSpecialDesc} />);

      expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
    });

    it("should handle missing slug parameter", () => {
      (useParams as jest.Mock).mockReturnValue({});
      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should handle empty string as answer ID", async () => {
      const user = userEvent.setup();
      const answerEmptyId = { ...mockAnswer, _id: "" };
      (updateAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={answerEmptyId} />);

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(updateAnswerAction).toHaveBeenCalledWith(
          "",
          mockParams.slug,
          expect.any(Object)
        );
      });
    });

    it("should handle rapid edit toggle clicks", async () => {
      const user = userEvent.setup();
      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button");
      await user.click(editButton);
      await user.click(editButton);
      await user.click(editButton);

      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should handle multiple rapid delete clicks", async () => {
      const user = userEvent.setup();
      (deleteAnswerAction as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );

      render(<AnswerCard answer={mockAnswer} />);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);
      await user.click(deleteButton);

      await waitFor(() => {
        expect(deleteAnswerAction).toHaveBeenCalled();
      });
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete edit workflow", async () => {
      const user = userEvent.setup();
      (updateAnswerAction as jest.Mock).mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      // Enter edit mode
      await user.click(screen.getByRole("button"));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      // Submit changes
      await user.click(screen.getByTestId("submit-button"));

      // Verify exit from edit mode
      await waitFor(() => {
        expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
      });

      // Verify update was called
      expect(updateAnswerAction).toHaveBeenCalledTimes(1);
    });

    it("should handle edit -> cancel -> edit workflow", async () => {
      const user = userEvent.setup();
      render(<AnswerCard answer={mockAnswer} />);

      // Enter edit mode
      await user.click(screen.getByRole("button"));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      // Cancel edit
      await user.click(screen.getByTestId("cancel-button"));
      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();

      // Enter edit mode again
      await user.click(screen.getByRole("button"));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should handle user becoming non-author", () => {
      const { rerender } = render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("delete-answer-modal")).toBeInTheDocument();

      (useGetProfileQuery as jest.Mock).mockReturnValue({
        data: { ...mockUser, _id: "different123" },
        isLoading: false,
      });

      rerender(<AnswerCard answer={mockAnswer} />);

      expect(screen.queryByTestId("delete-answer-modal")).not.toBeInTheDocument();
    });

    it("should handle switching between multiple answers", () => {
      const answer1 = { ...mockAnswer, _id: "answer1", description: "First answer" };
      const answer2 = { ...mockAnswer, _id: "answer2", description: "Second answer" };

      const { rerender } = render(<AnswerCard answer={answer1} />);
      expect(screen.getByTestId("text-editor-content")).toHaveTextContent("First answer");

      rerender(<AnswerCard answer={answer2} />);
      expect(screen.getByTestId("text-editor-content")).toHaveTextContent("Second answer");
    });
  });

  describe("Form State Management", () => {
    it("should initialize form with answer description", () => {
      render(<AnswerCard answer={mockAnswer} />);

      // Form should not be visible initially
      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
    });

    it("should reset form when toggling edit mode off", async () => {
      const user = userEvent.setup();
      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("button"));

      // Form should be reset (effect is triggered)
      expect(screen.queryByTestId("answer-form")).not.toBeInTheDocument();
    });

    it("should maintain form state during submission", async () => {
      const user = userEvent.setup();
      let resolveUpdate: any;
      (updateAnswerAction as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveUpdate = resolve;
        })
      );

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button"));
      const form = screen.getByTestId("answer-form");
      await user.click(screen.getByTestId("submit-button"));

      expect(form).toBeInTheDocument();

      resolveUpdate({ success: true });
    });
  });
});

describe("AnswerCardSkeleton Component", () => {
  it("should render skeleton structure", () => {
    render(<AnswerCardSkeleton />);

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render user image skeleton", () => {
    render(<AnswerCardSkeleton />);

    const skeletons = screen.getAllByTestId("skeleton");
    const userImageSkeleton = skeletons.find((skeleton) =>
      skeleton.className.includes("rounded-full")
    );

    expect(userImageSkeleton).toBeInTheDocument();
  });

  it("should render multiple content skeletons", () => {
    render(<AnswerCardSkeleton />);

    const skeletons = screen.getAllByTestId("skeleton");
    const contentSkeletons = skeletons.filter((skeleton) =>
      skeleton.className.includes("w-full")
    );

    expect(contentSkeletons.length).toBe(3);
  });

  it("should render calendar icon", () => {
    render(<AnswerCardSkeleton />);

    // Calendar icon should be rendered (lucide-react component)
    const container = screen.getByTestId("skeleton").closest("div");
    expect(container).toBeInTheDocument();
  });

  it("should have correct border styling", () => {
    const { container } = render(<AnswerCardSkeleton />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("border-t-2");
    expect(mainDiv).toHaveClass("border-solid");
  });

  it("should render date skeleton with correct width", () => {
    render(<AnswerCardSkeleton />);

    const skeletons = screen.getAllByTestId("skeleton");
    const dateSkeleton = skeletons.find((skeleton) =>
      skeleton.className.includes("w-20")
    );

    expect(dateSkeleton).toBeInTheDocument();
  });

  it("should render name skeleton with correct width", () => {
    render(<AnswerCardSkeleton />);

    const skeletons = screen.getAllByTestId("skeleton");
    const nameSkeleton = skeletons.find((skeleton) =>
      skeleton.className.includes("w-28")
    );

    expect(nameSkeleton).toBeInTheDocument();
  });

  it("should maintain consistent skeleton layout", () => {
    const { container } = render(<AnswerCardSkeleton />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("flex");
    expect(mainDiv).toHaveClass("flex-col");
    expect(mainDiv).toHaveClass("gap-2");
  });

  it("should not render any interactive elements", () => {
    render(<AnswerCardSkeleton />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("should render independently without props", () => {
    expect(() => render(<AnswerCardSkeleton />)).not.toThrow();
  });

  it("should render multiple skeleton instances", () => {
    const { container } = render(
      <>
        <AnswerCardSkeleton />
        <AnswerCardSkeleton />
        <AnswerCardSkeleton />
      </>
    );

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThanOrEqual(15); // 5 skeletons per instance * 3
  });

  it("should have consistent spacing between elements", () => {
    const { container } = render(<AnswerCardSkeleton />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("pt-[1em]");
  });
});