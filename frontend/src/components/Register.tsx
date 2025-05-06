import { useState, useRef } from "react";
import api from "../api";
import { UserDTO } from "../types/UserDTO";
import {
  Alert,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

interface RegisterProps {
  onRegisterSuccess: (user: UserDTO) => void;
}

function Register({ onRegisterSuccess }: RegisterProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    type: "student" as "admin" | "teacher" | "student",
    profilePicture: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should not exceed 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setPreviewImage(base64String);
      setFormData((prev) => ({
        ...prev,
        profilePicture: base64String,
      }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userDTO: UserDTO = {
        id: null,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        type: formData.type,
        profilePicture: formData.profilePicture,
      };

      const response = await api.post<UserDTO>("/register", userDTO);
      onRegisterSuccess(response.data);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            sx={{
              margin: "0 auto",
              bgcolor: previewImage ? "transparent" : "primary.main",
              width: 56,
              height: 56,
            }}
            src={previewImage || undefined}
          >
            {!previewImage && <PersonAddOutlinedIcon />}
          </Avatar>
          <Tooltip title="Upload profile picture">
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                width: 24,
                height: 24,
              }}
              onClick={triggerFileInput}
            >
              <AddAPhotoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </Box>

        <Typography
          component="h1"
          variant="h5"
          sx={{ mt: 1, fontWeight: "bold" }}
        >
          Create Account
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <Stack spacing={2}>
          {/* First row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              required
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              autoFocus
              size="small"
            />
            <TextField
              required
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              size="small"
            />
          </Box>

          {/* Second row */}
          <TextField
            required
            fullWidth
            id="username"
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            size="small"
          />

          {/* Third row */}
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            size="small"
          />

          {/* Fourth row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              size="small"
            />
            <TextField
              required
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              size="small"
            />
          </Box>

          {/* Fifth row */}
          <TextField
            select
            required
            fullWidth
            id="type"
            name="type"
            label="Account Type"
            value={formData.type}
            onChange={handleChange}
            size="small"
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="admin">Administrator</MenuItem>
          </TextField>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="medium"
          disabled={isLoading}
          sx={{
            py: 1,
            mt: 3,
            mb: 1,
            fontWeight: "bold",
            fontSize: "0.9rem",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Register Now"
          )}
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 1, fontSize: "0.8rem" }}
        >
          By registering, you agree to our Terms of Service
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;
