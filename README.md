# Sistem Manajemen Perpustakaan

Sistem manajemen perpustakaan modern dengan Next.js, NextAuth, dan MySQL. Project ini di-host menggunakan **Vercel** untuk aplikasinya dan **Aiven** untuk cloud database MySQL-nya.

## Fitur

### Untuk Siswa/Umum
- Registrasi dan login
- Melihat daftar buku
- Melihat detail buku
- Meminjam buku (mengirim request dengan durasi 2 minggu - 1 bulan)
- Melihat riwayat peminjaman
- **Halaman Profil** dengan:
  - Upload foto profil (local storage)
  - Kalender peminjaman (lihat jadwal pinjam & jatuh tempo)
  - History peminjaman (buku yang sudah dikembalikan)
  - Ubah password
  - Ubah email
- **Pembayaran Denda** - Bayar denda keterlambatan melalui Xendit (Credit Card, Virtual Account, E-Wallet, QRIS)

### Untuk Petugas
- Login sebagai petugas
- CRUD (Create, Read, Update, Delete) data buku
- Melihat dan menyetujui/menolak permintaan peminjaman
- Mengelola peminjaman aktif
- Menandai buku sebagai dikembalikan

### Untuk Admin
- Login sebagai admin
- Membuat akun petugas baru
- Mengelola user (menghapus akun user)
- Reset password user yang lupa password

## Teknologi yang Digunakan

- **Next.js 16** - Framework React
- **NextAuth** - Authentication
- **MySQL** - Database (bisa pakai local atau cloud database Aiven)
- **Tailwind CSS** - Styling
- **bcryptjs** - Password hashing
- **Xendit** - Payment Gateway untuk pembayaran denda
- **Aiven** - Cloud database MySQL (gratis untuk development)
- **Vercel** - Platform hosting untuk aplikasi Next.js

## Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd perpustakaan_hosting
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Kamu punya 2 opsi untuk database:

#### Opsi 1: Pakai Local MySQL

1. Pastikan MySQL sudah terinstall dan berjalan di komputer kamu
2. Buat database MySQL dengan nama `perpustakaan` atau sesuaikan dengan konfigurasi kamu
3. Import file SQL:
   ```bash
   mysql -u root -p perpustakaan < database/schema.sql
   ```
   
   Atau pakai phpMyAdmin:
   - Buka phpMyAdmin
   - Pilih database `perpustakaan` (atau buat baru)
   - Klik tab "Import"
   - Pilih file `database/schema.sql`
   - Klik "Go"

4. File `database/schema.sql` berisi:
   - Struktur tabel (users, staff, admin, books, borrowings)
   - 150 data buku dari berbagai genre
   - Akun admin default:
     - Email: `admin@perpustakaan.com`
     - Password: `admin123`

#### Opsi 2: Pakai Cloud Database Aiven (Recommended untuk Production)

Aiven itu cloud database MySQL yang gratis untuk development. Cocok banget kalau mau hosting aplikasi ini.

**Langkah-langkah setup Aiven:**

1. **Daftar akun Aiven** (gratis):
   - Buka https://aiven.io dan daftar akun baru
   - Verifikasi email kamu

