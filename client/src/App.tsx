import React, { useState, useEffect } from "react";
import { Switch, Route, useLocation, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Binoculars, Sparkles } from "lucide-react";
import { UserSelector } from "@/components/user-selector";
import { motion, AnimatePresence } from "framer-motion";
import Home from "@/pages/home";
import Matches from "@/pages/matches";
import CreateProfile from "@/pages/create-profile";
import NotFound from "@/pages/not-found";
import type { User } from "@shared/schema";

function Navigation() {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { path: "/", label: "Descubrir", icon: Binoculars },
    { path: "/matches", label: "Matches", icon: Sparkles },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 md:hidden z-40"
        >
          <div className="flex items-center justify-around h-14 px-4 pb-safe">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} href={item.path}>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl transition-all ${
                      isActive 
                        ? "text-rose-500" 
                        : "text-gray-400"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                    <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      {item.label}
                    </span>
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function DesktopHeader() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Descubrir" },
    { path: "/matches", label: "Matches" },
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
              <span className="text-white font-bold text-sm">I</span>
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

  const [location, setLocation] = useLocation();
  const isCreatingProfile = location === "/create-profile";

  // If there's no current user, redirect to the create profile page so
  // the visitor is prompted to register first instead of picking an
  // existing seeded user. We use useEffect to avoid triggering a
  // navigation during render.
  React.useEffect(() => {
    if (!isLoading && !currentUser?.user && !isCreatingProfile) {
      setLocation('/create-profile');
    }
  }, [isLoading, currentUser, isCreatingProfile, setLocation]);

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
