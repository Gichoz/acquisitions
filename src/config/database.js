import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Safely load dotenv only in development mode
if (process.env.NODE_ENV !== "production") {
  await import("dotenv/config");
}

if (process.env.NODE_ENV === "development") {
  neonConfig.fetchEndpoint = "http://neon-local:5432/sql";
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export { db, sql };