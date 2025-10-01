import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/components/answer/addAnswer", () => ({
  default: () => <div data-testid="add-answer">add-answer-placeholder</div>,
}));

vi.mock("@/components/answer/answerCard", () => ({
  AnswerCardSkeleton: () => (
    <div data-testid="answer-card-skeleton">answer-card-placeholder</div>
  ),
}));

vi.mock("@/components/question/questionCard", () => ({
  QuestionCardSkeleton: () => (
    <div data-testid="question-card-skeleton">question-card-placeholder</div>
  ),
}));

import Loading from "./loading";

describe("Question slug loading UI", () => {
  const renderComponent = () => render(<Loading />);

  it("renders skeleton placeholders for the question card and add answer form", () => {
    renderComponent();

    expect(screen.getByTestId("question-card-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("add-answer")).toBeInTheDocument();
  });

  it("renders five answer skeleton placeholders inside the Recent Answers section", () => {
    renderComponent();

    const heading = screen.getByText("Recent Answers");
    const section = heading.closest(".bordered-card");
    expect(section).not.toBeNull();
    if (!section) {
      throw new Error("Recent Answers section not rendered");
    }

    const placeholders = section.querySelectorAll(
      '[data-testid="answer-card-skeleton"]',
    );
    expect(placeholders).toHaveLength(5);
  });

  it("applies the expected wrapper layout classes", () => {
    const { container } = renderComponent();
    const wrapper = container.firstElementChild as HTMLElement | null;

    expect(wrapper).not.toBeNull();
    if (!wrapper) {
      throw new Error("Loading wrapper not rendered");
    }

    expect(wrapper).toHaveClass("w-full");
    expect(wrapper).toHaveClass("px-3");
    expect(wrapper.className).toContain("my-3");
    expect(wrapper.className).toContain("md:my-8");
    expect(wrapper).toHaveClass("max-w-screen-lg");
  });

  it("orders top-level sections as skeleton question, add answer, then answers list", () => {
    const { container } = renderComponent();
    const stack = container.querySelector(".flex.flex-col.gap-5");
    expect(stack).not.toBeNull();
    if (!stack) {
      throw new Error("Top-level stack not rendered");
    }

    const children = Array.from(stack.children);
    expect(children).toHaveLength(3);

    expect(
      children[0].querySelector('[data-testid="question-card-skeleton"]'),
    ).not.toBeNull();
    expect(
      children[1].querySelector('[data-testid="add-answer"]'),
    ).not.toBeNull();
    expect(children[2]).toHaveClass("bordered-card");
  });

  it("keeps the add answer placeholder outside of the answers list", () => {
    renderComponent();

    const addAnswer = screen.getByTestId("add-answer");
    const answersSection = screen
      .getByText("Recent Answers")
      .closest(".bordered-card");

    expect(answersSection).not.toBeNull();
    if (!answersSection) {
      throw new Error("Answers section not rendered");
    }

    expect(answersSection).not.toContainElement(addAnswer);
  });

  it("produces stable markup across re-renders", () => {
    const { container, rerender } = renderComponent();
    const initialHTML = container.innerHTML;

    rerender(<Loading />);
    expect(container.innerHTML).toBe(initialHTML);
  });
});