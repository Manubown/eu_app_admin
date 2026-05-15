import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <h1 className="text-xl font-semibold">EU_Base-App Admin</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Restricted. Sign in with your authorized GitHub account.
        </p>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
          >
            Continue with GitHub
          </button>
        </form>
      </div>
    </main>
  );
}
