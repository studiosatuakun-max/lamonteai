"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function OperationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Operations Module Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 px-4 text-center">
      <div className="bg-rose-100 p-4 rounded-full">
        <AlertTriangle className="w-10 h-10 text-rose-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">Terjadi Kesalahan di Modul Operations</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          {error.message || "Gagal memuat data atau mengeksekusi operasi. Silakan coba lagi."}
        </p>
      </div>
      <Button 
        onClick={() => reset()}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        Coba Muat Ulang
      </Button>
    </div>
  );
}
