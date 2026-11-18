import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URI;
if (!url) {
  throw new Error("DATABASE_URI is not set");
}

export default defineConfig({
  schema: "./src/schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});