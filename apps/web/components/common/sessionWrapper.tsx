import { getSession } from "@/lib/session";

type Session = Awaited<ReturnType<typeof getSession>>;

export async function SessionWrapper({
  render,
}: {
  render: (session: Session) => React.ReactNode;
}) {
  const session = await getSession();

  return render(session);
}
