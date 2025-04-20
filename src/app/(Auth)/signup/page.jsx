import { SignupForm } from "@/components/Auth/SignupPage"

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </main>
  )
}

