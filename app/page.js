import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center gap-8 p-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            📚 Sistem Perpustakaan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            SMK Taruna Bhakti
          </p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-lg border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            Daftar
          </Link>
        </div>
        
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Aplikasi sedang dalam pengembangan
        </p>
      </main>
    </div>
  );
}
