import { LoginForm } from "@/components/auth/login-form";
import LogoColor from "@/components/common/icons/logo-color";

export default function Page() {
  return (
    <div className="flex items-center justify-center w-full p-6 min-h-[80vh] md:p-1 bg-primary-50">
      <div className="my-6 w-full max-w-md text-center ">
        <LogoColor size={150} className="mx-auto" />

        <p className="mt-4 text-lg text-gray-500 mb-10">
          Login to your account to access all EyeCPD features
        </p>

        <LoginForm />
      </div>
    </div>
  );
}
