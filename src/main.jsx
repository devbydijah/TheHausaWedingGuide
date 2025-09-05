import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Success from "./success.jsx";
import AdminPanel from "./AdminPanel.jsx";

function Router() {
  const path = window.location.pathname;

  if (path === "/success") return <Success />;
  if (path === "/admin") return <AdminPanel />;
  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
