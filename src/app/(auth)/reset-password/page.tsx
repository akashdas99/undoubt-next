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
        <div className="bordered-card p-5 md:p-8 rounded-xl max-w-md w-10/12 my-auto">
          <h1 className={`font-righteous text-3xl mb-3 md:mb-6`}>
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
