import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid flex-1 place-items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
          <h1 className="text-3xl text-brand-900">Admin sign in</h1>
          <p className="mt-1 mb-6 text-sm text-muted">Manage jobs, applications and enquiries.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
