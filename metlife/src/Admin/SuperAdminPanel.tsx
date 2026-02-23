import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  AppBar,
  Toolbar,
  Drawer,
  TableContainer,
  Button,
  Divider,
} from "@mui/material";

import {
  DeleteOutline,
  EditOutlined,
  PeopleOutline,
  DescriptionOutlined,
  BusinessOutlined,
  VisibilityOutlined,
  Menu as MenuIcon,
  ChevronLeft,
} from "@mui/icons-material";

import { IoSearchCircleOutline } from "react-icons/io5";
import ButtonComp from "../components/common/Buton/Button";
import type { SelectChangeEvent } from "@mui/material";

type SectionType = "users" | "scripts" | "clients";

interface UserRow {
  id: number;
  client: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Disabled";
}

interface ScriptRow {
  id: number;
  client: string;
  title: string;
  owner: string;
  createdAt: string;
  status: "Draft" | "Published";
  description: string;
}

const drawerWidth = 250;

const SuperAdminPanel: React.FC = () => {
  const [section, setSection] = React.useState<SectionType>("users");
  const [search, setSearch] = React.useState("");
  const [selectedClient, setSelectedClient] = React.useState("all");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  /* ---------------- CLIENT STATE ---------------- */
  const [clients, setClients] = React.useState<string[]>([
    "MetLife US",
    "MetLife APAC",
  ]);

  const [clientDialogOpen, setClientDialogOpen] = React.useState(false);
  const [newClient, setNewClient] = React.useState("");

  const addClient = () => {
    if (!newClient.trim()) return;
    setClients((prev) => [...prev, newClient.trim()]);
    setNewClient("");
    setClientDialogOpen(false);
  };

  const deleteClient = (client: string) => {
    if (!window.confirm("Delete this client?")) return;
    setClients((prev) => prev.filter((c) => c !== client));
  };

  /* ---------------- USERS ---------------- */
  const [users, setUsers] = React.useState<UserRow[]>([
    {
      id: 1,
      client: "MetLife US",
      name: "Sarah Connor",
      email: "sarah@metlife.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      client: "MetLife APAC",
      name: "Kevin Hart",
      email: "kevin@metlife.com",
      role: "Editor",
      status: "Active",
    },
  ]);

  /* ---------------- SCRIPTS ---------------- */
  const [scripts, setScripts] = React.useState<ScriptRow[]>([
    {
      id: 1,
      client: "MetLife US",
      title: "Quarterly Benefits Overview",
      owner: "Sarah Connor",
      createdAt: "20 Feb 2026",
      status: "Published",
      description: "Summary of Q1 benefits updates.",
    },
  ]);

  const handleClientChange = (event: SelectChangeEvent<string>) => {
    setSelectedClient(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    if (selectedClient !== "all" && user.client !== selectedClient)
      return false;
    if (!search) return true;
    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  const filteredScripts = scripts.filter((script) => {
    if (selectedClient !== "all" && script.client !== selectedClient)
      return false;
    if (!search) return true;
    return script.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb" }}>
      {/* HEADER */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "black",
          borderBottom: "1px solid #edf0f5",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            Super Admin Panel
          </Typography>

          <Button
            variant="outlined"
            startIcon={sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
            onClick={() => setSidebarOpen((prev) => !prev)}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              px: 2,
            }}
          >
            {sidebarOpen ? "Hide Menu" : "Show Menu"}
          </Button>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "white",
            borderRight: "1px solid #edf0f5",
            p: 2,
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary" }}>
          MANAGEMENT
        </Typography>

        <Box sx={{ display: "grid", gap: 1 }}>
          <SidebarButton
            active={section === "users"}
            icon={<PeopleOutline />}
            label="Users"
            onClick={() => setSection("users")}
          />
          <SidebarButton
            active={section === "scripts"}
            icon={<DescriptionOutlined />}
            label="Scripts"
            onClick={() => setSection("scripts")}
          />
          <SidebarButton
            active={section === "clients"}
            icon={<BusinessOutlined />}
            label="Clients"
            onClick={() => setSection("clients")}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary">
          Super Admin Controls
        </Typography>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          ml: sidebarOpen ? `${drawerWidth}px` : 0,
          transition: "0.3s",
          p: 3,
        }}
      >
        {/* TOP BAR */}
        <Paper
          elevation={0}
          sx={{ borderRadius: 4, p: 2.5, mb: 2, border: "1px solid #edf0f5" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {section === "clients"
                ? "Clients"
                : section === "users"
                  ? "Users List"
                  : "Scripts List"}
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                size="small"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoSearchCircleOutline size={18} />
                    </InputAdornment>
                  ),
                }}
              />

              {section === "clients" && (
                <ButtonComp
                  label="Add Client"
                  transform="none"
                  action={() => setClientDialogOpen(true)}
                >
                  + Add Client
                </ButtonComp>
              )}
            </Box>
          </Box>
        </Paper>

        {/* CLIENT TABLE */}
        {section === "clients" && (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: 4, border: "1px solid #edf0f5" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Client Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client} hover>
                    <TableCell>{client}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small">
                        <EditOutlined fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteClient(client)}
                      >
                        <DeleteOutline fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* USERS TABLE */}
        {section === "users" && <DataTable rows={filteredUsers} type="users" />}

        {/* SCRIPTS TABLE */}
        {section === "scripts" && (
          <DataTable rows={filteredScripts} type="scripts" />
        )}
      </Box>

      {/* ADD CLIENT MODAL */}
      <Dialog
        open={clientDialogOpen}
        onClose={() => setClientDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Add Client</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Client Name"
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClientDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addClient}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* ---------------- Sidebar Button ---------------- */
const SidebarButton = ({ active, icon, label, onClick }: any) => (
  <Button
    onClick={onClick}
    startIcon={icon}
    fullWidth
    sx={{
      justifyContent: "flex-start",
      borderRadius: 3,
      textTransform: "none",
      fontWeight: active ? 600 : 400,
      bgcolor: active ? "#e3f2fd" : "transparent",
      color: active ? "primary.main" : "text.primary",
      "&:hover": {
        bgcolor: "#f5f7fa",
      },
    }}
  >
    {label}
  </Button>
);

/* ---------------- Shared Table ---------------- */
const DataTable = ({ rows, type }: any) => (
  <TableContainer
    component={Paper}
    elevation={0}
    sx={{ borderRadius: 4, border: "1px solid #edf0f5" }}
  >
    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: "#e3f2fd" }}>
          <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>
            {type === "users" ? "Email" : "Owner"}
          </TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
          <TableCell sx={{ fontWeight: 600 }} align="center">
            Action
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map((row: any) => (
          <TableRow key={row.id} hover>
            <TableCell>{row.name || row.title}</TableCell>
            <TableCell>{row.email || row.owner}</TableCell>
            <TableCell>{row.client}</TableCell>
            <TableCell align="center">
              <IconButton size="small">
                <EditOutlined fontSize="inherit" />
              </IconButton>
              <IconButton size="small">
                <DeleteOutline fontSize="inherit" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default SuperAdminPanel;
