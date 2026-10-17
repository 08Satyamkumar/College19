"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Lock,
  User,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Edit,
  ShieldCheck,
  Search,
  ExternalLink,
  LogOut,
  Layers,
} from "lucide-react";

export default function WriterLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sampleColleges = [
    { name: "IIT Delhi", slug: "iit-delhi", location: "New Delhi", nirf: "NIRF #2" },
    { name: "BITS Pilani", slug: "bits-pilani", location: "Pilani, Rajasthan", nirf: "NIRF #20" },
    { name: "IIT Bombay", slug: "iit-bombay", location: "Mumbai, Maharashtra", nirf: "NIRF #3" },
    { name: "IIM Ahmedabad", slug: "iim-ahmedabad", location: "Ahmedabad, Gujarat", nirf: "NIRF #1" },
    { name: "Galgotias University", slug: "galgotias-university", location: "Greater Noida, UP", nirf: "Top Ranked" },
    { name: "AIIMS Delhi", slug: "aiims-delhi", location: "New Delhi", nirf: "NIRF #1" },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check with server if session is already active
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsLoggedIn(true);
          if (typeof window !== "undefined") {
            localStorage.setItem("think_college_admin", "true");
          }
        } else if (typeof window !== "undefined" && localStorage.getItem("think_college_admin") === "true") {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        if (typeof window !== "undefined" && localStorage.getItem("think_college_admin") === "true") {
          setIsLoggedIn(true);
        }
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("think_college_admin", "true");
        }
        setIsLoggedIn(true);
        setError("");
      } else {
        setError(data.error || "Invalid Writer Username or Passcode. Please contact the Editor-in-Chief.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("think_college_admin");
    }
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const filteredColleges = sampleColleges.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl shadow-xl p-6 sm:p-9 relative overflow-hidden">
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.06),transparent_60%)] pointer-events-none" />

        {isLoggedIn ? (
          <div className="space-y-6 relative z-10">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-lg shadow-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-outfit font-black text-lg sm:text-xl text-slate-900">
                      Content Writer & Editor Portal
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Live Writer Access Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    College 19 Editorial CMS Dashboard
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Instruction Card */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-1.5">
              <h4 className="font-outfit font-black text-xs text-purple-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>How to Edit Content in 3 Easy Steps:</span>
              </h4>
              <p className="text-xs text-purple-950 font-medium leading-relaxed">
                1. Select or search any college below to open its live master template.<br />
                2. On the college page, click any <strong>"✏️ Edit Section"</strong> button to update that specific tab (Courses, Fees, Cutoffs, Placements, Author info).<br />
                3. Click <strong>"Save & Publish"</strong> — your edits will be published live across all devices instantly!
              </p>
            </div>

            {/* Quick College Jump Search */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-outfit font-bold text-xs text-slate-700">
                  Select a College to Edit:
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Showing {filteredColleges.length} flagship colleges
                </span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search college by name (e.g. IIT Delhi, BITS Pilani)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {filteredColleges.map((col) => (
                  <Link
                    key={col.slug}
                    href={`/colleges/${col.slug}`}
                    className="p-3 bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 rounded-xl flex items-center justify-between group transition-all shadow-2xs"
                  >
                    <div>
                      <h4 className="font-outfit font-bold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
                        {col.name}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 font-medium">
                        {col.location} • {col.nirf}
                      </p>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-purple-600 group-hover:text-white text-slate-500 flex items-center justify-center transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Direct URL jump */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/colleges/iit-delhi"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Open IIT Delhi Master Page</span>
              </Link>

              <Link
                href="/"
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                <span>Visit Main Homepage</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Login Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/25 mx-auto">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="font-outfit font-black text-2xl text-slate-900">
                Content Writer & Editorial Login
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                Sign in with your content writer credentials to edit college profiles, fee tables, cutoffs, and placement records.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto">
              <div>
                <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                  Writer Username / ID *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    placeholder="Enter writer username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                  Passcode *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="password"
                    placeholder="Enter passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? "Authenticating..." : "Login as Content Writer"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Secure Editorial CMS • College 19</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
