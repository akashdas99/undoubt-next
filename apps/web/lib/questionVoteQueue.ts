const questionVoteChains: Record<string, Promise<void> | undefined> = {};

export function enqueueQuestionVote(
  questionId: string,
  task: () => Promise<void>
) {
  const previous = questionVoteChains[questionId] ?? Promise.resolve();
  const settled = previous.then(task, task);
  const tracked = settled.finally(() => {
    if (questionVoteChains[questionId] === tracked) {
      delete questionVoteChains[questionId];
    }
  });
  questionVoteChains[questionId] = tracked;
}
