import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Button, Card } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { ReactNode } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Link from "next/link";

const ShieldIcon = () => (
  <ShieldOutlinedIcon
    color="secondary"
    sx={{ width: "1rem", height: "1rem" }}
  />
);

interface RoleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: "primary" | "secondary";
  backgroundColorClass: string;
  features: string[];
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryHref?: string;
  secondaryHref?: string;
}

function RoleCard({
  title,
  description,
  icon,
  color,
  backgroundColorClass,
  features,
  primaryButtonText,
  secondaryButtonText,
  primaryHref,
  secondaryHref,
}: RoleCardProps) {
  return (
    <Card
      sx={{
        justifyItems: "center",
        borderRadius: 1,
        padding: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        position: "relative",
        border: "1px solid #e0e0e0",
        width: 350,
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <div
        className={`absolute top-0 right-0 flex items-center justify-center w-24 h-24 translate-x-1/2 -translate-y-1/2 bg-opacity-50 rounded-full ${backgroundColorClass}`}
      />

      <div
        className={`content-center p-2 text-center text-white rounded-full bg-${color} w-14 h-14`}
      >
        {icon}
      </div>
      <h2 className="-mb-4 text-xl font-semibold">{title}</h2>
      <h6 className="mb-2 text-sm text-gray-600">{description}</h6>
      <div className="flex flex-col w-full gap-2 mb-2 text-sm text-gray-600">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-1">
            <ShieldIcon />
            {feature}
          </div>
        ))}
      </div>
      <Link href={primaryHref || "#"} passHref style={{ width: "100%" }}>
        <Button variant="contained" color={color} fullWidth>
          {primaryButtonText}
        </Button>
      </Link>
      <Link href={secondaryHref || "#"} passHref style={{ width: "100%" }}>
        <Button variant="outlined" color={color} fullWidth>
          {secondaryButtonText}
        </Button>
      </Link>
    </Card>
  );
}

export default function Home() {
  return (
    <main className="relative flex flex-col items-center min-h-screen pt-10 bg-primary-50">
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
      <p className="mt-4 text-lg text-gray-500">
        Professional Development Platform for Eye Care
      </p>
      <div className="flex justify-center w-full gap-10 mt-10">
        <RoleCard
          title="Optometrist"
          description="Track and manage your CPD requirements"
          icon={<PeopleOutlineIcon />}
          color="primary"
          backgroundColorClass="bg-primary-200"
          features={[
            "Log your CPD activities",
            "View your CPD history",
            "Generate CPD reports",
          ]}
          primaryButtonText="Sign In as Optometrist"
          secondaryButtonText="Create an Optometrist Account"
          primaryHref="/auth/login"
          secondaryHref="/auth/sign-up/optometrist"
        />
        <RoleCard
          title="CPD Provider"
          description="Manage and Delivery CPD activities"
          icon={<PostAddIcon />}
          color="secondary"
          backgroundColorClass="bg-secondary-200"
          features={[
            "Create CPD activities",
            "Manage participant enrollment",
            "Track activity completion",
          ]}
          primaryButtonText="Sign In as Provider"
          secondaryButtonText="Create a Provider Account"
          primaryHref="/cpd-provider/comming-soon"
          secondaryHref="/cpd-provider/comming-soon"
        />
      </div>
      <div className="mt-10 text-sm text-gray-500">
        By continuing, you agree to our{" "}
        <a href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </a>
        .
      </div>
    </main>
  );
}
