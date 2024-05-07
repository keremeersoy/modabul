import { createAdvertSchema } from "@/schemas/advert";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";

export const advertRouter = createTRPCRouter({
  getLastFiveAdverts: publicProcedure.query(async () => {
    const adverts = await db.advert.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: true, category: true, images: true, location: true },
    });

    // console.log("get last five adverts FINISHED", adverts);

    return adverts;
  }),
  getAdvertById: publicProcedure
    .input(
      z.object({
        advertId: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.advertId) {
        return null;
      }

      const advert = await db.advert.findUnique({
        where: {
          id: input.advertId,
        },
        include: { user: true, category: true, images: true, location: true },
      });

      return advert;
    }),
  getOneUserAdverts: publicProcedure
    .input(
      z.object({
        userId: z.string().nullable(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.userId) {
        return null;
      }

      const adverts = await db.advert.findMany({
        where: {
          userId: input.userId,
        },
        include: { user: true, category: true, images: true, location: true },
      });

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
        imageUrl: z.string().nullable(),
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
          categoryId: "clvcfw2pl000711cmwdzw4969",
          images: {
            create: {
              url:
                input?.imageUrl ??
                "https://st3.depositphotos.com/17828278/33150/v/450/depositphotos_331503262-stock-illustration-no-image-vector-symbol-missing.jpg",
            },
          },
        },
      });

      return advert;
    }),
  deleteAdvert: protectedProcedure
    .input(
      z.object({
        advertId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!input.advertId) {
        return null;
      }

      const advert = await db.advert.delete({
        where: {
          id: input.advertId,
        },
      });

      return advert;
    }),
});