2. **Buat MySQL Service**:
   - Login ke [Aiven Console](https://console.aiven.io)
   - Klik **"Create service"**
   - Pilih **MySQL**
   - Pilih plan **"Free"** (cukup untuk development)
   - Pilih region terdekat (misalnya: `aws-ap-southeast-1` untuk Asia Tenggara)
   - Beri nama service (misalnya: `mysql-perpustakaan`)
   - Klik **"Create service"**

3. **Dapatkan Connection Info**:
   - Setelah service dibuat, klik service MySQL yang baru dibuat
   - Buka tab **"Connection information"**
   - Catat informasi berikut:
     - **Host**: `mysql-xxxxx-xxxxx-xxxxx.c.aivencloud.com`
     - **Port**: `24101` (atau sesuai yang ditampilkan)
     - **User**: `avnadmin`
     - **Password**: Klik icon mata untuk reveal password
     - **Database name**: `defaultdb` (default dari Aiven)
     - **SSL mode**: `REQUIRED` (wajib untuk Aiven)

4. **Import Database Schema ke Aiven**:
   
   Cara termudah pakai script yang sudah disediakan:
   ```bash
   npm run import-aiven
   ```
   
   Script ini akan otomatis:
   - Baca konfigurasi dari `.env.local`
   - Connect ke Aiven MySQL dengan SSL
   - Import semua tabel dari `database/schema.sql`
   
   Atau kalau mau manual, bisa pakai MySQL client:
   ```bash
   mysql -h mysql-xxxxx-xxxxx-xxxxx.c.aivencloud.com \
         -P 24101 \
         -u avnadmin \
         -p \
         --ssl-mode=REQUIRED \
         defaultdb < database/schema.sql
   ```

**Catatan penting tentang Aiven:**
- Aiven **wajib pakai SSL** untuk semua koneksi
- Free tier Aiven punya limit: 1 GB storage, 512 MB RAM, 100 connections max
- Cocok untuk development dan testing, untuk production dengan traffic tinggi mungkin perlu upgrade
- Lihat dokumentasi lengkap di [AIVEN_SETUP.md](./AIVEN_SETUP.md) kalau butuh detail lebih

### 4. Konfigurasi Environment Variables

Buat file `.env.local` di root project:

**Kalau pakai Local MySQL:**
```env
# Database Configuration - Local MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=perpustakaan
DB_SSL=false

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Xendit Configuration (untuk pembayaran denda)
XENDIT_SECRET_KEY=xnd_development_xxxxxxxxxxxxx
XENDIT_IS_PRODUCTION=false
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Kalau pakai Aiven MySQL:**
```env
# Database Configuration - Aiven MySQL
DB_HOST=mysql-xxxxx-xxxxx-xxxxx.c.aivencloud.com
DB_PORT=24101
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password-here
DB_NAME=defaultdb
DB_SSL=true
DB_SSL_MODE=REQUIRED
DB_SSL_REJECT_UNAUTHORIZED=false

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Xendit Configuration (untuk pembayaran denda)
XENDIT_SECRET_KEY=xnd_development_xxxxxxxxxxxxx
XENDIT_IS_PRODUCTION=false
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Penting:** 
- Ganti `NEXTAUTH_SECRET` dengan secret key yang aman. Generate dengan:
  ```bash
  openssl rand -base64 32
  ```
- Untuk Aiven, ganti semua placeholder (`xxxxx`, `your-aiven-password-here`) dengan data real dari Aiven Console
- Jangan commit file `.env.local` ke Git! (sudah ada di `.gitignore`)

### 5. Setup Xendit (Pembayaran Denda)

Sistem ini pakai **Xendit** sebagai payment gateway untuk pembayaran denda. Untuk setup lengkap, lihat file [XENDIT_SETUP.md](./XENDIT_SETUP.md).

**Quick Setup:**
1. Daftar akun di https://dashboard.xendit.co/register
2. Dapatkan API Key dari dashboard (Settings → API Keys)
3. Tambahkan ke `.env.local`:
   ```env
   XENDIT_SECRET_KEY=xnd_development_xxxxxxxxxxxxx
   XENDIT_IS_PRODUCTION=false
   ```

**Catatan:**
- Untuk testing, pakai key yang dimulai dengan `xnd_development_`
- Untuk production, pakai key yang dimulai dengan `xnd_production_`
- Lihat dokumentasi lengkap di [XENDIT_SETUP.md](./XENDIT_SETUP.md)

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

Kalau pakai Aiven, kamu akan lihat pesan:
```
✅ Database connected successfully
```

## Hosting & Deployment

Project ini di-host menggunakan **Vercel** untuk aplikasinya dan **Aiven** untuk cloud database MySQL-nya. Keduanya punya free tier yang cukup untuk development dan testing.

### Deploy ke Vercel

Vercel itu platform hosting yang dibuat khusus untuk Next.js. Proses deploy-nya super mudah dan gratis untuk personal projects.

**Langkah-langkah deploy:**

1. **Push code ke GitHub**:
   - Pastikan semua code sudah di-push ke GitHub repository
   - Jangan lupa pastikan `.env.local` tidak ter-commit (sudah di `.gitignore`)

2. **Daftar/Login ke Vercel**:
   - Buka https://vercel.com
   - Login dengan GitHub account kamu
   - Klik **"Add New Project"**

3. **Import Project**:
   - Pilih repository yang mau di-deploy
   - Vercel akan otomatis detect kalau ini Next.js project

4. **Configure Environment Variables**:
   - Di halaman setup, scroll ke bagian **"Environment Variables"**
   - Tambahkan semua variabel dari `.env.local`:
     ```
     DB_HOST=mysql-xxxxx-xxxxx-xxxxx.c.aivencloud.com
     DB_PORT=24101
     DB_USER=avnadmin
     DB_PASSWORD=your-aiven-password
     DB_NAME=defaultdb
     DB_SSL=true
     DB_SSL_MODE=REQUIRED
     DB_SSL_REJECT_UNAUTHORIZED=false
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=your-secret-key
     XENDIT_SECRET_KEY=xnd_production_xxxxxxxxxxxxx
     XENDIT_IS_PRODUCTION=true
     NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
     ```
   - **Penting:** 
     - Ganti `NEXTAUTH_URL` dan `NEXT_PUBLIC_BASE_URL` dengan URL Vercel kamu (akan dapat setelah deploy)
     - Untuk production, pakai `XENDIT_IS_PRODUCTION=true` dan `xnd_production_` key
     - Jangan lupa set `DB_SSL_REJECT_UNAUTHORIZED=false` untuk Aiven (atau tambahkan CA certificate)

5. **Deploy**:
   - Klik **"Deploy"**
   - Tunggu beberapa menit, Vercel akan build dan deploy aplikasi kamu
   - Setelah selesai, kamu akan dapat URL seperti: `https://your-app.vercel.app`

6. **Update Environment Variables** (setelah dapat URL):
   - Kembali ke Vercel dashboard
   - Settings → Environment Variables
   - Update `NEXTAUTH_URL` dan `NEXT_PUBLIC_BASE_URL` dengan URL yang benar
   - Redeploy aplikasi

**Keuntungan pakai Vercel:**
- ✅ Gratis untuk personal projects
- ✅ Auto-deploy setiap push ke GitHub (kalau enable)
- ✅ SSL certificate otomatis
- ✅ CDN global untuk performa cepat
- ✅ Preview deployments untuk setiap pull request
- ✅ Built-in analytics dan monitoring

**Tips:**
- Setiap kali push ke branch `main`, Vercel akan otomatis deploy (kalau enable auto-deploy)
- Bisa setup custom domain juga kalau mau
- Monitor usage di dashboard Vercel, free tier punya limit tapi cukup untuk development

### Database di Aiven

Aiven itu cloud database MySQL yang gratis untuk development. Cocok banget dipasang sama Vercel.

**Kenapa pakai Aiven:**
- ✅ Gratis untuk development (free tier)
- ✅ Managed service, jadi gak perlu setup server sendiri
- ✅ Auto backup dan monitoring
- ✅ SSL connection otomatis
- ✅ Bisa upgrade kalau butuh lebih banyak resources

**Catatan penting:**
- Free tier Aiven punya limit: 1 GB storage, 512 MB RAM, 100 connections max
- Untuk production dengan traffic tinggi, mungkin perlu upgrade ke paid plan
- Pastikan semua koneksi pakai SSL (wajib untuk Aiven)
- Lihat dokumentasi lengkap di [AIVEN_SETUP.md](./AIVEN_SETUP.md)

## Struktur Database

### Tabel Users (Siswa/Umum)
- `id` - Primary key
- `name` - Nama lengkap
- `email` - Email (unique)
- `password` - Password (hashed)
- `role` - 'siswa' atau 'umum'
- `phone` - No. telepon
- `address` - Alamat
- `created_at`, `updated_at` - Timestamps

### Tabel Staff (Petugas)
- `id` - Primary key
- `name` - Nama lengkap
- `email` - Email (unique)
- `password` - Password (hashed)
- `phone` - No. telepon
- `created_at`, `updated_at` - Timestamps

### Tabel Admin
- `id` - Primary key
- `name` - Nama
- `email` - Email (unique)
- `password` - Password (hashed)
- `created_at`, `updated_at` - Timestamps

### Tabel Books
- `id` - Primary key
- `title` - Judul buku
- `author` - Penulis
- `isbn` - ISBN
- `genre` - Genre
- `description` - Deskripsi
- `image_url` - URL gambar
- `stock` - Total stok
- `available` - Stok tersedia
- `published_year` - Tahun terbit
- `publisher` - Penerbit
- `created_at`, `updated_at` - Timestamps

### Tabel Borrowings
- `id` - Primary key
- `user_id` - Foreign key ke users
- `book_id` - Foreign key ke books
- `borrow_date` - Tanggal pinjam
- `return_date` - Tanggal kembali
- `due_date` - Tanggal jatuh tempo
- `status` - 'pending', 'approved', 'borrowed', 'returned', 'rejected'
- `staff_id` - Foreign key ke staff (yang approve)
- `notes` - Catatan
- `created_at`, `updated_at` - Timestamps

## Query SQL Penting

### 📚 Query Buku

#### Melihat semua buku
```sql
SELECT 
    id,
    title,
    author,
    genre,
    stock,
    available,
    published_year
FROM books 
ORDER BY created_at DESC;
```

#### Mencari buku berdasarkan judul atau penulis
```sql
SELECT 
    id,
    title,
    author,
    genre,
    available
FROM books 
WHERE title LIKE '%kata kunci%' 
   OR author LIKE '%kata kunci%'
ORDER BY title;
```

#### Melihat buku berdasarkan genre
```sql
SELECT 
    id,
    title,
    author,
    stock,
    available
FROM books 
WHERE genre = 'Fiction'
ORDER BY title;
```

#### Melihat buku yang tersedia
```sql
SELECT 
    id,
    title,
    author,
    genre,
    available,
    stock
FROM books 
WHERE available > 0
ORDER BY title;
```

#### Statistik buku per genre
```sql
SELECT 
    genre,
    COUNT(*) as total_buku,
    SUM(stock) as total_stok,
    SUM(available) as total_tersedia
FROM books
GROUP BY genre
ORDER BY total_buku DESC;
```

### 👥 Query User & Staff

#### Melihat semua user
```sql
SELECT 
    id,
    name,
    email,
    role,
    phone,
    created_at
FROM users
ORDER BY created_at DESC;
```

#### Melihat semua staff
```sql
SELECT 
    id,
    name,
    email,
    phone,
    created_at
FROM staff
ORDER BY created_at DESC;
```

### 📖 Query Peminjaman

#### Melihat semua peminjaman pending (untuk petugas)
```sql
SELECT 
    b.id,
    b.borrow_date,
    b.due_date,
    b.status,
    u.name as nama_peminjam,
    u.email as email_peminjam,
    bk.title as judul_buku,
    bk.author as penulis
FROM borrowings b
JOIN users u ON b.user_id = u.id
JOIN books bk ON b.book_id = bk.id
WHERE b.status = 'pending'
ORDER BY b.created_at DESC;
```

#### Melihat riwayat peminjaman user tertentu
```sql
SELECT 
    b.id,
    b.borrow_date,
    b.due_date,
    b.return_date,
    b.status,
    bk.title,
    bk.author,
    bk.genre
FROM borrowings b
JOIN books bk ON b.book_id = bk.id
WHERE b.user_id = 1  -- Ganti dengan ID user
ORDER BY b.created_at DESC;
```

#### Melihat peminjaman aktif (belum dikembalikan)
```sql
SELECT 
    b.id,
    b.borrow_date,
    b.due_date,
    u.name as nama_peminjam,
    bk.title,
    DATEDIFF(b.due_date, CURDATE()) as hari_tersisa
FROM borrowings b
JOIN users u ON b.user_id = u.id
JOIN books bk ON b.book_id = bk.id
WHERE b.status IN ('approved', 'borrowed')
ORDER BY b.due_date ASC;
```

#### Melihat peminjaman yang sudah lewat jatuh tempo
```sql
SELECT 
    b.id,
    b.borrow_date,
    b.due_date,
    u.name as nama_peminjam,
    u.email,
    bk.title,
    DATEDIFF(CURDATE(), b.due_date) as hari_terlambat
FROM borrowings b
JOIN users u ON b.user_id = u.id
JOIN books bk ON b.book_id = bk.id
WHERE b.status IN ('approved', 'borrowed')
  AND b.due_date < CURDATE()
ORDER BY b.due_date ASC;
```

#### Statistik peminjaman per status
```sql
SELECT 
    status,
    COUNT(*) as jumlah
FROM borrowings
GROUP BY status
ORDER BY jumlah DESC;
```

### 🔧 Query Admin

#### Reset password user (dari admin)
```sql
-- Password akan di-hash oleh aplikasi
-- Jangan jalankan query ini langsung, gunakan API endpoint
UPDATE users 
SET password = ?  -- Password yang sudah di-hash
WHERE id = ?;
```

#### Menghapus user (dari admin)
```sql
-- Hati-hati: ini akan menghapus semua data terkait user
DELETE FROM users 
WHERE id = ?;
```

#### Melihat semua admin
```sql
SELECT 
    id,
    name,
    email,
    created_at
FROM admin
ORDER BY created_at DESC;
```

### 📊 Query Statistik

#### Statistik keseluruhan perpustakaan
```sql
SELECT 
    (SELECT COUNT(*) FROM books) as total_buku,
    (SELECT COUNT(*) FROM users) as total_user,
    (SELECT COUNT(*) FROM staff) as total_staff,
    (SELECT COUNT(*) FROM borrowings WHERE status = 'pending') as peminjaman_pending,
    (SELECT COUNT(*) FROM borrowings WHERE status = 'borrowed') as buku_dipinjam,
    (SELECT SUM(available) FROM books) as total_buku_tersedia;
```

#### Buku paling banyak dipinjam
```sql
SELECT 
    bk.id,
    bk.title,
    bk.author,
    COUNT(b.id) as jumlah_peminjaman
FROM books bk
LEFT JOIN borrowings b ON bk.id = b.book_id
GROUP BY bk.id, bk.title, bk.author
ORDER BY jumlah_peminjaman DESC
LIMIT 10;
```

#### User paling aktif meminjam
```sql
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(b.id) as jumlah_peminjaman
FROM users u
LEFT JOIN borrowings b ON u.id = b.user_id
GROUP BY u.id, u.name, u.email
ORDER BY jumlah_peminjaman DESC
LIMIT 10;
```

## Default Login

### Admin
- Email: `admin@perpustakaan.com`
- Password: `admin123`

**PENTING:** Ganti password admin setelah pertama kali login!

## Struktur Folder

```
perpustakaan_hosting/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth routes
│   │   ├── books/        # Book CRUD
│   │   ├── borrowings/   # Borrowing management
│   │   └── admin/        # Admin routes
│   ├── admin/            # Admin pages
│   ├── staff/            # Staff pages
│   ├── dashboard/        # User dashboard
│   ├── books/            # Book pages
│   ├── login/            # Login page
│   └── register/         # Register page
├── components/           # React components
├── lib/                  # Utilities (db connection)
├── database/             # SQL schema
└── public/               # Static files
```

## Catatan Penting

1. **Password Hashing**: Semua password di-hash menggunakan bcrypt dengan cost factor 10.

2. **Authentication**: 
   - Admin: Login langsung dari database
   - Staff & Users: Menggunakan NextAuth

3. **Authorization**: Middleware memastikan hanya user yang berwenang yang bisa mengakses halaman tertentu.

4. **Database**: 
   - Untuk development local, pastikan MySQL sudah berjalan sebelum menjalankan aplikasi
   - Untuk production, pakai Aiven cloud database (sudah include SSL dan backup otomatis)

5. **Environment Variables**: Jangan commit file `.env.local` ke repository (sudah ada di `.gitignore`).

6. **Payment Integration**: Sistem menggunakan Xendit untuk pembayaran denda. Pastikan API key sudah di-set di `.env.local`. Lihat [XENDIT_SETUP.md](./XENDIT_SETUP.md) untuk setup lengkap.

7. **Hosting**: 
   - Aplikasi di-host di **Vercel** (gratis untuk personal projects)
   - Database di-host di **Aiven** (gratis untuk development)
   - Keduanya punya free tier yang cukup untuk development dan testing

## Troubleshooting

### Error: "Cannot connect to database"
- **Local MySQL**: Pastikan MySQL sudah berjalan, cek konfigurasi di `.env.local`, pastikan database sudah dibuat
- **Aiven**: 
  - Pastikan semua environment variables sudah benar (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
  - Pastikan `DB_SSL=true` dan `DB_SSL_MODE=REQUIRED`
  - Cek credentials di Aiven Console
  - Pastikan IP kamu tidak di-block (Aiven free tier biasanya allow semua IP)

### Error: "SSL connection required" (Aiven)
- Pastikan `DB_SSL=true` dan `DB_SSL_MODE=REQUIRED` di `.env.local`
- Set `DB_SSL_REJECT_UNAUTHORIZED=false` untuk development (atau tambahkan CA certificate)

### Error: "NextAuth secret is missing"
- Pastikan `NEXTAUTH_SECRET` sudah di-set di `.env.local`
- Generate secret dengan: `openssl rand -base64 32`

### Error: "Table doesn't exist"
- Pastikan sudah import file `database/schema.sql`
- Kalau pakai Aiven, jalankan: `npm run import-aiven`

### Error: "Xendit payment failed"
- Pastikan `XENDIT_SECRET_KEY` sudah di-set di `.env.local`
- Pastikan menggunakan key yang sesuai (Sandbox vs Production)
- Cek dokumentasi di [XENDIT_SETUP.md](./XENDIT_SETUP.md)

### Error: "Connection timeout" (Aiven)
- Cek apakah host dan port sudah benar
- Pastikan firewall tidak memblokir koneksi
- Coba ping host untuk memastikan bisa diakses
- Pastikan region Aiven tidak terlalu jauh dari lokasi kamu

## Push ke GitHub

Kalau project sudah pernah di-push sebelumnya dan mau push perubahan terbaru:

### 1. Cek Status Git
```bash
git status
```

### 2. Tambahkan File yang Diubah
```bash
# Tambahkan semua file yang diubah
git add .

# Atau tambah file spesifik
git add README.md
```

### 3. Commit Perubahan
```bash
git commit -m "Update README: tambah dokumentasi Aiven dan Vercel"
```

### 4. Push ke GitHub
```bash
# Push ke branch utama (biasanya main atau master)
git push origin main

# Atau kalau branch kamu berbeda
git push origin master
```

### 5. Kalau Ada Konflik
Kalau ada perubahan di GitHub yang belum ada di local:
```bash
# Pull dulu perubahan terbaru
git pull origin main

# Resolve konflik kalau ada, lalu:
git add .
git commit -m "Merge changes"
git push origin main
```

### Tips
- Pastikan file `.env.local` **tidak** di-commit (sudah ada di `.gitignore`)
- Jangan commit file sensitif seperti API keys atau password
- Gunakan commit message yang jelas dan deskriptif
- Setelah push ke GitHub, Vercel akan otomatis deploy (kalau enable auto-deploy)

## License

MIT
