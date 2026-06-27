export type UserRole = 'client' | 'accountant' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  company: string
  avatar?: string
}

export interface Package {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  kpirLimit: number
  conferenceHours: number
  mailScans: number
  features: PackageFeature[]
}

export interface PackageFeature {
  category: string
  items: string[]
}

export interface PackageUsage {
  kpirUsed: number
  kpirLimit: number
  kpirOverLimit: number
  conferenceUsed: number
  conferenceLimit: number
  mailScansUsed: number
  mailScansLimit: number
  consultationAccountingAvailable: boolean
  consultationMarketingUsed: boolean
  logoStatus: 'pending' | 'in_progress' | 'done' | 'available'
  websiteStatus: 'pending' | 'in_progress' | 'done' | 'available'
}

export type InvoiceStatus = 'do_ksiegowania' | 'nie_ksieguj' | 'do_akceptacji' | 'nadlimit' | 'rozliczone'
export type InvoiceType = 'zakupowa' | 'sprzedazowa'
export type InvoiceSource = 'KSeF' | 'E-mail' | 'Skaner' | 'Ręczne'

export interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  contractor: string
  nip: string
  type: InvoiceType
  source: InvoiceSource
  netto: number
  vat: number
  brutto: number
  status: InvoiceStatus
  accountingStage: string
  description?: string
  ksef_id?: string
  upo_status: 'dostepne' | 'oczekuje' | 'brak'
  isOverLimit: boolean
}

export type RoomStatus = 'available' | 'occupied'

export interface ConferenceRoom {
  id: string
  name: string
  location: string
  capacity: number
  amenities: string[]
  pricePerHour: number
  imageColor: string
}

export type ReservationStatus =
  | 'nowe'
  | 'oczekuje_potwierdzenia'
  | 'oczekuje_platnosci'
  | 'potwierdzone'
  | 'zrealizowane'
  | 'anulowane'

export interface Reservation {
  id: string
  roomId: string
  roomName: string
  date: string
  timeFrom: string
  timeTo: string
  hours: number
  purpose: string
  status: ReservationStatus
  extraHours: number
  extraCost: number
}

export type NotificationType = 'info' | 'warning' | 'success' | 'action'
export type NotificationStatus = 'nowe' | 'przeczytane' | 'wymaga_akcji'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  status: NotificationStatus
  date: string
  action?: string
}

export type AddonCategory = 'Księgowość' | 'Sale konferencyjne' | 'Korespondencja' | 'Marketing' | 'IT' | 'HR'

export interface AddonService {
  id: string
  name: string
  description: string
  price: number
  category: AddonCategory
  popular?: boolean
}

export interface ClientSummary {
  id: string
  company: string
  package: string
  documents: number
  kpirLimit: number
  overLimit: number
  paymentStatus: 'oplacone' | 'oczekuje' | 'zaleglosci'
  accountingStatus: 'w_toku' | 'zakonczone' | 'wymaga_akcji'
}
