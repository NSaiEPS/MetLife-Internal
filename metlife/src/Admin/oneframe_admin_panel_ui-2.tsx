import React, { use } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Button,
  useTheme,
} from "@mui/material";

import {
  Business,
  Groups2,
  VerifiedUser,
  Block,
  Visibility,
  EditOutlined,
} from "@mui/icons-material";

import { IoSearchCircleOutline } from "react-icons/io5";
import ButtonComp from "../components/common/Buton/Button";

type TabType = "clients" | "admins" | "users";
const tabMap: TabType[] = ["clients", "admins", "users"];

/* ---------------- TYPES ---------------- */
interface ClientRow {
  id: number;
  name: string;
  status: "Active" | "Suspended";
  lastUpdate: string;
}

interface PersonRow {
  id: number;
  name: string;
  email: string;
  client: string;
}

/* ---------------- INITIAL DATA ---------------- */
const initialClients: ClientRow[] = [
  {
    id: 1,
    name: "Acme Corporation",
    status: "Active",
    lastUpdate: "20 Feb 2026",
  },
  { id: 2, name: "Globex Ltd", status: "Active", lastUpdate: "18 Feb 2026" },
];

const initialAdmins: PersonRow[] = [
  {
    id: 1,
    name: "John Admin",
    email: "john@acme.com",
    client: "Acme Corporation",
  },
];

const initialUsers: PersonRow[] = [
  {
    id: 1,
    name: "Alice User",
    email: "alice@globex.com",
    client: "Globex Ltd",
  },
];

/* ---------------- STATUS CHIP ---------------- */
const getStatusChip = (status: string) => (
  <Chip
    label={status}
    size="small"
    sx={{
      borderRadius: "999px",
      fontWeight: 600,
      bgcolor: status === "Active" ? "#ecfcf2" : "#fdecea",
      color: status === "Active" ? "#057647" : "#760505",
      border: "2px solid",
      borderColor: status === "Active" ? "#aaefc6" : "#efaaaa",
    }}
  />
);

