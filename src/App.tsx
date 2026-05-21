import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { Toaster } from "@/components/ui/sonner";
import { ProgressProvider } from "@/contexts/progress-context";

export default function App() {
  return (
    <Router>
      <ProgressProvider>
        <AppRouter />
        <Toaster position="bottom-right" richColors />
      </ProgressProvider>
    </Router>
  );
}
