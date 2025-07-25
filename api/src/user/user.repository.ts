import { Inject, Injectable } from '@nestjs/common';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

@Injectable()
export class UserRepository {
  constructor(@Inject('DB') private readonly db: ReturnType<typeof drizzle>) {}

  async findByEmail(email: string) {
    try {
      const res = await this.db.select().from(user).where(eq(user.email, email));
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async create(data: { name: string; email: string; age: number; password: string }) {
    try {
      const res = await this.db.insert(user).values(data).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const res = await this.db.select().from(user);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const res = await this.db.select().from(user).where(eq(user.id, id));
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    data: Partial<{ name: string; email: string; age: number }>,
  ) {
    try {
      const res = await this.db.update(user).set(data).where(eq(user.id, id)).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const res = await this.db.delete(user).where(eq(user.id, id)).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }
}
