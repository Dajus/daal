import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Book, BarChart3, LogOut } from "lucide-react";
import { logout, isAuthenticated } from "@/lib/auth";
import { t } from "@/lib/translations";

import CodeGenerator from "@/components/admin/code-generator";
import CourseEditor from "@/components/admin/course-editor";
import AdminAnalytics from "./analytics";

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  
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
                  <Key className="text-white h-6 w-6" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">DAAL</span>
              </div>
              <Badge className="ml-4 bg-emerald-600 text-white">{t('admin')}</Badge>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('adminDashboard')}</h1>
            <p className="text-gray-600 mt-1">Správa kurzů, přístupových kódů a analytiky</p>
          </div>

          {/* Main Content */}
          <Card className="shadow-sm border border-gray-200">
            <Tabs defaultValue="codes" className="w-full">
              <div className="border-b border-gray-200">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="codes" 
                    className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none"
                  >
                    <Key className="h-4 w-4" />
                    {t('accessCodes')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="courses"
                    className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none"
                  >
                    <Book className="h-4 w-4" />
                    {t('courseManagement')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics"
                    className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none"
                  >
                    <BarChart3 className="h-4 w-4" />
                    {t('analytics')}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="codes" className="p-6">
                <CodeGenerator />
              </TabsContent>

              <TabsContent value="courses" className="p-6">
                <CourseEditor />
              </TabsContent>

              <TabsContent value="analytics" className="p-6">
                <AdminAnalytics />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
