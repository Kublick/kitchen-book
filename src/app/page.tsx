import { Button } from "@/components/ui/button";
import { logout, validateRequest } from "@/server/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <p>Hello {user.username}</p>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </main>
  );
}
