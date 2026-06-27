import { useNavigate } from 'react-router-dom'
import {
  FileText, Package, CalendarDays, Mail,
  MessageSquare, AlertTriangle, ArrowRight,
  TrendingUp, CheckCircle2, Clock
} from 'lucide-react'
import { Card, CardHeader, ProgressBar } from '../components/ui'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Topbar } from '../components/layout/Topbar'
import { PACKAGE_USAGE, NOTIFICATIONS, INVOICES, PACKAGES, ACTIVE_PACKAGE_ID } from '../data/mockData'
import { useApp } from '../hooks/useApp'

export function DashboardPage() {
  const { user, kpirOverLimit } = useApp()
  const navigate = useNavigate()
  const activePackage = PACKAGES.find(p => p.id === ACTIVE_PACKAGE_ID)!
  const usage = PACKAGE_USAGE
  const recentNotifs = NOTIFICATIONS.slice(0, 4)
  const overLimitInvoices = INVOICES.filter(i => i.isOverLimit)

  const isAccountant = user?.role === 'accountant'

  return (
    <div className="space-y-5 max-w-6xl">
      <Topbar title="Dashboard" />

      {/* Alert nadlimitu */}
      {kpirOverLimit > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">Przekroczono limit KPiR</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Pobrano 15 dokumentów z KSeF. {kpirOverLimit} dokumentów przekracza limit pakietu.
              Aby przekazać je do księgowania, dokup dodatkowy pakiet.
            </p>
          </div>
          <Button size="sm" onClick={() => navigate('/uslugi')} className="flex-shrink-0">
            Dokup pakiet
          </Button>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="w-4 h-4" />}
          label="Dokumenty KSeF"
          value="15"
          sub={`${kpirOverLimit} nadlimitowych`}
          color="blue"
          onClick={() => navigate('/faktury')}
        />
        <StatCard
          icon={<Package className="w-4 h-4" />}
          label="Aktywny pakiet"
          value={activePackage.name.replace('BOX ', '')}
          sub={`${activePackage.priceMonthly} zł / mies.`}
          color="green"
          onClick={() => navigate('/pakiet')}
        />
        <StatCard
          icon={<CalendarDays className="w-4 h-4" />}
          label="Sala konferencyjna"
          value={`${usage.conferenceUsed}h / ${usage.conferenceLimit}h`}
          sub="Wykorzystano w lipcu"
          color="purple"
          onClick={() => navigate('/sale')}
        />
        <StatCard
          icon={<Mail className="w-4 h-4" />}
          label="Skany korespondencji"
          value={`${usage.mailScansUsed} / ${usage.mailScansLimit}`}
          sub="Wykorzystano"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pakiet + utilizacja */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title={`Pakiet: ${activePackage.name}`}
              subtitle="Wykorzystanie limitów w lipcu 2025"
              action={<Button size="sm" variant="outline" onClick={() => navigate('/pakiet')}>Zarządzaj pakietem</Button>}
            />
            <div className="space-y-4">
              <ProgressBar label="Wpisy do KPiR" used={usage.kpirUsed} limit={usage.kpirLimit} overLimit={kpirOverLimit} />
              <ProgressBar label="Sala konferencyjna (h)" used={usage.conferenceUsed} limit={usage.conferenceLimit} />
              <ProgressBar label="Skany korespondencji" used={usage.mailScansUsed} limit={usage.mailScansLimit} />

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50">
                <UsageItem label="Konsultacja księgowa" status="available" />
                <UsageItem label="Konsultacja marketingowa" status="used" />
                <UsageItem label="Projekt logo" status="in_progress" />
                <UsageItem label="Projekt strony WWW" status="pending" />
              </div>
            </div>
          </Card>

          {/* Ostatnie faktury */}
          <Card>
            <CardHeader
              title="Ostatnie dokumenty KSeF"
              action={<button onClick={() => navigate('/faktury')} className="text-xs text-brand hover:underline flex items-center gap-1">Wszystkie <ArrowRight className="w-3 h-3" /></button>}
            />
            <div className="space-y-2">
              {INVOICES.slice(0, 5).map(inv => (
                <div key={inv.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{inv.number}</p>
                    <p className="text-[11px] text-gray-500 truncate">{inv.contractor}</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-800">{inv.brutto.toLocaleString('pl-PL')} zł</p>
                  <Badge variant={inv.isOverLimit ? 'red' : 'blue'} dot className="text-[10px]">
                    {inv.isOverLimit ? 'Nadlimit' : 'Do księgowania'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Powiadomienia */}
        <div>
          <Card>
            <CardHeader
              title="Powiadomienia"
              action={<button onClick={() => navigate('/powiadomienia')} className="text-xs text-brand hover:underline flex items-center gap-1">Wszystkie <ArrowRight className="w-3 h-3" /></button>}
            />
            <div className="space-y-3">
              {recentNotifs.map(n => (
                <div key={n.id} className={`flex gap-2.5 p-2.5 rounded-lg ${n.status === 'wymaga_akcji' ? 'bg-amber-50 border border-amber-100' : n.status === 'nowe' ? 'bg-blue-50/50' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    n.type === 'warning' ? 'bg-amber-500' :
                    n.type === 'success' ? 'bg-emerald-500' :
                    n.type === 'action'  ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800 leading-snug">{n.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{n.message.slice(0, 80)}…</p>
                    {n.action && (
                      <button className="text-[11px] text-brand font-medium mt-1 hover:underline">{n.action} →</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Szybkie akcje */}
          <Card className="mt-4">
            <CardHeader title="Szybkie akcje" />
            <div className="space-y-2">
              <QuickAction label="Faktury KSeF" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => navigate('/faktury')} />
              <QuickAction label="Rezerwuj salę" icon={<CalendarDays className="w-3.5 h-3.5" />} onClick={() => navigate('/sale')} />
              <QuickAction label="Dokup usługę" icon={<Package className="w-3.5 h-3.5" />} onClick={() => navigate('/uslugi')} />
              {isAccountant && <QuickAction label="Panel księgowości" icon={<MessageSquare className="w-3.5 h-3.5" />} onClick={() => navigate('/ksiegowosc')} />}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color, onClick }: {
  icon: React.ReactNode; label: string; value: string; sub: string
  color: 'blue' | 'green' | 'purple' | 'orange'; onClick?: () => void
}) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-emerald-50 text-emerald-600',
    purple: 'bg-violet-50 text-violet-600',
    orange: 'bg-orange-50 text-orange-600',
  }
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 shadow-card"
    >
      <div className={`w-8 h-8 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
      <p className="text-[11px] font-medium text-gray-600 mt-0.5">{label}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
    </button>
  )
}

function UsageItem({ label, status }: { label: string; status: 'available' | 'used' | 'in_progress' | 'pending' }) {
  const cfg = {
    available:   { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, text: 'Dostępna', cls: 'text-emerald-600' },
    used:        { icon: <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />, text: 'Wykorzystana', cls: 'text-gray-500' },
    in_progress: { icon: <Clock className="w-3.5 h-3.5 text-blue-500" />, text: 'W trakcie', cls: 'text-blue-600' },
    pending:     { icon: <Clock className="w-3.5 h-3.5 text-gray-300" />, text: 'Do rozpoczęcia', cls: 'text-gray-400' },
  }[status]
  return (
    <div className="flex items-center gap-2">
      {cfg.icon}
      <div>
        <p className="text-[11px] font-medium text-gray-700">{label}</p>
        <p className={`text-[10px] ${cfg.cls}`}>{cfg.text}</p>
      </div>
    </div>
  )
}

function QuickAction({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors text-left"
    >
      <span className="text-brand">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
      <ArrowRight className="w-3 h-3 ml-auto text-gray-300" />
    </button>
  )
}
