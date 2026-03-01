import { notFound } from "next/navigation";
import { ProfileQueries } from "@/lib/db/queries/profile";
import { Alert } from "@mui/material";
import AdminUserDetailView from "./components/user-detail-view";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id: userId } = await params;

  if (!userId) {
    notFound();
  }

  try {
    const userDetail = await ProfileQueries.getAdminUserDetail(userId);

    if (!userDetail) {
      notFound();
    }

    return <AdminUserDetailView user={userDetail} />;
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return (
      <Alert severity="error">
        Failed to load user details. Please try again.
      </Alert>
    );
  }
}
