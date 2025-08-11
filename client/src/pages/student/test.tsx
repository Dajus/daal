import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TestInterface from "@/components/student/test-interface";

export default function TestPage() {
  const [, setLocation] = useLocation();
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-opacity duration-300 ${
      isPageReady ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Header with navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            onClick={() => setLocation('/student')}
            variant="ghost"
            className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Zpět na dashboard
          </Button>
        </div>
      </div>

      {/* Main content with constrained width */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TestInterface />
      </div>
    </div>
  );
}
