import { clsx } from 'clsx'

type Variant = 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'purple' | 'orange'

const styles: Record<Variant, string> = {
  green:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  red:    'bg-red-50 text-red-700 ring-1 ring-red-200',
  yellow: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  blue:   'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  gray:   'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  purple: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  orange: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
}

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export function Badge({ variant = 'gray', children, className, dot }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', styles[variant], className)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', {
        'bg-emerald-500': variant === 'green',
        'bg-red-500': variant === 'red',
        'bg-amber-500': variant === 'yellow',
        'bg-blue-500': variant === 'blue',
        'bg-gray-400': variant === 'gray',
        'bg-violet-500': variant === 'purple',
        'bg-orange-500': variant === 'orange',
      })} />}
      {children}
    </span>
  )
}

export function InvoiceStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: Variant }> = {
    do_ksiegowania:  { label: 'Do księgowania', variant: 'blue' },
    nie_ksieguj:     { label: 'Nie księguj', variant: 'gray' },
    do_akceptacji:   { label: 'Do akceptacji', variant: 'yellow' },
    nadlimit:        { label: 'Nadlimit', variant: 'red' },
    rozliczone:      { label: 'Rozliczone', variant: 'green' },
  }
  const cfg = map[status] ?? { label: status, variant: 'gray' as Variant }
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}

export function ReservationStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: Variant }> = {
    nowe:                    { label: 'Nowe zapytanie', variant: 'blue' },
    oczekuje_potwierdzenia:  { label: 'Oczekuje potwierdzenia', variant: 'yellow' },
    oczekuje_platnosci:      { label: 'Oczekuje płatności', variant: 'orange' },
    potwierdzone:            { label: 'Potwierdzone', variant: 'green' },
    zrealizowane:            { label: 'Zrealizowane', variant: 'gray' },
    anulowane:               { label: 'Anulowane', variant: 'red' },
  }
  const cfg = map[status] ?? { label: status, variant: 'gray' as Variant }
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}
