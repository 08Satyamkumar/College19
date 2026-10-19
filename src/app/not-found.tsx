import React from "react";
import Link from "next/link";
import { Search, Home, GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
          <Search className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black text-orange-500 uppercase tracking-widest">
            404 — Page Not Found
          </span>
          <h1 className="font-outfit font-black text-2xl text-slate-800">
            Lost on Campus?
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            The page you are looking for doesn&apos;t exist, or has been moved to a new address.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/colleges"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#032b53] hover:bg-[#021f3d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer no-underline"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Explore Colleges</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer no-underline"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
