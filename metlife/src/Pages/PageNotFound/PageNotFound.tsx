// NotFound.jsx
import { Link } from "react-router-dom";
import pageNotFound from "../../assets/pageNotFound.png";
import { Box, Typography } from "@mui/material";

const PageNotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#fefefe",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <img src={pageNotFound} alt="Page Not Found" width={"500px"} />
        <Typography variant="h5">Page Not Found</Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: "50%", textAlign: "center" }}
        >
          Sorry, the page you are looking for cannot be found. Please check the
          URL or try navigating back to the homepage.
        </Typography>
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#4648b1ff",
            fontWeight: 600,
            fontSize: "16px",
            fontFamily: "Noto_Sans",
          }}
        >
          Go Back Dashboard
        </Link>
      </Box>
    </Box>
  );
};

export default PageNotFound;
