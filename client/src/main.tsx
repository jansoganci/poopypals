import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { PoopProvider } from "@/context/PoopContext";

createRoot(document.getElementById("root")!).render(
  <PoopProvider>
    <App />
  </PoopProvider>
);
