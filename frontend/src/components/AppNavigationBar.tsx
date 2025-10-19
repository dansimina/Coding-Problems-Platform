import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Code";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"; // Import the AutoFixHigh icon for GeminiAI
import { useNavigate } from "react-router-dom";

import { UserDTO } from "../types/UserDTO";
import LoginDialog from "./LoginDialog";
import { Divider } from "@mui/material";
import GeminiAIDialog from "./GeminiAIDialog";

const basePages = [["Problems", "/problems"]];

function AppNavigationBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const navigate = useNavigate();
  const [user, setUser] = React.useState<null | UserDTO>(null);
  const [login, setLogin] = React.useState<boolean>(false);
  const [pages, setPages] = React.useState<string[][]>(basePages);

  const [userSettings, _] = React.useState({
    common: [
      ["Classrooms", "/classrooms"],
      ["Find Users", "/users"],
    ],

    student: [],
    teacher: [["Add new problem", "/add-problem"]],
    admin: [
      ["Add new problem", "/add-problem"],
      ["Manage Topics", "/topics"],
    ],
  });

  const [geminiAIDialogOpen, setGeminiAIDialogOpen] = React.useState(false); // State for GeminiAI dialog

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("storedUser:", storedUser, typeof storedUser);

    if (storedUser && storedUser !== "null") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      console.log("No valid user found, user should remain null");
      setUser(null); // Explicitly set to null
    }
  }, []);

  React.useEffect(() => {
    if (user && user.type && userSettings[user.type]) {
      setPages([
        ...basePages,
        ...userSettings.common,
        ...userSettings[user.type],
      ]);
    } else {
      setPages(basePages);
    }
  }, [user]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (link: string) => {
    navigate(link);
  };

  const handleLogin = () => {
    setLogin(true);
  };

  const closeLoginDialog = () => {
    setLogin(false);
  };

  const handleLoginSuccess = (loggedInUser: UserDTO) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setLogin(false);
  };

  const handleGoToPersonalProfile = () => {
    if (user) {
      navigate(`/profile/${user.id}`);
    }
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.setItem("user", "null");
    setAnchorElUser(null);
    navigate("/");
    handleCloseUserMenu();
  };

  const options: [string, () => void][] = [
    ["Profile", handleGoToPersonalProfile],
    ["Logout", handleLogout],
  ];

  // Toggle the GeminiAI dialog
  const toggleGeminiAIDialog = () => {
    setGeminiAIDialogOpen(!geminiAIDialogOpen);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
              onClick={() => navigate("/")}
            >
              Coding Problems Platform
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map(([page, _]) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Coding Problems Platform
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map(([page, link]) => (
                <Button
                  key={page}
                  onClick={() => {
                    handleMenuClick(link);
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            {user === null ? (
              <Button
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
                sx={{ backgroundColor: "purple", color: "white" }} // Make it super visible
              >
                Login
              </Button>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* GeminiAI Button - Only visible for logged-in users */}
                {user && (
                  <Tooltip title="Ask GeminiAI">
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<AutoFixHighIcon />}
                      onClick={toggleGeminiAIDialog}
                      sx={{
                        borderRadius: 8,
                        px: 2,
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        color: "white",
                        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
                        },
                      }}
                    >
                      Ask GeminiAI
                    </Button>
                  </Tooltip>
                )}

                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        bgcolor: "secondary.main",
                        width: 40,
                        height: 40,
                        border: "2px solid white",
                      }}
                      src={user.profilePicture || undefined}
                    >
                      {!user.profilePicture &&
                        user.firstName?.charAt(0).toUpperCase() +
                          user.lastName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
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
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>

                  <Divider />

                  {options.map(([optionName, optionFunction]) => (
                    <MenuItem key={optionName} onClick={optionFunction}>
                      <Typography sx={{ textAlign: "center" }}>
                        {optionName}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <LoginDialog
        open={login}
        onClose={closeLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* GeminiAI Dialog Component */}
      <GeminiAIDialog
        open={geminiAIDialogOpen}
        onClose={() => setGeminiAIDialogOpen(false)}
      />
    </>
  );
}
export default AppNavigationBar;
