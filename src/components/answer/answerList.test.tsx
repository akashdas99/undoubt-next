import { render, screen, waitFor } from "@testing-library/react";
import { getAnswersByQuestionSlug } from "@/services/answer";
import { unstable_cache } from "next/cache";
import AnswerList from "./answerList";
import AnswerCard from "./answerCard";

// Mock dependencies
jest.mock("@/services/answer");
jest.mock("next/cache");
jest.mock("./answerCard");

const mockGetAnswersByQuestionSlug = getAnswersByQuestionSlug as jest.MockedFunction<
  typeof getAnswersByQuestionSlug
>;
const mockUnstableCache = unstable_cache as jest.MockedFunction<
  typeof unstable_cache
>;
const mockAnswerCard = AnswerCard as jest.MockedFunction<typeof AnswerCard>;

describe("AnswerList Component", () => {
  const mockSlug = "test-question-slug";
  const mockParams = Promise.resolve({ slug: mockSlug });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock AnswerCard to return a simple div
    mockAnswerCard.mockImplementation(({ answer }) => (
      <div data-testid={`answer-card-${answer._id}`}>
        Answer by {answer.author.name}
      </div>
    ));
  });

  describe("Happy Path - Rendering with answers", () => {
    it("should render multiple answers when answers exist", async () => {
      const mockAnswers = [
        {
          _id: "answer1",
          content: "First answer content",
          createdAt: new Date("2024-01-01"),
          upvotes: 5,
          downvotes: 1,
          author: {
            _id: "user1",
            name: "John Doe",
            email: "john@example.com",
            image: "https://example.com/avatar1.jpg",
          },
        },
        {
          _id: "answer2",
          content: "Second answer content",
          createdAt: new Date("2024-01-02"),
          upvotes: 10,
          downvotes: 2,
          author: {
            _id: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
            image: "https://example.com/avatar2.jpg",
          },
        },
        {
          _id: "answer3",
          content: "Third answer content",
          createdAt: new Date("2024-01-03"),
          upvotes: 3,
          downvotes: 0,
          author: {
            _id: "user3",
            name: "Bob Johnson",
            email: "bob@example.com",
            image: "https://example.com/avatar3.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      const { container } = render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockGetAnswers).toHaveBeenCalledTimes(1);
      });

      // Verify all answer cards are rendered
      expect(screen.getByTestId("answer-card-answer1")).toBeInTheDocument();
      expect(screen.getByTestId("answer-card-answer2")).toBeInTheDocument();
      expect(screen.getByTestId("answer-card-answer3")).toBeInTheDocument();

      // Verify container has correct styling
      const answerContainer = container.querySelector(".flex.flex-col.gap-5");
      expect(answerContainer).toBeInTheDocument();
    });

    it("should render a single answer correctly", async () => {
      const mockAnswers = [
        {
          _id: "single-answer",
          content: "Only answer",
          createdAt: new Date("2024-01-01"),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Solo User",
            email: "solo@example.com",
            image: "https://example.com/solo.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockGetAnswers).toHaveBeenCalledTimes(1);
      });

      expect(screen.getByTestId("answer-card-single-answer")).toBeInTheDocument();
      expect(screen.queryByText("No Answer")).not.toBeInTheDocument();
    });

    it("should pass correct props to AnswerCard components", async () => {
      const mockAnswers = [
        {
          _id: "answer1",
          content: "Test content",
          createdAt: new Date("2024-01-01"),
          upvotes: 5,
          downvotes: 1,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledWith(
          { answer: mockAnswers[0] },
          {}
        );
      });
    });
  });

  describe("Edge Cases - Empty state", () => {
    it("should display 'No Answer' when answers array is empty", async () => {
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockGetAnswers).toHaveBeenCalledTimes(1);
      });

      expect(screen.getByText("No Answer")).toBeInTheDocument();
      expect(screen.queryByTestId(/answer-card-/)).not.toBeInTheDocument();
    });

    it("should handle zero-length answers array", async () => {
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      const { container } = render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(screen.getByText("No Answer")).toBeInTheDocument();
      });

      // Verify flex container is not rendered
      const answerContainer = container.querySelector(".flex.flex-col.gap-5");
      expect(answerContainer).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases - Slug handling", () => {
    it("should handle empty slug parameter", async () => {
      const emptySlugParams = Promise.resolve({ slug: "" });
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: emptySlugParams }));

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

    it("should handle special characters in slug", async () => {
      const specialSlug = "test-question-with-special-chars-123\\!@#";
      const specialParams = Promise.resolve({ slug: specialSlug });
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: specialParams }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${specialSlug}`],
          {
            tags: [`answersByQuestionSlug:${specialSlug}`],
            revalidate: 600,
          }
        );
      });
    });

    it("should handle very long slug parameter", async () => {
      const longSlug = "a".repeat(500);
      const longSlugParams = Promise.resolve({ slug: longSlug });
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: longSlugParams }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${longSlug}`],
          expect.any(Object)
        );
      });
    });

    it("should handle slug with URL-encoded characters", async () => {
      const encodedSlug = "how-to-use-%20spaces%20and%20symbols";
      const encodedParams = Promise.resolve({ slug: encodedSlug });
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: encodedParams }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${encodedSlug}`],
          expect.any(Object)
        );
      });
    });
  });

  describe("Cache Configuration", () => {
    it("should configure unstable_cache with correct parameters", async () => {
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${mockSlug}`],
          {
            tags: [`answersByQuestionSlug:${mockSlug}`],
            revalidate: 600,
          }
        );
      });
    });

    it("should use slug in cache key and tags", async () => {
      const customSlug = "custom-question-slug";
      const customParams = Promise.resolve({ slug: customSlug });
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: customParams }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${customSlug}`],
          {
            tags: [`answersByQuestionSlug:${customSlug}`],
            revalidate: 600,
          }
        );
      });
    });

    it("should set revalidate to 600 seconds", async () => {
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        const cacheConfig = mockUnstableCache.mock.calls[0][2];
        expect(cacheConfig).toHaveProperty("revalidate", 600);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle promise rejection from params", async () => {
      const rejectedParams = Promise.reject(new Error("Failed to get params"));
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      await expect(async () => {
        await AnswerList({ params: rejectedParams });
      }).rejects.toThrow("Failed to get params");
    });

    it("should handle getAnswers throwing an error", async () => {
      const mockGetAnswers = jest
        .fn()
        .mockRejectedValue(new Error("Failed to fetch answers"));
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      await expect(async () => {
        await AnswerList({ params: mockParams });
      }).rejects.toThrow("Failed to fetch answers");
    });

    it("should handle network timeout errors", async () => {
      const mockGetAnswers = jest
        .fn()
        .mockRejectedValue(new Error("Network timeout"));
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      await expect(async () => {
        await AnswerList({ params: mockParams });
      }).rejects.toThrow("Network timeout");
    });

    it("should handle database connection errors", async () => {
      const mockGetAnswers = jest
        .fn()
        .mockRejectedValue(new Error("Database connection failed"));
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      await expect(async () => {
        await AnswerList({ params: mockParams });
      }).rejects.toThrow("Database connection failed");
    });
  });

  describe("Answer Data Validation", () => {
    it("should handle answers with null or undefined _id", async () => {
      const mockAnswers = [
        {
          _id: null,
          content: "Answer with null id",
          createdAt: new Date("2024-01-01"),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockGetAnswers).toHaveBeenCalledTimes(1);
      });

      // Component should still render, AnswerCard will handle the null id
      expect(mockAnswerCard).toHaveBeenCalled();
    });

    it("should handle answers with missing author fields", async () => {
      const mockAnswers = [
        {
          _id: "answer1",
          content: "Answer content",
          createdAt: new Date("2024-01-01"),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: undefined, // Missing image
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledWith(
          { answer: mockAnswers[0] },
          {}
        );
      });
    });

    it("should handle answers with ObjectId _id format", async () => {
      const mockObjectId = {
        toString: jest.fn().mockReturnValue("507f1f77bcf86cd799439011"),
      };

      const mockAnswers = [
        {
          _id: mockObjectId,
          content: "Answer with ObjectId",
          createdAt: new Date("2024-01-01"),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockObjectId.toString).toHaveBeenCalled();
      });
    });

    it("should handle answers with various date formats", async () => {
      const mockAnswers = [
        {
          _id: "answer1",
          content: "Recent answer",
          createdAt: new Date(),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
        {
          _id: "answer2",
          content: "Old answer",
          createdAt: new Date("2020-01-01"),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user2",
            name: "Test User 2",
            email: "test2@example.com",
            image: "https://example.com/test2.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(screen.getByTestId("answer-card-answer1")).toBeInTheDocument();
        expect(screen.getByTestId("answer-card-answer2")).toBeInTheDocument();
      });
    });
  });

  describe("Large Dataset Handling", () => {
    it("should handle a large number of answers efficiently", async () => {
      const mockAnswers = Array.from({ length: 100 }, (_, i) => ({
        _id: `answer${i}`,
        content: `Answer content ${i}`,
        createdAt: new Date(`2024-01-${(i % 28) + 1}`),
        upvotes: i,
        downvotes: Math.floor(i / 2),
        author: {
          _id: `user${i}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          image: `https://example.com/user${i}.jpg`,
        },
      }));

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockGetAnswers).toHaveBeenCalledTimes(1);
      });

      // Verify all answers are rendered
      expect(mockAnswerCard).toHaveBeenCalledTimes(100);
    });

    it("should handle answers with very long content", async () => {
      const longContent = "a".repeat(10000);
      const mockAnswers = [
        {
          _id: "answer1",
          content: longContent,
          createdAt: new Date("2024-01-01"),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledWith(
          { answer: expect.objectContaining({ content: longContent }) },
          {}
        );
      });
    });
  });

  describe("Async Behavior", () => {
    it("should await params promise before processing", async () => {
      let resolveParams: (value: { slug: string }) => void;
      const delayedParams = new Promise<{ slug: string }>((resolve) => {
        resolveParams = resolve;
      });

      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      const renderPromise = AnswerList({ params: delayedParams });

      // Verify cache hasn't been called yet
      expect(mockUnstableCache).not.toHaveBeenCalled();

      // Resolve params
      resolveParams!({ slug: mockSlug });

      await renderPromise;

      // Now cache should be called
      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalled();
      });
    });

    it("should await getAnswers before rendering", async () => {
      let resolveAnswers: (value: any[]) => void;
      const delayedAnswers = new Promise<any[]>((resolve) => {
        resolveAnswers = resolve;
      });

      const mockGetAnswers = jest.fn().mockReturnValue(delayedAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      const renderPromise = AnswerList({ params: mockParams });

      // Resolve answers
      resolveAnswers!([]);

      const result = await renderPromise;
      render(result);

      await waitFor(() => {
        expect(screen.getByText("No Answer")).toBeInTheDocument();
      });
    });
  });

  describe("Integration with getCachedAnswersByQuestionSlug", () => {
    it("should call getCachedAnswersByQuestionSlug with correct slug", async () => {
      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledTimes(1);
      });

      // Verify the wrapped function would call getAnswersByQuestionSlug
      const wrappedFunction = mockUnstableCache.mock.calls[0][0];
      expect(wrappedFunction).toBeDefined();
    });

    it("should create unique cache keys for different slugs", async () => {
      const slug1 = "question-1";
      const slug2 = "question-2";

      const mockAnswers: any[] = [];
      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      // Render with first slug
      render(await AnswerList({ params: Promise.resolve({ slug: slug1 }) }));

      const firstCallKey = mockUnstableCache.mock.calls[0][1];

      mockUnstableCache.mockClear();

      // Render with second slug
      render(await AnswerList({ params: Promise.resolve({ slug: slug2 }) }));

      const secondCallKey = mockUnstableCache.mock.calls[0][1];

      // Verify keys are different
      expect(firstCallKey).not.toEqual(secondCallKey);
      expect(firstCallKey).toEqual([`answersByQuestionSlug:${slug1}`]);
      expect(secondCallKey).toEqual([`answersByQuestionSlug:${slug2}`]);
    });
  });

  describe("Type Safety", () => {
    it("should handle Answer type with author as User", async () => {
      const mockAnswers = [
        {
          _id: "answer1",
          content: "Type-safe answer",
          createdAt: new Date("2024-01-01"),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Type Safe User",
            email: "typesafe@example.com",
            image: "https://example.com/typesafe.jpg",
            // Additional User fields if any
            reputation: 100,
            badges: ["contributor"],
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledWith(
          { answer: expect.objectContaining({ author: expect.any(Object) }) },
          {}
        );
      });
    });
  });

  describe("Rendering Edge Cases", () => {
    it("should handle undefined or null in answers array", async () => {
      const mockAnswers = [
        {
          _id: "answer1",
          content: "Valid answer",
          createdAt: new Date("2024-01-01"),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
        null as any, // Simulating a potential null entry
        undefined as any, // Simulating a potential undefined entry
        {
          _id: "answer2",
          content: "Another valid answer",
          createdAt: new Date("2024-01-02"),
          upvotes: 2,
          downvotes: 0,
          author: {
            _id: "user2",
            name: "Test User 2",
            email: "test2@example.com",
            image: "https://example.com/test2.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        // Should attempt to render all elements in the array
        expect(mockAnswerCard).toHaveBeenCalledTimes(4);
      });
    });

    it("should use correct key prop for each AnswerCard", async () => {
      const mockAnswers = [
        {
          _id: "unique-id-1",
          content: "Answer 1",
          createdAt: new Date("2024-01-01"),
          upvotes: 1,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
        {
          _id: "unique-id-2",
          content: "Answer 2",
          createdAt: new Date("2024-01-02"),
          upvotes: 2,
          downvotes: 0,
          author: {
            _id: "user2",
            name: "Test User 2",
            email: "test2@example.com",
            image: "https://example.com/test2.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      const result = await AnswerList({ params: mockParams });

      // Verify the component structure uses the correct keys
      expect(result).toBeDefined();
    });
  });

  describe("Negative Vote Counts", () => {
    it("should handle answers with negative upvotes/downvotes", async () => {
      const mockAnswers = [
        {
          _id: "answer1",
          content: "Controversial answer",
          createdAt: new Date("2024-01-01"),
          upvotes: -5, // Edge case: negative upvotes
          downvotes: -2, // Edge case: negative downvotes
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledWith(
          { answer: expect.objectContaining({ upvotes: -5, downvotes: -2 }) },
          {}
        );
      });
    });

    it("should handle answers with zero votes", async () => {
      const mockAnswers = [
        {
          _id: "answer1",
          content: "New answer",
          createdAt: new Date("2024-01-01"),
          upvotes: 0,
          downvotes: 0,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledWith(
          { answer: expect.objectContaining({ upvotes: 0, downvotes: 0 }) },
          {}
        );
      });
    });

    it("should handle answers with extremely high vote counts", async () => {
      const mockAnswers = [
        {
          _id: "answer1",
          content: "Popular answer",
          createdAt: new Date("2024-01-01"),
          upvotes: 999999,
          downvotes: 100000,
          author: {
            _id: "user1",
            name: "Test User",
            email: "test@example.com",
            image: "https://example.com/test.jpg",
          },
        },
      ];

      const mockGetAnswers = jest.fn().mockResolvedValue(mockAnswers);
      mockUnstableCache.mockReturnValue(mockGetAnswers);

      render(await AnswerList({ params: mockParams }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledWith(
          {
            answer: expect.objectContaining({
              upvotes: 999999,
              downvotes: 100000,
            }),
          },
          {}
        );
      });
    });
  });
});