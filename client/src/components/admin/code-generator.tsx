import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Download, Copy, Calendar } from "lucide-react";
import type { Course, Company, AccessCode } from "@/types";

export default function CodeGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    courseId: '',
    companyId: '',
    unlimitedParticipants: false,
    maxParticipants: 25,
    theoryToTest: true,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
  });

  // Fetch courses
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/admin/courses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/courses', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    }
  });

  // Fetch companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies'],
    queryFn: async () => {
      const response = await fetch('/api/admin/companies', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch companies');
      return response.json();
    }
  });

  // Fetch access codes
  const { data: accessCodes = [] } = useQuery<AccessCode[]>({
    queryKey: ['/api/admin/access-codes'],
    queryFn: async () => {
      const response = await fetch('/api/admin/access-codes', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch access codes');
      return response.json();
    }
  });

  // Create access codes mutation
  const createCodesMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/admin/access-codes', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Access codes generated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/access-codes'] });
      // Reset form
      setFormData({
        courseId: '',
        companyId: '',
        unlimitedParticipants: false,
        maxParticipants: 25,
        theoryToTest: true,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseId || !formData.companyId) {
      toast({
        title: "Error",
        description: "Please select both course and company",
        variant: "destructive"
      });
      return;
    }

    createCodesMutation.mutate({
      courseId: parseInt(formData.courseId),
      companyId: parseInt(formData.companyId),
      unlimitedParticipants: formData.unlimitedParticipants,
      maxParticipants: formData.unlimitedParticipants ? null : formData.maxParticipants,
      theoryToTest: formData.theoryToTest,
      validUntil: formData.validUntil
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard"
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Code', 'Course', 'Company', 'Usage', 'Valid Until'].join(','),
      ...accessCodes.map(code => [
        code.code,
        courses.find(c => c.id === code.courseId)?.name || '',
        companies.find(c => c.id === code.companyId)?.name || '',
        `${code.usageCount}/${code.maxParticipants || 'Unlimited'}`,
        code.validUntil
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'access-codes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Code Generation Form */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Generate Access Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select 
                value={formData.courseId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select 
                value={formData.companyId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="unlimited">Unlimited Participants</Label>
              <Switch
                id="unlimited"
                checked={formData.unlimitedParticipants}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, unlimitedParticipants: checked }))
                }
              />
            </div>

            {!formData.unlimitedParticipants && (
              <div className="space-y-2">
                <Label htmlFor="participants">Participant Count</Label>
                <Input
                  id="participants"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))
                  }
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="includeTest">Include Test After Theory</Label>
              <Switch
                id="includeTest"
                checked={formData.theoryToTest}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, theoryToTest: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">Code Validity</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, validUntil: e.target.value }))
                }
              />
            </div>

            <Button 
              type="submit" 
              disabled={createCodesMutation.isPending}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              {createCodesMutation.isPending ? "Generating..." : "Generate Codes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generated Codes Display */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Generated Codes</h3>
          <div className="flex space-x-2">
            <Button 
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessCodes.map((code) => {
                    const course = courses.find(c => c.id === code.courseId);
                    const isExpired = new Date(code.validUntil) < new Date();
                    const isUsedUp = !code.unlimitedParticipants && code.maxParticipants && code.usageCount >= code.maxParticipants;
                    
                    return (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono text-sm">{code.code}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course?.name}</div>
                            <Badge variant="secondary" className="mt-1">
                              {course?.abbreviation}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`${isUsedUp ? 'text-red-600 font-semibold' : ''}`}>
                            {code.usageCount}/{code.maxParticipants || '∞'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className={`text-sm ${isExpired ? 'text-red-600 font-semibold' : ''}`}>
                              {new Date(code.validUntil).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => copyToClipboard(code.code)}
                            variant="ghost"
                            size="sm"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {accessCodes.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No access codes generated yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
