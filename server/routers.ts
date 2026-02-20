import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Wedding features
  wedding: router({
    getOrCreate: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateWedding(ctx.user.id);
    }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        partnerName: z.string().optional(),
        weddingDate: z.date().optional(),
        location: z.string().optional(),
        guestCount: z.number().optional(),
        budget: z.string().optional(),
        theme: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.updateWedding(input.id, {
          partnerName: input.partnerName,
          weddingDate: input.weddingDate,
          location: input.location,
          guestCount: input.guestCount,
          budget: input.budget ? String(parseFloat(input.budget)) : undefined,
          theme: input.theme,
          notes: input.notes,
        });
        return result[0];
      }),
  }),

  // Marketplace features
  marketplace: router({
    searchVendors: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        keyword: z.string().optional(),
        priceMin: z.number().optional(),
        priceMax: z.number().optional(),
        location: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.searchVendors(input);
      }),

    getVendor: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getVendorById(input);
      }),

    getVendorReviews: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getVendorReviews(input);
      }),

    submitReview: protectedProcedure
      .input(z.object({
        vendorId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        content: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createReview({
          vendorId: input.vendorId,
          userId: ctx.user.id,
          rating: input.rating,
          title: input.title,
          content: input.content,
        });
      }),

    saveVendor: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        return db.saveVendor(ctx.user.id, input);
      }),

    unsaveVendor: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        return db.unsaveVendor(ctx.user.id, input);
      }),

    getSavedVendors: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getUserSavedVendors(ctx.user.id);
      }),
  }),

  // Inquiry features
  inquiries: router({
    create: protectedProcedure
      .input(z.object({
        vendorId: z.number(),
        weddingId: z.number().optional(),
        message: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createInquiry({
          vendorId: input.vendorId,
          userId: ctx.user.id,
          weddingId: input.weddingId,
          message: input.message,
        });
      }),

    getMyInquiries: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getUserInquiries(ctx.user.id);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "responded", "booked", "declined"]),
        vendorResponse: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.updateInquiryStatus(input.id, input.status, input.vendorResponse);
      }),
  }),
});

export type AppRouter = typeof appRouter;
