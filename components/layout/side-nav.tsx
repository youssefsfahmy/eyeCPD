"use client";
import * as React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Button,
  Fab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExitToApp,
  Visibility,
} from "@mui/icons-material";
import { createClient } from "@/app/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { accountItems, navigationItems } from "./constants";

const drawerWidth = 280;

interface SideNavProps {
  children?: React.ReactNode;
}

export default function SideNav({ children }: SideNavProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    closeDrawer();
  };

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Visibility sx={{ color: "primary.main", mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            EyeCPD
          </Typography>
        </Box>
        <IconButton
          onClick={closeDrawer}
          size="small"
          sx={{ color: "text.primary" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <List sx={{ p: 0 }}>
          {navigationItems.map((item) => {
            if (item.authRequired && !user) return null;

            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  onClick={closeDrawer}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "primary.50",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Account Section */}
        {user && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ px: 2, fontWeight: 600, textTransform: "uppercase" }}
            >
              Account
            </Typography>
            <List sx={{ p: 0, mt: 1 }}>
              {accountItems.map((item) => (
                <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    onClick={closeDrawer}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "primary.50",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        {user ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  width: 48,
                  height: 48,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              <Box sx={{ ml: 2, minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle1" noWrap fontWeight={600}>
                  {user?.email?.split("@")[0] || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email || ""}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<ExitToApp />}
              onClick={logout}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              router.push("/auth/login");
              closeDrawer();
            }}
            sx={{ textTransform: "none", py: 1.5 }}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Hamburger Button */}
      <Fab
        // color="primary"
        aria-label="menu"
        onClick={toggleDrawer}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "none",
            transform: "scale(1.05)",
          },
          transition: "transform 0.2s ease-in-out",
        }}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon sx={{ color: "primary.main" }} />}
      </Fab>

      {/* Backdrop for mobile */}
      {isOpen && isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: theme.zIndex.drawer,
          }}
          onClick={closeDrawer}
        />
      )}

      {/* Side Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={closeDrawer}
        variant={isMobile ? "temporary" : "persistent"}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
            boxShadow: isOpen ? 4 : 0,
            transform: isOpen
              ? "translateX(0)"
              : `translateX(-${drawerWidth}px)`,
            transition: theme.transitions.create("transform", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      {children && (
        <Box
          sx={{
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: !isMobile && isOpen ? `${drawerWidth}px` : 0,
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          {children}
        </Box>
      )}
    </>
  );
}
