# MongoDB Schéma

## Whitelist Kolekcia

```javascript
{
  _id: ObjectId,
  minecraftName: String (required, unique),
  addedAt: Date (default: current date)
}
```

### Príklad dokumentu:
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k"),
  "minecraftName": "Steve",
  "addedAt": ISODate("2025-11-25T10:30:00.000Z")
}
```

## MongoDB Index

```javascript
db.whitelists.createIndex({ minecraftName: 1 }, { unique: true })
```

## Validácia

- **minecraftName:** 
  - Dĺžka: 3-16 znakov
  - Znaky: a-z, A-Z, 0-9, _, -
  - Povinné pole
  - Unikátne

---

**Databáza:** MongoDB Atlas  
**Connection String:** Viď `.env` súbor
