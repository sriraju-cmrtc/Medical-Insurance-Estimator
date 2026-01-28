import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Home from "@/pages/Home";
import Estimate from "@/pages/Estimate";
import VoiceAssistant from "@/pages/VoiceAssistant";
import Educate from "@/pages/Educate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const currentTab = location.pathname.slice(1) || 'home';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Medical Insurance Estimator</h1>
          <p className="text-muted-foreground">Estimate insurance costs instantly in INR</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={currentTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="home" asChild>
              <Link to="/home">Home</Link>
            </TabsTrigger>
            <TabsTrigger value="estimate" asChild>
              <Link to="/estimate">Estimate</Link>
            </TabsTrigger>
            <TabsTrigger value="voice" asChild>
              <Link to="/voice">Voice Assistant</Link>
            </TabsTrigger>
            <TabsTrigger value="educate" asChild>
              <Link to="/educate">Educate</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/educate" element={<Educate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
