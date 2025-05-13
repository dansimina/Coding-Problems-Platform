import { useState, useEffect } from "react";
import api from "../api";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { SubmissionDTO } from "../types/SubmissionDTO";

interface SubmissionHistoryProps {
  problemId: number;
}

function SubmissionHistoryComponent({ problemId }: SubmissionHistoryProps) {
  const [submissions, setSubmissions] = useState<SubmissionDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [complexity, setComplexity] = useState<string | null>(null);
  const [isAnalyzingComplexity, setIsAnalyzingComplexity] =
    useState<boolean>(false);

  useEffect(() => {
    fetchSubmissions();
  }, [problemId]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError("");

    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      setError("Please log in to view submissions");
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      const response = await api.get(
        `/user/submissions/${user.id}/${problemId}`
      );
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to load submissions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const handleViewSubmission = (submission: SubmissionDTO) => {
    setSelectedSubmission(submission);
    setComplexity(null); // Reset complexity when opening a new submission
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedSubmission(null);
    setComplexity(null);
    setIsDialogOpen(false);
  };

  const parseTestResults = (report: string) => {
    const lines = report.split("\n").filter((line) => line.trim());
    return lines.map((line, index) => {
      const isPassed = line.toLowerCase().includes("pass");
      const isFailed = line.toLowerCase().includes("fail");

      let color: "success" | "error" | "default" = "default";

      if (isPassed) {
        color = "success";
      } else if (isFailed) {
        color = "error";
      }

      return { text: line, color, key: index };
    });
  };

  const handleAnalyzeComplexity = async () => {
    if (!selectedSubmission) return;

    setIsAnalyzingComplexity(true);

    try {
      // TODO: Implement Gemini AI integration
      // This function will be implemented in the future
      // For now, just set a placeholder

      // Example of what the implementation might look like:
      // const response = await api.post('/analyze-complexity', {
      //   code: selectedSubmission.code,
      //   language: selectedSubmission.language
      // });
      // setComplexity(response.data.complexityAnalysis);

      // Placeholder for now

      if (selectedSubmission.id) {
        console.log(
          "Analyzing complexity for submission ID:",
          selectedSubmission.id
        );
        const response = await api.post(
          `/analyze-complexity/${selectedSubmission.id}`
        );
        setComplexity(response.data.complexityAnalysis);
      }

      setTimeout(() => {
        setIsAnalyzingComplexity(false);
      }, 1000);
    } catch (error) {
      console.error("Error analyzing complexity:", error);
      setIsAnalyzingComplexity(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Your Submissions
        </Typography>

        {submissions.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You haven't submitted any solutions for this problem yet.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Submission #</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission, index) => (
                  <TableRow key={index}>
                    <TableCell>{submissions.length - index}</TableCell>
                    <TableCell>{submission.language}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${submission.score}%`}
                        size="small"
                        color={getScoreColor(submission.score)}
                      />
                    </TableCell>
                    <TableCell>
                      {submission.score === 100 ? (
                        <Chip label="Accepted" color="success" size="small" />
                      ) : (
                        <Chip label="Failed" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewSubmission(submission)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Submission Details Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Submission Details</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Score */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Score
                </Typography>
                <Chip
                  label={`${selectedSubmission.score}%`}
                  color={getScoreColor(selectedSubmission.score)}
                  size="medium"
                />
              </Box>

              {/* Code */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Code
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    overflow: "auto",
                    maxHeight: "400px",
                  }}
                >
                  {selectedSubmission.code}
                </Paper>
              </Box>

              {/* Complexity Analysis Section */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Complexity Analysis
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AutoFixHighIcon />}
                    onClick={handleAnalyzeComplexity}
                    disabled={isAnalyzingComplexity}
                    sx={{
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      textTransform: "none",
                    }}
                  >
                    {isAnalyzingComplexity
                      ? "Analyzing..."
                      : "Analyze with Gemini AI"}
                  </Button>
                </Box>

                {complexity && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: "grey.50",
                      minHeight: "100px",
                    }}
                  >
                    <Typography variant="body2">{complexity}</Typography>
                  </Paper>
                )}
              </Box>

              <Divider />

              {/* Test Results */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Test Results
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {parseTestResults(selectedSubmission.report).map((result) => (
                    <Typography
                      key={result.key}
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        color:
                          result.color === "default"
                            ? "text.primary"
                            : `${result.color}.main`,
                      }}
                    >
                      {result.text}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SubmissionHistoryComponent;
