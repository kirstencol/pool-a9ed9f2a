
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome"; // Import Welcome directly to avoid lazy loading for index route

// Lazy load page components to improve initial load time
const ProposeTime = lazy(() => import("./pages/ProposeTime"));
const TimeConfirmation = lazy(() => import("./pages/TimeConfirmation"));
const SelectUser = lazy(() => import("./pages/SelectUser"));
const RespondToInvite = lazy(() => import("./pages/RespondToInvite"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const SelectLocation = lazy(() => import("./pages/SelectLocation"));
const LocationConfirmation = lazy(() => import("./pages/LocationConfirmation"));
const FinalConfirmation = lazy(() => import("./pages/FinalConfirmation"));
const AddToCalendar = lazy(() => import("./pages/AddToCalendar"));
const CarrieFlow = lazy(() => import("./pages/CarrieFlow"));
const CarrieSelectLocation = lazy(() => import("./pages/CarrieSelectLocation"));
const CarrieConfirmation = lazy(() => import("./pages/CarrieConfirmation"));
const CarrieTimeConfirmation = lazy(() => import("./pages/CarrieTimeConfirmation"));
const AbbyLocationResponse = lazy(() => import("./pages/AbbyLocationResponse"));
const BurtLocationConfirmation = lazy(() => import("./pages/BurtLocationConfirmation"));
const BurtConfirmed = lazy(() => import("./pages/BurtConfirmed"));

// Create QueryClient outside component to prevent recreation on render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Improves performance by not refetching on window focus
      retry: 1, // Limit retries to improve performance on failing requests
    },
  },
});

const App = () => {
  console.log("App component rendering"); // Add debug log
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route 
                path="*" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                    <Routes>
                      <Route path="/propose-time" element={<ProposeTime />} />
                      <Route path="/time-confirmation" element={<TimeConfirmation />} />
                      <Route path="/select-user" element={<SelectUser />} />
                      <Route path="/respond/:inviteId" element={<RespondToInvite />} />
                      <Route path="/confirmation" element={<Confirmation />} />
                      <Route path="/respond" element={<Navigate to="/select-user" replace />} />
                      <Route path="/select-location" element={<SelectLocation />} />
                      <Route path="/location-confirmation" element={<LocationConfirmation />} />
                      <Route path="/final-confirmation" element={<FinalConfirmation />} />
                      <Route path="/add-to-calendar" element={<AddToCalendar />} />
                      
                      {/* Carrie's flow routes */}
                      <Route path="/carrie-flow" element={<CarrieFlow />} />
                      <Route path="/carrie-time-confirmation" element={<CarrieTimeConfirmation />} />
                      <Route path="/carrie-select-location" element={<CarrieSelectLocation />} />
                      <Route path="/carrie-confirmation" element={<CarrieConfirmation />} />
                      
                      {/* Abby's location response flow */}
                      <Route path="/abby-location-response" element={<AbbyLocationResponse />} />
                      
                      {/* Burt's location confirmation flow */}
                      <Route path="/burt-location-confirmation" element={<BurtLocationConfirmation />} />
                      <Route path="/burt-confirmed" element={<BurtConfirmed />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
