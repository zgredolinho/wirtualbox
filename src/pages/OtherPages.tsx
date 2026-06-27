import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle2, Info, Zap, Filter, ChevronRight, Building, Package, FileText, Clock, CreditCard, Search, User, Settings as SettingsIcon, Shield } from 'lucide-react'
import { Card, CardHeader, Modal } from '../components/ui'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Topbar } from '../components/layout/Topbar'
import { NOTIFICATIONS, CLIENT_SUMMARIES, PACKAGES } from '../data/mockData'
import { useToast } from '../hooks/useToast'
import type { ClientSummary } from '../types'
import { clsx } from 'clsx'

// ─── Powiadomienia ──────────────────────────────────────────────────────────
export function PowiadomieniaPage() {
  const [filter, setFilter] = useState('all')
  const notifs = filter === 'all' ? NOTIFICATIONS : NOTIFICATIONS.filter(n => n.status === filter)

  const icon = (type: string) => {
    if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-500" />
    if (type === 'success') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    if (type === 'action')  return <Zap className="w-4 h-4 text-red-500" />
    return <Info className="w-4 h-4 text-blue-500" />
  }

  const statusBadge = (s: string) => {
    if (s === 'wymaga_akcji') return <Badge variant="red" dot>Wymaga akcji</Badge>
    if (s === 'nowe')         return <Badge variant="blue" dot>Nowe</Badge>
    return <Badge variant="gray">Przeczytane</Badge>
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <Topbar title="Powiadomienia" />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Powiadomienia</h1>
        <div className="flex gap-2">
          {['all', 'wymaga_akcji', 'nowe', 'przeczytane'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={clsx('px-2.5 py-1 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
              {f === 'all' ? 'Wszystkie' : f === 'wymaga_akcji' ? 'Akcja' : f === 'nowe' ? 'Nowe' : 'Przeczytane'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {notifs.map(n => (
          <div key={n.id} className={clsx('bg-white border rounded-xl p-4 flex gap-3 hover:shadow-sm transition-all',
            n.status === 'wymaga_akcji' ? 'border-amber-200 bg-amber-50/40' :
            n.status === 'nowe' ? 'border-blue-100 bg-blue-50/20' : 'border-gray-100')}>
            <div className="flex-shrink-0 mt-0.5">{icon(n.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                {statusBadge(n.status)}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-gray-400">{n.date}</span>
                {n.action && <button className="text-[11px] text-brand font-medium hover:underline">{n.action} →</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Panel Księgowości ───────────────────────────────────────────────────────
export function KsiegowoscPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ClientSummary | null>(null)
  const { toast } = useToast()

  const filtered = CLIENT_SUMMARIES.filter(c =>
    !search || c.company.toLowerCase().includes(search.toLowerCase())
  )

  const payBadge = (s: string) => {
    if (s === 'oplacone')  return <Badge variant="green" dot>Opłacone</Badge>
    if (s === 'oczekuje')  return <Badge variant="yellow" dot>Oczekuje</Badge>
    return <Badge variant="red" dot>Zaległości</Badge>
  }
  const accBadge = (s: string) => {
    if (s === 'zakonczone')   return <Badge variant="green" dot>Zakończone</Badge>
    if (s === 'w_toku')       return <Badge variant="blue" dot>W toku</Badge>
    return <Badge variant="red" dot>Wymaga akcji</Badge>
  }

  const totals = {
    clients: CLIENT_SUMMARIES.length,
    overLimit: CLIENT_SUMMARIES.filter(c => c.overLimit > 0).length,
    pending: CLIENT_SUMMARIES.filter(c => c.paymentStatus === 'oczekuje').length,
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <Topbar title="Panel księgowości" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Panel księgowości</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lipiec 2025 — obsługa klientów</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatBox label="Klientów" value={totals.clients} icon={<Building className="w-4 h-4" />} color="blue" />
        <StatBox label="Przekroczony limit" value={totals.overLimit} icon={<AlertTriangle className="w-4 h-4" />} color="red" />
        <StatBox label="Oczekuje płatności" value={totals.pending} icon={<CreditCard className="w-4 h-4" />} color="amber" />
      </div>

      <Card padding={false}>
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj klienta…"
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" />
          </div>
          <Button variant="outline" size="sm" icon={<Filter className="w-3.5 h-3.5" />} onClick={() => toast('info', 'Filtry — demo')}>Filtry</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Firma', 'Pakiet', 'Dokumenty', 'Limit KPiR', 'Nadlimit', 'Płatność', 'Księgowanie', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className={clsx('hover:bg-gray-50/80 transition-colors', c.overLimit > 0 && 'bg-red-50/20')}>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-gray-800">{c.company}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">{c.package}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-800">{c.documents}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.kpirLimit}</td>
                  <td className="px-4 py-3">
                    {c.overLimit > 0
                      ? <span className="text-xs font-bold text-red-600">+{c.overLimit}</span>
                      : <span className="text-xs text-emerald-600">W limicie</span>}
                  </td>
                  <td className="px-4 py-3">{payBadge(c.paymentStatus)}</td>
                  <td className="px-4 py-3">{accBadge(c.accountingStatus)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(c)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <Modal open onClose={() => setSelected(null)} title={selected.company} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[11px] text-gray-500 mb-1">Aktywny pakiet</p>
                <p className="text-xs font-semibold text-gray-800">{selected.package}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[11px] text-gray-500 mb-1">Dokumenty / Limit</p>
                <p className="text-xs font-semibold text-gray-800">{selected.documents} / {selected.kpirLimit} KPiR</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[11px] text-gray-500 mb-1">Status płatności</p>
                {payBadge(selected.paymentStatus)}
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[11px] text-gray-500 mb-1">Status księgowania</p>
                {accBadge(selected.accountingStatus)}
              </div>
            </div>
            {selected.overLimit > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                <strong>Nadlimit: +{selected.overLimit} dokumentów</strong> — klient oczekuje na dopłatę za przekroczenie limitu KPiR.
              </div>
            )}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button size="sm" variant="outline" onClick={() => toast('info', 'Wysłano przypomnienie — demo')}>Wyślij przypomnienie</Button>
              <Button size="sm" variant="outline" onClick={() => toast('info', 'Notatka dodana — demo')}>Dodaj notatkę</Button>
              <Button size="sm" onClick={() => toast('success', 'Status zaktualizowany — demo')}>Oznacz jako zakończone</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function StatBox({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const cls: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', red: 'bg-red-50 text-red-600', amber: 'bg-amber-50 text-amber-600' }
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-card">
      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mb-3', cls[color])}>{icon}</div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

// ─── Ustawienia ──────────────────────────────────────────────────────────────
export function UstawieniaPage() {
  const { toast } = useToast()
  const [tab, setTab] = useState('firma')
  const [firmData, setFirmData] = useState({ nip: '1234567890', name: 'Firma Demo Sp. z o.o.', street: 'ul. Przykładowa 1', zip: '61-001', city: 'Poznań' })

  const tabs = [
    { id: 'firma', label: 'Dane firmy', icon: Building },
    { id: 'ksef', label: 'Integracja KSeF', icon: FileText },
    { id: 'uzytkownicy', label: 'Użytkownicy', icon: User },
    { id: 'powiadomienia', label: 'Powiadomienia', icon: Bell },
    { id: 'bezpieczenstwo', label: 'Bezpieczeństwo', icon: Shield },
  ]

  return (
    <div className="space-y-5 max-w-3xl">
      <Topbar title="Ustawienia" />
      <h1 className="text-lg font-bold text-gray-900">Ustawienia</h1>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'firma' && (
        <Card>
          <CardHeader title="Dane firmy" subtitle="Informacje o Twojej firmie" />
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">NIP</label>
                <input value={firmData.nip} onChange={e => setFirmData(p => ({ ...p, nip: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
              <div className="flex items-end">
                <Button size="sm" variant="outline" onClick={() => { toast('success', 'Dane pobrane z GUS — demo') }}>Pobierz z GUS</Button>
              </div>
            </div>
            {[
              { label: 'Pełna nazwa firmy', key: 'name' },
              { label: 'Ulica i numer budynku', key: 'street' },
              { label: 'Kod pocztowy', key: 'zip' },
              { label: 'Miejscowość', key: 'city' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                <input value={firmData[f.key as keyof typeof firmData]}
                  onChange={e => setFirmData(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
            ))}
            <Button onClick={() => toast('success', 'Dane firmy zapisane.')}>Zapisz dane</Button>
          </div>
        </Card>
      )}

      {tab === 'ksef' && (
        <Card>
          <CardHeader title="Integracja KSeF" />
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-800">Połączono z KSeF — demo</p>
                <p className="text-xs text-emerald-700 mt-0.5">NIP: {firmData.nip} · Ostatnia synchronizacja: 19.07.2025 07:00</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              To jest wersja demonstracyjna. W produkcji integracja będzie wymagała autoryzacji zgodnej z wymaganiami KSeF (token autoryzacyjny lub certyfikat kwalifikowany).
            </div>
            <Button variant="outline" icon={<Clock className="w-3.5 h-3.5" />} onClick={() => toast('info', 'Synchronizacja KSeF — demo')}>
              Synchronizuj teraz
            </Button>
          </div>
        </Card>
      )}

      {tab === 'uzytkownicy' && (
        <Card>
          <CardHeader title="Użytkownicy" action={<Button size="sm" onClick={() => toast('info', 'Zaproszenie — demo')}>+ Dodaj</Button>} />
          <div className="space-y-3">
            {[
              { name: 'Katarzyna Wójtas', email: 'klient@demo.pl', role: 'Właściciel', active: true },
              { name: 'Anna Nowak', email: 'anna@firma.pl', role: 'Pracownik', active: true },
              { name: 'Biuro WirtualBOX', email: 'ksiegowa@wirtualbox.pl', role: 'Księgowa (zewnętrzna)', active: true },
            ].map(u => (
              <div key={u.email} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xs font-semibold">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800">{u.name}</p>
                  <p className="text-[11px] text-gray-500">{u.email}</p>
                </div>
                <Badge variant={u.role === 'Właściciel' ? 'purple' : u.role.includes('Księgowa') ? 'blue' : 'gray'}>
                  {u.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'powiadomienia' && (
        <Card>
          <CardHeader title="Powiadomienia e-mail" />
          <div className="space-y-3">
            {[
              'Nowe faktury z KSeF',
              'Przekroczenie limitu KPiR',
              'Potwierdzenie rezerwacji sali',
              'Płatności i faktury za usługi',
              'Powiadomienia o korespondencji',
            ].map(item => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-700">{item}</span>
                <input type="checkbox" defaultChecked className="rounded accent-brand" />
              </div>
            ))}
          </div>
          <Button className="mt-4" onClick={() => toast('success', 'Ustawienia powiadomień zapisane.')}>Zapisz</Button>
        </Card>
      )}

      {tab === 'bezpieczenstwo' && (
        <Card>
          <CardHeader title="Bezpieczeństwo" />
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nowe hasło</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Potwierdź hasło</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
            <Button onClick={() => toast('success', 'Hasło zmienione — demo')}>Zmień hasło</Button>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-800">Uwierzytelnianie dwuskładnikowe (2FA)</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Funkcja planowana w kolejnej wersji</p>
                </div>
                <Badge variant="gray">Planowane</Badge>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-700 mb-3">Historia logowania</p>
              {['19.07.2025 08:12 — Chrome, Windows', '18.07.2025 15:44 — Safari, macOS', '17.07.2025 09:01 — Chrome, Windows'].map(l => (
                <p key={l} className="text-[11px] text-gray-500 py-1 border-b border-gray-50 last:border-0">{l}</p>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
