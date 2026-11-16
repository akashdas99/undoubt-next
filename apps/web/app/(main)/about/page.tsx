import ContributorCard from "@/components/contributors/contributorCard";
import { Card, CardContent } from "@workspace/ui/components/card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Undoubt",
  description:
    "Undoubt is a Q&A forum where you ask a question, read answers, and find what other people already figured out.",
};

const TOP_CONTRIBUTORS = [
  {
    id: "curious",
    name: "Curious",
    userName: "curious",
    profilePicture: null,
    questionCount: 8,
    answerCount: 0,
  },
  {
    id: "alex",
    name: "Alex",
    userName: "alex",
    profilePicture: null,
    questionCount: 4,
    answerCount: 2,
  },
  {
    id: "akash",
    name: "Akash",
    userName: "akash",
    profilePicture: null,
    questionCount: 3,
    answerCount: 0,
  },
  {
    id: "sam",
    name: "Sam",
    userName: "sam",
    profilePicture: null,
    questionCount: 1,
    answerCount: 1,
  },
  {
    id: "jordan",
    name: "Jordan",
    userName: "jordan",
    profilePicture: null,
    questionCount: 0,
    answerCount: 1,
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto my-xl w-full max-w-content px-md">
      <article className="flex max-w-form flex-col gap-xl text-foreground">
        <header className="flex flex-col gap-md">
          <h1 className="font-display text-display">About</h1>
          <p className="font-display text-title">
            Clear your doubts. Find your answers.
          </p>
          <p>
            Undoubt is a Q&amp;A forum. You post a question, other people answer
            it, and anyone can come back later and read the thread. The point is
            a clear question and a useful answer, not a feed.
          </p>
        </header>

        <section className="flex flex-col gap-sm">
          <h2 className="font-display text-title">Ask</h2>
          <p>
            Write the question the way you would ask a person sitting next to
            you. A title that says what you are stuck on, and a description with
            the detail someone needs in order to help. You can ask from the
            header once you are ready to post.
          </p>
        </section>

        <section className="flex flex-col gap-sm">
          <h2 className="font-display text-title">Answer</h2>
          <p>
            Open a question and add an answer if you know it. Several answers
            can sit on the same question, so a later reader can compare them.
            Votes on a question show which ones people found worth keeping.
          </p>
        </section>

        <section className="flex flex-col gap-sm">
          <h2 className="font-display text-title">Find</h2>
          <p>
            The home page lists recent questions. Search, from the header or
            with Ctrl+K, looks through questions that are already here, so you
            can check before asking the same thing again.
          </p>
        </section>

        <section className="flex flex-col gap-sm">
          <h2 className="font-display text-title">High-priority questions</h2>
          <p>
            Later, some questions will be marked high priority. Those are the
            ones that need an answer sooner than the rest of the list. They are
            not available yet.
          </p>
        </section>

        <section className="flex flex-col gap-sm">
          <h2 className="font-display text-title">Reward</h2>
          <p>
            On a high-priority question, the person who asked it can mark one
            answer as the one that resolved it. That rewarded answer counts for
            more than a normal answer in the contributor ranking. A question can
            reward only one answer.
          </p>
          <p>
            If the asker does not mark an answer, other people can choose which
            reply resolved it. When the choice window closes, the answer with
            the most choices gets the reward. If nobody chooses, no reward is
            given. This is not available yet.
          </p>
        </section>

        <section className="flex flex-col gap-md">
          <h2 className="font-display text-title">Top contributors</h2>
          <p>
            A contribution is a question you ask or an answer you write. People
            are ranked by those two counts added together. The home page shows
            the live ranking. The rows below are a fixed example of how that
            list reads: questions, then answers.
          </p>
          <Card size="sm" className="w-full">
            <CardContent className="flex flex-col gap-sm">
              {TOP_CONTRIBUTORS.map((user, index) => (
                <ContributorCard key={user.id} user={user} rank={index + 1} />
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-sm">
          <h2 className="font-display text-title">Your account</h2>
          <p>
            You can read questions without an account. Asking, answering, and
            voting use the account you create here. Profile settings hold your
            name and the details shown next to your posts.
          </p>
          <p>
            <Link
              href="/question"
              className="text-primary underline-offset-4 hover:underline"
            >
              Ask a question
            </Link>
          </p>
        </section>
      </article>
    </div>
  );
}
