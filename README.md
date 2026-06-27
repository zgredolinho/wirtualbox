# WirtualBOX — Demo Panel Klienta

Demo front-endowe panelu klienta dla projektu WirtualBOX / wirtualbox.pl.

## ⚠️ Informacja o wersji demo

- To jest **demo front-endowe** — brak backendu
- KSeF jest **symulowany** — brak prawdziwej integracji
- Przelewy24 jest **symulowane** — żadne płatności nie są realizowane
- Dane są **mockowane** lokalnie w TypeScript
- Brak prawdziwego logowania — symulacja
- Brak realnego przechowywania danych (poza sesją React)
- Celem jest prezentacja **UX, procesów biznesowych i architektury funkcjonalnej**

## Wymagania

- Node.js 18+
- npm 9+

## Instalacja i uruchomienie

```bash
# 1. Instalacja zależności
npm install

# 2. Uruchomienie dev server
npm run dev

# Aplikacja dostępna pod: http://localhost:5173
```

## Build i preview

```bash
# Build produkcyjny
npm run build

# Preview builda lokalnie
npm run preview
```

## Dane logowania demo

| Rola | E-mail | Hasło |
|------|--------|-------|
| Klient | klient@demo.pl | (dowolne) |
| Księgowość | admin@demo.pl | (dowolne) |

## Deploy na Netlify

### Metoda 1 — Drag & drop
1. `npm run build`
2. Przeciągnij folder `dist/` na [netlify.com/drop](https://app.netlify.com/drop)

### Metoda 2 — GitHub + Netlify
1. Wgraj projekt na GitHub
2. Połącz repo z Netlify
3. Ustawienia buildu:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy automatyczny przy każdym push

Plik `netlify.toml` zawiera konfigurację SPA redirects — działa out of the box.

## Struktura projektu

```
src/
├── components/
│   ├── layout/        # Sidebar, Topbar, AppLayout
│   ├── modules/       # DemoPanel (scenariusz prezentacji)
│   └── ui/            # Badge, Button, Card, Modal, Toast
├── data/
│   └── mockData.ts    # Wszystkie dane mockowane
├── hooks/
│   ├── useApp.tsx     # Kontekst aplikacji (auth, stan globalny)
│   └── useToast.tsx   # System powiadomień toast
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── FakturyPage.tsx     # Główny widok KSeF
│   ├── PakietPage.tsx
│   ├── UslugiPage.tsx      # Z symulacją Przelewy24
│   ├── SalePage.tsx        # Rezerwacja z nadlimitem
│   └── OtherPages.tsx      # Powiadomienia, Księgowość, Ustawienia
├── types/
│   └── index.ts       # TypeScript types
├── App.tsx            # Router
└── main.tsx           # Entry point
```

## Funkcjonalności demo

- ✅ Ekran logowania z danymi demo
- ✅ Dashboard z kartami pakietu, limitami i alertami
- ✅ KSeF / Faktury — tabela z filtrami, statusami, nadlimitem
- ✅ Szczegóły faktury — modal z pełnymi danymi
- ✅ Pakiety BOX — 3 plany z porównaniem
- ✅ Usługi dodatkowe — symulacja zakupu przez Przelewy24
- ✅ Sale konferencyjne — rezerwacja z wykryciem nadlimitu godzin
- ✅ Powiadomienia — lista z typami i statusami
- ✅ Panel księgowości — lista klientów z limitami
- ✅ Ustawienia — dane firmy, KSeF, użytkownicy, bezpieczeństwo
- ✅ Tryb demo — scenariusz prezentacji krok po kroku
- ✅ Toasty z feedbackiem po każdej akcji
- ✅ Responsywny design — desktop i mobile
