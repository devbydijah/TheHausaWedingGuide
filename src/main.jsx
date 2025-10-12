import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App.jsx";
import "./index.css";
import hausaTheme from "./theme/muiTheme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={hausaTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
