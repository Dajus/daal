import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash2, Plus, Building2, Users, Edit } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { getAuthHeaders } from '@/lib/auth'
import { t } from '@/lib/translations'
import type { Company, CompanyAdmin } from '@shared/schema'

// Form schemas
const companyAdminSchema = z.object({
  username: z.string().min(3, 'Uživatelské jméno musí mít alespoň 3 znaky'),
  passwordHash: z.string().min(4, 'Heslo musí mít alespoň 4 znaky'),
  email: z.string().email('Neplatná e-mailová adresa').optional().or(z.literal('')),
  companyId: z.number().min(1, 'Vyberte společnost'),
})

type CompanyAdminFormData = z.infer<typeof companyAdminSchema>

export default function CompaniesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<CompanyAdmin | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch companies
  const { data: companies = [], isLoading: companiesLoading } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies'],
    queryFn: async () => {
      const response = await fetch('/api/admin/companies', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch companies')
      return response.json()
    },
  })

  // Fetch company admins
  const { data: companyAdmins = [], isLoading: adminsLoading } = useQuery<CompanyAdmin[]>({
    queryKey: ['/api/admin/company-admins'],
    queryFn: async () => {
      const response = await fetch('/api/admin/company-admins', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch company admins')
      return response.json()
    },
  })

  // Create company admin mutation
  const createCompanyAdminMutation = useMutation({
    mutationFn: async (data: CompanyAdminFormData) => {
      const response = await fetch('/api/admin/company-admins', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create company admin')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-admins'] })
      setIsCreateDialogOpen(false)
      toast({
        title: 'Úspěch',
        description: t('accountCreated'),
      })
    },
    onError: () => {
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se vytvořit účet administrátora společnosti',
      })
    },
  })

  // Delete company admin mutation
  const deleteCompanyAdminMutation = useMutation({
    mutationFn: async (adminId: number) => {
      const response = await fetch(`/api/admin/company-admins/${adminId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to delete company admin')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-admins'] })
      toast({
        title: 'Úspěch',
        description: t('accountDeleted'),
      })
    },
    onError: () => {
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se smazat účet',
      })
    },
  })

  // Update company admin mutation
  const updateCompanyAdminMutation = useMutation({
    mutationFn: async ({ adminId, data }: { adminId: number; data: CompanyAdminFormData }) => {
      const response = await fetch(`/api/admin/company-admins/${adminId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update company admin')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-admins'] })
      setIsEditDialogOpen(false)
      setEditingAdmin(null)
      toast({
        title: 'Úspěch',
        description: 'Administrátor společnosti byl úspěšně upraven',
      })
    },
    onError: () => {
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se upravit administrátora společnosti',
      })
    },
  })

  // Form for creating company admin
  const form = useForm<CompanyAdminFormData>({
    resolver: zodResolver(companyAdminSchema),
    defaultValues: {
      username: '',
      passwordHash: '',
      email: '',
      companyId: 0,
    },
  })

  // Form for editing company admin
  const editForm = useForm<CompanyAdminFormData>({
    resolver: zodResolver(companyAdminSchema),
    defaultValues: {
      username: '',
      passwordHash: '',
      email: '',
      companyId: 0,
    },
  })

  const onSubmit = (data: CompanyAdminFormData) => {
    createCompanyAdminMutation.mutate(data)
  }

  const onEditSubmit = (data: CompanyAdminFormData) => {
    if (editingAdmin) {
      updateCompanyAdminMutation.mutate({ adminId: editingAdmin.id, data })
    }
  }

  const handleDeleteAdmin = (adminId: number) => {
    if (confirm(t('confirmDelete'))) {
      deleteCompanyAdminMutation.mutate(adminId)
    }
  }

  const handleEditAdmin = (admin: CompanyAdmin) => {
    setEditingAdmin(admin)
    editForm.reset({
      username: admin.username,
      passwordHash: '', // Keep empty for security
      email: admin.email || '',
      companyId: admin.companyId,
    })
    setIsEditDialogOpen(true)
  }

  if (companiesLoading || adminsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Načítání dat společností...</p>
        </div>
      </div>
    )
  }

  // Group admins by company
  const adminsByCompany = companyAdmins.reduce(
    (acc, admin) => {
      if (!acc[admin.companyId]) {
        acc[admin.companyId] = []
      }
      acc[admin.companyId].push(admin)
      return acc
    },
    {} as Record<number, CompanyAdmin[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('companyManagement')}</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {t('createCompanyAdmin')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('createCompanyAdmin')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('username')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordHash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')} (volitelné)</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('selectCompany')}</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectCompany')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Zrušit
                  </Button>
                  <Button type="submit" disabled={createCompanyAdminMutation.isPending}>
                    {createCompanyAdminMutation.isPending ? 'Vytváření...' : t('createAccount')}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Company Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upravit administrátora společnosti</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('username')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="passwordHash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')} (ponechte prázdné pro zachování)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Zadejte nové heslo nebo nechte prázdné" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')} (volitelné)</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('selectCompany')}</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectCompany')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingAdmin(null)
                  }}
                >
                  Zrušit
                </Button>
                <Button type="submit" disabled={updateCompanyAdminMutation.isPending}>
                  {updateCompanyAdminMutation.isPending ? 'Ukládání...' : 'Uložit změny'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        {companies.map((company) => {
          const companyAdminsList = adminsByCompany[company.id] || []

          return (
            <Card key={company.id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  {company.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {companyAdminsList.length} administrátor{companyAdminsList.length !== 1 ? 'ů' : ''}
                    </div>
                    {company.contactEmail && <div>E-mail: {company.contactEmail}</div>}
                  </div>

                  {companyAdminsList.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{t('companyAdmins')}:</h4>
                      <div className="space-y-2">
                        {companyAdminsList.map((admin) => (
                          <div
                            key={admin.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg gap-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 dark:text-white">{admin.username}</div>
                              {admin.email && (
                                <div className="text-sm text-gray-600 dark:text-gray-400 break-all">{admin.email}</div>
                              )}
                              {admin.lastLogin && (
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                  Poslední přihlášení: {new Date(admin.lastLogin).toLocaleString('cs-CZ')}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAdmin(admin)}
                                disabled={updateCompanyAdminMutation.isPending}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteAdmin(admin.id)}
                                disabled={deleteCompanyAdminMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      Žádní administrátoři pro tuto společnost
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
