import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import { db } from "@/drizzle/client";
import * as authSchema from "@/drizzle/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    admin(),
    // must be the last plugin so Server Actions can set cookies correctly
    nextCookies(),
  ],
});