import { Box, Button, Modal, TextField, Typography } from "@mui/material";

interface OstStylePopupProps {
  open: boolean;
  onClose: () => void;
  ostStyle: any;
  setOstStyle: React.Dispatch<React.SetStateAction<any>>;
  onApply: () => void;
}

const OST_PRESETS = {
  redGrey: {
    bg_color: [40, 40, 40],
    accent_color: [220, 38, 38],
    text_color: [255, 255, 255],
    opacity: 90,
    width_percent: 60,
    y_position_percent: 65,
  },
  premiumNavy: {
    bg_color: [10, 25, 49],
    accent_color: [212, 175, 55],
    text_color: [245, 245, 245],
    opacity: 95,
    width_percent: 60,
    y_position_percent: 65,
  },
  cyberpunk: {
    bg_color: [20, 15, 40],
    accent_color: [0, 255, 255],
    text_color: [255, 255, 255],
    opacity: 85,
    width_percent: 60,
    y_position_percent: 65,
  },
  cleanLight: {
    bg_color: [240, 240, 240],
    accent_color: [37, 99, 235],
    text_color: [15, 23, 42],
    opacity: 95,
    width_percent: 60,
    y_position_percent: 65,
  },
  alert: {
    bg_color: [0, 0, 0],
    accent_color: [255, 213, 0],
    text_color: [255, 255, 255],
    opacity: 100,
    width_percent: 60,
    y_position_percent: 65,
  },
};

const OstStylePopup: React.FC<OstStylePopupProps> = ({
  open,
  onClose,
  ostStyle,
  setOstStyle,
  onApply,
}) => {
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const rgbToHex = (rgb: number[]) => {
    return (
      "#" +
      rgb
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: 400,
            width: { xs: "95%", sm: 500,md:768, },
            maxHeight: "90vh",
            overflowY: "auto",
            // bgcolor: "background.paper",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            Transition Style Settings
          </Typography>

          <Typography variant="subtitle1" mb={1}>
            Quick Presets
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {Object.entries(OST_PRESETS).map(([key, value]) => (
              <Button
                key={key}
                size="small"
                variant="outlined"
                onClick={() => setOstStyle(value)}
              >
                {key}
              </Button>
            ))}
          </Box>

          {/* ✅ Responsive Preview Section */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 2,
              overflow: "hidden",
              mb: 3,
              backgroundColor: "#000",
            }}
          >
            {/* Backfround Image */}
            <Box
              component="img"
              src="https://picsum.photos/800/450"
              alt="Preview"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            Overlay Preview
            {/* <Box
              sx={{
                position: "absolute",
                // bottom: `${ostStyle.y_position_percent}%`,
                bottom:"20%",
                left: "30%",
                transform: "translateX(-50%)",
                width: `${ostStyle.width_percent}%`,
                backgroundColor: `rgba(${ostStyle.bg_color.join(",")}, ${
                  ostStyle.opacity / 100
                })`,
                color: `rgb(${ostStyle.text_color.join(",")})`,
                padding: 1,
                textAlign: "center",
                borderRadius: 1,
                fontWeight: 500,
              }}
            >
              Sample OST Text
            </Box> */}
            <Box
              sx={{
                position: "absolute",
                // bottom: `${ostStyle.y_position_percent}%`,
                bottom: "20%",
                left: "30%",
                transform: "translateX(-50%)",
                width: `${ostStyle.width_percent}%`,
                display: "flex",
                alignItems: "stretch",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              {/* Accent Vertical Strip */}
              <Box
                sx={{
                  width: "8px",
                  backgroundColor: `rgb(${ostStyle.accent_color.join(",")})`,
                }}
              />
              {/* Main Banner */}
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: `rgba(${ostStyle.bg_color.join(",")}, ${
                    ostStyle.opacity / 100
                  })`,
                  color: `rgb(${ostStyle.text_color.join(",")})`,
                  padding: "8px 12px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Sample OST Text
              </Box>
            </Box>
          </Box>

          {/* Background Color */}
          <TextField
            label="Background Color"
            type="color"
            fullWidth
            margin="normal"
            value={rgbToHex(ostStyle.bg_color)}
            onChange={(e) =>
              setOstStyle({
                ...ostStyle,
                bg_color: hexToRgb(e.target.value),
              })
            }
          />

          {/* Text Color */}
          <TextField
            label="Text Color"
            type="color"
            fullWidth
            margin="normal"
            value={rgbToHex(ostStyle.text_color)}
            onChange={(e) =>
              setOstStyle({
                ...ostStyle,
                text_color: hexToRgb(e.target.value),
              })
            }
          />

          {/* Accent Color */}
          <TextField
            label="Accent Color"
            type="color"
            fullWidth
            margin="normal"
            value={rgbToHex(ostStyle.accent_color)}
            onChange={(e) =>
              setOstStyle({
                ...ostStyle,
                accent_color: hexToRgb(e.target.value),
              })
            }
          />

          {/* Opacity */}
          <TextField
            label="Opacity"
            type="number"
            fullWidth
            margin="normal"
            value={ostStyle.opacity}
            onChange={(e) =>
              setOstStyle({ ...ostStyle, opacity: Number(e.target.value) })
            }
          />

          {/* Width Percent */}
          <TextField
            label="Banner Width"
            type="number"
            fullWidth
            margin="normal"
            value={ostStyle.width_percent}
            onChange={(e) =>
              setOstStyle({
                ...ostStyle,
                width_percent: Number(e.target.value),
              })
            }
          />

          {/* Y Position */}
          <TextField
            label="Banner Height"
            type="number"
            fullWidth
            margin="normal"
            value={ostStyle.y_position_percent}
            onChange={(e) =>
              setOstStyle({
                ...ostStyle,
                y_position_percent: Number(e.target.value),
              })
            }
          />

          <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
            <Button onClick={onClose}>Cancel</Button>

            <Button
              variant="contained"
              onClick={() => {
                onApply();
                onClose();
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default OstStylePopup;
