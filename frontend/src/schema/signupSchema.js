import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3, "name must be atleast 3 characters"),
  email: z.string().email("enter valid email"),
  password: z.string().min(6, "password must be atleast 6 character"),
});
