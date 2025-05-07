import { Box, Container, Typography } from "@mui/material";
import NavigationBar from "../components/NavigationBar";

function MainPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* App Bar */}
      <NavigationBar />

      {/* Main content */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", mt: 8 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Welcome to Coding Problems Platform
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
            Practice, learn and improve your coding skills
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default MainPage;
