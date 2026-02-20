import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Wedding information table
 */
export const weddings = mysqlTable("weddings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  partnerName: text("partnerName"),
  weddingDate: timestamp("weddingDate"),
  location: text("location"),
  guestCount: int("guestCount"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  theme: text("theme"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Wedding = typeof weddings.$inferSelect;
export type InsertWedding = typeof weddings.$inferInsert;

/**
 * Marketplace vendors table
 */
export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "photographer", "venue", "catering"
  description: text("description"),
  location: varchar("location", { length: 255 }),
  priceMin: decimal("priceMin", { precision: 10, scale: 2 }),
  priceMax: decimal("priceMax", { precision: 10, scale: 2 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 255 }),
  image: varchar("image", { length: 255 }), // URL to vendor image
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("reviewCount").default(0),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

/**
 * Vendor reviews table
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  vendorId: int("vendorId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 255 }),
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Vendor inquiries table
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  vendorId: int("vendorId").notNull(),
  userId: int("userId").notNull(),
  weddingId: int("weddingId"),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "responded", "booked", "declined"]).default("pending").notNull(),
  vendorResponse: text("vendorResponse"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * User's saved vendors (favorites)
 */
export const savedVendors = mysqlTable("savedVendors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  vendorId: int("vendorId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedVendor = typeof savedVendors.$inferSelect;
export type InsertSavedVendor = typeof savedVendors.$inferInsert;
