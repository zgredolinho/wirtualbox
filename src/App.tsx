import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './hooks/useApp'
import { ToastProvider } from './hooks/useToast'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { FakturyPage } from './pages/FakturyPage'
import { PakietPage } from './pages/PakietPage'
import { UslugiPage } from './pages/UslugiPage'
import { SalePage } from './pages/SalePage'
import { PowiadomieniaPage, KsiegowoscPage, UstawieniaPage } from './pages/OtherPages'
import { DemoPanel } from './components/modules/DemoPanel'

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"      element={<DashboardPage />} />
              <Route path="faktury"        element={<FakturyPage />} />
              <Route path="pakiet"         element={<PakietPage />} />
              <Route path="uslugi"         element={<UslugiPage />} />
              <Route path="sale"           element={<SalePage />} />
              <Route path="powiadomienia"  element={<PowiadomieniaPage />} />
              <Route path="ksiegowosc"     element={<KsiegowoscPage />} />
              <Route path="ustawienia"     element={<UstawieniaPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <DemoPanel />
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}
