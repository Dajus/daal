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
import { Download, Copy, Calendar, Plus, Clipboard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Course, Company, AccessCode } from "@/types";

type GeneratedAccessCode = AccessCode & { generatedAt?: string };

export default function CodeGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCompanyDialogOpen, setNewCompanyDialogOpen] = useState(false);
  const [justGeneratedCodes, setJustGeneratedCodes] = useState<GeneratedAccessCode[]>([]);

  const [formData, setFormData] = useState({
    courseId: '',
    companyId: '',
    unlimitedParticipants: false,
    maxParticipants: 5,
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
    onSuccess: (generatedCodes: AccessCode[]) => {
      toast({
        title: "Úspěch",
        description: `${generatedCodes.length} přístupový${generatedCodes.length > 1 ? 'ch kódů bylo' : ' kód byl'} vygenerován${generatedCodes.length > 1 ? 'o' : ''}`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/access-codes'] });
      
      // Add generated codes to the "just generated" section
      setJustGeneratedCodes(prev => [
        ...generatedCodes.map((code: AccessCode) => ({
          ...code,
          generatedAt: new Date().toISOString() // Mark when this batch was generated
        } as GeneratedAccessCode)),
        ...prev
      ]);
      
      // Reset form
      setFormData({
        courseId: '',
        companyId: '',
        unlimitedParticipants: false,
        maxParticipants: 5,
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

  const copyAllGeneratedCodes = () => {
    const allCodes = justGeneratedCodes.map(code => code.code);
    if (allCodes.length === 0) {
      toast({
        title: "Žádné kódy",
        description: "Nejsou k dispozici žádné kódy ke zkopírování",
        variant: "destructive"
      });
      return;
    }
    
    const formattedCodes = `Kódy: ${allCodes.join(', ')}`;
    navigator.clipboard.writeText(formattedCodes);
    toast({
      title: "Zkopírováno",
      description: `${allCodes.length} kód${allCodes.length > 1 ? 'ů' : ''} bylo zkopírováno do schránky`
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

  // Group just generated codes by generation batch
  const groupedGeneratedCodes = justGeneratedCodes.reduce((groups: any[], code) => {
    const codeTime = new Date(code.generatedAt || code.createdAt || 0).getTime();
    
    // Find existing group within 1 minute
    const existingGroup = groups.find(group => {
      const groupTime = new Date(group.timestamp).getTime();
      return Math.abs(codeTime - groupTime) < 60000; // 1 minute threshold
    });
    
    if (existingGroup) {
      existingGroup.codes.push(code);
    } else {
      groups.push({
        timestamp: code.generatedAt || code.createdAt,
        codes: [code]
      });
    }
    
    return groups;
  }, []);
  
  return (
    <div className="space-y-8">
      {/* Top Row: Form and Recent Codes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Generation Form */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800">
            <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t('generateAccessCode')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.maxParticipants || ''}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 0 }))
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

            <Button 
              type="submit" 
              disabled={createCodesMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {createCodesMutation.isPending ? "Generování..." : t('generateCode')}
            </Button>
          </form>
        </CardContent>
      </Card>

        {/* Just Generated Codes */}
        <Card className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <CardHeader className="bg-emerald-100 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Právě vygenerované kódy ({justGeneratedCodes.length})
              </CardTitle>
              {justGeneratedCodes.length > 0 && (
                <Button
                  onClick={copyAllGeneratedCodes}
                  variant="outline"
                  size="sm"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            {groupedGeneratedCodes.length > 0 ? (
              <div className="space-y-4">
                {groupedGeneratedCodes.map((group, groupIndex) => {
                  const groupTime = new Date(group.timestamp);
                  const isToday = groupTime.toDateString() === new Date().toDateString();
                  const timeDisplay = isToday 
                    ? `Dnes ${groupTime.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}`
                    : groupTime.toLocaleString('cs-CZ', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      });

                  return (
                    <div key={groupIndex} className="space-y-3">
                      {/* Group separator with timestamp */}
                      {groupIndex > 0 && (
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-emerald-300 dark:border-emerald-600"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Timestamp header for group */}
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                          {timeDisplay} • {group.codes.length} kód{group.codes.length > 1 ? 'y' : ''}
                        </div>
                      </div>

                      {/* Codes in this group */}
                      <div className="space-y-2">
                        {group.codes.map((code: any) => {
                          const course = courses.find(c => c.id === code.courseId);
                          const company = companies.find(c => c.id === code.companyId);
                          return (
                            <div key={code.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-mono text-sm">
                                  {code.code}
                                </Badge>
                                <Button
                                  onClick={() => copyToClipboard(code.code)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-800"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="space-y-1 text-xs">
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Kurz:</span> {course?.name || 'N/A'}</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Společnost:</span> {company?.name || 'N/A'}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant={code.theoryToTest ? "default" : "secondary"} className="text-xs">
                                    {code.theoryToTest ? "Teorie + Test" : "Pouze teorie"}
                                  </Badge>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {code.usageCount}/{code.unlimitedParticipants ? '∞' : code.maxParticipants}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                Zde se zobrazí nově vygenerované kódy
              </div>
            )}
          </CardContent>
        </Card>
      </div>



      {/* Recent Generated Codes Table */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <CardTitle className="text-gray-800 dark:text-gray-200">Nedávné přístupové kódy (posledních 15)</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <Download className="h-4 w-4" />
                {t('exportCsv')} (všechny)
              </Button>
            </div>
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
                {[...accessCodes].sort((a, b) => 
                  new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                ).slice(0, 15).map(code => {
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
          {accessCodes.length > 15 && (
            <div className="p-4 bg-gray-50 border-t text-sm text-gray-600 text-center">
              Zobrazeno 15 z {accessCodes.length} kódů. Pro export všech kódů použijte tlačítko CSV výše.
            </div>
          )}
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
