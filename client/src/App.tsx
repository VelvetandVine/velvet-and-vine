import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import VendorDetails from "./pages/VendorDetails";
import MyInquiries from "./pages/MyInquiries";

type Page = "home" | "marketplace" | "vendor" | "inquiries";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);

  const handleNavigate = (page: Page, vendorId?: number) => {
    setCurrentPage(page);
    if (vendorId) {
      setSelectedVendorId(vendorId);
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-background text-foreground">
            {currentPage === "home" && (
              <Home onNavigate={handleNavigate} />
            )}
            {currentPage === "marketplace" && (
              <Marketplace onNavigate={handleNavigate} />
            )}
            {currentPage === "vendor" && selectedVendorId && (
              <VendorDetails 
                vendorId={selectedVendorId} 
                onNavigate={handleNavigate}
              />
            )}
            {currentPage === "inquiries" && (
              <MyInquiries onNavigate={handleNavigate} />
            )}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
