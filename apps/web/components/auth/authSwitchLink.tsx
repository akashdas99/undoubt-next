import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";

type AuthSwitchTarget = "/login" | "/register";

type AuthSwitchLinkProps = {
  readonly to: AuthSwitchTarget;
  readonly prompt?: string;
};

const SWITCH_LABEL: Record<AuthSwitchTarget, string> = {
  "/login": "Log in",
  "/register": "Register",
};

export function AuthSwitchLink({ to, prompt }: AuthSwitchLinkProps) {
  return (
    <div className="flex flex-col gap-md">
      <Separator />
      <p className="text-sm text-muted-foreground">
        {prompt ? <span>{prompt} </span> : null}
        <Link href={to} className="font-semibold text-primary hover:underline">
          {SWITCH_LABEL[to]}
        </Link>
      </p>
    </div>
  );
}
