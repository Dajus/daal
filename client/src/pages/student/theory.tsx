import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TheoryViewer from "@/components/student/theory-viewer";

export default function TheoryPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            onClick={() => setLocation('/student')}
            variant="ghost"
            className="flex items-center gap-2 text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Předchozí otázka
          </Button>
        </div>
      </div>

      {/* Main content with constrained width */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TheoryViewer />
      </div>
    </div>
  );
}
