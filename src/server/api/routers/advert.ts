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
  editAdvert: protectedProcedure
    .input(
      z.object({
        advertId: z.string(),
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

      const advert = await db.advert.update({
        where: {
          id: input.advertId,
        },
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
  getSavedAdverts: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session!.user.id;

    const savedAdverts = await db.advertSave.findMany({
      where: {
        userId,
      },
    });

    const adverts = await db.advert.findMany({
      where: {
        id: {
          in: savedAdverts.map((savedAdvert) => savedAdvert.advertId),
        },
      },
      include: { user: true, category: true, images: true, location: true },
    });

    return adverts;
  }),

  saveAdvert: protectedProcedure
    .input(
      z.object({
        advertId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session!.user.id;

      const savedAdvert = await db.advertSave.create({
        data: {
          userId,
          advertId: input.advertId,
        },
      });

      await db.advert.update({
        where: {
          id: input.advertId,
        },
        data: {
          savedCount: {
            increment: 1,
          },
        },
      });

      return savedAdvert;
    }),
  unsaveAdvert: protectedProcedure
    .input(
      z.object({
        advertId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session!.user.id;

      const savedAdvert = await db.advertSave.findUnique({
        where: {
          advertId_userId: {
            advertId: input.advertId,
            userId: userId,
          },
        },
      });

      if (savedAdvert) {
        await db.advertSave.delete({
          where: {
            advertId_userId: {
              advertId: input.advertId,
              userId: userId,
            },
          },
        });

        await db.advert.update({
          where: {
            id: input.advertId,
          },
          data: {
            savedCount: {
              decrement: 1,
            },
          },
        });
      }

      return savedAdvert;
    }),
  isAdvertSaved: protectedProcedure
    .input(
      z.object({
        advertId: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!input.advertId) return false;

      const userId = ctx.session!.user.id;

      const savedAdvert = await db.advertSave.findFirst({
        where: {
          userId,
          advertId: input.advertId,
        },
      });

      if (savedAdvert) return true;

      return false;
    }),
});
