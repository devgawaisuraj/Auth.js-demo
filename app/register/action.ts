"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export type RegisterState = {
  error: string;
};

export async function registerUser(
  previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  // Validation
  if (!name || !email || !password) {
    return {
      error: "All fields are required.",
    };
  }

  if (password.length < 6) {
    return {
      error: "Password must contain at least 6 characters.",
    };
  }

  // Check existing user
  const [rows] = await db.execute(
    `SELECT id FROM users WHERE email = ? LIMIT 1`,
    [email],
  );

  const users = rows as Array<{ id: number }>;

  if (users.length > 0) {
    return {
      error: "Email is already registered.",
    };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Save user
  await db.execute(
    `INSERT INTO users (name, email, password_hash, provider)
     VALUES (?, ?, ?, 'credentials')`,
    [name, email, passwordHash],
  );

  // Successful registration
  redirect("/login?registered=true");
}
