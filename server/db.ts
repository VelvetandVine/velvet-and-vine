import { eq, and, like, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, weddings, vendors, reviews, inquiries, savedVendors } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Wedding queries
export async function getOrCreateWedding(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(weddings).where(eq(weddings.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];

  await db.insert(weddings).values({ userId });
  const newWedding = await db.select().from(weddings).where(eq(weddings.userId, userId)).limit(1);
  return newWedding[0];
}

export async function updateWedding(id: number, data: Partial<typeof weddings.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(weddings).set(data).where(eq(weddings.id, id));
  return db.select().from(weddings).where(eq(weddings.id, id)).limit(1);
}

// Vendor marketplace queries
export async function searchVendors(filters: {
  category?: string;
  keyword?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions: any[] = [];

  if (filters.category) {
    conditions.push(eq(vendors.category, filters.category));
  }
  if (filters.keyword) {
    conditions.push(like(vendors.name, `%${filters.keyword}%`));
  }
  if (filters.location) {
    conditions.push(like(vendors.location, `%${filters.location}%`));
  }

  let query: any = db.select().from(vendors);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  query = query.orderBy(desc(vendors.rating));

  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  if (filters.offset) {
    query = query.offset(filters.offset);
  }

  return query.execute();
}

export async function getVendorById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
  return result[0];
}

export async function getVendorReviews(vendorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(reviews).where(eq(reviews.vendorId, vendorId)).orderBy(desc(reviews.createdAt));
}

// Inquiry queries
export async function createInquiry(data: typeof inquiries.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(inquiries).values(data);
  const newInquiry = await db.select().from(inquiries).where(eq(inquiries.id, result[0].insertId)).limit(1);
  return newInquiry[0];
}

export async function getUserInquiries(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(inquiries).where(eq(inquiries.userId, userId)).orderBy(desc(inquiries.createdAt));
}

export async function updateInquiryStatus(id: number, status: string, vendorResponse?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status };
  if (vendorResponse) {
    updateData.vendorResponse = vendorResponse;
  }

  await db.update(inquiries).set(updateData).where(eq(inquiries.id, id));
  return db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
}

// Review queries
export async function createReview(data: typeof reviews.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reviews).values(data);
  
  // Update vendor rating
  const vendorReviews = await db.select().from(reviews).where(eq(reviews.vendorId, data.vendorId));
  const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
  
  await db.update(vendors).set({
    rating: String(avgRating),
    reviewCount: vendorReviews.length,
  }).where(eq(vendors.id, data.vendorId));

  const newReview = await db.select().from(reviews).where(eq(reviews.id, result[0].insertId)).limit(1);
  return newReview[0];
}

// Saved vendors queries
export async function saveVendor(userId: number, vendorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(savedVendors).where(and(eq(savedVendors.userId, userId), eq(savedVendors.vendorId, vendorId)));
  if (existing.length > 0) return existing[0];

  const result = await db.insert(savedVendors).values({ userId, vendorId });
  return db.select().from(savedVendors).where(eq(savedVendors.id, result[0].insertId)).limit(1);
}

export async function unsaveVendor(userId: number, vendorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(savedVendors).where(and(eq(savedVendors.userId, userId), eq(savedVendors.vendorId, vendorId)));
  return true;
}

export async function getUserSavedVendors(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const saved = await db.select().from(savedVendors).where(eq(savedVendors.userId, userId));
  const vendorIds = saved.map(s => s.vendorId);
  
  if (vendorIds.length === 0) return [];
  
  return db.select().from(vendors).where(sql`${vendors.id} IN (${vendorIds.join(',')})`);
}
