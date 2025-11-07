import {
  AccountCircle,
  Add,
  Dashboard,
  Person,
  ListAlt,
  TrackChanges,
  HelpOutline,
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
    name: "Learning Goals",
    path: "/goal/list",
    icon: <TrackChanges />,
    authRequired: true,
  },
  {
    name: "My Activities",
    path: "/activity/list",
    icon: <ListAlt />,
    authRequired: true,
  },
  {
    name: "Add Activity",
    path: "/activity/create",
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
    name: "Help",
    path: "/help",
    icon: <HelpOutline />,
    authRequired: false,
  },
  // {
  //   name: "Pricing",
  //   path: "/pricing",
  //   icon: <AttachMoney />,
  //   authRequired: false,
  // },
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
