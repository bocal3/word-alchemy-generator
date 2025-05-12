
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
import ApiPage from "./pages/Api";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Update title based on language
    document.title = `${t('app.name')} - ${t('app.description')}`;
  }, [t]);

  return (
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
          
          {/* API Routes */}
          <Route path="/api/:lang/:dictionaries/:paragraphCount" element={<ApiPage />} />
          <Route path="/api/:lang/:dictionaries/:paragraphCount/:wordsRange" element={<ApiPage />} />
          <Route path="/api/:lang/:dictionaries/:paragraphCount/:wordsRange/:sentencesRange" element={<ApiPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="light">
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
