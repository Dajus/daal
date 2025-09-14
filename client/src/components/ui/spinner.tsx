import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  };

  return (
    <div className={cn(
      "animate-spin rounded-full border-4 border-emerald-600 border-t-transparent",
      sizeClasses[size],
      className
    )} />
  );
};

interface LoadingScreenProps {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const LoadingScreen = ({ 
  title = "Načítání...", 
  description,
  size = "lg" 
}: LoadingScreenProps) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <Spinner size={size} className="mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const LoadingOverlay = ({ 
  title = "Načítání...", 
  description,
  size = "xl" 
}: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <Spinner size={size} className="mx-auto" />
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};