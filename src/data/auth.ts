import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { sendEmail } from "@/lib/email";
import {
  getPasswordResetEmailHtml,
  getPasswordResetSubject,
} from "@/lib/emailTemplates";
import { errorResponse, successResponse } from "@/lib/response";
import { createSession } from "@/lib/session";
import { parseZodErrors } from "@/lib/utils";
import {
  ForgotPasswordType,
  LoginType,
  RegisterType,
  ResetPasswordType,
} from "@/types/auth";
import {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from "@/validations/auth";
import bcryptjs from "bcryptjs";
import { nanoid } from "nanoid";
import { eq, or } from "drizzle-orm";

export async function registerUser(userData: RegisterType) {
  //validate userData
  const parsed = RegisterSchema.safeParse(userData);
  if (!parsed.success) {
    return errorResponse(parseZodErrors(parsed.error));
  }
  const validatedUser = parsed.data;
  // Check unique constraints (email or userName) in a single query
  const [conflict] = await db
    .select({ email: users.email, userName: users.userName })
    .from(users)
    .where(
      or(
        eq(users.email, validatedUser.email),
        eq(users.userName, validatedUser.userName)
      )
    )
    .limit(1);

  if (conflict) {
    return errorResponse(
      conflict.email === validatedUser.email
        ? {
            email: { message: "Email already exists" },
          }
        : {
            userName: { message: "UserName already exists" },
          }
    );
  }
  //hash password
  const hashedPassword = await bcryptjs.hash(validatedUser.password, 10);
  //create user
  const [registeredUser] = await db
    .insert(users)
    .values({
      name: validatedUser.name,
      userName: validatedUser.userName,
      email: validatedUser.email,
      password: hashedPassword,
    })
    .returning({
      id: users?.id,
      userName: users?.userName,
    });
  await createSession({
    id: registeredUser?.id,
    userName: registeredUser?.userName,
  });
  return successResponse();
}

export async function loginUser(userData: LoginType) {
  //validate userData
  const parsed = LoginSchema.safeParse(userData);
  if (!parsed.success) {
    return errorResponse(parseZodErrors(parsed.error));
  }
  const validatedUser = parsed.data;
  const [user] = await db
    .select({
      id: users?.id,
      userName: users.userName,
      password: users.password,
    })
    .from(users)
    .where(or(eq(users.email, validatedUser.email)))
    .limit(1);

  const isCorrectPassword = await bcryptjs.compare(
    validatedUser?.password,
    user?.password
  );
  if (!isCorrectPassword) {
    return errorResponse({
      password: { message: "Incorrect Password" },
    });
  }

  await createSession({
    id: user?.id,
    userName: user?.userName,
  });
  return successResponse();
}

export async function forgotPassword(data: ForgotPasswordType) {
  // Validate email
  const parsed = ForgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return errorResponse(parseZodErrors(parsed.error));
  }

  const validatedData = parsed.data;

  // Check if user exists
  const [user] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, validatedData.email))
    .limit(1);

  // Return success even if user doesn't exist (security best practice)
  if (!user) {
    return successResponse({
      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  }

  // Generate reset token (valid for 5 minutes)
  const resetToken = nanoid(32);
  const resetTokenExpiry = new Date(Date.now() + 300000); // 5 minutes from now

  // Save reset token to database
  await db
    .update(users)
    .set({
      resetToken,
      resetTokenExpiry,
    })
    .where(eq(users.id, user.id));

  // Send email with reset link
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: getPasswordResetSubject(),
    html: getPasswordResetEmailHtml(resetLink),
  });

  return successResponse({
    message:
      "If an account exists with that email, a password reset link has been sent.",
  });
}

export async function resetPassword(data: ResetPasswordType) {
  // Validate data
  const parsed = ResetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return errorResponse(parseZodErrors(parsed.error));
  }

  const validatedData = parsed.data;

  // Find user with valid reset token
  const [user] = await db
    .select({
      id: users.id,
      resetTokenExpiry: users.resetTokenExpiry,
    })
    .from(users)
    .where(eq(users.resetToken, validatedData.token))
    .limit(1);

  if (!user) {
    return errorResponse({
      token: { message: "Invalid or expired reset token" },
    });
  }

  // Check if token is expired
  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return errorResponse({
      token: { message: "Reset token has expired" },
    });
  }

  // Hash new password
  const hashedPassword = await bcryptjs.hash(validatedData.password, 10);

  // Update password and clear reset token
  await db
    .update(users)
    .set({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    })
    .where(eq(users.id, user.id));

  return successResponse({
    message: "Password has been reset successfully",
  });
}
