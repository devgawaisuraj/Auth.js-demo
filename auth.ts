import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        const [rows] = await db.execute(
          `
          SELECT id, name, email, password_hash, image
          FROM users
          WHERE email = ?
          LIMIT 1
          `,
          [email],
        );

        const users = rows as Array<{
          id: number;
          name: string;
          email: string;
          password_hash: string | null;
          image: string | null;
        }>;

        const user = users[0];

        if (!user || !user.password_hash) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.password_hash,
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      /*
       * Google OAuth user:
       * Save the Google user into our MySQL users table.
       */
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }

        const [rows] = await db.execute(
          `
          SELECT id
          FROM users
          WHERE email = ?
          LIMIT 1
          `,
          [user.email],
        );

        const existingUsers = rows as Array<{
          id: number;
        }>;

        if (existingUsers.length === 0) {
          await db.execute(
            `
            INSERT INTO users
              (name, email, image, provider)
            VALUES
              (?, ?, ?, 'google')
            `,
            [user.name || "Google User", user.email, user.image || null],
          );
        } else {
          await db.execute(
            `
            UPDATE users
            SET name = ?, image = ?
            WHERE email = ?
            `,
            [user.name || "Google User", user.image || null, user.email],
          );
        }
      }

      return true;
    },

    async jwt({ token }) {
      if (token.email) {
        const [rows] = await db.execute(
          `
          SELECT id, name, email, image
          FROM users
          WHERE email = ?
          LIMIT 1
          `,
          [token.email],
        );

        const users = rows as Array<{
          id: number;
          name: string;
          email: string;
          image: string | null;
        }>;

        const user = users[0];

        if (user) {
          token.userId = user.id;
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId || "");
        session.user.name = token.name || session.user.name;
        session.user.email = token.email || session.user.email;
        session.user.image = token.picture || session.user.image;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
