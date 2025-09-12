import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { setAuthToken, removeAuthToken } from '@/lib/auth'
import { apiRequest, queryClient } from '@/lib/queryClient'
import { Shield, GraduationCap, X } from 'lucide-react'
import type { LoginResponse } from '@/types'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: 'student' | 'admin' | 'select'
}

const LoginModal = ({ open, onOpenChange, type = 'select' }: LoginModalProps) => {
  const [mode, setMode] = useState<'select' | 'admin' | 'student'>(
    type === 'student' || type === 'admin' ? type : 'select',
  )
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
  })

  const [studentForm, setStudentForm] = useState({
    studentName: '',
    studentEmail: '',
    accessCode: '',
  })

  const adminLogin = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest('/api/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      return response.json() as Promise<LoginResponse>
    },
    onSuccess: (data) => {
      setAuthToken(data.token)
      toast({
        title: 'Úspěch',
        description: 'Přihlášení proběhlo úspěšně',
      })
      onOpenChange(false)
      setLocation('/admin')
    },
    onError: (error: Error) => {
      toast({
        title: 'Chyba',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const studentLogin = useMutation({
    mutationFn: async (data: { studentName: string; studentEmail: string; accessCode: string }) => {
      // Vymazat všechna existující ověřovací data pro prevenci konfliktů relací
      removeAuthToken()
      queryClient.clear() // Vymazat všechna cache data

      const response = await apiRequest('/api/auth/student/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      return response.json() as Promise<LoginResponse>
    },
    onSuccess: (data) => {
      setAuthToken(data.token)
      // Invalidovat všechny dotazy pro zajištění čerstvých dat pro nového uživatele
      queryClient.invalidateQueries()
      toast({
        title: 'Úspěch',
        description: 'Přístup povolen',
      })
      onOpenChange(false)
      setLocation('/student')
    },
    onError: (error: Error) => {
      toast({
        title: 'Chyba',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    adminLogin.mutate(adminForm)
  }

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    studentLogin.mutate(studentForm)
  }

  const resetModal = () => {
    const newMode = type === 'student' || type === 'admin' ? type : 'select'
    setMode(newMode)
    setAdminForm({ username: '', password: '' })
    setStudentForm({ studentName: '', studentEmail: '', accessCode: '' })
  }

  useEffect(() => {
    if (open) {
      const newMode = type === 'student' || type === 'admin' ? type : 'select'
      setMode(newMode)
    }
  }, [type, open])

  return (
    <Modal
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen)
        if (!newOpen) resetModal()
      }}
    >
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            {mode === 'select' && 'Přístup k platformě'}
            {mode === 'admin' && (
              <>
                <Shield className="h-5 w-5 text-gray-900" />
                Administrátor
              </>
            )}
            {mode === 'student' && (
              <>
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                Účastník kurzu
              </>
            )}
          </ModalTitle>
        </ModalHeader>

        {mode === 'select' && (
          <div className="space-y-4">
            <Button
              onClick={() => setMode('admin')}
              className="w-full bg-gray-900 text-white p-6 h-auto hover:bg-gray-800 flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Administrátor</div>
                <div className="text-sm text-gray-300">Spravovat kurzy a analytiku</div>
              </div>
            </Button>

            <div className="text-center text-gray-400 font-medium">NEBO</div>

            <Button
              onClick={() => setMode('student')}
              className="w-full bg-emerald-600 text-white p-6 h-auto hover:bg-emerald-700 flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Účastník kurzu</div>
                <div className="text-sm text-emerald-100">Přístup k vašemu školení</div>
              </div>
            </Button>
          </div>
        )}

        {mode === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Uživatelské jméno</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={adminForm.username}
                onChange={(e) => setAdminForm((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={adminForm.password}
                onChange={(e) => setAdminForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" disabled={adminLogin.isPending} className="w-full bg-gray-900 hover:bg-gray-800">
              {adminLogin.isPending ? 'Přihlašování...' : 'Přihlásit'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setMode('select')} className="w-full">
              Zpět
            </Button>
          </form>
        )}

        {mode === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Celé jméno</Label>
              <Input
                id="studentName"
                type="text"
                placeholder="Jan Novák"
                value={studentForm.studentName}
                onChange={(e) => setStudentForm((prev) => ({ ...prev, studentName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentEmail">E-mailová adresa</Label>
              <Input
                id="studentEmail"
                type="email"
                placeholder="jan@firma.cz"
                value={studentForm.studentEmail}
                onChange={(e) => setStudentForm((prev) => ({ ...prev, studentEmail: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessCode">Přístupový kód</Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="BOZP1234ABCD"
                value={studentForm.accessCode}
                onChange={(e) => setStudentForm((prev) => ({ ...prev, accessCode: e.target.value.toUpperCase() }))}
                required
              />
            </div>

            {/* Upozornění pro sdílené zařízení */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Sdílené zařízení:</strong> Pokud používáte sdílené počítače/tablety, váš pokrok se uloží k
                vašemu jménu a e-mailu.
              </p>
            </div>

            <Button
              type="submit"
              disabled={studentLogin.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {studentLogin.isPending ? 'Vstupování...' : 'Vstoupit do kurzu'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setMode('select')} className="w-full">
              Zpět
            </Button>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export default LoginModal
