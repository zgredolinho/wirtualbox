import { useState, useMemo } from 'react'
import {
  RefreshCw, CheckCircle, Filter, Search, X,
  Download, Eye, FileText, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Card } from '../components/ui'
import { Badge, InvoiceStatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui'
import { Topbar } from '../components/layout/Topbar'
import { INVOICES } from '../data/mockData'
import { useApp } from '../hooks/useApp'
import { useToast } from '../hooks/useToast'
import type { Invoice } from '../types'
import { useNavigate } from 'react-router-dom'

const PAGE_SIZE = 10

export function FakturyPage() {
  const { kpirOverLimit } = useApp()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null)
  const [page, setPage] = useState(1)
  const [invoices, setInvoices] = useState(INVOICES)

  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch = !search || inv.number.toLowerCase().includes(search.toLowerCase()) || inv.contractor.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || inv.status === statusFilter
      const matchSource = sourceFilter === 'all' || inv.source === sourceFilter
      const matchType = typeFilter === 'all' || inv.type === typeFilter
      return matchSearch && matchStatus && matchSource && matchType
    })
  }, [invoices, search, statusFilter, sourceFilter, typeFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totals = useMemo(() => ({
    netto: filtered.reduce((s, i) => s + i.netto, 0),
    vat: filtered.reduce((s, i) => s + i.vat, 0),
    brutto: filtered.reduce((s, i) => s + i.brutto, 0),
    inLimit: filtered.filter(i => !i.isOverLimit).length,
    overLimit: filtered.filter(i => i.isOverLimit).length,
  }), [filtered])

  const toggleSelect = (id: string) => {
    setSelected(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s })
  }
  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set())
    else setSelected(new Set(paginated.map(i => i.id)))
  }

  const handleBulkAction = (action: string) => {
    if (selected.size === 0) { toast('warning', 'Zaznacz dokumenty, aby wykonać akcję.'); return }
    if (action === 'ksiegowosc') {
      const hasOverLimit = Array.from(selected).some(id => invoices.find(i => i.id === id)?.isOverLimit)
      if (hasOverLimit) {
        toast('warning', 'Część zaznaczonych dokumentów przekracza limit KPiR. Dokup pakiet nadlimitowy.')
        return
      }
      setInvoices(p => p.map(i => selected.has(i.id) ? { ...i, status: 'rozliczone' as const } : i))
      toast('success', `Przekazano ${selected.size} dokumentów do księgowania.`)
      setSelected(new Set())
    }
  }

  const pl = (n: number) => n.toLocaleString('pl-PL', { minimumFractionDigits: 2 })

  return (
    <div className="space-y-4 max-w-7xl">
      <Topbar title="KSeF / Faktury" showKsefActions />

      {/* Nadlimit alert */}
      {kpirOverLimit > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Nadlimit KPiR — {kpirOverLimit} dokumentów wymaga dopłaty</p>
            <p className="text-xs text-red-700 mt-0.5">
              Twój pakiet <strong>BOX dla Wymagających</strong> obejmuje 10 wpisów do KPiR. System pobrał 15 dokumentów z KSeF. 
              Dokumenty oznaczone jako <span className="font-semibold">„Nadlimit"</span> nie zostaną zaksięgowane bez dodatkowej opłaty.
            </p>
          </div>
          <Button size="sm" onClick={() => navigate('/uslugi')}>
            Dokup 5 dokumentów
          </Button>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Dokumentów łącznie', value: String(filtered.length), color: 'text-gray-800' },
          { label: 'W pakiecie', value: String(totals.inLimit), color: 'text-emerald-700' },
          { label: 'Nadlimitowe', value: String(totals.overLimit), color: 'text-red-600' },
          { label: 'Suma netto', value: `${pl(totals.netto)} zł`, color: 'text-gray-800' },
          { label: 'Suma brutto', value: `${pl(totals.brutto)} zł`, color: 'text-gray-900' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-lg p-3 shadow-card">
            <p className="text-[11px] text-gray-500">{s.label}</p>
            <p className={`text-sm font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Card padding={false}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-100">
          <div className="relative flex-1 min-w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Szukaj po kontrahencie lub numerze…"
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20">
            <option value="all">Wszystkie statusy</option>
            <option value="do_ksiegowania">Do księgowania</option>
            <option value="nie_ksieguj">Nie księguj</option>
            <option value="do_akceptacji">Do akceptacji</option>
            <option value="nadlimit">Nadlimit</option>
            <option value="rozliczone">Rozliczone</option>
          </select>

          <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setPage(1) }} className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20">
            <option value="all">Wszystkie źródła</option>
            <option value="KSeF">KSeF</option>
            <option value="E-mail">E-mail</option>
            <option value="Skaner">Skaner</option>
            <option value="Ręczne">Ręczne</option>
          </select>

          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }} className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20">
            <option value="all">Wszystkie typy</option>
            <option value="zakupowa">Zakupowe</option>
            <option value="sprzedazowa">Sprzedażowe</option>
          </select>

          {selected.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-600">Zaznaczono: {selected.size}</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('ksiegowosc')}>
                Przekaż do księgowania
              </Button>
              <button onClick={() => setSelected(new Set())} className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded" />
                </th>
                {['Data', 'Numer faktury', 'Kontrahent', 'Typ', 'Źródło', 'Netto', 'VAT', 'Brutto', 'Status', 'Etap', 'Akcje'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map(inv => (
                <tr
                  key={inv.id}
                  className={`hover:bg-gray-50/80 transition-colors ${inv.isOverLimit ? 'bg-red-50/30' : ''} ${selected.has(inv.id) ? 'bg-brand/5' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(inv.id)} onChange={() => toggleSelect(inv.id)} className="rounded" />
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 whitespace-nowrap">{inv.date}</td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium text-gray-800 font-mono">{inv.number}</span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-medium text-gray-800 max-w-32 truncate">{inv.contractor}</p>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={inv.type === 'zakupowa' ? 'gray' : 'purple'} className="text-[10px]">
                      {inv.type === 'zakupowa' ? 'Zakupowa' : 'Sprzedażowa'}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={inv.source === 'KSeF' ? 'green' : inv.source === 'E-mail' ? 'blue' : 'gray'} className="text-[10px]">
                      {inv.source}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700 whitespace-nowrap font-medium">{pl(inv.netto)} zł</td>
                  <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{pl(inv.vat)} zł</td>
                  <td className="px-3 py-3 text-xs font-semibold text-gray-900 whitespace-nowrap">{pl(inv.brutto)} zł</td>
                  <td className="px-3 py-3"><InvoiceStatusBadge status={inv.status} /></td>
                  <td className="px-3 py-3 text-[11px] text-gray-500 max-w-28 truncate">{inv.accountingStage}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailInvoice(inv)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        title="Podgląd"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toast('info', 'Pobieranie PDF… (demo)')}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        title="Pobierz PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/60">
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span>Netto: <strong>{pl(totals.netto)} zł</strong></span>
            <span>VAT: <strong>{pl(totals.vat)} zł</strong></span>
            <span>Brutto: <strong className="text-gray-900">{pl(totals.brutto)} zł</strong></span>
            <span className="text-emerald-700">W pakiecie: <strong>{totals.inLimit}</strong></span>
            {totals.overLimit > 0 && <span className="text-red-600">Nadlimitowe: <strong>{totals.overLimit}</strong></span>}
          </div>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-gray-600">{page} / {totalPages || 1}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Invoice detail modal */}
      {detailInvoice && (
        <InvoiceDetailModal invoice={detailInvoice} onClose={() => setDetailInvoice(null)} />
      )}
    </div>
  )
}

function InvoiceDetailModal({ invoice: inv, onClose }: { invoice: Invoice; onClose: () => void }) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const pl = (n: number) => n.toLocaleString('pl-PL', { minimumFractionDigits: 2 })

  return (
    <Modal open title={`Faktura ${inv.number}`} onClose={onClose} size="lg">
      <div className="space-y-5">
        {inv.isOverLimit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-800">Dokument nadlimitowy</p>
              <p className="text-xs text-red-700 mt-0.5">Ten dokument przekracza limit KPiR Twojego pakietu. Wymaga dodatkowej opłaty.</p>
              <button onClick={() => { navigate('/uslugi'); onClose() }} className="text-xs font-medium text-red-700 underline mt-1">Dokup pakiet →</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <DetailField label="Numer faktury" value={inv.number} mono />
          <DetailField label="Kontrahent" value={inv.contractor} />
          <DetailField label="NIP" value={inv.nip} mono />
          <DetailField label="Typ" value={inv.type === 'zakupowa' ? 'Faktura zakupowa' : 'Faktura sprzedażowa'} />
          <DetailField label="Data wystawienia" value={inv.date} />
          <DetailField label="Termin płatności" value={inv.dueDate} />
        </div>

        <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-[11px] text-gray-500">Netto</p>
            <p className="text-base font-bold text-gray-800 mt-0.5">{pl(inv.netto)} zł</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-gray-500">VAT</p>
            <p className="text-base font-bold text-gray-800 mt-0.5">{pl(inv.vat)} zł</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-gray-500">Brutto</p>
            <p className="text-base font-bold text-brand mt-0.5">{pl(inv.brutto)} zł</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-gray-500 mb-1">Źródło</p>
            <Badge variant={inv.source === 'KSeF' ? 'green' : 'gray'} dot>{inv.source}</Badge>
          </div>
          {inv.ksef_id && (
            <DetailField label="ID KSeF" value={inv.ksef_id} mono />
          )}
          <div>
            <p className="text-[11px] text-gray-500 mb-1">XML KSeF</p>
            <Badge variant="green" dot>zarchiwizowany</Badge>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-1">UPO</p>
            <Badge variant={inv.upo_status === 'dostepne' ? 'green' : 'yellow'} dot>
              {inv.upo_status === 'dostepne' ? 'dostępne' : 'oczekuje'}
            </Badge>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-1">Etap księgowy</p>
            <p className="text-xs font-medium text-gray-800">{inv.accountingStage}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-1">Status</p>
            <InvoiceStatusBadge status={inv.status} />
          </div>
        </div>

        {inv.description && (
          <div>
            <p className="text-[11px] text-gray-500 mb-1">Opis</p>
            <p className="text-xs text-gray-700 bg-gray-50 rounded-lg p-3">{inv.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <Button variant="outline" size="sm" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => toast('info', 'Podgląd dokumentu — demo (brak pliku)')}>
            Podgląd dokumentu
          </Button>
          <Button variant="outline" size="sm" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => toast('info', 'Opis zapisany — demo')}>
            Dodaj opis
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast('info', 'Oznaczono jako nie księguj')}>
            Nie księguj
          </Button>
          {!inv.isOverLimit && (
            <Button size="sm" onClick={() => { toast('success', 'Przekazano do księgowania.'); onClose() }}>
              Przekaż do księgowania
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-gray-500 mb-0.5">{label}</p>
      <p className={`text-xs font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}
