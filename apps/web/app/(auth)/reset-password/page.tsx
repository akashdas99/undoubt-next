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
      <div className="flex items-center justify-center min-h-screen">
        <div className="bordered-card my-auto w-11/12 max-w-form p-2xl">
          <h1 className={`mb-xs font-righteous text-display`}>
            Invalid Reset Link
          </h1>
          <p className="text-sm mb-4">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline block"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ResetPasswordForm token={token} />
    </div>
  );
}
