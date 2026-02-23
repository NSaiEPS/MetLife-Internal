import React from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Business,
  Groups2,
  VerifiedUser,
  Block,
  Visibility,
} from "@mui/icons-material";
import { IoSearchCircleOutline } from "react-icons/io5";
import ButtonComp from "../components/common/Buton/Button";

type TabType = "clients" | "admins" | "users";

interface ClientRow {
  name: string;
  admins: number;
  users: number;
  status: "Active" | "Suspended";
  lastUpdate: string;
}

const rows: ClientRow[] = [
  {
    name: "Acme Corporation",
    admins: 2,
    users: 54,
    status: "Active",
    lastUpdate: "20 Feb 2026, 03:40 PM",
  },
  {
    name: "Globex Ltd",
    admins: 1,
    users: 38,
    status: "Active",
    lastUpdate: "18 Feb 2026, 11:10 AM",
  },
  {
    name: "Initech",
    admins: 1,
    users: 12,
    status: "Suspended",
    lastUpdate: "16 Feb 2026, 09:15 AM",
  },
];

const tabMap: TabType[] = ["clients", "admins", "users"];

const getStatusChip = (status: ClientRow["status"]) => {
  if (status === "Active") {
    return (
      <Chip
        label="Active"
        sx={{
          bgcolor: "#ecfcf2",
          fontWeight: "bold",
          lineHeight: "normal",
          color: "#057647",
          border: "2px solid #aaefc6",
        }}
      />
    );
  }

  return (
    <Chip
      label="Suspended"
      sx={{
        bgcolor: "#fcececff",
        fontWeight: "bold",
        lineHeight: "normal",
        color: "#760505ff",
        border: "2px solid #efaaaaff",
      }}
    />
  );
};

const OneframeAdminPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState<TabType>("clients");

  const totalClients = rows.length;
  const totalAdmins = rows.reduce((sum, item) => sum + item.admins, 0);
  const totalUsers = rows.reduce((sum, item) => sum + item.users, 0);
  const suspendedClients = rows.filter((item) => item.status === "Suspended");

  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      color: "#E3F2FD",
      icon: <Business fontSize="large" sx={{ color: "#1976D2" }} />,
      filter: "clients" as TabType,
    },
    {
      title: "Client Admins",
      value: totalAdmins,
      color: "#FFF8E1",
      icon: <VerifiedUser fontSize="large" sx={{ color: "#F9A825" }} />,
      filter: "admins" as TabType,
    },
    {
      title: "Total Users",
      value: totalUsers,
      color: "#E8F5E9",
      icon: <Groups2 fontSize="large" sx={{ color: "#2E7D32" }} />,
      filter: "users" as TabType,
    },
    {
      title: "Suspended Clients",
      value: suspendedClients.length,
      color: "#FDECEA",
      icon: <Block fontSize="large" sx={{ color: "#D32F2F" }} />,
      filter: "clients" as TabType,
    },
  ];

  const filteredRows = rows.filter((item) => {
    if (!searchQuery) return true;
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Box sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}>
      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={600}>
            OneFrame Admin Panel
          </Typography>
        </Box>

        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Statistics
          </Typography>

          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",
              m: 0,
              pt: "10px",
              flexWrap: "nowrap",
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {stats.map((s) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={s.title}
                sx={{
                  flex: 1,
                  minWidth: { xs: "220px", md: "auto" },
                  cursor: "pointer",
                }}
              >
                <Paper
                  elevation={selectedTab === s.filter ? 6 : 0}
                  onClick={() => setSelectedTab(s.filter)}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: s.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "none",
                    border:
                      selectedTab === s.filter
                        ? "2px solid #1976D2"
                        : "2px solid transparent",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.icon}
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="h5">{s.value}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.title}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6">Client List</Typography>
            <TextField
              placeholder="Search by client name"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: 300,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: "#f9f9f9",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IoSearchCircleOutline color="gray" size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <ButtonComp
            variant="contained"
            colorType="secondary"
            label="+ Add Client"
            transform="none"
          >
            + Add Client
          </ButtonComp>
        </Box>

        <Paper sx={{ mb: 2, borderRadius: 3 }}>
          <Tabs
            value={tabMap.indexOf(selectedTab)}
            onChange={(_, value: number) => setSelectedTab(tabMap[value])}
            sx={{ px: 2, pt: 1 }}
          >
            <Tab label="Clients" />
            <Tab label="Admins" />
            <Tab label="Users" />
          </Tabs>
        </Paper>

        <Paper sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#E3F2FD" }}>
                <TableCell>S.No</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Admins</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Last Update</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography
                      variant="body1"
                      sx={{ py: 4, color: "text.secondary", fontWeight: 500 }}
                    >
                      Data not available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((item, index) => (
                  <TableRow key={item.name}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.admins}</TableCell>
                    <TableCell>{item.users}</TableCell>
                    <TableCell>{item.lastUpdate}</TableCell>
                    <TableCell>{getStatusChip(item.status)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default OneframeAdminPanel;
