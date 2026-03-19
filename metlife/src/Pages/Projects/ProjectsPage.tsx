import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    InputAdornment,
    Grid,
    IconButton,
    TablePagination,
    Dialog,
    DialogContent,
} from "@mui/material";
import {
    PlayCircle,
    ErrorOutline,
    FolderCopy,
    Search as SearchIcon,
    Close as CloseIcon,
    AutoFixHigh as AutoFixHighIcon,
    CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { FaRegPlayCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
    getDashboardInfo,
    setSearchQuery,
    setSelectedFilter,
} from "../../redux/features/dashBoardSlice";
import { formatRelativeTime } from "../../utils";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import ButtonComp from "../../components/common/Buton/Button";
import Sidebar from "../../components/layout/Sidebar";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import styles from "./ProjectsPage.module.css";

interface DashboardItem {
    thumbnail: string;
    title: string;
    suggested_duration_minutes: number;
    created_at: string;
    script_id?: string;
    prompt_batch_id?: string;
    videos?: boolean;
    audio?: boolean;
    visuals?: boolean;
    failed?: boolean;
    has_final_video?: boolean;
    final_video?: { url: string };
    language?: string;
    stitched_video_exists?: boolean;
}

const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const {
        dashBoardInfo,
        dashboardLoader,
        selectedFilter,
        searchQuery,
    } = useSelector((store: RootState) => store.DashBoard);

    useEffect(() => {
        dispatch(getDashboardInfo());
        // Reset page when filter or search changes
        setPage(0);
    }, [dispatch, selectedFilter, searchQuery]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenCreateModal = () => setOpenCreateModal(true);
    const handleCloseCreateModal = () => setOpenCreateModal(false);

    const isCompleted = (item: DashboardItem) =>
        item.has_final_video === true || Boolean(item.final_video);

    const isInProgress = (item: DashboardItem) => {
        if (item.failed) return false;
        if (item.has_final_video) return false;
        if (item.audio || item.visuals || item.script_id) return true;
        return false;
    };

    const isFailed = (item: DashboardItem) => item.failed;

    const getStatusLabel = (status: DashboardItem): string => {
        if (!status) return "Unknown";
        if (status.failed) return "Failed";
        if (status.has_final_video) return "Completed";
        if (status.audio && !status.videos) return "Audio Progress";
        if (status.visuals) return "Visuals in Progress";
        if (status.script_id) return "Script Completed";
        return "In Progress";
    };

    const filteredData = dashBoardInfo
        ?.filter((item) => {
            switch (selectedFilter) {
                case "COMPLETED": return isCompleted(item);
                case "IN_PROGRESS": return isInProgress(item);
                case "FAILED": return isFailed(item);
                default: return true;
            }
        })
        ?.filter((item) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                item?.title?.toLowerCase().includes(query) ||
                item?.language?.toLowerCase().includes(query) ||
                getStatusLabel(item)?.toLowerCase()?.includes(query)
            );
        });

    const paginatedData = filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const StatusDot = ({ color }: { color: string }) => (
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
    );
    const getStatusChip = (status: DashboardItem) => {
        const baseStyle = {
            fontWeight: 600,
            borderRadius: "20px",
            px: 1,
            height: "26px",
            fontSize: "12px",
        };

        if (!status) return <Chip label="Unknown" />;

        if (status.failed)
            return (
                <Chip
                    icon={<StatusDot color="#ef4444" />}
                    label="Failed"
                    sx={{
                        ...baseStyle,
                        bgcolor: "rgba(239,68,68,0.15)",
                        color: "#ef4444",
                    }}
                />
            );

        if (status.has_final_video)
            return (
                <Chip
                    icon={<StatusDot color="#22c55e" />}
                    label="Completed"
                    sx={{
                        ...baseStyle,
                        bgcolor: "rgba(34,197,94,0.15)",
                        color: "#22c55e",
                    }}
                />
            );



        if (status.audio && !status.videos || status.audio && status.videos && !status.has_final_video)
            return (
                <Chip
                    icon={<StatusDot color="#f59e0b" />}
                    label="Audio Progress"
                    sx={{
                        ...baseStyle,
                        bgcolor: "rgba(245,158,11,0.15)",
                        color: "#f59e0b",
                    }}
                />
            );

        if (status.visuals && !status.audio)
            return (
                <Chip
                    icon={<StatusDot color="#f59e0b" />}
                    label="Visuals in Progress"
                    sx={{
                        ...baseStyle,
                        bgcolor: "rgba(245,158,11,0.15)",
                        color: "#f59e0b",
                    }}
                />
            );
        if (status.prompt_batch_id)
            return (
                <Chip
                    icon={<StatusDot color="#f59e0b" />}
                    label="Visuals Progress"
                    sx={{
                        ...baseStyle,
                        bgcolor: "rgba(245,158,11,0.15)",
                        color: "#f59e0b",
                    }}
                />
            );

        if (status.script_id)
            return (
                <Chip
                    icon={<StatusDot color="#3b82f6" />}
                    label="Script Completed"
                    sx={{
                        ...baseStyle,
                        bgcolor: "rgba(59,130,246,0.15)",
                        color: "#3b82f6",
                    }}
                />
            );

        return (
            <Chip
                icon={<StatusDot color="#f59e0b" />}
                label="In Progress"
                sx={{
                    ...baseStyle,
                    bgcolor: "rgba(245,158,11,0.15)",
                    color: "#f59e0b",
                }}
            />
        );
    };

    const getFlagIcon = (language: string) => {
        const lang = language?.toLowerCase() || "";
        if (lang.includes("english")) return "🇺🇸";
        if (lang.includes("hindi")) return "🇮🇳";
        if (lang.includes("french")) return "🇫🇷";
        if (lang.includes("spanish")) return "🇪🇸";
        return "🏳️";
    };


    const handleView = (video: DashboardItem) => {
        // if (video.videos) {
        if ((video?.final_video?.url && !video?.stitched_video_exists) || (video.audio && !video.videos || video.audio && video.videos && !video.has_final_video)) {
            navigate(`/animation-page/${video.script_id}`);
            return;
        }
        // For conversational
        if (video?.stitched_video_exists) {
            navigate(`/upload-conversational-clips/${video.script_id}`);
            return;
        }
        if (video.audio) {
            //  if (video.audio && !video.videos || video.audio && video.videos && !video.has_final_video) {
            navigate(`/audio-animation-toolkit/${video.script_id}`);
            return;
        }
        if (video.visuals) {
            navigate(`/generate-visual-page/${video.script_id}`);
            return;
        }
        if (video.prompt_batch_id) {
            navigate(`/create-visual-content/${video.prompt_batch_id}`);
            return;
        }
        navigate(`/scenes/${video.script_id}`);
    };

    const stats = [
        { title: "Total Projects", value: dashBoardInfo?.length || 0, icon: <FolderCopy sx={{ color: "#fff" }} />, filter: "ALL", iconBg: "#2d3a54" },
        { title: "In Progress", value: dashBoardInfo?.filter(isInProgress).length || 0, icon: <FaRegPlayCircle size={20} color="#f5a623" />, filter: "IN_PROGRESS", iconBg: "#332a1a" },
        { title: "Completed", value: dashBoardInfo?.filter(isCompleted).length || 0, icon: <PlayCircle sx={{ color: "#4caf50" }} />, filter: "COMPLETED", iconBg: "#1a3326" },
        { title: "Failed", value: dashBoardInfo?.filter(isFailed).length || 0, icon: <ErrorOutline sx={{ color: "#f44336" }} />, filter: "FAILED", iconBg: "#331a1a" },
    ];

    return (
        <div className={styles.projectsContainer}>
            <Sidebar />
            <div className={styles.mainContent}>
                {dashboardLoader && <FullScreenGradientLoader text="Loading Projects..." />}
                <div className={styles.scrollArea}>
                    <div className={styles.headerSection}>
                        <div className={styles.titleSection}>
                            <Typography variant="h4">Project Library</Typography>
                            <Typography variant="body2">Manage and monitor all your video creation projects in one place.</Typography>
                        </div>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <ButtonComp transform="none" onClick={handleOpenCreateModal}>+ Create New Project</ButtonComp>
                            {/* <ButtonComp transform="none" colorType="outlined" onClick={() => navigate("/upload-script")}>
                                ✨ Upload Script
                            </ButtonComp> */}
                        </Box>
                    </div>

                    <Grid container spacing={3} className={styles.statsGrid}>
                        {stats.map((s, idx) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                                <Box
                                    className={styles.statCard}
                                    onClick={() => dispatch(setSelectedFilter(s.filter))}
                                    sx={{ border: selectedFilter === s.filter ? "2px solid var(--gold)" : "1px solid var(--border-dark)" }}
                                >
                                    <div className={styles.iconWrapper} style={{ backgroundColor: s.iconBg }}>{s.icon}</div>
                                    <div>
                                        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>{s.value}</Typography>
                                        <Typography variant="caption" sx={{ color: "#8899bb" }}>{s.title}</Typography>
                                    </div>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <div className={styles.tableHeader}>
                        <Typography variant="h6">All Projects</Typography>
                        <TextField
                            className={styles.searchField}
                            placeholder="Search experiments..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "#8899bb", fontSize: "20px" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ "& .MuiTableCell-root": { color: "#4b5563", borderBottom: "1px solid rgba(255,255,255,0.05)", py: 1.5, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 } }}>
                                    <TableCell>#</TableCell>
                                    <TableCell>Project Name</TableCell>
                                    <TableCell>Language</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData?.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} align="center"><Typography sx={{ py: 4, color: "#8899bb" }}>No projects found</Typography></TableCell></TableRow>
                                ) : (
                                    paginatedData?.map((item, idx) => (
                                        <TableRow key={idx} className={styles.tableBodyRow}>
                                            <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                                            <TableCell className={styles.projectNameCell}>
                                                <div className={styles.projectIcon}>🎥</div>
                                                {item.title}
                                            </TableCell>
                                            <TableCell>
                                                <div className={styles.languageCell}>
                                                    <span>{getFlagIcon(item.language || "")}</span> {item.language || "English"}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusChip(item)}</TableCell>
                                            <TableCell>{formatRelativeTime(item.created_at)}</TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" sx={{ color: "var(--gold)" }} onClick={() => handleView(item)}>
                                                    <PlayCircle fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className={styles.pagination}
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={filteredData?.length || 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </div>
            </div>

            {/* Project Creation Modal */}
            <Dialog
                open={openCreateModal}
                onClose={handleCloseCreateModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: "#111827",
                        color: "#fff",
                        borderRadius: "24px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        p: 1,
                        backgroundImage: "none",
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, px: 2 }}>
                    <Typography variant="h6" fontWeight={700}>Create New Project</Typography>
                    <IconButton onClick={handleCloseCreateModal} sx={{ color: "#8899bb", "&:hover": { color: "#fff" } }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent sx={{ mt: -1 }}>
                    <Typography variant="body2" sx={{ color: "#8899bb", mb: 4 }}>
                        Choose how you'd like to start your video project.
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                                onClick={() => { navigate("/generate-script"); handleCloseCreateModal(); }}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: "20px",
                                    bgcolor: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 2,
                                    cursor: "pointer",
                                    transition: "0.3s",
                                    textAlign: "center",
                                    "&:hover": {
                                        bgcolor: "rgba(245,166,35,0.08)",
                                        borderColor: "#f5a623",
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                                    }
                                }}
                            >
                                <Box sx={{ width: 56, height: 56, borderRadius: "14px", bgcolor: "rgba(245,166,35,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <AutoFixHighIcon sx={{ color: "#f5a623", fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>Generate Script</Typography>
                                    <Typography variant="caption" sx={{ color: "#8899bb", display: "block", lineHeight: 1.3 }}>Start with an idea or topic using AI</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                                onClick={() => { navigate("/upload-script"); handleCloseCreateModal(); }}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: "20px",
                                    bgcolor: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 2,
                                    cursor: "pointer",
                                    transition: "0.3s",
                                    textAlign: "center",
                                    "&:hover": {
                                        bgcolor: "rgba(59,130,246,0.08)",
                                        borderColor: "#3b82f6",
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                                    }
                                }}
                            >
                                <Box sx={{ width: 56, height: 56, borderRadius: "14px", bgcolor: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CloudUploadIcon sx={{ color: "#3b82f6", fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>Upload Script</Typography>
                                    <Typography variant="caption" sx={{ color: "#8899bb", display: "block", lineHeight: 1.3 }}>Upload a document to create video</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProjectsPage;
