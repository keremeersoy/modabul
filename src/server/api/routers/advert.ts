import { createAdvertSchema } from "@/schemas/advert";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";

export const advertRouter = createTRPCRouter({
  getLastFiveAdverts: publicProcedure.query(async () => {
    console.log("get last five adverts STARTED");
    const adverts = await db.advert.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { user: true, category: true, images: true, location: true },
    });

    console.log("get last five adverts FINISHED", adverts);

    return adverts;
  }),
  createAdvert: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, { message: "Title is required" }),
        description: z
          .string()
          .max(500, { message: "Description is too long" }),
        price: z.coerce.number().positive().min(1),
        size: z.string().min(1, { message: "Size is required" }),
        gender: z.string().min(1, { message: "Gender is required" }),
        phone: z.string().min(1, { message: "Phone is required" }),
        color: z.string().min(1, { message: "Color is required" }),
        isChildCloth: z.boolean(),
        isFree: z.boolean(),
        isUsed: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session!.user.id;

      const advert = await db.advert.create({
        data: {
          userId,
          title: input.title,
          description: input.description,
          phone: input.phone,
          price: input.price,
          size: input.size,
          gender: input.gender,
          color: input.color,
          isChildCloth: input.isChildCloth,
          isFree: input.isFree,
          isUsed: input.isUsed,
          categoryId: "clrxpekrt00002y7nzk5qo42o",
        },
      });

      return advert;
    }),
});
