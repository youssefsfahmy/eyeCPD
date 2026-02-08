"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@mui/material";
import SideNav from "./side-nav";
import { navigationItems } from "./constants";
import { useProfile } from "@/lib/context/profile-context";
import LogoColor from "../common/icons/logo-color";
import { UserRole } from "@/lib/db/schema";

function ResponsiveAppBar() {
  const router = useRouter();
  const { user, signOut, profile } = useProfile();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = async () => {
    handleCloseUserMenu();
    await signOut();
    router.push("/");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "background.paper",
        mx: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
        mt: 2,
        mb: 1,
        color: "text.primary",
        width: "auto",
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Toolbar disableGutters>
          <Link href="/opt" passHref className="mx-auto hidden lg:block">
            <LogoColor size={50} />
          </Link>

          <Box
            sx={{ flexGrow: { md: 1 }, display: { xs: "flex", md: "none" } }}
          >
            <SideNav />
          </Box>

          <LogoColor size={50} className="mx-auto lg:hidden" />
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex", gap: 10 },
              justifyContent: "flex-end",
              mx: 2,
            }}
          >
            {navigationItems.map((page) => {
              if (page.authRequired && !user) return null;

              if (
                page.authRequired &&
                !page.roles.some((role) => profile?.roles.includes(role))
              )
                return null;
              return (
                <Link href={page.path} key={page.path} passHref>
                  <Button
                    variant="text"
                    sx={{
                      textAlign: "center",
                      my: 2,
                      color: page.roles.includes(UserRole.ADMIN)
                        ? "darkolivegreen"
                        : "text.secondary",
                    }}
                    startIcon={page.icon}
                  >
                    {page.name}
                  </Button>
                </Link>
              );
            })}
          </Box>
          <Box sx={{ flexGrow: 0, minWidth: "3rem" }}>
            <Tooltip title="Open settings">
              {user ? (
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {/* first letter of user email */}
                  <Avatar
                    alt={user?.email || "User"}
                    // src="/static/images/avatar/2.jpg"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      width: 32,
                      height: 32,
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </IconButton>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push("/auth/login")}
                  sx={{ textTransform: "none" }}
                >
                  Login
                </Button>
              )}
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Link
                  href="/account/profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography sx={{ textAlign: "center" }}>Account</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={logout}>
                <Typography sx={{ textAlign: "center" }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
