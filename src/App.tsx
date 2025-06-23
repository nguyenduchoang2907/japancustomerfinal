// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "@/context/NotificationContext";
import { VipProvider } from "@/context/VipContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import { LanguageProvider } from "@/context/LanguageContext";
import AppRoutes from "@/routes/AppRoutes";

const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider store={store}>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <NotificationProvider>
            <VipProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </TooltipProvider>
            </VipProvider>
          </NotificationProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ReduxProvider>
);

export default App;
