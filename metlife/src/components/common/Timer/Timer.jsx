// import { Backdrop } from "@mui/material";
// import { useEffect, useState, useRef } from "react";

// const Timer = ({ minutes, onComplete }) => {
//   const totalSeconds = minutes * 60;
//   const [timeLeft, setTimeLeft] = useState(totalSeconds);

//   const hasCompleted = useRef(false);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       if (!hasCompleted.current) {
//         hasCompleted.current = true;
//         onComplete?.();
//       }
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeft, onComplete]);

//   const percent = (timeLeft / totalSeconds) * 100;

//   const formatTime = () => {
//     const m = Math.floor(timeLeft / 60);
//     const s = timeLeft % 60;
//     return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   return (
//     <>
//       <Backdrop
//         open={open}
//         sx={{
//           color: "#fff",
//           zIndex: (theme) => theme.zIndex.drawer + 9999,
//           backdropFilter: "blur(4px)",
//           backgroundColor: "rgba(0,0,0,0.3)",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               width: 150,
//               height: 150,
//               borderRadius: "50%",
//               border: "8px solid #ccc",
//               position: "relative",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               background: `conic-gradient(
//           #4ab4ff ${percent}%,
//           #e6e6e6 ${percent}%
//         )`,
//               transition: "background 0.2s linear",
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 background: "white",
//                 width: 120,
//                 height: 120,
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 22,
//                 fontWeight: 700,
//               }}
//             >
//               {formatTime()}
//             </div>
//           </div>
//         </Box>
//       </Backdrop>
//     </>
//   );
// };

// export default Timer;

import { useEffect, useState, useRef } from "react";
import { Backdrop, Box } from "@mui/material";

const Timer = ({ minutes, onComplete }) => {
  const totalSeconds = minutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [open, setOpen] = useState(true); // backdrop starts open

  const hasCompleted = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!hasCompleted.current) {
        hasCompleted.current = true;

        setOpen(false); // ⬅ CLOSE BACKDROP WHEN DONE
        onComplete?.(); // trigger user callback
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onComplete]);

  const percent = (timeLeft / totalSeconds) * 100;

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Backdrop
      open={open}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0,0,0,0.3)",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "8px solid #ccc",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `conic-gradient(
              #4ab4ff ${percent}%,
              #e6e6e6 ${percent}%
            )`,
            transition: "background 0.2s linear",
          }}
        >
          <div
            style={{
              position: "absolute",
              background: "white",
              width: 120,
              height: 120,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "#000",
            }}
          >
            {formatTime()}
          </div>
        </div>
      </Box>
    </Backdrop>
  );
};

export default Timer;
