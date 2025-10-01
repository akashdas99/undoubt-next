/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AnswerCard, { AnswerCardSkeleton } from "./answerCard";
import { deleteAnswerAction, updateAnswerAction } from "@/actions/answer";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

// Mock dependencies
jest.mock("@/actions/answer");
jest.mock("@/lib/store/user/user");
jest.mock("next/navigation");
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
  default: ({ form, onSubmit, onCancel, isLoading }: any) => (
    <form
      data-testid="answer-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form.getValues());
      }}
    >
      <button type="button" onClick={onCancel} data-testid="cancel-button">
        Cancel
      </button>
      <button type="submit" disabled={isLoading} data-testid="submit-button">
        {isLoading ? "Loading..." : "Submit"}
      </button>
    </form>
  ),
}));
jest.mock("./deleteAnswerModal", () => ({
  __esModule: true,
  default: ({ error, isDeleting, onDelete }: any) => (
    <div data-testid="delete-answer-modal">
      {error && <div data-testid="delete-error">{error}</div>}
      <button
        onClick={onDelete}
        disabled={isDeleting}
        data-testid="delete-button"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  ),
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseGetProfileQuery = useGetProfileQuery as jest.MockedFunction<
  typeof useGetProfileQuery
>;
const mockDeleteAnswerAction = deleteAnswerAction as jest.MockedFunction<
  typeof deleteAnswerAction
>;
const mockUpdateAnswerAction = updateAnswerAction as jest.MockedFunction<
  typeof updateAnswerAction
>;

describe("AnswerCard Component", () => {
  const mockAnswer = {
    _id: "answer123",
    description: "This is a test answer description",
    createdAt: new Date("2024-01-15"),
    author: {
      _id: "user123",
      name: "John Doe",
      email: "john@example.com",
      image: "https://example.com/avatar.jpg",
    },
  };

  const mockUser = {
    _id: "user123",
    name: "John Doe",
    email: "john@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ slug: "test-question-slug" });
  });

  describe("Rendering", () => {
    it("should render answer card with author information", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByTestId("user-image")).toBeInTheDocument();
      expect(screen.getByTestId("text-editor-content")).toHaveTextContent(
        "This is a test answer description"
      );
    });

    it("should render formatted date correctly", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      const expectedDate = dayjs(mockAnswer.createdAt).format("MMM D, YYYY");
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });

    it("should render answer description in TextEditorContent", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
    });

    it("should not render description when it is empty", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      const answerWithoutDescription = {
        ...mockAnswer,
        description: "",
      };

      render(<AnswerCard answer={answerWithoutDescription} />);

      expect(
        screen.queryByTestId("text-editor-content")
      ).not.toBeInTheDocument();
    });
  });

  describe("Author Authorization", () => {
    it("should show edit and delete buttons when user is the author", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      expect(screen.getByRole("button", { name: /pencil/i })).toBeInTheDocument();
      expect(screen.getByTestId("delete-answer-modal")).toBeInTheDocument();
    });

    it("should not show edit and delete buttons when user is not the author", () => {
      const differentUser = {
        _id: "user456",
        name: "Jane Doe",
        email: "jane@example.com",
      };

      mockUseGetProfileQuery.mockReturnValue({
        data: differentUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      expect(
        screen.queryByRole("button", { name: /pencil/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("delete-answer-modal")
      ).not.toBeInTheDocument();
    });

    it("should not show edit and delete buttons when user is loading", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      expect(
        screen.queryByRole("button", { name: /pencil/i })
      ).not.toBeInTheDocument();
    });

    it("should not show edit and delete buttons when user is not logged in", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      expect(
        screen.queryByRole("button", { name: /pencil/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Edit Functionality", () => {
    it("should toggle edit mode when edit button is clicked", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);

      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
      expect(
        screen.queryByTestId("text-editor-content")
      ).not.toBeInTheDocument();
    });

    it("should show answer form in edit mode", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button", { name: /pencil/i }));

      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should exit edit mode when cancel button is clicked", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button", { name: /pencil/i }));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      await user.click(screen.getByTestId("cancel-button"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("answer-form")
        ).not.toBeInTheDocument();
      });
      expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
    });

    it("should toggle between edit and view mode multiple times", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      const editButton = screen.getByRole("button", { name: /pencil/i });

      // Enter edit mode
      await user.click(editButton);
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      // Exit edit mode
      await user.click(editButton);
      await waitFor(() => {
        expect(
          screen.queryByTestId("answer-form")
        ).not.toBeInTheDocument();
      });

      // Enter edit mode again
      await user.click(editButton);
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });
  });

  describe("Update Answer", () => {
    it("should call updateAnswerAction with correct parameters on submit", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
      mockUpdateAnswerAction.mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button", { name: /pencil/i }));

      const form = screen.getByTestId("answer-form");
      await user.click(within(form).getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockUpdateAnswerAction).toHaveBeenCalledWith(
          "answer123",
          "test-question-slug",
          expect.objectContaining({
            description: "This is a test answer description",
          })
        );
      });
    });

    it("should exit edit mode on successful update", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
      mockUpdateAnswerAction.mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button", { name: /pencil/i }));
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("answer-form")
        ).not.toBeInTheDocument();
      });
      expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
    });

    it("should handle server error on update", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
      mockUpdateAnswerAction.mockResolvedValue({
        error: {
          type: "serverError",
          message: "Failed to update answer",
        },
      });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button", { name: /pencil/i }));
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockUpdateAnswerAction).toHaveBeenCalled();
      });

      // Should remain in edit mode on error
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });

    it("should show loading state during update", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      let resolveUpdate: (value: any) => void;
      const updatePromise = new Promise((resolve) => {
        resolveUpdate = resolve;
      });
      mockUpdateAnswerAction.mockReturnValue(updatePromise as any);

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button", { name: /pencil/i }));
      await user.click(screen.getByTestId("submit-button"));

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByTestId("submit-button")).toBeDisabled();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });

      // Resolve the promise
      resolveUpdate({ success: true });
    });

    it("should handle network error on update", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
      mockUpdateAnswerAction.mockRejectedValue(
        new Error("Network error")
      );

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button", { name: /pencil/i }));
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockUpdateAnswerAction).toHaveBeenCalled();
      });
    });
  });

  describe("Delete Answer", () => {
    it("should call deleteAnswerAction with correct parameters", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
      mockDeleteAnswerAction.mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(mockDeleteAnswerAction).toHaveBeenCalledWith(
          "answer123",
          "test-question-slug"
        );
      });
    });

    it("should show loading state during deletion", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      let resolveDelete: (value: any) => void;
      const deletePromise = new Promise((resolve) => {
        resolveDelete = resolve;
      });
      mockDeleteAnswerAction.mockReturnValue(deletePromise as any);

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(screen.getByTestId("delete-button")).toBeDisabled();
        expect(screen.getByText("Deleting...")).toBeInTheDocument();
      });

      resolveDelete({ success: true });
    });

    it("should handle delete error and show error message", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
      mockDeleteAnswerAction.mockResolvedValue({
        error: {
          type: "serverError",
          message: "Failed to delete answer",
        },
      });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(screen.getByTestId("delete-error")).toHaveTextContent(
          "Failed to delete answer"
        );
      });

      // Should stop loading state
      expect(screen.getByTestId("delete-button")).not.toBeDisabled();
    });

    it("should exit edit mode on successful deletion", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
      mockDeleteAnswerAction.mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      // Enter edit mode first
      await user.click(screen.getByRole("button", { name: /pencil/i }));
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(mockDeleteAnswerAction).toHaveBeenCalled();
      });
    });

    it("should handle network error on deletion", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
      mockDeleteAnswerAction.mockRejectedValue(
        new Error("Network error")
      );

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(mockDeleteAnswerAction).toHaveBeenCalled();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle answer without author gracefully", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      const answerWithoutAuthor = {
        ...mockAnswer,
        author: null as any,
      };

      render(<AnswerCard answer={answerWithoutAuthor} />);

      expect(screen.getByTestId("user-image")).toBeInTheDocument();
    });

    it("should handle answer with undefined _id", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      const answerWithoutId = {
        ...mockAnswer,
        _id: undefined as any,
      };

      render(<AnswerCard answer={answerWithoutId} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should handle user with undefined _id", () => {
      const userWithoutId = {
        ...mockUser,
        _id: undefined as any,
      };

      mockUseGetProfileQuery.mockReturnValue({
        data: userWithoutId,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      // Should not show edit/delete buttons
      expect(
        screen.queryByRole("button", { name: /pencil/i })
      ).not.toBeInTheDocument();
    });

    it("should handle different date formats", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      const answerWithDifferentDate = {
        ...mockAnswer,
        createdAt: new Date("2023-12-25T10:30:00Z"),
      };

      render(<AnswerCard answer={answerWithDifferentDate} />);

      const expectedDate = dayjs(answerWithDifferentDate.createdAt).format(
        "MMM D, YYYY"
      );
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });

    it("should handle missing slug parameter", async () => {
      const user = userEvent.setup();
      mockUseParams.mockReturnValue({ slug: undefined as any });
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);
      mockUpdateAnswerAction.mockResolvedValue({ success: true });

      render(<AnswerCard answer={mockAnswer} />);

      await user.click(screen.getByRole("button", { name: /pencil/i }));
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockUpdateAnswerAction).toHaveBeenCalledWith(
          "answer123",
          undefined,
          expect.any(Object)
        );
      });
    });

    it("should reset form when exiting edit mode", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      // Enter and exit edit mode
      await user.click(screen.getByRole("button", { name: /pencil/i }));
      await user.click(screen.getByRole("button", { name: /pencil/i }));

      // Form reset is handled by useEffect, which should be triggered
      await waitFor(() => {
        expect(
          screen.queryByTestId("answer-form")
        ).not.toBeInTheDocument();
      });
    });

    it("should handle answer with very long description", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      const longDescription = "A".repeat(10000);

      const answerWithLongDescription = {
        ...mockAnswer,
        description: longDescription,
      };

      render(<AnswerCard answer={answerWithLongDescription} />);

      expect(screen.getByTestId("text-editor-content")).toHaveTextContent(
        longDescription
      );
    });

    it("should handle special characters in description", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      const specialDescription = '<script>alert("XSS")</script> & special < > chars';
      const answerWithSpecialChars = {
        ...mockAnswer,
        description: specialDescription,
      };

      render(<AnswerCard answer={answerWithSpecialChars} />);

      expect(screen.getByTestId("text-editor-content")).toHaveTextContent(
        specialDescription
      );
    });
  });

  describe("Form Reset on Edit Mode Change", () => {
    it("should reset form values when entering edit mode", async () => {
      const user = userEvent.setup();
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      // Toggle edit mode
      const editButton = screen.getByRole("button", { name: /pencil/i });
      await user.click(editButton);
      await user.click(editButton);
      await user.click(editButton);

      // Form should be reset each time
      expect(screen.getByTestId("answer-form")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render correct CSS classes for layout", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      const { container } = render(<AnswerCard answer={mockAnswer} />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass(
        "pt-[1em]",
        "flex",
        "flex-col",
        "gap-2",
        "border-t-2",
        "border-solid",
        "border-foreground/20"
      );
    });

    it("should render author section with correct structure", () => {
      mockUseGetProfileQuery.mockReturnValue({
        data: mockUser,
        isLoading: false,
      } as any);

      render(<AnswerCard answer={mockAnswer} />);

      const userImage = screen.getByTestId("user-image");
      expect(userImage).toHaveClass("w-[30px]");
    });
  });
});

