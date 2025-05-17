
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BecomeDonorPage from "./pages/BecomeDonorPage";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalPartners from "./pages/HospitalPartners";
import HospitalDashboard from "./pages/HospitalDashboard";
import TrackDonationPage from "./pages/TrackDonationPage";
import SupportPage from "./pages/SupportPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/become-donor" element={<BecomeDonorPage />} />
                <Route path="/hospital-partners" element={<HospitalPartners />} />
                <Route path="/track-donation" element={<TrackDonationPage />} />
                <Route path="/support-us" element={<SupportPage />} />
                <Route path="/about" element={<AboutPage />} />
                
                {/* Protected routes for donor users */}
                <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
                  <Route path="/donor-dashboard" element={<DonorDashboard />} />
                </Route>
                
                {/* Protected routes for hospital staff and admin users */}
                <Route element={<ProtectedRoute allowedRoles={['hospital_staff', 'admin']} />}>
                  <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
                </Route>
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
