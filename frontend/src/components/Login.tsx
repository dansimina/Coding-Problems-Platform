import api from "../api";
import { useState } from "react";
import { LoginDTO } from "../types/LoginDTO";
import { UserDTO } from "../types/UserDTO";
import {
  Alert,
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  Container,
  CircularProgress,
  Avatar,
  Fade,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface LoginProps {
  onLogin: (user: UserDTO) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const loginDTO: LoginDTO = {
        username,
        password,
      };

      const response = await api.post<UserDTO>("/login", loginDTO);
      onLogin(response.data);
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Fade in={true} timeout={800}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // Removed fixed height to prevent scrolling issues
            py: 3,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <Avatar
              sx={{
                margin: 1,
                bgcolor: "primary.main",
                width: 48,
                height: 48,
              }}
            >
              <LockOutlinedIcon />
            </Avatar>

            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              Login
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
                size="small"
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
                size="small"
              />

              {error && (
                <Fade in={!!error}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="medium"
                disabled={isLoading}
                sx={{
                  py: 1,
                  mt: 1,
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Log In"
                )}
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 1 }}
              >
                Enter your credentials to access the system
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}

export default Login;
