import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { PoopProvider } from "@/context/PoopContext";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light">
    <PoopProvider>
      <App />
    </PoopProvider>
  </ThemeProvider>
);
