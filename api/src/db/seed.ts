import 'dotenv/config';
import { user } from './schema';
import { eq } from 'drizzle-orm';
import { DbProvider } from './db.provider';

export async function seed() {
  const newUser: typeof user.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
    password: 'password',
  };

  await DbProvider.useFactory()
    .insert(user)
    .values(newUser)
    .onConflictDoNothing({ target: user.email });
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed().catch(console.error);
}
