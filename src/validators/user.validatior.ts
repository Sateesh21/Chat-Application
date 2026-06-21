import { z } from "zod";

export const registerValidator = z.object({
    name: z.string().min(2, 'Name must have atleast 2 charachers'),
    email: z.email('provide an email address'),
    password: z.string().min(6, "password is too short")
})

 export const loginValidator = z.object({
    email: z.email('Provide an valid email address'),
    password: z.string().min(6, "Password is too short")
 })

 export const changePasswordValidator = z.object({
    currentPassword: z.string().min(6, 'Password is too short'),
    newPassword: z.string().min(6, 'Password is too short')
 })

 export type RegisterInput = z.infer<typeof registerValidator>;
export type LoginInput = z.infer<typeof loginValidator>;
export type ChangePasswordInput = z.infer<typeof changePasswordValidator>;

//Issue while building ChangePassword Feature --> Fixed
