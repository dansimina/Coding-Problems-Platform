import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Tabs,
  Tab,
  Collapse,
  IconButton,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CodeIcon from "@mui/icons-material/Code";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import BugReportIcon from "@mui/icons-material/BugReport";
import HistoryIcon from "@mui/icons-material/History";
import GroupIcon from "@mui/icons-material/Group";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ProblemDTO } from "../types/ProblemDTO";
import SubmissionComponent from "../components/SubmissionComponent";
import SubmissionHistoryComponent from "../components/SubmissionHistoryComponent";
import AllSubmissionsComponent from "../components/AllSubmissionsProps";

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
      id={`problem-tabpanel-${index}`}
      aria-labelledby={`problem-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function ProblemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<ProblemDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [isGettingHint, setIsGettingHint] = useState<boolean>(false);
  const [isHintExpanded, setIsHintExpanded] = useState<boolean>(true);

  // Check if user is teacher or admin
  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "null" ? JSON.parse(storedUser) : null;
  const isTeacherOrAdmin =
    user && (user.type === "teacher" || user.type === "admin");

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;

      setIsLoading(true);
      setError("");
      try {
        const response = await api.get(`/problems/${id}`);
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem details:", error);
        setError("Failed to load problem details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  const handleBack = () => {
    navigate("/problems");
  };

  const handleAskForHint = async () => {
    if (!problem) return;

    setIsGettingHint(true);

    try {
      // TODO: Implement GeminiAI integration
      // This function will be implemented in the future
      // For now, just set a placeholder

      // Example of what the implementation might look like:
      // const response = await api.post('/gemini/hint', {
      //   problemId: problem.id,
      //   problemTitle: problem.title,
      //   problemDescription: problem.description,
      //   difficulty: problem.difficulty
      // });
      // setHint(response.data.hint);

      // Placeholder for now
      setTimeout(() => {
        setHint(
          "This is where the AI-generated hint will appear. The hint will provide guidance without giving away the solution completely."
        );
        setIsGettingHint(false);
      }, 1500);
    } catch (error) {
      console.error("Error getting hint:", error);
      setIsGettingHint(false);
    }
  };

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

  if (error || !problem) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavigationBar />
        <Container sx={{ mt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Problems
          </Button>
          <Alert severity="error">{error || "Problem not found"}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavigationBar />

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Problems
        </Button>

        {/* Problem Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                {problem.title}
              </Typography>
              <Box
                sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}
              >
                <Chip
                  label={problem.difficulty}
                  color={getDifficultyColor(problem.difficulty)}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  Author: {problem.author}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {problem.topics.map((topic) => (
                  <Chip
                    key={topic.title}
                    label={topic.title}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            <Stack spacing={1} alignItems="flex-end">
              <Button
                variant="outlined"
                startIcon={<AutoFixHighIcon />}
                size="small"
                onClick={handleAskForHint}
                disabled={isGettingHint}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: "#2196F3",
                  color: "#2196F3",
                  "&:hover": {
                    borderColor: "#1976D2",
                    backgroundColor: "rgba(33, 150, 243, 0.04)",
                  },
                }}
              >
                {isGettingHint ? "Getting Hint..." : "Ask GeminiAI for a Hint"}
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* GeminiAI Hint Section */}
        {hint && (
          <Card
            elevation={2}
            sx={{
              mb: 3,
              borderRadius: 2,
              background: "linear-gradient(to right, #f3f4f6, #e8f5ff)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: isHintExpanded ? 2 : 0,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AutoFixHighIcon sx={{ color: "#2196F3" }} />
                  <Typography variant="h6" fontWeight="bold">
                    GeminiAI Hint
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setIsHintExpanded(!isHintExpanded)}
                  size="small"
                >
                  {isHintExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={isHintExpanded} timeout="auto">
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography variant="body1">{hint}</Typography>
                </Paper>
              </Collapse>
            </CardContent>
          </Card>
        )}

        {/* Problem Content Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="problem tabs"
              variant="fullWidth"
            >
              <Tab
                label="Description"
                id="problem-tab-0"
                aria-controls="problem-tabpanel-0"
              />
              <Tab
                label="Examples"
                id="problem-tab-1"
                aria-controls="problem-tabpanel-1"
                icon={<BugReportIcon fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label="Submit Solution"
                id="problem-tab-2"
                aria-controls="problem-tabpanel-2"
                icon={<CodeIcon fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label="My Submissions"
                id="problem-tab-3"
                aria-controls="problem-tabpanel-3"
                icon={<HistoryIcon fontSize="small" />}
                iconPosition="start"
              />
              {isTeacherOrAdmin && (
                <Tab
                  label="All Submissions"
                  id="problem-tab-4"
                  aria-controls="problem-tabpanel-4"
                  icon={<GroupIcon fontSize="small" />}
                  iconPosition="start"
                />
              )}
              {problem.officialSolution && (
                <Tab
                  label="Solution"
                  id={`problem-tab-${isTeacherOrAdmin ? 5 : 4}`}
                  aria-controls={`problem-tabpanel-${isTeacherOrAdmin ? 5 : 4}`}
                  icon={<LightbulbIcon fontSize="small" />}
                  iconPosition="start"
                />
              )}
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Box sx={{ p: 3 }}>
            {/* Description Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {problem.description}
              </Typography>

              {problem.constraints && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Constraints
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ whiteSpace: "pre-line" }}
                  >
                    {problem.constraints}
                  </Typography>
                </>
              )}

              {problem.image && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <img
                    src={problem.image}
                    alt="Problem illustration"
                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                  />
                </Box>
              )}
            </TabPanel>

            {/* Examples Tab */}
            <TabPanel value={tabValue} index={1}>
              <Stack spacing={3}>
                {problem.tests
                  .filter((test) => test.example)
                  .map((test, index) => (
                    <Card key={index} variant="outlined">
                      <CardHeader title={`Example ${index + 1}`} />
                      <Divider />
                      <CardContent>
                        <Stack spacing={3}>
                          <Box>
                            <Typography variant="subtitle2">Input:</Typography>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 2,
                                mt: 1,
                                bgcolor: "grey.50",
                                fontFamily: "monospace",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {test.input}
                            </Paper>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2">Output:</Typography>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 2,
                                mt: 1,
                                bgcolor: "grey.50",
                                fontFamily: "monospace",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {test.output}
                            </Paper>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}

                {problem.tests.filter((test) => test.example).length === 0 && (
                  <Alert severity="info">
                    No example test cases provided for this problem.
                  </Alert>
                )}
              </Stack>
            </TabPanel>

            {/* Submit Solution Tab */}
            <TabPanel value={tabValue} index={2}>
              <SubmissionComponent problemId={Number(id)} />
            </TabPanel>

            {/* My Submissions Tab */}
            <TabPanel value={tabValue} index={3}>
              <SubmissionHistoryComponent problemId={Number(id)} />
            </TabPanel>

            {/* All Submissions Tab (Teachers/Admins only) */}
            {isTeacherOrAdmin && (
              <TabPanel value={tabValue} index={4}>
                <AllSubmissionsComponent problemId={Number(id)} />
              </TabPanel>
            )}

            {/* Solution Tab */}
            {problem.officialSolution && (
              <TabPanel value={tabValue} index={isTeacherOrAdmin ? 5 : 4}>
                <Typography variant="h6" gutterBottom>
                  Official Solution
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    overflow: "auto",
                  }}
                >
                  {problem.officialSolution}
                </Paper>
              </TabPanel>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProblemDetailsPage;
