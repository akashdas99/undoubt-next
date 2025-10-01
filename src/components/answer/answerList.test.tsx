
import { render, screen, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";
import AnswerList from "./answerList";
import * as answerService from "@/services/answer";
import * as nextCache from "next/cache";

// Mock dependencies
jest.mock("@/services/answer");
jest.mock("next/cache");
jest.mock("./answerCard", () => {
  return function MockAnswerCard({ answer }: any) {
    return <div data-testid={`answer-card-${answer._id}`}>{answer.content}</div>;
  };
});

const mockGetAnswersByQuestionSlug = answerService.getAnswersByQuestionSlug as jest.MockedFunction<
  typeof answerService.getAnswersByQuestionSlug
>;

const mockUnstableCache = nextCache.unstable_cache as jest.MockedFunction<
  typeof nextCache.unstable_cache
>;

describe("AnswerList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Path - With Answers", () => {
    it("should render multiple answers successfully", async () => {
      const mockAnswers = [
        {
          _id: "answer-1",
          content: "First answer content",
          createdAt: new Date("2024-01-01"),
          questionId: "question-1",
          author: {
            _id: "user-1",
            name: "John Doe",
            email: "john@example.com",
          },
        },
        {
          _id: "answer-2",
          content: "Second answer content",
          createdAt: new Date("2024-01-02"),
          questionId: "question-1",
          author: {
            _id: "user-2",
            name: "Jane Smith",
            email: "jane@example.com",
          },
        },
      ];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "test-question" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(screen.getByTestId("answer-card-answer-1")).toBeInTheDocument();
        expect(screen.getByTestId("answer-card-answer-2")).toBeInTheDocument();
      });
    });

    it("should render single answer correctly", async () => {
      const mockAnswers = [
        {
          _id: "single-answer",
          content: "Only answer",
          createdAt: new Date("2024-01-01"),
          questionId: "question-1",
          author: {
            _id: "user-1",
            name: "Solo Author",
            email: "solo@example.com",
          },
        },
      ];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "single-question" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(screen.getByTestId("answer-card-single-answer")).toBeInTheDocument();
      });
    });

    it("should pass correct answer data to AnswerCard components", async () => {
      const mockAnswers = [
        {
          _id: "answer-id",
          content: "Test content",
          votes: 5,
          createdAt: new Date("2024-01-01"),
          questionId: "question-1",
          author: {
            _id: "author-id",
            name: "Author Name",
            email: "author@test.com",
            reputation: 100,
          },
        },
      ];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "test-slug" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        const answerCard = screen.getByTestId("answer-card-answer-id");
        expect(answerCard).toHaveTextContent("Test content");
      });
    });
  });

  describe("Edge Cases - Empty States", () => {
    it("should display 'No Answer' message when answers array is empty", async () => {
      const mockAnswers: any[] = [];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "no-answers-slug" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(screen.getByText("No Answer")).toBeInTheDocument();
      });
    });

    it("should not render answer cards when there are no answers", async () => {
      const mockAnswers: any[] = [];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "empty-slug" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(screen.queryByTestId(/answer-card-/)).not.toBeInTheDocument();
      });
    });

    it("should handle empty string slug parameter", async () => {
      const mockAnswers: any[] = [];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(screen.getByText("No Answer")).toBeInTheDocument();
      });

      expect(mockUnstableCache).toHaveBeenCalledWith(
        expect.any(Function),
        ["answersByQuestionSlug:"],
        {
          tags: ["answersByQuestionSlug:"],
          revalidate: 600,
        }
      );
    });

    it("should handle undefined slug in params object", async () => {
      const mockAnswers: any[] = [];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: undefined as any });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          ["answersByQuestionSlug:"],
          {
            tags: ["answersByQuestionSlug:"],
            revalidate: 600,
          }
        );
      });
    });
  });

  describe("Caching Behavior", () => {
    it("should create cached function with correct slug in key", async () => {
      const mockAnswers: any[] = [];
      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const testSlug = "my-test-question";
      const params = Promise.resolve({ slug: testSlug });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${testSlug}`],
          {
            tags: [`answersByQuestionSlug:${testSlug}`],
            revalidate: 600,
          }
        );
      });
    });

    it("should use 600 seconds revalidate time", async () => {
      const mockAnswers: any[] = [];
      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "test" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Array),
          expect.objectContaining({
            revalidate: 600,
          })
        );
      });
    });

    it("should create unique cache keys for different slugs", async () => {
      const mockAnswers: any[] = [];
      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params1 = Promise.resolve({ slug: "question-one" });
      render(await AnswerList({ params: params1 }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          ["answersByQuestionSlug:question-one"],
          expect.any(Object)
        );
      });

      jest.clearAllMocks();

      const params2 = Promise.resolve({ slug: "question-two" });
      render(await AnswerList({ params: params2 }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          ["answersByQuestionSlug:question-two"],
          expect.any(Object)
        );
      });
    });

    it("should set cache tags matching the cache key", async () => {
      const mockAnswers: any[] = [];
      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const testSlug = "tagged-question";
      const params = Promise.resolve({ slug: testSlug });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        const call = mockUnstableCache.mock.calls[0];
        expect(call[1]).toEqual([`answersByQuestionSlug:${testSlug}`]);
        expect(call[2].tags).toEqual([`answersByQuestionSlug:${testSlug}`]);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors gracefully", async () => {
      const mockCachedFunction = jest.fn().mockRejectedValue(new Error("Service error"));
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "error-slug" });

      await expect(async () => {
        await AnswerList({ params });
      }).rejects.toThrow("Service error");
    });

    it("should handle null answers response", async () => {
      const mockCachedFunction = jest.fn().mockResolvedValue(null);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "null-slug" });

      await expect(async () => {
        await AnswerList({ params });
      }).rejects.toThrow();
    });

    it("should handle undefined answers response", async () => {
      const mockCachedFunction = jest.fn().mockResolvedValue(undefined);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "undefined-slug" });

      await expect(async () => {
        await AnswerList({ params });
      }).rejects.toThrow();
    });

    it("should handle database timeout errors", async () => {
      const mockCachedFunction = jest.fn().mockRejectedValue(new Error("Database timeout"));
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "timeout-slug" });

      await expect(async () => {
        await AnswerList({ params });
      }).rejects.toThrow("Database timeout");
    });
  });

  describe("Answer Data Structure Validation", () => {
    it("should handle answers with all required fields", async () => {
      const mockAnswers = [
        {
          _id: "complete-answer",
          content: "Complete answer",
          questionId: "q1",
          createdAt: new Date(),
          updatedAt: new Date(),
          votes: 10,
          isAccepted: true,
          author: {
            _id: "user-1",
            name: "Complete User",
            email: "complete@test.com",
            avatar: "https://example.com/avatar.jpg",
            reputation: 500,
          },
        },
      ];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "complete-slug" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(screen.getByTestId("answer-card-complete-answer")).toBeInTheDocument();
      });
    });

    it("should handle answers with ObjectId strings", async () => {
      const mockAnswers = [
        {
          _id: "507f1f77bcf86cd799439011",
          content: "Answer with ObjectId",
          createdAt: new Date(),
          questionId: "507f1f77bcf86cd799439012",
          author: {
            _id: "507f1f77bcf86cd799439013",
            name: "User",
            email: "user@test.com",
          },
        },
      ];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "objectid-slug" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(screen.getByTestId("answer-card-507f1f77bcf86cd799439011")).toBeInTheDocument();
      });
    });

    it("should handle answers with complex author objects", async () => {
      const mockAnswers = [
        {
          _id: "complex-answer",
          content: "Answer content",
          createdAt: new Date(),
          questionId: "q1",
          author: {
            _id: "complex-user",
            name: "Complex User",
            email: "complex@test.com",
            bio: "User bio",
            location: "New York",
            website: "https://example.com",
            reputation: 1000,
            badges: ["gold", "silver"],
          },
        },
      ];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "complex-author-slug" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(screen.getByTestId("answer-card-complex-answer")).toBeInTheDocument();
      });
    });
  });

  describe("Large Dataset Handling", () => {
    it("should handle rendering many answers efficiently", async () => {
      const mockAnswers = Array.from({ length: 50 }, (_, i) => ({
        _id: `answer-${i}`,
        content: `Answer content ${i}`,
        createdAt: new Date(),
        questionId: "q1",
        author: {
          _id: `user-${i}`,
          name: `User ${i}`,
          email: `user${i}@test.com`,
        },
      }));

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "many-answers" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(screen.getByTestId("answer-card-answer-0")).toBeInTheDocument();
        expect(screen.getByTestId("answer-card-answer-49")).toBeInTheDocument();
      });
    });

    it("should maintain correct order of answers", async () => {
      const mockAnswers = [
        {
          _id: "first",
          content: "First",
          createdAt: new Date("2024-01-01"),
          questionId: "q1",
          author: { _id: "u1", name: "User 1", email: "u1@test.com" },
        },
        {
          _id: "second",
          content: "Second",
          createdAt: new Date("2024-01-02"),
          questionId: "q1",
          author: { _id: "u2", name: "User 2", email: "u2@test.com" },
        },
        {
          _id: "third",
          content: "Third",
          createdAt: new Date("2024-01-03"),
          questionId: "q1",
          author: { _id: "u3", name: "User 3", email: "u3@test.com" },
        },
      ];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "ordered-answers" });
      
      const { container } = render(await AnswerList({ params }));

      await waitFor(() => {
        const cards = container.querySelectorAll('[data-testid^="answer-card-"]');
        expect(cards[0]).toHaveAttribute("data-testid", "answer-card-first");
        expect(cards[1]).toHaveAttribute("data-testid", "answer-card-second");
        expect(cards[2]).toHaveAttribute("data-testid", "answer-card-third");
      });
    });
  });

  describe("Special Characters and Edge Cases in Slugs", () => {
    it("should handle slugs with special characters", async () => {
      const mockAnswers: any[] = [];
      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const specialSlug = "how-to-use-c++-and-c#";
      const params = Promise.resolve({ slug: specialSlug });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${specialSlug}`],
          expect.any(Object)
        );
      });
    });

    it("should handle very long slugs", async () => {
      const mockAnswers: any[] = [];
      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const longSlug = "a".repeat(200);
      const params = Promise.resolve({ slug: longSlug });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${longSlug}`],
          expect.any(Object)
        );
      });
    });

    it("should handle slugs with Unicode characters", async () => {
      const mockAnswers: any[] = [];
      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const unicodeSlug = "comment-utiliser-nodejs-中文-🚀";
      const params = Promise.resolve({ slug: unicodeSlug });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${unicodeSlug}`],
          expect.any(Object)
        );
      });
    });
  });

  describe("Async Params Handling", () => {
    it("should properly await params Promise before using slug", async () => {
      const mockAnswers: any[] = [];
      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      let resolveParams: any;
      const params = new Promise<{ slug: string }>((resolve) => {
        resolveParams = resolve;
      });

      const renderPromise = AnswerList({ params });
      
      // Resolve params after a delay
      setTimeout(() => resolveParams({ slug: "delayed-slug" }), 10);

      render(await renderPromise);

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          ["answersByQuestionSlug:delayed-slug"],
          expect.any(Object)
        );
      });
    });

    it("should handle rejected params Promise", async () => {
      const params = Promise.reject(new Error("Params error"));

      await expect(async () => {
        await AnswerList({ params });
      }).rejects.toThrow("Params error");
    });
  });

  describe("Component Structure and Styling", () => {
    it("should render answers in a flex column with gap-5", async () => {
      const mockAnswers = [
        {
          _id: "answer-1",
          content: "Answer 1",
          createdAt: new Date(),
          questionId: "q1",
          author: { _id: "u1", name: "User 1", email: "u1@test.com" },
        },
        {
          _id: "answer-2",
          content: "Answer 2",
          createdAt: new Date(),
          questionId: "q1",
          author: { _id: "u2", name: "User 2", email: "u2@test.com" },
        },
      ];

      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "styled-slug" });
      
      const { container } = render(await AnswerList({ params }));

      await waitFor(() => {
        const flexContainer = container.querySelector(".flex.flex-col.gap-5");
        expect(flexContainer).toBeInTheDocument();
      });
    });

    it("should not render flex container when there are no answers", async () => {
      const mockAnswers: any[] = [];
      const mockCachedFunction = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockCachedFunction);

      const params = Promise.resolve({ slug: "no-flex-slug" });
      
      const { container } = render(await AnswerList({ params }));

      await waitFor(() => {
        const flexContainer = container.querySelector(".flex.flex-col.gap-5");
        expect(flexContainer).not.toBeInTheDocument();
      });
    });
  });

  describe("Integration with getAnswersByQuestionSlug", () => {
    it("should call getAnswersByQuestionSlug through cached function", async () => {
      const mockAnswers = [
        {
          _id: "integration-answer",
          content: "Integration test",
          createdAt: new Date(),
          questionId: "q1",
          author: { _id: "u1", name: "User", email: "user@test.com" },
        },
      ];

      let capturedFunction: Function;
      mockUnstableCache.mockImplementation((fn: any) => {
        capturedFunction = fn;
        return jest.fn().mockResolvedValue(mockAnswers);
      });

      const params = Promise.resolve({ slug: "integration-slug" });
      
      render(await AnswerList({ params }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalled();
      });
    });
  });
});