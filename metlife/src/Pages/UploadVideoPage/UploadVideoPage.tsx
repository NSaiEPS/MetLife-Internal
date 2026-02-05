import { useRef, useState } from "react";
import styles from "./UploadVideo.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import ButtonComp from "../../components/common/Buton/Button";
import UploadIcon from "../../assets/UploadCloudIcon.svg";
import Footer from "../../components/common/mainFooter";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
// import jsPDF from "jspdf";
import "jspdf-autotable";
import Input from "../../components/common/Input";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/axios";
import { toast } from "react-toastify";
import { showToast } from "../../utils/toast";
import BackButton from "../../components/common/Buton/BackButton";
import { Box, FormControlLabel, Radio, Typography } from "@mui/material";
import SelectComp from "../../components/common/select";
import secureLocalStorage from "react-secure-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  getLocalizationImageUrl,
  postUploadVideo,
} from "../../redux/features/scriptSlice";
import Timer from "../../components/common/Timer/Timer";
import RectangleDrawer from "../../components/Localization_image/RectangleDrawer";

const videoTypeOptions = [
  { value: "l1", label: "L1" },
  { value: "l2", label: "L2" },
  { value: "l3", label: "L3" },
  { value: "l4", label: "L4" },
];

const UploadVideoPage = () => {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [scriptData, setScriptData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [lipSync, setLipSync] = useState<"yes" | "no">("no");
  const [videoType, setVideoType] = useState<string>("l1");
  const navigate = useNavigate();
  const fileInputRef = useRef<any>(null);
  const isDisabled = !title.trim() || !uploadSuccess;
  const [startTimer1, setStartTimer1] = useState<boolean>(false);
  const [startTimer2, setStartTimer2] = useState<boolean>(false);
  const [startTimer3, setStartTimer3] = useState<boolean>(false);
  const [showUploadVideo, setShowUploadVideo] = useState<boolean>(true);
  const [showRectangleCanvas, setShowRectangleCanvas] =
    useState<boolean>(false);
  // const finalTime = 0.5;

  const handleClick = () => {
    fileInputRef?.current?.click();
  };
  const { uploadVideoLoader, uploadVideoInfo } = useSelector(
    (store) => store.Script.uploadVideoData,
  );

  const {
    localizationImageLoader,
    localizationImageData,
    imageCoordinatesLoader,
    imageCoordinatesData,
  } = useSelector((store) => store.Script);

  console.log(localizationImageData, "localizationImageData");
  const waitingTime1 = uploadVideoInfo?.estimated_remaining_time;
  const waitingTime2 = localizationImageData?.estimated_remaining_time;
  const waitingTime3 = imageCoordinatesData?.estimated_time_seconds;
  const finalTime1 = Math.ceil(waitingTime1 / 60);
  const finalTime2 = Math.ceil(waitingTime2 / 60);
  const finalTime3 = Math.ceil(waitingTime3 / 60);

  const localizationImageUrlStatic =
    "https://images.unsplash.com/photo-1768834582204-3430797f89be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  // console.log({ localizationImageLoader, localizationImageUrl });
  const { email, user_id, username } =
    secureLocalStorage.getItem("userDetails");
  const dispatch = useDispatch();

  const handleFileChange = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      showToast.error("Please give input first");
      return;
    }
    const file = files[0];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime", // .mov
    ];

    if (!allowedVideoTypes.includes(file.type)) {
      showToast.error("Only video files are allowed (mp4, webm, mov)");
      e.target.value = null;
      return;
    }
    if (
      selectedFile &&
      file.name === selectedFile?.name &&
      file.size === selectedFile?.size
    ) {
      showToast.error("You have already uploaded this file.");
      return;
    }

    if (!title.trim()) {
      showToast.error("Please give a title before uploading");
      e.target.value = "";
      return;
    }

    const MAX_SIZE_MB = 200;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast.error(`Video must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    setSelectedFile(file);
    setLoader(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("lip_sync", lipSync);
      formData.append("video_type", videoType);
      formData.append("user_id", email);
      // formData.append("intro_present", True);
      // formData.append("intro_duration", 5);
      const response = await fetch(
        `${BASE_URL}upload-vid/localisation/upload-vid`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.status !== 200) {
        toast.error("Error in video uploading");
        return;
      }
      const data = await response.json();
      console.log(data, "check_data");
      setScriptData(data);
      toast.success(data?.message || "Video uploaded successfully");
      setUploadSuccess(true);
    } catch (error) {
      console.log(error);
      toast.error("Error in video uploading!");
    } finally {
      setLoader(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name == "title") {
      setTitle(value);
    }
  };

  // const formData = new FormData();
  // formData.append("video", file);

  // dispatch(
  //   postUploadVideo(scriptId, formData, () => {
  //     console.log("Upload complete");
  //   }),
  // );

  const handleUploadVideo = () => {
    setStartTimer1(true);
    dispatch(postUploadVideo(scriptData?.project_id));
    // dispatch(getLocalizationImageUrl(scriptData?.project_id));
    setShowUploadVideo(false);
  };

  const handleTimerComplete = () => {
    setStartTimer1(false);
    dispatch(getLocalizationImageUrl(scriptData?.project_id));
    setStartTimer2(true);
    // setShowRectangleCanvas(true);
  };

  const handleTimer2Complete = () => {
    setStartTimer2(false);
    // dispatch(getLocalizationImageUrl(scriptData?.project_id));
    setShowRectangleCanvas(true);
  };

  const handleTimer3Complete = () => {
    setStartTimer3(false);
    navigate("/translated-script", {state: scriptData?.project_id});
    // dispatch(
    //   getLocalizationImageUrl(scriptData?.project_id, () => {
    //     navigate("/translated-script", { state: localizationImageData });
    //   }),
    // );
    // setShowRectangleCanvas(true);
  };

  console.log(uploadVideoLoader, "check_loader");
  return (
    <>
      <OneFrameHeader />
      {(loader || uploadVideoLoader) && (
        <FullScreenGradientLoader text="Uploading Video..." />
      )}

      {localizationImageLoader && (
        <FullScreenGradientLoader text="Generating Image..." />
      )}

      {imageCoordinatesLoader && (
        <FullScreenGradientLoader text="Propagating Image..." />
      )}

      {showUploadVideo && (
        <div className={styles.uploadPageContainer}>
          <div className={styles.uploadCard}>
            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <BackButton route="/video-frame" />
              <Typography variant="h4">Upload Video</Typography>
            </div>

            <div>
              <Input
                label="Title:"
                type="text"
                name="title"
                placeholder="Enter the title to generate a video script"
                className={styles.input}
                value={title}
                handleChange={handleInputChange}
                marginStyle={true}
              />
            </div>

            <Typography
              sx={{
                fontSize: "16px",
              }}
              variant="subtitle1"
              color="text.primary"
            >
              Do you want a lip Sync?
            </Typography>
            <Box display="flex" gap={2} mb={1}>
              {/* YES BOX */}
              <Box
                className={styles.input}
                sx={{
                  flex: 1,
                  borderColor: lipSync === "yes" ? "#1976d2" : "#e0e0e0",
                  cursor: "pointer",
                  padding: "4px 20px",
                }}
                onClick={() => setLipSync("yes")}
              >
                <FormControlLabel
                  value="yes"
                  control={
                    <Radio
                      checked={lipSync === "yes"}
                      onChange={() => setLipSync("yes")}
                    />
                  }
                  label="Yes"
                  sx={{ mb: 0 }}
                />
              </Box>

              {/* NO BOX */}
              <Box
                className={styles.input}
                sx={{
                  flex: 1,
                  borderColor: lipSync === "no" ? "#1976d2" : "#e0e0e0",
                  cursor: "pointer",
                  padding: "4px",
                }}
                onClick={() => setLipSync("no")}
              >
                <FormControlLabel
                  value="no"
                  control={
                    <Radio
                      checked={lipSync === "no"}
                      onChange={() => setLipSync("no")}
                    />
                  }
                  label="No"
                  sx={{ m: 0 }}
                />
              </Box>
            </Box>

            <Box sx={{ flex: 1, mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                }}
                variant="subtitle1"
                color="text.primary"
              >
                Video Type
              </Typography>
              <SelectComp
                options={videoTypeOptions}
                value={videoType}
                onChange={setVideoType}
                placeholder="Select Video Type"
              />
            </Box>

            <div className={styles.uploadBox} onClick={handleClick}>
              <img src={UploadIcon} className={styles.uploadIcon} />
              <p className={styles.uploadText}>
                {selectedFile ? selectedFile?.name : "Browse Video Files"}
              </p>
              <span className={styles.uploadText}>
                Maximum upload file size: 50MB
              </span>

              {/* <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept=".pdf"
              // multiple
            /> */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="video/*"
              />
            </div>

            <div className={styles.buttonRow}>
              <ButtonComp
                label={loader ? "Uploading" : "Upload"}
                variant="contained"
                sx={{
                  color: "#ffffff",

                  "&.Mui-disabled": {
                    color: "#ffffff",
                    backgroundColor: "#adadad",
                  },
                  "& img": {
                    filter: "brightness(0) invert(1)",
                  },
                  gap: "8px",
                }}
                disabled={isDisabled}
                // action={() =>
                //   navigate("/translated-script", {
                //     state: { data: scriptData, pdf: false },
                //   })
                // }
                action={handleUploadVideo}
              >
                {!loader && (
                  <img
                    src={UploadIcon}
                    alt="upload"
                    className={styles.uploadIcon}
                  />
                )}
                {loader ? "Uploading" : "Upload a Video"}
              </ButtonComp>
            </div>
          </div>
        </div>
      )}

      {/* {!startTimer1 && finalTime > 0 && !generatedVideoData?.final_video && ( */}
      {startTimer1 && finalTime1 > 0 && (
        <Box sx={{ width: "100%", padding: "30px" }}>
          <Timer
            time={finalTime1}
            onComplete={handleTimerComplete}
            label="Waiting for processing"
          />
        </Box>
      )}

      {startTimer2 && finalTime2 > 0 && (
        <Box sx={{ width: "100%", padding: "30px" }}>
          <Timer
            time={finalTime2}
            onComplete={handleTimer2Complete}
            label="Processing started"
          />
        </Box>
      )}

      {showRectangleCanvas && (
        <Box
          sx={{
            width: "100%",
            // height: "50vh",
            padding: "30px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "fit",
              // height: "100%",
              display: "flex",
              justifyContent: "center",
              border: "1px solid #ccc",
              background: "#f8fafc",
              borderRadius: "8px",
            }}
          >
            <RectangleDrawer
              projectId={scriptData?.project_id}
              setStartTimer3={setStartTimer3}
              setShowRectangleCanvas={setShowRectangleCanvas}
              imgSrc={localizationImageData?.scenes[0]?.original_frame_url}
            />
          </Box>
        </Box>
      )}

      {startTimer3 && finalTime3 > 0 && (
        <Box sx={{ width: "100%", padding: "30px" }}>
          <Timer
            time={finalTime3}
            onComplete={handleTimer3Complete}
            label="Extracting meta-data"
          />
        </Box>
      )}
      <Footer />
    </>
  );
};

export default UploadVideoPage;
