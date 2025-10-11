import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { createSession } from "@/lib/session";
import { RegisterType } from "@/types/auth";
import { RegisterSchema } from "@/validations/auth";
import bcryptjs from "bcryptjs";
import { eq, or } from "drizzle-orm";

export async function registerUser(userData: RegisterType) {
  try {
    //validate userData
    const parsed = RegisterSchema.safeParse(userData);
    if (!parsed.success) {
      // Create errors object like React Hook Form expects
      const errors = Object.fromEntries(
        parsed.error.issues.map((issue) => [
          issue.path[0], // assume flat structure with single key path
          { message: issue.message },
        ])
      );

      return {
        success: false,
        errors,
      };
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
      if (conflict.email === validatedUser.email) {
        return {
          success: false,
          errors: {
            email: { message: "Email already exists" },
          },
        };
      }
      return {
        success: false,
        errors: {
          userName: { message: "UserName already exists" },
        },
      };
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
    return {
      success: true,
      errors: {},
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,

      errors: {
        root: { message: "Something went wrong" },
      },
    };
  }
}
