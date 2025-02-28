
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Welcome from "./pages/Welcome";
import ProposeTime from "./pages/ProposeTime";
import TimeConfirmation from "./pages/TimeConfirmation";
import RespondToInvite from "./pages/RespondToInvite";
import SelectLocation from "./pages/SelectLocation";
import LocationConfirmation from "./pages/LocationConfirmation";
import FinalConfirmation from "./pages/FinalConfirmation";
import AddToCalendar from "./pages/AddToCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/propose-time" element={<ProposeTime />} />
            <Route path="/time-confirmation" element={<TimeConfirmation />} />
            <Route path="/respond/:inviteId" element={<RespondToInvite />} />
            <Route path="/select-location" element={<SelectLocation />} />
            <Route path="/location-confirmation" element={<LocationConfirmation />} />
            <Route path="/final-confirmation" element={<FinalConfirmation />} />
            <Route path="/add-to-calendar" element={<AddToCalendar />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
