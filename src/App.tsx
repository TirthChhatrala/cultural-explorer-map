
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Header from "./components/Header";
import AdminHeader from "./components/AdminHeader";

const queryClient = new QueryClient();

const HeaderWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  
  if (isAdminRoute) {
    return <AdminHeader />;
  }
  
  return <Header />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <HeaderWrapper />
        <Toaster />
        <Sonner />
        <AppRoutes />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
