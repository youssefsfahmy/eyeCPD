import { LoginForm } from "@/components/auth/login-form";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function Page() {
  return (
    <div className="flex items-center justify-center w-full p-6 min-h-svh md:p-1 bg-primary-50">
      <div className="w-full max-w-md text-center">
        <h1 className="mt-10 text-4xl font-bold">
          <VisibilityOutlinedIcon
            sx={{
              width: "3rem",
              height: "3rem",
              marginRight: "1rem",
            }}
            color="primary"
          />
          EyeCPD
        </h1>
        <p className="mt-4 text-lg text-gray-500 mb-10">
          Login to your account to access all EyeCPD features
        </p>

        <LoginForm />
      </div>
    </div>
  );
}
