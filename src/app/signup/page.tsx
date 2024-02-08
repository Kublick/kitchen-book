import SignUpForm from "@/components/auth/SignUpForm";
import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  // const { user } = await validateRequest();

  // if (user) {
  //   return redirect("/");
  // }

  return (
    <div className="flex flex-col justify-center items-center w-1/2">
      <SignUpForm />
    </div>
  );
}
