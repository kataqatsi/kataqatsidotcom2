import { Inject, Injectable } from '@nestjs/common';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

@Injectable()
export class UserRepository {
  constructor(@Inject('DB') private readonly db: ReturnType<typeof drizzle>) {}

  async findByEmail(email: string) {
    const res = await this.db.select().from(user).where(eq(user.email, email));
    return res[0];
  }

  async create(data: { name: string; email: string; age: number }) {
    return this.db.insert(user).values(data).returning();
  }

  async findAll() {
    return this.db.select().from(user);
  }

  async findById(id: string) {
    const res = await this.db.select().from(user).where(eq(user.id, id));
    return res[0];
  }

  async update(
    id: string,
    data: Partial<{ name: string; email: string; age: number }>,
  ) {
    return this.db.update(user).set(data).where(eq(user.id, id)).returning();
  }

  async remove(id: string) {
    return this.db.delete(user).where(eq(user.id, id)).returning();
  }
}
