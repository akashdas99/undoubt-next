import getQueryClient from "@/lib/getQueryClient";
import { queryKeys } from "@/lib/queries/keys";
import type { ProfileUser } from "@/lib/queries/user";
import { getSession } from "@/lib/auth/session";
import { httpMethod } from "@/lib/api/request";
import { serverReq } from "@/lib/api/with-session";
import { userEndpoints } from "@/lib/domain/endpoints";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export async function ProfileWrapper({
  render,
}: {
  render: (user: ProfileUser | null) => React.ReactNode;
}) {
  const session = await getSession();
  const queryClient = getQueryClient();

  let user: ProfileUser | null = null;
  if (session?.id) {
    const { response } = await serverReq<ProfileUser>(userEndpoints.me, {
      method: httpMethod.get,
    });
    user = response ?? null;
  }

  queryClient.setQueryData(queryKeys.users.profile(), user);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {render(user)}
    </HydrationBoundary>
  );
}
