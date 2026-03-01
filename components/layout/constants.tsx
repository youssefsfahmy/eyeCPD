import { UserRole } from "@/lib/db/schema";
import {
  AccountCircle,
  Add,
  Dashboard,
  Person,
  ListAlt,
  TrackChanges,
  HelpOutline,
  People,
  ChatBubble,
  AdminPanelSettings,
} from "@mui/icons-material";
import { Search } from "lucide-react";

export const navigationItems = [
  {
    name: "Dashboard",
    path: "/opt",
    icon: <Dashboard />,
    authRequired: true,
    roles: [UserRole.OPTOMETRIST],
  },
  {
    name: "Learning Goals",
    path: "/goal/list",
    icon: <TrackChanges />,
    authRequired: true,
    roles: [UserRole.OPTOMETRIST],
  },
  {
    name: "My Activities",
    path: "/activity/list",
    icon: <ListAlt />,
    authRequired: true,
    roles: [UserRole.OPTOMETRIST],
  },
  {
    name: "Add Activity",
    path: "/activity/create",
    icon: <Add />,
    authRequired: true,
    roles: [UserRole.OPTOMETRIST],
  },
  {
    name: "Browse CPD",
    path: "/opt/browse-cpd",
    icon: <Search />,
    authRequired: false,
    roles: [UserRole.OPTOMETRIST],
  },
  {
    name: "Help",
    path: "/help",
    icon: <HelpOutline />,
    authRequired: false,
    roles: [UserRole.OPTOMETRIST],
  },
];

export const adminNavigationItems = [
  {
    name: "Admin Home",
    path: "/admin",
    icon: <AdminPanelSettings />,
    authRequired: true,
    roles: [UserRole.ADMIN],
  },
  {
    name: "Users",
    path: "/admin/users/list",
    icon: <People />,
    authRequired: true,
    roles: [UserRole.ADMIN],
  },
  {
    name: "Feedback",
    path: "/admin/feedback",
    icon: <ChatBubble />,
    authRequired: true,
    roles: [UserRole.ADMIN],
  },
];

export const accountItems = [
  {
    name: "Profile",
    path: "/account/profile",
    icon: <Person />,
    authRequired: true,
  },
  {
    name: "Account Settings",
    path: "/account/preferences",
    icon: <AccountCircle />,
    authRequired: true,
  },
];
