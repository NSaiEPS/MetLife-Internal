import { toast } from "react-toastify";

export const showToast = {
  success: (msg) =>
    toast.success(msg, {
      style: {
        background: "linear-gradient(45deg, #43a047, #66bb6a)",
        color: "#fff",
        fontWeight: 500,
        borderRadius: "8px",
      },
    }),
  error: (msg) =>
    toast.error(msg, {
      style: {
        background: "linear-gradient(45deg, #e53935, #ef5350)",
        color: "#fff",
        fontWeight: 500,
        borderRadius: "8px",
      },
    }),
  warning: (msg) =>
    toast.warn(msg, {
      style: {
        background: "linear-gradient(45deg, #f57c00, #ffb300)",
        color: "#fff",
        fontWeight: 500,
        borderRadius: "8px",
      },
    }),
  info: (msg) =>
    toast.info(msg, {
      style: {
        background: "linear-gradient(45deg, #1e88e5, #42a5f5)",
        color: "#fff",
        fontWeight: 500,
        borderRadius: "8px",
      },
    }),
};
