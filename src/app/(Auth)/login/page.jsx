import { LoginForm } from "@/components/Auth/LoginPage" 

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}

