import { useState, useRef } from "react";
import api from "../api";
import { UserDTO } from "../types/UserDTO";
import {
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloseIcon from "@mui/icons-material/Close";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserDTO | null;
  onUpdateSuccess: (updatedUser: UserDTO) => void;
}

function EditProfileDialog({
  open,
  onClose,
  user,
  onUpdateSuccess,
}: EditProfileDialogProps) {
  // Clone user data for the form to avoid direct mutation
  const initialFormData = user
    ? {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        profilePicture: user.profilePicture,
        // Password is not included as we don't want to display the current password
        password: null,
        confirmPassword: "",
      }
    : {
        id: null,
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        type: "student" as "admin" | "teacher" | "student",
        profilePicture: "",
        password: null,
        confirmPassword: "",
      };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profilePicture || null
  );
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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

  const handleTogglePasswordChange = () => {
    setIsChangingPassword(!isChangingPassword);
    if (!isChangingPassword) {
      setFormData((prev) => ({
        ...prev,
        password: null,
        confirmPassword: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password if it's being changed
    if (isChangingPassword) {
      if (!formData.password) {
        setError("Please enter a new password");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      // Create user DTO for the API
      const userDTO: UserDTO = {
        id: formData.id,
        username: formData.username,
        password: isChangingPassword ? formData.password : null,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        type: formData.type,
        profilePicture: formData.profilePicture,
      };

      // Make the API call to update the user
      const response = await api.post<UserDTO>(`/user/update`, userDTO);

      // Update localStorage with the new user data if it's the current user
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id === user?.id) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      }

      // Call the success callback
      onUpdateSuccess(response.data);

      // Close the dialog
      onClose();
    } catch (error: any) {
      console.error("Profile update error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div" fontWeight="bold">
            Edit Profile
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {/* Profile Picture */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ position: "relative", mb: 1 }}>
              <Avatar
                sx={{ width: 100, height: 100, bgcolor: "primary.main" }}
                src={previewImage || undefined}
              >
                {!previewImage && formData.firstName.charAt(0).toUpperCase()}
              </Avatar>
              <Tooltip title="Upload profile picture">
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": { backgroundColor: "primary.dark" },
                    width: 32,
                    height: 32,
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
            <Typography variant="body2" color="text.secondary">
              Click to change profile picture
            </Typography>
          </Box>

          <Stack spacing={2}>
            {/* Personal Information */}
            <Typography variant="subtitle1" fontWeight="bold">
              Personal Information
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                required
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
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

            {/* Contact Information */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Contact Information
            </Typography>

            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              size="small"
            />

            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              size="small"
              disabled
              helperText="Username cannot be changed"
            />

            {/* Password Section */}
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Password
                </Typography>
                <Button
                  size="small"
                  onClick={handleTogglePasswordChange}
                  color="primary"
                >
                  {isChangingPassword
                    ? "Cancel Password Change"
                    : "Change Password"}
                </Button>
              </Box>

              {isChangingPassword && (
                <Box sx={{ mt: 2 }}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="New Password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm New Password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      size="small"
                    />
                  </Stack>
                </Box>
              )}
            </Box>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 3, mb: 1 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProfileDialog;
