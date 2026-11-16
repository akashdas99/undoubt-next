import { AuthHeading } from "@/components/auth/authHeading";
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
      <>
        <AuthHeading
          title="Invalid Reset Link"
          description="This password reset link is invalid or has expired."
        />
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Request a new reset link
        </Link>
      </>
    );
  }

  return <ResetPasswordForm token={token} />;
}
