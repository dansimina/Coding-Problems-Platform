import { useState, useEffect } from "react";
import api from "../api";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  SelectChangeEvent,
  Alert,
  Stack,
  IconButton,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CodeIcon from "@mui/icons-material/Code";
import ClearIcon from "@mui/icons-material/Clear";
import { ProblemDTO } from "../types/ProblemDTO";
import { TopicDTO } from "../types/TopicDTO";
import { useNavigate } from "react-router-dom";

function ProblemsPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<ProblemDTO[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<ProblemDTO[]>([]);
  const [topics, setTopics] = useState<TopicDTO[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch problems and topics on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [problemsResponse, topicsResponse] = await Promise.all([
          api.get("/problems"),
          api.get("/topics"),
        ]);
        setProblems(problemsResponse.data);
        setFilteredProblems(problemsResponse.data);
        setTopics(topicsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load problems. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter problems when search query or selected topic changes
  useEffect(() => {
    const applyFilters = () => {
      let result = [...problems];

      // Filter by search query (problem title)
      if (searchQuery) {
        result = result.filter((problem) =>
          problem.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by selected topic
      if (selectedTopic) {
        result = result.filter((problem) =>
          problem.topics.some((topic) => topic.title === selectedTopic)
        );
      }

      setFilteredProblems(result);
    };

    applyFilters();
  }, [searchQuery, selectedTopic, problems]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTopicChange = (e: SelectChangeEvent) => {
    setSelectedTopic(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTopic("");
  };

  const handleProblemClick = (problem: ProblemDTO) => {
    if (problem.id) {
      navigate(`/problems/${String(problem.id)}`);
    }
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavigationBar />

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Coding Problems
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Browse, search, and solve coding challenges to improve your skills
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
          }}
        >
          <Stack
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            alignItems="flex-start"
          >
            {/* Search field */}
            <Box
              sx={{ position: "relative", width: { xs: "100%", md: "40%" } }}
            >
              <TextField
                fullWidth
                placeholder="Search problems by title..."
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery("")}
                        edge="end"
                        aria-label="clear search"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Topic filter */}
            <Box sx={{ width: { xs: "100%", md: "40%" } }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="topic-filter-label">Filter by Topic</InputLabel>
                <Select
                  labelId="topic-filter-label"
                  value={selectedTopic}
                  onChange={handleTopicChange}
                  label="Filter by Topic"
                  sx={{
                    borderRadius: 2,
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>All Topics</em>
                  </MenuItem>
                  {topics.map((topic) => (
                    <MenuItem key={topic.title} value={topic.title}>
                      {topic.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Clear filters button */}
            <Button
              variant="outlined"
              onClick={clearFilters}
              disabled={!searchQuery && !selectedTopic}
              sx={{
                borderRadius: 2,
                height: 56,
                width: { xs: "100%", md: "auto" },
                alignSelf: { xs: "flex-start", md: "center" },
                ml: { md: "auto" },
              }}
            >
              Clear Filters
            </Button>
          </Stack>

          {/* Active filters display */}
          {(searchQuery || selectedTopic) && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  onDelete={() => setSearchQuery("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedTopic && (
                <Chip
                  label={`Topic: ${selectedTopic}`}
                  onDelete={() => setSelectedTopic("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Paper>

        {/* Loading, Error, or Results */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : filteredProblems.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">No problems found</Typography>
            <Typography variant="body2" color="text.secondary">
              Try changing your search criteria or clearing filters
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {filteredProblems.map((problem) => (
              <Box
                key={problem.id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    lg: "calc(33.33% - 16px)",
                  },
                  display: "flex",
                }}
              >
                <Card
                  elevation={2}
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    borderRadius: 2,
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        fontWeight="bold"
                        noWrap
                        sx={{ mb: 1 }}
                      >
                        {problem.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={problem.difficulty}
                        color={getDifficultyColor(problem.difficulty)}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {problem.description.substring(0, 150)}
                      {problem.description.length > 150 ? "..." : ""}
                    </Typography>

                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        component="div"
                      >
                        Topics:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
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
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      By: {problem.author}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<CodeIcon />}
                      onClick={() => handleProblemClick(problem)}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                      }}
                    >
                      Solve
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ProblemsPage;
