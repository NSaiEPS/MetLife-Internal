import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import oneFrame from "../../assets/OneFrame.png";
import unnamed from "../../assets/updatedLogo.png";
import Surfai_Video_Studio_Icon from "../../assets/Surfai_Video_Studio_Icon.png";
import mailIcon from "../../assets/mail-account.svg";
import { useDispatch, useSelector } from "react-redux";
import { postAuthLogin } from "../../redux/auth/authSlice";
import type { RootState } from "../../redux/store";
import FullScreenGradientLoader from "../common/GradientLoader";
import { navigateTo } from "../../utils/navigate";
import ButtonComp from "../common/Buton/Button";
// import rightImg from "../../assets/login-right.png";
// import serfAilogo from "../../assets/serfAi-logo.jpg";
import MailLockIcon from '@mui/icons-material/MailLock';
/* ---------------- Types ---------------- */

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

/* ---------------- Component ---------------- */

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { userInfo, authLoader } = useSelector(
    (store: RootState) => store.Auth,
  );

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  /* ---------------- Handlers ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(postAuthLogin(formData, successPermission));
  };

  const successPermission = () => {
    navigateTo(`/video-frame`);
  };

  /* ---------------- JSX ---------------- */

  return (
    <>
      {authLoader && <FullScreenGradientLoader text="Loading..." />}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ width: "100%" }}
      >
        {/* LEFT SECTION */}
        <Grid
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ width: { xs: "80%", lg: "50%" } }}
        >
          <Box sx={{ width: { xs: "100%", md: "80%" } }}>
            {/* <img src={oneFrame} alt="oneFrame" /> */}
            <Typography variant="h2" fontWeight={600} mb={1}>
              EdwSurf AI Studio
            </Typography>
            <Typography variant="h4" fontWeight={600} mb={1}>
              Account Login
            </Typography>

            <Typography color="text.secondary" variant="body1" mb={3}>
              Enter your login details to continue
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="body2" fontWeight={600}>
                Email ID
              </Typography>

              <TextField
                fullWidth
                size="small"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="dense"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",

                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 100px var(--dark-color) inset",
                      // WebkitTextFillColor: "#000",
                      transition: "background-color 5000s ease-in-out 0s",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          edge="end"
                          sx={{ pointerEvents: "none" }}
                        >
                          {/* <img src={mailIcon} alt="mailIcon" /> */}
                          <MailLockIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Typography variant="body2" mt={2} fontWeight={600}>
                Password
              </Typography>

              <TextField
                fullWidth
                size="small"
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="dense"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",

                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 100px var(--dark-color) inset",
                      // WebkitTextFillColor: "#000",
                      transition: "background-color 5000s ease-in-out 0s",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff
                              sx={{ fontSize: 20 }}
                            />
                          ) : (
                            <Visibility
                              sx={{ fontSize: 20 }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <ButtonComp
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  py: 1,
                  // borderRadius: 2,
                  textTransform: "none",
                  fontSize: 16,
                  // backgroundColor: "#239DE0",
                }}
                type="submit"
                disabled={authLoader}
              >
                Log in
              </ButtonComp>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT SECTION (lg+) */}
        <Grid
          item
          display={{ xs: "none", lg: "block" }}
          height="100vh"
          sx={{ width: "50%" }}
        >
          <img
            src={Surfai_Video_Studio_Icon}
            alt="login"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
