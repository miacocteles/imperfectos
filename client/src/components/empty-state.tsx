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
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      {icon && (
        <div className="w-32 h-32 mx-auto mb-6 text-muted-foreground flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2" data-testid="text-empty-title">
        {title}
      </h3>
      {description && (
        <p className="text-base text-muted-foreground max-w-sm mb-8" data-testid="text-empty-description">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          size="lg"
          data-testid="button-empty-action"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
