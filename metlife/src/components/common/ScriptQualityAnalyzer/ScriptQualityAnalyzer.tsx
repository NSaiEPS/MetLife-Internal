import React from "react";
import { Box, Typography, Button, LinearProgress, Stack, Divider } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

const ScriptQualityAnalyzer = ({ data }: any) => {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card2)", // Using theme variable
        borderRadius: "12px",
        padding: "24px",
        minWidth: "310px",
        color: "var(--text-secondary-dark)", // Secondary text color
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        fontFamily: "'Syne', sans-serif",
        border: "1px solid var(--border-dark)",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <BarChartIcon sx={{ color: "var(--text-light)" }} />
        <Typography variant="h6" sx={{ color: "var(--text-light)", fontWeight: 600 }}>
          Script Quality Analyzer
        </Typography>
      </Stack>

      {/* Metric: Estimated Duration */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Estimated Duration
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--gold)", fontWeight: 600 }}>
          {data?.analysis?.estimated_duration}
        </Typography>
      </Stack>

      {/* Metric: Complexity Dots */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Complexity
        </Typography>
        <Stack direction="row" spacing={0.5}>
          {
            data?.analysis?.complexity
          }
        </Stack>
      </Stack>

      {/* Metric: Audience Level */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Audience Level
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--blue-accent)", fontWeight: 500 }}>
          {data?.analysis?.audience_level}
        </Typography>
      </Stack>

      {/* Metric: Clarity Score (Progress Bar) */}
      <Stack spacing={1} mb={2}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Clarity Score
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Number(data?.analysis?.clarity_score || 0)}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "var(--bg-deep)",
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                Number(data?.analysis?.clarity_score || 0) <= 30
                  ? "var(--red)"
                  : Number(data?.analysis?.clarity_score || 0) <= 60
                    ? "var(--gold)"
                    : "var(--green)",
              borderRadius: 4,
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color:
              Number(data?.analysis?.clarity_score || 0) <= 30
                ? "var(--red)"
                : Number(data?.analysis?.clarity_score || 0) <= 60
                  ? "var(--gold)"
                  : "var(--green)",
            fontWeight: 600,
          }}
        >
          {data?.analysis?.clarity_score}
        </Typography>
      </Stack>

      {/* Metric: Engagement Score */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Engagement Score
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color:
              String(data?.analysis?.engagement_score).toLowerCase().includes("weak")
                ? "var(--red)"
                : String(data?.analysis?.engagement_score).toLowerCase().includes("medium")
                  ? "var(--gold)"
                  : "var(--green)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 0.5
          }}
        >
          {data?.analysis?.engagement_score}
        </Typography>
      </Stack>

      {/* Divider */}
      <Divider sx={{ borderColor: "var(--border-dark)", my: 2.5 }} />

      {/* Suggestions Section */}
      <Box mb={3}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
          <LightbulbOutlinedIcon sx={{ color: "var(--gold-light)", fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ color: "var(--text-secondary-dark)", fontWeight: 600 }}>
            Suggestions
          </Typography>
        </Stack>
        <Box component="ul" sx={{ pl: 2, m: 0, opacity: 0.9, typography: "body2", '& li': { mb: 1, '&::marker': { color: 'var(--text-muted-dark)' } } }}>
          {/* <li>Scene 2 could use more visual examples</li>
          <li>Scene 4 may be too long for optimal engagement</li> */}

          {
            data?.analysis?.suggestions?.map((suggestion: string, index: number) => (
              <li key={index}>{suggestion}</li>
            ))
          }
        </Box>
      </Box>

      {/* Improve Script Button */}
      <Button
        variant="contained"
        fullWidth
        startIcon={<AutoFixHighIcon />}
        sx={{
          backgroundColor: "var(--gold)",
          color: "#000",
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "8px",
          py: 1.2,
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "var(--gold-dark)",
          },
        }}
      >
        Improve Script
      </Button>
    </Box>
  );
};

export default ScriptQualityAnalyzer;
