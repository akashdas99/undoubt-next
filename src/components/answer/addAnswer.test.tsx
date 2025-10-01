/**
 * Tests for AddAnswer component.
 * Testing stack: Vitest + React Testing Library + jest-dom (jsdom).
 * We focus on the AddAnswer component behaviors: login gate, editor toggle, form submit,
 * loading & error states, effects, and skeleton rendering.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddAnswer, { AddAnswerSkeleton } from "./addAnswer";
import { addAnswerAction } from "@/actions/answer";
import { useParams, useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { isEmpty } from "@/lib/functions";
import { vi, beforeEach, describe, it, expect } from "vitest";

// Explicit factories so all named exports are functions we can control.
vi.mock("@/actions/answer", () => ({ addAnswerAction: vi.fn() }));
vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: vi.fn()
}));
vi.mock("@/lib/store/user/user", () => ({
  useGetProfileQuery: vi.fn()
}));
vi.mock("@/lib/functions", () => ({
  isEmpty: vi.fn()
}));

// Stub AnswerForm to avoid editor implementation details and heavy deps.
// It still uses the RHF API from the provided 'form' to keep behavior realistic.
vi.mock("./answerForm", () => ({
  default: ({ form, onSubmit, isLoading, onCancel }: any) => (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await onSubmit(form.getValues());
        } catch {
          // swallow to emulate RHF's internal error handling
        }
      }}
    >
      <textarea data-testid="description-input" {...form.register("description")} />
      <button type="submit" disabled={isLoading} data-testid="submit-button">
        {isLoading ? "Loading..." : "Submit"}
      </button>
      <button type="button" onClick={onCancel} data-testid="cancel-button">
        Cancel
      </button>
      {form.formState.errors.root && (
        <span data-testid="error-message">{form.formState.errors.root.message}</span>
      )}
    </form>
  )
}));

const mockedAddAnswerAction = addAnswerAction as unknown as {
  mockResolvedValue: (v: any) => void;
  mockRejectedValue: (e: any) => void;
  mockReturnValue: (v: any) => void;
};
const mockedUseParams = useParams as unknown as {
  mockReturnValue: (v: any) => void;
};
const mockedUseRouter = useRouter as unknown as {
  mockReturnValue: (v: any) => void;
};
const mockedUseGetProfileQuery = useGetProfileQuery as unknown as {
  mockReturnValue: (v: any) => void;
};
const mockedIsEmpty = isEmpty as unknown as {
  mockReturnValue: (v: any) => void;
};

beforeEach(() => {
  vi.clearAllMocks();
  mockedUseRouter.mockReturnValue({ push: vi.fn() });
  mockedUseParams.mockReturnValue({ slug: "test-question-slug" });
});

describe("AddAnswer - initial render", () => {
  it("renders skeleton while fetching user", () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: undefined, isFetching: true });
    mockedIsEmpty.mockReturnValue(true);

    render(<AddAnswer />);
    // Prefer test id if present on Skeleton (we add one via small production change below).
    const sk = screen.getByTestId("add-answer-skeleton");
    expect(sk).toBeInTheDocument();
  });

  it("shows Answer button when logged in", () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);

    render(<AddAnswer />);
    expect(screen.getByRole("button", { name: /answer/i })).toBeInTheDocument();
    expect(screen.queryByText("Add Answer")).not.toBeInTheDocument();
  });

  it("shows Login button when not logged in", () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: undefined, isFetching: false });
    mockedIsEmpty.mockReturnValue(true);

    render(<AddAnswer />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});

describe("AddAnswer - interactions", () => {
  it("opens editor when Answer clicked (logged in)", async () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await waitFor(() => expect(screen.getByText("Add Answer")).toBeInTheDocument());
  });

  it("navigates to /login when Login clicked", async () => {
    const push = vi.fn();
    mockedUseRouter.mockReturnValue({ push });
    mockedUseGetProfileQuery.mockReturnValue({ data: undefined, isFetching: false });
    mockedIsEmpty.mockReturnValue(true);

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(push).toHaveBeenCalledWith("/login");
  });
});

describe("AddAnswer - submit success paths", () => {
  it("submits and closes editor on success", async () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);
    mockedAddAnswerAction.mockResolvedValue({ success: true });

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await userEvent.type(screen.getByTestId("description-input"), "My answer");
    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() =>
      expect(addAnswerAction).toHaveBeenCalledWith("test-question-slug", { description: "My answer" })
    );
    await waitFor(() => expect(screen.queryByText("Add Answer")).not.toBeInTheDocument());
  });

  it("uses slug from params", async () => {
    mockedUseParams.mockReturnValue({ slug: "different-slug" });
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);
    mockedAddAnswerAction.mockResolvedValue({ success: true });

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await userEvent.type(screen.getByTestId("description-input"), "Test answer");
    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() =>
      expect(addAnswerAction).toHaveBeenCalledWith("different-slug", { description: "Test answer" })
    );
  });
});

describe("AddAnswer - submit error paths", () => {
  it("shows server error and keeps editor open", async () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);
    mockedAddAnswerAction.mockResolvedValue({ error: { type: "serverError", message: "Failed to save" } });

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await userEvent.type(screen.getByTestId("description-input"), "Bad answer");
    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => expect(screen.getByTestId("error-message")).toHaveTextContent("Failed to save"));
    expect(screen.getByText("Add Answer")).toBeInTheDocument();
  });

  it("closes editor on non-server error", async () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);
    mockedAddAnswerAction.mockResolvedValue({ error: { type: "validationError", message: "Invalid" } });

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => expect(screen.queryByText("Add Answer")).not.toBeInTheDocument());
  });

  it("handles API rejection without crashing", async () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);
    mockedAddAnswerAction.mockRejectedValue(new Error("API Error"));

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => expect(addAnswerAction).toHaveBeenCalled());
  });
});

describe("AddAnswer - loading and reset", () => {
  it("disables submit while awaiting response", async () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);

    let resolver: (v: any) => void;
    const p = new Promise((r) => (resolver = r));
    (addAnswerAction as any).mockReturnValue(p);

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => expect(screen.getByTestId("submit-button")).toBeDisabled());
    resolver({ success: true });
  });

  it("resets form on cancel", async () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /answer/i }));

    await userEvent.type(screen.getByTestId("description-input"), "Temp");
    await userEvent.click(screen.getByTestId("cancel-button"));
    await waitFor(() => expect(screen.queryByText("Add Answer")).not.toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await waitFor(() => expect(screen.getByTestId("description-input")).toHaveValue(""));
  });
});

describe("AddAnswer - user state effects", () => {
  it("closes editor when user becomes logged out", async () => {
    const { rerender } = render(<AddAnswer />);

    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);
    rerender(<AddAnswer />);

    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await waitFor(() => expect(screen.getByText("Add Answer")).toBeInTheDocument());

    mockedUseGetProfileQuery.mockReturnValue({ data: undefined, isFetching: false });
    mockedIsEmpty.mockReturnValue(true);
    rerender(<AddAnswer />);

    await waitFor(() => expect(screen.queryByText("Add Answer")).not.toBeInTheDocument());
  });
});

describe("AddAnswer - edge cases", () => {
  it("handles undefined slug", async () => {
    mockedUseParams.mockReturnValue({ slug: undefined });
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);
    mockedAddAnswerAction.mockResolvedValue({ success: true });

    render(<AddAnswer />);
    await userEvent.click(screen.getByRole("button", { name: /answer/i }));
    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() =>
      expect(addAnswerAction).toHaveBeenCalledWith(undefined, { description: "" })
    );
  });

  it("handles rapid Answer clicks gracefully", async () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: { id: "u1" }, isFetching: false });
    mockedIsEmpty.mockReturnValue(false);

    render(<AddAnswer />);
    const btn = screen.getByRole("button", { name: /answer/i });
    await userEvent.click(btn);
    await userEvent.click(btn);
    await userEvent.click(btn);

    await waitFor(() => {
      const headers = screen.getAllByText("Add Answer");
      expect(headers).toHaveLength(1);
    });
  });

  it("handles null user as logged out", () => {
    mockedUseGetProfileQuery.mockReturnValue({ data: null, isFetching: false });
    mockedIsEmpty.mockReturnValue(true);

    render(<AddAnswer />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});

describe("AddAnswerSkeleton", () => {
  it("renders with expected classes", () => {
    render(<AddAnswerSkeleton />);
    const sk = screen.getByTestId("add-answer-skeleton");
    expect(sk).toBeInTheDocument();
    expect(sk).toHaveClass("h-10", "w-[150px]", "rounded-md");
  });
});