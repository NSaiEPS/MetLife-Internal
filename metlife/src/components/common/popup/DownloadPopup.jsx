// import React from "react";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// const DownloadPopup = ({ open, onClose, onSelect }) => {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       {" "}
//       <DialogTitle>Select File Type</DialogTitle>{" "}
//       <DialogContent>
//         {" "}
//         Choose your preferred format for download.{" "}
//       </DialogContent>{" "}
//       <DialogActions>
//         {" "}
//         <Button
//           onClick={() => onSelect("pdf")}
//           variant="contained"
//           color="primary"
//         >
//           {" "}
//           PDF{" "}
//         </Button>{" "}
//         <Button
//           onClick={() => onSelect("word")}
//           variant="outlined"
//           color="secondary"
//         >
//           {" "}
//           Word{" "}
//         </Button>{" "}
//       </DialogActions>{" "}
//     </Dialog>
//   );
// };
// export default DownloadPopup;

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Box,
} from "@mui/material";


const pdfIcon =
  "https://cdn-icons-png.flaticon.com/512/337/337946.png"; 
const wordIcon =
  "https://cdn-icons-png.flaticon.com/512/732/732220.png"; 

const DownloadPopup = ({ open, onClose, onSelect }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          textAlign: "center",
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#1976d2",
          fontSize: "1.3rem",
        }}
      >
        Select File Type
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Choose your preferred format for download:
        </Typography>

        <Stack direction="row" spacing={3} justifyContent="center">
          <Box
            onClick={() => onSelect("pdf")}
            sx={{
              cursor: "pointer",
              textAlign: "center",
              "&:hover img": { transform: "scale(1.1)" },
            }}
          >
            <img
              src={pdfIcon}
              alt="PDF"
              width={64}
              height={64}
              style={{
                transition: "transform 0.2s",
                borderRadius: "10px",
              }}
            />
            <Typography sx={{ mt: 1, fontWeight: 500 }}>PDF</Typography>
          </Box>

          <Box
            onClick={() => onSelect("word")}
            sx={{
              cursor: "pointer",
              textAlign: "center",
              "&:hover img": { transform: "scale(1.1)" },
            }}
          >
            <img
              src={wordIcon}
              alt="Word"
              width={64}
              height={64}
              style={{
                transition: "transform 0.2s",
                borderRadius: "10px",
              }}
            />
            <Typography sx={{ mt: 1, fontWeight: 500 }}>Word</Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadPopup;

