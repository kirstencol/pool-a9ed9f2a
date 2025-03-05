
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/NotFound";

// Lazy load page components to improve initial load time
const Welcome = lazy(() => import("./pages/Welcome"));
const ProposeTime = lazy(() => import("./pages/ProposeTime"));
const TimeConfirmation = lazy(() => import("./pages/TimeConfirmation"));
const SelectUser = lazy(() => import("./pages/SelectUser")); // New component
const RespondToInvite = lazy(() => import("./pages/RespondToInvite"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const SelectLocation = lazy(() => import("./pages/SelectLocation"));
const LocationConfirmation = lazy(() => import("./pages/LocationConfirmation"));
const FinalConfirmation = lazy(() => import("./pages/FinalConfirmation"));
const AddToCalendar = lazy(() => import("./pages/AddToCalendar"));
const CarrieFlow = lazy(() => import("./pages/CarrieFlow")); // New component for Carrie's flow

// Create QueryClient outside component to prevent recreation on render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Improves performance by not refetching on window focus
      retry: 1, // Limit retries to improve performance on failing requests
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/propose-time" element={<ProposeTime />} />
              <Route path="/time-confirmation" element={<TimeConfirmation />} />
              <Route path="/select-user" element={<SelectUser />} />
              <Route path="/respond/:inviteId" element={<RespondToInvite />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/carrie" element={<CarrieFlow />} /> {/* New Route for Carrie's flow */}
              {/* Redirect direct respond routes to the select-user page first */}
              <Route path="/respond" element={<Navigate to="/select-user" replace />} />
              <Route path="/select-location" element={<SelectLocation />} />
              <Route path="/location-confirmation" element={<LocationConfirmation />} />
              <Route path="/final-confirmation" element={<FinalConfirmation />} />
              <Route path="/add-to-calendar" element={<AddToCalendar />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
