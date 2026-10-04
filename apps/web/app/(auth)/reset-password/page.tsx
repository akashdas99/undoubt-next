import ResetPasswordForm from "@/components/auth/resetPasswordForm";
import Link from "next/link";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="bordered-card my-auto w-11/12 max-w-form p-2xl">
          <h1 className={`mb-xs font-display text-display`}>
            Invalid Reset Link
          </h1>
          <p className="mb-md text-sm">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="block text-sm text-primary hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ResetPasswordForm token={token} />
    </div>
  );
}
