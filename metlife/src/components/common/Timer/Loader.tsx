// import React from "react";

// const Loader = () => {
//   return (
//     <div className="loader flex gap-3 items-center justify-center">
//       <div className="dot dot1"></div>
//       <div className="dot dot2"></div>
//       <div className="dot dot3"></div>
//       <div className="dot dot4"></div>

//       <style>
//         {`
//         .dot {
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           animation: bounce 0.6s infinite ease-in-out;
//         }

//         .dot1 {
//           background: #0a1dbf;
//           animation-delay: 0s;
//         }
//         .dot2 {
//           background: #2e98a3;
//           animation-delay: 0.1s;
//         }
//         .dot3 {
//           background: #7ecedf;
//           animation-delay: 0.2s;
//         }
//         .dot4 {
//           background: #f8a538;
//           animation-delay: 0.3s;
//         }

//         @keyframes bounce {
//           0% {
//             transform: translateY(0);
//             opacity: 1;
//           }
//           50% {
//             transform: translateY(-10px);
//             opacity: 0.6;
//           }
//           100% {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }`}
//       </style>
//     </div>
//   );
// };

// export default Loader;

// import React from "react";
// import { Box, Typography } from "@mui/material";

// const Loader = ({ exactMinutes, exactSeconds }) => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         gap: "12px",
//         alignItems: "center",
//         justifyContent: "center",
//         marginTop: "10px",
//       }}
//     >
//       <Box sx={{ ...dotStyle, background: "#0a1dbf", animationDelay: "0s" }} />
//       <Box
//         sx={{ ...dotStyle, background: "#2e98a3", animationDelay: "0.1s" }}
//       />
//       <Box
//         sx={{ ...dotStyle, background: "#7ecedf", animationDelay: "0.2s" }}
//       />
//       <Box
//         sx={{ ...dotStyle, background: "#f8a538", animationDelay: "0.3s" }}
//       />
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "12px",
//           alignItems: "center",
//           justifyContent: "center",
//           marginTop: "10px",
//         }}
//       >
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           textAlign="center"
//           fontWeight={600}
//           fontSize="12px"
//           // sx={{ mt: 0.5 }} // slight spacing
//         >
//           {/* {minutes} : {seconds}
//            */}
//           {exactMinutes} : {exactSeconds}
//         </Typography>
//       </Box>

//       <style>
//         {`
//           @keyframes bounce {
//             0% {
//               transform: translateY(0);
//               opacity: 1;
//             }
//             50% {
//               transform: translateY(-10px);
//               opacity: 0.6;
//             }
//             100% {
//               transform: translateY(0);
//               opacity: 1;
//             }
//           }
//         `}
//       </style>
//     </Box>
//   );
// };

// const dotStyle = {
//   width: "12px",
//   height: "12px",
//   borderRadius: "50%",
//   animation: "bounce 0.6s infinite ease-in-out",
// };

// export default Loader;

import React from "react";
import { Box, Typography } from "@mui/material";

const Loader = ({ exactMinutes, exactSeconds }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // ⬅ STACK vertically (dots on top, time below)
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      {/* Dots Row */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{ ...dotStyle, background: "#0a1dbf", animationDelay: "0s" }}
        />
        <Box
          sx={{ ...dotStyle, background: "#2e98a3", animationDelay: "0.1s" }}
        />
        <Box
          sx={{ ...dotStyle, background: "#7ecedf", animationDelay: "0.2s" }}
        />
        <Box
          sx={{ ...dotStyle, background: "#f8a538", animationDelay: "0.3s" }}
        />
      </Box>

      {/* Time BELOW dots */}
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        fontWeight={600}
        fontSize="25px"
        sx={{ marginTop: "8px" }}
      >
       <span>Total Time</span> - {exactMinutes} : {String(exactSeconds).padStart(2, "0")}
      </Typography>

      <style>
        {`
          @keyframes bounce {
            0% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(-10px); opacity: 0.6; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

const dotStyle = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  animation: "bounce 0.6s infinite ease-in-out",
};

export default Loader;
