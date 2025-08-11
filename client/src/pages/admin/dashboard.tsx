import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Book, BarChart3, LogOut, Building2 } from "lucide-react";
import { logout, isAuthenticated, getUserInfo } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LoadingOverlay } from "@/components/ui/spinner";
import { t } from "@/lib/translations";

import CodeGenerator from "@/components/admin/code-generator";
import CourseEditor from "@/components/admin/course-editor";
import AdminAnalytics from "./analytics";
import CompaniesPage from "./companies";

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userInfo = getUserInfo();
  const isSuperAdmin = userInfo?.adminId && !userInfo?.companyAdminId; // Super admin has adminId only, company admin has companyAdminId
  
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout(() => setLocation('/'));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Key className="text-white h-6 w-6" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">DAAL</span>
              </div>
              <Badge className="ml-4 bg-emerald-600 text-white hidden sm:inline-flex">{t('admin')}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('logout')}</span>
                <span className="sm:hidden">Odhlásit</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-14 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('adminDashboard')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Správa kurzů, přístupových kódů a analytiky</p>
          </div>

          {/* Main Content */}
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Tabs defaultValue={isSuperAdmin ? "codes" : "analytics"} className="w-full">
              <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent min-w-fit">
                  {isSuperAdmin && (
                    <TabsTrigger 
                      value="codes" 
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base whitespace-nowrap"
                    >
                      <Key className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{t('accessCodes')}</span>
                      <span className="sm:hidden">Kódy</span>
                    </TabsTrigger>
                  )}
                  {isSuperAdmin && (
                    <TabsTrigger 
                      value="courses"
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base whitespace-nowrap"
                    >
                      <Book className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{t('courseManagement')}</span>
                      <span className="sm:hidden">Kurzy</span>
                    </TabsTrigger>
                  )}
                  <TabsTrigger 
                    value="analytics"
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base whitespace-nowrap"
                  >
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t('analytics')}</span>
                    <span className="sm:hidden">Analytics</span>
                  </TabsTrigger>
                  {isSuperAdmin && (
                    <TabsTrigger 
                      value="companies"
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base whitespace-nowrap"
                    >
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{t('companies')}</span>
                      <span className="sm:hidden">Firmy</span>
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              {isSuperAdmin && (
                <TabsContent value="codes" className="p-3 sm:p-6">
                  <CodeGenerator />
                </TabsContent>
              )}

              {isSuperAdmin && (
                <TabsContent value="courses" className="p-3 sm:p-6">
                  <CourseEditor />
                </TabsContent>
              )}

              <TabsContent value="analytics" className="p-3 sm:p-6">
                <AdminAnalytics />
              </TabsContent>

              {isSuperAdmin && (
                <TabsContent value="companies" className="p-3 sm:p-6">
                  <CompaniesPage />
                </TabsContent>
              )}
            </Tabs>
          </Card>
        </div>
      </div>
      
      {/* Loading Overlay for Logout */}
      {isLoggingOut && (
        <LoadingOverlay 
          title="Odhlašování..." 
          description="Přesměrování na hlavní stránku"
        />
      )}
    </div>
  );
}
