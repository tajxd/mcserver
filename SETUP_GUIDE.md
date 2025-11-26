# 🎮 SPŠE Minecraft Server Web - Spustenie

## ✅ Inštalácia je hotová!

Všetky závislosti sú nainštalované. Teraz môžete spustiť aplikáciu.

## 🚀 Rýchle spustenie

### Možnosť 1: Spustenie cez skript (Windows)
Dvakrát kliknite na `start.bat` alebo spustite v PowerShell:
```powershell
.\start.bat
```

### Možnosť 2: Manuálne spustenie (2 terminály)

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Backend sa spustí na: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
Frontend sa spustí na: `http://localhost:3000`

## 📋 Prihlasovanie do Admin Panelu

Na stránke prejdite na `/admin` a zadajte:
- **Používateľ:** `Admin`
- **Heslo:** `mcserver256i`

## 📝 Čo je nainštalované

### Backend (Node.js/Express)
- Express.js - Web framework
- MongoDB/Mongoose - Databáza
- CORS - Cross-origin requests
- Dotenv - Environment variables

### Frontend (React)
- React 18 - UI framework
- React Router - Navigácia
- Bootstrap 5 - Komponenty
- Axios - HTTP klient
- Font Awesome - Ikony

## 🎨 Minecraft Styling

- Zelené farby v Minecraft štýle
- Animácie a efekty
- Responzívny dizajn
- Bootstrap komponenty

## 📍 Časti aplikácie

### 🏠 Domov (`/`)
- Heroic sekcia
- Whitelist formulár
- Štatistika servera
- Features sekcia

### 📜 Pravidlá (`/rules`)
- Všeobecné pravidlá
- Survival gameplay pravidlá
- Informácie o módoch
- Stavby a vlastníctvo
- Eventy a postihy

### 🔐 Admin Panel (`/admin`)
- Prihlasovanie
- Správa whiteliste
- Štatistika hráčov
- Odstraňovanie z whiteliste

## 🔧 API Endpoints

```
GET  /api/whitelist
POST /api/whitelist
POST /api/admin/login
POST /api/admin/whitelist/:id
```

## 📂 Štruktúra Projektu

```
mcserver/
├── server/
│   ├── server.js        # Express server
│   ├── package.json     # Dependencies
│   └── .env            # Konfigurácia
├── client/
│   ├── src/
│   │   ├── components/  # React komponenty
│   │   ├── pages/       # Stránky
│   │   ├── App.js       # Hlavná aplikácia
│   │   └── index.css    # Globálne štýly
│   └── package.json    # Dependencies
└── README.md           # Dokumentácia
```

## ❓ Problémy pri spustení?

### Port 3000 alebo 5000 je už obsadený
Zmeň port v súbore `server/server.js` (PORT=5001) alebo `client/.env` (PORT=3001)

### MongoDB konexia zlyhá
- Skontroluj internetové pripojenie
- Overuj MongoDB URI v `server/.env`
- Uisti sa, že tá databáza existuje

### Node modules chyby
Skús vymazať a preinštalovať:
```bash
rm -r node_modules package-lock.json
npm install
```

## 🎯 Ďalšie kroky

1. ✅ Spustite aplikáciu
2. ✅ Otestujte whitelist formulár
3. ✅ Skúste admin panel (heslo: mcserver256i)
4. ✅ Prispôsobte pravidlá a informácie o serveri

---

**Zábava pri hre! 🎮**
