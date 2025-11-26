# Highlights Approval Workflow

## Opisanie Systému

Minecraft server highlights sú teraz chránené admin approval workflowom. Len schválené highlights sa zobrazia verejnosti na Home page.

## Workflow

### 1. Nahratie Highlights
- Admin sa prihlási do Administrátorského panelu (`/admin`)
- Login: `Admin` / `mcserver256i`
- V sekcii **"Nahrať Highlight"** nahrá obrázok alebo video s popisom
- Highlight sa vytvorí v databáze so statusom **"Čakajúce na schválenie"**

### 2. Prehliadnutie Čakajúcich
- V Admin paneli sa zobrazí sekcia **"Čakajúce na schválenie"**
- Zobrazí sa grid s thumbnailami nevardených highlightov
- Každý highlight ukazuje:
  - Obrázok/video preview
  - Názov a popis
  - Meno hráča, ktorý ho nahral

### 3. Schválenie alebo Odmietnutie
- Admin klikne **"Schváliť"** - highlight sa označí ako schválený a objaví sa v sekcii "Schválené Highlights"
- Admin klikne **"Vymazať"** - highlight sa zmaže z databázy

### 4. Verejný Displej
- Len schválené highlights sa fetujú z API (`GET /api/highlights`)
- Verejnosť ich vidí na Home page v **"Highlights Gallery"** na pravej strane
- Gallery je scrollovateľná s modalnou preview

## Technické Detaily

### Backend API Endpointy

#### GET /api/highlights
- **Použitie**: Verejný - načítať schválené highlights
- **Výstup**: Pole schválených highlights (approved: true)
- **Zobrazenie**: Home page - HighlightsGallery komponent

#### GET /api/highlights/pending/all
- **Použitie**: Admin - načítať čakajúce a schválené highlights
- **Parametre**: `username=Admin&password=mcserver256i`
- **Výstup**: `{ pending: [...], approved: [...] }`
- **Zobrazenie**: Admin panel

#### POST /api/highlights/:id/approve
- **Použitie**: Admin - schváliť highlight
- **Telo**: `{ username: 'Admin', password: 'mcserver256i' }`
- **Akcia**: Nastaví `approved: true`, `approvedBy: 'Admin'`, `approvedAt: Date`

#### POST /api/highlights
- **Použitie**: Nahrať nový highlight
- **Telo**: FormData s file, title, description, uploadedBy
- **Výstup**: Nový highlight so `approved: false`

#### DELETE /api/highlights/:id
- **Použitie**: Admin - vymazať highlight
- **Telo**: `{ username: 'Admin', password: 'mcserver256i' }`
- **Akcia**: Vymaže highlight z databázy

### MongoDB Schema

```javascript
Highlights: {
  title: String,
  description: String,
  fileType: String,
  filePath: String,
  uploadedBy: String,
  uploadedAt: Date,
  featured: Boolean,
  approved: Boolean,        // NEW - default false
  approvedBy: String,       // NEW - admin username
  approvedAt: Date          // NEW - approval timestamp
}
```

### Frontend Komponenty

#### Admin.js
- Prihlasovací formulár
- Highlights Upload sekcia (drag-drop)
- Pending Highlights grid (s approve/delete tlačidlami)
- Approved Highlights grid (s delete tlačidlami)
- Whitelist management tabuľka

#### Home.js
- HighlightsGallery na pravej strane (sticky)
- Zobrazuje len schválené highlights
- Modal preview na klik

## Bezpečnosť

- Admin credentials: `Admin` / `mcserver256i`
- Len admin može nahrať highlights (v Admin paneli)
- Len admin może schváliť highlights
- Verejnosť vidí len schválené highlights
- File upload chránený - server filtruje MIME typy

## Stavy Highlights

| Stav | Viditeľnosť | Akcie |
|------|------------|-------|
| Pending (approved: false) | Admin panel len | Schváliť/Vymazať |
| Approved (approved: true) | Home page + Admin | Vymazať |

