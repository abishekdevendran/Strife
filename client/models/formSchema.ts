import * as z from 'zod';


export const loginFormSchema = z.object({
  username: z
  .string()
  .min(5, { message: 'Username must be minimum 5 characters long' })
  .max(20, { message: 'Username must be less than 20 characters long' }),
  password: z.string().min(6).max(20)
});

export const registerFormSchema = z.object({
  username: z
    .string()
    .min(5, { message: 'Username must be minimum 5 characters long' })
    .max(20, { message: 'Username must be less than 20 characters long' }),
  password: z
    .string()
    .min(5, { message: 'Password must be minimum 5 characters long' })
    .max(20, { message: 'Password must be less than 20 characters long' }),
  confirmPassword: z.string()
    .min(5, { message: 'Password must be minimum 5 characters long' })
    .max(20, { message: 'Password must be less than 20 characters long' }),
  email: z.string().email({ message: 'Not a valid email address' })
});

export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
export type registerFormSchemaType = z.infer<typeof registerFormSchema>;