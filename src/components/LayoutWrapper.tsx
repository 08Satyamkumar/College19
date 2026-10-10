"use client";

import React, { useState, useEffect, useRef } from "react";
import AuthModal from "@/components/AuthModal";
import SearchOverlay from "@/components/SearchOverlay";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  Award,
  CheckCircle,
  BookOpen,
  Layers,
  FileText,
  MapPin,
  Shuffle,
  Star,
  Percent,
  Compass,
  MessageSquare,
  Bot,
  Send,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  User,
  Mail,
  Search,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface MegaMenuItem {
  category: string;
  links: { name: string; href: string }[];
}

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [menuHoverTimeout, setMenuHoverTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const handleCategoryMouseEnter = (category: string) => {
    if (menuHoverTimeout) clearTimeout(menuHoverTimeout);
    if (activeMegaMenu && activeMegaMenu !== category) {
      // If a menu is already open, apply a small hover intent delay (120ms) to prevent accidental switching
      const timeout = setTimeout(() => {
        setActiveMegaMenu(category);
      }, 120);
      setMenuHoverTimeout(timeout);
    } else {
      // Open immediately if no menu is open, or if it is the same category
      setActiveMegaMenu(category);
    }
  };

  const handleMenuMouseLeave = () => {
    if (menuHoverTimeout) clearTimeout(menuHoverTimeout);
    setActiveMegaMenu(null);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMbaTab, setActiveMbaTab] = useState("Top Ranked Colleges");
  const [activeEngTab, setActiveEngTab] = useState("Top Ranked Colleges");
  const [activeMedicalTab, setActiveMedicalTab] = useState(
    "Top Ranked Colleges",
  );
  const [activeMoreTab, setActiveMoreTab] = useState("Paramedical");
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    mode: "login" | "signup";
  }>({
    open: false,
    mode: "login",
  });
  const pathname = usePathname();
  const isCollegeDetailPage = Boolean(
    pathname &&
    pathname.startsWith("/colleges/") &&
    pathname !== "/colleges" &&
    pathname !== "/colleges/ranking"
  );
  const router = useRouter();
  // Theme is always light — useTheme kept for context but toggle not used
  useTheme();

  // User authentication state
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    const savedUser = localStorage.getItem("tyc-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Expose openTYCAuthModal globally so other client pages can request auth
    if (typeof window !== "undefined") {
      (window as any).openTYCAuthModal = (
        mode: "login" | "signup" = "login",
      ) => {
        setAuthModal({ open: true, mode });
      };
    }

    // Dispatch global event on user log in/out to sync other client pages
    const syncUser = () => {
      const liveUser = localStorage.getItem("tyc-user");
      if (liveUser) {
        setUser(JSON.parse(liveUser));
      } else {
        setUser(null);
      }
    };
    window.addEventListener("storage", syncUser);
    window.addEventListener("tyc-user-sync", syncUser);

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).openTYCAuthModal;
      }
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("tyc-user-sync", syncUser);
    };
  }, []);

  // ══════════════════════════════════════════
  //      AI SARTHI CHATBOT STATES & LOGIC
  // ══════════════════════════════════════════
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: "user" | "bot"; text: string; time: string }>
  >([
    {
      id: "init",
      sender: "bot",
      text: "Namaste! 🙏 Mai Sarthi hoon, aapka smart college counselor. Mujhe colleges, placements, fees, ya predictors ke baare mein poohein! (e.g. Try asking: 'Galgotias placements' or 'AIIMS Rishikesh fees')",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isBotTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Math.random().toString(),
      sender: "user" as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsBotTyping(true);

    // AI Responses Logic
    setTimeout(() => {
      let responseText = "";
      const cleanText = textToSend.toLowerCase();

      if (cleanText.includes("galgotias")) {
        responseText =
          "🏫 **Galgotias University (Greater Noida)** is a leading private university:\n\n• **NIRF Rank**: #95 (Engineering)\n• **Highest Package**: 35.0 LPA\n• **Average Package**: 8.5 LPA\n• **B.Tech CSE Fee**: ₹1.59 Lakhs/Yr\n• **Key USP**: State-of-the-art AI & DS blocks, 3D Printing & Makers Lab, and partnership with L&T EduTech!";
      } else if (cleanText.includes("delhi") || cleanText.includes("iitd")) {
        responseText =
          "🏛️ **IIT Delhi (Hauz Khas, New Delhi)** is one of India's apex engineering institutes:\n\n• **NIRF Rank**: #2 (Engineering)\n• **Highest Package**: ₹1.2 Crore PA\n• **Average Package**: ₹21.5 Lakhs PA\n• **Fees**: ₹2.2 Lakhs/Yr\n• **Top Recruiters**: Google, Microsoft, Apple, Uber, Goldman Sachs.";
      } else if (
        cleanText.includes("rishikesh") ||
        cleanText.includes("aiims")
      ) {
        responseText =
          "🏥 **AIIMS Rishikesh (Uttarakhand)** is a world-class premier medical institution:\n\n• **NIRF Rank**: #22 (Medical)\n• **Total Academic Fees**: ₹5,850 (extremely subsidized)\n• **MBBS Admission**: Through NEET UG (650+ rank cutoff)\n• **Avg Package**: ₹12.0 Lakhs PA\n• **Highlights**: Scenic Himalayan valley campus, massive clinical patient load, modern research labs.";
      } else if (cleanText.includes("amity")) {
        responseText =
          "🏢 **Amity University (Noida)** is a world-class private campus:\n\n• **Estd**: 2005\n• **B.Tech Fees**: ₹2.2 Lakhs/Yr\n• **Highlights**: Multi-crore research grants, high placement record, sports complex, high student rating.";
      } else if (cleanText.includes("chandigarh")) {
        responseText =
          "🌲 **Chandigarh University (Punjab)** is a massive private university:\n\n• **NIRF Rank**: Top 30 in Universities\n• **Highest Package**: ₹54.0 LPA\n• **Average Package**: ₹7.5 LPA\n• **Highlights**: Vibrant campus life, global collaborations, strong industry networking.";
      } else if (cleanText.includes("compare")) {
        responseText =
          "⚖️ **College 19 Comparison Tool**:\n\nAap custom colleges compare karne ke liye screen ke center-right mein floating **Compare Button (Shuffle Icon)** par click kijiye. Wahan aap categories like engineering/management select karke multiple colleges side-by-side analyze kar sakte hain.";
      } else if (
        cleanText.includes("predictor") ||
        cleanText.includes("counseling")
      ) {
        responseText =
          "🎯 **Admission Predictor**:\n\nAap home page ya navigation menu mein **Predictor** tab par click karein. Wahan apna Entrance Exam (JEE/NEET/CAT), category aur secure rank input kijiye, aur humara tool aapko matching colleges predict kar ke dega!";
      } else if (
        cleanText.includes("hello") ||
        cleanText.includes("hii") ||
        cleanText.includes("hy") ||
        cleanText.includes("suno")
      ) {
        responseText =
          "Hello! 👋 Mai Sarthi hoon. Mai aapki kya sahayata kar sakta hoon? Aap mujhe private aur government colleges, fees, rank, aur placements ke baare mein pooch sakte hain.";
      } else {
        responseText =
          "Mujhe aapka sawaal samajh aaya! 🤖\n\nAap private/government colleges, packages ya fees ke baare mein details pooch rahe hain. \n\nTry asking: \n• *'Galgotias placements?'*\n• *'IIT Delhi highest package?'*\n• *'AIIMS Rishikesh MBBS fees?'*";
      }

      const botMsg = {
        id: Math.random().toString(),
        sender: "bot" as const,
        text: responseText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 1200);
  };

  // ══════════════════════════════════════════
  //      ADMISSION ALERTS POPUP STATE & LOGIC
  // ══════════════════════════════════════════
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertName, setAlertName] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertPhone, setAlertPhone] = useState("");
  const [alertStream, setAlertStream] = useState("");
  const [alertLevel, setAlertLevel] = useState("");
  const [alertAgeConfirm, setAlertAgeConfirm] = useState(false);
  const [alertTermsAgree, setAlertTermsAgree] = useState(false);
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(false);

  const handleAlertSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertName.trim() || !alertEmail.trim() || !alertPhone.trim()) return;

    // Save lead details into localStorage
    const newLead = {
      id: Math.random().toString(),
      name: alertName,
      email: alertEmail,
      phone: alertPhone,
      stream: alertStream,
      level: alertLevel,
      timestamp: new Date().toLocaleString(),
    };

    const existingLeads = JSON.parse(localStorage.getItem("tyc-leads") || "[]");
    localStorage.setItem(
      "tyc-leads",
      JSON.stringify([...existingLeads, newLead]),
    );

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: alertName,
          email: alertEmail || null,
          phone: alertPhone,
          course_interest: `${alertStream} (${alertLevel})`,
          college_interest: "General Inquiry (Global Popup)",
        }),
      });
    } catch (err) {
      console.error("Failed to send lead to Supabase:", err);
    }

    setIsAlertSubscribed(true);
  };

  // Auto-reopen alert popup if closed and not subscribed (disabled during development/staging)
  /*
  useEffect(() => {
    if (!isAlertOpen && !isAlertSubscribed) {
      const timer = setTimeout(() => {
        setIsAlertOpen(true);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [isAlertOpen, isAlertSubscribed]);
  */

  // MBA Mega Menu Sub-tabs structure matching screenshot (nested for multi-column grids)
  const mbaTabs: Record<string, MegaSubCategory[]> = {
    "Top Ranked Colleges": [
      {
        heading: "Colleges By Rank",
        links: [
          { name: "Top MBA Colleges", href: "/colleges?stream=Management" },
          {
            name: "Top Private MBA Colleges",
            href: "/colleges?stream=Management&type=Private",
          },
          {
            name: "Top Government MBA Colleges",
            href: "/colleges?stream=Management",
          },
          {
            name: "Executive MBA Colleges",
            href: "/colleges?stream=Management",
          },
        ],
      },
      {
        heading: "Colleges By State",
        links: [
          {
            name: "Maharashtra",
            href: "/colleges?stream=Management&state=Maharashtra",
          },
          {
            name: "Delhi NCR",
            href: "/colleges?stream=Management&state=Delhi",
          },
          {
            name: "Uttar Pradesh",
            href: "/colleges?stream=Management&state=Uttar-Pradesh",
          },
          {
            name: "Karnataka",
            href: "/colleges?stream=Management&state=Karnataka",
          },
          {
            name: "Tamil Nadu",
            href: "/colleges?stream=Management&state=Tamil-Nadu",
          },
        ],
      },
      {
        heading: "Colleges By City",
        links: [
          {
            name: "Mumbai",
            href: "/colleges?stream=Management&state=Maharashtra",
          },
          {
            name: "Bangalore",
            href: "/colleges?stream=Management&state=Karnataka",
          },
          {
            name: "Pune",
            href: "/colleges?stream=Management&state=Maharashtra",
          },
          {
            name: "Noida",
            href: "/colleges?stream=Management&state=Uttar-Pradesh",
          },
          { name: "Hyderabad", href: "/colleges?stream=Management" },
        ],
      },
    ],
    "Popular Courses": [
      {
        heading: "Management Degree",
        links: [
          {
            name: "MBA (Master of Business Admin)",
            href: "/colleges?stream=Management",
          },
          {
            name: "BBA (Bachelor of Business Admin)",
            href: "/colleges?stream=Management",
          },
          {
            name: "BBM (Bachelor of Business Mgmt)",
            href: "/colleges?stream=Management",
          },
        ],
      },
      {
        heading: "Diploma & PGDM",
        links: [
          { name: "PGDM Program", href: "/colleges?stream=Management" },
          { name: "PGDBM Program", href: "/colleges?stream=Management" },
          { name: "Executive PGDM", href: "/colleges?stream=Management" },
        ],
      },
      {
        heading: "Alternative Learning",
        links: [
          { name: "Distance MBA", href: "/colleges?stream=Management" },
          { name: "Online MBA", href: "/colleges?stream=Management" },
          { name: "Part Time MBA", href: "/colleges?stream=Management" },
        ],
      },
    ],
    "Popular Specializations": [
      {
        heading: "Core Functions",
        links: [
          {
            name: "MBA in Finance",
            href: "/colleges?stream=Management&search=Finance",
          },
          {
            name: "MBA in Marketing",
            href: "/colleges?stream=Management&search=Marketing",
          },
          {
            name: "MBA in Human Resource (HR)",
            href: "/colleges?stream=Management&search=HR",
          },
        ],
      },
      {
        heading: "Tech & Operations",
        links: [
          {
            name: "MBA in Information Tech (IT)",
            href: "/colleges?stream=Management&search=IT",
          },
          {
            name: "MBA in Operations Management",
            href: "/colleges?stream=Management&search=Operations",
          },
          {
            name: "MBA in Data Science & Analytics",
            href: "/colleges?stream=Management&search=Data",
          },
        ],
      },
      {
        heading: "Niche Areas",
        links: [
          {
            name: "MBA in Healthcare Management",
            href: "/colleges?stream=Management&search=Healthcare",
          },
          {
            name: "MBA in International Business",
            href: "/colleges?stream=Management&search=International",
          },
          {
            name: "MBA in Entrepreneurship",
            href: "/colleges?stream=Management&search=Entrepreneurship",
          },
        ],
      },
    ],
    Exams: [
      {
        heading: "National Level Exams",
        links: [
          { name: "CAT Exam", href: "/predictor?exam=CAT" },
          { name: "XAT Exam", href: "/predictor?exam=XAT" },
          { name: "CMAT Exam", href: "/predictor?exam=CMAT" },
          { name: "MAT Exam", href: "/predictor?exam=MAT" },
        ],
      },
      {
        heading: "State & University Exams",
        links: [
          { name: "SNAP Test", href: "/predictor?exam=SNAP" },
          { name: "NMAT by GMAC", href: "/predictor?exam=NMAT" },
          { name: "MAH MBA CET", href: "/predictor?exam=MAH-CET" },
          { name: "KIITEE Management", href: "/predictor?exam=KIITEE" },
        ],
      },
      {
        heading: "Other Entrance Tests",
        links: [
          { name: "UPESMET Test", href: "/predictor?exam=UPESMET" },
          { name: "IBSAT Test", href: "/predictor?exam=IBSAT" },
          { name: "All MBA Entrance Predictors >", href: "/predictor" },
        ],
      },
    ],
    "Colleges By Location": [
      {
        heading: "Top States",
        links: [
          {
            name: "Colleges in Maharashtra",
            href: "/colleges?stream=Management&state=Maharashtra",
          },
          {
            name: "Colleges in Delhi NCR",
            href: "/colleges?stream=Management&state=Delhi",
          },
          {
            name: "Colleges in Karnataka",
            href: "/colleges?stream=Management&state=Karnataka",
          },
          {
            name: "Colleges in Uttar Pradesh",
            href: "/colleges?stream=Management&state=Uttar-Pradesh",
          },
        ],
      },
      {
        heading: "Metro Cities",
        links: [
          {
            name: "Colleges in Bangalore",
            href: "/colleges?stream=Management&state=Karnataka",
          },
          {
            name: "Colleges in Mumbai",
            href: "/colleges?stream=Management&state=Maharashtra",
          },
          {
            name: "Colleges in Pune",
            href: "/colleges?stream=Management&state=Maharashtra",
          },
          {
            name: "Colleges in Noida",
            href: "/colleges?stream=Management&state=Uttar-Pradesh",
          },
        ],
      },
      {
        heading: "South Cities",
        links: [
          {
            name: "Colleges in Chennai",
            href: "/colleges?stream=Management&state=Tamil-Nadu",
          },
          {
            name: "Colleges in Hyderabad",
            href: "/colleges?stream=Management",
          },
          { name: "Colleges in Kolkata", href: "/colleges?stream=Management" },
          {
            name: "Explore All Locations >",
            href: "/colleges?stream=Management",
          },
        ],
      },
    ],
    "Compare Colleges": [
      {
        heading: "Top Premium Comparisons",
        links: [
          { name: "IIM Ahmedabad Vs IIM Bangalore", href: "/compare?ids=1,2" },
          { name: "IIM Ahmedabad Vs IIM Calcutta", href: "/compare?ids=1,10" },
        ],
      },
      {
        heading: "Top University Comparisons",
        links: [
          { name: "SIBM Pune Vs SCMHRD Pune", href: "/compare?ids=7,14" },
          {
            name: "SP Jain (SPJIMR) Vs MDI Gurgaon",
            href: "/compare?ids=11,15",
          },
        ],
      },
      {
        heading: "Private Vs Private",
        links: [
          { name: "NMIMS SBM Mumbai Vs SP Jain", href: "/compare?ids=12,11" },
          { name: "Compare Other MBA Colleges >", href: "/compare" },
        ],
      },
    ],
    "College Reviews": [
      {
        heading: "Top Reviewed IIMs",
        links: [
          { name: "IIM Ahmedabad Reviews", href: "/colleges/iim-ahmedabad" },
          { name: "IIM Bangalore Reviews", href: "/colleges/iim-bangalore" },
          { name: "IIM Calcutta Reviews", href: "/colleges/iim-calcutta" },
        ],
      },
      {
        heading: "Top Reviewed Private",
        links: [
          { name: "SIBM Pune Reviews", href: "/colleges/sibm-pune" },
          { name: "NMIMS Mumbai Reviews", href: "/colleges/nmims-mumbai" },
          { name: "MDI Gurgaon Reviews", href: "/colleges/mdi-gurgaon" },
        ],
      },
      {
        heading: "Discussion Boards",
        links: [
          {
            name: "Ask Current MBA Students",
            href: "/colleges?stream=Management",
          },
          {
            name: "MBA Placement & Salary Data",
            href: "/colleges?stream=Management",
          },
        ],
      },
    ],
    "CAT Percentile Predictor": [
      {
        heading: "Predict Cutoffs",
        links: [
          { name: "Calculate CAT Cutoffs", href: "/predictor" },
          { name: "Predict Counseling Chances", href: "/predictor" },
        ],
      },
    ],
    "College Predictors": [
      {
        heading: "Top Exams",
        links: [
          { name: "IIM & Non IIM Call Predictor", href: "/predictor?exam=CAT" },
          { name: "CAT College Predictor", href: "/predictor?exam=CAT" },
          { name: "MAH CET College Predictor", href: "/predictor?exam=MAHCET" },
        ],
      },
      {
        heading: "Other National Exams",
        links: [
          { name: "XAT College/ Call Predictor", href: "/predictor?exam=XAT" },
          { name: "IIFT College Predictor", href: "/predictor?exam=IIFT" },
          { name: "NMAT College Predictor", href: "/predictor?exam=NMAT" },
        ],
      },
      {
        heading: "State Level Exams",
        links: [
          {
            name: "SNAP College & Call Predictor",
            href: "/predictor?exam=SNAP",
          },
          { name: "CMAT College Predictor", href: "/predictor?exam=CMAT" },
          { name: "MAT College Predictor", href: "/predictor?exam=MAT" },
          { name: "TANCET College Predictor", href: "/predictor?exam=TANCET" },
        ],
      },
    ],
    "Ask Current MBA Students": [
      {
        heading: "Top Schools",
        links: [
          { name: "IIM Ahmedabad Q&A", href: "/colleges/iim-ahmedabad" },
          { name: "JBIMS Mumbai Q&A", href: "/colleges/jbims-mumbai" },
          { name: "SIBM Pune Q&A", href: "/colleges/sibm-pune" },
        ],
      },
      {
        heading: "Other Cities",
        links: [
          { name: "XIME Bangalore Q&A", href: "/colleges/xime-bangalore" },
          { name: "NMIMS Mumbai Q&A", href: "/colleges/nmims-mumbai" },
          { name: "FMS Delhi Q&A", href: "/colleges/fms-delhi" },
        ],
      },
      {
        heading: "General Help",
        links: [
          {
            name: "Ask Other MBA Colleges >",
            href: "/colleges?stream=Management",
          },
        ],
      },
    ],
    Resources: [
      {
        heading: "Interactive Tools",
        links: [
          {
            name: "MBA Alumni Salary Data",
            href: "/colleges?stream=Management",
          },
          { name: "Ask a Question", href: "/contact?subject=QnA" },
          { name: "Discussions Board", href: "/contact?subject=Discussion" },
        ],
      },
      {
        heading: "Latest Updates",
        links: [
          { name: "MBA News & Notifications", href: "/predictor" },
          { name: "MBA Expert Articles", href: "/predictor" },
          {
            name: "Trends in MBA Admissions",
            href: "/colleges?stream=Management",
          },
        ],
      },
    ],
  };

  const mbaTabIcons: Record<string, any> = {
    "Top Ranked Colleges": Award,
    "Popular Courses": BookOpen,
    "Popular Specializations": Layers,
    Exams: FileText,
    "Colleges By Location": MapPin,
    "Compare Colleges": Shuffle,
    "College Reviews": Star,
    "CAT Percentile Predictor": Percent,
    "College Predictors": Compass,
    "Ask Current MBA Students": MessageSquare,
    Resources: Sparkles,
  };

  const engTabIcons: Record<string, any> = {
    "Top Ranked Colleges": Award,
    "Popular Courses": BookOpen,
    "Popular Specializations": Layers,
    Exams: FileText,
    "Colleges By Location": MapPin,
    "Compare Colleges": Shuffle,
    "Rank Predictors": Percent,
    "Percentile Predictors": Percent,
    "College Predictors": Compass,
    "College Reviews": Star,
    Resources: Sparkles,
  };

  const moreTabs: Record<string, MegaSubCategory[]> = {
    Paramedical: [
      {
        heading: "Colleges By Course",
        links: [
          {
            name: "B.Sc Paramedical Colleges",
            href: "/colleges?stream=Paramedical",
          },
          {
            name: "Diploma Paramedical Colleges",
            href: "/colleges?stream=Paramedical",
          },
          {
            name: "B.Sc Nursing Colleges",
            href: "/colleges?stream=Paramedical",
          },
        ],
      },
      {
        heading: "Colleges By Location",
        links: [
          {
            name: "Colleges in Bangalore",
            href: "/colleges?stream=Paramedical",
          },
          { name: "Colleges in Mumbai", href: "/colleges?stream=Paramedical" },
          {
            name: "Colleges in Delhi NCR",
            href: "/colleges?stream=Paramedical",
          },
        ],
      },
      {
        heading: "Entrance Exams",
        links: [
          { name: "NEET Paramedical", href: "/predictor" },
          { name: "AIIMS Nursing Entrance", href: "/predictor" },
        ],
      },
    ],
    Pharmacy: [
      {
        heading: "Colleges By Course",
        links: [
          { name: "B.Pharm Colleges", href: "/colleges?stream=Pharmacy" },
          { name: "D.Pharm Colleges", href: "/colleges?stream=Pharmacy" },
          { name: "M.Pharm Colleges", href: "/colleges?stream=Pharmacy" },
        ],
      },
      {
        heading: "Colleges By State",
        links: [
          {
            name: "Maharashtra Pharmacy",
            href: "/colleges?stream=Pharmacy&state=Maharashtra",
          },
          {
            name: "Uttar Pradesh Pharmacy",
            href: "/colleges?stream=Pharmacy&state=Uttar-Pradesh",
          },
          {
            name: "Karnataka Pharmacy",
            href: "/colleges?stream=Pharmacy&state=Karnataka",
          },
        ],
      },
      {
        heading: "Pharmacy Exams",
        links: [
          { name: "GPAT Exam", href: "/predictor" },
          { name: "KCET Pharmacy", href: "/predictor" },
          { name: "MAHE OET", href: "/predictor" },
        ],
      },
    ],
    Architecture: [
      {
        heading: "Colleges By Course",
        links: [
          { name: "B.Arch Colleges", href: "/colleges?stream=Architecture" },
          { name: "M.Arch Colleges", href: "/colleges?stream=Architecture" },
        ],
      },
      {
        heading: "Entrance Exams",
        links: [
          { name: "NATA Exam", href: "/predictor" },
          { name: "JEE Main Paper 2", href: "/predictor" },
        ],
      },
    ],
    Design: [
      {
        heading: "Colleges By Course",
        links: [
          { name: "B.Des Colleges", href: "/colleges?stream=Design" },
          { name: "M.Des Colleges", href: "/colleges?stream=Design" },
          { name: "NIFT & NID Colleges", href: "/colleges?stream=Design" },
        ],
      },
      {
        heading: "Design Exams",
        links: [
          { name: "UCEED Exam", href: "/predictor" },
          { name: "NIFT Entrance Exam", href: "/predictor" },
          { name: "NID DAT Exam", href: "/predictor" },
        ],
      },
    ],
    Hospitality: [
      {
        heading: "Colleges By Course",
        links: [
          {
            name: "BHM Colleges (Hotel Mgmt)",
            href: "/colleges?stream=Hospitality",
          },
          { name: "B.Sc Hospitality", href: "/colleges?stream=Hospitality" },
        ],
      },
      {
        heading: "Entrance Exams",
        links: [{ name: "NCHMCT JEE", href: "/predictor" }],
      },
    ],
    Law: [
      {
        heading: "Colleges By Course",
        links: [
          { name: "BA LLB Colleges", href: "/colleges?stream=Law" },
          { name: "BBA LLB Colleges", href: "/colleges?stream=Law" },
          { name: "LLM Colleges", href: "/colleges?stream=Law" },
        ],
      },
      {
        heading: "Law Exams",
        links: [
          { name: "CLAT Exam", href: "/predictor?exam=CLAT" },
          { name: "AILET Exam", href: "/predictor" },
          { name: "LSAT India", href: "/predictor" },
        ],
      },
    ],
    "Veterinary Science": [
      {
        heading: "Programs Offered",
        links: [
          {
            name: "B.V.Sc & AH Colleges",
            href: "/colleges?stream=Veterinary-Science",
          },
          {
            name: "M.V.Sc Colleges",
            href: "/colleges?stream=Veterinary-Science",
          },
        ],
      },
      {
        heading: "Entrance Exams",
        links: [{ name: "NEET Veterinary Cutoff", href: "/predictor" }],
      },
    ],
    "Vocational Courses": [
      {
        heading: "Courses Offered",
        links: [
          { name: "B.Voc Colleges", href: "/colleges?stream=Vocational" },
          { name: "M.Voc Colleges", href: "/colleges?stream=Vocational" },
          { name: "Diploma Vocational", href: "/colleges?stream=Vocational" },
        ],
      },
    ],
    Arts: [
      {
        heading: "Colleges By Course",
        links: [
          { name: "BA Fine Arts Colleges", href: "/colleges?stream=Arts" },
          { name: "MA Fine Arts Colleges", href: "/colleges?stream=Arts" },
        ],
      },
    ],
    "Computer Application": [
      {
        heading: "Colleges By Course",
        links: [
          {
            name: "BCA Colleges",
            href: "/colleges?stream=Computer-Application",
          },
          {
            name: "MCA Colleges",
            href: "/colleges?stream=Computer-Application",
          },
        ],
      },
      {
        heading: "MCA Exams",
        links: [
          { name: "NIMCET Exam", href: "/predictor" },
          { name: "MAH MCA CET", href: "/predictor" },
        ],
      },
    ],
    Dental: [
      {
        heading: "Colleges By Course",
        links: [
          { name: "BDS Colleges", href: "/colleges?stream=Dental" },
          { name: "MDS Colleges", href: "/colleges?stream=Dental" },
        ],
      },
      {
        heading: "Dental Exams",
        links: [
          { name: "NEET BDS Cutoffs", href: "/predictor" },
          { name: "NEET MDS Cutoffs", href: "/predictor" },
        ],
      },
    ],
    Education: [
      {
        heading: "Colleges By Course",
        links: [
          { name: "B.Ed Colleges", href: "/colleges?stream=Education" },
          { name: "M.Ed Colleges", href: "/colleges?stream=Education" },
          { name: "D.El.Ed Colleges", href: "/colleges?stream=Education" },
        ],
      },
    ],
  };

  const medicalTabIcons: Record<string, any> = {
    "Top Ranked Colleges": Award,
    "Popular Courses": BookOpen,
    "Popular Specializations": Layers,
    Exams: FileText,
    "Colleges By Location": MapPin,
    "Compare Colleges": Shuffle,
    "College Reviews": Star,
  };

  const medicalTabs: Record<string, MegaSubCategory[]> = {
    "Top Ranked Colleges": [
      {
        heading: "Colleges By Rank",
        links: [
          {
            name: "Top Medical Colleges in India",
            href: "/colleges?stream=Medical",
          },
          {
            name: "Top Government MBBS Colleges",
            href: "/colleges?stream=Medical",
          },
          {
            name: "Top Private Medical Colleges",
            href: "/colleges?stream=Medical&type=Private",
          },
          {
            name: "Top Dental (BDS) Colleges",
            href: "/colleges?stream=Medical",
          },
        ],
      },
      {
        heading: "Colleges By State",
        links: [
          {
            name: "Maharashtra MBBS Colleges",
            href: "/colleges?stream=Medical&state=Maharashtra",
          },
          {
            name: "Delhi NCR Medical Colleges",
            href: "/colleges?stream=Medical&state=Delhi",
          },
          {
            name: "Uttar Pradesh MBBS Colleges",
            href: "/colleges?stream=Medical&state=Uttar-Pradesh",
          },
          {
            name: "Karnataka Medical Colleges",
            href: "/colleges?stream=Medical&state=Karnataka",
          },
          {
            name: "Tamil Nadu Medical Colleges",
            href: "/colleges?stream=Medical&state=Tamil-Nadu",
          },
        ],
      },
      {
        heading: "Colleges By City",
        links: [
          {
            name: "Mumbai Medical Colleges",
            href: "/colleges?stream=Medical&state=Maharashtra",
          },
          {
            name: "Bangalore Medical Colleges",
            href: "/colleges?stream=Medical&state=Karnataka",
          },
          {
            name: "Pune Medical Colleges",
            href: "/colleges?stream=Medical&state=Maharashtra",
          },
          {
            name: "Noida Medical Colleges",
            href: "/colleges?stream=Medical&state=Uttar-Pradesh",
          },
          {
            name: "Hyderabad Medical Colleges",
            href: "/colleges?stream=Medical",
          },
        ],
      },
    ],
    "Popular Courses": [
      {
        heading: "Undergraduate (UG)",
        links: [
          {
            name: "MBBS (Bachelor of Medicine)",
            href: "/colleges?stream=Medical",
          },
          {
            name: "BDS (Bachelor of Dental Surgery)",
            href: "/colleges?stream=Medical",
          },
          {
            name: "BAMS (Ayurvedic Medicine)",
            href: "/colleges?stream=Medical",
          },
          {
            name: "BHMS (Homeopathic Medicine)",
            href: "/colleges?stream=Medical",
          },
        ],
      },
      {
        heading: "Postgraduate (PG)",
        links: [
          { name: "MD (Doctor of Medicine)", href: "/colleges?stream=Medical" },
          { name: "MS (Master of Surgery)", href: "/colleges?stream=Medical" },
          {
            name: "MDS (Master of Dental Surgery)",
            href: "/colleges?stream=Medical",
          },
        ],
      },
      {
        heading: "Allied Health",
        links: [
          { name: "B.Sc Nursing", href: "/colleges?stream=Medical" },
          {
            name: "BPT (Bachelor of Physiotherapy)",
            href: "/colleges?stream=Medical",
          },
          {
            name: "MPT (Master of Physiotherapy)",
            href: "/colleges?stream=Medical",
          },
        ],
      },
    ],
    "Popular Specializations": [
      {
        heading: "Master of Surgery (MS)",
        links: [
          {
            name: "MS in General Surgery",
            href: "/colleges?stream=Medical&search=Surgery",
          },
          {
            name: "MS in Orthopaedics",
            href: "/colleges?stream=Medical&search=Orthopaedics",
          },
          {
            name: "MS in Anatomy",
            href: "/colleges?stream=Medical&search=Anatomy",
          },
          { name: "MS in ENT", href: "/colleges?stream=Medical&search=ENT" },
        ],
      },
      {
        heading: "Doctor of Medicine (MD)",
        links: [
          {
            name: "MD in General Medicine",
            href: "/colleges?stream=Medical&search=Medicine",
          },
          {
            name: "MD in Pathology",
            href: "/colleges?stream=Medical&search=Pathology",
          },
          {
            name: "MD in Dermatology",
            href: "/colleges?stream=Medical&search=Dermatology",
          },
          {
            name: "MD in Paediatrics",
            href: "/colleges?stream=Medical&search=Paediatrics",
          },
        ],
      },
      {
        heading: "Other Specializations",
        links: [
          { name: "Diploma in Gynaecology", href: "/colleges?stream=Medical" },
          {
            name: "BDS Dental Specializations",
            href: "/colleges?stream=Medical",
          },
        ],
      },
    ],
    Exams: [
      {
        heading: "UG Medical Exams",
        links: [
          { name: "NEET UG Exam", href: "/predictor?exam=NEET" },
          { name: "AIIMS MBBS Entrance", href: "/predictor?exam=NEET" },
        ],
      },
      {
        heading: "PG Medical Exams",
        links: [
          { name: "NEET PG Exam", href: "/predictor" },
          { name: "NEET MDS Exam", href: "/predictor" },
          { name: "AIIMS PG Entrance", href: "/predictor" },
        ],
      },
      {
        heading: "General Resources",
        links: [
          { name: "All Medical Exams Predictors >", href: "/predictor" },
          { name: "Counseling Predictor", href: "/predictor" },
        ],
      },
    ],
    "Colleges By Location": [
      {
        heading: "Top States",
        links: [
          {
            name: "Colleges in Maharashtra",
            href: "/colleges?stream=Medical&state=Maharashtra",
          },
          {
            name: "Colleges in Delhi NCR",
            href: "/colleges?stream=Medical&state=Delhi",
          },
          {
            name: "Colleges in Uttar Pradesh",
            href: "/colleges?stream=Medical&state=Uttar-Pradesh",
          },
          {
            name: "Colleges in Karnataka",
            href: "/colleges?stream=Medical&state=Karnataka",
          },
        ],
      },
      {
        heading: "Metro Cities",
        links: [
          {
            name: "Colleges in Mumbai",
            href: "/colleges?stream=Medical&state=Maharashtra",
          },
          {
            name: "Colleges in Bangalore",
            href: "/colleges?stream=Medical&state=Karnataka",
          },
          {
            name: "Colleges in Pune",
            href: "/colleges?stream=Medical&state=Maharashtra",
          },
          {
            name: "Colleges in Noida",
            href: "/colleges?stream=Medical&state=Uttar-Pradesh",
          },
        ],
      },
      {
        heading: "Other Hubs",
        links: [
          {
            name: "Colleges in Chennai",
            href: "/colleges?stream=Medical&state=Tamil-Nadu",
          },
          { name: "Colleges in Hyderabad", href: "/colleges?stream=Medical" },
          { name: "Colleges in Kolkata", href: "/colleges?stream=Medical" },
          { name: "Explore All Locations >", href: "/colleges?stream=Medical" },
        ],
      },
    ],
    "Compare Colleges": [
      {
        heading: "Top Medical Battle",
        links: [
          { name: "AIIMS Delhi Vs Kasturba Medical", href: "/compare" },
          { name: "AIIMS Rishikesh Vs AIIMS Delhi", href: "/compare" },
        ],
      },
      {
        heading: "Govt Vs Private",
        links: [
          { name: "CMC Vellore Vs KMC Mangalore", href: "/compare" },
          { name: "Compare Other Medical Colleges >", href: "/compare" },
        ],
      },
    ],
    "College Reviews": [
      {
        heading: "AIIMS Reviews",
        links: [
          { name: "AIIMS New Delhi Reviews", href: "/colleges/aiims-delhi" },
          {
            name: "AIIMS Rishikesh Reviews",
            href: "/colleges/aiims-rishikesh",
          },
        ],
      },
      {
        heading: "Top Private Reviews",
        links: [
          {
            name: "Kasturba Medical College Reviews",
            href: "/colleges/kmc-mangalore",
          },
          {
            name: "Christian Medical College Reviews",
            href: "/colleges/cmc-vellore",
          },
        ],
      },
    ],
  };

  // Engineering Mega Menu Sub-tabs structure matching screenshot
  interface MegaSubCategory {
    heading: string;
    links: { name: string; href: string }[];
  }

  const engTabs: Record<string, MegaSubCategory[]> = {
    "Top Ranked Colleges": [
      {
        heading: "Colleges By Rank",
        links: [
          { name: "Top B.Tech Colleges", href: "/colleges?stream=Engineering" },
          {
            name: "Top Private B.Tech Colleges",
            href: "/colleges?stream=Engineering&type=Private",
          },
          { name: "Top IITs in India", href: "/colleges?stream=Engineering" },
          { name: "Top NITs in India", href: "/colleges?stream=Engineering" },
        ],
      },
      {
        heading: "Colleges By State",
        links: [
          {
            name: "Uttar Pradesh",
            href: "/colleges?stream=Engineering&state=Uttar-Pradesh",
          },
          {
            name: "Karnataka",
            href: "/colleges?stream=Engineering&state=Karnataka",
          },
          {
            name: "Maharashtra",
            href: "/colleges?stream=Engineering&state=Maharashtra",
          },
          {
            name: "Delhi NCR",
            href: "/colleges?stream=Engineering&state=Delhi",
          },
          {
            name: "Gujarat",
            href: "/colleges?stream=Engineering&state=Gujarat",
          },
        ],
      },
      {
        heading: "Colleges By City",
        links: [
          {
            name: "Bangalore",
            href: "/colleges?stream=Engineering&state=Karnataka",
          },
          {
            name: "Pune",
            href: "/colleges?stream=Engineering&state=Maharashtra",
          },
          {
            name: "Mumbai",
            href: "/colleges?stream=Engineering&state=Maharashtra",
          },
          {
            name: "Noida",
            href: "/colleges?stream=Engineering&state=Uttar-Pradesh",
          },
          { name: "Chennai", href: "/colleges?stream=Engineering" },
        ],
      },
    ],
    "Popular Courses": [
      {
        heading: "Undergraduate (UG)",
        links: [
          { name: "B.Tech / B.E.", href: "/colleges?stream=Engineering" },
          {
            name: "B.Tech Lateral Entry",
            href: "/colleges?stream=Engineering",
          },
          {
            name: "Integrated B.Tech+M.Tech",
            href: "/colleges?stream=Engineering",
          },
        ],
      },
      {
        heading: "Postgraduate (PG)",
        links: [
          { name: "M.Tech / M.E.", href: "/colleges?stream=Engineering" },
        ],
      },
      {
        heading: "Other Programs",
        links: [
          {
            name: "Diploma in Engineering",
            href: "/colleges?stream=Engineering",
          },
          {
            name: "PG Diploma in B.Tech",
            href: "/colleges?stream=Engineering",
          },
        ],
      },
    ],
    "Popular Specializations": [
      {
        heading: "Core Technical",
        links: [
          {
            name: "Computer Science (CSE)",
            href: "/colleges?stream=Engineering&search=Computer",
          },
          {
            name: "Electronics & Comm (ECE)",
            href: "/colleges?stream=Engineering&search=Electronics",
          },
          {
            name: "Information Technology (IT)",
            href: "/colleges?stream=Engineering&search=Information",
          },
        ],
      },
      {
        heading: "Traditional",
        links: [
          {
            name: "Mechanical Engineering (ME)",
            href: "/colleges?stream=Engineering&search=Mechanical",
          },
          {
            name: "Civil Engineering (CE)",
            href: "/colleges?stream=Engineering&search=Civil",
          },
          {
            name: "Electrical Engineering (EE)",
            href: "/colleges?stream=Engineering&search=Electrical",
          },
        ],
      },
      {
        heading: "Emerging Fields",
        links: [
          {
            name: "Artificial Intelligence & ML",
            href: "/colleges?stream=Engineering&search=Intelligence",
          },
          {
            name: "Cyber Security & IoT",
            href: "/colleges?stream=Engineering&search=Security",
          },
          {
            name: "Data Science & Analytics",
            href: "/colleges?stream=Engineering&search=Data",
          },
        ],
      },
    ],
    Exams: [
      {
        heading: "National Entrance",
        links: [
          { name: "JEE Main Predictor", href: "/predictor" },
          { name: "JEE Advanced Predictor", href: "/predictor" },
          { name: "GATE Cutoffs", href: "/colleges" },
        ],
      },
      {
        heading: "State Exams",
        links: [
          { name: "WBJEE Predictor", href: "/colleges" },
          { name: "MHT CET Details", href: "/colleges" },
          { name: "COMEDK Guidelines", href: "/colleges" },
        ],
      },
      {
        heading: "University Exams",
        links: [
          { name: "LPUNEST Details", href: "/colleges" },
          { name: "VITEEE Schedule", href: "/colleges" },
          { name: "BITSAT Predictor", href: "/colleges" },
        ],
      },
    ],
    "Colleges By Location": [
      {
        heading: "North India",
        links: [
          { name: "Colleges in Delhi NCR", href: "/colleges?state=Delhi" },
          {
            name: "Colleges in Noida / Gr Noida",
            href: "/colleges?state=Uttar-Pradesh",
          },
          { name: "Colleges in Patna (Bihar)", href: "/colleges?state=Bihar" },
          {
            name: "Colleges in Jaipur (Rajasthan)",
            href: "/colleges?state=Rajasthan",
          },
        ],
      },
      {
        heading: "South India",
        links: [
          { name: "Colleges in Bangalore", href: "/colleges?state=Karnataka" },
          { name: "Colleges in Chennai", href: "/colleges" },
          { name: "Colleges in Hyderabad", href: "/colleges" },
          { name: "Colleges in Kochi (Kerala)", href: "/colleges" },
        ],
      },
      {
        heading: "West & East",
        links: [
          { name: "Colleges in Mumbai", href: "/colleges?state=Maharashtra" },
          { name: "Colleges in Pune", href: "/colleges?state=Maharashtra" },
          { name: "Colleges in Kolkata", href: "/colleges" },
        ],
      },
    ],
    "Compare Colleges": [
      {
        heading: "B.Tech Compare",
        links: [
          { name: "Compare B.Tech Colleges", href: "/compare" },
          { name: "Compare IITs vs NITs", href: "/compare" },
        ],
      },
      {
        heading: "Popular Comparisons",
        links: [
          { name: "IIT Delhi vs IIT Bombay", href: "/compare" },
          { name: "NIT Trichy vs NIT Surathkal", href: "/compare" },
          { name: "Galgotias vs Amity Noida", href: "/compare" },
        ],
      },
    ],
    "Rank Predictors": [
      {
        heading: "JEE Predictors",
        links: [
          { name: "JEE Main Rank Predictor", href: "/predictor" },
          { name: "JEE Advanced Predictor", href: "/predictor" },
        ],
      },
      {
        heading: "State Predictors",
        links: [
          { name: "WBJEE College Predictor", href: "/predictor" },
          { name: "MHT CET Predictor", href: "/predictor" },
        ],
      },
    ],
    "Percentile Predictors": [
      {
        heading: "JEE Percentile",
        links: [{ name: "JEE Main Percentile Predictor", href: "/predictor" }],
      },
      {
        heading: "Other Percentiles",
        links: [{ name: "GATE Score Estimator", href: "/predictor" }],
      },
    ],
    "College Predictors": [
      {
        heading: "Engineering Predictors",
        links: [
          { name: "B.Tech College Predictor", href: "/predictor" },
          { name: "M.Tech College Predictor", href: "/predictor" },
        ],
      },
    ],
    "College Reviews": [
      {
        heading: "Top Reviews",
        links: [
          { name: "Read IIT Delhi Reviews", href: "/colleges/iit-delhi" },
          { name: "Read IIT Bombay Reviews", href: "/colleges/iit-bombay" },
        ],
      },
      {
        heading: "Popular Reviews",
        links: [
          {
            name: "Read Galgotias Reviews",
            href: "/colleges/galgotias-university",
          },
          {
            name: "Read Amity Noida Reviews",
            href: "/colleges/amity-university",
          },
        ],
      },
    ],
    Resources: [
      {
        heading: "Financial Support",
        links: [
          { name: "Bihar Student Credit Card", href: "/credit-card" },
          { name: "B.Tech Engineering Scholarships", href: "/scholarship" },
        ],
      },
      {
        heading: "Admissions Guide",
        links: [
          { name: "B.Tech Admission Guidelines", href: "/contact" },
          { name: "State Counseling Dates 2026", href: "/contact" },
        ],
      },
    ],
  };

  // Categories for Row 2 (Dropdown Items)
  const categories = [
    "MBA",
    "ENGINEERING",
    "MEDICAL",
    "DESIGN",
    "MORE",
    "COUNSELING",
  ];

  // Mobile Navigation Links
  const mobileLinks = [
    { name: "Home", href: "/" },
    { name: "All Colleges", href: "/colleges" },
    { name: "Compare Colleges", href: "/compare" },
    { name: "College Predictor", href: "/predictor" },
    { name: "Scholarship & Loans", href: "/scholarship" },
    { name: "Bihar Credit Card", href: "/credit-card" },
    { name: "Contact Counseling", href: "/contact" },
  ];

  // Mega Menu contents matching the categories
  const megaMenus: Record<string, MegaMenuItem[]> = {
    MBA: [
      {
        category: "Top MBA Colleges",
        links: [
          { name: "IIM Ahmedabad", href: "/colleges/iim-ahmedabad" },
          { name: "SIBM Pune", href: "/colleges/sibm-pune" },
          { name: "IIM Bangalore", href: "/colleges/iim-bangalore" },
        ],
      },
      {
        category: "Popular Exams",
        links: [
          { name: "CAT Exam", href: "/predictor" },
          { name: "SNAP Exam", href: "/predictor" },
          { name: "CMAT Exam", href: "/colleges" },
        ],
      },
      {
        category: "MBA Specializations",
        links: [
          { name: "MBA in Finance", href: "/colleges?stream=Management" },
          { name: "MBA in Marketing", href: "/colleges?stream=Management" },
          { name: "MBA in HR", href: "/colleges?stream=Management" },
        ],
      },
    ],
    ENGINEERING: [
      {
        category: "Top Engineering Colleges",
        links: [
          { name: "IIT Delhi", href: "/colleges/iit-delhi" },
          { name: "IIT Bombay", href: "/colleges/iit-bombay" },
          {
            name: "RV College of Engineering",
            href: "/colleges/rv-college-of-engineering",
          },
        ],
      },
      {
        category: "Popular Exams",
        links: [
          { name: "JEE Main", href: "/predictor" },
          { name: "JEE Advanced", href: "/colleges/iit-delhi" },
          { name: "WBJEE", href: "/colleges" },
        ],
      },
      {
        category: "Specializations",
        links: [
          {
            name: "Computer Science (CSE)",
            href: "/colleges?stream=Engineering",
          },
          {
            name: "Electronics & Comm (ECE)",
            href: "/colleges?stream=Engineering",
          },
          {
            name: "Mechanical Engineering",
            href: "/colleges?stream=Engineering",
          },
        ],
      },
    ],
    MEDICAL: [
      {
        category: "Top Medical Colleges",
        links: [
          { name: "AIIMS Delhi", href: "/colleges/aiims-delhi" },
          { name: "KMC Mangalore", href: "/colleges/kmc-mangalore" },
          { name: "CMC Vellore", href: "/colleges/cmc-vellore" },
        ],
      },
      {
        category: "Entrance Exams",
        links: [
          { name: "NEET UG", href: "/predictor" },
          { name: "AIIMS Entrance", href: "/colleges" },
        ],
      },
      {
        category: "Courses Offered",
        links: [
          { name: "MBBS", href: "/colleges?stream=Medical" },
          { name: "BDS Dental", href: "/colleges?stream=Medical" },
          { name: "B.Sc Nursing", href: "/colleges?stream=Medical" },
        ],
      },
    ],
    DESIGN: [
      {
        category: "Top Design Institutes",
        links: [
          { name: "NIFT Patna", href: "/colleges/nift-patna" },
          { name: "NID Ahmedabad", href: "/colleges" },
        ],
      },
      {
        category: "Specializations",
        links: [
          { name: "Fashion Design", href: "/colleges" },
          { name: "Communication Design", href: "/colleges" },
          { name: "Industrial Design", href: "/colleges" },
        ],
      },
      {
        category: "Direct Admission",
        links: [
          { name: "Scholarship Schemes", href: "/credit-card" },
          { name: "Free Counseling", href: "/contact" },
        ],
      },
    ],
    MORE: [
      {
        category: "Law Programs",
        links: [
          { name: "NLSIU Bangalore", href: "/colleges/nlsiu-bangalore" },
          { name: "CNLU Patna", href: "/colleges/cnlu-patna" },
        ],
      },
      {
        category: "Admission Schemes",
        links: [
          { name: "Bihar Student Credit Card", href: "/credit-card" },
          { name: "DRCC Registration Guidelines", href: "/credit-card" },
        ],
      },
      {
        category: "Quick Tools",
        links: [
          { name: "College Predictor Tool", href: "/predictor" },
          { name: "Compare Colleges Hub", href: "/compare" },
          { name: "Scholarship & Loan Estimator", href: "/scholarship" },
        ],
      },
    ],
    COUNSELING: [
      {
        category: "Guidance Services",
        links: [
          { name: "Free Profile Evaluation", href: "/contact" },
          { name: "Direct Admission Quota Help", href: "/contact" },
          { name: "Document Verification Desk", href: "/credit-card" },
        ],
      },
      {
        category: "Support Hotlines",
        links: [
          { name: "Patna Office: +91 91358", href: "/contact" },
          { name: "Noida Office: +91 94733", href: "/contact" },
        ],
      },
      {
        category: "Action steps",
        links: [
          { name: "Book counseling slot", href: "/contact" },
          { name: "Request advisor callback", href: "/contact" },
        ],
      },
    ],
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (pathname && pathname.startsWith("/safeaxis")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-text_primary flex flex-col font-sans transition-all duration-300">
      {/* SHIKSHA SCREENSHOT MATCHING DOUBLE-ROW HEADER */}
      <header
        className={`${isCollegeDetailPage ? "relative bg-brand_header text-white z-40 shadow-md transition-colors border-b border-white/10" : "fixed top-0 left-0 right-0 bg-brand_header text-white z-40 shadow-md transition-colors border-b border-white/10"}`}
        onMouseLeave={handleMenuMouseLeave}
      >
        {/* ROW 1: TOP ROW (Logo, Wide Search Bar, Login/Sign Up) */}
        <div className="h-16 max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between gap-6">
          {/* Logo Section */}
          {/* Logo Section (Official Brand Logo) */}
          <Link
            href="/"
            className="flex items-center select-none hover:scale-[1.03] transition-transform origin-left flex-shrink-0"
          >
            <img
              src="/logo.png?v=3"
              alt="College 19"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Wide Global Search Bar (Conjoined Input & Button) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-2xl h-10 bg-white rounded-md overflow-hidden shadow-sm border border-amber-200/60"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => setIsSearchOverlayOpen(true)}
              onFocus={() => setIsSearchOverlayOpen(true)}
              readOnly
              placeholder="Search Colleges, Courses, Exams, QnA, & Articles"
              className="flex-1 px-4 h-full bg-transparent border-none outline-none text-slate-800 text-xs placeholder-slate-400 font-semibold cursor-pointer"
            />
            <button
              type="submit"
              className="h-full px-7 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center flex-shrink-0 active:scale-95 shadow-inner"
            >
              Search
            </button>
          </form>

          {/* Right auth links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold whitespace-nowrap">
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/20">
                {/* Avatar circular badge */}
                <div className="w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center font-black text-xs shadow-sm uppercase">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[10px] font-black tracking-wide leading-none">
                    {user.name}
                  </span>
                  <button
                    onClick={() => {
                      setUser(null);
                      localStorage.removeItem("tyc-user");
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new Event("tyc-user-sync"));
                      }
                    }}
                    className="text-[9px] text-yellow-200 hover:text-yellow-100 font-extrabold uppercase tracking-widest text-left mt-1 hover:underline transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <motion.button
                  onClick={() => setAuthModal({ open: true, mode: "login" })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="text-white hover:text-amber-100 font-bold transition-colors"
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => setAuthModal({ open: true, mode: "signup" })}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 18px rgba(255,255,255,0.2)",
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="px-4 py-1.5 rounded-lg bg-white text-orange-600 hover:bg-amber-50 font-black text-[11px] tracking-wide shadow-sm transition-all"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* MOBILE HEADER BUTTONS */}
          <div className="flex md:hidden items-center gap-2">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOverlayOpen(true)}
              className="text-white p-1 hover:text-amber-200 transition-colors flex items-center justify-center cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp Logo Button */}
            <a
              href="https://wa.me/918585951111?text=Hi%20Sarthi,%20I%20have%20a%20query%20about%20college%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="text-white p-1 hover:text-emerald-300 transition-colors flex items-center justify-center cursor-pointer"
              title="Chat on WhatsApp"
            >
              <svg
                className="w-5 h-5 fill-current text-white hover:text-emerald-400 transition-colors"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-1 hover:text-amber-200 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* ROW 2: SUB-NAVIGATION BAR (Dropdown Category Items) */}
        <div className="relative border-t border-white/10 bg-black/10">
          {/* Scrollable Row of Category Buttons */}
          <div className="overflow-x-auto no-scrollbar scroll-smooth">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex items-center justify-start md:justify-center gap-1 h-11 relative min-w-max md:min-w-0">
              {categories.map((category) => (
                <div
                  key={category}
                  className="h-full flex items-center"
                  onMouseEnter={() => handleCategoryMouseEnter(category)}
                >
                  <button
                    onClick={() =>
                      setActiveMegaMenu(
                        activeMegaMenu === category ? null : category,
                      )
                    }
                    className="flex items-center gap-1 px-4 h-full text-[10px] font-black tracking-wider text-white/95 hover:text-white hover:bg-white/10 transition-colors uppercase whitespace-nowrap"
                  >
                    {category}
                    <ChevronDown
                      className={`w-3 h-3 text-white/60 transition-transform ${activeMegaMenu === category ? "rotate-180 text-white" : ""}`}
                    />
                  </button>
                </div>
              ))}

              {/* Direct Scholarship Link */}
              <div className="h-full flex items-center">
                <Link
                  href="/scholarship"
                  className="flex items-center gap-1.5 px-4 h-full text-[10px] font-black tracking-wider text-yellow-300 hover:text-yellow-200 hover:bg-white/10 transition-colors uppercase whitespace-nowrap"
                >
                  <span>Scholarship</span>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-400"></span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* ROW 3: SLEEK SUB-HEADER RIBBON (News, Exams, Reviews etc) */}
        <div className="relative bg-slate-50 border-t border-b border-slate-200/80">
          <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex items-center justify-between gap-4 h-9 overflow-x-auto no-scrollbar scroll-smooth">
            {/* Left/Center side links */}
            <div className="flex items-center gap-1 md:gap-2 h-full min-w-max">
              {/* Top Colleges */}
              <Link
                href="/colleges"
                className="flex items-center gap-1 px-3 h-full text-[10px] font-black tracking-wider text-slate-600 hover:text-orange-600 transition-colors uppercase whitespace-nowrap"
              >
                Top Colleges
              </Link>
              <div className="w-[1px] h-3 bg-slate-200" />

              {/* Top Courses */}
              <Link
                href="/colleges"
                className="flex items-center gap-1 px-3 h-full text-[10px] font-black tracking-wider text-slate-600 hover:text-orange-600 transition-colors uppercase whitespace-nowrap"
              >
                Top Courses
              </Link>
              <div className="w-[1px] h-3 bg-slate-200" />

              {/* Entrance Exams */}
              <Link
                href="/colleges"
                className="flex items-center gap-1 px-3 h-full text-[10px] font-black tracking-wider text-slate-600 hover:text-orange-600 transition-colors uppercase whitespace-nowrap"
              >
                Entrance Exams
              </Link>
              <div className="w-[1px] h-3 bg-slate-200" />

              {/* Boards */}
              <Link
                href="/colleges"
                className="flex items-center gap-1 px-3 h-full text-[10px] font-black tracking-wider text-slate-600 hover:text-orange-600 transition-colors uppercase whitespace-nowrap"
              >
                Boards
              </Link>
              <div className="w-[1px] h-3 bg-slate-200" />

              {/* Admission 2026 (Opens the Admission Alerts popup!) */}
              <button
                onClick={() => setIsAlertOpen(true)}
                className="flex items-center gap-1.5 px-3 h-full text-[10px] font-black tracking-wider text-slate-600 hover:text-orange-600 transition-colors uppercase whitespace-nowrap group"
              >
                <span>Admission 2026</span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                </span>
              </button>
              <div className="w-[1px] h-3 bg-slate-200" />

              {/* News & Articles */}
              <Link
                href="/colleges"
                className="flex items-center gap-1 px-3 h-full text-[10px] font-black tracking-wider text-slate-600 hover:text-orange-600 transition-colors uppercase whitespace-nowrap"
              >
                News
              </Link>
            </div>

            {/* Right side: Write a Review button */}
            <div className="flex items-center h-full flex-shrink-0">
              <Link
                href="/write-review"
                className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-orange-500 hover:bg-orange-50 text-[9px] font-black tracking-wider text-orange-600 uppercase transition-all whitespace-nowrap shadow-sm hover:shadow active:scale-95"
              >
                <Star className="w-2.5 h-2.5 fill-current" />
                Write a Review
              </Link>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown Panels (Rendered outside overflow-x-auto so they pop out unclipped) */}
        <div
          className="relative max-w-[1440px] mx-auto"
          onMouseLeave={handleMenuMouseLeave}
        >
          {/* MEGA MENU DROPDOWN PANEL FOR MBA */}
          <AnimatePresence>
            {activeMegaMenu === "MBA" && (
              <div
                className="absolute top-1 left-1/2 -translate-x-1/2 w-[94vw] md:w-[1020px] z-50 pointer-events-auto"
                onMouseEnter={() => setActiveMegaMenu("MBA")}
              >
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95, rotateX: -6 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.97,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  style={{ transformOrigin: "top center", perspective: 1000 }}
                  className="w-full bg-white/95 backdrop-blur-xl border border-amber-100/40 rounded-2xl shadow-[0_20px_50px_rgba(245,158,11,0.15)] flex flex-col md:flex-row text-text_primary overflow-hidden max-h-[75vh] md:max-h-none overflow-y-auto md:overflow-visible"
                >
                  {/* Floating Glowing Gradient border at top */}
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 shadow-[0_1px_10px_rgba(245,158,11,0.5)] z-20" />

                  {/* Dynamic Animated Glass Ambient Background */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-2xl">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.05),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.04),transparent_40%)] animate-[spin_25s_linear_infinite]" />
                    <div className="absolute top-[10%] right-[10%] w-[200px] h-[200px] bg-amber-500/8 dark:bg-amber-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[10%] left-[10%] w-[200px] h-[200px] bg-indigo-500/8 dark:bg-indigo-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite_3s]" />
                  </div>

                  {/* Left Column: Vertical Sub-Tabs Menu */}
                  <div className="w-full md:w-[240px] bg-slate-50/40 border-b md:border-b-0 md:border-r border-border/60 p-3 flex md:flex-col overflow-x-auto md:overflow-visible gap-1 md:space-y-1.5 pt-3 md:pt-4 relative z-10 no-scrollbar flex-shrink-0">
                    {Object.keys(mbaTabs).map((tabName) => {
                      const TabIcon = mbaTabIcons[tabName] || Award;
                      const isActive = activeMbaTab === tabName;
                      return (
                        <button
                          key={tabName}
                          onClick={() => setActiveMbaTab(tabName)}
                          onMouseEnter={() => setActiveMbaTab(tabName)}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[10.5px] font-extrabold tracking-wide transition-all duration-200 whitespace-nowrap ${
                            isActive
                              ? "bg-gradient-to-r from-amber-500/10 to-orange-600/10 text-primary border-l-4 border-primary pl-3 shadow-sm shadow-amber-500/5"
                              : "text-text_secondary hover:bg-amber-500/5 hover:text-text_primary hover:translate-x-0.5"
                          }`}
                        >
                          <TabIcon
                            className={`w-3.5 h-3.5 ${isActive ? "text-primary animate-pulse" : "text-slate-400 dark:text-slate-500"}`}
                          />
                          {tabName}
                        </button>
                      );
                    })}
                  </div>

                  {/* Middle Column: Dynamic Link Lists */}
                  <div className="flex-1 p-4 md:p-6 relative pt-5 md:pt-7 z-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <h4 className="text-[10.5px] uppercase tracking-wider font-black text-primary border-b border-border/60 pb-2 mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {activeMbaTab}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                      {mbaTabs[activeMbaTab]?.map((subCat, idx) => (
                        <div key={idx} className="space-y-3">
                          <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 border-b border-amber-100/50 pb-1 flex items-center gap-1">
                            {subCat.heading}
                          </h5>
                          <ul className="space-y-2">
                            {subCat.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                <Link
                                  href={link.href}
                                  onClick={() => setActiveMegaMenu(null)}
                                  className="group/link text-xs font-semibold text-text_secondary hover:text-primary transition-all flex items-center gap-1.5 py-0.5 hover:translate-x-1 duration-200"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover/link:bg-primary transition-colors flex-shrink-0" />
                                  <span className="flex-1 line-clamp-1">
                                    {link.name}
                                  </span>
                                  {link.name.endsWith(">") ? null : (
                                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary flex-shrink-0" />
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Featured Colleges */}
                  <div className="w-full md:w-[220px] bg-slate-50/30 p-4 md:p-6 border-t md:border-t-0 md:border-l border-border/60 flex flex-col justify-between pt-5 md:pt-7 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-primary border-b border-border/60 pb-2 mb-4 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        Top MBA Choices
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            name: "IIM Ahmedabad",
                            rate: "4.9",
                            rank: "NIRF #1",
                            slug: "iim-ahmedabad",
                            color: "from-amber-500 to-orange-600",
                          },
                          {
                            name: "IIM Bangalore",
                            rate: "4.8",
                            rank: "NIRF #2",
                            slug: "iim-bangalore",
                            color: "from-indigo-500 to-purple-600",
                          },
                          {
                            name: "SIBM Pune",
                            rate: "4.6",
                            rank: "NIRF #17",
                            slug: "sibm-pune",
                            color: "from-emerald-500 to-teal-600",
                          },
                        ].map((c, idx) => (
                          <Link
                            key={idx}
                            href={`/colleges/${c.slug}`}
                            onClick={() => setActiveMegaMenu(null)}
                            className="group/feat block p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} text-white flex items-center justify-center text-[10px] font-black shadow-sm`}
                              >
                                {c.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-text_primary group-hover/feat:text-primary transition-colors truncate">
                                  {c.name}
                                </p>
                                <div className="flex items-center gap-1.5 text-[8px] font-bold text-text_secondary mt-0.5">
                                  <span className="text-amber-500">
                                    ★ {c.rate}
                                  </span>
                                  <span>•</span>
                                  <span className="text-primary">{c.rank}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/colleges?stream=Management"
                      onClick={() => setActiveMegaMenu(null)}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-center font-bold text-[9px] uppercase tracking-wider rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm shadow-primary/10"
                    >
                      Explore All Colleges
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* MEGA MENU DROPDOWN PANEL FOR MORE */}
          <AnimatePresence>
            {activeMegaMenu === "MORE" && (
              <div
                className="absolute top-1 left-1/2 -translate-x-1/2 w-[94vw] md:w-[1020px] z-50 pointer-events-auto"
                onMouseEnter={() => setActiveMegaMenu("MORE")}
              >
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95, rotateX: -6 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.97,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  style={{ transformOrigin: "top center", perspective: 1000 }}
                  className="w-full bg-white/95 backdrop-blur-xl border border-amber-100/40 rounded-2xl shadow-[0_20px_50px_rgba(245,158,11,0.12)] flex flex-col md:flex-row text-text_primary overflow-hidden max-h-[75vh] md:max-h-none overflow-y-auto md:overflow-visible"
                >
                  {/* Floating Glowing Gradient border at top */}
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 shadow-[0_1px_10px_rgba(245,158,11,0.5)] z-20" />

                  {/* Dynamic Animated Glass Ambient Background */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-2xl">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.05),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.04),transparent_40%)] animate-[spin_25s_linear_infinite]" />
                    <div className="absolute top-[10%] right-[10%] w-[200px] h-[200px] bg-amber-500/8 dark:bg-amber-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[10%] left-[10%] w-[200px] h-[200px] bg-orange-500/8 dark:bg-orange-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite_3s]" />
                  </div>

                  {/* Left Column: Vertical Sub-Tabs Menu */}
                  <div className="w-full md:w-[240px] bg-slate-50/40 border-b md:border-b-0 md:border-r border-border/60 p-3 flex md:flex-col overflow-x-auto md:overflow-visible gap-1 md:space-y-1.5 pt-3 md:pt-4 relative z-10 no-scrollbar flex-shrink-0">
                    {Object.keys(moreTabs).map((tabName) => {
                      const TabIcon = Award;
                      const isActive = activeMoreTab === tabName;
                      return (
                        <button
                          key={tabName}
                          onClick={() => setActiveMoreTab(tabName)}
                          onMouseEnter={() => setActiveMoreTab(tabName)}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[10.5px] font-extrabold tracking-wide transition-all duration-200 whitespace-nowrap ${
                            isActive
                              ? "bg-gradient-to-r from-amber-500/10 to-orange-600/10 text-primary border-l-4 border-primary pl-3 shadow-sm shadow-amber-500/5"
                              : "text-text_secondary hover:bg-amber-500/5 hover:text-text_primary hover:translate-x-0.5"
                          }`}
                        >
                          <TabIcon
                            className={`w-3.5 h-3.5 ${
                              isActive
                                ? "text-primary animate-pulse"
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          />
                          {tabName}
                        </button>
                      );
                    })}
                  </div>

                  {/* Middle Column: Dynamic Link Lists */}
                  <div className="flex-1 p-4 md:p-6 relative pt-5 md:pt-7 z-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <h4 className="text-[10.5px] uppercase tracking-wider font-black text-primary border-b border-border/60 pb-2 mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {activeMoreTab}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                      {moreTabs[activeMoreTab]?.map((subCat, idx) => (
                        <div key={idx} className="space-y-3">
                          <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-orange-600 border-b border-orange-100/50 pb-1 flex items-center gap-1">
                            {subCat.heading}
                          </h5>
                          <ul className="space-y-2">
                            {subCat.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                <Link
                                  href={link.href}
                                  onClick={() => setActiveMegaMenu(null)}
                                  className="group/link text-xs font-semibold text-text_secondary hover:text-primary transition-all flex items-center gap-1.5 py-0.5 hover:translate-x-1 duration-200"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover/link:bg-primary transition-colors flex-shrink-0" />
                                  <span className="flex-1 line-clamp-1">
                                    {link.name}
                                  </span>
                                  {link.name.endsWith(">") ? null : (
                                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary flex-shrink-0" />
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Featured Colleges */}
                  <div className="w-full md:w-[220px] bg-slate-50/30 p-4 md:p-6 border-t md:border-t-0 md:border-l border-border/60 flex flex-col justify-between pt-5 md:pt-7 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-primary border-b border-border/60 pb-2 mb-4 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        Top Choice Streams
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            name: "B.Pharm (Pharmacy)",
                            desc: "Top Pharmacy Colleges",
                            slug: "Pharmacy",
                            color: "from-emerald-500 to-teal-600",
                          },
                          {
                            name: "BA LLB (Law School)",
                            desc: "National Law Schools",
                            slug: "Law",
                            color: "from-blue-500 to-indigo-600",
                          },
                          {
                            name: "B.Des (Design Inst.)",
                            desc: "NIFT & NID Colleges",
                            slug: "Design",
                            color: "from-rose-500 to-red-600",
                          },
                        ].map((c, idx) => (
                          <Link
                            key={idx}
                            href={`/colleges?stream=${c.slug}`}
                            onClick={() => setActiveMegaMenu(null)}
                            className="group/feat block p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} text-white flex items-center justify-center text-[10px] font-black shadow-sm`}
                              >
                                {c.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-text_primary group-hover/feat:text-primary transition-colors truncate">
                                  {c.name}
                                </p>
                                <div className="flex items-center gap-1.5 text-[8px] font-bold text-text_secondary mt-0.5">
                                  <span className="text-primary">{c.desc}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/colleges"
                      onClick={() => setActiveMegaMenu(null)}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-center font-bold text-[9px] uppercase tracking-wider rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm shadow-primary/10"
                    >
                      Explore All Streams
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* MEGA MENU DROPDOWN PANEL FOR MEDICAL */}
          <AnimatePresence>
            {activeMegaMenu === "MEDICAL" && (
              <div
                className="absolute top-1 left-1/2 -translate-x-1/2 w-[94vw] md:w-[1020px] z-50 pointer-events-auto"
                onMouseEnter={() => setActiveMegaMenu("MEDICAL")}
              >
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95, rotateX: -6 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.97,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  style={{ transformOrigin: "top center", perspective: 1000 }}
                  className="w-full bg-white/95 backdrop-blur-xl border border-red-100/40 rounded-2xl shadow-[0_20px_50px_rgba(239,68,68,0.12)] flex flex-col md:flex-row text-text_primary overflow-hidden max-h-[75vh] md:max-h-none overflow-y-auto md:overflow-visible"
                >
                  {/* Floating Glowing Gradient border at top */}
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-red-400 via-rose-500 to-red-600 shadow-[0_1px_10px_rgba(239,68,68,0.5)] z-20" />

                  {/* Dynamic Animated Glass Ambient Background */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-2xl">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.05),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.04),transparent_40%)] animate-[spin_25s_linear_infinite]" />
                    <div className="absolute top-[10%] right-[10%] w-[200px] h-[200px] bg-red-500/8 dark:bg-red-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[10%] left-[10%] w-[200px] h-[200px] bg-rose-500/8 dark:bg-rose-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite_3s]" />
                  </div>

                  {/* Left Column: Vertical Sub-Tabs Menu */}
                  <div className="w-full md:w-[240px] bg-slate-50/40 border-b md:border-b-0 md:border-r border-border/60 p-3 flex md:flex-col overflow-x-auto md:overflow-visible gap-1 md:space-y-1.5 pt-3 md:pt-4 relative z-10 no-scrollbar flex-shrink-0">
                    {Object.keys(medicalTabs).map((tabName) => {
                      const TabIcon = medicalTabIcons[tabName] || Award;
                      const isActive = activeMedicalTab === tabName;
                      return (
                        <button
                          key={tabName}
                          onClick={() => setActiveMedicalTab(tabName)}
                          onMouseEnter={() => setActiveMedicalTab(tabName)}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[10.5px] font-extrabold tracking-wide transition-all duration-200 whitespace-nowrap ${
                            isActive
                              ? "bg-gradient-to-r from-red-500/10 to-rose-600/10 text-primary border-l-4 border-primary pl-3 shadow-sm shadow-red-500/5"
                              : "text-text_secondary hover:bg-red-500/5 hover:text-text_primary hover:translate-x-0.5"
                          }`}
                        >
                          <TabIcon
                            className={`w-3.5 h-3.5 ${
                              isActive
                                ? "text-primary animate-pulse"
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          />
                          {tabName}
                        </button>
                      );
                    })}
                  </div>

                  {/* Middle Column: Dynamic Link Lists */}
                  <div className="flex-1 p-4 md:p-6 relative pt-5 md:pt-7 z-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <h4 className="text-[10.5px] uppercase tracking-wider font-black text-primary border-b border-border/60 pb-2 mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-red-500" />
                      {activeMedicalTab}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                      {medicalTabs[activeMedicalTab]?.map((subCat, idx) => (
                        <div key={idx} className="space-y-3">
                          <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-red-600 border-b border-red-100/50 pb-1 flex items-center gap-1">
                            {subCat.heading}
                          </h5>
                          <ul className="space-y-2">
                            {subCat.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                <Link
                                  href={link.href}
                                  onClick={() => setActiveMegaMenu(null)}
                                  className="group/link text-xs font-semibold text-text_secondary hover:text-primary transition-all flex items-center gap-1.5 py-0.5 hover:translate-x-1 duration-200"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover/link:bg-primary transition-colors flex-shrink-0" />
                                  <span className="flex-1 line-clamp-1">
                                    {link.name}
                                  </span>
                                  {link.name.endsWith(">") ? null : (
                                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary flex-shrink-0" />
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Featured Colleges */}
                  <div className="w-full md:w-[220px] bg-slate-50/30 p-4 md:p-6 border-t md:border-t-0 md:border-l border-border/60 flex flex-col justify-between pt-5 md:pt-7 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-primary border-b border-border/60 pb-2 mb-4 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-red-500" />
                        Top Medical Choices
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            name: "AIIMS New Delhi",
                            rate: "5.0",
                            rank: "NIRF #1",
                            slug: "aiims-delhi",
                            color: "from-red-500 to-rose-600",
                          },
                          {
                            name: "CMC Vellore",
                            rate: "4.9",
                            rank: "NIRF #3",
                            slug: "cmc-vellore",
                            color: "from-blue-500 to-indigo-600",
                          },
                          {
                            name: "KMC Mangalore",
                            rate: "4.7",
                            rank: "NIRF #23",
                            slug: "kmc-mangalore",
                            color: "from-emerald-500 to-teal-600",
                          },
                        ].map((c, idx) => (
                          <Link
                            key={idx}
                            href={`/colleges/${c.slug}`}
                            onClick={() => setActiveMegaMenu(null)}
                            className="group/feat block p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} text-white flex items-center justify-center text-[10px] font-black shadow-sm`}
                              >
                                {c.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-text_primary group-hover/feat:text-primary transition-colors truncate">
                                  {c.name}
                                </p>
                                <div className="flex items-center gap-1.5 text-[8px] font-bold text-text_secondary mt-0.5">
                                  <span className="text-amber-500">
                                    ★ {c.rate}
                                  </span>
                                  <span>•</span>
                                  <span className="text-primary">{c.rank}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/colleges?stream=Medical"
                      onClick={() => setActiveMegaMenu(null)}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-center font-bold text-[9px] uppercase tracking-wider rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm shadow-primary/10"
                    >
                      Explore All Colleges
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* MEGA MENU DROPDOWN PANEL FOR ENGINEERING */}
          <AnimatePresence>
            {activeMegaMenu === "ENGINEERING" && (
              <div
                className="absolute top-1 left-1/2 -translate-x-1/2 w-[94vw] md:w-[1020px] z-50 pointer-events-auto"
                onMouseEnter={() => setActiveMegaMenu("ENGINEERING")}
              >
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95, rotateX: -6 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.97,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  style={{ transformOrigin: "top center", perspective: 1000 }}
                  className="w-full bg-white/95 backdrop-blur-xl border border-blue-100/40 rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.12)] flex flex-col md:flex-row text-text_primary overflow-hidden max-h-[75vh] md:max-h-none overflow-y-auto md:overflow-visible"
                >
                  {/* Floating Glowing Gradient border at top */}
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 shadow-[0_1px_10px_rgba(99,102,241,0.5)] z-20" />

                  {/* Dynamic Animated Glass Ambient Background */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-2xl">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.05),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.04),transparent_40%)] animate-[spin_28s_linear_infinite]" />
                    <div className="absolute top-[10%] right-[10%] w-[200px] h-[200px] bg-blue-500/8 dark:bg-blue-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[10%] left-[10%] w-[200px] h-[200px] bg-purple-500/8 dark:bg-purple-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite_3.5s]" />
                  </div>

                  {/* Left Column: Vertical Sub-Tabs Menu */}
                  <div className="w-full md:w-[240px] bg-slate-50/40 border-b md:border-b-0 md:border-r border-border/60 p-3 flex md:flex-col overflow-x-auto md:overflow-visible gap-1 md:space-y-1.5 pt-3 md:pt-4 relative z-10 no-scrollbar flex-shrink-0">
                    {Object.keys(engTabs).map((tabName) => {
                      const TabIcon = engTabIcons[tabName] || Award;
                      const isActive = activeEngTab === tabName;
                      return (
                        <button
                          key={tabName}
                          onClick={() => setActiveEngTab(tabName)}
                          onMouseEnter={() => setActiveEngTab(tabName)}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[10.5px] font-extrabold tracking-wide transition-all duration-200 whitespace-nowrap ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500/10 to-indigo-600/10 text-primary border-l-4 border-primary pl-3 shadow-sm shadow-blue-500/5"
                              : "text-text_secondary hover:bg-blue-500/5 hover:text-text_primary hover:translate-x-0.5"
                          }`}
                        >
                          <TabIcon
                            className={`w-3.5 h-3.5 ${isActive ? "text-primary animate-pulse" : "text-slate-400 dark:text-slate-500"}`}
                          />
                          {tabName}
                        </button>
                      );
                    })}
                  </div>

                  {/* Middle Column: Dynamic Link Lists */}
                  <div className="flex-1 p-4 md:p-6 relative pt-5 md:pt-7 z-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <h4 className="text-[10.5px] uppercase tracking-wider font-black text-primary border-b border-border/60 pb-2 mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      {activeEngTab}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                      {engTabs[activeEngTab]?.map((subCat, idx) => (
                        <div key={idx} className="space-y-3">
                          <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 border-b border-blue-100/50 pb-1 flex items-center gap-1">
                            {subCat.heading}
                          </h5>
                          <ul className="space-y-2">
                            {subCat.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                <Link
                                  href={link.href}
                                  onClick={() => setActiveMegaMenu(null)}
                                  className="group/link text-xs font-semibold text-text_secondary hover:text-primary transition-all flex items-center gap-1.5 py-0.5 hover:translate-x-1 duration-200"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover/link:bg-primary transition-colors flex-shrink-0" />
                                  <span className="flex-1 line-clamp-1">
                                    {link.name}
                                  </span>
                                  <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary flex-shrink-0" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Featured Colleges */}
                  <div className="w-full md:w-[220px] bg-slate-50/30 p-4 md:p-6 border-t md:border-t-0 md:border-l border-border/60 flex flex-col justify-between pt-5 md:pt-7 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-primary border-b border-border/60 pb-2 mb-4 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-blue-500" />
                        Top Engineering Choices
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            name: "IIT Delhi",
                            rate: "4.9",
                            rank: "NIRF #2",
                            slug: "iit-delhi",
                            color: "from-blue-500 to-indigo-600",
                          },
                          {
                            name: "IIT Bombay",
                            rate: "4.9",
                            rank: "NIRF #3",
                            slug: "iit-bombay",
                            color: "from-indigo-500 to-purple-600",
                          },
                          {
                            name: "RVCE Bangalore",
                            rate: "4.4",
                            rank: "NIRF #85",
                            slug: "rv-college-of-engineering",
                            color: "from-amber-500 to-orange-600",
                          },
                        ].map((c, idx) => (
                          <Link
                            key={idx}
                            href={`/colleges/${c.slug}`}
                            onClick={() => setActiveMegaMenu(null)}
                            className="group/feat block p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} text-white flex items-center justify-center text-[10px] font-black shadow-sm`}
                              >
                                {c.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-text_primary group-hover/feat:text-primary transition-colors truncate">
                                  {c.name}
                                </p>
                                <div className="flex items-center gap-1.5 text-[8px] font-bold text-text_secondary mt-0.5">
                                  <span className="text-amber-500">
                                    ★ {c.rate}
                                  </span>
                                  <span>•</span>
                                  <span className="text-primary">{c.rank}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/colleges?stream=Engineering"
                      onClick={() => setActiveMegaMenu(null)}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-center font-bold text-[9px] uppercase tracking-wider rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm shadow-primary/10"
                    >
                      Explore All Colleges
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* MEGA MENU DROPDOWN PANEL FOR OTHER CHANNELS */}
          <AnimatePresence>
            {activeMegaMenu !== null &&
              activeMegaMenu !== "MBA" &&
              activeMegaMenu !== "ENGINEERING" &&
              activeMegaMenu !== "MEDICAL" &&
              activeMegaMenu !== "MORE" &&
              megaMenus[activeMegaMenu] && (
                <div
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-[94vw] md:w-[720px] z-50 pointer-events-auto"
                  onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
                >
                  <motion.div
                    key={activeMegaMenu}
                    initial={{ opacity: 0, y: 15, scale: 0.95, rotateX: -6 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.97,
                      transition: { duration: 0.15 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 26,
                    }}
                    style={{
                      transformOrigin: "top center",
                      perspective: 1000,
                    }}
                    className="w-full bg-white/95 backdrop-blur-xl border border-teal-100/40 rounded-2xl shadow-[0_20px_50px_rgba(20,184,166,0.12)] p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-text_primary overflow-hidden max-h-[75vh] md:max-h-none overflow-y-auto md:overflow-visible"
                  >
                    {/* Floating Glowing Gradient border at top */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 shadow-[0_1px_10px_rgba(16,185,129,0.3)] z-20" />

                    {/* Dynamic Animated Glass Ambient Background */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-2xl">
                      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.04),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.04),transparent_40%)] animate-[spin_24s_linear_infinite]" />
                      <div className="absolute top-[10%] right-[10%] w-[180px] h-[180px] bg-emerald-500/8 dark:bg-emerald-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite]" />
                      <div className="absolute bottom-[10%] left-[10%] w-[180px] h-[180px] bg-teal-500/8 dark:bg-teal-500/4 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite_2.5s]" />
                    </div>

                    {megaMenus[activeMegaMenu].map((section, idx) => (
                      <div key={idx} className="space-y-3 relative z-10">
                        <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-primary border-b border-border/60 pb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                          {section.category}
                        </h4>
                        <ul className="space-y-2">
                          {section.links.map((link, lIdx) => (
                            <li key={lIdx}>
                              <Link
                                href={link.href}
                                onClick={() => setActiveMegaMenu(null)}
                                className="group/link text-xs font-semibold text-text_secondary hover:text-primary transition-all flex items-center gap-1 py-0.5 hover:translate-x-0.5 duration-200"
                              >
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover/link:bg-primary transition-colors flex-shrink-0" />
                                <span className="flex-1">{link.name}</span>
                                <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary flex-shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}
          </AnimatePresence>
        </div>

        {/* BACKDROP OVERLAY WHEN MEGA MENU IS OPEN (Mobile only to avoid blocking hover on desktop) */}
        {activeMegaMenu && (
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setActiveMegaMenu(null)}
          />
        )}
      </header>

      {/* MOBILE DRAWER DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside
            className="w-72 max-w-[80vw] h-full bg-card border-r border-border flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar p-5">
              <div className="flex items-center justify-between border-b border-border pb-4 mt-4">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-premium text-white">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="font-outfit font-black text-sm tracking-tight text-slate-950 hover:text-primary transition-colors uppercase">
                    College 19
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text_secondary hover:text-text_primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile search */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex border border-border rounded-xl bg-background overflow-hidden p-1"
              >
                <input
                  type="text"
                  placeholder="Search Colleges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => {
                    setIsSearchOverlayOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  onFocus={() => {
                    setIsSearchOverlayOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  readOnly
                  className="w-full bg-transparent px-3 text-xs text-text_primary outline-none cursor-pointer"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg"
                >
                  Go
                </button>
              </form>

              <nav className="space-y-1">
                {mobileLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-xs transition-all ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-text_secondary hover:bg-border/40"
                      }`}
                    >
                      <span className="font-sans">{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                {user ? (
                  <div className="w-full p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-sm uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-800 text-xs font-black">
                          {user.name}
                        </p>
                        <p className="text-slate-500 text-[10px] font-semibold">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUser(null);
                        localStorage.removeItem("tyc-user");
                        setIsMobileMenuOpen(false);
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(new Event("tyc-user-sync"));
                        }
                      }}
                      className="w-full mt-2 py-2 text-center text-xs font-black text-red-500 hover:text-white hover:bg-red-500 border border-red-200 rounded-xl transition-all uppercase tracking-wider"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <motion.button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setAuthModal({ open: true, mode: "login" });
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setAuthModal({ open: true, mode: "signup" });
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-sm tracking-wide shadow-sm"
                    >
                      Sign Up
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            <div className="text-center text-[10px] text-text_secondary py-3.5 border-t border-border bg-slate-50 flex-shrink-0">
              College 19 © 2026
            </div>
          </aside>
        </div>
      )}

      {/* MAIN VIEW CONTENT ( Triple-Row Header height is 144px, requiring pt-[152px] on all screens ) */}
      <div className={`flex-grow ${isCollegeDetailPage ? "pt-0" : "pt-[152px]"}`}>
        {/* On College Detail Pages, small top space */}
        <main className={`w-full ${isCollegeDetailPage ? "p-0 m-0 max-w-none" : "max-w-[1440px] mx-auto p-6 md:p-8"}`}>
          {/* Full-width container */}
          {children}
        </main>
      </div>

      {/* ══════════════════════════════════════════
           MEGA FOOTER
         ══════════════════════════════════════════ */}
      <footer className="mt-16 border-t border-[#093c70] bg-[#032b53] text-slate-200 text-[12px]">
        {/* ── ASK QUESTION BANNER ── */}
        <div className="bg-[#022244] border-b border-[#0a3a6b]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center gap-4">
            <p className="font-bold text-white text-sm md:text-base shrink-0">
              Get our experts to answer your questions within 24 Hrs
            </p>
            <div className="flex flex-1 w-full max-w-2xl gap-2">
              <input
                type="text"
                placeholder="Write your questions here"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 text-white text-sm outline-none border border-white/20 focus:border-orange-400 transition-colors placeholder:text-slate-300"
              />
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 6px 20px rgba(249,115,22,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-sm tracking-wide shrink-0"
              >
                Ask Question
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── MEGA LINK COLUMNS (Row 1) ── */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* MBA */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-sm tracking-wide mb-4">
              MBA
            </h4>
            {[
              "MBA",
              "Top MBA Colleges",
              "MBA Colleges",
              "Executive MBA Colleges",
              "MBA Exams",
              "CAT",
              "MAT",
              "Online MBA",
              "MBA College Predictors",
            ].map((l) => (
              <Link
                key={l}
                href="/colleges"
                className="block text-slate-300 hover:text-orange-400 transition-colors leading-snug"
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Engineering */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-sm tracking-wide mb-4">
              Engineering
            </h4>
            {[
              "Engineering",
              "Top Engineering Colleges",
              "Engineering Colleges",
              "Engineering Exams",
              "JEE Main",
              "JEE Advanced",
              "Engineering College Predictors",
              "B.Tech Colleges",
              "Gate Colleges",
            ].map((l) => (
              <Link
                key={l}
                href="/colleges"
                className="block text-slate-300 hover:text-orange-400 transition-colors leading-snug"
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Medicine */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-sm tracking-wide mb-4">
              Medicine
            </h4>
            {[
              "NEET UG",
              "NEET PG",
              "NEET SS",
              "NEET MDS",
              "INI CET",
              "FMGE",
              "AIAPGET",
              "Top Medical Colleges",
              "Medical Colleges",
              "Medical Exams",
            ].map((l) => (
              <Link
                key={l}
                href="/colleges"
                className="block text-slate-300 hover:text-orange-400 transition-colors leading-snug"
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Other Courses */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-sm tracking-wide mb-4">
              Other Courses
            </h4>
            {[
              "Animation",
              "B.Com",
              "B.Sc",
              "BBA",
              "CA",
              "Fashion Designing",
              "Hotel Management",
              "Law",
              "Mass Communication",
              "MBBS",
            ].map((l) => (
              <Link
                key={l}
                href="/colleges"
                className="block text-slate-300 hover:text-orange-400 transition-colors leading-snug"
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Sarkari Exams */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-sm tracking-wide mb-4">
              Sarkari Exams
            </h4>
            {[
              "RRB Group D",
              "RRB NTPC",
              "CTET",
              "UPTET",
              "UGC NET",
              "DSSSB",
              "SSC CGL",
              "SSC CHSL",
              "SSC GD",
              "NDA",
            ].map((l) => (
              <Link
                key={l}
                href="/colleges"
                className="block text-slate-300 hover:text-orange-400 transition-colors leading-snug"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>

        {/* ── MEGA LINK COLUMNS (Row 2) ── */}
        <div className="border-t border-[#0a3a6b] max-w-[1440px] mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Resources */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-sm tracking-wide mb-4">
              Resources
            </h4>
            {[
              "Careers after 12th",
              "Courses After 12th",
              "Ask a Question",
              "Write a college review",
              "Articles",
              "Law College Predictors",
              "Hospitality College Predictor",
              "NCERT Solutions",
              "NCERT Solutions Class 12 Maths",
              "NCERT Solutions Class 12 Physics",
            ].map((l) => (
              <Link
                key={l}
                href="/contact"
                className="block text-slate-300 hover:text-orange-400 transition-colors leading-snug"
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Important Updates */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-sm tracking-wide mb-4">
              Important Updates
            </h4>
            {[
              "XAT 2027",
              "MH CET LAW 2026",
              "CAT 2025 Question Paper",
              "NEET College Predictor",
              "NEET Rank Predictor",
              "CAT 2026",
              "BITSAT 2026",
              "MHT CET 2026",
              "NIFT 2026",
              "VITEEE 2026",
            ].map((l) => (
              <Link
                key={l}
                href="/predictor"
                className="block text-slate-300 hover:text-orange-400 transition-colors leading-snug"
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Study Abroad */}
          <div className="space-y-2.5">
            <h4 className="font-black text-white text-sm tracking-wide mb-4">
              Study Abroad
            </h4>
            {[
              "Study Abroad Home",
              "BTech abroad",
              "MBA abroad",
              "MS abroad",
              "GRE",
              "GMAT",
              "SAT",
              "IELTS",
              "TOEFL",
            ].map((l) => (
              <Link
                key={l}
                href="/colleges"
                className="block text-slate-300 hover:text-orange-400 transition-colors leading-snug"
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Get App */}
          <div className="space-y-4">
            <h4 className="font-black text-white text-sm tracking-wide mb-4">
              Get App, It's faster and better
            </h4>
            <motion.a
              href="#"
              whileHover={{ scale: 1.04, x: 3 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#0a3a6b] hover:border-orange-500 bg-[#022244] hover:bg-[#043361] transition-all group"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 flex-shrink-0"
                fill="currentColor"
              >
                <path d="M3.18 23.76c.3.17.64.24.99.21l12.6-12.6-3.03-3.03L3.18 23.76zM.73 2.36C.28 2.8 0 3.5 0 4.44v15.12c0 .94.28 1.64.74 2.08l.11.1L8.5 14.1v-.2L.84 2.26l-.11.1zM20.08 10.3l-2.28-1.32-3.27 3.27 3.27 3.27 2.3-1.33c.66-.38.66-1.01 0-1.39l-.02-.5zM4.17.26L16.77 12.86l-3.03 3.03L1.18.49C1.52.15 1.94.01 2.4.01c.63 0 1.23.26 1.77.25z" />
              </svg>
              <div>
                <p className="text-[9px] text-slate-300">GET IT ON</p>
                <p className="font-black text-white text-sm leading-tight">
                  Google Play
                </p>
              </div>
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.04, x: 3 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#0a3a6b] hover:border-orange-500 bg-[#022244] hover:bg-[#043361] transition-all group"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 flex-shrink-0"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div>
                <p className="text-[9px] text-slate-300">DOWNLOAD ON THE</p>
                <p className="font-black text-white text-sm leading-tight">
                  App Store
                </p>
              </div>
            </motion.a>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="border-t border-[#0a3a6b] bg-[#021f3d]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo (Official Brand Logo) */}
            <div className="flex flex-col items-start select-none py-1">
              <img
                src="/logo-footer.png?v=3"
                alt="College 19"
                className="h-11 md:h-12 w-auto object-contain"
              />
            </div>

            {/* Bottom Links */}
            <div className="flex flex-wrap justify-center gap-4 text-[10px] text-slate-400">
              {[
                "Grievances",
                "Notices / Summons",
                "Privacy",
                "Sitemap",
                "Terms & Conditions",
              ].map((l) => (
                <Link
                  key={l}
                  href="/contact"
                  className="hover:text-orange-400 transition-colors"
                >
                  {l}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-[10px] text-slate-400 text-right">
              © 2026 College 19. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      <AuthModal
        isOpen={authModal.open}
        defaultMode={authModal.mode}
        onClose={() => setAuthModal((m) => ({ ...m, open: false }))}
        onLoginSuccess={(userData) => {
          setUser(userData);
          localStorage.setItem("tyc-user", JSON.stringify(userData));
          setAuthModal((m) => ({ ...m, open: false }));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("tyc-user-sync"));
          }
        }}
      />

      {/* ══════════════════════════════════════════
           AI SARTHI FLOATING CHATBOT WIDGET
         ══════════════════════════════════════════ */}

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[380px] h-[520px] bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 flex items-center justify-between text-white shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-amber-300 via-orange-400 to-orange-600 flex items-center justify-center shadow-inner border-2 border-white/20">
                  <Bot className="w-5.5 h-5.5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-orange-500 rounded-full" />
                </div>
                <div>
                  <h4 className="font-outfit font-black text-sm tracking-wide leading-none">
                    Sarthi
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-orange-100 uppercase tracking-widest">
                      Counselor Online
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* WhatsApp Banner */}
            <a
              href="https://wa.me/918585951111?text=Hi%20Sarthi,%20I%20have%20a%20query%20about%20college%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 flex items-center justify-between text-white text-[10px] font-bold transition-all shadow-inner shrink-0 gap-2"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-ping shrink-0" />
                <span>Connect with Counselor on WhatsApp</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white text-emerald-600 font-black text-[9px] uppercase tracking-wide shrink-0">
                Chat Now
              </span>
            </a>

            {/* Chat Message Box */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-slate-50/50">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm font-semibold whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-orange-500 text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1 font-semibold">
                    {msg.time}
                  </span>
                </div>
              ))}

              {/* Typing Simulator Animation */}
              {isBotTyping && (
                <div className="flex flex-col items-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1 font-semibold">
                    Typing...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Quick Pills */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-2 no-scrollbar scrollbar-none shrink-0 font-sans">
              {[
                "Galgotias placements?",
                "AIIMS Rishikesh fees?",
                "IIT Delhi package?",
                "Compare Tool?",
                "Admission Predictor?",
              ].map((pill) => (
                <button
                  key={pill}
                  onClick={() => handleSendMessage(pill)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-[10px] font-bold text-slate-600 rounded-full border border-slate-200/80 hover:border-orange-300 transition-all whitespace-nowrap shrink-0"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Chat Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(chatInput);
              }}
              className="p-3 border-t border-slate-100 bg-white flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about colleges, placements, fees..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-all text-white shadow-md shadow-orange-500/20"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.a
            href="https://wa.me/918585951111?text=Hi%20Sarthi,%20I%20have%20a%20query%20about%20college%20admissions."
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl shadow-emerald-500/30 items-center justify-center z-50 border border-emerald-400/20 group cursor-pointer"
          >
            <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-[10px] font-bold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              Chat on WhatsApp
            </span>
            <svg
              className="w-6 h-6 text-white fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.905-6.99C16.558 1.876 14.077.841 11.997.841 6.561.841 2.137 5.26 2.133 10.7c-.001 1.688.455 3.328 1.32 4.795l-.995 3.64 3.729-.981zM17.487 14.39c-.3-.15-1.782-.88-2.03-.97-.25-.09-.43-.13-.61.15-.18.28-.7 1-.86 1.18-.16.18-.32.2-.62.05-1.8-.9-3.21-2.42-4.14-4.04-.08-.13-.01-.26.06-.39.06-.11.13-.3.2-.45.07-.15.11-.26.17-.38.06-.11.03-.23-.01-.38-.05-.15-.43-1.04-.6-1.43-.16-.38-.32-.33-.43-.33h-.37c-.13 0-.33.05-.51.25-.18.2-1.3 1.27-1.3 3.1s1.33 3.6 1.51 3.85c.18.24 2.62 4.02 6.3 5.6.88.37 1.57.6 2.11.77.88.28 1.68.24 2.3.15.7-.1 1.782-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.13-.32-.2-.62-.35z" />
            </svg>
          </motion.a>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
           ADMISSION ALERTS FLOATING WIDGET (SPLIT MODAL OVERLAY)
         ══════════════════════════════════════════ */}
      <AnimatePresence>
        {isAlertOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-[850px] max-h-[92vh] md:max-h-none overflow-y-auto md:overflow-visible bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-12 relative border border-slate-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsAlertOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all text-slate-500 hover:text-slate-800 z-50"
              >
                <X className="w-4 h-4" />
              </button>

              {/* LEFT SIDE PANEL (Saffron Banner - col-span-5) */}
              <div className="col-span-12 md:col-span-5 bg-gradient-to-br from-[#f97e2f] to-[#ffaa66] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden select-none">
                {/* Background decorative blobs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-black/10 rounded-full blur-2xl" />

                {/* Left Top Header */}
                <div className="space-y-6 z-10">
                  {/* Official COLLEGE 19 Logo */}
                  <div className="flex flex-col items-start select-none pb-4 scale-110 origin-left">
                    <img
                      src="/logo.png?v=3"
                      alt="College 19"
                      className="h-16 w-auto object-contain"
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-outfit font-black text-lg md:text-xl leading-snug">
                      Brighten Your Future: Get Expert Guidance for Your College
                      Journey
                    </h3>
                    <p className="text-[11px] text-white/80 leading-relaxed font-semibold hidden md:block">
                      Join thousands of students selecting their ideal
                      engineering, management, and medical campuses with us.
                    </p>
                  </div>
                </div>

                {/* Left Bottom Benefits List */}
                <div className="space-y-4 z-10 mt-6">
                  {/* Benefit 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white border border-white/30 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-black leading-tight text-white">
                        Never Miss Admission Deadlines!
                      </p>
                      <p className="text-[10px] text-white/70 font-semibold leading-normal hidden md:block">
                        Instant alerts on exam dates, forms, and cutoffs.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white border border-white/30 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-black leading-tight text-white">
                        1-on-1 Personalized Counseling
                      </p>
                      <p className="text-[10px] text-white/70 font-semibold leading-normal hidden md:block">
                        Dedicated admission guidance based on ranks and state
                        counseling.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white border border-white/30 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-black leading-tight text-white">
                        Verified Placement Reviews
                      </p>
                      <p className="text-[10px] text-white/70 font-semibold leading-normal hidden md:block">
                        Get genuine reports on package details and hostel
                        feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE PANEL (Form - col-span-7) */}
              <div className="col-span-12 md:col-span-7 p-7 md:p-8 flex flex-col justify-center">
                {!isAlertSubscribed ? (
                  <form onSubmit={handleAlertSubscribe} className="space-y-4">
                    <div className="space-y-1 mb-2">
                      <h4 className="font-outfit font-black text-base text-slate-800 uppercase tracking-wide">
                        Register Now to Apply
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Get live notifications & cutoffs direct to your phone
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Name input */}
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={alertName}
                          onChange={(e) => setAlertName(e.target.value)}
                          placeholder="Name"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                        />
                      </div>

                      {/* Email input */}
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                        />
                      </div>

                      {/* Select Stream Dropdown */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <select
                            required
                            value={alertStream}
                            onChange={(e) => setAlertStream(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold appearance-none cursor-pointer"
                          >
                            <option value="">Stream Interested</option>
                            <option value="Engineering">
                              Engineering (B.Tech/BE)
                            </option>
                            <option value="Management">
                              Management (MBA/BBA)
                            </option>
                            <option value="Medical">Medical (MBBS/BDS)</option>
                            <option value="Design">Design (B.Des/M.Des)</option>
                            <option value="Science & Arts">
                              Science & Arts
                            </option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400" />
                        </div>

                        {/* Select Level Dropdown */}
                        <div className="relative">
                          <select
                            required
                            value={alertLevel}
                            onChange={(e) => setAlertLevel(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold appearance-none cursor-pointer"
                          >
                            <option value="">Level Interested</option>
                            <option value="Undergraduate">
                              Undergraduate (UG)
                            </option>
                            <option value="Postgraduate">
                              Postgraduate (PG)
                            </option>
                            <option value="Diploma">
                              Diploma / Certificate
                            </option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400" />
                        </div>
                      </div>

                      {/* Mobile phone input with prefix flag */}
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl h-11 overflow-hidden focus-within:border-orange-400 focus-within:bg-white transition-all">
                        <div className="flex items-center gap-1 pl-3 pr-3 h-full border-r border-slate-200 text-[10px] font-black text-slate-600 flex-shrink-0 select-none">
                          <span className="text-sm">🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          value={alertPhone}
                          onChange={(e) =>
                            setAlertPhone(
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          placeholder="Mobile Number"
                          className="flex-1 px-3.5 py-2.5 text-xs bg-transparent border-none outline-none text-slate-800 font-semibold"
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 mt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          required
                          checked={alertAgeConfirm}
                          onChange={(e) => setAlertAgeConfirm(e.target.checked)}
                          className="mt-0.5 accent-orange-500 rounded border-slate-300"
                        />
                        <span className="text-[10px] text-slate-500 font-medium leading-none select-none">
                          I confirm that I am 18 years of age or older.
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          required
                          checked={alertTermsAgree}
                          onChange={(e) => setAlertTermsAgree(e.target.checked)}
                          className="mt-0.5 accent-orange-500 rounded border-slate-300"
                        />
                        <span className="text-[10px] text-slate-500 font-medium leading-normal select-none font-semibold">
                          I agree to the{" "}
                          <span className="text-orange-500 font-bold hover:underline">
                            Terms & Conditions
                          </span>{" "}
                          and{" "}
                          <span className="text-orange-500 font-bold hover:underline">
                            Privacy Policy
                          </span>
                          , and consent to be contacted via WhatsApp, SMS, &
                          email.
                        </span>
                      </label>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={!alertAgeConfirm || !alertTermsAgree}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 mt-2 bg-gradient-to-r from-amber-500 to-orange-600 disabled:from-slate-200 disabled:to-slate-200 disabled:cursor-not-allowed text-white text-xs font-black tracking-widest rounded-xl shadow-md transition-all uppercase"
                    >
                      Next
                    </motion.button>

                    {/* Already have an account */}
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                      Already Having An Account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAlertOpen(false);
                          setAuthModal({ open: true, mode: "login" });
                        }}
                        className="text-orange-500 hover:text-orange-600 font-black hover:underline"
                      >
                        Login Now
                      </button>
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4 text-center flex flex-col items-center gap-4 w-full"
                  >
                    {/* Success Icon */}
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border-2 border-emerald-100 shadow-sm animate-[pulse_2s_infinite]">
                      <CheckCircle className="w-7 h-7" />
                    </div>

                    {/* Text confirmations */}
                    <div className="space-y-1">
                      <h5 className="font-outfit font-black text-base text-slate-800 leading-none">
                        Subscription Active!
                      </h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                        Congratulations {alertName}!
                      </p>
                      <p className="text-[11px] text-slate-500 font-semibold px-4 leading-relaxed mt-1">
                        You have successfully subscribed to instant admission
                        alerts on <b>{alertEmail}</b>.
                      </p>
                    </div>

                    {/* Divider line */}
                    <div className="w-full border-t border-slate-100 my-1" />

                    {/* Contact Us CTA Section */}
                    <div className="space-y-2.5 w-full px-4">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                        Need Urgent Admission Help?
                      </p>
                      <p className="text-[11px] text-slate-500 font-semibold leading-tight">
                        Connect with our senior counselors directly now:
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                        {/* WhatsApp Button */}
                        <a
                          href="https://wa.me/918585951111?text=Hi%20Sarthi,%20I%20have%20a%20query%20about%20college%20admissions."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-white text-xs font-black uppercase tracking-wider shadow-sm"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="currentColor"
                          >
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.277L6.5 20.5l5.397-1.398c.95.534 2.12.87 3.114.872 3.182 0 5.768-2.587 5.77-5.767 0-3.18-2.587-5.767-5.77-5.767zm3.61 7.223c-.15.075-.89.44-1.03.49-.14.05-.24.07-.34-.07-.1.15-.39.49-.48.59-.09.1-.18.11-.33.04-.9-.45-1.6-1.21-2.07-2.02-.04-.06-.01-.13.03-.19.03-.06.07-.15.1-.22.04-.08.06-.13.09-.19.03-.06.02-.12-.01-.19-.03-.07-.24-.58-.33-.8-.09-.2-.18-.17-.24-.17h-.2c-.07 0-.18.03-.28.14-.1.1-.39.38-.39.93s.4 1.08.45 1.15c.05.07 1.34 2.05 3.25 2.87.45.19.81.3 1.08.39.45.14.86.12 1.18.07.36-.05.89-.36 1.02-.71.13-.35.13-.65.09-.71-.04-.07-.16-.11-.31-.19z" />
                          </svg>
                          WhatsApp Chat
                        </a>

                        {/* Call Button */}
                        <a
                          href="tel:+918585951111"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-xs font-black uppercase tracking-wider shadow-sm"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          Call Expert
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center z-50 border border-orange-400/20 group cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-400 border-2 border-orange-500 rounded-full animate-ping" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-400 border-2 border-orange-500 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    </div>
  );
}
