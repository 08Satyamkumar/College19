"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  Download,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Lock,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Trophy,
  X,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  course_interest?: string | null;
  college_interest?: string | null;
  state_interest?: string | null;
  status?: string | null;
  notes?: string | null;
  created_at?: string;
}

interface KPIStats {
  total: number;
  today: number;
  contacted: number;
  enrolled: number;
}

export default function PartnerLeadsPortal() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Leads Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<KPIStats>({ total: 0, today: 0, contacted: 0, enrolled: 0 });

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);

  // Active Modals & Remarks
  const [activeLeadNotes, setActiveLeadNotes] = useState<Lead | null>(null);
  const [editingNotesText, setEditingNotesText] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // 1. Initial Session Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          // Check localStorage fallback for client session
          const localAuth = localStorage.getItem("college19_partner_session");
          if (localAuth === "authenticated") {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Fetch Leads from API
  const fetchLeads = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedCourse !== "all") params.append("course", selectedCourse);
      if (selectedCollege !== "all") params.append("college", selectedCollege);
      if (dateFilter !== "all") params.append("date", dateFilter);
      params.append("page", currentPage.toString());
      params.append("limit", "50");

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setTotalLeadsCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, [searchQuery, selectedStatus, selectedCourse, selectedCollege, dateFilter, currentPage]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
      // Auto-refresh fresh leads in background every 30 seconds
      const interval = setInterval(() => {
        fetchLeads(true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchLeads]);

  // 3. Handle Client Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("college19_partner_session", "authenticated");
        setUsername("");
        setPassword("");
      } else {
        setLoginError(data.error || "Invalid Username or Passkey. Please verify your credentials.");
      }
    } catch {
      setLoginError("Network connection error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 4. Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("college19_partner_session");
    setIsAuthenticated(false);
  };

  // 5. Update Status
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      fetchLeads(true); // background refresh stats
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // 6. Save Remarks / Notes
  const handleSaveNotes = async () => {
    if (!activeLeadNotes) return;
    setIsSavingNotes(true);
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeLeadNotes.id, notes: editingNotesText }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === activeLeadNotes.id ? { ...l, notes: editingNotesText } : l))
      );
      setActiveLeadNotes(null);
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // 7. Dynamic Filter Lists
  const availableCourses = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.course_interest) set.add(l.course_interest.trim());
    });
    return Array.from(set).filter(Boolean);
  }, [leads]);

  const availableColleges = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.college_interest) set.add(l.college_interest.trim());
    });
    return Array.from(set).filter(Boolean);
  }, [leads]);

  // 8. World-Class Excel & Spreadsheet Export Generator
  // Fixes: 1. Auto-width columns (no congestion). 2. Phone numbers formatted as text (no scientific E+09).
  // 3. College19 brand styling with crisp headers and clean zebra rows.
  const exportToExcel = async (format: "excel" | "csv" = "excel", exportAll = false) => {
    try {
      let exportData: Lead[] = leads;

      if (exportAll) {
        // Fetch up to 1000 all leads
        const res = await fetch("/api/leads?limit=1000");
        const json = await res.json();
        if (json.leads) exportData = json.leads;
      }

      if (!exportData || exportData.length === 0) {
        alert("No lead records available to export.");
        return;
      }

      const timestamp = new Date().toISOString().slice(0, 10);
      const nowStr = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      // Escape helper for safe XML/HTML embedding
      const escapeXml = (unsafe?: string | null) => {
        if (!unsafe) return "";
        return String(unsafe)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      };

      if (format === "excel") {
        // High-End Microsoft Excel Spreadsheet (HTML Workbook format with MSO styles)
        const excelHtml = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:x="urn:schemas-microsoft-com:office:excel"
                xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <!--[if gte mso 9]>
            <xml>
              <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                    <x:Name>College19 Inquiries</x:Name>
                    <x:WorksheetOptions>
                      <x:DisplayGridlines/>
                      <x:FitToPage/>
                    </x:WorksheetOptions>
                  </x:ExcelWorksheet>
                </x:ExcelWorksheets>
              </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
              table {
                border-collapse: collapse;
                width: 100%;
                font-family: Calibri, 'Segoe UI', Arial, sans-serif;
              }
              .banner-title {
                background-color: #0f172a;
                color: #ffffff;
                font-size: 15pt;
                font-weight: bold;
                text-align: center;
                padding: 16px;
                border: 1px solid #0f172a;
              }
              .banner-sub {
                background-color: #f8fafc;
                color: #475569;
                font-size: 9.5pt;
                text-align: center;
                padding: 8px;
                border: 1px solid #cbd5e1;
                font-style: italic;
              }
              th.header-cell {
                background-color: #ea580c;
                color: #ffffff;
                font-weight: bold;
                font-size: 11pt;
                border: 1.5px solid #c2410c;
                padding: 10px 14px;
                text-align: left;
                vertical-align: middle;
                white-space: nowrap;
              }
              td.data-cell {
                font-size: 10pt;
                border: 1px solid #cbd5e1;
                padding: 9px 12px;
                vertical-align: middle;
                color: #1e293b;
              }
              .text-force {
                mso-number-format: "\\@";
              }
              .center-align {
                text-align: center;
              }
              .row-even {
                background-color: #ffffff;
              }
              .row-odd {
                background-color: #fffaf5;
              }
              .phone-text {
                mso-number-format: "\\@";
                font-weight: bold;
                color: #c2410c;
              }
              .status-badge {
                font-weight: bold;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <table>
              <col width="60" style="width: 60px;" />
              <col width="220" style="width: 220px;" />
              <col width="170" style="width: 170px;" />
              <col width="240" style="width: 240px;" />
              <col width="200" style="width: 200px;" />
              <col width="250" style="width: 250px;" />
              <col width="140" style="width: 140px;" />
              <col width="160" style="width: 160px;" />
              <col width="300" style="width: 300px;" />
              <col width="190" style="width: 190px;" />

              <thead>
                <tr>
                  <th colspan="10" class="banner-title">COLLEGE19 — STUDENT LEADS & ADMISSIONS REPORT</th>
                </tr>
                <tr>
                  <td colspan="10" class="banner-sub">
                    Generated on: ${nowStr} | Total Inquiries: ${exportData.length} | Confidential Calling Desk
                  </td>
                </tr>
                <tr>
                  <th class="header-cell center-align" style="width: 60px;">S.No</th>
                  <th class="header-cell" style="width: 220px;">Student Name</th>
                  <th class="header-cell" style="width: 170px;">Mobile Number</th>
                  <th class="header-cell" style="width: 240px;">Email Address</th>
                  <th class="header-cell" style="width: 200px;">Target Course</th>
                  <th class="header-cell" style="width: 250px;">Target College / Source</th>
                  <th class="header-cell" style="width: 140px;">State / Region</th>
                  <th class="header-cell center-align" style="width: 160px;">Lead Status</th>
                  <th class="header-cell" style="width: 300px;">Counselor Remarks</th>
                  <th class="header-cell center-align" style="width: 190px;">Received Date & Time</th>
                </tr>
              </thead>
              <tbody>
                ${exportData
                  .map((lead, idx) => {
                    const rowClass = idx % 2 === 1 ? "row-odd" : "row-even";
                    const cleanPhone = lead.phone
                      ? lead.phone.startsWith("+91")
                        ? lead.phone
                        : `+91 ${lead.phone}`
                      : "N/A";
                    const dateFormatted = lead.created_at
                      ? new Date(lead.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Recent";

                    return `
                      <tr class="${rowClass}">
                        <td class="data-cell center-align">${idx + 1}</td>
                        <td class="data-cell" style="font-weight: bold; color: #0f172a;">${escapeXml(lead.name || "N/A")}</td>
                        <td class="data-cell phone-text">${escapeXml(cleanPhone)}</td>
                        <td class="data-cell text-force">${escapeXml(lead.email || "N/A")}</td>
                        <td class="data-cell">${escapeXml(lead.course_interest || "General")}</td>
                        <td class="data-cell">${escapeXml(lead.college_interest || "Website Form")}</td>
                        <td class="data-cell">${escapeXml(lead.state_interest || "India")}</td>
                        <td class="data-cell status-badge">${escapeXml(lead.status || "New Lead")}</td>
                        <td class="data-cell" style="color: #475569;">${escapeXml(lead.notes || "None")}</td>
                        <td class="data-cell center-align text-force">${escapeXml(dateFormatted)}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </body>
          </html>
        `;

        const blob = new Blob([excelHtml], {
          type: "application/vnd.ms-excel;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `College19_Leads_Report_${timestamp}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // CSV Export with formula protection to prevent scientific notation in Excel
        const headers = [
          "S.No",
          "Student Name",
          "Mobile Number",
          "Email Address",
          "Interested Course",
          "Target College / Inquiry Source",
          "State / Region",
          "Lead Status",
          "Counselor Remarks",
          "Received Date & Time",
        ];

        const csvRows = [headers.join(",")];

        exportData.forEach((lead, idx) => {
          const clean = (val: string | null | undefined) =>
            `"${(val || "").replace(/"/g, '""')}"`;

          // Format phone as ="9570538697" formula so Excel parses it as exact string
          const formattedPhone = lead.phone ? `="'+91 ${lead.phone}"` : `"N/A"`;

          const row = [
            idx + 1,
            clean(lead.name),
            formattedPhone,
            clean(lead.email || "N/A"),
            clean(lead.course_interest || "General"),
            clean(lead.college_interest || "Website Form"),
            clean(lead.state_interest || "India"),
            clean(lead.status || "New Lead"),
            clean(lead.notes || "None"),
            clean(lead.created_at ? new Date(lead.created_at).toLocaleString("en-IN") : "Recent"),
          ];

          csvRows.push(row.join(","));
        });

        const blob = new Blob(["\uFEFF" + csvRows.join("\n")], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `College19_Leads_Report_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setExportDropdownOpen(false);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export Excel report. Please try again.");
    }
  };

  // Helper for status badges
  const getStatusBadge = (status?: string | null) => {
    const s = (status || "New").toLowerCase();
    if (s.includes("enroll") || s.includes("admit") || s.includes("confirm")) {
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        label: "Admission Confirmed",
      };
    }
    if (s.includes("interest") || s.includes("discussion") || s.includes("contact")) {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
        label: "In Discussion",
      };
    }
    if (s.includes("follow") || s.includes("later") || s.includes("callback")) {
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        label: "Follow Up",
      };
    }
    if (s.includes("not") || s.includes("reject") || s.includes("closed")) {
      return {
        bg: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
        label: "Closed",
      };
    }
    return {
      bg: "bg-orange-50 text-orange-700 border-orange-200",
      dot: "bg-orange-500 animate-pulse",
      label: "New Inquiry",
    };
  };

  // ==========================================
  // VIEW 1: GLASSMORPHIC CLIENT LOGIN SCREEN
  // ==========================================
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20 text-white font-black text-xl tracking-tight">
              C19
            </div>
            <h1 className="font-outfit font-black text-2xl text-white tracking-tight">
              Partner Leads Desk
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              College19 Admissions & Client CRM Gateway
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                Partner Username
              </label>
              <input
                required
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                Passcode / Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Access Leads Portal
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-7 pt-5 border-t border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <Lock className="w-3 h-3 text-slate-400" />
              End-to-end encrypted CRM data stream
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FULL ENTERPRISE LEADS CRM DESK
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* TOP EXECUTIVE NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-sm tracking-tight shadow-md shadow-orange-500/20">
              C19
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-outfit font-black text-base sm:text-lg text-slate-900 leading-tight">
                  College19
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wide">
                  Partner Desk
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Live Student Inquiries & Admissions CRM
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Sync Active</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchLeads()}
              disabled={isLoading}
              title="Refresh Leads Data"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-orange-500" : ""}`} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* SECTION 1: TOP EXECUTIVE KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {/* Card 1: Total Leads */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Total Inquiries
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="font-outfit font-black text-2xl sm:text-3xl text-slate-900">
              {stats.total.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              All website forms combined
            </p>
          </div>

          {/* Card 2: Fresh Today */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-white to-orange-50/50 rounded-2xl border border-orange-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Fresh Today
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="font-outfit font-black text-2xl sm:text-3xl text-orange-600">
              {stats.today.toLocaleString()}
            </div>
            <p className="text-[10px] text-orange-600/80 font-semibold mt-1">
              Ready for immediate calling
            </p>
          </div>

          {/* Card 3: In Discussion */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                In Discussion
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="font-outfit font-black text-2xl sm:text-3xl text-slate-900">
              {stats.contacted.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              Telecall follow-ups ongoing
            </p>
          </div>

          {/* Card 4: Admissions Confirmed */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Confirmed Admissions
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="font-outfit font-black text-2xl sm:text-3xl text-emerald-600">
              {stats.enrolled.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-600/80 font-semibold mt-1">
              Successfully converted
            </p>
          </div>
        </div>

        {/* SECTION 2: COMMAND TOOLBAR (SEARCH + FILTERS + EXCEL EXPORT) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads by student name, mobile, email, or target college..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Excel Download Dropdown Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Download Excel Sheet</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {exportDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-left"
                  >
                    <div className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                      Excel Spreadsheet (.xls)
                    </div>
                    <button
                      type="button"
                      onClick={() => exportToExcel("excel", false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span>Export Filtered List</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {leads.length} records (Auto-width & Styled)
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => exportToExcel("excel", true)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-orange-600 shrink-0" />
                      <div>
                        <span>Export Master Database</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          All {totalLeadsCount} total leads
                        </span>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1.5 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                      CSV Format (.csv)
                    </div>
                    <button
                      type="button"
                      onClick={() => exportToExcel("csv", false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <span>Export as CSV</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Protected numbers for CRM import
                        </span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Filter Dropdowns Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
            {/* 1. Date Range Filter */}
            <div>
              <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today (Fresh)</option>
                <option value="yesterday">Yesterday</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* 2. Status Filter */}
            <div>
              <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                Lead Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">New / Pending</option>
                <option value="Contacted">Contacted / Called</option>
                <option value="Interested">Interested</option>
                <option value="Follow">Follow Up</option>
                <option value="Confirmed">Admission Confirmed</option>
                <option value="Closed">Closed / Not Interested</option>
              </select>
            </div>

            {/* 3. Course Filter */}
            <div>
              <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                Target Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Courses</option>
                <option value="PGDM">PGDM</option>
                <option value="MBA">MBA</option>
                <option value="B.Tech">B.Tech / Engineering</option>
                <option value="BBA">BBA</option>
                <option value="BCA">BCA</option>
                <option value="Medical">Medical / MBBS</option>
                {availableCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. College Filter */}
            <div>
              <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                Target College
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => {
                  setSelectedCollege(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Colleges</option>
                <option value="IBI">I Business Institute (IBI)</option>
                <option value="GIMS">GIMS Greater Noida</option>
                {availableColleges.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: LEADS DATA TABLE & TELECALLER WORKSPACE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-16 text-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-500">
                Fetching verified student inquiries...
              </p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-black text-base text-slate-700">
                No Leads Match Your Filter
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Try selecting "All Dates" or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus("all");
                  setSelectedCourse("all");
                  setSelectedCollege("all");
                  setDateFilter("all");
                }}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Table Header */}
                <thead className="bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Student Details</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Inquiry / College</th>
                    <th className="py-3.5 px-4">Date Received</th>
                    <th className="py-3.5 px-4">Lead Status</th>
                    <th className="py-3.5 px-4 text-right">Telecaller Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const badge = getStatusBadge(lead.status);
                    const cleanPhone = lead.phone.replace(/\D/g, "");
                    const whatsappMsg = encodeURIComponent(
                      `Hello ${lead.name}, greetings from College19! We received your admission inquiry for ${lead.course_interest || "Higher Studies"} at ${lead.college_interest || "our partner colleges"}. How can we assist you with fees, cutoffs, and admissions today?`
                    );

                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* 1. Student Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900 text-xs">
                            {lead.name}
                          </div>
                          {lead.state_interest && (
                            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                              📍 {lead.state_interest}
                            </span>
                          )}
                        </td>

                        {/* 2. Phone & Email */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 tracking-wide font-mono">
                            +91 {lead.phone}
                          </div>
                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-[10px] text-slate-500 hover:text-orange-600 block mt-0.5 truncate max-w-[160px]"
                            >
                              {lead.email}
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 block">No Email</span>
                          )}
                        </td>

                        {/* 3. Course & Target College */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {lead.course_interest || "General Admission"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {lead.college_interest || "Website Form"}
                            </span>
                          </div>
                        </td>

                        {/* 4. Timestamp */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                          {lead.created_at ? (
                            <>
                              <div className="font-semibold text-slate-700">
                                {new Date(lead.created_at).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <span className="text-[10px] text-slate-400 block">
                                {new Date(lead.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </>
                          ) : (
                            "Recent"
                          )}
                        </td>

                        {/* 5. Status Selector */}
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status || "Pending"}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold outline-none cursor-pointer ${badge.bg}`}
                          >
                            <option value="Pending">🟢 New Lead</option>
                            <option value="Contacted">🟡 Contacted / Called</option>
                            <option value="Interested">🔵 Interested</option>
                            <option value="Follow Up">🟠 Follow Up</option>
                            <option value="Admission Done">🏆 Admission Done</option>
                            <option value="Closed">⚪ Closed</option>
                          </select>
                        </td>

                        {/* 6. Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Call Button */}
                            <a
                              href={`tel:${cleanPhone}`}
                              title="Call Student"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp Button */}
                            <a
                              href={`https://wa.me/91${cleanPhone}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            {/* Remarks / Notes Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveLeadNotes(lead);
                                setEditingNotesText(lead.notes || "");
                              }}
                              title="Add Telecaller Remarks"
                              className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                                lead.notes
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              {lead.notes ? "View Note" : "+ Note"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE PAGINATION FOOTER */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing <b>{leads.length}</b> of <b>{totalLeadsCount}</b> verified inquiries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <span className="px-3 py-1 text-slate-700 font-bold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* COUNSELOR REMARKS / NOTES MODAL */}
      <AnimatePresence>
        {activeLeadNotes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative border border-slate-100 space-y-4"
            >
              <button
                onClick={() => setActiveLeadNotes(null)}
                className="absolute top-5 right-5 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="font-outfit font-black text-lg text-slate-900">
                  Counselor Follow-up Notes
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Student: <b>{activeLeadNotes.name}</b> (+91 {activeLeadNotes.phone})
                </p>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                  Add Discussion Remarks
                </label>
                <textarea
                  rows={4}
                  value={editingNotesText}
                  onChange={(e) => setEditingNotesText(e.target.value)}
                  placeholder="e.g. Spoke with parents, looking for PGDM scholarship. Call back scheduled for tomorrow at 5 PM."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLeadNotes(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingNotes}
                  onClick={handleSaveNotes}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingNotes ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Save Remark
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
