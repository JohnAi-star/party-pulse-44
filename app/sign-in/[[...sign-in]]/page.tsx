import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default function SignInPage() {
  // If user is already signed in, redirect to home
  const { userId } = auth();
  if (userId) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
            footerActionLink: "text-purple-600 hover:text-purple-700"
          }
        }}
      />
    </div>
  );
}