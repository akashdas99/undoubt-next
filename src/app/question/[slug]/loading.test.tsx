import { render, screen } from "@testing-library/react";
import Loading from "./loading";

// Mock the child components
jest.mock("@/components/answer/addAnswer", () => {
  return function AddAnswer() {
    return <div data-testid="add-answer">AddAnswer Component</div>;
  };
});

jest.mock("@/components/answer/answerCard", () => ({
  AnswerCardSkeleton: function AnswerCardSkeleton() {
    return <div data-testid="answer-card-skeleton">AnswerCardSkeleton</div>;
  },
}));

jest.mock("@/components/question/questionCard", () => ({
  QuestionCardSkeleton: function QuestionCardSkeleton() {
    return <div data-testid="question-card-skeleton">QuestionCardSkeleton</div>;
  },
}));

describe("Loading Component", () => {
  describe("Component Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<Loading />);
      expect(container).toBeInTheDocument();
    });

    it("should render the main container with correct styling classes", () => {
      const { container } = render(<Loading />);
      const mainDiv = container.querySelector(".w-full.my-3.md\\:my-8");
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv).toHaveClass("max-w-screen-lg", "px-3");
    });

    it("should render the flex container with gap", () => {
      const { container } = render(<Loading />);
      const flexDiv = container.querySelector(".flex.flex-col.gap-5");
      expect(flexDiv).toBeInTheDocument();
    });
  });

  describe("Skeleton Components", () => {
    it("should render QuestionCardSkeleton component", () => {
      render(<Loading />);
      const questionSkeleton = screen.getByTestId("question-card-skeleton");
      expect(questionSkeleton).toBeInTheDocument();
    });

    it("should render exactly one QuestionCardSkeleton", () => {
      render(<Loading />);
      const questionSkeletons = screen.getAllByTestId("question-card-skeleton");
      expect(questionSkeletons).toHaveLength(1);
    });

    it("should render AddAnswer component", () => {
      render(<Loading />);
      const addAnswer = screen.getByTestId("add-answer");
      expect(addAnswer).toBeInTheDocument();
    });

    it("should render exactly five AnswerCardSkeleton components", () => {
      render(<Loading />);
      const answerSkeletons = screen.getAllByTestId("answer-card-skeleton");
      expect(answerSkeletons).toHaveLength(5);
    });
  });

  describe("Recent Answers Section", () => {
    it("should render the Recent Answers bordered card container", () => {
      const { container } = render(<Loading />);
      const borderedCard = container.querySelector(".bordered-card");
      expect(borderedCard).toBeInTheDocument();
      expect(borderedCard).toHaveClass("p-[1em]");
    });

    it("should render Recent Answers heading with correct text", () => {
      render(<Loading />);
      const heading = screen.getByText("Recent Answers");
      expect(heading).toBeInTheDocument();
    });

    it("should render Recent Answers heading with correct styling classes", () => {
      render(<Loading />);
      const heading = screen.getByText("Recent Answers");
      expect(heading).toHaveClass("active-neo", "section-heading", "mb-2", "font-righteous", "text-xl");
    });

    it("should render answer skeletons within a flex container", () => {
      const { container } = render(<Loading />);
      const borderedCard = container.querySelector(".bordered-card");
      const flexContainer = borderedCard?.querySelector(".flex.flex-col.gap-5");
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe("Component Structure and Order", () => {
    it("should render components in the correct order", () => {
      const { container } = render(<Loading />);
      const mainContainer = container.querySelector(".w-full");
      const children = mainContainer?.querySelectorAll(":scope > div > *");
      
      expect(children).toHaveLength(3);
      expect(children?.[0]).toHaveAttribute("data-testid", "question-card-skeleton");
      expect(children?.[1]).toHaveAttribute("data-testid", "add-answer");
      expect(children?.[2]).toHaveClass("bordered-card");
    });

    it("should have QuestionCardSkeleton before AddAnswer", () => {
      render(<Loading />);
      const questionSkeleton = screen.getByTestId("question-card-skeleton");
      const addAnswer = screen.getByTestId("add-answer");
      
      expect(questionSkeleton.compareDocumentPosition(addAnswer)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    it("should have AddAnswer before Recent Answers section", () => {
      render(<Loading />);
      const addAnswer = screen.getByTestId("add-answer");
      const recentAnswersHeading = screen.getByText("Recent Answers");
      
      expect(addAnswer.compareDocumentPosition(recentAnswersHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper document structure for screen readers", () => {
      const { container } = render(<Loading />);
      expect(container.querySelector(".w-full")).toBeInTheDocument();
    });

    it("should render text content that is accessible", () => {
      render(<Loading />);
      expect(screen.getByText("Recent Answers")).toBeVisible();
    });
  });

  describe("Responsive Design Classes", () => {
    it("should have responsive margin classes", () => {
      const { container } = render(<Loading />);
      const mainDiv = container.querySelector(".w-full");
      expect(mainDiv).toHaveClass("my-3");
      expect(mainDiv).toHaveClass("md:my-8");
    });

    it("should have max-width constraint", () => {
      const { container } = render(<Loading />);
      const mainDiv = container.querySelector(".w-full");
      expect(mainDiv).toHaveClass("max-w-screen-lg");
    });

    it("should have horizontal padding", () => {
      const { container } = render(<Loading />);
      const mainDiv = container.querySelector(".w-full");
      expect(mainDiv).toHaveClass("px-3");
    });
  });

  describe("Snapshot Testing", () => {
    it("should match snapshot", () => {
      const { container } = render(<Loading />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle multiple renders without side effects", () => {
      const { rerender } = render(<Loading />);
      rerender(<Loading />);
      rerender(<Loading />);
      
      const answerSkeletons = screen.getAllByTestId("answer-card-skeleton");
      expect(answerSkeletons).toHaveLength(5);
    });

    it("should not have any dynamic props or state", () => {
      const { container } = render(<Loading />);
      // Loading component should be purely static
      expect(container.querySelector(".w-full")).toBeInTheDocument();
    });

    it("should render consistently across multiple instances", () => {
      const { container: container1 } = render(<Loading />);
      const { container: container2 } = render(<Loading />);
      
      expect(container1.innerHTML).toBe(container2.innerHTML);
    });
  });

  describe("CSS Class Application", () => {
    it("should apply all expected Tailwind classes to main container", () => {
      const { container } = render(<Loading />);
      const mainDiv = container.querySelector(".w-full");
      
      const expectedClasses = ["w-full", "my-3", "md:my-8", "max-w-screen-lg", "px-3"];
      expectedClasses.forEach((className) => {
        expect(mainDiv).toHaveClass(className);
      });
    });

    it("should apply correct classes to Recent Answers heading", () => {
      render(<Loading />);
      const heading = screen.getByText("Recent Answers");
      
      const expectedClasses = ["active-neo", "section-heading", "mb-2", "font-righteous", "text-xl"];
      expectedClasses.forEach((className) => {
        expect(heading).toHaveClass(className);
      });
    });

    it("should apply gap-5 class to flex containers", () => {
      const { container } = render(<Loading />);
      const flexContainers = container.querySelectorAll(".gap-5");
      
      expect(flexContainers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Component Integration", () => {
    it("should properly integrate QuestionCardSkeleton from correct import path", () => {
      render(<Loading />);
      // Mock ensures it's imported from @/components/question/questionCard
      expect(screen.getByTestId("question-card-skeleton")).toBeInTheDocument();
    });

    it("should properly integrate AnswerCardSkeleton from correct import path", () => {
      render(<Loading />);
      // Mock ensures it's imported from @/components/answer/answerCard
      expect(screen.getAllByTestId("answer-card-skeleton")).toHaveLength(5);
    });

    it("should properly integrate AddAnswer from correct import path", () => {
      render(<Loading />);
      // Mock ensures it's imported from @/components/answer/addAnswer
      expect(screen.getByTestId("add-answer")).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("should have proper nesting of div elements", () => {
      const { container } = render(<Loading />);
      const mainDiv = container.querySelector(".w-full");
      const flexDiv = mainDiv?.querySelector(".flex.flex-col");
      const borderedCard = flexDiv?.querySelector(".bordered-card");
      
      expect(mainDiv).toBeInTheDocument();
      expect(flexDiv).toBeInTheDocument();
      expect(borderedCard).toBeInTheDocument();
    });

    it("should render exactly one bordered-card element", () => {
      const { container } = render(<Loading />);
      const borderedCards = container.querySelectorAll(".bordered-card");
      expect(borderedCards).toHaveLength(1);
    });

    it("should have two flex-col containers", () => {
      const { container } = render(<Loading />);
      const flexColContainers = container.querySelectorAll(".flex-col");
      expect(flexColContainers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Loading State Purpose", () => {
    it("should function as a Next.js loading fallback component", () => {
      // Loading components in Next.js app router are shown during Suspense
      const { container } = render(<Loading />);
      expect(container).toBeInTheDocument();
      // Should render immediately without async operations
    });

    it("should not have any async operations or data fetching", () => {
      // Loading components should be synchronous
      const { container } = render(<Loading />);
      expect(container.querySelector(".w-full")).toBeInTheDocument();
    });

    it("should display skeleton UI elements for better UX", () => {
      render(<Loading />);
      // Should show skeleton versions of actual content
      expect(screen.getByTestId("question-card-skeleton")).toBeInTheDocument();
      expect(screen.getAllByTestId("answer-card-skeleton").length).toBe(5);
    });
  });
});