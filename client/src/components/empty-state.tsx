import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4 animate-bounce-in">
      {icon && (
        <div className="w-32 h-32 mx-auto mb-6 text-primary flex items-center justify-center hover-wiggle bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl">
          {icon}
        </div>
      )}
      <h3 className="text-2xl font-bold mb-3" data-testid="text-empty-title">
        {title}
      </h3>
      {description && (
        <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed" data-testid="text-empty-description">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          size="lg"
          className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
          data-testid="button-empty-action"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
