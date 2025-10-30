import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { UserPlus, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export function UserSelector() {
  const [, setLocation] = useLocation();
  
  const { data: currentUser } = useQuery<{ user: User | null }>({
    queryKey: ["/api/auth/current-user"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const setUserMutation = useMutation({
    mutationFn: async (userId: string | null) => {
      const response = await fetch("/api/auth/set-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current-user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/discover"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    },
  });

  if (currentUser?.user) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.02, 0.04, 0.02]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-secondary rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="p-10 shadow-soft border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl" />
                <div className="relative bg-gradient-to-br from-primary to-secondary p-4 rounded-xl shadow-card">
                  <span className="text-white font-bold text-4xl">I</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-3 tracking-tight">
              Imperfectos
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Comparte tus defectos de personalidad y físicos
            </p>
          </motion.div>

          {/* Lista de usuarios */}
          {users.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-border" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Continuar como
                </p>
                <div className="h-px flex-1 bg-border" />
              </div>
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="p-4 cursor-pointer hover:shadow-card transition-all border border-border/50 hover:border-primary/30 bg-white/50 rounded-xl"
                    onClick={() => setUserMutation.mutate(user.id)}
                    data-testid={`card-user-${user.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-border">
                        <AvatarFallback className="text-base font-semibold bg-gradient-to-br from-primary to-secondary text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">{user.name}, {user.age}</p>
                        {user.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{user.bio}</p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Botón crear perfil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: users.length > 0 ? 0.6 : 0.4 }}
          >
            <Button
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary border-0 shadow-card hover:shadow-romantic transition-all rounded-xl"
              onClick={() => setLocation("/create-profile")}
              data-testid="button-create-new-profile"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Crear Nuevo Perfil
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
