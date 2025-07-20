"use client";

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Person, CreditCard, Settings } from "@mui/icons-material";
import { usePathname } from "next/navigation";

function a11yProps(index: number) {
  return {
    id: `account-tab-${index}`,
    "aria-controls": `account-tabpanel-${index}`,
  };
}

export default function AccountPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const value = path.includes("profile")
    ? 0
    : path.includes("subscriptions")
    ? 1
    : path.includes("preferences")
    ? 2
    : 0;

  return (
    <Box sx={{ p: 3, width: "80%", margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          minHeight: 600,
          mt: 3,
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          aria-label="Account settings tabs"
          sx={{
            borderRight: 1,
            borderColor: "divider",
            minWidth: 200,
          }}
        >
          <Tab
            icon={<Person />}
            label="Profile"
            {...a11yProps(0)}
            sx={{ justifyContent: "left" }}
            iconPosition="start"
            href="/account/profile"
          />
          <Tab
            icon={<CreditCard />}
            label="Subscriptions"
            {...a11yProps(1)}
            sx={{ justifyContent: "left" }}
            iconPosition="start"
            href="/account/subscriptions"
          />
          <Tab
            icon={<Settings />}
            label="Preferences"
            {...a11yProps(2)}
            sx={{ justifyContent: "left" }}
            iconPosition="start"
            href="/account/preferences"
          />
        </Tabs>

        <Box sx={{ flexGrow: 1, p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
}
