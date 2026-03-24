import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  alpha,
  TextField,
  InputAdornment,
  Button,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Build as BuildIcon,
  Campaign as CampaignIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import Sidebar from "../../components/layout/Sidebar";
import ButtonComp from "../../components/common/Buton/Button";
import { useNavigate } from "react-router";

const templates = [
  {
    id: 1,
    title: "Course Introduction",
    description: "Engage students from the first frame with a compelling intro",
    icon: <SchoolIcon sx={{ fontSize: 40, color: "#f5a623" }} />,
    tag: "New",
    tagBg: "rgba(34, 197, 94, 0.15)",
    tagColor: "#22c55e",
    headerBg: "linear-gradient(180deg, rgba(20, 30, 48, 1) 0%, rgba(36, 59, 85, 1) 100%)",
  },
  {
    id: 2,
    title: "Corporate Training",
    description: "Professional training videos with consistent brand style",
    icon: <BusinessIcon sx={{ fontSize: 40, color: "#8899bb" }} />,
    tag: "Popular",
    tagBg: "rgba(59, 130, 246, 0.15)",
    tagColor: "#3b82f6",
    headerBg: "linear-gradient(180deg, rgba(20, 30, 48, 1) 0%, rgba(36, 59, 85, 1) 100%)",
  },
  {
    id: 3,
    title: "Product Explainer",
    description: "Showcase product features clearly and compellingly",
    icon: <InventoryIcon sx={{ fontSize: 40, color: "#f5a623" }} />,
    headerBg: "linear-gradient(180deg, rgba(43, 8, 8, 1) 0%, rgba(20, 30, 48, 1) 100%)",
  },
  {
    id: 4,
    title: "Technical Tutorial",
    description: "Step-by-step technical guides with code & diagrams",
    icon: <BuildIcon sx={{ fontSize: 40, color: "#22c55e" }} />,
    tag: "New",
    tagBg: "rgba(34, 197, 94, 0.15)",
    tagColor: "#22c55e",
    headerBg: "linear-gradient(180deg, rgba(5, 41, 25, 1) 0%, rgba(20, 30, 48, 1) 100%)",
  },
  {
    id: 5,
    title: "Marketing Video",
    description: "High-impact marketing content that converts viewers",
    icon: <CampaignIcon sx={{ fontSize: 40, color: "#ef4444" }} />,
    headerBg: "linear-gradient(180deg, rgba(43, 34, 25, 1) 0%, rgba(20, 30, 48, 1) 100%)",
  },
];

const TemplateMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Templates");

  const filters = ["All Templates", "Course Introduction", "Corporate", "Marketing"];

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All Templates" || t.title.includes(activeFilter) || (activeFilter === "Corporate" && t.title.includes("Corporate")) || (activeFilter === "Marketing" && t.title.includes("Marketing"));
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#060910", color: "#fff", overflow: "hidden" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto", position: "relative" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <InventoryIcon sx={{ fontSize: 28, color: "#fff" }} />
              <Typography variant="h4" fontWeight={700} sx={{ color: "#fff" }}>
                Template Marketplace
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#8899bb" }}>
              Browse ready-made templates to quickly create professional videos
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/dashboard")}
              sx={{
                color: "#8899bb",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              ← Dashboard
            </Button>
            <ButtonComp transform="none" onClick={() => {}}>
              + New Template
            </ButtonComp>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <TextField
            placeholder="Search templates..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: "300px",
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255, 255, 255, 0.03)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "14px",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                "&.Mui-focused fieldset": { borderColor: "#f5a623" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8899bb", fontSize: "20px" }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            {filters.map((f) => (
              <Chip
                key={f}
                label={f}
                onClick={() => setActiveFilter(f)}
                sx={{
                  bgcolor: activeFilter === f ? "transparent" : "rgba(255, 255, 255, 0.03)",
                  color: activeFilter === f ? "#f5a623" : "#8899bb",
                  border: `1px solid ${activeFilter === f ? "#f5a623" : "rgba(255, 255, 255, 0.1)"}`,
                  borderRadius: "8px",
                  fontWeight: activeFilter === f ? 600 : 500,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Grid */}
        <Grid container spacing={3}>
          {filteredTemplates.map((t) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.id}>
              <Paper
                sx={{
                  bgcolor: "#0f1521",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: alpha("#f5a623", 0.3),
                  },
                }}
              >
                {/* Card Header area */}
                <Box
                  sx={{
                    height: "160px",
                    background: t.headerBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {t.tag && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: t.tagBg,
                        color: t.tagColor,
                        px: 1,
                        py: 0.2,
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {t.tag}
                    </Box>
                  )}
                  {t.icon}
                </Box>
                {/* Card Content */}
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#fff", mb: 0.5 }}>
                    {t.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#8899bb", display: "block", mb: 2, height: "32px", lineHeight: 1.4 }}>
                    {t.description}
                  </Typography>
                  <ButtonComp transform="none" fullWidth>
                    Use This Template
                  </ButtonComp>
                </Box>
              </Paper>
            </Grid>
          ))}

          {/* Create Custom Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              sx={{
                bgcolor: "rgba(15, 21, 33, 0.4)",
                borderRadius: "16px",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
                height: "100%",
                minHeight: "330px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  borderColor: alpha("#f5a623", 0.5),
                },
              }}
            >
              <AddIcon sx={{ fontSize: 40, color: "#4b5563", mb: 2 }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#fff", mb: 0.5 }}>
                Create Custom
              </Typography>
              <Typography variant="caption" sx={{ color: "#8899bb" }}>
                Build your own reusable template
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TemplateMarketplace;
