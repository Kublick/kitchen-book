import { github, lucia } from "@/lib/lucia";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingAccount = await prisma.oauth_account.findFirst({
      where: {
        provider_id: "github",
        provider_user_id: githubUser.id.toString(),
      },
    });

    if (existingAccount) {
      const user = await prisma.user.findUnique({
        where: {
          id: existingAccount.userId,
        },
      });

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

      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      console.log("Creating new user");
      const newUser = await prisma.user.create({
        data: {
          username: githubUser.login,
          email: githubUser.login,
        },
      });

      const oauth = await prisma.oauth_account.create({
        data: {
          provider_id: "github",
          provider_user_id: githubUser.id.toString(),
          userId: newUser.id,
        },
      });

      const session = await lucia.createSession(newUser.id, {});
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
  } catch (e) {
    // the specific error message depends on the provider
    console.log(e);

    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GitHubUser {
  id: string;
  login: string;
}
