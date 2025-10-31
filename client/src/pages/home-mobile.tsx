import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileCard } from "@/components/profile-card";
import { ProfileDetailView } from "@/components/profile-detail-view";
import { EmptyState } from "@/components/empty-state";
import { Heart, X, RotateCcw, Info } from "lucide-react";
import type { ProfileCard as ProfileCardType, ProfileWithDetails } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  const { data: profiles = [], isLoading } = useQuery<ProfileCardType[]>({
    queryKey: ["/api/profiles/discover"],
  });

  const { data: detailedProfile } = useQuery<ProfileWithDetails>({
    queryKey: ["/api/profiles", selectedProfileId],
    enabled: !!selectedProfileId,
  });

  const likeMutation = useMutation({
    mutationFn: async (profileId: string): Promise<{ isMatch: boolean; matchId?: string }> => {
      const response = await apiRequest("POST", "/api/likes", { toUserId: profileId });
      return await response.json();
    },
    onSuccess: (data: { isMatch: boolean; matchId?: string }) => {
      if (data.isMatch) {
        toast({
          title: "¡Es un Match! 💕",
          description: "Ambos están interesados",
          duration: 3000,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      }
      handleNext();
    },
  });

  const passMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const response = await fetch("/api/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: profileId }),
      });
      if (!response.ok) throw new Error("Failed to pass profile");
      return response.json();
    },
    onSuccess: () => {
      handleNext();
    },
  });

  const handleLike = (profileId: string) => {
    likeMutation.mutate(profileId);
  };

  const handlePass = () => {
    const currentProfile = profiles[currentIndex];
    if (currentProfile) {
      passMutation.mutate(currentProfile.id);
    } else {
      handleNext();
    }
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

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfiles...</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-pink-50 to-rose-50 flex items-center justify-center p-6">
        <EmptyState
          icon={RotateCcw}
          title="No hay más perfiles"
          description="Ya viste todos los perfiles disponibles. ¡Vuelve más tarde!"
        />
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  return (
    <div className="h-screen w-full bg-gradient-to-b from-pink-50 to-rose-50 flex flex-col overflow-hidden">
      {/* Header - Mobile optimized */}
      <div className="flex-none p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imperfectos</h1>
          <p className="text-xs text-gray-500">{profiles.length - currentIndex} personas cerca</p>
        </div>
      </div>

      {/* Cards Stack - Tinder Style */}
      <div className="flex-1 relative px-4 py-6">
        <div className="relative w-full h-full max-w-md mx-auto">
          <AnimatePresence>
            {/* Next card (background) */}
            {nextProfile && (
              <div key={`next-${nextProfile.id}`} className="absolute inset-0">
                <ProfileCard
                  profile={nextProfile}
                  isTop={false}
                  showActions={false}
                />
              </div>
            )}

            {/* Current card (foreground) */}
            {currentProfile && (
              <div key={`current-${currentProfile.id}`} className="absolute inset-0">
                <ProfileCard
                  profile={currentProfile}
                  onLike={handleLike}
                  onPass={handlePass}
                  onClick={handleProfileClick}
                  isTop={true}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons - Mobile Optimized */}
      <div className="flex-none pb-safe">
        <div className="flex items-center justify-center gap-6 p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
          {/* Botón Pass */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePass}
            className="w-16 h-16 rounded-full bg-white shadow-xl border-2 border-red-500 flex items-center justify-center active:shadow-lg transition-shadow"
            aria-label="Pasar"
          >
            <X className="w-8 h-8 text-red-500 stroke-[3]" />
          </motion.button>

          {/* Botón Info */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => currentProfile && handleProfileClick(currentProfile.id)}
            className="w-12 h-12 rounded-full bg-white shadow-lg border-2 border-blue-400 flex items-center justify-center active:shadow-md transition-shadow"
            aria-label="Ver más información"
          >
            <Info className="w-5 h-5 text-blue-500" />
          </motion.button>

          {/* Botón Like */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => currentProfile && handleLike(currentProfile.id)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-xl flex items-center justify-center active:shadow-lg transition-shadow"
            aria-label="Me gusta"
          >
            <Heart className="w-8 h-8 text-white fill-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
