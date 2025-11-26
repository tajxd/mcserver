# 🚀 Deployment na Railway - Kompletný návod

## Príprava projektu

### 1. Vytvor GitHub repozitár

1. Choď na https://github.com/new
2. Vytvor nový repozitár (napr. `spse-minecraft-smp`)
3. Nechaj PUBLIC alebo PRIVATE (Railway funguje s oboma)
4. **NEVYTVÁRAJ** README, .gitignore (už máme)

### 2. Push kód na GitHub

Otvor **NOVÝ** PowerShell terminál v `C:\Users\micha\Desktop\mcserver`:

```powershell
# Prejdi do root adresára projektu
cd C:\Users\micha\Desktop\mcserver

# Inicializuj git (ak ešte nie je)
git init

# Pridaj všetky súbory
git add .

# Commitni zmeny
git commit -m "Initial commit - SPSE Minecraft SMP"

# Pridaj GitHub remote (NAHRAĎ 'YOUR_USERNAME' za tvoje GitHub meno)
git remote add origin https://github.com/YOUR_USERNAME/spse-minecraft-smp.git

# Push na GitHub
git branch -M main
git push -u origin main
```

## Railway Deployment

### 3. MongoDB Atlas Setup (ZADARMO)

1. Choď na https://www.mongodb.com/cloud/atlas/register
2. Vytvor účet (Google sign-in je najrýchlejší)
3. Vytvor nový cluster:
   - Vyber **M0 FREE tier**
   - Vyber región (napr. Frankfurt)
   - Cluster Name: `mcserver`
4. Vytvor Database User:
   - Username: `mcserveruser`
   - Password: **Vygeneruj strong password** (ulož si ho!)
5. Network Access:
   - Klikni "Add IP Address"
   - Vyber "Allow Access from Anywhere" (0.0.0.0/0)
6. Získaj Connection String:
   - Klikni "Connect"
   - "Connect your application"
   - Skopíruj connection string (vyzerá ako):
     ```
     mongodb+srv://mcserveruser:<password>@mcserver.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **NAHRAĎ `<password>` za tvoje heslo z kroku 4!**

### 4. Railway Backend Deployment

1. Choď na https://railway.app
2. Sign up s GitHub účtom
3. Klikni **"New Project"**
4. Vyber **"Deploy from GitHub repo"**
5. Autorizuj Railway pre GitHub
6. Vyber tvoj repozitár `spse-minecraft-smp`
7. Railway automaticky detekuje Node.js projekt

**Nastavenie Backend Service:**

8. Klikni na deployed service
9. Choď do **Settings** tabu
10. **Root Directory**: Nastav na `server`
11. **Start Command**: `npm start`
12. **Environment Variables** (klikni "Add Variable"):
   ```
   MONGODB_URI=mongodb+srv://mcserveruser:TVOJE_HESLO@mcserver.xxxxx.mongodb.net/mcserver?retryWrites=true&w=majority
   ADMIN_USERNAME=Admin
   ADMIN_PASSWORD=mcserver256i
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1443230431762710722/IeR1aj2Off5CeHf_ZgBFVHNyLe-K8k0GWmQ73CoqheZYx_VlnxovBwZO-Wb1VfS2d2tB
   DISCORD_PING_ID=652234052710957106
   PORT=5000
   ```

13. Klikni **"Deploy"**
14. Po deploy získaš URL (napr. `https://your-backend.up.railway.app`)
15. **ULOŽ SI TENTO URL!**

### 5. Railway Frontend Deployment

1. V tom istom Railway projekte, klikni **"New Service"**
2. Vyber **"GitHub Repo"** → Tvoj repozitár
3. **Settings**:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s build -l 3000`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.up.railway.app
   ```
   (Nahraď za URL z kroku 4.14)

5. Klikni **"Deploy"**

### 6. Aktualizuj Frontend API calls

V `client/src` súboroch treba upraviť axios aby volal production backend:

**Vytvor nový súbor `client/src/config.js`:**
```javascript
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

**Aktualizuj všetky axios calls** (v App.js, Admin.js, Home.js, atď.):
```javascript
import { API_URL } from './config';

// Namiesto
axios.post('/api/whitelist', data)

// Použi
axios.post(`${API_URL}/api/whitelist`, data)
```

**Alebo jednoduchšie - nastav axios base URL v `client/src/index.js`:**
```javascript
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

Push zmeny:
```powershell
git add .
git commit -m "Add production API URL"
git push
```

Railway automaticky re-deployuje!

### 7. Backend CORS Update

V `server/server.js` uprav CORS aby povolovalo frontend:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.up.railway.app'  // Pridaj Railway frontend URL
  ],
  credentials: true
}));
```

Push:
```powershell
git add server/server.js
git commit -m "Update CORS for production"
git push
```

## ✅ Hotovo!

Tvoja aplikácia je LIVE na:
- Frontend: `https://your-frontend.up.railway.app`
- Backend: `https://your-backend.up.railway.app`

## 🔧 Troubleshooting

### Backend sa nespustil
- Skontroluj logs v Railway dashboard
- Over či sú správne environment variables
- Over MongoDB connection string

### Frontend nezobrazuje data
- Skontroluj browser console (F12)
- Over či REACT_APP_API_URL je správne
- Over CORS nastavenia v backendu

### Database connection error
- Over MongoDB Atlas IP whitelist (0.0.0.0/0)
- Over či je heslo správne v connection stringu
- Over či database user existuje

## 💰 Ceny (Railway Free Tier)

- **$5 free credit** mesačne
- **500 hours** execution time
- **100 GB** bandwidth
- **100 GB** storage

Pre školský projekt je to **úplne zadarmo!**

## 🔄 Ako aktualizovať web

```powershell
# Urob zmeny v kóde
# Commitni a pushni
git add .
git commit -m "Tvoja zmena"
git push

# Railway automaticky re-deployuje!
```
