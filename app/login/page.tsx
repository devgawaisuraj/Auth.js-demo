import LoginForm from "@/components/LoginForm";
import GoogleButton from "@/components/GoogleButton";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <LoginForm />

        <div className="mt-4">
          <GoogleButton />
        </div>
      </div>
    </div>
  );
}
