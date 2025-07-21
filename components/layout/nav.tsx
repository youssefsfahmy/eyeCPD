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
import { createClient } from "@/app/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Visibility } from "@mui/icons-material";
import Link from "next/link";
import { Button } from "@mui/material";
import SideNav from "./side-nav";
import { navigationItems } from "./constants";

function ResponsiveAppBar() {
  const router = useRouter();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

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
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Visibility
            sx={{
              color: "primary.main",
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/opt"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            EyeCPD
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <SideNav />
          </Box>
          <Visibility
            sx={{ color: "primary.main", display: { xs: "flex", md: "none" } }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/opt"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            EyeCPD
          </Typography>
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

              return (
                <Link href={page.path} key={page.path} passHref>
                  <Button
                    variant="text"
                    sx={{
                      textAlign: "center",
                      my: 2,
                      color: "text.primary",
                    }}
                    startIcon={page.icon}
                  >
                    {page.name}
                  </Button>
                </Link>
              );
            })}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
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
