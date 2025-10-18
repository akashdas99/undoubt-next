import { LoginSchema, RegisterSchema } from "@/validations/auth";
import { z } from "zod";

export type RegisterType = z.infer<typeof RegisterSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
