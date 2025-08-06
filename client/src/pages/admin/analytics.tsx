import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthHeaders } from "@/lib/auth";
import { Key, GraduationCap, Clock, TrendingUp } from "lucide-react";

interface AnalyticsData {
  activeCodes: number;
  totalCompletions: number;
  inProgress: number;
  successRate: number;
  popularCourses: Array<{
    name: string;
    completions: number;
    percentage: number;
  }>;
  companyPerformance: Array<{
    name: string;
    employeesTrained: number;
    successRate: number;
  }>;
}

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/admin/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: Key,
      title: "Active Codes",
      value: analytics.activeCodes,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      icon: GraduationCap,
      title: "Completions",
      value: analytics.totalCompletions,
      color: "text-teal-600",
      bgColor: "bg-teal-100"
    },
    {
      icon: Clock,
      title: "In Progress",
      value: analytics.inProgress,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      icon: TrendingUp,
      title: "Success Rate",
      value: `${analytics.successRate}%`,
      color: "text-teal-600",
      bgColor: "bg-teal-100"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`${stat.color} h-6 w-6`} />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Courses */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100">
            <CardTitle className="text-emerald-800">Most Popular Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{course.name}</div>
                    <div className="text-sm text-gray-600">{course.completions} completions</div>
                  </div>
                  <div className="w-24 ml-4">
                    <Progress value={course.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Performance */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100">
            <CardTitle className="text-emerald-800">Company Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.companyPerformance.map((company, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{company.name}</div>
                    <div className="text-sm text-gray-600">{company.employeesTrained} employees trained</div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    company.successRate >= 95 ? 'text-green-600' : 
                    company.successRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {company.successRate}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
