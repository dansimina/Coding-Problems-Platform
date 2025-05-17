import { useState, useEffect } from "react";
import api from "../api";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  SelectChangeEvent,
  OutlinedInput,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { ClassroomDTO } from "../types/ClassroomDTO";
import { UserDTO } from "../types/UserDTO";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function CreateClassroomPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ClassroomDTO>>({
    id: null,
    name: "",
    descrition: "", // Note: There's a typo in your ClassroomDTO interface
    enrollmentKey: "",
    students: [],
  });
  const [students, setStudents] = useState<UserDTO[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is teacher or admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.type !== "teacher" && user.type !== "admin") {
      navigate("/");
      return;
    }

    // Set the current user as the teacher
    setFormData((prev) => ({
      ...prev,
      teacher: user,
    }));

    const fetchStudents = async () => {
      try {
        const response = await api.get("/user/student/all");
        setStudents(response.data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students. Please refresh the page.");
      }
    };

    fetchStudents();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentChange = (event: SelectChangeEvent<string[]>) => {
    const selectedUsernames = event.target.value as string[];
    setSelectedStudents(selectedUsernames);

    // Update the students in the form data
    const selectedStudentObjects = students.filter((student) =>
      selectedUsernames.includes(student.username)
    );

    setFormData((prev) => ({
      ...prev,
      students: selectedStudentObjects,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/classroom/save", formData);
      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        id: null,
        name: "",
        descrition: "",
        enrollmentKey: "",
        students: [],
        teacher: formData.teacher, // Keep the current teacher
      });
      setSelectedStudents([]);

      // Redirect to classrooms page after a short delay
      setTimeout(() => {
        navigate("/classrooms");
      }, 2000);
    } catch (error: any) {
      console.error("Error creating classroom:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create classroom. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  // Generate random enrollment key
  const generateEnrollmentKey = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < 8; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({
      ...prev,
      enrollmentKey: key,
    }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavigationBar />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Create New Classroom
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Stack spacing={3}>
              {/* Classroom Name */}
              <TextField
                required
                fullWidth
                id="name"
                label="Classroom Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Web Development 101, Data Structures"
              />

              {/* Classroom Description */}
              <TextField
                required
                fullWidth
                id="descrition"
                label="Classroom Description"
                name="descrition"
                value={formData.descrition}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Provide a short description of your classroom"
              />

              {/* Enrollment Key with Generate Button */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="enrollmentKey"
                  label="Enrollment Key"
                  name="enrollmentKey"
                  value={formData.enrollmentKey}
                  onChange={handleChange}
                  placeholder="Students will use this key to join your classroom"
                  helperText="Share this key with your students"
                />
                <Button
                  variant="outlined"
                  onClick={generateEnrollmentKey}
                  sx={{ whiteSpace: "nowrap", mt: 1 }}
                >
                  Generate Key
                </Button>
              </Box>

              {/* Student Selection */}
              <FormControl fullWidth>
                <InputLabel id="students-label">
                  Add Students (Optional)
                </InputLabel>
                <Select
                  labelId="students-label"
                  id="students"
                  multiple
                  value={selectedStudents}
                  onChange={handleStudentChange}
                  input={<OutlinedInput label="Add Students (Optional)" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 250,
                      },
                    },
                  }}
                  startAdornment={
                    <PersonAddIcon
                      sx={{ mr: 1, ml: 1, color: "action.active" }}
                    />
                  }
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.username}>
                      {student.firstName} {student.lastName} ({student.username}
                      )
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/classrooms")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  isLoading ||
                  !formData.name ||
                  !formData.descrition ||
                  !formData.enrollmentKey
                }
                sx={{
                  py: 1,
                  px: 3,
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Classroom"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Classroom created successfully! Redirecting..."
      />
    </Box>
  );
}

export default CreateClassroomPage;
