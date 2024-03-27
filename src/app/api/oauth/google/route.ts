import { lucia } from "@/lib/lucia";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { google } from "@/lib/oauth";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier = cookies().get("code_verifier")?.value ?? null;

  if (!code || !storedState || !storedCodeVerifier) {
    return Response.json(
      {
        error: "Invalid request",
      },
      {
        status: 400,
      }
    );
  }

  console.log("antes del try");

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );

    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    const user = await response.json();
    console.log("🚀 ~ GET ~ user:", user);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (existingUser) {
    }

    const existingAccount = await prisma.oauth_account.findFirst({
      where: {
        provider_id: "google",
        provider_user_id: user.sub,
      },
    });

    if (existingAccount) {
      const session = await lucia.createSession(existingAccount.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    console.log("user", user);
    // else {
    //   const newUser = await prisma.user.create({
    //     data: {
    //       username: user.name,
    //       email: user.email,
    //     },
    //   });

    //   const oauthAccount = await prisma.oauth_account.create({
    //     data: {
    //       provider_id: "google",
    //       provider_user_id: user.sub,
    //       userId: newUser.id,
    //     },
    //   });

    //   const session = await lucia.createSession(newUser.id, {});
    //   const sessionCookie = lucia.createSessionCookie(session.id);
    //   cookies().set(
    //     sessionCookie.name,
    //     sessionCookie.value,
    //     sessionCookie.attributes
    //   );
    //   return new Response(null, {
    //     status: 302,
    //     headers: {
    //       Location: "/",
    //     },
    //   });
    // }
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      const { request, message, description } = e;
    }
    // unknown error
  }

  return new Response(null, {
    status: 200,
  });
}
