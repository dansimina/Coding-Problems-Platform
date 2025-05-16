import React, { useState } from "react";
import api from "../api";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Stack,
  Card,
  CardContent,
  IconButton,
  Collapse,
  SelectChangeEvent,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { NewSubmissionDTO } from "../types/NewSubmissionDTO";
import { SubmissionDTO } from "../types/SubmissionDTO";

interface SubmissionComponentProps {
  problemId: number;
}

function SubmissionComponent({ problemId }: SubmissionComponentProps) {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("python");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [submission, setSubmission] = useState<SubmissionDTO | null>(null);
  const [isReportExpanded, setIsReportExpanded] = useState<boolean>(true);

  // Get user from localStorage
  const getUserId = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "null") {
      const user = JSON.parse(storedUser);
      return user.id;
    }
    return null;
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleSubmit = async () => {
    const userId = getUserId();

    if (!userId) {
      setError("Please log in to submit solutions.");
      return;
    }

    if (!code.trim()) {
      setError("Please write some code before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSubmission(null);

    try {
      const submissionData: NewSubmissionDTO = {
        code,
        language,
        userId,
        problemId,
      };

      const response = await api.post<SubmissionDTO>(
        "/submission/submit",
        submissionData
      );
      setSubmission(response.data);
    } catch (error) {
      console.error("Submission error:", error);
      setError("Failed to submit your solution. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  const parseTestResults = (report: string) => {
    const lines = report.split("\n").filter((line) => line.trim());
    return lines.map((line, index) => {
      const isPassed = line.toLowerCase().includes("pass");
      const isFailed = line.toLowerCase().includes("fail");
      const isTimeLimit = line.toLowerCase().includes("time limit");

      let color: "success" | "error" | "warning" | "default" = "default";
      let icon = null;

      if (isPassed) {
        color = "success";
        icon = <CheckCircleIcon fontSize="small" />;
      } else if (isFailed || isTimeLimit) {
        color = "error";
        icon = <CancelIcon fontSize="small" />;
      }

      return { text: line, color, icon, key: index };
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Submit Your Solution
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            label="Language"
            onChange={handleLanguageChange}
          >
            <MenuItem value="python">Python</MenuItem>
            {/* Add more languages as they become available */}
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={12}
        placeholder="Write your code here..."
        value={code}
        onChange={handleCodeChange}
        sx={{
          mb: 2,
          fontFamily: "monospace",
          "& .MuiInputBase-input": {
            fontFamily: "monospace",
            fontSize: "14px",
          },
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        size="medium"
        startIcon={
          isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <PlayArrowIcon />
          )
        }
        onClick={handleSubmit}
        disabled={isSubmitting}
        sx={{
          mb: 3,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        {isSubmitting ? "Evaluating..." : "Submit Solution"}
      </Button>

      {/* Results Section */}
      {submission && (
        <Box>
          <Divider sx={{ mb: 3 }} />

          {/* Score Display */}
          <Card sx={{ mb: 3, bgcolor: "grey.50" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  Your Score
                </Typography>
                <Chip
                  label={`${submission.score}%`}
                  color={getScoreColor(submission.score)}
                  size="medium"
                  sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Test Results
                </Typography>
                <IconButton
                  onClick={() => setIsReportExpanded(!isReportExpanded)}
                >
                  {isReportExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={isReportExpanded} timeout="auto">
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {parseTestResults(submission.report).map((result) => (
                    <Box
                      key={result.key}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor:
                          result.color === "success"
                            ? "success.50"
                            : result.color === "error"
                            ? "error.50"
                            : "background.paper",
                      }}
                    >
                      {result.icon}
                      <Typography
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
                    </Box>
                  ))}
                </Stack>
              </Collapse>
            </CardContent>
          </Card>
        </Box>
      )}
    </Paper>
  );
}

export default SubmissionComponent;
