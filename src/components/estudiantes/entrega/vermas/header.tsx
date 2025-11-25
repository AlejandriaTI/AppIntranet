export function Header() {
  return (
    <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">📚</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Asesorías
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tu gestor de asuntos académicos
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
