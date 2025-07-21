import {
  AccountCircle,
  Add,
  AttachMoney,
  Dashboard,
  Person,
} from "@mui/icons-material";
import { Search } from "lucide-react";

export const navigationItems = [
  {
    name: "Dashboard",
    path: "/opt",
    icon: <Dashboard />,
    authRequired: true,
  },
  {
    name: "Add Activity",
    path: "/opt/add-activity",
    icon: <Add />,
    authRequired: true,
  },
  {
    name: "Browse CPD",
    path: "/opt/browse-cpd",
    icon: <Search />,
    authRequired: false,
  },
  {
    name: "Pricing",
    path: "/pricing",
    icon: <AttachMoney />,
    authRequired: false,
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
