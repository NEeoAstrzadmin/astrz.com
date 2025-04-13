import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set title
document.title = "Astrz Combat Tier List";

createRoot(document.getElementById("root")!).render(<App />);
