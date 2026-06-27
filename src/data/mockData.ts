import type {
  User, Package, PackageUsage, Invoice, ConferenceRoom,
  Reservation, Notification, AddonService, ClientSummary
} from '../types'

export const USERS: User[] = [
  { id: '1', email: 'klient@demo.pl', name: 'Katarzyna Wójtas', role: 'client', company: 'Firma Demo Sp. z o.o.' },
  { id: '2', email: 'admin@demo.pl', name: 'Marcin Kowalski', role: 'accountant', company: 'WirtualBOX' },
]

export const PACKAGES: Package[] = [
  {
    id: 'start',
    name: 'BOX na Start',
    priceMonthly: 592,
    priceYearly: 6512,
    kpirLimit: 5,
    conferenceHours: 0,
    mailScans: 0,
    features: [
      { category: 'Wirtualne biuro', items: ['Adres do rejestracji', 'Obsługa korespondencji', 'Powiadomienia e-mail o korespondencji'] },
      { category: 'Księgowość', items: ['5 wpisów do KPiR', 'Pomoc przy założeniu działalności', '1× konsultacje księgowe'] },
      { category: 'Marketing', items: ['Projekt logo', 'Projekt strony WWW', '1× konsultacje marketingowe'] },
    ]
  },
  {
    id: 'wymagajacy',
    name: 'BOX dla Wymagających',
    priceMonthly: 833,
    priceYearly: 9163,
    kpirLimit: 10,
    conferenceHours: 2,
    mailScans: 10,
    features: [
      { category: 'Wirtualne biuro', items: ['Adres do rejestracji', 'Obsługa korespondencji', 'Powiadomienia e-mail o korespondencji', '2h salki konferencyjnej', '10× skany korespondencji'] },
      { category: 'Księgowość', items: ['10 wpisów do KPiR', 'Pomoc przy założeniu działalności', '1× konsultacje księgowe'] },
      { category: 'Marketing', items: ['Projekt logo', 'Projekt strony WWW', '1× konsultacje marketingowe'] },
    ]
  },
  {
    id: 'vip',
    name: 'BOX VIP',
    priceMonthly: 1427,
    priceYearly: 15697,
    kpirLimit: 30,
    conferenceHours: 4,
    mailScans: 10,
    features: [
      { category: 'Wirtualne biuro', items: ['Adres do rejestracji', 'Obsługa korespondencji', 'Powiadomienia e-mail o korespondencji', '4h salki konferencyjnej', '10× skany korespondencji', 'Dedykowany numer telefoniczny'] },
      { category: 'Księgowość', items: ['30 wpisów do KPiR', 'Pomoc przy założeniu działalności', '1× konsultacje księgowe'] },
      { category: 'Marketing', items: ['Projekt logo', 'Projekt strony WWW', '1× konsultacje marketingowe'] },
      { category: 'IT', items: ['1× konsultacje IT', '1× slot na dysk sieciowy'] },
      { category: 'HR', items: ['Stworzenie profili kadrowych do 10 osób', '1× konsultacje HR'] },
    ]
  }
]

export const ACTIVE_PACKAGE_ID = 'wymagajacy'

export const PACKAGE_USAGE: PackageUsage = {
  kpirUsed: 10,
  kpirLimit: 10,
  kpirOverLimit: 5,
  conferenceUsed: 1,
  conferenceLimit: 2,
  mailScansUsed: 8,
  mailScansLimit: 10,
  consultationAccountingAvailable: true,
  consultationMarketingUsed: true,
  logoStatus: 'in_progress',
  websiteStatus: 'available',
}

const makeInvoice = (
  id: string, number: string, date: string, contractor: string, nip: string,
  type: Invoice['type'], source: Invoice['source'],
  netto: number, vatRate: number,
  status: Invoice['status'], stage: string,
  isOverLimit: boolean, desc?: string
): Invoice => {
  const vat = Math.round(netto * vatRate)
  return {
    id, number, date,
    dueDate: date.replace(/(\d+)$/, (d) => String(Number(d) + 14).padStart(2, '0')),
    contractor, nip, type, source, netto, vat, brutto: netto + vat, status,
    accountingStage: stage,
    description: desc,
    ksef_id: source === 'KSeF' ? `KSeF/${id}/2025` : undefined,
    upo_status: source === 'KSeF' ? 'dostepne' : 'brak',
    isOverLimit,
  }
}