const OneframeAdminPanel: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<TabType>("clients");
  const [searchQuery, setSearchQuery] = React.useState("");

  const [clients, setClients] = React.useState(initialClients);
  const [admins, setAdmins] = React.useState(initialAdmins);
  const [users, setUsers] = React.useState(initialUsers);
  const theme = useTheme();
  const mode = theme.palette.mode;
  /* ---------------- MODAL ---------------- */
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);

  const [form, setForm] = React.useState<any>({
    name: "",
    email: "",
    client: "",
    status: "Active",
  });

  const openAdd = () => {
    setEditingItem(null);
    setForm({
      name: "",
      email: "",
      client: "",
      status: "Active",
    });
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setForm(item);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedTab === "clients") {
      if (!form.name.trim()) return;

      if (editingItem) {
        setClients((prev) =>
          prev.map((c) => (c.id === editingItem.id ? { ...c, ...form } : c)),
        );
      } else {
        const nextId = clients.length
          ? Math.max(...clients.map((c) => c.id)) + 1
          : 1;

        setClients((prev) => [
          ...prev,
          {
            id: nextId,
            name: form.name,
            status: form.status,
            lastUpdate: new Date().toLocaleDateString(),
          },
        ]);
      }
    }

    if (selectedTab === "admins") {
      savePerson(form, admins, setAdmins);
    }

    if (selectedTab === "users") {
      savePerson(form, users, setUsers);
    }

    setDialogOpen(false);
  };

  const savePerson = (
    form: PersonRow,
    list: PersonRow[],
    setter: React.Dispatch<React.SetStateAction<PersonRow[]>>,
  ) => {
    if (!form.name || !form.email || !form.client) return;

    if (editingItem) {
      setter((prev) => prev.map((p) => (p.id === editingItem.id ? form : p)));
    } else {
      const nextId = list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;

      setter((prev) => [...prev, { ...form, id: nextId }]);
    }
  };

  /* ---------------- FILTERING ---------------- */
  const activeRows =
    selectedTab === "clients"
      ? clients
      : selectedTab === "admins"
        ? admins
        : users;

  const filteredRows = activeRows.filter((row: any) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = [
    {
      title: "Total Clients",
      value: clients.length,
      color: "#eef5ff",
      icon: <Business sx={{ color: "#1976D2" }} />,
      tab: "clients",
    },
    {
      title: "Admins",
      value: admins.length,
      color: "#fff7e6",
      icon: <VerifiedUser sx={{ color: "#F9A825" }} />,
      tab: "admins",
    },
    {
      title: "Users",
      value: users.length,
      color: "#edf7ed",
      icon: <Groups2 sx={{ color: "#2E7D32" }} />,
      tab: "users",
    },
    {
      title: "Suspended",
      value: clients.filter((c) => c.status === "Suspended").length,
      color: "#fdeeee",
      icon: <Block sx={{ color: "#D32F2F" }} />,
      tab: "clients",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={600} mb={3}>
          Admin Panel
        </Typography>

        {/* STATISTICS */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Statistics
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 2,
            }}
          >
            {stats.map((s) => (
              <Paper
                key={s.title}
                onClick={() => setSelectedTab(s.tab as TabType)}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  bgcolor: mode == "dark" ? "transparent" : s.color,
                  cursor: "pointer",
                  transition: "0.25s",
                  "&:hover": { transform: "translateY(-3px)" },
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  {s.icon}
                  <Typography variant="h5">{s.value}</Typography>
                </Box>
                <Typography variant="body2">{s.title}</Typography>
              </Paper>
            ))}
          </Box>
        </Paper>

        {/* TOP BAR */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            placeholder="Search..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IoSearchCircleOutline size={20} />
                </InputAdornment>
              ),
            }}
          />

          <ButtonComp label="Add" transform="none" action={openAdd}>
            + Add {selectedTab.slice(0, -1)}
          </ButtonComp>
        </Box>

        {/* TABS */}
        <Tabs
          value={tabMap.indexOf(selectedTab)}
          onChange={(_, v) => setSelectedTab(tabMap[v])}
          sx={{
            '& .MuiTabs-indicator': {
              background: 'var(--primary-color)',
            }
          }}
        >
          <Tab
            label="Clients"
            sx={{
              // color: 'gray',
              '&.Mui-selected': {
                color: 'var(--primary-color)',
                fontWeight: 'bold'
              }
            }}
          />
          <Tab
            label="Admins"
            sx={{
              // color: 'gray',
              '&.Mui-selected': {
                color: 'var(--primary-color)',
                fontWeight: 'bold'
              }
            }}
          />
          <Tab
            label="Users"
            sx={{
              // color: 'gray',
              '&.Mui-selected': {
                color: 'var(--primary-color)',
                fontWeight: 'bold'
              }
            }}
          />
        </Tabs>

        {/* TABLE */}
        <Paper sx={{ borderRadius: 3, mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "var(--table-bg-color)" }}>
                <TableCell>Name</TableCell>
                {selectedTab !== "clients" && <TableCell>Email</TableCell>}
                {selectedTab !== "clients" && <TableCell>Client</TableCell>}
                {selectedTab === "clients" && <TableCell>Status</TableCell>}
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row: any) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.name}</TableCell>
                  {selectedTab !== "clients" && (
                    <TableCell>{row.email}</TableCell>
                  )}
                  {selectedTab !== "clients" && (
                    <TableCell>{row.client}</TableCell>
                  )}
                  {selectedTab === "clients" && (
                    <TableCell>{getStatusChip(row.status)}</TableCell>
                  )}

                  <TableCell align="center">
                    <IconButton size="small" onClick={() => openEdit(row)}>
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <Visibility fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* MODAL */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>
            {editingItem ? "Edit" : "Add"} {selectedTab.slice(0, -1)}
          </DialogTitle>

          <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) =>
                setForm((p: any) => ({ ...p, name: e.target.value }))
              }
            />

            {selectedTab !== "clients" && (
              <TextField
                label="Email"
                value={form.email}
                onChange={(e) =>
                  setForm((p: any) => ({ ...p, email: e.target.value }))
                }
              />
            )}

            {selectedTab !== "clients" && (
              <TextField
                select
                label="Client"
                value={form.client}
                onChange={(e) =>
                  setForm((p: any) => ({ ...p, client: e.target.value }))
                }
              >
                {clients.map((c) => (
                  <MenuItem key={c.id} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {selectedTab === "clients" && (
              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(e) =>
                  setForm((p: any) => ({ ...p, status: e.target.value }))
                }
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </TextField>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default OneframeAdminPanel;
