import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { errorResponse, successResponse } from "@/lib/response";
import { createSession } from "@/lib/session";
import { parseZodErrors } from "@/lib/utils";
import { LoginType, RegisterType } from "@/types/auth";
import { LoginSchema, RegisterSchema } from "@/validations/auth";
import bcryptjs from "bcryptjs";
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