export const INVOICES: Invoice[] = [
  makeInvoice('1','FV/2025/07/0001','2025-07-02','Allegro Sp. z o.o.','7272997474','zakupowa','KSeF',1200,0.23,'do_ksiegowania','Oczekuje na opis',false),
  makeInvoice('2','FV/2025/07/0002','2025-07-03','Media Expert','5252248639','zakupowa','KSeF',850,0.23,'do_ksiegowania','Przekazano do ksiąg',false,'Sprzęt biurowy'),
  makeInvoice('3','FV/2025/07/0003','2025-07-04','Orlen S.A.','7393831266','zakupowa','E-mail',420,0.23,'do_ksiegowania','Oczekuje na opis',false),
  makeInvoice('4','FV/2025/07/0004','2025-07-05','T-Mobile Polska','5260251211','zakupowa','KSeF',199,0.23,'do_ksiegowania','Przekazano do ksiąg',false,'Abonament telefoniczny'),
  makeInvoice('5','FV/2025/07/0005','2025-07-07','Play Communications','8392990120','zakupowa','KSeF',89,0.23,'do_ksiegowania','Oczekuje na opis',false),
  makeInvoice('6','FS/2025/07/0001','2025-07-08','ABC Trading Sp. z o.o.','5250008728','sprzedazowa','KSeF',3500,0.23,'rozliczone','Zaksięgowano',false,'Usługi konsultingowe'),
  makeInvoice('7','FV/2025/07/0006','2025-07-09','Amazon EU SARL','9999999999','zakupowa','KSeF',560,0.23,'do_ksiegowania','Przekazano do ksiąg',false,'Subskrypcja AWS'),
  makeInvoice('8','FV/2025/07/0007','2025-07-10','InPost S.A.','7592201547','zakupowa','Skaner',45,0.23,'do_akceptacji','Oczekuje na akceptację',false),
  makeInvoice('9','FS/2025/07/0002','2025-07-11','XYZ Consulting','1234567890','sprzedazowa','KSeF',2800,0.23,'rozliczone','Zaksięgowano',false),
  makeInvoice('10','FV/2025/07/0008','2025-07-12','Empik S.A.','5210035453','zakupowa','E-mail',180,0.23,'nie_ksieguj','Wykluczone',false,'Literatura branżowa — do wykluczenia'),
  // over-limit (5 docs)
  makeInvoice('11','FV/2025/07/0009','2025-07-14','Microsoft Sp. z o.o.','5270103391','zakupowa','KSeF',1099,0.23,'nadlimit','Oczekuje na dopłatę',true,'Microsoft 365 Business'),
  makeInvoice('12','FV/2025/07/0010','2025-07-15','Google Ireland Ltd','9999000001','zakupowa','KSeF',350,0.23,'nadlimit','Oczekuje na dopłatę',true,'Google Workspace'),
  makeInvoice('13','FV/2025/07/0011','2025-07-16','Notion Labs Inc','9999000002','zakupowa','KSeF',120,0.23,'nadlimit','Oczekuje na dopłatę',true,'Notion Team'),
  makeInvoice('14','FV/2025/07/0012','2025-07-17','Figma Inc','9999000003','zakupowa','KSeF',440,0.23,'nadlimit','Oczekuje na dopłatę',true,'Figma Professional'),
  makeInvoice('15','FV/2025/07/0013','2025-07-18','Slack Technologies','9999000004','zakupowa','KSeF',280,0.23,'nadlimit','Oczekuje na dopłatę',true,'Slack Pro — nadlimitowy'),
]

export const CONFERENCE_ROOMS: ConferenceRoom[] = [
  { id: '1', name: 'Sala Bursztyn', location: 'ul. Poznańska 12, Swarzędz — parter', capacity: 10, amenities: ['Stół konferencyjny', 'Telewizor 65"', 'Flipchart', 'Klimatyzacja', 'Wi-Fi'], pricePerHour: 80, imageColor: '#0f7c5a' },
  { id: '2', name: 'Sala Amber', location: 'ul. Poznańska 12, Swarzędz — I piętro', capacity: 6, amenities: ['Stół owalny', 'Projektor', 'Tablica suchościeralna', 'Klimatyzacja', 'Wi-Fi', 'Ekspres do kawy'], pricePerHour: 60, imageColor: '#2563eb' },
  { id: '3', name: 'Sala Topaz', location: 'ul. Poznańska 12, Swarzędz — II piętro', capacity: 4, amenities: ['Stół roboczy', 'Monitor 32"', 'Tablica suchościeralna', 'Wi-Fi'], pricePerHour: 45, imageColor: '#7c3aed' },
]

export const RESERVATIONS: Reservation[] = [
  { id: '1', roomId: '1', roomName: 'Sala Bursztyn', date: '2025-07-22', timeFrom: '10:00', timeTo: '12:00', hours: 2, purpose: 'Spotkanie z klientem', status: 'zrealizowane', extraHours: 0, extraCost: 0 },
  { id: '2', roomId: '2', roomName: 'Sala Amber', date: '2025-07-28', timeFrom: '14:00', timeTo: '16:00', hours: 2, purpose: 'Szkolenie wewnętrzne', status: 'potwierdzone', extraHours: 0, extraCost: 0 },
]

