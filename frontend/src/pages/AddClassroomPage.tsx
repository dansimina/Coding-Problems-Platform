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
import AppNavigationBar from "../components/AppNavigationBar";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ClassroomDTO } from "../types/ClassroomDTO";
import { UserDTO } from "../types/UserDTO";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function CreateClassroomPage() {
  const { id: classroomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // Add this to debug the current route

  const [formData, setFormData] = useState<Partial<ClassroomDTO>>({
    id: null,
    name: "",
    description: "",
    enrollmentKey: "",
    students: [],
  });
  const [students, setStudents] = useState<UserDTO[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Debug log to see path and params
  useEffect(() => {
    console.log("Current path:", location.pathname);
    console.log("ClassroomId param:", classroomId);

    // Check if we're in edit mode
    if (classroomId) {
      console.log("Edit mode detected, classroom ID:", classroomId);
      setIsEditMode(true);
      // Immediately set isFetchingData to true to show loading state
      setIsFetchingData(true);
    }

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
  }, [classroomId, navigate, location]);

  // Fetch students and classroom data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all students
        const response = await api.get("/user/student/all");
        setStudents(response.data || []);
        console.log("Students fetched:", response.data?.length || 0);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students. Please refresh the page.");
      }

      // If classroomId is provided, fetch classroom data (edit mode)
      if (isEditMode && classroomId) {
        try {
          console.log("Starting to fetch classroom data for ID:", classroomId);
          const response = await api.get(`/classroom/${classroomId}`);
          const classroomData = response.data;

          // Debug output
          console.log("Raw classroom data:", JSON.stringify(classroomData));

          if (!classroomData) {
            throw new Error("No classroom data received");
          }

          // Update form data with the fetched classroom data
          setFormData({
            id: classroomData.id,
            name: classroomData.name || "",
            description: classroomData.description || "",
            enrollmentKey: classroomData.enrollmentKey || "",
            students: classroomData.students || [],
            teacher: classroomData.teacher,
          });

          // Set selected students
          if (classroomData.students && classroomData.students.length > 0) {
            const studentUsernames = classroomData.students.map(
              (student: UserDTO) => student.username
            );
            setSelectedStudents(studentUsernames);
            console.log("Selected students set:", studentUsernames);
          }

          console.log("Form data updated successfully:", {
            id: classroomData.id,
            name: classroomData.name || "",
            description: classroomData.description || "",
            enrollmentKey: classroomData.enrollmentKey || "",
            studentsCount: (classroomData.students || []).length,
          });
        } catch (error) {
          console.error("Error fetching classroom data:", error);
          setError("Failed to load classroom data. Please try again.");
        } finally {
          setIsFetchingData(false);
        }
      } else {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [isEditMode, classroomId]);

  // Rest of the component code remains the same...

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
      if (isEditMode) {
        // Update existing classroom
        console.log("Updating classroom with data:", formData);

        // Since there's no PUT endpoint in the original API, we use the same save endpoint
        // You may need to modify this based on your actual API implementation
        await api.post("/classroom/save", formData);

        setSuccess(true);
        setTimeout(() => {
          navigate("/classrooms");
        }, 2000);
      } else {
        // Create new classroom
        await api.post("/classroom/save", formData);
        setSuccess(true);

        // Reset form after successful submission
        setFormData({
          id: null,
          name: "",
          description: "",
          enrollmentKey: "",
          students: [],
          teacher: formData.teacher, // Keep the current teacher
        });
        setSelectedStudents([]);

        // Redirect to classrooms page after a short delay
        setTimeout(() => {
          navigate("/classrooms");
        }, 2000);
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} classroom:`,
        error
      );
      setError(
        error.response?.data?.message ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } classroom. Please try again.`
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

  // Display loading state when fetching classroom data
  if (isFetchingData) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppNavigationBar />
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              minHeight: "300px",
            }}
          >
            <Typography variant="h5" sx={{ mb: 3 }}>
              Loading Classroom Data
            </Typography>
            <CircularProgress />
          </Paper>
        </Container>
      </Box>
    );
  }

  // Form display remains the same...
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppNavigationBar />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Debug info - remove in production */}
        <Box
          sx={{
            mb: 2,
            p: 2,
            bgcolor: "info.light",
            color: "info.contrastText",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            Mode: {isEditMode ? "Edit" : "Create"} | ID: {classroomId || "None"}{" "}
            | Name: {formData.name || "Empty"} | Students:{" "}
            {selectedStudents.length}
          </Typography>
        </Box>

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
            {isEditMode ? "Edit Classroom" : "Create New Classroom"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Stack spacing={3}>
              {/* Form fields remain the same... */}
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

              <TextField
                required
                fullWidth
                id="description"
                label="Classroom Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Provide a short description of your classroom"
              />

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
                  !formData.description ||
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
                ) : isEditMode ? (
                  "Update Classroom"
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
        message={
          isEditMode
            ? "Classroom updated successfully! Redirecting..."
            : "Classroom created successfully! Redirecting..."
        }
      />
    </Box>
  );
}

export default CreateClassroomPage;
