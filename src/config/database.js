// import 'dotenv/config';
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// import { migrate } from 'drizzle-orm/neon-http/migrator';
// import * as schema from '../models/user.model.js';

// const sql = neon(process.env.DATABASE_URL);
// export const db = drizzle(sql, { schema });

// export const runMigrations = async () => {
//   try {
//     await migrate(db, { migrationsFolder: './drizzle' });
//     console.log('Database migrations completed successfully.');
//   } catch (error) {
//     console.error('Failed to run database migrations:', error);
//     process.exit(1);
//   }
// };

// export { sql };
