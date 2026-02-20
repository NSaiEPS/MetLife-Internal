import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  TextField,
  Chip,
  Paper,
  Stack,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import ShieldIcon from "@mui/icons-material/Security";
import PeopleIcon from "@mui/icons-material/People";

// MetLife-inspired color theme
const metlifeTheme = createTheme({
  palette: {
    primary: {
      main: "#007ABC", // MetLife Blue
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6CC24A", // MetLife Green
    },
    success: {
      main: "#6CC24A",
    },
    background: {
      default: "#F4F8FB",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function OneframeAdminPanel() {
  const [tab, setTab] = React.useState(0);

  const clients = [
    { name: "Acme Corp", admins: 1, users: 54, status: "Active" },
    { name: "Globex Ltd", admins: 2, users: 120, status: "Active" },
    { name: "Initech", admins: 1, users: 32, status: "Suspended" },
  ];

  return (
    <ThemeProvider theme={metlifeTheme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 4 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              Oneframe Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Super Admin Dashboard
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Client
          </Button>
        </Stack>

        {/* Stats */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <BusinessIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Clients
                  </Typography>
                  <Typography variant="h6">24</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ShieldIcon sx={{ color: "secondary.main" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Client Admins
                  </Typography>
                  <Typography variant="h6">24</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PeopleIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                  <Typography variant="h6">1,284</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Card */}
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={2}>
              <Typography variant="h6">Clients</Typography>

              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Search clients..."
                  InputProps={{ startAdornment: <SearchIcon fontSize="small" /> }}
                />
                <Button variant="outlined" startIcon={<AddIcon />}>
                  New
                </Button>
              </Stack>
            </Stack>

            {/* Tabs */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary">
              <Tab label="Clients" />
              <Tab label="Admins" />
              <Tab label="Users" />
            </Tabs>

            {/* Clients Tab */}
            <TabPanel value={tab} index={0}>
              <Stack spacing={1.5}>
                {clients.map((c, i) => (
                  <Paper
                    key={i}
                    variant="outlined"
                    sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <Box>
                      <Typography fontWeight={600}>{c.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {c.admins} Admin • {c.users} Users
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={c.status}
                        color={c.status === "Active" ? "success" : "default"}
                        size="small"
                      />
                      <Button size="small" variant="outlined">
                        Manage
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </TabPanel>

            {/* Admins Tab */}
            <TabPanel value={tab} index={1}>
              <Typography color="text.secondary">
                Select a client to view admins.
              </Typography>
            </TabPanel>

            {/* Users Tab */}
            <TabPanel value={tab} index={2}>
              <Typography color="text.secondary">
                Select a client to view users.
              </Typography>
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
