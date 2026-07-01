import React from "react";
import { createRoot } from "react-dom/client";
import GranaControl from "./GranaControl.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GranaControl />
  </React.StrictMode>
);
