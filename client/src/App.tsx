import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Stats from "@/pages/Stats";
import Rewards from "@/pages/Rewards";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import Analytics from "@/pages/Analytics";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

function Router() {
  return (
    <div className="relative max-w-md mx-auto min-h-screen flex flex-col bg-background">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/stats" component={Stats} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/profile" component={Profile} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/analytics" component={Analytics} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
