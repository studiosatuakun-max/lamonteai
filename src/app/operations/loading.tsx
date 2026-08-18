export default function OperationsLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Memuat Modul Operations...</p>
    </div>
  );
}
