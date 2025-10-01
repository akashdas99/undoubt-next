/**
 * Unit tests for Loading component
 * Framework: Vitest
 * Libraries: @testing-library/react + @testing-library/jest-dom
 * Focus: Validate structure, ordering, counts, and styles from the PR diff.
 */
/// <reference types="vitest" />

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Loading from "./loading";

/* Mock child components to isolate Loading */
vi.mock("@/components/answer/addAnswer", () => ({
  default: () => <div data-testid="add-answer">Add Answer Component</div>,
}));

vi.mock("@/components/answer/answerCard", () => ({
  AnswerCardSkeleton: () => (
    <div data-testid="answer-card-skeleton">Answer Card Skeleton</div>
  ),
}));

vi.mock("@/components/question/questionCard", () => ({
  QuestionCardSkeleton: () => (
    <div data-testid="question-card-skeleton">Question Card Skeleton</div>
  ),
}));

describe("Loading (question/[slug])", () => {
  describe("Rendering and containers", () => {
    it("renders without crashing", () => {
      const { container } = render(<Loading />);
      expect(container).toBeTruthy();
    });

    it("renders the main container with expected Tailwind classes", () => {
      const { container } = render(<Loading />);
      const main = container.firstElementChild as HTMLElement | null;
      expect(main).not.toBeNull();
      expect(main).toHaveClass("w-full");
      expect(main).toHaveClass("my-3");
      expect(main).toHaveClass("md:my-8");
      expect(main).toHaveClass("max-w-screen-lg");
      expect(main).toHaveClass("px-3");
    });

    it("renders the layout flex column with gap", () => {
      const { container } = render(<Loading />);
      const flexCol = container.querySelector(".flex.flex-col.gap-5");
      expect(flexCol).toBeInTheDocument();
    });
  });

  describe("QuestionCardSkeleton", () => {
    it("renders exactly one QuestionCardSkeleton", () => {
      render(<Loading />);
      const items = screen.getAllByTestId("question-card-skeleton");
      expect(items).toHaveLength(1);
    });
  });

  describe("AddAnswer", () => {
    it("renders exactly one AddAnswer", () => {
      render(<Loading />);
      const items = screen.getAllByTestId("add-answer");
      expect(items).toHaveLength(1);
    });

    it("appears after QuestionCardSkeleton", () => {
      const { container } = render(<Loading />);
      const order = Array.from(
        container.querySelectorAll("[data-testid]")
      ).map((el) => (el as HTMLElement).dataset.testid);
      expect(order.indexOf("question-card-skeleton")).toBeGreaterThan(-1);
      expect(order.indexOf("add-answer")).toBeGreaterThan(-1);
      expect(order.indexOf("question-card-skeleton")).toBeLessThan(
        order.indexOf("add-answer")
      );
    });
  });

  describe("Recent Answers section", () => {
    it('renders a bordered card with padding "p-[1em]"', () => {
      const { container } = render(<Loading />);
      const bordered = container.querySelector(".bordered-card") as HTMLElement | null;
      expect(bordered).toBeInTheDocument();
      // Ensure it has the custom padding class
      expect(bordered).toHaveClass("p-[1em]");
    });

    it('renders "Recent Answers" heading with expected classes', () => {
      render(<Loading />);
      const heading = screen.getByText("Recent Answers");
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("DIV");
      expect(heading).toHaveClass("active-neo");
      expect(heading).toHaveClass("section-heading");
      expect(heading).toHaveClass("mb-2");
      expect(heading).toHaveClass("font-righteous");
      expect(heading).toHaveClass("text-xl");
    });

    it("renders a flex column container for answers", () => {
      const { container } = render(<Loading />);
      const section = screen.getByText("Recent Answers").closest(".bordered-card");
      const list = section.querySelector(".flex.flex-col.gap-5");
      expect(list).toBeInTheDocument();
    });

    it("renders exactly five AnswerCardSkeleton entries", () => {
      render(<Loading />);
      const skeletons = screen.getAllByTestId("answer-card-skeleton");
      expect(skeletons).toHaveLength(5);
    });

    it("renders all AnswerCardSkeletons inside the Recent Answers card", () => {
      const { container } = render(<Loading />);
      const section = screen.getByText("Recent Answers").closest(".bordered-card");
      const inside = section.querySelectorAll('[data-testid="answer-card-skeleton"]');
      expect(inside).toHaveLength(5);
    });
  });

  describe("Structure and order", () => {
    it("keeps expected top-level child order", () => {
      const { container } = render(<Loading />);
      const flexCol = container.querySelector(".flex.flex-col.gap-5");
      const children = Array.from(flexCol.children) as HTMLElement[];

      expect(children.length).toBeGreaterThanOrEqual(3);
      expect(children[0].querySelector('[data-testid="question-card-skeleton"]')).toBeTruthy();
      expect(children[1].querySelector('[data-testid="add-answer"]')).toBeTruthy();
      expect(children[2]).toHaveClass("bordered-card");
    });
  });

  describe("Stability and snapshots", () => {
    it("renders consistently across rerenders", () => {
      const { container, rerender } = render(<Loading />);
      const first = container.innerHTML;
      rerender(<Loading />);
      const second = container.innerHTML;
      expect(second).toBe(first);
    });

    it("unmounts cleanly", () => {
      const { unmount } = render(<Loading />);
      expect(() => unmount()).not.toThrow();
    });

    it("matches snapshot", () => {
      const { container } = render(<Loading />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});