import { useState } from 'react'
import { X, ChevronRight, CheckCircle2, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'

const STEPS = [
  { id: 1, label: 'Zaloguj się do panelu', route: '/login', hint: 'Użyj klient@demo.pl' },
  { id: 2, label: 'Zobacz aktywny pakiet BOX dla Wymagających', route: '/dashboard', hint: 'Dashboard — pakiet i limity' },
  { id: 3, label: 'Przejdź do KSeF / Faktury', route: '/faktury', hint: '15 dokumentów, limit 10' },
  { id: 4, label: 'Sprawdź 5 nadlimitowych dokumentów', route: '/faktury', hint: 'Oznaczone jako „Nadlimit"' },
  { id: 5, label: 'Dokup pakiet 5 dokumentów', route: '/uslugi', hint: 'Usługi → Dodatkowe 5 wpisów KPiR' },
  { id: 6, label: 'Symulacja płatności Przelewy24', route: '/uslugi', hint: 'Kliknij Dokup → modal P24' },
  { id: 7, label: 'Zarezerwuj salę na 3h', route: '/sale', hint: 'Pakiet: 2h → nadlimit 1h = dopłata' },
  { id: 8, label: 'Sprawdź panel księgowości', route: '/ksiegowosc', hint: 'Widok dla pracownika WirtualBOX' },
]

export function DemoPanel() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState<Set<number>>(new Set())
  const navigate = useNavigate()

  const handleStep = (s: typeof STEPS[0]) => {
    setDone(p => new Set([...p, s.id]))
    navigate(s.route)
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(p => !p)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-brand-dark transition-all text-xs font-semibold"
      >
        <Play className="w-3.5 h-3.5" />
        Tryb demo
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-16 right-5 z-50 w-72 bg-white border border-gray-200 rounded-2xl shadow-modal overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-brand text-white">
            <span className="text-xs font-bold">Scenariusz demonstracyjny</span>
            <button onClick={() => setOpen(false)} className="hover:opacity-75"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-3 max-h-96 overflow-y-auto">
            <p className="text-[10px] text-gray-500 mb-3 px-1">Kliknij krok, aby przejść do widoku</p>
            {STEPS.map(s => (
              <button
                key={s.id}
                onClick={() => handleStep(s)}
                className={clsx(
                  'w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left mb-1 transition-colors group',
                  done.has(s.id) ? 'bg-emerald-50' : 'hover:bg-gray-50'
                )}
              >
                <div className={clsx('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold',
                  done.has(s.id) ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600 group-hover:bg-brand group-hover:text-white')}>
                  {done.has(s.id) ? <CheckCircle2 className="w-3 h-3" /> : s.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={clsx('text-xs font-medium leading-snug', done.has(s.id) ? 'text-emerald-700' : 'text-gray-800')}>{s.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.hint}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 mt-1 flex-shrink-0 group-hover:text-gray-500" />
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-gray-100 bg-amber-50">
            <p className="text-[10px] text-amber-700 text-center">🎯 Demo — brak backendu, dane mockowane</p>
          </div>
        </div>
      )}
    </>
  )
}
