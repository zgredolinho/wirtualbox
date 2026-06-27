import { useState } from 'react'
import { ShoppingCart, CheckCircle2, Zap } from 'lucide-react'
import { Card } from '../components/ui'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui'
import { Topbar } from '../components/layout/Topbar'
import { ADDON_SERVICES } from '../data/mockData'
import { useToast } from '../hooks/useToast'
import { useApp } from '../hooks/useApp'
import type { AddonService } from '../types'
import { clsx } from 'clsx'

type Category = 'Wszystkie' | 'Księgowość' | 'Sale konferencyjne' | 'Korespondencja' | 'Marketing' | 'IT' | 'HR'

const catColors: Record<string, string> = {
  'Księgowość':          'blue',
  'Sale konferencyjne':  'green',
  'Korespondencja':      'purple',
  'Marketing':           'orange',
  'IT':                  'gray',
  'HR':                  'yellow',
}

export function UslugiPage() {
  const { toast } = useToast()
  const { addKpirDocs } = useApp()
  const [category, setCategory] = useState<Category>('Wszystkie')
  const [buyService, setBuyService] = useState<AddonService | null>(null)
  const [step, setStep] = useState<'confirm' | 'p24' | 'success'>('confirm')

  const categories: Category[] = ['Wszystkie', 'Księgowość', 'Sale konferencyjne', 'Korespondencja', 'Marketing', 'IT', 'HR']

  const filtered = category === 'Wszystkie' ? ADDON_SERVICES : ADDON_SERVICES.filter(s => s.category === category)

  const handleBuy = (s: AddonService) => { setBuyService(s); setStep('confirm') }
  const handleClose = () => { setBuyService(null); setStep('confirm') }
  const handleGoToP24 = () => setStep('p24')
  const handlePayment = () => {
    setStep('success')
    if (buyService?.id === '1' || buyService?.id === '2') {
      const n = buyService.id === '1' ? 5 : 10
      addKpirDocs(n)
    }
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <Topbar title="Usługi dodatkowe" />

      <div>
        <h1 className="text-lg font-bold text-gray-900">Usługi dodatkowe</h1>
        <p className="text-sm text-gray-500 mt-0.5">Dokup usługę lub rozszerz swój pakiet</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              category === cat ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(service => (
          <Card key={service.id} className="flex flex-col hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <Badge variant={catColors[service.category] as any}>{service.category}</Badge>
              {service.popular && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                  <Zap className="w-3 h-3" /> Popularne
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1.5">{service.name}</h3>
            <p className="text-xs text-gray-500 flex-1 leading-relaxed">{service.description}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <div>
                <span className="text-lg font-bold text-gray-900">{service.price}</span>
                <span className="text-xs text-gray-500 ml-1">zł netto</span>
                <p className="text-[10px] text-gray-400">{(service.price * 1.23).toFixed(0)} zł brutto</p>
              </div>
              <Button size="sm" icon={<ShoppingCart className="w-3.5 h-3.5" />} onClick={() => handleBuy(service)}>
                Dokup
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Purchase modal */}
      {buyService && (
        <Modal
          open
          onClose={handleClose}
          title={step === 'success' ? 'Płatność zakończona' : step === 'p24' ? 'Przelewy24 — demo' : 'Potwierdzenie zamówienia'}
          size="sm"
        >
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Zamawiasz</p>
                <p className="text-sm font-semibold text-gray-800">{buyService.name}</p>
                <p className="text-xs text-gray-500 mt-1">{buyService.description}</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-600"><span>Cena netto</span><span>{buyService.price} zł</span></div>
                <div className="flex justify-between text-xs text-gray-600"><span>VAT 23%</span><span>{(buyService.price * 0.23).toFixed(2)} zł</span></div>
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2"><span>Razem brutto</span><span>{(buyService.price * 1.23).toFixed(2)} zł</span></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
                <img src="https://www.przelewy24.pl/themes/przelewy24/assets/img/logo.svg" alt="Przelewy24" className="h-5 opacity-70" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <span>Płatność realizowana przez Przelewy24 — demo</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" onClick={handleClose} className="flex-1">Anuluj</Button>
                <Button onClick={handleGoToP24} className="flex-1">Przejdź do płatności</Button>
              </div>
            </div>
          )}

          {step === 'p24' && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-5 space-y-3 bg-gray-50">
                <p className="text-xs font-semibold text-gray-700 text-center">SYMULACJA — Przelewy24</p>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Numer karty</label>
                  <input className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg" defaultValue="4111 1111 1111 1111" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Ważność</label>
                    <input className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg" defaultValue="12/27" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">CVV</label>
                    <input className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg" defaultValue="123" />
                  </div>
                </div>
                <p className="text-[10px] text-center text-gray-400">To jest symulacja. Żadne dane nie są przetwarzane.</p>
              </div>
              <div className="flex justify-between text-sm font-bold px-1">
                <span>Do zapłaty:</span>
                <span className="text-brand">{(buyService.price * 1.23).toFixed(2)} zł</span>
              </div>
              <Button onClick={handlePayment} className="w-full" size="lg">
                Zapłać {(buyService.price * 1.23).toFixed(2)} zł
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Płatność zakończona pomyślnie!</h3>
                <p className="text-sm text-gray-500 mt-1">{buyService.name}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-left space-y-2">
                <p className="text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Płatność zaakceptowana</p>
                <p className="text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Limit zaktualizowany</p>
                <p className="text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Księgowość otrzymała powiadomienie</p>
              </div>
              <Button onClick={handleClose} className="w-full">Zamknij</Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
