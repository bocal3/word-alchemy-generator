
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Recherche from "./pages/Recherche";
import Dictionnaires from "./pages/Dictionnaires";
import DictionnaireDetail from "./pages/DictionnaireDetail";
import CreerDictionnaire from "./pages/CreerDictionnaire";
import Configuration from "./pages/Configuration";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

// Update title
document.title = "Psum - Générateur de texte";

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recherche" element={<Recherche />} />
            <Route path="/dictionnaires" element={<Dictionnaires />} />
            <Route path="/dictionnaire/:id" element={<DictionnaireDetail />} />
            <Route path="/creer-dictionnaire" element={<CreerDictionnaire />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
