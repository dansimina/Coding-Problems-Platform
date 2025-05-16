import { useState, useEffect } from "react";
import api from "../api";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { ClassroomDTO } from "../types/ClassroomDTO";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";

function ClassroomsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [classrooms, setClassrooms] = useState<ClassroomDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomDTO | null>(null);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState<boolean>(false);
  const [enrollmentKeyDialogOpen, setEnrollmentKeyDialogOpen] =
    useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Debug information
    console.log("User loaded:", parsedUser);
    console.log("User role:", parsedUser.type); // Most likely using 'type' instead of 'role'

    // Only fetch classrooms after we have a user
    fetchClassrooms(parsedUser);
  }, [navigate]);

  const fetchClassrooms = async (currentUser: any) => {
    if (!currentUser || !currentUser.id) {
      console.error("Cannot fetch classrooms: User or user.id is undefined");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Fetching classrooms for user type:", currentUser.type);

      // Using type instead of role to match your App.tsx roles setup
      if (currentUser.type === "admin" || currentUser.type === "teacher") {
        const response = await api.get(
          `/classroom/all/teacher/${currentUser.id}`
        );
        setClassrooms(response.data);
      } else if (currentUser.type === "student") {
        const response = await api.get(
          `/classroom/all/student/${currentUser.id}`
        );
        setClassrooms(response.data);
      } else {
        // Handle user role (this could be the missing case)
        const response = await api.get(
          `/classroom/all/student/${currentUser.id}`
        );
        setClassrooms(response.data);
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      setError("Failed to load classrooms. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClassroom = () => {
    // Check if user is teacher or admin before allowing classroom creation
    if (user && (user.type === "teacher" || user.type === "admin")) {
      navigate("/add-classroom");
    } else {
      setError("Only teachers and administrators can create classrooms.");
    }
  };

  const handleViewStudents = (classroom: ClassroomDTO) => {
    setSelectedClassroom(classroom);
    setStudentsDialogOpen(true);
  };

  const handleShowEnrollmentKey = (classroom: ClassroomDTO) => {
    setSelectedClassroom(classroom);
    setEnrollmentKeyDialogOpen(true);
  };

  const handleCopyEnrollmentKey = () => {
    if (selectedClassroom) {
      navigator.clipboard.writeText(selectedClassroom.enrollmentKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDeleteClassroom = (classroom: ClassroomDTO) => {
    // Only allow teachers and admins to delete
    if (user && (user.type === "teacher" || user.type === "admin")) {
      setSelectedClassroom(classroom);
      setDeleteDialogOpen(true);
    } else {
      setError("Only teachers and administrators can delete classrooms.");
    }
  };

  const confirmDeleteClassroom = async () => {
    if (!selectedClassroom) return;

    try {
      await api.delete(`/classroom/${selectedClassroom.id}`);
      setClassrooms(classrooms.filter((c) => c.id !== selectedClassroom.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting classroom:", error);
      setError("Failed to delete classroom. Please try again.");
    }
  };

  const handleClassroomDetails = (classroom: ClassroomDTO) => {
    navigate(`/classroom/${classroom.id}`);
  };

  const handleEditClassroom = (classroom: ClassroomDTO) => {
    // Only allow teachers and admins to edit
    if (user && (user.type === "teacher" || user.type === "admin")) {
      navigate(`/edit-classroom/${classroom.id}`);
    } else {
      setError("Only teachers and administrators can edit classrooms.");
    }
  };

  // Render UI only when user is available
  if (!user) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavigationBar />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavigationBar />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavigationBar />

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Classrooms
          </Typography>
          {(user.type === "teacher" || user.type === "admin") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClassroom}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Create Classroom
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {classrooms.length === 0 ? (
          <Paper
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: "grey.50",
            }}
          >
            <Typography variant="h6" gutterBottom>
              No classrooms found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {user.type === "teacher" || user.type === "admin"
                ? "Create your first classroom to start teaching coding!"
                : "You are not enrolled in any classrooms yet."}
            </Typography>
            {(user.type === "teacher" || user.type === "admin") && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateClassroom}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Create Classroom
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {classrooms.map((classroom) => (
              <Grid item xs={12} sm={6} lg={4} key={classroom.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {classroom.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {classroom.descrition}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <GroupIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        {classroom.students?.length || 0} students enrolled
                      </Typography>
                    </Box>

                    {(user.type === "teacher" || user.type === "admin") && (
                      <Tooltip title="View enrollment key" arrow>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleShowEnrollmentKey(classroom)}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: "none",
                            mt: 1,
                          }}
                        >
                          Show Enrollment Key
                        </Button>
                      </Tooltip>
                    )}
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <Box>
                      <Tooltip title="View students">
                        <IconButton
                          onClick={() => handleViewStudents(classroom)}
                          color="primary"
                        >
                          <PeopleIcon />
                        </IconButton>
                      </Tooltip>
                      {(user.type === "teacher" || user.type === "admin") && (
                        <>
                          <Tooltip title="Edit classroom">
                            <IconButton
                              onClick={() => handleEditClassroom(classroom)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete classroom">
                            <IconButton
                              onClick={() => handleDeleteClassroom(classroom)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleClassroomDetails(classroom)}
                      sx={{ borderRadius: 1.5, textTransform: "none" }}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Students Dialog */}
      <Dialog
        open={studentsDialogOpen}
        onClose={() => setStudentsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Students in {selectedClassroom?.name}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedClassroom?.students?.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No students enrolled in this classroom yet.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Share the enrollment key with your students to get started.
              </Typography>
            </Box>
          ) : (
            <List>
              {selectedClassroom?.students?.map((student) => (
                <ListItem key={student.id}>
                  <ListItemAvatar>
                    <Avatar src={student.profilePicture}>
                      {student.firstName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${student.firstName} ${student.lastName}`}
                    secondary={student.username}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Enrollment Key Dialog */}
      <Dialog
        open={enrollmentKeyDialogOpen}
        onClose={() => setEnrollmentKeyDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Enrollment Key
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share this key with your students so they can join your classroom.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              value={selectedClassroom?.enrollmentKey || ""}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              size="small"
            />
            <Tooltip title={copySuccess ? "Copied!" : "Copy to clipboard"}>
              <IconButton onClick={handleCopyEnrollmentKey} color="primary">
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollmentKeyDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Delete Classroom
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the classroom "
            {selectedClassroom?.name}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone. All associated data including student
            enrollment will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteClassroom} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ClassroomsPage;
