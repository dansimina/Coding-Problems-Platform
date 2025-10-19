import { useEffect, useState } from "react";
import { UserDTO } from "../types/UserDTO";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import CodeIcon from "@mui/icons-material/Code";
import MenuIcon from "@mui/icons-material/Menu";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ClassIcon from "@mui/icons-material/Class";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"; // Import the AutoFixHigh icon for GeminiAI
import LoginDialog from "./LoginDialog";
import GeminiAIDialog from "./GeminiAIDialog"; // Import the GeminiAIDialog component
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDTO | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [navMenuAnchor, setNavMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [geminiAIDialogOpen, setGeminiAIDialogOpen] = useState(false); // State for GeminiAI dialog

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "null") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: UserDTO) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.setItem("user", "null");
    setUserMenuAnchor(null);
    navigate("/");
  };

  const openLoginDialog = () => {
    setLoginOpen(true);
  };

  const closeLoginDialog = () => {
    setLoginOpen(false);
  };

  // Toggle the GeminiAI dialog
  const toggleGeminiAIDialog = () => {
    setGeminiAIDialogOpen(!geminiAIDialogOpen);
  };

  const handleMenuClick = (option: string) => {
    switch (option) {
      case "problems":
        navigate("/problems");
        break;
      case "addProblem":
        navigate("/add-problem");
        break;
      case "addTopic":
        navigate("/add-topic");
        break;
      case "topics":
        navigate("/topics");
        break;
      case "profile":
        // Navigate to profile with user ID if available
        if (user && user.id) {
          navigate(`/profile/${user.id}`);
        } else {
          navigate("/");
        }
        break;
      case "classrooms":
        navigate("/classrooms");
        break;
      case "addClassroom":
        navigate("/add-classroom");
        break;
      case "users":
        navigate("/users");
        break;
      default:
        navigate("/");
        break;
    }
  };

  // Generate nav menu items
  const renderNavMenuItems = () => {
    const items = [];

    // Basic items for all users
    items.push(
      <MenuItem
        key="problems"
        onClick={() => handleMenuClick("problems")}
        sx={{
          borderRadius: 1,
          m: 0.5,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <ListItemIcon>
          <ListAltIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="Problems" />
      </MenuItem>
    );

    // Add Classrooms menu item ONLY for logged-in users
    if (user) {
      items.push(
        <MenuItem
          key="classrooms"
          onClick={() => handleMenuClick("classrooms")}
          sx={{
            borderRadius: 1,
            m: 0.5,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon>
            <ClassIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="My Classrooms" />
        </MenuItem>
      );
    }

    // Add Find Users menu item for ALL logged-in users
    if (user) {
      items.push(
        <MenuItem
          key="users"
          onClick={() => handleMenuClick("users")}
          sx={{
            borderRadius: 1,
            m: 0.5,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon>
            <PersonSearchIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Find Users" />
        </MenuItem>
      );
    }

    // Admin-only items
    if (user?.type === "admin") {
      items.push(<Divider key="admin-divider" sx={{ my: 1 }} />);
      items.push(
        <MenuItem
          key="addProblem"
          onClick={() => handleMenuClick("addProblem")}
          sx={{
            borderRadius: 1,
            m: 0.5,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon>
            <AddIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Add new problem" />
        </MenuItem>
      );

      items.push(
        <MenuItem
          key="topics"
          onClick={() => handleMenuClick("topics")}
          sx={{
            borderRadius: 1,
            m: 0.5,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon>
            <CategoryIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Manage Topics" />
        </MenuItem>
      );
    }

    return items;
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={3}
        sx={{
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(to right, #1976d2, #2196f3)"
              : undefined,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left section with logo and navigation menu */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Navigation Menu">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="navigation menu"
                sx={{
                  mr: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                onClick={(event) => setNavMenuAnchor(event.currentTarget)}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>

            <Menu
              id="nav-menu"
              anchorEl={navMenuAnchor}
              open={Boolean(navMenuAnchor)}
              onClose={() => setNavMenuAnchor(null)}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 250 }}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  borderRadius: 2,
                  overflow: "visible",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              {renderNavMenuItems()}
            </Menu>

            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <CodeIcon sx={{ mr: 1, fontSize: isMobile ? 24 : 28 }} />
              {!isMobile && "Coding Problems Platform"}
              {isMobile && "CodingPro"}
            </Typography>
          </Box>

          {/* Right section with user profile or login */}
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
                  {!isMobile && "Ask GeminiAI"}
                </Button>
              </Tooltip>
            )}

            {user ? (
              // User is logged in
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Account settings">
                  <Box
                    onClick={(event) => setUserMenuAnchor(event.currentTarget)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      py: 0.5,
                      px: 1,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
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
                    {!isMobile && (
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "500", color: "white" }}
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>

                <Menu
                  id="user-menu"
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={() => setUserMenuAnchor(null)}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      overflow: "visible",
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
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

                  <MenuItem
                    onClick={() => handleMenuClick("profile")}
                    sx={{
                      borderRadius: 1,
                      m: 0.5,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="My Profile" />
                  </MenuItem>

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 1,
                      m: 0.5,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{ color: "error" }}
                    />
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              // No user - show login button
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LoginIcon />}
                onClick={openLoginDialog}
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <LoginDialog
        open={loginOpen}
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

export default NavigationBar;
