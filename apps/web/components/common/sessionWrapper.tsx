import { getSession } from "@/lib/session";

export async function SessionWrapper({
  render,
}: {
  render: (sessionId: string | null) => React.ReactNode;
}) {
  const session = await getSession();
  return <>{render(session?.id ?? null)}</>;
}
