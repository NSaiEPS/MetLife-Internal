import { Box, Typography, CircularProgress } from "@mui/material";

export const NoDataMessage = ({ filter = true, loading = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        color: "#777",
        gap: 1.5,
      }}
    >
      {loading ? (
        <>
          <CircularProgress
            size={48}
            thickness={4}
            sx={{ color: "primary.main", mb: 1 }}
          />
          <Typography variant="h6" fontWeight={600}>
            Loading...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we fetch your data.
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h6" fontWeight={600}>
            No Data Available
          </Typography>
          {filter && (
            <Typography variant="body2" color="text.secondary">
              Try again later or check your filters.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};
