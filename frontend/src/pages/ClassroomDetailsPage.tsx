import { useState, useEffect } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AppNavigationBar from "../components/AppNavigationBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { ClassroomDTO } from "../types/ClassroomDTO";
import { HomeworkDTO } from "../types/HomeworkDTO";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`classroom-tabpanel-${index}`}
      aria-labelledby={`classroom-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3, px: 4 }}>{children}</Box>}
    </div>
  );
}

function ClassroomDetailsPage() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [classroom, setClassroom] = useState<ClassroomDTO | null>(null);
  const [homeworks, setHomeworks] = useState<HomeworkDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);
  const [deleteHomeworkDialogOpen, setDeleteHomeworkDialogOpen] =
    useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState<number | null>(
    null
  );

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    console.log("User type:", parsedUser.type);

    if (!classroomId) return;

    fetchClassroomDetails();
  }, [classroomId, navigate]);

  const fetchClassroomDetails = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch classroom details
      const classroomResponse = await api.get(`/classroom/${classroomId}`);
      setClassroom(classroomResponse.data);

      // Fetch homeworks for this classroom
      const homeworksResponse = await api.get(
        `/classroom/${classroomId}/homeworks`
      );
      setHomeworks(homeworksResponse.data);
    } catch (error) {
      console.error("Error fetching classroom details:", error);
      setError("Failed to load classroom details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHomework = () => {
    if (classroom && classroom.id) {
      navigate(`/add-homework/${classroom.id}`);
    } else {
      setError("Cannot create homework: Classroom ID is missing");
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNavigateToHomework = (homeworkId: number) => {
    navigate(`/homework/${homeworkId}`);
  };

  const handleEditHomework = (homeworkId: number) => {
    if (classroom && classroom.id) {
      navigate(`/add-homework/${classroom.id}/${homeworkId}`);
    }
  };

  const handleDeleteHomework = (homeworkId: number) => {
    setSelectedHomeworkId(homeworkId);
    setDeleteHomeworkDialogOpen(true);
  };

  const confirmDeleteHomework = async () => {
    if (!selectedHomeworkId) return;

    try {
      // Call the API to delete the homework
      await api.delete(`/homework/${selectedHomeworkId}`);

      // Remove the deleted homework from the state
      setHomeworks(homeworks.filter((hw) => hw.id !== selectedHomeworkId));

      // Close the dialog
      setDeleteHomeworkDialogOpen(false);
      setSelectedHomeworkId(null);
    } catch (error) {
      console.error("Error deleting homework:", error);
      setError("Failed to delete assignment. Please try again.");
      setDeleteHomeworkDialogOpen(false);
    }
  };

  const handleBack = () => {
    navigate("/classrooms");
  };

  // Check if the user is authorized to view this classroom
  const checkUserAuthorization = () => {
    if (!user || !classroom) return false;

    // Admins and teachers have full access
    if (user.type === "admin" || user.type === "teacher") return true;

    // For students, check if they are enrolled in this classroom
    if (user.type === "student" || user.type === "user") {
      return classroom.students?.some((student) => student.id === user.id);
    }

    return false;
  };

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppNavigationBar />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            py: 6,
          }}
        >
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  // Added this check to see if the user is authorized
  if (!isLoading && user && classroom && !checkUserAuthorization()) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppNavigationBar />
        <Container sx={{ mt: 5, px: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 3 }}
          >
            Back to Classrooms
          </Button>
          <Alert severity="error" sx={{ px: 3, py: 2 }}>
            You do not have permission to view this classroom.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (error || !classroom) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppNavigationBar />
        <Container sx={{ mt: 5, px: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 3 }}
          >
            Back to Classrooms
          </Button>
          <Alert severity="error" sx={{ px: 3, py: 2 }}>
            {error || "Classroom not found"}
          </Alert>
        </Container>
      </Box>
    );
  }

  const isTeacherOrAdmin =
    user && (user.type === "teacher" || user.type === "admin");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppNavigationBar />

      <Container
        component="main"
        sx={{ mt: 5, mb: 5, flexGrow: 1, px: { xs: 3, sm: 4 } }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Classrooms
        </Button>

        {/* Classroom Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                {classroom.name}
              </Typography>

              {isTeacherOrAdmin && (
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/edit-classroom/${classroom.id}`)}
                  startIcon={<EditIcon />}
                  size="small"
                >
                  Edit Classroom
                </Button>
              )}
            </Box>

            {/* Description Section */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                color="primary"
                fontWeight="bold"
                gutterBottom
              >
                Description
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1">
                  {classroom.description || "No description available"}
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                label={`${classroom.students?.length || 0} Students`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`${homeworks.length} Assignments`}
                color="secondary"
                variant="outlined"
              />
              <Chip
                label={`Enrollment Key: ${classroom.enrollmentKey}`}
                color="default"
                variant="outlined"
                sx={{ display: isTeacherOrAdmin ? "flex" : "none" }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Tabs for different sections */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="classroom tabs"
            >
              <Tab
                label="Students"
                id="classroom-tab-0"
                aria-controls="classroom-tabpanel-0"
              />
              <Tab
                label="Assignments"
                id="classroom-tab-1"
                aria-controls="classroom-tabpanel-1"
              />
            </Tabs>
          </Box>

          {/* Students Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Students
              </Typography>
            </Box>

            {classroom.students?.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6, px: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No students enrolled in this classroom yet.
                </Typography>
                {isTeacherOrAdmin && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Share the enrollment key with your students to get started.
                  </Typography>
                )}
              </Box>
            ) : (
              <List sx={{ px: 2 }}>
                {classroom.students?.map((student) => (
                  <ListItem
                    key={student.id}
                    sx={{
                      bgcolor: "background.paper",
                      mb: 1.5,
                      borderRadius: 1,
                      p: 1.5,
                    }}
                  >
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
          </TabPanel>

          {/* Assignments Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Assignments
              </Typography>
              {isTeacherOrAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddHomework}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Add Assignment
                </Button>
              )}
            </Box>

            {homeworks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6, px: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No assignments created for this classroom yet.
                </Typography>
                {isTeacherOrAdmin && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Create assignments to give your students coding problems to
                    solve.
                  </Typography>
                )}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {homeworks.map((homework) => (
                  <Grid item xs={12} md={6} key={homework.id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {homework.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {homework.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <AssignmentIcon fontSize="small" color="primary" />
                          <Typography variant="body2">
                            {homework.problems?.length || 0} problems
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          <strong>Deadline:</strong>{" "}
                          {new Date(homework.deadline).toLocaleString()}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              handleNavigateToHomework(homework.id!)
                            }
                            sx={{ borderRadius: 1.5, textTransform: "none" }}
                          >
                            {isTeacherOrAdmin
                              ? "View Details"
                              : "Start Assignment"}
                          </Button>

                          {isTeacherOrAdmin && (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                color="secondary"
                                onClick={() => handleEditHomework(homework.id!)}
                                sx={{
                                  borderRadius: 1.5,
                                  textTransform: "none",
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleDeleteHomework(homework.id!)
                                }
                                sx={{
                                  borderRadius: 1.5,
                                  textTransform: "none",
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        </Paper>

        {/* Delete Homework Confirmation Dialog */}
        <Dialog
          open={deleteHomeworkDialogOpen}
          onClose={() => setDeleteHomeworkDialogOpen(false)}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Delete Assignment
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this assignment? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteHomeworkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDeleteHomework} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default ClassroomDetailsPage;
