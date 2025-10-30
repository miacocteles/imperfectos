import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { MatchWithProfile } from "@shared/schema";

interface MatchListItemProps {
  match: MatchWithProfile;
  onClick: () => void;
}

export function MatchListItem({ match, onClick }: MatchListItemProps) {
  const primaryPhoto = match.otherUserPhotos.find(p => p.isPrimary && p.isValidated) 
    || match.otherUserPhotos.find(p => p.isValidated);

  const topSharedDefect = match.sharedDefects[0];

  return (
    <motion.div
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="p-4 cursor-pointer transition-all duration-300 hover:shadow-card border border-border/50 hover:border-primary/30 bg-white rounded-xl"
        onClick={onClick}
        data-testid={`card-match-${match.id}`}
      >
        <div className="flex items-center gap-4">
          {/* Profile Photo */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-16 h-16 border-2 border-border shadow-sm">
              {primaryPhoto ? (
                <AvatarImage src={primaryPhoto.url} alt={match.otherUser.name} />
              ) : null}
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-secondary text-white">
                {match.otherUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {/* Badge de match */}
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm">
              ✓
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base truncate" data-testid={`text-match-name-${match.id}`}>
                {match.otherUser.name}, {match.otherUser.age}
              </h3>
            </div>
            
            {topSharedDefect && (
              <p className="text-sm text-muted-foreground truncate mb-1.5" data-testid={`text-shared-defect-${match.id}`}>
                {topSharedDefect}
              </p>
            )}
            
            {match.sharedDefects.length > 1 && (
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0 font-medium">
                +{match.sharedDefects.length - 1} en común
              </Badge>
            )}
          </div>

          {/* Compatibility Score */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <Badge 
              className="text-sm font-bold px-3 py-1 bg-gradient-to-r from-primary to-secondary border-0 shadow-sm" 
              data-testid={`badge-match-score-${match.id}`}
            >
              <TrendingUp className="w-3 h-3 mr-1 inline" />
              {match.compatibilityScore}%
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
