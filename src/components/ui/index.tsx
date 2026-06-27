import { clsx } from 'clsx'
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react'
import { useEffect } from 'react'

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}
export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div className={clsx('bg-white rounded-xl border border-gray-100 shadow-card', padding && 'p-5', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
const modalSizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative w-full bg-white rounded-2xl shadow-modal', modalSizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'warning' | 'info'

const toastIcons = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  error:   <XCircle className="w-4 h-4 text-red-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  info:    <Info className="w-4 h-4 text-blue-500" />,
}
const toastStyles = {
  success: 'border-emerald-200 bg-emerald-50',
  error:   'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info:    'border-blue-200 bg-blue-50',
}

interface ToastProps {
  type: ToastType
  message: string
  onClose: () => void
}
export function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl border shadow-modal text-sm font-medium text-gray-800 min-w-72 max-w-sm', toastStyles[type])}>
      {toastIcons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
    </div>
  )
}

// ─── Progress Bar ────────────────────────────────────────────────────────────
interface ProgressBarProps {
  used: number
  limit: number
  overLimit?: number
  label?: string
  showNumbers?: boolean
}
export function ProgressBar({ used, limit, overLimit = 0, label, showNumbers = true }: ProgressBarProps) {
  const pct = Math.min((used / limit) * 100, 100)
  const isOver = used >= limit
  return (
    <div className="space-y-1.5">
      {(label || showNumbers) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-gray-600">{label}</span>}
          {showNumbers && (
            <span className={clsx('text-xs font-medium', isOver ? 'text-red-600' : 'text-gray-700')}>
              {used} / {limit} {overLimit > 0 && <span className="text-red-500 ml-1">(+{overLimit} nadlimit)</span>}
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', isOver ? 'bg-red-400' : 'bg-brand')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">{icon}</div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  )
}
