import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import VendorDetails from "./pages/VendorDetails";
import MyInquiries from "./pages/MyInquiries";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/vendor/:id"} component={VendorDetails} />
      <Route path={"/my-inquiries"} component={MyInquiries} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
