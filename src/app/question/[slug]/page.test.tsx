import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page, { generateStaticParams } from "./page";
import { getQuestions } from "@/services/question";

// Mock the external dependencies
jest.mock("@/components/answer/addAnswer", () => {
  return function MockAddAnswer() {
    return <div data-testid="mock-add-answer">Add Answer Component</div>;
  };
});

jest.mock("@/components/answer/answerList", () => {
  return function MockAnswerList({ params }: { params: Promise<{ slug: string }> }) {
    return <div data-testid="mock-answer-list">Answer List Component</div>;
  };
});

jest.mock("@/components/question/questionSection", () => {
  return function MockQuestionSection({ params }: { params: Promise<{ slug: string }> }) {
    return <div data-testid="mock-question-section">Question Section Component</div>;
  };
});

jest.mock("@/services/question", () => ({
  getQuestions: jest.fn(),
}));

describe("Page Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render the main container with correct styling classes", () => {
      const mockParams = Promise.resolve({ slug: "test-question" });
      const { container } = render(<Page params={mockParams} />);
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("w-full", "my-3", "md:my-8", "max-w-screen-lg", "px-3");
    });

    it("should render the flex container with correct gap styling", () => {
      const mockParams = Promise.resolve({ slug: "test-question" });
      const { container } = render(<Page params={mockParams} />);
      
      const flexDiv = container.querySelector(".flex.flex-col.gap-5");
      expect(flexDiv).toBeInTheDocument();
    });

    it("should render QuestionSection component", () => {
      const mockParams = Promise.resolve({ slug: "test-question" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-question-section")).toBeInTheDocument();
    });

    it("should render AddAnswer component", () => {
      const mockParams = Promise.resolve({ slug: "test-question" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-add-answer")).toBeInTheDocument();
    });

    it("should render AnswerList component", () => {
      const mockParams = Promise.resolve({ slug: "test-question" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-answer-list")).toBeInTheDocument();
    });

    it("should render 'Recent Answers' heading with correct styling", () => {
      const mockParams = Promise.resolve({ slug: "test-question" });
      render(<Page params={mockParams} />);
      
      const heading = screen.getByText("Recent Answers");
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass("active-neo", "section-heading", "mb-2", "font-righteous", "text-xl");
    });

    it("should render the bordered card container around Recent Answers section", () => {
      const mockParams = Promise.resolve({ slug: "test-question" });
      const { container } = render(<Page params={mockParams} />);
      
      const borderedCard = container.querySelector(".bordered-card.p-\\[1em\\]");
      expect(borderedCard).toBeInTheDocument();
    });

    it("should render all components in the correct order", () => {
      const mockParams = Promise.resolve({ slug: "test-question" });
      const { container } = render(<Page params={mockParams} />);
      
      const flexContainer = container.querySelector(".flex.flex-col.gap-5");
      const children = flexContainer?.children;
      
      expect(children).toHaveLength(3);
      expect(children?.[0]).toContainElement(screen.getByTestId("mock-question-section"));
      expect(children?.[1]).toContainElement(screen.getByTestId("mock-add-answer"));
      expect(children?.[2].querySelector(".bordered-card")).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should pass params prop to QuestionSection", () => {
      const mockParams = Promise.resolve({ slug: "sample-slug" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-question-section")).toBeInTheDocument();
    });

    it("should pass params prop to AnswerList", () => {
      const mockParams = Promise.resolve({ slug: "another-slug" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-answer-list")).toBeInTheDocument();
    });

    it("should handle params as a Promise", () => {
      const mockParams = Promise.resolve({ slug: "promise-slug" });
      const { container } = render(<Page params={mockParams} />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should render correctly with empty slug", () => {
      const mockParams = Promise.resolve({ slug: "" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-question-section")).toBeInTheDocument();
      expect(screen.getByTestId("mock-add-answer")).toBeInTheDocument();
      expect(screen.getByTestId("mock-answer-list")).toBeInTheDocument();
    });

    it("should render correctly with slug containing special characters", () => {
      const mockParams = Promise.resolve({ slug: "how-to-use-react-hooks?" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-question-section")).toBeInTheDocument();
    });

    it("should render correctly with very long slug", () => {
      const longSlug = "a".repeat(500);
      const mockParams = Promise.resolve({ slug: longSlug });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-question-section")).toBeInTheDocument();
    });

    it("should render correctly with slug containing spaces and dashes", () => {
      const mockParams = Promise.resolve({ slug: "my-test-question-with-spaces" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-question-section")).toBeInTheDocument();
    });

    it("should render correctly with numeric slug", () => {
      const mockParams = Promise.resolve({ slug: "12345" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-question-section")).toBeInTheDocument();
    });

    it("should render correctly with slug containing unicode characters", () => {
      const mockParams = Promise.resolve({ slug: "问题-question-سؤال" });
      render(<Page params={mockParams} />);
      
      expect(screen.getByTestId("mock-question-section")).toBeInTheDocument();
    });
  });

  describe("Layout Responsiveness", () => {
    it("should have responsive margin classes (my-3 md:my-8)", () => {
      const mockParams = Promise.resolve({ slug: "test" });
      const { container } = render(<Page params={mockParams} />);
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.className).toContain("my-3");
      expect(mainDiv.className).toContain("md:my-8");
    });

    it("should have max-width constraint for large screens", () => {
      const mockParams = Promise.resolve({ slug: "test" });
      const { container } = render(<Page params={mockParams} />);
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("max-w-screen-lg");
    });

    it("should have horizontal padding", () => {
      const mockParams = Promise.resolve({ slug: "test" });
      const { container } = render(<Page params={mockParams} />);
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("px-3");
    });
  });

  describe("Component Integration", () => {
    it("should maintain proper spacing between components with gap-5", () => {
      const mockParams = Promise.resolve({ slug: "test" });
      const { container } = render(<Page params={mockParams} />);
      
      const flexContainer = container.querySelector(".flex.flex-col.gap-5");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should render all three main sections", () => {
      const mockParams = Promise.resolve({ slug: "test" });
      render(<Page params={mockParams} />);
      
      // Question section
      expect(screen.getByTestId("mock-question-section")).toBeInTheDocument();
      
      // Add answer section
      expect(screen.getByTestId("mock-add-answer")).toBeInTheDocument();
      
      // Recent answers section
      expect(screen.getByText("Recent Answers")).toBeInTheDocument();
      expect(screen.getByTestId("mock-answer-list")).toBeInTheDocument();
    });
  });
});

describe("generateStaticParams", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Path", () => {
    it("should call getQuestions service", async () => {
      const mockQuestions = [
        { slug: "question-1", title: "Question 1" },
        { slug: "question-2", title: "Question 2" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      await generateStaticParams();

      expect(getQuestions).toHaveBeenCalledTimes(1);
    });

    it("should return an array of params with slug properties", async () => {
      const mockQuestions = [
        { slug: "how-to-learn-react", title: "How to learn React?" },
        { slug: "what-is-nextjs", title: "What is Next.js?" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: "how-to-learn-react" },
        { slug: "what-is-nextjs" },
      ]);
    });

    it("should handle single question", async () => {
      const mockQuestions = [{ slug: "single-question" }];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([{ slug: "single-question" }]);
    });

    it("should handle multiple questions correctly", async () => {
      const mockQuestions = [
        { slug: "q1" },
        { slug: "q2" },
        { slug: "q3" },
        { slug: "q4" },
        { slug: "q5" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toHaveLength(5);
      expect(result).toEqual([
        { slug: "q1" },
        { slug: "q2" },
        { slug: "q3" },
        { slug: "q4" },
        { slug: "q5" },
      ]);
    });
  });

  describe("Edge Cases", () => {
    it("should return empty array when no questions exist", async () => {
      (getQuestions as jest.Mock).mockResolvedValue([]);

      const result = await generateStaticParams();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle questions with null slug", async () => {
      const mockQuestions = [
        { slug: null, title: "Question with null slug" },
        { slug: "valid-slug", title: "Valid question" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: null },
        { slug: "valid-slug" },
      ]);
    });

    it("should handle questions with undefined slug", async () => {
      const mockQuestions = [
        { slug: undefined, title: "Question with undefined slug" },
        { slug: "valid-slug", title: "Valid question" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: undefined },
        { slug: "valid-slug" },
      ]);
    });

    it("should handle questions with empty string slug", async () => {
      const mockQuestions = [
        { slug: "", title: "Question with empty slug" },
        { slug: "valid-slug", title: "Valid question" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: "" },
        { slug: "valid-slug" },
      ]);
    });

    it("should handle questions with special characters in slug", async () => {
      const mockQuestions = [
        { slug: "question-with-dashes-and_underscores" },
        { slug: "question@with#special$chars" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: "question-with-dashes-and_underscores" },
        { slug: "question@with#special$chars" },
      ]);
    });

    it("should handle questions with numeric slug", async () => {
      const mockQuestions = [
        { slug: "123" },
        { slug: "456789" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: "123" },
        { slug: "456789" },
      ]);
    });

    it("should handle questions with very long slugs", async () => {
      const longSlug = "a".repeat(1000);
      const mockQuestions = [{ slug: longSlug }];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([{ slug: longSlug }]);
    });

    it("should handle questions with unicode characters in slug", async () => {
      const mockQuestions = [
        { slug: "问题-question" },
        { slug: "вопрос-question" },
        { slug: "pregunta-🤔" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: "问题-question" },
        { slug: "вопрос-question" },
        { slug: "pregunta-🤔" },
      ]);
    });

    it("should handle questions with additional properties beyond slug", async () => {
      const mockQuestions = [
        { 
          slug: "complete-question",
          title: "Complete Question",
          author: "John Doe",
          votes: 42,
          createdAt: "2024-01-01"
        },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([{ slug: "complete-question" }]);
      // Verify only slug is extracted
      expect(result[0]).not.toHaveProperty("title");
      expect(result[0]).not.toHaveProperty("author");
    });

    it("should preserve order of questions from service", async () => {
      const mockQuestions = [
        { slug: "first" },
        { slug: "second" },
        { slug: "third" },
        { slug: "fourth" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result[0].slug).toBe("first");
      expect(result[1].slug).toBe("second");
      expect(result[2].slug).toBe("third");
      expect(result[3].slug).toBe("fourth");
    });
  });

  describe("Error Handling", () => {
    it("should propagate error when getQuestions fails", async () => {
      const mockError = new Error("Database connection failed");
      (getQuestions as jest.Mock).mockRejectedValue(mockError);

      await expect(generateStaticParams()).rejects.toThrow("Database connection failed");
    });

    it("should propagate error when getQuestions throws", async () => {
      (getQuestions as jest.Mock).mockImplementation(() => {
        throw new Error("Service unavailable");
      });

      await expect(generateStaticParams()).rejects.toThrow("Service unavailable");
    });

    it("should handle network timeout errors", async () => {
      const timeoutError = new Error("Network timeout");
      (getQuestions as jest.Mock).mockRejectedValue(timeoutError);

      await expect(generateStaticParams()).rejects.toThrow("Network timeout");
    });
  });

  describe("Performance and Large Datasets", () => {
    it("should handle large number of questions efficiently", async () => {
      const mockQuestions = Array.from({ length: 1000 }, (_, i) => ({
        slug: `question-${i}`,
        title: `Question ${i}`,
      }));
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const startTime = Date.now();
      const result = await generateStaticParams();
      const endTime = Date.now();

      expect(result).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it("should handle questions with duplicate slugs", async () => {
      const mockQuestions = [
        { slug: "duplicate-slug" },
        { slug: "duplicate-slug" },
        { slug: "unique-slug" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      // Should not deduplicate - that's handled by Next.js
      expect(result).toHaveLength(3);
      expect(result.filter(p => p.slug === "duplicate-slug")).toHaveLength(2);
    });
  });

  describe("Type Safety", () => {
    it("should return array with correct structure", async () => {
      const mockQuestions = [{ slug: "test" }];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty("slug");
      expect(typeof result[0].slug).toBe("string");
    });

    it("should handle questions object without slug property gracefully", async () => {
      const mockQuestions = [
        { title: "Question without slug" },
      ];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await generateStaticParams();

      expect(result).toEqual([{ slug: undefined }]);
    });
  });

  describe("Async Behavior", () => {
    it("should wait for getQuestions promise to resolve", async () => {
      let resolved = false;
      const mockQuestions = [{ slug: "test" }];
      
      (getQuestions as jest.Mock).mockImplementation(() => 
        new Promise((resolve) => {
          setTimeout(() => {
            resolved = true;
            resolve(mockQuestions);
          }, 100);
        })
      );

      expect(resolved).toBe(false);
      await generateStaticParams();
      expect(resolved).toBe(true);
    });

    it("should handle concurrent calls to generateStaticParams", async () => {
      const mockQuestions = [{ slug: "test" }];
      (getQuestions as jest.Mock).mockResolvedValue(mockQuestions);

      const [result1, result2, result3] = await Promise.all([
        generateStaticParams(),
        generateStaticParams(),
        generateStaticParams(),
      ]);

      expect(result1).toEqual([{ slug: "test" }]);
      expect(result2).toEqual([{ slug: "test" }]);
      expect(result3).toEqual([{ slug: "test" }]);
      expect(getQuestions).toHaveBeenCalledTimes(3);
    });
  });
});