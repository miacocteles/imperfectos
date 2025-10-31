import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, X, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProfileWithDetails } from "@shared/schema";

interface ProfileDetailViewProps {
  profile: ProfileWithDetails;
  compatibilityScore?: number;
  sharedDefects?: string[];
  onLike?: () => void;
  onPass?: () => void;
  onBack?: () => void;
  showActions?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  emocional: "Emocional",
  fisico: "Físico",
  personalidad: "Personalidad",
  habitos: "Hábitos",
};

export function ProfileDetailView({
  profile,
  compatibilityScore,
  sharedDefects = [],
  onLike,
  onPass,
  onBack,
  showActions = true,
}: ProfileDetailViewProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const validatedPhotos = profile.photos.filter(p => p.isValidated);
  const hasMultiplePhotos = validatedPhotos.length > 1;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % validatedPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? validatedPhotos.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1" />
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Photo Gallery */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
              {validatedPhotos.length > 0 ? (
                <img
                  src={validatedPhotos[currentPhotoIndex].url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  data-testid="img-profile-photo"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Sin fotos validadas
                </div>
              )}
            </div>

            {/* Photo navigation */}
            {hasMultiplePhotos && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full"
                  onClick={prevPhoto}
                  data-testid="button-prev-photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full"
                  onClick={nextPhoto}
                  data-testid="button-next-photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                {/* Photo indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {validatedPhotos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentPhotoIndex 
                          ? "bg-white w-6" 
                          : "bg-white/50"
                      }`}
                      data-testid={`indicator-photo-${index}`}
                    />
                  ))}
                </div>
              </>
            )}
            {/* Removed AI Validation Badge */}
          </div>

          {/* Profile Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-profile-name">
              {profile.name}, {profile.age}
            </h1>
            {profile.bio && (
              <p className="text-base text-muted-foreground" data-testid="text-profile-bio">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Compatibility - muy discreto */}
          {compatibilityScore !== undefined && (
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground opacity-60">
                <span className="font-semibold" data-testid="text-compatibility-score">
                  {compatibilityScore}%
                </span>
                <span>compatible</span>
              </div>
            </div>
          )}

          {/* Shared Defects */}
          {sharedDefects && sharedDefects.length > 0 && (
            <Card className="p-4">
              <div>
                <p className="text-sm font-medium mb-3" data-testid="text-shared-defects-count">
                  {sharedDefects.length} {sharedDefects.length === 1 ? 'defecto en común' : 'defectos en común'}
                </p>
                <div className="space-y-2">
                  {sharedDefects.slice(0, 5).map((defect, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                      data-testid={`shared-defect-${index}`}
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{defect}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Defects Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Mis Imperfecciones</h2>
            <div className="space-y-4">
              {profile.defects.map((defect, index) => (
                <Card 
                  key={defect.id} 
                  className="p-6 border-l-4"
                  data-testid={`card-defect-${index}`}
                >
                  <div className="space-y-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs mb-2"
                      data-testid={`badge-defect-category-${index}`}
                    >
                      {CATEGORY_LABELS[defect.category] || defect.category}
                    </Badge>
                    
                    <h3 className="text-lg font-medium" data-testid={`text-defect-title-${index}`}>
                      {defect.title}
                    </h3>
                    
                    <p className="text-base text-foreground leading-relaxed" data-testid={`text-defect-description-${index}`}>
                      {defect.description}
                    </p>

                    {/* Show defect photo if exists and it's a physical defect */}
                    {defect.photoUrl && defect.category === 'fisico' && (
                      <div className="mt-4">
                        <img
                          src={defect.photoUrl}
                          alt={`Foto de ${defect.title}`}
                          className="w-full max-w-xs rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Spacing for sticky actions */}
          {showActions && <div className="h-20" />}
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      {showActions && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t">
          <div className="container max-w-md mx-auto px-4 py-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-14 rounded-full text-base font-medium"
                onClick={onPass}
                data-testid="button-pass-detail"
              >
                <X className="w-5 h-5 mr-2" />
                No es para mí
              </Button>
              <Button
                variant="default"
                size="lg"
                className="flex-1 h-14 rounded-full text-base font-semibold"
                onClick={onLike}
                data-testid="button-like-detail"
              >
                Me interesa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
