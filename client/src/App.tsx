import { Switch, Route, useLocation, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Heart, Compass, UserPlus, Home as HomeIcon } from "lucide-react";
import { UserSelector } from "@/components/user-selector";
import { motion } from "framer-motion";
import Home from "@/pages/home";
import Matches from "@/pages/matches";
import CreateProfile from "@/pages/create-profile";
import NotFound from "@/pages/not-found";
import type { User } from "@shared/schema";

function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Descubrir", icon: Compass },
    { path: "/matches", label: "Matches", icon: Heart },
    { path: "/create-profile", label: "Perfil", icon: UserPlus },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 md:hidden z-50 shadow-lg">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center gap-1 h-auto py-2.5 px-5 rounded-xl transition-all ${
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  data-testid={`nav-${item.path.replace("/", "") || "home"}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                  <span className={`text-xs ${isActive ? "font-semibold" : "font-medium"}`}>
                    {item.label}
                  </span>
                </Button>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function DesktopHeader() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Descubrir" },
    { path: "/matches", label: "Matches" },
    { path: "/create-profile", label: "Crear Perfil" },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-50 glass border-b border-border/50 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 cursor-pointer" 
            data-testid="link-logo"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Imperfectos</span>
          </motion.div>
        </Link>

        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`text-sm font-medium ${
                    isActive 
                      ? "bg-gradient-to-r from-primary to-secondary border-0 shadow-sm" 
                      : "hover:bg-muted"
                  }`}
                  data-testid={`nav-${item.path.replace("/", "") || "home"}`}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/matches" component={Matches} />
      <Route path="/create-profile" component={CreateProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { data: currentUser, isLoading } = useQuery<{ user: User | null }>({
    queryKey: ["/api/auth/current-user"],
  });

  const [location] = useLocation();
  const isCreatingProfile = location === "/create-profile";

  // Show user selector if no current user and not creating profile
  if (!isLoading && !currentUser?.user && !isCreatingProfile) {
    return <UserSelector />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopHeader />
      
      <main className="pb-20 md:pb-0">
        <Router />
      </main>

      <Navigation />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
