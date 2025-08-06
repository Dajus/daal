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
import { t } from "@/lib/translations";
import { apiRequest } from "@/lib/queryClient";
import { Download, Copy, Calendar, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Course, Company, AccessCode } from "@/types";

export default function CodeGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCompanyDialogOpen, setNewCompanyDialogOpen] = useState(false);

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

  // Mutation for creating new company
  const createCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/admin/companies', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies'] });
      toast({ title: "Úspěch", description: "Společnost byla úspěšně vytvořena" });
      setNewCompanyDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Chyba", description: "Nepodařilo se vytvořit společnost", variant: "destructive" });
    }
  });

  // Create access codes mutation
  const createCodesMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/admin/access-codes', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Úspěch",
        description: "Přístupový kód byl vygenerován"
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
        title: "Chyba",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseId || !formData.companyId) {
      toast({
        title: "Chyba",
        description: "Vyberte prosím kurz i společnost",
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
      title: "Zkopírováno",
      description: "Kód byl zkopírován do schránky"
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

  // Get recent codes (last 5)
  const recentCodes = accessCodes.slice(0, 5);
  
  return (
    <div className="space-y-8">
      {/* Code Generation Form */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="bg-emerald-50 border-b border-emerald-100">
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('generateAccessCode')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="course">{t('course')}</Label>
              <Select 
                value={formData.courseId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCourse')} />
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
              <div className="flex justify-between items-center">
                <Label htmlFor="company">{t('company')}</Label>
                <Dialog open={newCompanyDialogOpen} onOpenChange={setNewCompanyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" size="sm" variant="outline" className="text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Nová společnost
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Vytvořit novou společnost</DialogTitle>
                    </DialogHeader>
                    <NewCompanyForm onSubmit={(data) => createCompanyMutation.mutate(data)} />
                  </DialogContent>
                </Dialog>
              </div>
              <Select 
                value={formData.companyId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCompany')} />
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="unlimited">{t('unlimitedParticipants')}</Label>
                <Switch
                  id="unlimited"
                  checked={formData.unlimitedParticipants}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, unlimitedParticipants: checked }))
                  }
                />
              </div>
              {!formData.unlimitedParticipants && (
                <Input
                  placeholder="Počet účastníků"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))
                  }
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="includeTest">{t('theoryToTest')}</Label>
                <Switch
                  id="includeTest"
                  checked={formData.theoryToTest}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, theoryToTest: checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">{t('validUntil')}</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, validUntil: e.target.value }))
                }
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <Button 
                type="submit" 
                disabled={createCodesMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-medium"
              >
                {createCodesMutation.isPending ? "Generování..." : t('generateCode')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recently Generated Codes */}
      {recentCodes.length > 0 && (
        <Card className="bg-emerald-50 border border-emerald-200 shadow-sm">
          <CardHeader className="bg-emerald-100 border-b border-emerald-200">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Nejnovější kódy ({recentCodes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCodes.map(code => {
                const course = courses.find(c => c.id === code.courseId);
                const company = companies.find(c => c.id === code.companyId);
                return (
                  <div key={code.id} className="bg-white p-4 rounded-lg border border-emerald-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-mono text-sm">
                        {code.code}
                      </Badge>
                      <Button
                        onClick={() => copyToClipboard(code.code)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-800"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Kurz:</span> {course?.name || 'N/A'}</p>
                      <p><span className="font-medium">Společnost:</span> {company?.name || 'N/A'}</p>
                      <p><span className="font-medium">Platnost:</span> {new Date(code.validUntil).toLocaleDateString('cs-CZ')}</p>
                      <p><span className="font-medium">Využití:</span> {code.usageCount}/{code.unlimitedParticipants ? '∞' : code.maxParticipants}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={code.theoryToTest ? "default" : "secondary"} className="text-xs">
                          {code.theoryToTest ? "Teorie + Test" : "Pouze teorie"}
                        </Badge>
                        <Badge variant={code.isActive ? "default" : "destructive"} className="text-xs">
                          {code.isActive ? "Aktivní" : "Neaktivní"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Generated Codes Table */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-800">Všechny přístupové kódy ({accessCodes.length})</CardTitle>
            <Button 
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Download className="h-4 w-4" />
              {t('exportCsv')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('code')}</TableHead>
                  <TableHead>{t('course')}</TableHead>
                  <TableHead>Společnost</TableHead>
                  <TableHead>{t('usage')}</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>{t('validUntil')}</TableHead>
                  <TableHead>Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessCodes.map(code => {
                  const course = courses.find(c => c.id === code.courseId);
                  const company = companies.find(c => c.id === code.companyId);
                  return (
                    <TableRow key={code.id}>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {code.code}
                        </Badge>
                      </TableCell>
                      <TableCell>{course?.name || 'N/A'}</TableCell>
                      <TableCell>{company?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {code.usageCount}/{code.unlimitedParticipants ? '∞' : code.maxParticipants}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={code.theoryToTest ? "default" : "secondary"} className="text-xs">
                          {code.theoryToTest ? "Teorie + Test" : "Pouze teorie"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(code.validUntil).toLocaleDateString('cs-CZ')}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => copyToClipboard(code.code)}
                          variant="ghost"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-800"
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
        </CardContent>
      </Card>
    </div>
  );
}

// New Company Form Component
function NewCompanyForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="companyName">Název společnosti *</Label>
        <Input
          id="companyName"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="např. ACME Corporation"
          required
        />
      </div>

      <div>
        <Label htmlFor="contactEmail">Kontaktní email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
          placeholder="kontakt@acme.cz"
        />
      </div>

      <div>
        <Label htmlFor="contactPhone">Kontaktní telefon</Label>
        <Input
          id="contactPhone"
          value={formData.contactPhone}
          onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
          placeholder="+420 123 456 789"
        />
      </div>

      <div>
        <Label htmlFor="address">Adresa</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Ulice 123, 110 00 Praha"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Vytvořit společnost
        </Button>
      </div>
    </form>
  );
}
