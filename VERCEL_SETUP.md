# 🚀 Setup Vercel Deployment

Panduan lengkap untuk deploy aplikasi Perpustakaan ke Vercel dengan Aiven sebagai cloud database.

## Prerequisites

1. ✅ Account Vercel (gratis): https://vercel.com/signup
2. ✅ Account Aiven (gratis): https://aiven.io/signup
3. ✅ Repository GitHub (project sudah di-push ke GitHub)

## Langkah 1: Setup Aiven Database

1. **Login ke Aiven Console**: https://console.aiven.io
2. **Create MySQL Service**:
   - Klik "Create service"
   - Pilih "MySQL"
   - Pilih plan "Free" (untuk development)
   - Pilih region terdekat (misalnya: `aws-ap-southeast-1` untuk Asia Tenggara)
   - Beri nama service (misalnya: `mysql-perpustakaan`)
   - Klik "Create service"
   - Tunggu sampai service siap (biasanya 2-3 menit)

3. **Dapatkan Connection Info**:
   - Klik service MySQL yang baru dibuat
   - Buka tab "Connection information"
   - Catat informasi berikut:
     - **Host**: `mysql-xxxxx-xxxxx-xxxxx.c.aivencloud.com`
     - **Port**: `24101` (atau sesuai yang ditampilkan)
     - **User**: `avnadmin`
     - **Password**: Klik icon mata untuk reveal password
     - **Database name**: `defaultdb`
     - **SSL mode**: `REQUIRED`

4. **Import Database Schema**:
   - Buka terminal
   - Masuk ke folder project
   - Copy file `database/schema.sql` ke Aiven menggunakan MySQL client atau phpMyAdmin
   - Atau gunakan script import jika tersedia

## Langkah 2: Setup Environment Variables di Vercel

1. **Login ke Vercel**: https://vercel.com/dashboard

2. **Import Project dari GitHub**:
   - Klik "Add New..." → "Project"
   - Pilih repository `perpustakaan_hosting`
   - Klik "Import"

3. **Configure Environment Variables**:
   - Setelah import, klik project
   - Buka tab "Settings" → "Environment Variables"
   - Tambahkan variable berikut:

### Database Configuration (Aiven)
```
DB_HOST=mysql-xxxxx-xxxxx-xxxxx.c.aivencloud.com
DB_PORT=24101
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password-here
DB_NAME=defaultdb
DB_SSL=true
DB_SSL_MODE=REQUIRED
DB_SSL_REJECT_UNAUTHORIZED=false
```

### NextAuth Configuration
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### Xendit Configuration (Opsional - untuk pembayaran denda)
```
XENDIT_SECRET_KEY=xnd_production_xxxxxxxxxxxxx
XENDIT_IS_PRODUCTION=true
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

**Catatan**: Ganti `your-app.vercel.app` dengan URL Vercel yang diberikan setelah deploy pertama.

## Langkah 3: Deploy ke Vercel

1. **Konfigurasi Build Settings**:
   - Vercel otomatis detect Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

2. **Deploy**:
   - Klik "Deploy"
   - Tunggu proses build selesai (biasanya 2-5 menit)
   - Setelah selesai, aplikasi akan live di URL yang diberikan

3. **Update NEXTAUTH_URL**:
   - Setelah deploy pertama, copy URL dari Vercel (misalnya: `https://perpustakaan-host.vercel.app`)
   - Update environment variable `NEXTAUTH_URL` dengan URL tersebut
   - Redeploy aplikasi

## Langkah 4: Setup Custom Domain (Opsional)

1. Di Vercel dashboard, buka project → Settings → Domains
2. Tambahkan domain custom
3. Ikuti instruksi untuk setup DNS

## Troubleshooting

### Error: "Cannot connect to database"
- Pastikan semua environment variables sudah di-set dengan benar
- Pastikan Aiven service sudah running
- Pastikan SSL configuration sudah benar (`DB_SSL=true`, `DB_SSL_MODE=REQUIRED`)

### Error: "NextAuth secret is missing"
- Pastikan `NEXTAUTH_SECRET` sudah di-set di Environment Variables
- Generate secret baru dengan: `openssl rand -base64 32`

### Error: "Build failed"
- Check build logs di Vercel dashboard
- Pastikan semua dependencies sudah di-install
- Pastikan Node.js version compatible (Next.js 16 butuh Node.js 18+)

### Database connection timeout
- Pastikan Aiven service sudah running
- Check firewall settings di Aiven
- Pastikan menggunakan SSL connection

## Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard
  - Monitor deployments, logs, analytics
- **Aiven Console**: https://console.aiven.io
  - Monitor database usage, connections, performance

## Cost Estimation

### Free Tier (Development)
- **Vercel**: Free (unlimited deployments untuk personal projects)
- **Aiven**: Free (1 GB storage, 512 MB RAM, 100 connections max)

### Production (Jika diperlukan)
- **Vercel Pro**: $20/bulan
- **Aiven Startup Plan**: Mulai dari $19/bulan

## Tips

1. **Environment Variables**: Set variable untuk Production, Preview, dan Development secara terpisah
2. **Automatic Deployments**: Vercel otomatis deploy setiap push ke branch main
3. **Preview Deployments**: Setiap pull request akan dapat preview deployment otomatis
4. **Database Backups**: Setup backup otomatis di Aiven untuk data penting
5. **Monitoring**: Gunakan Vercel Analytics untuk monitor performance

## Next Steps

1. Setup database backup di Aiven
2. Configure custom domain
3. Setup email service untuk notifications (jika diperlukan)
4. Configure CDN untuk static assets (optional)
5. Setup monitoring dan alerting

Selamat deploy! 🎉
