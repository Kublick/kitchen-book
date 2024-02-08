// import { Argon2id } from 'oslo/password';
"use server";
import prisma from "@/lib/prisma";
import { Argon2id } from "oslo/password";
import { lucia } from "../lib/lucia";
import { cookies } from "next/headers";
import { Session, User } from "lucia";
import { cache } from "react";

export const RegisterUser = async (username: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: username,
    },
  });

  if (user) {
    throw new Error("User already exists");
  }

  const hashedPassword = await new Argon2id().hash(password);

  const newUser = await prisma.user.create({
    data: {
      username: username,
      email: username,
      password: hashedPassword,
    },
  });

  const session = await lucia.createSession(newUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return { message: "User created successfully" };
};

export const logout = async () => {
  const sessionCookie = lucia.createSessionCookie("");
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return { message: "Logged out successfully" };
};

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      // biome-ignore lint/complexity/useOptionalChain: <explanation>
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);
