import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use the externally provided database connection or fall back to the environment variable
const DATABASE_URL = "postgresql://neondb_owner:npg_U9fXMreBqW0m@ep-twilight-sound-a4ixfs06.us-east-1.aws.neon.tech/neondb?sslmode=require";

console.log("Connecting to database...");

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });
