import * as z from "zod";

export const createAdvertSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().max(500, { message: "Description is too long" }),
  price: z.coerce.number().positive().min(1),
  size: z.string().min(1, { message: "Size is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  isChildCloth: z.boolean(),
  isFree: z.boolean(),
  isUsed: z.boolean(),
});

export type CreateAdvertSchema = z.infer<typeof createAdvertSchema>;
