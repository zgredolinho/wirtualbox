import { Check, Star, Zap } from 'lucide-react'
import { Card, ProgressBar } from '../components/ui'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Topbar } from '../components/layout/Topbar'
import { PACKAGES, ACTIVE_PACKAGE_ID, PACKAGE_USAGE } from '../data/mockData'
import { useToast } from '../hooks/useToast'
import { useApp } from '../hooks/useApp'
import { clsx } from 'clsx'

export function PakietPage() {
  const { toast } = useToast()
  const { kpirOverLimit } = useApp()
  const usage = PACKAGE_USAGE

  const usageItems = [
    { label: 'KPiR — wpisy do księgi', used: usage.kpirUsed, limit: usage.kpirLimit, overLimit: kpirOverLimit },
    { label: 'Sala konferencyjna', used: usage.conferenceUsed, limit: usage.conferenceLimit, unit: 'h' },
    { label: 'Skany korespondencji', used: usage.mailScansUsed, limit: usage.mailScansLimit },
  ]

  const statusItems = [
    { label: 'Konsultacja księgowa', status: 'Dostępna', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Konsultacja marketingowa', status: 'Wykorzystana', color: 'text-gray-500 bg-gray-100' },
    { label: 'Projekt logo', status: 'W trakcie', color: 'text-blue-600 bg-blue-50' },
    { label: 'Projekt strony WWW', status: 'Do rozpoczęcia', color: 'text-gray-400 bg-gray-50' },
  ]

  return (
    <div className="space-y-5 max-w-5xl">
      <Topbar title="Mój pakiet" />

      <div>
        <h1 className="text-lg font-bold text-gray-900">Pakiety BOX</h1>
        <p className="text-sm text-gray-500 mt-0.5">Wybierz pakiet odpowiedni dla Twojego biznesu</p>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PACKAGES.map(pkg => {
          const isActive = pkg.id === ACTIVE_PACKAGE_ID
          const isVip = pkg.id === 'vip'
          return (
            <div
              key={pkg.id}
              className={clsx(
                'bg-white rounded-2xl border-2 flex flex-col relative overflow-hidden shadow-card transition-all duration-200',
                isActive ? 'border-brand shadow-lg shadow-brand/10 ring-1 ring-brand/20' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
              )}
            >
              {isActive && (
                <div className="bg-brand text-white text-[11px] font-semibold text-center py-1.5 tracking-wide">
                  ✓ AKTYWNY PAKIET
                </div>
              )}
              {isVip && !isActive && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-semibold text-center py-1.5">
                  ⭐ POLECANY
                </div>
              )}

              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {isVip ? <Star className="w-4 h-4 text-amber-500" /> : isActive ? <Zap className="w-4 h-4 text-brand" /> : null}
                  <h3 className="text-base font-bold text-gray-900">{pkg.name}</h3>
                </div>

                <div className="mt-4 mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">{pkg.priceMonthly.toLocaleString('pl-PL')}</span>
                    <span className="text-sm text-gray-500">zł / mies.</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{pkg.priceYearly.toLocaleString('pl-PL')} zł / rok</p>
                </div>

                <div className="space-y-5">
                  {pkg.features.map(f => (
                    <div key={f.category}>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{f.category}</p>
                      <ul className="space-y-1.5">
                        {f.items.map(item => (
                          <li key={item} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-brand mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 pt-0">
                {isActive ? (
                  <div className="w-full py-2.5 rounded-xl bg-brand/8 text-brand text-xs font-semibold text-center">
                    Aktywny pakiet
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    variant={isVip ? 'primary' : 'outline'}
                    onClick={() => toast('info', `Zmiana pakietu na ${pkg.name} — demo (brak backendu)`)}
                  >
                    {isVip ? 'Przejdź na VIP' : 'Wybierz pakiet'}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Usage this month */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Wykorzystanie pakietu w lipcu 2025</h3>
            <p className="text-xs text-gray-500 mt-0.5">BOX dla Wymagających</p>
          </div>
          <Badge variant="blue">Bieżący miesiąc</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            {usageItems.map(item => (
              <div key={item.label}>
                <ProgressBar
                  label={item.label}
                  used={item.used}
                  limit={item.limit}
                  overLimit={item.overLimit}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {statusItems.map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3.5">
                <p className="text-[11px] text-gray-500 mb-1">{item.label}</p>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
