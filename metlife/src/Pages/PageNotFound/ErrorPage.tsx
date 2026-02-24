import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Box, Typography, Button, Stack, Container, Fade } from "@mui/material";
import { ErrorOutline, Home, Refresh } from "@mui/icons-material";

export default function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  let errorMessage = "Unexpected error occurred";
  let errorStatus = "Error";

  if (isRouteErrorResponse(error)) {
    errorStatus = String(error.status);
    errorMessage = error.statusText || error.data?.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fbff 0%, #e0e7ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "rgba(99, 102, 241, 0.1)",
          borderRadius: "50%",
          top: "-100px",
          right: "-100px",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "200px",
          height: "200px",
          background: "rgba(59, 130, 246, 0.1)",
          borderRadius: "50%",
          bottom: "-50px",
          left: "-50px",
        },
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm">
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              p: { xs: 4, md: 6 },
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            {/* Icon Container */}
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#fff1f0",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 10px 15px -3px rgba(252, 30, 26, 0.1)",
              }}
            >
              <ErrorOutline sx={{ fontSize: 48, color: "#fc1e1aff" }} />
            </Box>

            {/* Error Code */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "56px", md: "72px" },
                fontWeight: 800,
                color: "#1e293b",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {errorStatus}
            </Typography>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                color: "#1e293b",
                fontWeight: 700,
                mb: 2,
                fontFamily: "Metlife_Circular, sans-serif",
              }}
            >
              Oops! Something went wrong
            </Typography>

            {/* Message */}
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                mb: 4,
                lineHeight: 1.6,
                maxWidth: "400px",
                margin: "0 auto 32px",
                wordBreak: "break-word",
              }}
            >
              {errorMessage}
            </Typography>

            {/* Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                startIcon={<Home />}
                sx={{
                  background: "#6366f1",
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                  "&:hover": {
                    background: "#4f46e5",
                    boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4)",
                  },
                }}
                component={Link}
                to="/dashboard"
              >
                Go to Dashboard
              </Button>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  "&:hover": {
                    borderColor: "#6366f1",
                    color: "#6366f1",
                    bgcolor: "rgba(99, 102, 241, 0.04)",
                  },
                }}
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </Stack>
          </Box>
        </Container>
      </Fade>
    </Box>
  );
}
