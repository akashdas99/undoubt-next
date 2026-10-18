import { getProfile, getUserById } from "@/data/user";
import { getSession } from "@/lib/session";
import getQueryClient from "@/lib/getQueryClient";
import { queryKeys } from "@/lib/queries/keys";
import { withTryCatch } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export type SessionUser = Awaited<ReturnType<typeof getUserById>>;

export async function SessionWrapper({
  render,
}: {
  render: (user: SessionUser | null) => React.ReactNode;
}) {
  const session = await getSession();
  const queryClient = getQueryClient();

  let user: SessionUser | null = null;
  if (session?.id) {
    const { result } = await withTryCatch(getProfile());
    user = result ?? null;
  }

  queryClient.setQueryData(queryKeys.users.profile(), user);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {render(user)}
    </HydrationBoundary>
  );
}
