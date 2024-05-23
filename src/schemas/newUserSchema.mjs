import { object, string } from "zod";

export const newUserSchema = object({
    userName: string(),
    displayName: string(),
    password: string(),
});
