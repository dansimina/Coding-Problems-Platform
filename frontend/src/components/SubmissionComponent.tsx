import React, { useState, useEffect } from "react";
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
  Tooltip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CodeIcon from "@mui/icons-material/Code";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { NewSubmissionDTO } from "../types/NewSubmissionDTO";
import { SubmissionDTO } from "../types/SubmissionDTO";

interface SubmissionComponentProps {
  problemId: number;
}

// Define available languages with their properties
interface LanguageOption {
  value: string;
  label: string;
  extension: string;
  boilerplate?: string;
}

function SubmissionComponent({ problemId }: SubmissionComponentProps) {
  // Define available languages
  const languageOptions: LanguageOption[] = [
    {
      value: "python",
      label: "Python",
      extension: ".py",
      boilerplate:
        '# Write your Python code here\n\ndef main():\n    # Your solution\n    pass\n\nif __name__ == "__main__":\n    main()',
    },
    {
      value: "cpp",
      label: "C++",
      extension: ".cpp",
      boilerplate:
        "#include <iostream>\n#include <string>\n\nint main() {\n    // Your solution\n    \n    return 0;\n}",
    },
  ];

  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("python");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [submission, setSubmission] = useState<SubmissionDTO | null>(null);
  const [isReportExpanded, setIsReportExpanded] = useState<boolean>(true);
  const [isReportTruncated, setIsReportTruncated] = useState<boolean>(false);

  // Max character limit for visible report
  const MAX_VISIBLE_REPORT_LENGTH = 5000;
  // Default visible lines in test results
  const DEFAULT_VISIBLE_LINES = 10;
  const [visibleLines, setVisibleLines] = useState<number>(
    DEFAULT_VISIBLE_LINES
  );

  // Set default code based on selected language when component mounts or language changes
  useEffect(() => {
    const selectedLanguage = languageOptions.find(
      (lang) => lang.value === language
    );
    if (selectedLanguage && selectedLanguage.boilerplate && !code.trim()) {
      setCode(selectedLanguage.boilerplate);
    }
  }, [language]);

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
    const newLanguage = event.target.value;

    // If changing from one language to another with existing code, confirm
    if (
      code.trim() &&
      code !==
        languageOptions.find((lang) => lang.value === language)?.boilerplate
    ) {
      if (
        window.confirm("Changing the language will reset your code. Continue?")
      ) {
        setLanguage(newLanguage);
        // Set boilerplate code for the new language
        const selectedLanguage = languageOptions.find(
          (lang) => lang.value === newLanguage
        );
        if (selectedLanguage && selectedLanguage.boilerplate) {
          setCode(selectedLanguage.boilerplate);
        } else {
          setCode("");
        }
      }
    } else {
      setLanguage(newLanguage);
      // Set boilerplate code for the new language
      const selectedLanguage = languageOptions.find(
        (lang) => lang.value === newLanguage
      );
      if (selectedLanguage && selectedLanguage.boilerplate) {
        setCode(selectedLanguage.boilerplate);
      }
    }
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
    setIsReportTruncated(false);

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

      // Check if report is very long (potentially causing DB issues)
      if (
        response.data.report &&
        response.data.report.length > MAX_VISIBLE_REPORT_LENGTH
      ) {
        setIsReportTruncated(true);
      }
    } catch (error: any) {
      console.error("Submission error:", error);

      // Handle specific database errors
      if (
        error.response?.status === 500 &&
        error.response?.data?.message?.includes("Data too long")
      ) {
        setError(
          "Your code generated a very large output that exceeded our system limits. Please simplify your solution or reduce debug output."
        );
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to submit your solution. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setVisibleLines(DEFAULT_VISIBLE_LINES);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  const parseTestResults = (report: string) => {
    const lines = report.split("\n").filter((line) => line.trim());

    // Truncate if report is very long
    const processedLines = isReportTruncated
      ? lines.slice(0, visibleLines)
      : lines;

    return processedLines.map((line, index) => {
      const isPassed = line.toLowerCase().includes("pass");
      const isFailed = line.toLowerCase().includes("fail");
      const isTimeLimit = line.toLowerCase().includes("time limit");
      const isCompilationError = line
        .toLowerCase()
        .includes("compilation error");

      let color: "success" | "error" | "warning" | "default" = "default";
      let icon = null;

      if (isPassed) {
        color = "success";
        icon = <CheckCircleIcon fontSize="small" />;
      } else if (isFailed || isTimeLimit || isCompilationError) {
        color = "error";
        icon = <CancelIcon fontSize="small" />;
      }

      return { text: line, color, icon, key: index };
    });
  };

  const handleShowMoreLines = () => {
    setVisibleLines((prev) => prev + 10);
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
            startAdornment={
              <CodeIcon sx={{ mr: 1, color: "text.secondary" }} />
            }
          >
            {languageOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
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
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Test Results
                  </Typography>
                  {isReportTruncated && (
                    <Tooltip title="The test output is very large and has been truncated for display">
                      <ErrorOutlineIcon
                        color="warning"
                        sx={{ ml: 1 }}
                        fontSize="small"
                      />
                    </Tooltip>
                  )}
                </Box>
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

                  {isReportTruncated &&
                    visibleLines <
                      submission.report
                        .split("\n")
                        .filter((line) => line.trim()).length && (
                      <Button
                        variant="text"
                        onClick={handleShowMoreLines}
                        sx={{ alignSelf: "center", mt: 1 }}
                      >
                        Show More Lines
                      </Button>
                    )}
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