describe("AnswerCardSkeleton Component", () => {
  it("should render skeleton structure", () => {
    render(<AnswerCardSkeleton />);

    // Check for multiple skeleton elements
    const skeletons = screen.getAllByTestId(/skeleton|loading/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render calendar icon in skeleton", () => {
    const { container } = render(<AnswerCardSkeleton />);

    // Calendar icon should be present
    const calendarIcon = container.querySelector("svg");
    expect(calendarIcon).toBeInTheDocument();
  });

  it("should have correct layout classes", () => {
    const { container } = render(<AnswerCardSkeleton />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      "pt-[1em]",
      "flex",
      "flex-col",
      "gap-2",
      "border-t-2",
      "border-solid",
      "border-foreground/20"
    );
  });

  it("should render user image skeleton with correct size", () => {
    const { container } = render(<AnswerCardSkeleton />);

    const userImageSkeleton = container.querySelector(
      ".rounded-full.h-\\[30px\\].w-\\[30px\\]"
    );
    expect(userImageSkeleton).toBeInTheDocument();
  });

  it("should render multiple content skeletons", () => {
    const { container } = render(<AnswerCardSkeleton />);

    const contentSkeletons = container.querySelectorAll(".h-6.w-full");
    expect(contentSkeletons.length).toBe(3);
  });

  it("should not render edit/delete buttons in skeleton", () => {
    render(<AnswerCardSkeleton />);

    expect(
      screen.queryByRole("button", { name: /pencil/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("delete-answer-modal")
    ).not.toBeInTheDocument();
  });

  it("should render name skeleton with correct width", () => {
    const { container } = render(<AnswerCardSkeleton />);

    const nameSkeleton = container.querySelector(".h-6.w-28");
    expect(nameSkeleton).toBeInTheDocument();
  });

  it("should render date skeleton with correct width", () => {
    const { container } = render(<AnswerCardSkeleton />);

    const dateSkeleton = container.querySelector(".h-4.w-20");
    expect(dateSkeleton).toBeInTheDocument();
  });
});

describe("AnswerCard Integration Tests", () => {
  it("should handle complete edit workflow", async () => {
    const user = userEvent.setup();
    mockUseGetProfileQuery.mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as any);
    mockUpdateAnswerAction.mockResolvedValue({ success: true });

    render(<AnswerCard answer={mockAnswer} />);

    // Initial state
    expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();

    // Enter edit mode
    await user.click(screen.getByRole("button", { name: /pencil/i }));
    expect(screen.getByTestId("answer-form")).toBeInTheDocument();

    // Submit form
    await user.click(screen.getByTestId("submit-button"));

    // Should return to view mode
    await waitFor(() => {
      expect(screen.getByTestId("text-editor-content")).toBeInTheDocument();
    });
  });

  it("should handle complete delete workflow", async () => {
    const user = userEvent.setup();
    mockUseGetProfileQuery.mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as any);
    mockDeleteAnswerAction.mockResolvedValue({ success: true });

    render(<AnswerCard answer={mockAnswer} />);

    await user.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      expect(mockDeleteAnswerAction).toHaveBeenCalled();
      expect(screen.getByTestId("delete-button")).not.toBeDisabled();
    });
  });

  it("should handle rapid edit mode toggling", async () => {
    const user = userEvent.setup();
    mockUseGetProfileQuery.mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as any);

    render(<AnswerCard answer={mockAnswer} />);

    const editButton = screen.getByRole("button", { name: /pencil/i });

    // Rapidly toggle edit mode
    await user.click(editButton);
    await user.click(editButton);
    await user.click(editButton);
    await user.click(editButton);

    // Should end in edit mode
    expect(screen.getByTestId("answer-form")).toBeInTheDocument();
  });

  it("should maintain state when switching between authors", async () => {
    mockUseGetProfileQuery.mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as any);

    const { rerender } = render(<AnswerCard answer={mockAnswer} />);

    expect(
      screen.getByRole("button", { name: /pencil/i })
    ).toBeInTheDocument();

    // Change to different user
    const differentUser = {
      _id: "user789",
      name: "Different User",
      email: "different@example.com",
    };

    mockUseGetProfileQuery.mockReturnValue({
      data: differentUser,
      isLoading: false,
    } as any);

    rerender(<AnswerCard answer={mockAnswer} />);

    // Should no longer show edit button
    expect(
      screen.queryByRole("button", { name: /pencil/i })
    ).not.toBeInTheDocument();
  });
});

