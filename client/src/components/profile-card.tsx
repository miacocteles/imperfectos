import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Combinar fotos de perfil con fotos de defectos
  const profilePhotos = profile.allPhotos.length > 0 ? profile.allPhotos : (profile.primaryPhoto ? [profile.primaryPhoto] : []);
  const defectPhotos = profile.defectPhotos || [];
  const allPhotos = [...profilePhotos, ...defectPhotos];
  const defectStartIndex = profilePhotos.length; // Índice donde empiezan las fotos de defectos
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si se hace clic en los lados, cambiar foto
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;
    
    if (x < third && currentPhotoIndex > 0) {
      e.stopPropagation();
      setCurrentPhotoIndex(prev => prev - 1);
      return;
    }
    
    if (x > third * 2 && currentPhotoIndex < allPhotos.length - 1) {
      e.stopPropagation();
      setCurrentPhotoIndex(prev => prev + 1);
      return;
    }
    
    // Si se hace clic en el centro, abrir detalle
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
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        <Card 
          className="overflow-hidden cursor-pointer border-2 border-primary/20 shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 rounded-3xl bg-white card-3d"
          data-testid={`card-profile-${profile.id}`}
        >
          <div 
            className="relative aspect-[3/4] bg-gradient-to-br from-muted/30 to-muted/10"
            onClick={handleCardClick}
          >
            {allPhotos.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhotoIndex}
                    src={allPhotos[currentPhotoIndex]}
                    alt={`${profile.name}, ${profile.age}`}
                    className={`w-full h-full object-cover ${
                      currentPhotoIndex >= defectStartIndex ? 'ring-4 ring-red-500 ring-inset' : ''
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
                
                {/* Indicadores de foto */}
                {allPhotos.length > 1 && (
                  <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 px-2 z-10">
                    {allPhotos.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          index === currentPhotoIndex
                            ? index >= defectStartIndex ? 'bg-red-500' : 'bg-white'
                            : index >= defectStartIndex ? 'bg-red-500/40' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <span className="text-4xl">📷</span>
                </div>
                <p className="text-sm font-medium">Aún sin fotos</p>
              </div>
            )}
            
            {/* Gradient overlay profesional */}
            <div className="absolute inset-0 gradient-overlay" />

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

              {/* Badge de compatibilidad - muy pequeño al final */}
              {profile.compatibilityScore !== undefined && (
                <div className="mt-2 flex items-center gap-1 text-[10px] opacity-60">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>{profile.compatibilityScore}%</span>
                </div>
              )}
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
              size="lg"
              variant="outline"
              className="h-14 px-6 rounded-full shadow-lg border-2 border-destructive/40 hover:border-destructive hover:bg-destructive/10 transition-all text-base"
              onClick={handlePass}
              data-testid={`button-pass-${profile.id}`}
            >
              <X className="w-5 h-5 mr-2 text-destructive" />
              Pasar
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="lg"
              className="h-14 px-8 rounded-full shadow-xl bg-gradient-to-br from-primary via-secondary to-accent border-0 hover:shadow-2xl transition-all text-base font-semibold"
              onClick={handleLike}
              data-testid={`button-like-${profile.id}`}
            >
              Me interesa
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
