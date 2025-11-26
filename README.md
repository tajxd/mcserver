# SPŠE Minecraft Server Web

Profesionálna webová stránka pre školský Minecraft SMP server s React frontend a Node.js backend.

## Vlastnosti

- 🎮 Moderné UI s Minecraft stylingom
- 🟢 Zelené barvy v Minecraft štýle s animáciami
- 📱 Plne responzívny dizajn
- 🛡️ Admin panel s autentifikáciou
- 📝 Whitelist manažment cez MongoDB
- ⚡ Express backend API
- 🚀 Bootstrap komponenty
- 🎬 **NEW**: Highlights system s admin approval workflowom
  - Admin nahrávanie obrázkov/videí
  - Pending highlights review
  - Verejný displej schválených highlights
  - Modal preview gallery

## Inštalácia

### Prerequisites
- Node.js v16+
- MongoDB (alebo MongoDB Atlas)

### Backend Setup

```bash
cd server
npm install
```

Vyplň `.env` soubor s tvojimi údajmi:
```
MONGODB_URI=mongodb+srv://matusquan_db_user:dhHHkOLpqJ8HYx4E@cluster0.gc4l9yj.mongodb.net/?appName=Cluster0
PORT=5000
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=mcserver256i
```

Spustenie servera:
```bash
npm start
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

Server sa spustí na `http://localhost:3000`

## Prihlasovanie do Admin Panelu

- **Používateľ:** Admin
- **Heslo:** mcserver256i

## API Endpoints

- `GET /api/whitelist` - Zoznam všetkých hráčov na whiteliste
- `POST /api/whitelist` - Pridaj hráča na whitelist
- `POST /api/admin/login` - Admin prihlasovanie
- `POST /api/admin/whitelist/:id` - Vymaž hráča (vyžaduje admin)

## Štruktúra Projektu

```
mcserver/
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.css
│   └── package.json
```

## Technológie

- **Frontend:** React, Bootstrap, Axios
- **Backend:** Express.js, MongoDB, Mongoose
- **Styling:** CSS3, Bootstrap 5
- **Animácie:** CSS Animations

## Pravidlá

Všetky pravidlá sú uvedené v `/rules` sekcii webovej stránky.

## Licencia

Všetky práva vyhradené © 2025 SPŠE Minecraft SMP
