import { RegisterSchema } from "@/validations/auth";
import { z } from "zod";

export type RegisterType = z.infer<typeof RegisterSchema>;
