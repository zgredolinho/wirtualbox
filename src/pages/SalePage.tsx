import { useState } from 'react'
import { MapPin, Users, Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react'
import { Card, Modal } from '../components/ui'
import { Badge, ReservationStatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Topbar } from '../components/layout/Topbar'
import { CONFERENCE_ROOMS, RESERVATIONS, PACKAGE_USAGE } from '../data/mockData'
import { useToast } from '../hooks/useToast'
import type { ConferenceRoom } from '../types'

export function SalePage() {
  const { toast } = useToast()
  const [reserveRoom, setReserveRoom] = useState<ConferenceRoom | null>(null)
  const [step, setStep] = useState<'form' | 'overlimit' | 'success'>('form')
  const [form, setForm] = useState({ date: '', from: '09:00', to: '11:00', purpose: '', notes: '' })

  const usage = PACKAGE_USAGE
  const remainingH = Math.max(0, usage.conferenceLimit - usage.conferenceUsed)

  const calcHours = () => {
    if (!form.from || !form.to) return 0
    const [fh, fm] = form.from.split(':').map(Number)
    const [th, tm] = form.to.split(':').map(Number)
    return Math.max(0, (th * 60 + tm - fh * 60 - fm) / 60)
  }
  const hours = calcHours()
  const extraHours = Math.max(0, hours - remainingH)

  const handleSubmit = () => {
    if (!form.date || hours <= 0) { toast('warning', 'Wypełnij datę i godziny rezerwacji.'); return }
    if (extraHours > 0) { setStep('overlimit'); return }
    setStep('success')
    toast('success', 'Rezerwacja wysłana — oczekuje na potwierdzenie.')
  }

  const handleClose = () => { setReserveRoom(null); setStep('form'); setForm({ date: '', from: '09:00', to: '11:00', purpose: '', notes: '' }) }

  return (
    <div className="space-y-5 max-w-5xl">
      <Topbar title="Sale konferencyjne" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Sale konferencyjne</h1>
          <p className="text-sm text-gray-500 mt-0.5">Twój pakiet obejmuje {usage.conferenceLimit}h / mies. — pozostało: {remainingH}h</p>
        </div>
      </div>

      {/* Limit bar */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-600 font-medium">Wykorzystanie sal w lipcu 2025</span>
              <span className="font-semibold text-gray-800">{usage.conferenceUsed}h / {usage.conferenceLimit}h</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full" style={{ width: `${(usage.conferenceUsed / usage.conferenceLimit) * 100}%` }} />
            </div>
          </div>
          <Badge variant={remainingH > 0 ? 'green' : 'red'} dot>{remainingH > 0 ? `${remainingH}h pozostało` : 'Limit wyczerpany'}</Badge>
        </div>
      </Card>

      {/* Room cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CONFERENCE_ROOMS.map(room => (
          <Card key={room.id} padding={false} className="overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            {/* Image placeholder */}
            <div className="h-36 flex items-center justify-center" style={{ background: `${room.imageColor}18` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: room.imageColor }}>
                <Calendar className="w-8 h-8 text-white opacity-90" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-0.5">{room.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{room.location}</span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>do {room.capacity} os.</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{room.pricePerHour} zł/h</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {room.amenities.slice(0, 3).map(a => (
                  <span key={a} className="text-[10px] bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">{a}</span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="text-[10px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">+{room.amenities.length - 3}</span>
                )}
              </div>

              <Button
                className="w-full"
                size="sm"
                onClick={() => { setReserveRoom(room); setStep('form') }}
              >
                Zarezerwuj salę
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* My reservations */}
      {RESERVATIONS.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Moje rezerwacje</h3>
          <div className="space-y-3">
            {RESERVATIONS.map(r => (
              <div key={r.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800">{r.roomName}</p>
                  <p className="text-[11px] text-gray-500">{r.date} · {r.timeFrom}–{r.timeTo} · {r.purpose}</p>
                </div>
                <ReservationStatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reservation modal */}
      {reserveRoom && (
        <Modal open onClose={handleClose} title={
          step === 'success' ? 'Rezerwacja wysłana' :
          step === 'overlimit' ? 'Nadlimit godzin' :
          `Rezerwacja — ${reserveRoom.name}`
        } size="md">
          {step === 'form' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: reserveRoom.imageColor }}>
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{reserveRoom.name}</p>
                  <p className="text-[11px] text-gray-500">{reserveRoom.location}</p>
                </div>
                <Badge variant="green" className="ml-auto">{reserveRoom.pricePerHour} zł/h</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Data</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Od</label>
                  <input type="time" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Do</label>
                  <input type="time" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </div>
                <div className="flex items-end">
                  <div className="text-center w-full bg-gray-50 rounded-lg py-2">
                    <p className="text-[10px] text-gray-500">Czas</p>
                    <p className="text-sm font-bold text-gray-800">{hours.toFixed(1)}h</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cel spotkania</label>
                <input value={form.purpose} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}
                  placeholder="np. Spotkanie z klientem"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>

              {hours > 0 && (
                <div className={`p-3 rounded-lg text-xs ${extraHours > 0 ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'}`}>
                  {extraHours > 0
                    ? `⚠️ Twój pakiet obejmuje ${remainingH}h pozostałe. Wybrane ${hours}h → nadlimit: ${extraHours}h (${extraHours * reserveRoom.pricePerHour} zł dopłaty)`
                    : `✓ Rezerwacja mieści się w pakiecie (pozostało ${remainingH}h)`
                  }
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button variant="outline" onClick={handleClose} className="flex-1">Anuluj</Button>
                <Button onClick={handleSubmit} className="flex-1">
                  {extraHours > 0 ? `Dalej (dopłata ${extraHours * reserveRoom.pricePerHour} zł)` : 'Zarezerwuj'}
                </Button>
              </div>
            </div>
          )}

          {step === 'overlimit' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Nadlimit godzin sali</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Twój pakiet <strong>BOX dla Wymagających</strong> obejmuje {usage.conferenceLimit}h sali konferencyjnej miesięcznie. 
                    Wybrana rezerwacja obejmuje {hours}h, dlatego <strong>{extraHours}h wymaga dopłaty</strong>.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-600"><span>Godziny w pakiecie</span><span>{remainingH}h — bezpłatnie</span></div>
                <div className="flex justify-between text-xs text-gray-600"><span>Godziny nadlimitowe</span><span>{extraHours}h × {reserveRoom.pricePerHour} zł</span></div>
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-2 mt-1"><span>Dopłata</span><span className="text-brand">{(extraHours * reserveRoom.pricePerHour).toFixed(2)} zł</span></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('form')} className="flex-1">Zmień godziny</Button>
                <Button onClick={() => setStep('success')} className="flex-1">Opłać dopłatę i rezerwuj</Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Rezerwacja wysłana!</h3>
                <p className="text-sm text-gray-500 mt-1">{reserveRoom.name} · {form.date} · {form.from}–{form.to}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-left space-y-2">
                <p className="text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Rezerwacja zarejestrowana</p>
                <p className="text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Oczekuje na potwierdzenie WirtualBOX</p>
                <p className="text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Powiadomienie e-mail wysłane</p>
              </div>
              <Button onClick={handleClose} className="w-full">Zamknij</Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
