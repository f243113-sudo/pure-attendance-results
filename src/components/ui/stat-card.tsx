import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  variant = "default",
  className 
}: StatCardProps) {
  const variants = {
    default: "bg-card border-border",
    primary: "bg-primary/10 border-primary/20",
    success: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
  };

  const iconVariants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
  };

  return (
    <div className={cn(
      "rounded-lg border p-6 shadow-sm animate-fade-in",
      variants[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn(
          "rounded-full p-3",
          iconVariants[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
