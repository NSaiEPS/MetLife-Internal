import { Box, Typography, Backdrop } from "@mui/material";

const FullScreenGradientLoader = ({ open = true, text = "Generating AI Video..." }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        background: "rgba(5, 10, 25, 0.35)",
        // backdropFilter: "blur(6px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {/* Gradient Spinner */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "conic-gradient(#f59e0b, #2563eb, #f59e0b)",
            padding: "6px",
            animation: "spin 1.2s linear infinite",
            boxShadow: "0 0 25px rgba(245,158,11,0.6)",
            "@keyframes spin": {
              from: { transform: "rotate(0deg)" },
              to: { transform: "rotate(360deg)" },
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#050A19",
            }}
          />
        </Box>

        {/* Text */}
        <Typography
          variant="h6"
          sx={{
            color: "#E5E7EB",
            fontWeight: 500,
            letterSpacing: "0.6px",
            textAlign: "center",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default FullScreenGradientLoader;



// import { Box, Typography, Backdrop } from "@mui/material";

// const FullScreenGradientLoader = ({ open = true, text = "Generating..." }) => {
//   return (
//     <Backdrop
//       sx={{
//         color: "#fff",
//         zIndex: (theme) => theme.zIndex.drawer + 9999,
//         backgroundColor: "rgba(0, 0, 0, 0.35)",
//       }}
//       open={open}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: 2,
//         }}
//       >
//         <Box
//           sx={{
//             width: 70,
//             height: 70,
//             borderRadius: "50%",
//             border: "6px solid",
//             borderColor: "transparent transparent #1976d2 #42a5f5",
//             animation: "spin 1s linear infinite",
//             "@keyframes spin": {
//               "0%": { transform: "rotate(0deg)" },
//               "100%": { transform: "rotate(360deg)" },
//             },
//           }}
//         />
//         <Typography
//           variant="h6"
//           sx={{ color: "#fff", fontWeight: 500, letterSpacing: 0.5 }}
//         >
//           {text}
//         </Typography>
//       </Box>
//     </Backdrop>
//   );
// };

// export default FullScreenGradientLoader;
