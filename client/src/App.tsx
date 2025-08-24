import { Switch, Route } from 'wouter'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CookieConsent } from '@/components/ui/cookie-consent'

import Landing from '@/pages/landing'
import AdminDashboard from '@/pages/admin/dashboard'
import StudentDashboard from '@/pages/student/dashboard'
import NotFound from '@/pages/not-found'

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/*" component={AdminDashboard} />
      <Route path="/student" component={StudentDashboard} />
      <Route path="/student/*" component={StudentDashboard} />
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <Toaster />
            <Router />
            <CookieConsent />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
