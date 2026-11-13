# ESP32 Custom Server

IoT projekat koji povezuje ESP32-C6, Node.js/Express backend i Angular frontend.

```text
Angular
   ↓ HTTP
Node.js / Express
   ↓ HTTP
ESP32-C6
   ↓
RGB LED
```

## Struktura projekta

```text
project/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   └── esp32-rgb-ui/
│
├── .gitignore
└── README.md
```

## 1. Pokretanje ESP32

ESP32 firmware je Arduino projekat.

1. Povezati ESP32-C6 USB kablom.
2. Otvoriti Arduino IDE.
3. Izabrati odgovarajući ESP32 port:
   - `Tools → Port → COM4`
4. **Nije potrebno ponovo uploadovati kod** ako je firmware već na pločici. Dovoljno je priključiti pločicu i sačekati da se pokrene.
5. Otvoriti Serial Monitor na `115200 baud`.

Očekivani izlaz:

```text
Connecting to Wi-Fi...
........
Wi-Fi connected!
IP address: 192.168.1.xxx
HTTP server started
```

IP adresu ESP32 treba zapamtiti jer je potrebna backendu.

Ako je potrebno ponovo uploadovati firmware, otvoriti Arduino projekat i koristiti `Upload`.

## 2. Provera ESP32

U browseru otvoriti:

```text
http://ESP32-IP/
```

Primer:

```text
http://192.168.1.102/
```

Status uređaja:

```text
http://ESP32-IP/api/status
```

Primer odgovora:

```json
{
  "device": "esp32-c6",
  "ip": "192.168.1.102",
  "uptime": 125,
  "wifiSignal": -48,
  "color": {
    "r": 255,
    "g": 0,
    "b": 0
  }
}
```

## 3. Pokretanje Node.js backenda

Otvoriti terminal u rootu projekta:

```bash
cd backend
```

Ako je potrebno instalirati dependencies:

```bash
npm install
```

Pokrenuti server:

```bash
node server.js
```

Očekivano:

```text
Server running on http://localhost:3000
```

### ESP32 IP adresa

U `backend/server.js` proveriti:

```javascript
const ESP32_URL = "http://192.168.1.102";
```

Ako ESP32 dobije drugu IP adresu, promeniti ovu vrednost i restartovati backend.

Provera backenda:

```text
http://localhost:3000
```

Status:

```text
http://localhost:3000/api/status
```

## 4. Pokretanje Angular frontenda

Otvoriti **novi terminal** i iz root foldera projekta:

```bash
cd frontend/esp32-rgb-ui
```

Ako je potrebno:

```bash
npm install
```

Pokrenuti Angular:

```bash
npx ng serve
```

Frontend će biti dostupan na:

```text
http://localhost:4200
```

## Redosled pokretanja

Svaki put kada se projekat ponovo pokreće:

### Terminal 1 — ESP32

```text
USB → ESP32
↓
Wi-Fi
↓
HTTP server
```

Proveriti IP adresu preko Serial Monitora.

### Terminal 2 — Backend

```bash
cd backend
node server.js
```

### Terminal 3 — Frontend

```bash
cd frontend/esp32-rgb-ui
npx ng serve
```

Zatim otvoriti:

```text
http://localhost:4200
```

## Brza provera

Ako nešto ne radi, proveravati redom:

1. **ESP32** — da li se povezao na Wi-Fi?
2. **ESP32 `/api/status`** — da li direktno vraća JSON?
3. **Backend `/api/status`** — da li Node može da komunicira sa ESP32?
4. **Angular** — da li dashboard prikazuje uređaj kao Online?

Ako se promenila IP adresa ESP32, ažurirati `ESP32_URL` u `backend/server.js`.