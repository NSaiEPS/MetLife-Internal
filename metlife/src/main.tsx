// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
// import { createTheme, ThemeProvider } from "@mui/material";
// import ErrorBoundary from "./Pages/PageNotFound/ErrorPage";

// const rootElement = document.getElementById("root");

// const theme = createTheme({
//   typography: {
//     // Default body font
//     fontFamily: "Metlife_Circular, Noto_Sans, Arial, sans-serif",

//     // Headings
//     h1: {
//       fontFamily: "Metlife_Circular, Noto_Sans, sans-serif",
//       color: "#333333",
//       fontWeight: 600,
//     },
//     h2: {
//       fontFamily: "Metlife_Circular, Noto_Sans, sans-serif",
//       color: "#333333",
//       fontWeight: 600,
//     },
//     h3: {
//       fontFamily: "Metlife_Circular, Noto_Sans, sans-serif",
//       color: "#333333",
//       fontWeight: 600,
//     },
//     h4: {
//       fontFamily: "Metlife_Circular, Noto_Sans, sans-serif",
//       color: "#333333",
//       fontWeight: 600,
//     },
//     h5: {
//       fontFamily: "Metlife_Circular, Noto_Sans, sans-serif",
//       color: "#333333",
//       fontWeight: 600,
//     },
//     h6: {
//       fontFamily: "Noto_Sans,Metlife_Circular, sans-serif",
//       color: "#333333",
//       fontWeight: 600,
//     },

//     // Subheadings
//     subtitle1: {
//       fontFamily: "Noto_Sans, sans-serif",
//       fontWeight: 500,

//       color: "#333333",
//     },
//     subtitle2: {
//       fontFamily: "Noto_Sans, sans-serif",
//       fontWeight: 500,
//       color: "#555555",
//     },

//     // Body text
//     body1: {
//       fontFamily: "Noto_Sans, sans-serif",
//       color: "#333333",
//     },
//     body2: {
//       fontFamily: "Noto_Sans, sans-serif",
//       color: "#555555",
//     },
//   },
//   components: {
//     MuiDialogTitle: {
//       styleOverrides: {
//         root: {
//           fontFamily: "Metlife_Circular, Noto_Sans, sans-serif",
//           fontWeight: 600,
//           fontSize: "1.25rem", // optional
//           color: "#333333",
//         },
//       },
//     },
//   },
// });

// if (rootElement) {
//   const root = createRoot(rootElement);
//   root.render(
//     <StrictMode>
//       <Provider store={store}>
//         <ThemeProvider theme={theme}>
//           <App />
//         </ThemeProvider>
//       </Provider>
//     </StrictMode>,
//   );
// }


import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

function Root() {

  const [mode, setMode] = useState<any>(
    localStorage.getItem("theme") || "light"
  );

  const toggleTheme = () => {
    const newTheme = mode === "light" ? "dark" : "light";
    setMode(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: mode,
        ...(mode === "light"
          ? {
            background: {
              default: "#ffffff",
              paper: "#ffffff",
            },
          }
          : {
            background: {
              default: "#000000",
              paper: "#000000",
            },
          }),
      },

      typography: {
        fontFamily: "Metlife_Circular, Noto_Sans, Arial, sans-serif",
        h1: {
          fontWeight: 600,
        },
        h2: {
          fontWeight: 600,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 600,
        },
        h6: {
          fontWeight: 600,
        },

        body1: {
          fontFamily: "Noto_Sans, sans-serif",
        },
        body2: {
          fontFamily: "Noto_Sans, sans-serif",
        },
      },

      components: {
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              fontFamily: "Metlife_Circular, Noto_Sans, sans-serif",
              fontWeight: 600,
              fontSize: "1.25rem",
            },
          },
        },
      },
    }),
    [mode]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App mode={mode} setMode={toggleTheme} />
      </ThemeProvider>
    </Provider>
  );
}

const rootElement: any = document.getElementById("root");

createRoot(rootElement).render(
  <StrictMode>
    <Root />
  </StrictMode>
);