# Príklady API

## Pridanie hráča na whitelist

### Request
```http
POST /api/whitelist
Content-Type: application/json

{
  "minecraftName": "Steve"
}
```

### Response (úspešne)
```json
{
  "success": true,
  "message": "Úspešne ste sa pridali na whitelist!",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k",
    "minecraftName": "Steve",
    "addedAt": "2025-11-25T10:30:00.000Z"
  }
}
```

### Response (chyba)
```json
{
  "error": "Toto meno je už na whiteliste"
}
```

## Získanie všetkých hráčov

### Request
```http
GET /api/whitelist
```

### Response
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k",
    "minecraftName": "Steve",
    "addedAt": "2025-11-25T10:30:00.000Z"
  },
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0l",
    "minecraftName": "Alex",
    "addedAt": "2025-11-25T11:45:00.000Z"
  }
]
```

## Admin prihlasovanie

### Request
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "Admin",
  "password": "mcserver256i"
}
```

### Response (úspešne)
```json
{
  "success": true,
  "token": "admin_token_1732467000000"
}
```

### Response (chyba)
```json
{
  "error": "Nesprávne prihlasovacie údaje"
}
```

## Vymazanie hráča z whiteliste

### Request
```http
POST /api/admin/whitelist/65a1b2c3d4e5f6g7h8i9j0k
Content-Type: application/json

{
  "username": "Admin",
  "password": "mcserver256i"
}
```

### Response (úspešne)
```json
{
  "success": true,
  "message": "Položka vymazaná"
}
```

---

**Poznámka:** Všetky API requesty sa odosielajú v JSON formáte.
