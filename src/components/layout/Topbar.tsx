import { Bell, RefreshCw, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useApp } from '../../hooks/useApp'
import { useToast } from '../../hooks/useToast'

interface TopbarProps {
  title?: string
  showKsefActions?: boolean
}

export function Topbar({ title, showKsefActions }: TopbarProps) {
  const { user } = useApp()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSync = () => {
    toast('info', 'Synchronizacja KSeF w toku… (demo)')
    setTimeout(() => toast('success', 'Synchronizacja zakończona. Pobrano 3 nowe dokumenty.'), 2000)
  }
  const handleConfirm = () => toast('success', 'Komplet dokumentów potwierdzony.')

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-3 px-5 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Okres księgowy:</span>
          <span className="text-xs font-semibold text-gray-800">Lipiec 2025</span>
          {title && <><span className="text-gray-300 text-xs">/</span><span className="text-xs font-medium text-brand">{title}</span></>}
        </div>
        <p className="text-[11px] text-gray-400 hidden sm:block">{user?.company}</p>
      </div>

      {showKsefActions && (
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={handleSync}>
            Synchronizuj KSeF
          </Button>
          <Button variant="primary" size="sm" icon={<CheckCircle className="w-3.5 h-3.5" />} onClick={handleConfirm}>
            Potwierdź komplet
          </Button>
        </div>
      )}

      <button
        onClick={() => navigate('/powiadomienia')}
        className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand/15 flex items-center justify-center text-brand text-xs font-semibold">
          {user?.name?.charAt(0) ?? 'U'}
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-gray-800">{user?.name}</p>
          <p className="text-[10px] text-gray-400">{user?.role === 'accountant' ? 'Księgowość' : 'Klient'}</p>
        </div>
      </div>
    </header>
  )
}