export const NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Pobrano dokumenty z KSeF', message: 'Pobrano 15 dokumentów z KSeF za lipiec 2025. Sprawdź listę faktur.', type: 'info', status: 'przeczytane', date: '2025-07-19 08:14' },
  { id: '2', title: 'Przekroczono limit KPiR', message: 'Przekroczono limit 10 wpisów do KPiR o 5 dokumentów. Wymagana dopłata za nadlimit.', type: 'warning', status: 'wymaga_akcji', date: '2025-07-19 08:15', action: 'Dokup pakiet' },
  { id: '3', title: 'Dokup pakiet dokumentów', message: 'Aby przekazać 5 dokumentów nadlimitowych do księgowania, dokup pakiet 5 wpisów do KPiR.', type: 'action', status: 'wymaga_akcji', date: '2025-07-19 08:16', action: 'Przejdź do usług' },
  { id: '4', title: 'Rezerwacja sali oczekuje', message: 'Rezerwacja Sali Amber na 28.07.2025 oczekuje na potwierdzenie przez WirtualBOX.', type: 'info', status: 'nowe', date: '2025-07-18 14:30' },
  { id: '5', title: 'Płatność zakończona pomyślnie', message: 'Płatność za pakiet BOX dla Wymagających (833,00 zł) zakończona pomyślnie. Dziękujemy!', type: 'success', status: 'przeczytane', date: '2025-07-01 09:00' },
  { id: '6', title: 'Dokument wymaga opisu', message: 'Księgowość oznaczyła fakturę FV/2025/07/0001 jako wymagającą opisu od klienta.', type: 'action', status: 'wymaga_akcji', date: '2025-07-17 11:22', action: 'Dodaj opis' },
  { id: '7', title: 'Synchronizacja KSeF zakończona', message: 'Synchronizacja z KSeF zakończona. Pobrano 3 nowe dokumenty.', type: 'success', status: 'przeczytane', date: '2025-07-16 07:00' },
  { id: '8', title: 'Konsultacja księgowa dostępna', message: 'Twoja miesięczna konsultacja księgowa jest dostępna. Umów termin.', type: 'info', status: 'nowe', date: '2025-07-15 10:00', action: 'Umów termin' },
]

export const ADDON_SERVICES: AddonService[] = [
  { id: '1', name: 'Dodatkowe 5 wpisów do KPiR', description: 'Rozszerz limit KPiR o 5 dokumentów w bieżącym miesiącu.', price: 120, category: 'Księgowość', popular: true },
  { id: '2', name: 'Dodatkowe 10 wpisów do KPiR', description: 'Rozszerz limit KPiR o 10 dokumentów w bieżącym miesiącu.', price: 210, category: 'Księgowość' },
  { id: '3', name: 'Dodatkowa godzina sali konferencyjnej', description: 'Jedna godzina rezerwacji dowolnej sali konferencyjnej.', price: 80, category: 'Sale konferencyjne' },
  { id: '4', name: 'Pakiet 3 godzin sali konferencyjnej', description: 'Trzy godziny w najlepszej cenie — idealne na szkolenie.', price: 210, category: 'Sale konferencyjne' },
  { id: '5', name: 'Dodatkowe 10 skanów korespondencji', description: 'Skanowanie i przesyłanie korespondencji — pakiet 10 sztuk.', price: 60, category: 'Korespondencja' },
  { id: '6', name: 'Konsultacja księgowa', description: '60 minut konsultacji z doświadczonym księgowym WirtualBOX.', price: 200, category: 'Księgowość' },
  { id: '7', name: 'Konsultacja marketingowa', description: '60 minut konsultacji z ekspertem marketingu cyfrowego.', price: 180, category: 'Marketing' },
  { id: '8', name: 'Konsultacja IT', description: '60 minut konsultacji technicznej z ekspertem IT.', price: 220, category: 'IT' },
  { id: '9', name: 'Konsultacja HR', description: '60 minut konsultacji kadrowo-płacowych.', price: 190, category: 'HR' },
  { id: '10', name: 'Rozszerzenie pakietu do BOX VIP', description: 'Przejdź na najwyższy pakiet i zyskaj dostęp do wszystkich funkcji.', price: 594, category: 'Księgowość', popular: true },
]

export const CLIENT_SUMMARIES: ClientSummary[] = [
  { id: '1', company: 'Firma Demo Sp. z o.o.', package: 'BOX dla Wymagających', documents: 15, kpirLimit: 10, overLimit: 5, paymentStatus: 'oczekuje', accountingStatus: 'wymaga_akcji' },
  { id: '2', company: 'Alfa Consulting Sp. z o.o.', package: 'BOX VIP', documents: 24, kpirLimit: 30, overLimit: 0, paymentStatus: 'oplacone', accountingStatus: 'w_toku' },
  { id: '3', company: 'Nowy Start JDG', package: 'BOX na Start', documents: 7, kpirLimit: 5, overLimit: 2, paymentStatus: 'oczekuje', accountingStatus: 'wymaga_akcji' },
  { id: '4', company: 'TechPark Solutions', package: 'BOX VIP', documents: 18, kpirLimit: 30, overLimit: 0, paymentStatus: 'oplacone', accountingStatus: 'zakonczone' },
  { id: '5', company: 'Kwiat & Styl', package: 'BOX na Start', documents: 4, kpirLimit: 5, overLimit: 0, paymentStatus: 'oplacone', accountingStatus: 'w_toku' },
]
