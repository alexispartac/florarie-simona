# ngrok Setup pentru Testing Local euPlatesc

## Problema

**localhost nu este accesibil din internet!**

euPlatesc trebuie să trimită callback-uri la serverul tău, dar `http://localhost:3000` funcționează doar pe computerul tău local.

## Soluția: ngrok

ngrok creează un tunel public către localhost-ul tău, permițând euPlatesc să trimită callback-uri.

## Setup Rapid

### 1. Instalează ngrok

```bash
# macOS cu Homebrew:
brew install ngrok

# SAU descarcă de pe:
https://ngrok.com/download
```

### 2. Pornește serverul Next.js

```bash
npm run dev
# Serverul rulează pe http://localhost:3000
```

### 3. Pornește ngrok (într-un terminal NOU)

```bash
ngrok http 3000
```

Vei vedea output similar cu:

```
Session Status                online
Version                       3.x.x
Forwarding                    https://abc123xyz.ngrok.io -> http://localhost:3000
                              ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                              COPIAZĂ ACEST URL!
```

### 4. Configurează variabila de environment

Adaugă în fișierul `.env.local`:

```bash
# URL public pentru euPlatesc callbacks
NEXT_PUBLIC_BASE_URL=https://abc123xyz.ngrok.io
```

**IMPORTANT:** Înlocuiește `abc123xyz` cu URL-ul tău real de la ngrok!

### 5. Restartează serverul Next.js

```bash
# Oprește serverul (Ctrl+C) și pornește-l din nou:
npm run dev
```

### 6. Testează plata

Acum când faci o plată:
1. euPlatesc va trimite callback la: `https://abc123xyz.ngrok.io/api/euplatesc/callback`
2. ngrok va forwarda request-ul la: `http://localhost:3000/api/euplatesc/callback`
3. Serverul tău va procesa callback-ul ✅

## Verificare ngrok

Deschide în browser:
```
http://127.0.0.1:4040
```

Aici vei vedea în timp real TOATE request-urile care trec prin ngrok, inclusiv callback-urile de la euPlatesc!

## ⚠️ Limitări ngrok gratuit

1. **URL se schimbă la fiecare restart**
   - Când oprești și repornești ngrok, primești un URL nou
   - Trebuie să actualizezi `.env.local` de fiecare dată

2. **Sesiuni limitate**
   - Sesiunile gratuite expiră după ~2 ore
   - Trebuie să repornești ngrok periodic

3. **Bandwidth limitat**
   - Pentru testing e suficient
   - Pentru usage intensiv, consideră un plan plătit

## Alternative la ngrok

### localtunnel
```bash
npm install -g localtunnel
lt --port 3000
```

### Cloudflare Tunnel
```bash
cloudflared tunnel --url http://localhost:3000
```

### serveo
```bash
ssh -R 80:localhost:3000 serveo.net
```

## Troubleshooting

### Eroare: "Connection refused"
- Verifică că `npm run dev` rulează
- Verifică că ngrok forwarding-ul e activ
- Verifică că `NEXT_PUBLIC_BASE_URL` e setat corect în `.env.local`

### Callback nu ajunge
- Verifică logs în ngrok dashboard (http://127.0.0.1:4040)
- Verifică că URL-ul din `.env.local` e corect (HTTPS, fără slash la final)
- Restartează serverul Next.js după modificarea `.env.local`

### URL ngrok expirat
- Repornește ngrok
- Actualizează `NEXT_PUBLIC_BASE_URL` în `.env.local`
- Restartează `npm run dev`

## Deployment în Producție

În producție, NU vei folosi ngrok. Vei avea:
- Un domeniu real (ex: `https://florarie-simona.ro`)
- SSL certificate configurat
- `NEXT_PUBLIC_BASE_URL` setat la domeniul real

ngrok este **DOAR pentru testing local**!

## Exemplu `.env.local` complet

```bash
# URL public (ngrok pentru local, domeniu real pentru producție)
NEXT_PUBLIC_BASE_URL=https://abc123xyz.ngrok.io

# euPlatesc
EUPLATESC_MERCHANT_ID=44841005699
EUPLATESC_SECRET_KEY=E39AEB5D5861D3AAC60290D77F9D8EF4EF1B7380

# MongoDB
MONGODB_URI=mongodb+srv://...

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Succes!

Acum ar trebui să poți testa plățile euPlatesc pe localhost! 🚀
