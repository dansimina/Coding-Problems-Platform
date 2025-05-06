import { useState, useEffect } from "react";
import { UserDTO } from "../types/UserDTO";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Paper,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import CodeIcon from "@mui/icons-material/Code";
import LoginDialog from "../components/LoginDialog";

function MainPage() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

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
    setLoginOpen(false);
  };

  const handleLogout = () => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.setItem("user", "null");
  };

  const openLoginDialog = () => {
    setLoginOpen(true);
  };

  const closeLoginDialog = () => {
    setLoginOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <CodeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Coding Problems Platform
          </Typography>

          {user ? (
            // User is logged in - show profile info and logout button
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
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : (
            // No user - show login button
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={openLoginDialog}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {user ? (
          // User is logged in - show welcome message
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {user.firstName}!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              You are logged in as a {user.type}.
            </Typography>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                maxWidth: 600,
                mx: "auto",
                borderRadius: 2,
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Ready to solve some coding problems?
              </Typography>
              <Typography variant="body1">
                Start exploring our collection of programming challenges
                designed to improve your skills.
              </Typography>
            </Paper>
          </Box>
        ) : (
          // No user - show landing page
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", mt: 8 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Welcome to Coding Problems Platform
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
              Practice, learn and improve your coding skills
            </Typography>

            <Paper
              elevation={6}
              sx={{
                p: 6,
                borderRadius: 4,
                background: "linear-gradient(135deg, #6b73ff 0%, #000dff 100%)",
                color: "white",
              }}
            >
              <Typography variant="h4" gutterBottom>
                Ready to get started?
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Login to access hundreds of coding challenges across multiple
                programming languages.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={openLoginDialog}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Login Now
              </Button>
            </Paper>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1" align="center">
            © {new Date().getFullYear()} Coding Problems Platform
          </Typography>
        </Container>
      </Box>

      {/* Login Dialog */}
      <LoginDialog
        open={loginOpen}
        onClose={closeLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />
    </Box>
  );
}

export default MainPage;
