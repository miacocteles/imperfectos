import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, X, TrendingUp, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { ProfileCard as ProfileCardType } from "@shared/schema";

interface ProfileCardProps {
  profile: ProfileCardType;
  onLike?: (profileId: string) => void;
  onPass?: (profileId: string) => void;
  onClick?: (profileId: string) => void;
  showActions?: boolean;
}

export function ProfileCard({ 
  profile, 
  onLike, 
  onPass, 
  onClick,
  showActions = true 
}: ProfileCardProps) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(profile.id);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike(profile.id);
    }
  };

  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPass) {
      onPass(profile.id);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          className="overflow-hidden cursor-pointer border border-border/50 shadow-card hover:shadow-romantic transition-all duration-300 rounded-2xl bg-white"
          onClick={handleCardClick}
          data-testid={`card-profile-${profile.id}`}
        >
          <div className="relative aspect-[3/4] bg-gradient-to-br from-muted/30 to-muted/10">
            {profile.primaryPhoto ? (
              <img 
                src={profile.primaryPhoto} 
                alt={`${profile.name}, ${profile.age}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <Heart className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">Aún sin fotos</p>
              </div>
            )}
            
            {/* Gradient overlay profesional */}
            <div className="absolute inset-0 gradient-overlay" />
            
            {/* Badge de compatibilidad profesional */}
            {profile.compatibilityScore !== undefined && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute top-4 right-4"
              >
                <Badge 
                  className="rounded-full px-3.5 py-2 text-sm font-bold shadow-lg bg-white/95 text-primary border-0 backdrop-blur-sm"
                  data-testid={`badge-compatibility-${profile.id}`}
                >
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5 inline" />
                  {profile.compatibilityScore}%
                </Badge>
              </motion.div>
            )}

            {/* Botón info minimalista */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-4 left-4"
            >
              <div className="bg-white/90 rounded-full p-2 backdrop-blur-sm shadow-sm">
                <Info className="w-4 h-4 text-foreground" />
              </div>
            </motion.div>
            
            {/* Profile info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="space-y-2.5">
                <div>
                  <h3 className="text-2xl font-bold mb-1 drop-shadow-md" data-testid={`text-name-${profile.id}`}>
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-sm font-medium opacity-95 flex items-center gap-1.5" data-testid={`text-defect-count-${profile.id}`}>
                    <Heart className="w-3.5 h-3.5" />
                    {profile.defectCount} {profile.defectCount === 1 ? 'defecto compartido' : 'defectos compartidos'}
                  </p>
                </div>
                
                {profile.topDefects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.topDefects.slice(0, 3).map((defect, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="text-xs font-medium glass-dark backdrop-blur-sm text-white border-white/20 py-1 px-2.5"
                        data-testid={`badge-defect-${profile.id}-${index}`}
                      >
                        {defect}
                      </Badge>
                    ))}
                    {profile.topDefects.length > 3 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-medium glass-dark backdrop-blur-sm text-white border-white/20 py-1 px-2.5"
                      >
                        +{profile.topDefects.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action buttons profesionales */}
      {showActions && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              variant="outline"
              className="w-16 h-16 rounded-full shadow-card border-2 border-border hover:border-destructive/30 hover:bg-destructive/5 transition-all"
              onClick={handlePass}
              data-testid={`button-pass-${profile.id}`}
            >
              <X className="w-7 h-7 text-destructive" />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              className="w-20 h-20 rounded-full shadow-romantic bg-gradient-to-br from-primary to-secondary border-0 hover:shadow-card transition-all"
              onClick={handleLike}
              data-testid={`button-like-${profile.id}`}
            >
              <Heart className="w-8 h-8" />
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Hint sutil */}
      {showActions && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground"
        >
          Toca para ver el perfil completo
        </motion.p>
      )}
    </div>
  );
}
