import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logout, isAuthenticated } from "@/lib/auth";
import { LogOut, ArrowLeft, Book } from "lucide-react";
import CourseEditor from "@/components/admin/course-editor";

export default function AdminCoursesPage() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Book className="text-white h-6 w-6" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">DAAL</span>
              </div>
              <Badge className="ml-4 bg-emerald-600 text-white">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setLocation('/admin')}
                variant="ghost"
                className="flex items-center gap-2 text-emerald-700 hover:bg-emerald-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-600 mt-1">Edit course content, theory slides, and test questions</p>
          </div>

          {/* Course Editor Component */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CourseEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
