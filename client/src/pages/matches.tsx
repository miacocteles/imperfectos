import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MatchListItem } from "@/components/match-list-item";
import { ProfileDetailView } from "@/components/profile-detail-view";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Users, PartyPopper } from "lucide-react";
import type { MatchWithProfile, ProfileWithDetails } from "@shared/schema";

export default function Matches() {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // Fetch matches
  const { data: matches = [], isLoading } = useQuery<MatchWithProfile[]>({
    queryKey: ["/api/matches"],
  });

  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  // Show detailed view if match is selected
  if (selectedMatch) {
    const detailedProfile: ProfileWithDetails = {
      ...selectedMatch.otherUser,
      photos: selectedMatch.otherUserPhotos,
      defects: selectedMatch.otherUserDefects,
    };

    return (
      <ProfileDetailView
        profile={detailedProfile}
        compatibilityScore={selectedMatch.compatibilityScore}
        sharedDefects={selectedMatch.sharedDefects}
        onBack={() => setSelectedMatchId(null)}
        showActions={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container max-w-2xl mx-auto px-4 py-8 pb-32">
        {/* Header con animación */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <div className="absolute inset-0 gradient-romantic rounded-full opacity-30 blur-2xl" />
              <PartyPopper className="relative w-16 h-16 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold mb-2 text-gradient">
            Tus Matches
          </h1>
          <p className="text-lg text-muted-foreground">
            {matches.length === 0 
              ? "Aún no tienes conexiones" 
              : `${matches.length} ${matches.length === 1 ? 'persona especial' : 'personas especiales'} te esperan ✨`
            }
          </p>
        </motion.div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-32 rounded-3xl shadow-lg" />
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && matches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center py-16">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-8"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 gradient-romantic rounded-full opacity-20 blur-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl">✓</span>
                  </div>
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold mb-4 text-gradient">
                ¡Tu primera conexión está cerca!
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                Sigue descubriendo perfiles auténticos. Encuentra a alguien que celebre tus imperfecciones
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Las mejores conexiones valen la pena</span>
              </div>
            </div>
          </motion.div>
        )}

        {!isLoading && matches.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4" 
            data-testid="list-matches"
          >
            <AnimatePresence>
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MatchListItem
                    match={match}
                    onClick={() => setSelectedMatchId(match.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
