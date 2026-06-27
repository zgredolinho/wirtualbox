import { NavLink, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  LayoutDashboard, FileText, Package, PlusSquare,
  CalendarDays, Bell, Calculator, Settings, LogOut, Building2
} from 'lucide-react'
import { useApp } from '../../hooks/useApp'

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/faktury',      icon: FileText,         label: 'KSeF / Faktury' },
  { to: '/pakiet',       icon: Package,          label: 'Mój pakiet' },
  { to: '/uslugi',       icon: PlusSquare,       label: 'Usługi dodatkowe' },
  { to: '/sale',         icon: CalendarDays,     label: 'Sale konferencyjne' },
  { to: '/powiadomienia',icon: Bell,             label: 'Powiadomienia' },
  { to: '/ksiegowosc',   icon: Calculator,       label: 'Panel księgowości' },
  { to: '/ustawienia',   icon: Settings,         label: 'Ustawienia' },
]

export function Sidebar() {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="w-[60px] xl:w-52 flex flex-col bg-[#0f2417] h-screen flex-shrink-0 transition-all duration-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 xl:px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <span className="hidden xl:block text-sm font-bold text-white tracking-tight">WirtualBOX</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 mx-2 px-2 xl:px-3 py-2.5 rounded-lg mb-0.5 group transition-all duration-150',
              isActive
                ? 'bg-brand text-white'
                : 'text-gray-400 hover:bg-white/8 hover:text-gray-200'
            )}
            title={label}
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-4.5 h-4.5 flex-shrink-0', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200')} style={{ width: '18px', height: '18px' }} />
                <span className="hidden xl:block text-xs font-medium truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-brand/70 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <div className="hidden xl:block min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 mx-0 px-2 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/8 w-full mt-1 transition-colors"
          title="Wyloguj"
        >
          <LogOut style={{ width: '18px', height: '18px' }} />
          <span className="hidden xl:block text-xs font-medium">Wyloguj</span>
        </button>
      </div>
    </aside>
  )
}
