import { Divider, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import DownloadPopup from "../../common/popup/DownloadPopup";
import { useDispatch, useSelector } from "react-redux";
import { downloadVideoWithUrl } from "../../../redux/features/audioAnimationSlice";
import { toast } from "react-toastify";
import { downloadScriptPdf, downloadScriptWord } from "../../../utils";
import api from "../../../api/axios";
import FullScreenGradientLoader from "../GradientLoader";

interface RootState {
  AudioAnimation: {
    videoAnimationLoader: boolean;
  };
}

export const UploadPopup = ({
  open,
  openPopup,
  handleCloseMenu,
  menuData,
}: {
  openPopup: boolean;
  open: HTMLElement | null;
  handleCloseMenu: () => void;
}) => {
  console.log(menuData, "check_menu_data");
  const scriptId = menuData?.downloadScript?.script_id;
  const videoData = menuData?.downloadVideo;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const route = pathname === "/dashboard";
  const [openDownloadPopup, setOpenDownloadPopup] = useState(false);
  const [sceneData, setSceneData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { videoAnimationLoader } = useSelector(
    (store: RootState) => store.AudioAnimation,
  );

  const dispatch = useDispatch<any>();

  const downloadVideoFromDashboard = () => {
    const title = videoData?.title;
    const finalVideo = videoData?.final_video?.url;
    console.log(finalVideo, "check_final_video");
    if (!finalVideo) {
      toast.error("Final Video is not present for this script.");
      return;
    }
    dispatch(downloadVideoWithUrl(finalVideo, title));
    handleCloseMenu();
  };

  // Downnload script functionality from dashboard

  const handleScriptDownload = async () => {
    if (!scriptId) return;
    setOpenDownloadPopup(true);
    setLoading(true);
    try {
      const result = await api.get(`scripts/${scriptId}`);
      if (result?.status === 200) {
        setSceneData(result?.data);
      }
    } catch (e: any) {
      toast.error(e?.detail);
    } finally {
      setLoading(false);
    }
  };

  console.log(sceneData, "sceneData");

  const handleDownloadType = (type: string) => {
    console.log("Scene_Data", sceneData);
    // if (!sceneData?.scenes?.length) {
    //   console.log("Scenes not ready");
    //   return;
    // }
    setLoading(true);
    try {
      if (type === "pdf") {
        downloadScriptPdf({ ...sceneData, scenes: sceneData?.scenes }, true);
      } else if (type === "word") {
        downloadScriptWord({ ...sceneData, scenes: sceneData?.scenes }, true);
      }
      setOpenDownloadPopup(false);
    } catch (err) {
      console.error("Error generating file:", err);
    } finally {
      handleCloseMenu();
      setLoading(false);
    }
  };

  return (
    <>
      {(loading || videoAnimationLoader) && (
        <FullScreenGradientLoader text={"loading..."} />
      )}
      <Menu
        anchorEl={open}
        open={openPopup}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            minWidth: 166,
            width: "max-content",
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        {" "}
        {route
          ? [
              <MenuItem
                key="download-script"
                // onClick={() => setOpenDownloadPopup(true)}
                onClick={handleScriptDownload}
              >
                Download Script
              </MenuItem>,
              <Divider key="d1" sx={{ my: 0 }} />,
              <MenuItem
                key="download-video"
                onClick={downloadVideoFromDashboard}
              >
                Download Video
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="upload-video"
                onClick={() => {
                  handleCloseMenu();
                  // navigate("/upload-video");
                }}
              >
                Upload Video
              </MenuItem>,
              <Divider key="d2" sx={{ my: 0 }} />,
              <MenuItem
                key="upload-script"
                onClick={() => {
                  handleCloseMenu();
                  navigate("/upload-script");
                }}
              >
                Upload Script
              </MenuItem>,
            ]}
      </Menu>

      <DownloadPopup
        open={openDownloadPopup}
        onClose={() => setOpenDownloadPopup(false)}
        onSelect={handleDownloadType}
      />
    </>
  );
};