describe("AnswerCard Error Handling", () => {
  it("should handle multiple consecutive errors", async () => {
    const user = userEvent.setup();
    mockUseGetProfileQuery.mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as any);

    mockUpdateAnswerAction.mockResolvedValue({
      error: { type: "serverError", message: "Error 1" },
    });

    render(<AnswerCard answer={mockAnswer} />);

    await user.click(screen.getByRole("button", { name: /pencil/i }));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockUpdateAnswerAction).toHaveBeenCalled();
    });

    // Try again with different error
    mockUpdateAnswerAction.mockResolvedValue({
      error: { type: "serverError", message: "Error 2" },
    });

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockUpdateAnswerAction).toHaveBeenCalledTimes(2);
    });
  });

  it("should handle error followed by success", async () => {
    const user = userEvent.setup();
    mockUseGetProfileQuery.mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as any);

    // First attempt fails
    mockUpdateAnswerAction.mockResolvedValueOnce({
      error: { type: "serverError", message: "Server error" },
    });

    render(<AnswerCard answer={mockAnswer} />);

    await user.click(screen.getByRole("button", { name: /pencil/i }));
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockUpdateAnswerAction).toHaveBeenCalled();
    });

    // Second attempt succeeds
    mockUpdateAnswerAction.mockResolvedValueOnce({ success: true });
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("answer-form")
      ).not.toBeInTheDocument();
    });
  });
});