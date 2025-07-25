import { index, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
}, (table) => [
  index('user_email_idx').on(table.email),
]); 

export const refreshToken = pgTable('refreshToken', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => user.id),
  token: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp().notNull(),
  revokedAt: timestamp().defaultNow(),
  createdAt: timestamp().defaultNow(),
  lastUsedAt: timestamp().defaultNow(),
}, (table) => [
  index('refresh_token_user_id_idx').on(table.userId),
]); 
