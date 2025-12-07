# Instruksi Commit dan Push

## Status
✅ Semua file sudah di-add ke staging area
⏳ Perlu commit dan push

## Cara Manual (jika terminal stuck):

### 1. Keluar dari Pager (jika stuck)
Tekan tombol **q** untuk keluar dari pager

### 2. Commit perubahan
```powershell
git commit -m "Fix Vercel build errors: add dynamic export and Suspense boundary"
```

### 3. Push ke GitHub
```powershell
git push origin main
```

## Atau gunakan commit message file:

Jika ingin commit message lebih detail, sudah ada file `commit-msg.txt`. Gunakan:
```powershell
git commit -F commit-msg.txt
git push origin main
```

## File yang akan di-commit:
- 31 files changed
- Semua halaman dengan dynamic export
- Payment success page dengan Suspense boundary

Setelah push, Vercel akan otomatis rebuild dengan fix yang sudah dilakukan!
