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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center space-y-4">
          <div className="inline-block">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Healthcare Solutions</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gradient">Medical Insurance Estimator</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Instant, accurate insurance cost estimates powered by advanced calculations</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={currentTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md">
            <TabsTrigger value="home" asChild className="transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md">
              <Link to="/home">Home</Link>
            </TabsTrigger>
            <TabsTrigger value="estimate" asChild className="transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md">
              <Link to="/estimate">Estimate</Link>
            </TabsTrigger>
            <TabsTrigger value="voice" asChild className="transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md">
              <Link to="/voice">Voice Assistant</Link>
            </TabsTrigger>
            <TabsTrigger value="educate" asChild className="transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md">
              <Link to="/educate">Educate</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Routes */}
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/estimate" element={<Estimate />} />
            <Route path="/voice" element={<VoiceAssistant />} />
            <Route path="/educate" element={<Educate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center text-muted-foreground text-sm">
            <p>All calculations are performed locally in your browser for maximum privacy and security.</p>
            <p className="mt-2 text-xs">© 2026 Medical Insurance Estimator. All rights reserved.</p>
          </div>
        </div>
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
