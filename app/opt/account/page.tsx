"use client";

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Person, CreditCard, Settings } from "@mui/icons-material";
import ProfileTab from "@/app/opt/account/components/profile";
import SubscriptionsTab from "@/app/opt/account/components/subscription";
import PreferencesTab from "@/app/opt/account/components/preferences";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `account-tab-${index}`,
    "aria-controls": `account-tabpanel-${index}`,
  };
}

export default function AccountPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 3, width: "80%" }}>
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
          onChange={handleChange}
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
          />
          <Tab
            icon={<CreditCard />}
            label="Subscriptions"
            {...a11yProps(1)}
            sx={{ justifyContent: "left" }}
            iconPosition="start"
          />
          <Tab
            icon={<Settings />}
            label="Preferences"
            {...a11yProps(2)}
            sx={{ justifyContent: "left" }}
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ flexGrow: 1 }}>
          <TabPanel value={value} index={0}>
            <ProfileTab />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SubscriptionsTab />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <PreferencesTab />
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
}
