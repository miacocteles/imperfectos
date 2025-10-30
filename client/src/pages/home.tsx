import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileCard } from "@/components/profile-card";
import { ProfileDetailView } from "@/components/profile-detail-view";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Compass } from "lucide-react";
import type { ProfileCard as ProfileCardType, ProfileWithDetails } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  // Fetch profiles for discovery
  const { data: profiles = [], isLoading } = useQuery<ProfileCardType[]>({
    queryKey: ["/api/profiles/discover"],
  });

  // Fetch detailed profile
  const { data: detailedProfile } = useQuery<ProfileWithDetails>({
    queryKey: ["/api/profiles", selectedProfileId],
    enabled: !!selectedProfileId,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (profileId: string): Promise<{ isMatch: boolean; matchId?: string }> => {
      const response = await apiRequest("POST", "/api/likes", { toUserId: profileId });
      return await response.json();
    },
    onSuccess: (data: { isMatch: boolean; matchId?: string }) => {
      if (data.isMatch) {
        toast({
          title: "¡Es un Match!",
          description: "Ambos están interesados. ¡Conéctense!",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      } else {
        toast({
          title: "Like enviado",
          description: "Si hay interés mutuo, te notificaremos",
        });
      }
      handleNext();
    },
  });

  const handleLike = (profileId: string) => {
    likeMutation.mutate(profileId);
  };

  const handlePass = () => {
    handleNext();
  };

  const handleNext = () => {
    setSelectedProfileId(null);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleProfileClick = (profileId: string) => {
    setSelectedProfileId(profileId);
  };

  const handleBack = () => {
    setSelectedProfileId(null);
  };

  // Show detailed view if profile is selected
  if (selectedProfileId && detailedProfile) {
    return (
      <ProfileDetailView
        profile={detailedProfile}
        compatibilityScore={profiles.find(p => p.id === selectedProfileId)?.compatibilityScore}
        onLike={() => handleLike(selectedProfileId)}
        onPass={handlePass}
        onBack={handleBack}
        showActions={true}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="space-y-6">
            <Skeleton className="aspect-[3/4] rounded-2xl shadow-card" />
            <div className="flex justify-center gap-6">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="w-16 h-16 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // No profiles available
  if (profiles.length === 0) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-card flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Próximamente nuevos perfiles
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Vuelve pronto para descubrir personas auténticas que celebran sus imperfecciones
          </p>
        </motion.div>
      </div>
    );
  }

  // No more profiles to show
  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-card flex items-center justify-center">
              <span className="text-5xl">✓</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Has visto todos los perfiles
          </h2>
          <p className="text-muted-foreground text-base mb-6 leading-relaxed">
            Revisa tus matches o vuelve mañana para más conexiones auténticas
          </p>
        </motion.div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header minimalista */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 glass border-b border-border/50"
      >
        <div className="container max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Descubrir</h1>
            </div>
            <motion.p 
              key={`counter-${currentIndex}`}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm text-muted-foreground font-medium"
            >
              {profiles.length - currentIndex} disponibles
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Área de perfil */}
      <div className="container max-w-md mx-auto px-4 py-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <ProfileCard
              profile={currentProfile}
              onLike={handleLike}
              onPass={handlePass}
              onClick={handleProfileClick}
              showActions={true}
            />
          </motion.div>
        </AnimatePresence>

        {/* Indicador de progreso */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex justify-center gap-1.5"
        >
          {profiles.slice(currentIndex, currentIndex + 5).map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === 0 
                  ? 'w-8 bg-primary' 
                  : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
