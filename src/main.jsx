import React from "react";
import { createRoot } from "react-dom/client";
import { PublicPage } from "./pages/PublicPage.jsx";

createRoot(document.getElementById("root")).render(<React.StrictMode><PublicPage/></React.StrictMode>);