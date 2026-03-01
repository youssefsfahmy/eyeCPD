// create fetch tag global tags and user-specific tags
import { eq, isNull, or } from "drizzle-orm";
import { db } from "../drizzle";
import { providers, Provider, NewProvider } from "../schema";

export class ProviderQueries {
  /**
   * Get user specific providers by user ID and global providers (where userId is null)
   */
  static async getProvidersByUserId(
    userId: string,
  ): Promise<Provider[] | null> {
    const conditions = [eq(providers.userId, userId), isNull(providers.userId)];

    const result = await db
      .select()
      .from(providers)
      .where(or(...conditions));

    return result || null;
  }

  /**
   * Create a new provider record
   */
  static async createProvider(providerData: NewProvider): Promise<Provider> {
    const result = await db.insert(providers).values(providerData).returning();
    return result[0];
  }

  /**
   * Get all global providers (where userId is null) - admin function
   */
  static async getGlobalProviders(): Promise<Provider[]> {
    return await db.select().from(providers).where(isNull(providers.userId));
  }

  /**
   * Get all providers (admin function)
   */
  static async getAllProviders(): Promise<Provider[]> {
    return await db.select().from(providers);
  }

  /**
   * Update a provider by ID
   */
  static async updateProvider(
    id: number,
    data: Partial<Omit<NewProvider, "userId">>,
  ): Promise<Provider> {
    const result = await db
      .update(providers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(providers.id, id))
      .returning();
    return result[0];
  }
}
