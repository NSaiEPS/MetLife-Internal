import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  Breadcrumbs,
  Link,
  Chip,
} from "@mui/material";
import {
  FileUploadOutlined,
  LightbulbCircleOutlined,
  AutoAwesomeOutlined,
  NavigateNext as NavigateNextIcon,
  Description as DescriptionIcon,
  Psychology as AutoScriptIcon,
  AutoFixHigh as AutoSceneIcon,
  ImageSearch as VisualsIcon,
  MicNone as VoiceIcon,
} from "@mui/icons-material";
import styles from "./KnowledgeToVideo.module.css";
import { useNavigate } from "react-router";
import ButtonComp from "../../components/common/Buton/Button";
import PollIcon from '@mui/icons-material/Poll';


const KnowledgeToVideo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.container}>
      {/* Header Section */}
      <Box className={styles.header}>
        <Box className={styles.titleSection}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ color: "6b7280", mb: 1.5, fontSize: "11px" }}
          >
            <Link underline="hover" color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              Home
            </Link>
            <Typography color="var(--text-light)" sx={{ fontSize: "11px" }}>Knowledge-to-Video Engine</Typography>
          </Breadcrumbs>

          <Box className={styles.titleContainer}>
            <Typography variant="h4" className={styles.title}>
              📄 AI Knowledge-to-Video Engine
            </Typography>
            <Chip label="New" size="small" className={styles.newBadge} />
          </Box>
          <Typography className={styles.subtitle}>
            Convert documents into clear, educational videos automatically using AI
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <ButtonComp colorType="outlined" transform="none">
            ← Dashboard
          </ButtonComp>
          <ButtonComp colorType="primary" transform="none">
            Go to Script →
          </ButtonComp>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }} sx={{ height: "70vh", overflowY: "auto" }}>
          <Box className={styles.leftColumn}>
            {/* Upload Section */}
            <Box className={styles.uploadSection}>
              <Box className={styles.uploadCard}>
                <Box sx={{ width: 48, height: 48, mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <DescriptionIcon sx={{ fontSize: 40, color: "#fff" }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Drop PDF, Doc, or Text File
                </Typography>
                <Typography variant="caption" sx={{ color: "#748296ff", mb: 2 }}>
                  Supported formats: PDF, DOCX, TXT
                </Typography>
                <ButtonComp
                  colorType="primary"
                  transform="none"
                  icon={<FileUploadOutlined />}
                >
                  Upload Document
                </ButtonComp>
              </Box>

              <Box className={styles.fileCard}>
                <Box sx={{ position: "relative" }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PollIcon sx={{ fontSize: 40, color: "#fff" }} />
                  </Box>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Enterprise Architecture <br /> Spec.docx
                </Typography>
                <Typography variant="caption" sx={{ color: "#748296ff", mb: 2 }}>
                  2.1 MB
                </Typography>
                <ButtonComp
                  colorType="outlined"
                  transform="none"
                  icon={<FileUploadOutlined />}
                >
                  Upload New Document
                </ButtonComp>
              </Box>
            </Box>

            {/* Generate Learning Outline Section */}
            <Box className={styles.sectionCard}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Generate Learning Outline
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mb: 3 }}>
                EdWave AI will automatically generate a video script based on your document's key points.
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 1 }}>Duration:</Typography>
                  <FormControl fullWidth size="small">
                    <Select defaultValue={6} sx={{ bgcolor: "rgba(255,255,255,0.03)", color: "#fff", borderRadius: "8px" }}>
                      <MenuItem value={6}>6 minutes</MenuItem>
                      <MenuItem value={10}>10 minutes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 1 }}>Tone:</Typography>
                  <FormControl fullWidth size="small">
                    <Select defaultValue="Educational" sx={{ bgcolor: "rgba(255,255,255,0.03)", color: "#fff", borderRadius: "8px" }}>
                      <MenuItem value="Educational">Educational</MenuItem>
                      <MenuItem value="Professional">Professional</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 1 }}>Audience:</Typography>
                  <FormControl fullWidth size="small">
                    <Select defaultValue="IT Architects" sx={{ bgcolor: "rgba(255,255,255,0.03)", color: "#fff", borderRadius: "8px" }}>
                      <MenuItem value="IT Architects">IT Architects</MenuItem>
                      <MenuItem value="Students">Students</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <ButtonComp
                colorType="primary"
                icon={<AutoAwesomeOutlined />}
                transform="none"
              >
                Generate Learning Outline
              </ButtonComp>
            </Box>

            {/* Smart Suggestion Panel Section */}
            <Box className={styles.sectionCard}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Typography sx={{ fontSize: "20px" }}>🧠</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Smart Suggestion Panel
                </Typography>
              </Box>

              <Box className={styles.grid4}>
                <Box className={styles.smallCard}>
                  <AutoScriptIcon sx={{ color: "#f5a623", mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Generate Script</Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>Write a clear narration</Typography>
                </Box>
                <Box className={styles.smallCard}>
                  <AutoSceneIcon sx={{ color: "#8899bb", mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Auto Scene Generation</Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>Create scenes from key points</Typography>
                </Box>
                <Box className={styles.smallCard}>
                  <VisualsIcon sx={{ color: "#8899bb", mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Suggest Visuals</Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>Find relevant images, icons and videos</Typography>
                </Box>
                <Box className={styles.smallCard}>
                  <VoiceIcon sx={{ color: "#8899bb", mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Select Narration Voice</Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>Choose voice and tone</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                <ButtonComp
                  colorType="primary"
                  transform="none"
                >
                  Continue
                </ButtonComp>
                <ButtonComp
                  colorType="outlined"
                  transform="none"
                >
                  🔄 Regenerate Outline
                </ButtonComp>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Column (Tips & Suggestions) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box className={styles.tipsBox}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <LightbulbCircleOutlined sx={{ color: "#f5a623" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Tips & Suggestions
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ bgcolor: "rgba(59,130,246,0.15)", p: 1, borderRadius: "4px", height: "fit-content" }}>
                  <DescriptionIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#3b82f6", fontWeight: 600, mb: 0.5 }}>Format documents</Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>In clear sections and points</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: "4px", height: "fit-content" }}>
                  <Typography sx={{ fontSize: "20px" }}>⭐</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#f5a623", fontWeight: 600, mb: 0.5 }}>Quality</Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>The better the document, the better the video</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: "4px", height: "fit-content" }}>
                  <Typography sx={{ fontSize: "20px" }}>🎯</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: 600, mb: 0.5 }}>Relevance</Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>Relevant visuals and data will enhance the video</Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="text"
              sx={{ color: "#f5a623", fontSize: "12px", textTransform: "none", mt: 4, "&:hover": { background: "transparent", textDecoration: "underline" } }}
            >
              Learn more for best practices ⌄
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default KnowledgeToVideo;
