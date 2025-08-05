import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { t } from "@/lib/translations";
import { setAuthToken } from "@/lib/auth";
import { Shield, GraduationCap, X } from "lucide-react";
import type { LoginResponse } from "@/types";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [mode, setMode] = useState<'select' | 'admin' | 'student'>('select');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [adminForm, setAdminForm] = useState({
    username: '',
    password: ''
  });

  const [studentForm, setStudentForm] = useState({
    studentName: '',
    studentEmail: '',
    accessCode: ''
  });

  const adminLogin = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest('/api/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast({
        title: t('success'),
        description: t('loginSuccess')
      });
      onOpenChange(false);
      setLocation('/admin');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const studentLogin = useMutation({
    mutationFn: async (data: { studentName: string; studentEmail: string; accessCode: string }) => {
      const response = await apiRequest('/api/auth/student/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast({
        title: t('success'),
        description: t('accessGranted')
      });
      onOpenChange(false);
      setLocation('/student');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin.mutate(adminForm);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    studentLogin.mutate(studentForm);
  };

  const resetModal = () => {
    setMode('select');
    setAdminForm({ username: '', password: '' });
    setStudentForm({ studentName: '', studentEmail: '', accessCode: '' });
  };

  return (
    <Modal open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetModal();
    }}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            {mode === 'select' && t('accessPlatform')}
            {mode === 'admin' && (
              <>
                <Shield className="h-5 w-5 text-gray-900" />
                Administrator
              </>
            )}
            {mode === 'student' && (
              <>
                <GraduationCap className="h-5 w-5 text-primary" />
                Course Participant
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
                <div className="font-semibold">Administrator</div>
                <div className="text-sm text-gray-300">Manage courses and analytics</div>
              </div>
            </Button>

            <div className="text-center text-gray-400 font-medium">OR</div>

            <Button
              onClick={() => setMode('student')}
              className="w-full bg-primary text-white p-6 h-auto hover:bg-primary-dark flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-primary-dark rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Course Participant</div>
                <div className="text-sm text-blue-100">Access your training</div>
              </div>
            </Button>
          </div>
        )}

        {mode === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={adminForm.username}
                onChange={(e) => setAdminForm(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={adminForm.password}
                onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={adminLogin.isPending}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              {adminLogin.isPending ? "Logging in..." : "Login"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode('select')}
              className="w-full"
            >
              Back
            </Button>
          </form>
        )}

        {mode === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Full Name</Label>
              <Input
                id="studentName"
                type="text"
                placeholder="John Doe"
                value={studentForm.studentName}
                onChange={(e) => setStudentForm(prev => ({ ...prev, studentName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentEmail">Email Address</Label>
              <Input
                id="studentEmail"
                type="email"
                placeholder="john@company.com"
                value={studentForm.studentEmail}
                onChange={(e) => setStudentForm(prev => ({ ...prev, studentEmail: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessCode">Access Code</Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="BOZP1234ABCD"
                value={studentForm.accessCode}
                onChange={(e) => setStudentForm(prev => ({ ...prev, accessCode: e.target.value.toUpperCase() }))}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={studentLogin.isPending}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              {studentLogin.isPending ? "Entering..." : "Enter Course"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode('select')}
              className="w-full"
            >
              Back
            </Button>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
