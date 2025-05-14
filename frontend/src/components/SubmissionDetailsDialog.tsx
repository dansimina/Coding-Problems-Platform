import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Chip,
  Paper,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import PersonIcon from "@mui/icons-material/Person";
import { SubmissionDTO } from "../types/SubmissionDTO";
import api from "../api";

interface SubmissionDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  submission: SubmissionDTO | null;
  showUserInfo?: boolean;
  onViewUserProfile?: (userId: number) => void;
}

function SubmissionDetailsDialog({
  open,
  onClose,
  submission,
  showUserInfo = false,
  onViewUserProfile,
}: SubmissionDetailsDialogProps) {
  const [complexity, setComplexity] = useState<string | null>(null);
  const [isAnalyzingComplexity, setIsAnalyzingComplexity] =
    useState<boolean>(false);

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
    if (!submission) return;

    setIsAnalyzingComplexity(true);

    try {
      if (submission.id) {
        console.log("Analyzing complexity for submission ID:", submission.id);
        const response = await api.post(`/analyze-complexity/${submission.id}`);
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {submission && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* User Info - Only shown when showUserInfo is true */}
            {showUserInfo && submission.user && (
              <>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Submitted By
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 48, height: 48 }}>
                      {submission.user.profilePicture ? (
                        <img
                          src={submission.user.profilePicture}
                          alt=""
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        submission.user.firstName.charAt(0).toUpperCase()
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {submission.user.firstName} {submission.user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{submission.user.username} • {submission.user.type}
                      </Typography>
                    </Box>
                    {onViewUserProfile && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PersonIcon />}
                        onClick={() => onViewUserProfile(submission.user.id!)}
                        sx={{ ml: "auto" }}
                      >
                        View Profile
                      </Button>
                    )}
                  </Box>
                </Box>
                <Divider />
              </>
            )}

            {/* Score */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Score
              </Typography>
              <Chip
                label={`${submission.score}%`}
                color={getScoreColor(submission.score)}
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
                {submission.code}
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
                    whiteSpace: "pre-wrap",
                    overflow: "auto",
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
                {parseTestResults(submission.report).map((result) => (
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
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SubmissionDetailsDialog;
