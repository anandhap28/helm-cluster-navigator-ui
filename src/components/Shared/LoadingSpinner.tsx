
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  className,
  label
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={cn(
          "rounded-full border-t-transparent border-primary animate-spin",
          sizeClasses[size],
          className
        )}
      />
      {label && (
        <span className="mt-2 text-sm text-muted-foreground">
          {label}
          <span className="loading-dots"></span>
        </span>
      )}
    </div>
  );
}
