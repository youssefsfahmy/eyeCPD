import {
  ProfileQueries,
  type ProfileWithSubscription,
} from "@/lib/db/queries/profile";
import { Alert } from "@mui/material";
import UserListView from "./components/user-list";

export default async function AdminUserListServerPage() {
  let users: ProfileWithSubscription[] = [];

  try {
    users = await ProfileQueries.getAllProfilesWithSubscriptions();
  } catch (error) {
    console.error("Error fetching users:", error);
    return (
      <Alert severity="error">Failed to load users. Please try again.</Alert>
    );
  }

  return <UserListView users={users} />;
}
