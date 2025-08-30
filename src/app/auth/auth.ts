// auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "../../../lib/mongodb";

const db = await connectToDatabase(); // get Db instance

export const auth = betterAuth({
  database: mongodbAdapter(db),
});
