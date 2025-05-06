import { useState, useEffect } from "react";
import { UserDTO } from "../types/UserDTO";
import AuthPage from "./AuthPage";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Paper,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function MainPage() {
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    // Check for user in localStorage on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "null") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: UserDTO) => {
    // Save user to state and localStorage
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.setItem("user", "null");
  };

  // If no user is logged in, show the auth page
  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // If user is logged in, show the dashboard
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LMS Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  bgcolor: "secondary.main",
                  width: 40,
                  height: 40,
                }}
                src={user.profilePicture || undefined}
              >
                {!user.profilePicture &&
                  user.firstName?.charAt(0).toUpperCase() +
                    user.lastName?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", lineHeight: 1 }}
                >
                  {user.type}
                </Typography>
              </Box>
            </Box>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user.firstName}!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You are logged in as a {user.type}.
          </Typography>

          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: user.profilePicture ? "transparent" : "primary.main",
                }}
                src={user.profilePicture || undefined}
              >
                {!user.profilePicture && <AccountCircleIcon fontSize="large" />}
              </Avatar>

              <Box>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  @{user.username}
                </Typography>
                <Typography variant="body2">{user.email}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Dashboard content would go here */}
        <Box
          sx={{
            p: 3,
            border: "1px dashed rgba(0, 0, 0, 0.12)",
            borderRadius: 2,
            bgcolor: "background.paper",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Dashboard Content
          </Typography>
          <Typography variant="body2">
            This is where your dashboard content would be displayed. Add
            components specific to your user type here.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default MainPage;
