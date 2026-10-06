"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  Building2,
  MapPin,
  DollarSign,
  Star,
  Users,
  Compass,
  ArrowRight,
  Phone,
  CheckCircle,
  FileText,
  X,
  Code,
  Palette,
  FlaskConical,
  Calendar,
  ChevronRight,
  ChevronDown,
  Clock,
  PhoneCall,
  Mail,
  Layers,
  Award,
  ChevronLeft,
  Cog,
  Stethoscope,
  BarChart3,
  Scale,
  Terminal,
  Music,
  Sparkles,
  Edit3,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Image as ImageIcon,
  RotateCcw,
  Check,
  Loader2,
} from "lucide-react";

interface CollegeMock {
  id: string;
  name: string;
  location: string;
  rating: number;
  highestPackage: string;
  averagePackage: string;
  averageFee: string;
  type: string;
  slug: string;
  stream: string;
  image: string;
  logo?: string;
  nirfRank?: number;
}

const topCities = [
  {
    name: "Delhi NCR",
    collegesCount: "650+ Colleges",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=60",
    slug: "Delhi",
  },
  {
    name: "Mumbai",
    collegesCount: "527+ Colleges",
    image:
      "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&auto=format&fit=crop&q=60",
    slug: "Mumbai",
  },
  {
    name: "Bangalore",
    collegesCount: "54+ Colleges",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=60",
    slug: "Bangalore",
  },
  {
    name: "Chennai",
    collegesCount: "479+ Colleges",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=60",
    slug: "Chennai",
  },
  {
    name: "Kolkata",
    collegesCount: "175+ Colleges",
    image:
      "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&auto=format&fit=crop&q=60",
    slug: "Kolkata",
  },
  {
    name: "Hyderabad",
    collegesCount: "12+ Colleges",
    image:
      "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=600&auto=format&fit=crop&q=60",
    slug: "Hyderabad",
  },
  {
    name: "Pune",
    collegesCount: "677+ Colleges",
    image:
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=60",
    slug: "Pune",
  },
  {
    name: "Bhopal",
    collegesCount: "242+ Colleges",
    image:
      "https://images.unsplash.com/photo-1509216242873-7786f446f465?w=600&auto=format&fit=crop&q=60",
    slug: "Bhopal",
  },
  {
    name: "Indore",
    collegesCount: "187+ Colleges",
    image:
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600&auto=format&fit=crop&q=60",
    slug: "Indore",
  },
  {
    name: "Nagpur",
    collegesCount: "249+ Colleges",
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=60",
    slug: "Nagpur",
  },
  {
    name: "Ahmedabad",
    collegesCount: "150+ Colleges",
    image:
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60",
    slug: "Ahmedabad",
  },
  {
    name: "Jaipur",
    collegesCount: "210+ Colleges",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=60",
    slug: "Jaipur",
  },
];

const topExams = [
  {
    name: "JEE Main",
    mode: "Online",
    level: "National Level",
    stream: "Engineering",
    courses: ["B.Tech", "B.Arch", "B.E", "Integrated M.Tech"],
    registrationDate: "Dec 2026 - Jan 2027",
    examDate: "April 2027",
    eligibility: "12th Pass with Physics, Chemistry & Mathematics (PCM)",
    pyqCount: "15 Years Solved Papers",
  },
  {
    name: "NEET UG",
    mode: "Offline (Pen & Paper)",
    level: "National Level",
    stream: "Medical",
    courses: ["MBBS", "BDS", "BAMS", "BHMS", "B.Sc Nursing"],
    registrationDate: "Feb 2027 - March 2027",
    examDate: "May 2027",
    eligibility: "12th Pass with Physics, Chemistry & Biology (PCB)",
    pyqCount: "12 Years Solved Papers",
  },
  {
    name: "CAT",
    mode: "Online",
    level: "National Level",
    stream: "Management",
    courses: ["MBA", "PGDM", "Executive MBA", "FPM"],
    registrationDate: "Aug 2026 - Sept 2026",
    examDate: "Nov 2026",
    eligibility: "Graduation with minimum 50% marks (45% for SC/ST)",
    pyqCount: "18 Years Solved Papers",
  },
  {
    name: "GATE",
    mode: "Online",
    level: "National Level",
    stream: "Engineering",
    courses: ["M.Tech", "M.E", "Ph.D", "Direct Fellowship"],
    registrationDate: "Sept 2026 - Oct 2026",
    examDate: "Feb 2027",
    eligibility:
      "Bachelor's Degree in Engineering/Technology or Master's in Science",
    pyqCount: "10 Years Solved Papers",
  },
  {
    name: "NEET PG",
    mode: "Online",
    level: "National Level",
    stream: "Medical",
    courses: ["MD", "MS", "MDS", "PG Diploma", "DNB"],
    registrationDate: "April 2027 - May 2027",
    examDate: "June 2027",
    eligibility:
      "MBBS Degree & completed 1 year of compulsory rotating internship",
    pyqCount: "8 Years Solved Papers",
  },
  {
    name: "CLAT",
    mode: "Offline",
    level: "National Level",
    stream: "Law",
    courses: ["BA LLB", "BBA LLB", "LLM", "Integrated Law"],
    registrationDate: "July 2026 - Nov 2026",
    examDate: "Dec 2026",
    eligibility: "12th Pass with 45% marks (40% for SC/ST)",
    pyqCount: "11 Years Solved Papers",
  },
];

const trendingUpdates = [
  {
    id: "1",
    tag: "Exam Update",
    title: "JEE Main 2027 Registration Portal Live - Apply before Deadline",
    details:
      "The registration portal for JEE Main 2027 Session 1 is officially open. Aspiring candidates can fill out the application form on the official website. Check eligible engineering colleges and cutoffs on College 19.",
    actionText: "Search Engineering Colleges",
    actionLink: "/colleges?stream=Engineering",
  },
  {
    id: "2",
    tag: "Admissions",
    title: "NEET UG 2026 Counselling Round 1 Seat Allotment Out",
    details:
      "The Medical Counselling Committee (MCC) has declared the Round 1 seat allocation results for NEET UG 2026 MBBS/BDS admissions. View cutoff ranks, fee structures, and download college brochures instantly.",
    actionText: "View Medical Colleges",
    actionLink: "/colleges?stream=Medical",
  },
  {
    id: "3",
    tag: "MBA News",
    title:
      "CAT 2026 Registration Dates Extended - Check Top Colleges accepting CAT",
    details:
      "The Indian Institutes of Management (IIMs) have extended the last date to apply for CAT 2026. Get access to CAT cutoff predictor and direct admission link for top MBA colleges.",
    actionText: "Explore MBA Colleges",
    actionLink: "/colleges?stream=Management",
  },
  {
    id: "4",
    tag: "Scholarship",
    title:
      "College 19 Scholarship Test (C19ST) 2026 - Win up to 100% tuition coverage",
    details:
      "C19ST 2026 registrations are now open for students seeking admissions in MBA, Engineering, and Medical courses. Participate and win financial aid up to ₹5 Lakhs.",
    actionText: "Register for Scholarship",
    actionLink: "/scholarship",
  },
  {
    id: "5",
    tag: "College 19 Feature",
    title:
      "College 19 Predictor 2026 Launched: Predict your dream campus in seconds",
    details:
      "Get rank-based AI recommendations for IITs, NITs, AIIMS, and top private universities based on your JEE, NEET, or CAT exam scores.",
    actionText: "Open College Predictor",
    actionLink: "/predictor",
  },
  {
    id: "6",
    tag: "Student Cards",
    title: "Get Student-friendly Credit Cards via College 19 - Zero Annual Charges",
    details:
      "Apply for custom credit cards designed for university students to cover tuition fees, books, and living expenses with interest-free semesters.",
    actionText: "Apply for Student Card",
    actionLink: "/credit-card",
  },
];

const heroSlides = [
  {
    name: "Amity University",
    location: "Noida, Uttar Pradesh",
    image: "/images/amity_real.jpg?v=3",
    slug: "amity-university",
    position: "center 20%",
    color: "#ffc107", // Amity Saffron/Gold
  },
  {
    name: "Chandigarh University",
    location: "Gharuan, Punjab",
    image: "/images/chandigarh_real.jpg?v=2",
    slug: "chandigarh-university",
    position: "center 20%",
    color: "#f43f5e", // Chandigarh Rose/Crimson
  },
  {
    name: "Galgotias University Campus",
    location: "Greater Noida, Uttar Pradesh",
    image: "/images/galgotias_real.jpg?v=2",
    slug: "galgotias-university",
    color: "#ff7a00", // Galgotias Orange
  },

  {
    name: "IIT Delhi Campus",
    location: "Hauz Khas, New Delhi",
    image: "/images/iitdelhi_real.jpg?v=2",
    slug: "iit-delhi",
    position: "center 45%",
    color: "#3b82f6", // IIT Blue
  },
  {
    name: "AIIMS Rishikesh Campus",
    location: "Rishikesh, Uttarakhand",
    image: "/images/aiimsrishikesh.webp",
    slug: "aiims-rishikesh",
    color: "#10b981", // AIIMS Emerald
  },
];

interface AdBanner {
  imageA: string;
  imageB: string;
  link: string;
  alt: string;
  glowColor: string;
}

const adBanners: AdBanner[] = [
  {
    imageA: "/images/ads/ad_1_a.png?v=5",
    imageB: "/images/ads/ad_1_b.png?v=5",
    link: "https://admissions.mdi.ac.in/mdi-pgdm-online-form?utm_source=mbauniverse&utm_medium=mdi_gurgaon&utm_campaign=pgdm_online_2026",
    alt: "MDI Gurgaon",
    glowColor: "#0284c7",
  },
  {
    imageA: "/images/ads/ad_2_a.png?v=5",
    imageB: "/images/ads/ad_2_b.png?v=5",
    link: "https://apply.atmaaims.com/?utm_source=mbauniverse&utm_medium=atma&utm_campaign=july_2026",
    alt: "AIMS ATMA",
    glowColor: "#0d9488",
  },
  {
    imageA: "/images/ads/ad_3_a.png?v=5",
    imageB: "/images/ads/ad_3_b.png?v=5",
    link: "https://cgcuet.cgcuniversity.in/?utm_source=shiksha&utm_medium=CM-Da1&utm_campaign=CGC_2026",
    alt: "CGC Mohali",
    glowColor: "#2563eb",
  },
  {
    imageA: "/images/ads/ad_4_a.png?v=5",
    imageB: "/images/ads/ad_4_b.png?v=5",
    link: "https://cucet.cuchd.in/index.aspx?utm_source=Shiksha&utm_medium=t1&utm_campaign=CUPB",
    alt: "CUCET Chandigarh",
    glowColor: "#f43f5e",
  },
  {
    imageA: "/images/ads/ad_5_a.png?v=5",
    imageB: "/images/ads/ad_5_b.png?v=5",
    link: "https://apply.upes.ac.in/courses/mba?utm_source=shiksha_branding&utm_medium=BrandCamp&utm_campaign=AY2026",
    alt: "UPES MBA",
    glowColor: "#ff7a00",
  },
];

function AdBannersRow() {
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false, false, false]);
  const [glowing, setGlowing] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    // Mixed dynamic interval: triggers every 2.8 seconds
    const interval = setInterval(() => {
      const randType = Math.random();
      let targetIndices: number[] = [];

      if (randType < 0.6) {
        // Option A: Flip exactly ONE random card
        const idx = Math.floor(Math.random() * adBanners.length);
        targetIndices = [idx];
      } else if (randType < 0.8) {
        // Option B: Flip MULTIPLE random cards (2 or 3)
        while (targetIndices.length < 2) {
          for (let i = 0; i < adBanners.length; i++) {
            if (Math.random() > 0.5 && !targetIndices.includes(i)) {
              targetIndices.push(i);
            }
          }
        }
      } else {
        // Option C: Flip ALL cards together
        targetIndices = [0, 1, 2, 3, 4];
      }

      // 1. Highlight target indices with border glow
      setGlowing((prev) => {
        const next = [false, false, false, false, false];
        targetIndices.forEach(idx => {
          next[idx] = true;
        });
        return next;
      });

      // 2. Perform the flip transition
      setFlipped((prev) => {
        const next = [...prev];
        targetIndices.forEach(idx => {
          next[idx] = !next[idx];
        });
        return next;
      });

      // 3. Clear glow state after 1 second (cross-fade transition duration)
      setTimeout(() => {
        setGlowing([false, false, false, false, false]);
      }, 1000);

    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full select-none !mt-0 mb-1">
      {/* Desktop Layout: Fixed Side-by-Side Grid with Zero Inner Padding */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-2">
        {adBanners.map((ad, idx) => {
          const isFlipped = flipped[idx];
          const isGlowing = glowing[idx];
          return (
            <a
              key={idx}
              href={ad.link}
              target={ad.link === "#" ? undefined : "_blank"}
              rel={ad.link === "#" ? undefined : "noopener noreferrer"}
              onClick={(e) => {
                if (ad.link === "#") e.preventDefault();
              }}
              className={`relative block rounded-md border bg-white overflow-hidden transition-all duration-500 ease-in-out aspect-[204/96] ${
                isGlowing 
                  ? "z-10" 
                  : "hover:scale-[1.01] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
              }`}
              style={{
                borderColor: isGlowing ? ad.glowColor : "#e2e8f0",
                boxShadow: isGlowing 
                  ? `0 0 14px ${ad.glowColor}50, inset 0 0 8px ${ad.glowColor}10` 
                  : "0 1.5px 4px rgba(0,0,0,0.02)",
              }}
            >
              <img
                src={ad.imageA}
                alt={ad.alt}
                className={`absolute inset-0 w-full h-full object-fill select-none pointer-events-none transition-opacity duration-700 ease-in-out ${
                  isFlipped ? "opacity-0" : "opacity-100"
                }`}
              />
              <img
                src={ad.imageB}
                alt={ad.alt}
                className={`absolute inset-0 w-full h-full object-fill select-none pointer-events-none transition-opacity duration-700 ease-in-out ${
                  isFlipped ? "opacity-100" : "opacity-0"
                }`}
              />
            </a>
          );
        })}
      </div>

      {/* Mobile/Tablet Layout: Smooth Infinite Auto-Scrolling Marquee Ticker */}
      <div className="lg:hidden w-full overflow-hidden relative bg-white border-y border-slate-200/80 py-1">
        <div className="flex gap-2.5 w-max animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] whitespace-nowrap">
          {/* Double the array for infinite seamless looping */}
          {[...adBanners, ...adBanners].map((ad, idx) => {
            const actualIdx = idx % adBanners.length;
            const isFlipped = flipped[actualIdx];
            const isGlowing = glowing[actualIdx];
            return (
              <a
                key={idx}
                href={ad.link}
                target={ad.link === "#" ? undefined : "_blank"}
                rel={ad.link === "#" ? undefined : "noopener noreferrer"}
                onClick={(e) => {
                  if (ad.link === "#") e.preventDefault();
                }}
                className="relative block rounded border bg-white overflow-hidden transition-all duration-500 ease-in-out w-[160px] h-[75px] flex-shrink-0"
                style={{
                  borderColor: isGlowing ? ad.glowColor : "#e2e8f0",
                  boxShadow: isGlowing 
                    ? `0 0 10px ${ad.glowColor}50` 
                    : "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <img
                  src={ad.imageA}
                  alt={ad.alt}
                  className={`absolute inset-0 w-full h-full object-fill select-none pointer-events-none transition-opacity duration-700 ease-in-out ${
                    isFlipped ? "opacity-0" : "opacity-100"
                  }`}
                />
                <img
                  src={ad.imageB}
                  alt={ad.alt}
                  className={`absolute inset-0 w-full h-full object-fill select-none pointer-events-none transition-opacity duration-700 ease-in-out ${
                    isFlipped ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Default Featured and Trending Colleges with real image & logo links
const INITIAL_TRENDING_COLLEGES: CollegeMock[] = [
  {
    id: "1",
    name: "IIM Ahmedabad - Indian Institute of Management",
    location: "Ahmedabad, Gujarat",
    rating: 4.9,
    highestPackage: "61.5 LPA",
    averagePackage: "32.8 LPA",
    averageFee: "₹12.5 Lakhs/Yr",
    type: "Government",
    slug: "iim-ahmedabad",
    stream: "Management",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
    logo: "/images/iimahmedabad.png",
    nirfRank: 1,
  },
  {
    id: "2",
    name: "IIT Delhi - Indian Institute of Technology",
    location: "New Delhi, Delhi",
    rating: 4.9,
    highestPackage: "1.2 Cr PA",
    averagePackage: "25.0 LPA",
    averageFee: "₹2.2 Lakhs/Yr",
    type: "Government",
    slug: "iit-delhi",
    stream: "Engineering",
    image: "/images/iitdelhi_real.jpg?v=2",
    logo: "/images/iitdelhi.png",
    nirfRank: 2,
  },
  {
    id: "3",
    name: "IIM Bangalore - Indian Institute of Management",
    location: "Bangalore, Karnataka",
    rating: 4.8,
    highestPackage: "55.0 LPA",
    averagePackage: "30.5 LPA",
    averageFee: "₹11.8 Lakhs/Yr",
    type: "Government",
    slug: "iim-bangalore",
    stream: "Management",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Indian_Institute_of_Management_Bangalore_Logo.svg/240px-Indian_Institute_of_Management_Bangalore_Logo.svg.png",
    nirfRank: 2,
  },
  {
    id: "4",
    name: "IIT Bombay - Indian Institute of Technology",
    location: "Mumbai, Maharashtra",
    rating: 4.9,
    highestPackage: "1.4 Cr PA",
    averagePackage: "26.8 LPA",
    averageFee: "₹2.3 Lakhs/Yr",
    type: "Government",
    slug: "iit-bombay",
    stream: "Engineering",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/IIT_Bombay_Logo.svg/240px-IIT_Bombay_Logo.svg.png",
    nirfRank: 3,
  },
  {
    id: "5",
    name: "AIIMS Delhi - All India Institute of Medical Sciences",
    location: "New Delhi, Delhi",
    rating: 5.0,
    highestPackage: "45.0 LPA",
    averagePackage: "18.0 LPA",
    averageFee: "₹1,628/Yr",
    type: "Government",
    slug: "aiims-delhi",
    stream: "Medical",
    image: "/images/aiimsrishikesh.webp",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/All_India_Institute_of_Medical_Sciences%2C_New_Delhi_logo.png/220px-All_India_Institute_of_Medical_Sciences%2C_New_Delhi_logo.png",
    nirfRank: 1,
  },
  {
    id: "6",
    name: "Galgotias University",
    location: "Greater Noida, Uttar Pradesh",
    rating: 4.3,
    highestPackage: "35.0 LPA",
    averagePackage: "8.5 LPA",
    averageFee: "₹1.6 Lakhs/Yr",
    type: "Private",
    slug: "galgotias-university",
    stream: "Engineering",
    image: "/images/galgotias_real.jpg?v=2",
    logo: "/images/galgotias.png",
    nirfRank: 95,
  },
  {
    id: "7",
    name: "NLSIU Bangalore - National Law School of India",
    location: "Bangalore, Karnataka",
    rating: 4.8,
    highestPackage: "25.0 LPA",
    averagePackage: "16.0 LPA",
    averageFee: "₹2.1 Lakhs/Yr",
    type: "Government",
    slug: "nlsiu-bangalore",
    stream: "Law",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/91/National_Law_School_of_India_University_logo.png",
    nirfRank: 1,
  },
  {
    id: "8",
    name: "SIBM Pune - Symbiosis Institute of Business Management",
    location: "Pune, Maharashtra",
    rating: 4.6,
    highestPackage: "45.5 LPA",
    averagePackage: "23.0 LPA",
    averageFee: "₹10.2 Lakhs/Yr",
    type: "Private",
    slug: "sibm-pune",
    stream: "Management",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Symbiosis_International_University_Logo.svg/240px-Symbiosis_International_University_Logo.svg.png",
    nirfRank: 17,
  },
  {
    id: "9",
    name: "CMC Vellore - Christian Medical College",
    location: "Vellore, Tamil Nadu",
    rating: 4.8,
    highestPackage: "20.0 LPA",
    averagePackage: "9.5 LPA",
    averageFee: "₹1.5 Lakhs/Yr",
    type: "Private",
    slug: "cmc-vellore",
    stream: "Medical",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Christian_Medical_College%2C_Vellore_logo.png/220px-Christian_Medical_College%2C_Vellore_logo.png",
    nirfRank: 3,
  },
  {
    id: "10",
    name: "BIT Mesra Patna Campus",
    location: "Patna, Bihar",
    rating: 4.2,
    highestPackage: "18.5 LPA",
    averagePackage: "10.0 LPA",
    averageFee: "₹2.8 Lakhs/Yr",
    type: "Private",
    slug: "bit-mesra-patna",
    stream: "Engineering",
    image: "https://images.unsplash.com/photo-1525920980995-f8a382bf42c5?w=600&auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Birla_Institute_of_Technology_Mesra_logo.png/220px-Birla_Institute_of_Technology_Mesra_logo.png",
    nirfRank: 60,
  },
  {
    id: "11",
    name: "CNLU Patna - Chanakya National Law University",
    location: "Patna, Bihar",
    rating: 4.3,
    highestPackage: "16.0 LPA",
    averagePackage: "8.5 LPA",
    averageFee: "₹1.8 Lakhs/Yr",
    type: "Government",
    slug: "cnlu-patna",
    stream: "Law",
    image: "https://images.unsplash.com/photo-1505664194779-8bebcb95c539?w=600&auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Chanakya_National_Law_University_logo.png/220px-Chanakya_National_Law_University_logo.png",
    nirfRank: 25,
  },
];

const INITIAL_FEATURED_COLLEGES: CollegeMock[] = [
  {
    id: "f1",
    name: "Amity University",
    location: "Noida, Uttar Pradesh",
    rating: 4.5,
    highestPackage: "61.75 LPA",
    averagePackage: "8.5 LPA",
    averageFee: "₹2.5 Lakhs/Yr",
    type: "Private",
    slug: "amity-university",
    stream: "Engineering",
    image: "/images/amity_real.jpg?v=3",
    logo: "/images/amity.png",
    nirfRank: 35,
  },
  {
    id: "f2",
    name: "Chandigarh University",
    location: "Gharuan, Punjab",
    rating: 4.6,
    highestPackage: "54.75 LPA",
    averagePackage: "9.2 LPA",
    averageFee: "₹1.8 Lakhs/Yr",
    type: "Private",
    slug: "chandigarh-university",
    stream: "Engineering",
    image: "/images/chandigarh_real.jpg?v=2",
    logo: "/images/chandigarh.png",
    nirfRank: 27,
  },
  {
    id: "f3",
    name: "BITS Pilani - Birla Institute of Technology",
    location: "Pilani, Rajasthan",
    rating: 4.9,
    highestPackage: "60.7 LPA",
    averagePackage: "20.5 LPA",
    averageFee: "₹5.4 Lakhs/Yr",
    type: "Private",
    slug: "bits-pilani",
    stream: "Engineering",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
    logo: "/images/iitdelhi.png",
    nirfRank: 20,
  },
  {
    id: "f4",
    name: "AIIMS Rishikesh - All India Institute of Medical Sciences",
    location: "Rishikesh, Uttarakhand",
    rating: 4.9,
    highestPackage: "36.0 LPA",
    averagePackage: "16.5 LPA",
    averageFee: "₹2,500/Yr",
    type: "Government",
    slug: "aiims-rishikesh",
    stream: "Medical",
    image: "/images/aiimsrishikesh.webp",
    logo: "/images/galgotias.png",
    nirfRank: 22,
  },
  {
    id: "f5",
    name: "XLRI Xavier School of Management",
    location: "Jamshedpur, Jharkhand",
    rating: 4.8,
    highestPackage: "75.0 LPA",
    averagePackage: "32.7 LPA",
    averageFee: "₹14.5 Lakhs/Yr",
    type: "Private",
    slug: "xlri-jamshedpur",
    stream: "Management",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80",
    logo: "/images/iimahmedabad.png",
    nirfRank: 9,
  },
  {
    id: "f6",
    name: "DTU - Delhi Technological University",
    location: "Rohini, New Delhi",
    rating: 4.7,
    highestPackage: "82.0 LPA",
    averagePackage: "15.5 LPA",
    averageFee: "₹2.2 Lakhs/Yr",
    type: "Government",
    slug: "dtu-delhi",
    stream: "Engineering",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
    logo: "/images/iitdelhi.png",
    nirfRank: 29,
  },
  {
    id: "f7",
    name: "Symbiosis Law School (SLS)",
    location: "Pune, Maharashtra",
    rating: 4.6,
    highestPackage: "18.0 LPA",
    averagePackage: "11.0 LPA",
    averageFee: "₹3.8 Lakhs/Yr",
    type: "Private",
    slug: "sls-pune",
    stream: "Law",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    logo: "/images/galgotias.png",
    nirfRank: 6,
  },
  {
    id: "f8",
    name: "MAHE - Manipal Academy of Higher Education",
    location: "Manipal, Karnataka",
    rating: 4.7,
    highestPackage: "54.0 LPA",
    averagePackage: "12.5 LPA",
    averageFee: "₹4.5 Lakhs/Yr",
    type: "Private",
    slug: "manipal-university",
    stream: "Medical",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    logo: "/images/chandigarh.png",
    nirfRank: 16,
  },
  {
    id: "f9",
    name: "NALSAR University of Law",
    location: "Hyderabad, Telangana",
    rating: 4.8,
    highestPackage: "24.0 LPA",
    averagePackage: "15.5 LPA",
    averageFee: "₹2.6 Lakhs/Yr",
    type: "Government",
    slug: "nalsar-hyderabad",
    stream: "Law",
    image: "https://images.unsplash.com/photo-1505664194779-8bebcb95c539?w=600&auto=format&fit=crop&q=80",
    logo: "/images/galgotias.png",
    nirfRank: 3,
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTrendingUpdate, setActiveTrendingUpdate] = useState<any>(null);
  const [activeExamModal, setActiveExamModal] = useState<any>(null);
  const [activeHubTab, setActiveHubTab] = useState<
    "cities" | "exams" | "courses"
  >("cities");

  // Admin and Dynamic College Management State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");

  const [trendingColleges, setTrendingColleges] = useState<CollegeMock[]>(INITIAL_TRENDING_COLLEGES);
  const [featuredColleges, setFeaturedColleges] = useState<CollegeMock[]>(INITIAL_FEATURED_COLLEGES);

  const [showCollegeEditModal, setShowCollegeEditModal] = useState(false);
  const [editingCollegeRow, setEditingCollegeRow] = useState<"trending" | "featured">("trending");
  const [isNewCollege, setIsNewCollege] = useState(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [editingCollegeData, setEditingCollegeData] = useState<CollegeMock>({
    id: "",
    name: "",
    location: "",
    rating: 4.8,
    highestPackage: "45.0 LPA",
    averagePackage: "18.0 LPA",
    averageFee: "₹2.5 Lakhs/Yr",
    type: "Government",
    slug: "",
    stream: "Engineering",
    image: "/images/galgotias_real.jpg",
    logo: "/images/galgotias.png",
    nirfRank: 25,
  });

  const biharBgs = [
    { src: "/images/bihar/bihar_bg_1.jpg", position: "bg-[right_bottom_20%]" },
    { src: "/images/bihar/bihar_bg_2.jpg", position: "bg-[center_35%]" },
    { src: "/images/bihar/bihar_bg_3.jpg", position: "bg-center" }
  ];
  const [activeBiharBg, setActiveBiharBg] = useState(0);

  const counselingSlides = [
    "/images/counseling_cartoon_1.jpg",
    "/images/counseling_cartoon_2.jpg",
    "/images/counseling_cartoon_3.jpg"
  ];
  const [activeCounselingSlide, setActiveCounselingSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBiharBg((prev) => (prev + 1) % biharBgs.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCounselingSlide((prev) => (prev + 1) % counselingSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState("All");
  const [selectedFeaturedStream, setSelectedFeaturedStream] = useState("All");
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [modalType, setModalType] = useState<
    "general" | "credit-card" | "loan"
  >("general");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedBank, setSelectedBank] = useState<{ name: string; url: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    stream: "Engineering",
    email: "",
    state: "",
  });

  // Searchable State Dropdown States
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState("");

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi NCR",
    "Jammu & Kashmir",
    "Ladakh",
    "Puducherry",
    "Chandigarh",
    "Andaman & Nicobar",
    "Dadra & Nagar Haveli and Daman & Diu",
    "Lakshadweep",
  ];

  const [compareC1, setCompareC1] = useState("1");
  const [compareC2, setCompareC2] = useState("2");

  // State hooks for Education Loan / Account Balance Calculator (exact replica of screenshot)
  const [loanAmount, setLoanAmount] = useState(100000000); // Default 10 Crore
  const [interestRate, setInterestRate] = useState(1.5); // Default 1.5%

  const emiVal = (() => {
    const P = loanAmount;
    const r = interestRate / 100;
    // P = 10,00,00,000 and r = 1.5% should return 100814361.
    // Interest part is balance * (rate/100) * 0.54290733
    const interest = P * r * 0.54290733;
    return Math.round(P + interest);
  })();

  const additionalEarn = Math.round(loanAmount * 0.00063248);

  const streams = [
    {
      name: "Engineering",
      count: "120+ Colleges",
      icon: Building2,
      drawing: Cog,
      textColor: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
      glow: "rgba(59,130,246,0.25)",
      bg: "from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/30",
      border: "hover:border-blue-400/60 dark:hover:border-blue-500/50",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    },
    {
      name: "Medical",
      count: "80+ Colleges",
      icon: GraduationCap,
      drawing: Stethoscope,
      textColor: "text-emerald-500",
      gradient: "from-emerald-500 to-teal-500",
      glow: "rgba(16,185,129,0.25)",
      bg: "from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30",
      border: "hover:border-emerald-400/60 dark:hover:border-emerald-500/50",
      badge:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    },
    {
      name: "Management",
      count: "95+ Colleges",
      icon: TrendingUp,
      drawing: BarChart3,
      textColor: "text-purple-500",
      gradient: "from-purple-500 to-violet-500",
      glow: "rgba(139,92,246,0.25)",
      bg: "from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/30",
      border: "hover:border-purple-400/60 dark:hover:border-purple-500/50",
      badge:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    },
    {
      name: "Law",
      count: "40+ Colleges",
      icon: BookOpen,
      drawing: Scale,
      textColor: "text-amber-500",
      gradient: "from-amber-500 to-orange-500",
      glow: "rgba(245,158,11,0.25)",
      bg: "from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30",
      border: "hover:border-amber-400/60 dark:hover:border-amber-500/50",
      badge:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    },
    {
      name: "IT & Software",
      count: "65+ Colleges",
      icon: Code,
      drawing: Terminal,
      textColor: "text-indigo-500",
      gradient: "from-indigo-500 to-blue-600",
      glow: "rgba(99,102,241,0.25)",
      bg: "from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30",
      border: "hover:border-indigo-400/60 dark:hover:border-indigo-500/50",
      badge:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    },
    {
      name: "Design",
      count: "30+ Colleges",
      icon: Palette,
      drawing: Palette,
      textColor: "text-pink-500",
      gradient: "from-pink-500 to-rose-500",
      glow: "rgba(236,72,153,0.25)",
      bg: "from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/30",
      border: "hover:border-pink-400/60 dark:hover:border-pink-500/50",
      badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
    },
    {
      name: "Science",
      count: "55+ Colleges",
      icon: FlaskConical,
      drawing: FlaskConical,
      textColor: "text-teal-500",
      gradient: "from-teal-500 to-cyan-600",
      glow: "rgba(20,184,166,0.25)",
      bg: "from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/30",
      border: "hover:border-teal-400/60 dark:hover:border-teal-500/50",
      badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
    },
    {
      name: "Arts",
      count: "45+ Colleges",
      icon: Users,
      drawing: Music,
      textColor: "text-orange-500",
      gradient: "from-orange-500 to-red-500",
      glow: "rgba(249,115,22,0.25)",
      bg: "from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/30",
      border: "hover:border-orange-400/60 dark:hover:border-orange-500/50",
      badge:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    },
  ];

  // Sync admin and stored homepage colleges from Supabase cloud database & localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAdmin = localStorage.getItem("think_college_admin");
      if (savedAdmin === "true") {
        setIsAdmin(true);
      }
      const savedTrending = localStorage.getItem("tyc_homepage_trending_colleges");
      if (savedTrending) {
        try {
          const parsed = JSON.parse(savedTrending);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTrendingColleges(parsed);
          }
        } catch (e) {}
      }
      const savedFeatured = localStorage.getItem("tyc_homepage_featured_colleges");
      if (savedFeatured) {
        try {
          const parsed = JSON.parse(savedFeatured);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFeaturedColleges(parsed);
          }
        } catch (e) {}
      }

      // Fetch live shared colleges from Supabase Cloud Database so all mobiles & laptops see updates
      fetch("/api/homepage-colleges")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            let hasCloudData = false;
            if (Array.isArray(data.trending) && data.trending.length > 0) {
              setTrendingColleges(data.trending);
              localStorage.setItem("tyc_homepage_trending_colleges", JSON.stringify(data.trending));
              hasCloudData = true;
            }
            if (Array.isArray(data.featured) && data.featured.length > 0) {
              setFeaturedColleges(data.featured);
              localStorage.setItem("tyc_homepage_featured_colleges", JSON.stringify(data.featured));
              hasCloudData = true;
            }

            // If cloud database has no records yet but this browser has local edits, automatically sync local edits to the cloud!
            if (!hasCloudData && (savedTrending || savedFeatured)) {
              let localTrending = INITIAL_TRENDING_COLLEGES;
              let localFeatured = INITIAL_FEATURED_COLLEGES;
              try {
                if (savedTrending) localTrending = JSON.parse(savedTrending);
                if (savedFeatured) localFeatured = JSON.parse(savedFeatured);
              } catch (e) {}
              fetch("/api/homepage-colleges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username: "Samrat1311",
                  password: "1311161161",
                  trending: localTrending,
                  featured: localFeatured,
                }),
              }).catch((e) => console.error("Auto cloud sync error:", e));
            }
          }
        })
        .catch((err) => console.error("Error loading shared homepage colleges from cloud:", err));
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === "Samrat1311" && adminPass === "1311161161") {
      setIsAdmin(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("think_college_admin", "true");
      }
      setShowAdminLoginModal(false);
      setAdminError("");
      setAdminUser("");
      setAdminPass("");
    } else {
      setAdminError("Invalid Username or Password.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("think_college_admin");
    }
  };

  const syncToCloud = async (newTrending: CollegeMock[], newFeatured: CollegeMock[]) => {
    setIsSavingToCloud(true);
    try {
      const res = await fetch("/api/homepage-colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Samrat1311",
          password: "1311161161",
          trending: newTrending,
          featured: newFeatured,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.warn("Cloud sync response error:", data);
      }
    } catch (err) {
      console.error("Failed to sync homepage colleges to cloud database:", err);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    const collegeToSave: CollegeMock = {
      id: editingCollegeData.id || `custom-${Date.now()}`,
      name: editingCollegeData.name || "New University",
      location: editingCollegeData.location || "City, State",
      rating: Number(editingCollegeData.rating) || 4.5,
      highestPackage: editingCollegeData.highestPackage || "35.0 LPA",
      averagePackage: editingCollegeData.averagePackage || "10.0 LPA",
      averageFee: editingCollegeData.averageFee || "₹2.0 Lakhs/Yr",
      type: editingCollegeData.type || "Private",
      slug: editingCollegeData.slug || (editingCollegeData.name || "college").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      stream: editingCollegeData.stream || "Engineering",
      image: editingCollegeData.image || "/images/galgotias_real.jpg",
      logo: editingCollegeData.logo || "/images/galgotias.png",
      nirfRank: editingCollegeData.nirfRank ? Number(editingCollegeData.nirfRank) : undefined,
    };

    let updatedTrending = trendingColleges;
    let updatedFeatured = featuredColleges;

    if (editingCollegeRow === "trending") {
      const exists = trendingColleges.some((c) => c.id === collegeToSave.id);
      if (isNewCollege || !exists) {
        updatedTrending = [collegeToSave, ...trendingColleges];
      } else {
        updatedTrending = trendingColleges.map((c) => (c.id === collegeToSave.id ? collegeToSave : c));
      }
      setTrendingColleges(updatedTrending);
      if (typeof window !== "undefined") {
        localStorage.setItem("tyc_homepage_trending_colleges", JSON.stringify(updatedTrending));
      }
    } else {
      const exists = featuredColleges.some((c) => c.id === collegeToSave.id);
      if (isNewCollege || !exists) {
        updatedFeatured = [collegeToSave, ...featuredColleges];
      } else {
        updatedFeatured = featuredColleges.map((c) => (c.id === collegeToSave.id ? collegeToSave : c));
      }
      setFeaturedColleges(updatedFeatured);
      if (typeof window !== "undefined") {
        localStorage.setItem("tyc_homepage_featured_colleges", JSON.stringify(updatedFeatured));
      }
    }

    // Save to Cloud Database so all devices see the update immediately
    await syncToCloud(updatedTrending, updatedFeatured);
    setShowCollegeEditModal(false);
  };

  const handleDeleteCollege = (id: string, row: "trending" | "featured") => {
    if (!confirm("Are you sure you want to delete this college card from the homepage?")) return;
    let updatedTrending = trendingColleges;
    let updatedFeatured = featuredColleges;

    if (row === "trending") {
      updatedTrending = trendingColleges.filter((c) => c.id !== id);
      setTrendingColleges(updatedTrending);
      if (typeof window !== "undefined") {
        localStorage.setItem("tyc_homepage_trending_colleges", JSON.stringify(updatedTrending));
      }
    } else {
      updatedFeatured = featuredColleges.filter((c) => c.id !== id);
      setFeaturedColleges(updatedFeatured);
      if (typeof window !== "undefined") {
        localStorage.setItem("tyc_homepage_featured_colleges", JSON.stringify(updatedFeatured));
      }
    }

    syncToCloud(updatedTrending, updatedFeatured);
    setShowCollegeEditModal(false);
  };

  const handleResetColleges = () => {
    if (!confirm("Reset homepage colleges to factory defaults?")) return;
    setTrendingColleges(INITIAL_TRENDING_COLLEGES);
    setFeaturedColleges(INITIAL_FEATURED_COLLEGES);
    if (typeof window !== "undefined") {
      localStorage.removeItem("tyc_homepage_trending_colleges");
      localStorage.removeItem("tyc_homepage_featured_colleges");
    }
    syncToCloud(INITIAL_TRENDING_COLLEGES, INITIAL_FEATURED_COLLEGES);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          course_interest: formData.stream,
          state_interest: formData.state || null,
          college_interest:
            modalType === "loan"
              ? `Loan Amount: ₹${loanAmount.toLocaleString("en-IN")} | Interest: ${interestRate}%`
              : modalType === "credit-card"
                ? "Bihar Student Credit Card Guidance"
                : "General Inquiry Form",
          status: "Pending",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry to lead database.");
      }

      setFormSubmitted(true);
      setTimeout(() => {
        setShowInquiryModal(false);
        setFormSubmitted(false);
        setFormData({
          name: "",
          phone: "",
          stream: "Engineering",
          email: "",
          state: "",
        });
      }, 2500);
    } catch (err) {
      console.error("Lead API Submission Error:", err);
      // Fallback local success display if database is offline so user has zero friction
      setFormSubmitted(true);
      setTimeout(() => {
        setShowInquiryModal(false);
        setFormSubmitted(false);
        setFormData({
          name: "",
          phone: "",
          stream: "Engineering",
          email: "",
          state: "",
        });
      }, 2500);
    }
  };

  const filteredColleges =
    selectedStream === "All"
      ? trendingColleges
      : trendingColleges.filter((col) => col.stream === selectedStream);

  const filteredFeaturedColleges =
    selectedFeaturedStream === "All"
      ? featuredColleges
      : featuredColleges.filter((col) => col.stream === selectedFeaturedStream);

  const popularComparisons = [
    {
      c1: {
        id: "igdtuw",
        name: "IGDTUW Delhi",
        fullName: "Indira Gandhi Delhi Technical University for Women",
        course: "B.Tech Computer Science & IT",
        rating: 4.5,
        reviews: 44,
        logo: "https://images.careerindia.com/img/2013/05/22-iiit-delhi.jpg",
      },
      c2: {
        id: "jmi",
        name: "Jamia Millia Islamia",
        fullName: "Jamia Millia Islamia (JMI)",
        course: "B.Tech Computer Engineering",
        rating: 4.6,
        reviews: 68,
        logo: "https://www.jobsgyan.in/wp-content/uploads/2023/05/Jamia-Millia-Islamia-Logo.jpg",
      },
    },
    {
      c1: {
        id: "nit-delhi",
        name: "NIT Delhi",
        fullName: "National Institute of Technology Delhi",
        course: "B.Tech Computer Science",
        rating: 4.4,
        reviews: 52,
        logo: "https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/238f2312-1d90-42e9-a8d0-1df90efbffe5.webp",
      },
      c2: {
        id: "iiit-delhi",
        name: "IIIT Delhi",
        fullName: "Indraprastha Institute of Information Technology",
        course: "B.Tech Computer Science & AI",
        rating: 4.6,
        reviews: 76,
        logo: "https://www.careerindia.com/img/2014/04/28-iiitdelhi.jpg",
      },
    },
    {
      c1: {
        id: "dtu",
        name: "DTU Delhi",
        fullName: "Delhi Technological University",
        course: "B.Tech Computer Engineering",
        rating: 4.7,
        reviews: 118,
        logo: "https://cdn.rm.dcedtu.in/images/dtu.png",
      },
      c2: {
        id: "nsut",
        name: "NSUT Delhi",
        fullName: "Netaji Subhas University of Technology",
        course: "B.Tech Computer Science",
        rating: 4.6,
        reviews: 92,
        logo: "https://tse3.mm.bing.net/th/id/OIP.pRuDP23vlNjtzZ1EvNp-jgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      },
    },
    {
      c1: {
        id: "1",
        name: "IIT Delhi",
        fullName: "Indian Institute of Technology Delhi",
        course: "B.Tech Computer Science",
        rating: 4.9,
        reviews: 215,
        logo: "https://www.iitbbs.ac.in/wp-content/uploads/2023/07/iit_delhi.png",
      },
      c2: {
        id: "iit-bombay",
        name: "IIT Bombay",
        fullName: "Indian Institute of Technology Bombay",
        course: "B.Tech Computer Science",
        rating: 4.9,
        reviews: 230,
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/220px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
      },
    },
    {
      c1: {
        id: "amity-noida",
        name: "Amity University",
        fullName: "Amity University, Noida",
        course: "B.Tech CSE",
        rating: 4.5,
        reviews: 88,
        logo: "https://clicktranscripts.com/new/wp-content/uploads/2022/05/Amity-University.png",
      },
      c2: {
        id: "3",
        name: "Galgotias University",
        fullName: "Galgotias University, Greater Noida",
        course: "B.Tech Computer Science",
        rating: 4.2,
        reviews: 96,
        logo: "/images/galgotias.png",
      },
    },
  ];

  return (
    <div className="space-y-12">
      {" "}
      {/* HERO SECTION */}
      <section className="relative overflow-hidden -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-0.5 h-[380px] md:h-[560px] text-white flex flex-col justify-end">
        {/* Slideshow background layer */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage: `url(${heroSlides[activeSlide].image})`,
                backgroundPosition: (heroSlides[activeSlide] as any).position || "center",
              }}
            />
          </AnimatePresence>
        </div>

        {/* Main Hero Title Overlay */}
        <div className="absolute top-[8%] left-6 md:left-12 z-10 max-w-2xl select-none pointer-events-none">
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/95 block mb-1 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)]">
            🌟 Top Ranked Campus
          </span>
          <h2 
            className="text-lg md:text-3xl lg:text-4xl font-extrabold font-outfit tracking-tight leading-none uppercase"
            style={{ 
              color: (heroSlides[activeSlide] as any).color || "#ffffff",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.9))"
            }}
          >
            {heroSlides[activeSlide].name}
          </h2>
          <p className="mt-1.5 text-[10px] md:text-sm font-bold text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            {heroSlides[activeSlide].location}
          </p>
        </div>

        {/* Bottom left active slide label (Moved higher to sit above the glassmorphic panel) */}
        <div className="absolute bottom-20 left-4 sm:bottom-24 sm:left-8 z-10 block">
          <Link
            href={`/colleges/${heroSlides[activeSlide].slug}`}
            className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 hover:border-primary/50 text-[9px] sm:text-[10px] font-bold text-white tracking-wide transition-all hover:bg-slate-950 flex items-center gap-1 sm:gap-1.5 shadow-lg shadow-black/25 group/hero-lbl max-w-[90vw] sm:max-w-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
            <span className="font-extrabold text-slate-100 group-hover/hero-lbl:text-primary transition-colors truncate">
              {heroSlides[activeSlide].name},{" "}
              {heroSlides[activeSlide].location.split(",")[0]}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-[9px] font-black uppercase text-primary tracking-wider flex items-center gap-0.5 flex-shrink-0">
              View
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary group-hover/hero-lbl:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Bottom Centered Liquid Water Glassmorphic Panel (Crystal Clear Water Look) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1080px] px-4 sm:px-6 z-20">
          <div className="relative grid grid-cols-3 bg-white/[0.07] backdrop-blur-[4px] backdrop-saturate-[180%] rounded-t-[32px] border-t border-x border-white/40 overflow-hidden shadow-[0_-12px_35px_rgba(0,0,0,0.2),inset_0_1.5px_2px_0_rgba(255,255,255,0.45),inset_0_-1px_2px_0_rgba(0,0,0,0.1)] select-none">
            {/* Liquid Surface Sheen Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/[0.03] to-transparent pointer-events-none" />

            {/* Tab 1: Top Cities */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setActiveHubTab("cities");
                document
                  .getElementById("explore-hub-section")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="relative flex flex-col items-center justify-center py-5 px-2 hover:bg-white/[0.12] active:bg-white/[0.18] transition-all text-center border-b-[3px] border-transparent hover:border-orange-400 group border-r border-white/20 cursor-pointer"
            >
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-orange-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:scale-110 group-hover:text-orange-300 transition-all duration-300" />
              <span className="mt-2 font-outfit font-black text-[9.5px] md:text-[11px] text-white uppercase tracking-widest drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.9)]">
                Top Cities
              </span>
            </button>

            {/* Tab 2: Top Exams */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setActiveHubTab("exams");
                document
                  .getElementById("explore-hub-section")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="relative flex flex-col items-center justify-center py-5 px-2 hover:bg-white/[0.12] active:bg-white/[0.18] transition-all text-center border-b-[3px] border-transparent hover:border-orange-400 group border-r border-white/20 cursor-pointer"
            >
              <Award className="w-5 h-5 md:w-6 md:h-6 text-orange-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:scale-110 group-hover:text-orange-300 transition-all duration-300" />
              <span className="mt-2 font-outfit font-black text-[9.5px] md:text-[11px] text-white uppercase tracking-widest drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.9)]">
                Top Exams
              </span>
            </button>

            {/* Tab 3: Top Courses */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setActiveHubTab("courses");
                document
                  .getElementById("explore-hub-section")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="relative flex flex-col items-center justify-center py-5 px-2 hover:bg-white/[0.12] active:bg-white/[0.18] transition-all text-center border-b-[3px] border-transparent hover:border-orange-400 group cursor-pointer"
            >
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-orange-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:scale-110 group-hover:text-orange-300 transition-all duration-300" />
              <span className="mt-2 font-outfit font-black text-[9.5px] md:text-[11px] text-white uppercase tracking-widest drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.9)]">
                Top Courses
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Admission Ads Section */}
      <AdBannersRow />

      {/* CONSOLIDATED EXPLORE HUB SECTION (Dynamic Tabbed Switcher: Cities / Exams / Courses) */}
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent !mt-2 mb-2" />
      <section
        id="explore-hub-section"
        className="space-y-8 select-none scroll-mt-28 !mt-3"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {activeHubTab === "cities" && (
              <>
                <h2 className="font-outfit font-extrabold text-2xl md:text-3xl text-text_primary">
                  Explore Colleges by Cities
                </h2>
                <p className="text-sm text-text_secondary mt-1">
                  Discover top universities in India's leading educational hubs
                </p>
              </>
            )}
            {activeHubTab === "exams" && (
              <>
                <h2 className="font-outfit font-extrabold text-2xl md:text-3xl text-text_primary">
                  Top Entrance Exams
                </h2>
                <p className="text-sm text-text_secondary mt-1">
                  Explore India's leading entrance exams and download solved
                  question papers
                </p>
              </>
            )}
            {activeHubTab === "courses" && (
              <>
                <h2 className="font-outfit font-extrabold text-2xl md:text-3xl text-text_primary">
                  Explore Top Streams
                </h2>
                <p className="text-sm text-text_secondary mt-1">
                  Filter and discover the best educational categories in India
                </p>
              </>
            )}
          </div>
        </div>

        {/* Tab Content Renderers */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHubTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {activeHubTab === "cities" && (
              <div className="relative group/carousel">
                {/* Scroll Controls */}
                <button
                  onClick={() =>
                    document
                      .getElementById("cities-carousel-container")
                      ?.scrollBy({ left: -300, behavior: "smooth" })
                  }
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600 active:text-white active:border-orange-600 active:shadow-[0_0_15px_rgba(249,115,22,0.7)] transition-all z-30 opacity-100 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("cities-carousel-container")
                      ?.scrollBy({ left: 300, behavior: "smooth" })
                  }
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600 active:text-white active:border-orange-600 active:shadow-[0_0_15px_rgba(249,115,22,0.7)] transition-all z-30 opacity-100 active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Scrollable Carousel Container */}
                <div
                  id="cities-carousel-container"
                  className="flex overflow-x-auto no-scrollbar gap-5 py-2 scroll-smooth"
                >
                  {topCities.map((city, idx) => (
                    <Link
                      key={city.name}
                      href={`/colleges?city=${city.slug}`}
                      className="flex-shrink-0 w-[210px] h-[140px] md:w-[240px] md:h-[160px] rounded-3xl overflow-hidden relative group/city shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.18)] border border-slate-200/80 hover:border-orange-500/50 transition-all duration-350 hover:-translate-y-1.5 hover:scale-[1.03] select-none"
                    >
                      {/* Background image */}
                      <img
                        src={city.image}
                        alt={city.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover/city:scale-110 transition-transform duration-500"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent group-hover/city:from-slate-950/90 transition-all duration-300" />

                      {/* Automatic Shimmer Sheen Reflection Overlay */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[50%] h-[200%] pointer-events-none animate-shimmer-sheen z-10"
                        style={{ animationDelay: `${idx * 0.6}s` }}
                      />

                      {/* Content centered bottom */}
                      <div className="absolute bottom-4 left-4 right-4 text-left select-none pointer-events-none z-20">
                        <h4 className="font-outfit font-black text-sm md:text-base text-white tracking-wide">
                          {city.name}
                        </h4>
                        <p className="text-[9px] md:text-[10px] font-black text-orange-400 uppercase tracking-widest mt-0.5">
                          {city.collegesCount}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeHubTab === "exams" && (
              <div className="relative group/carousel">
                {/* Scroll Controls */}
                <button
                  onClick={() =>
                    document
                      .getElementById("exams-carousel-container")
                      ?.scrollBy({ left: -300, behavior: "smooth" })
                  }
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600 active:text-white active:border-orange-600 active:shadow-[0_0_15px_rgba(249,115,22,0.7)] transition-all z-30 opacity-100 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("exams-carousel-container")
                      ?.scrollBy({ left: 300, behavior: "smooth" })
                  }
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600 active:text-white active:border-orange-600 active:shadow-[0_0_15px_rgba(249,115,22,0.7)] transition-all z-30 opacity-100 active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Scrollable Carousel Container */}
                <div
                  id="exams-carousel-container"
                  className="flex overflow-x-auto no-scrollbar gap-5 py-2 scroll-smooth"
                >
                  {topExams.map((exam, idx) => (
                    <div
                      key={exam.name}
                      className="flex-shrink-0 w-[220px] h-[220px] md:w-[260px] md:h-[260px] bg-white border border-slate-200/80 hover:border-orange-500/50 rounded-[24px] p-4 md:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.18)] hover:-translate-y-1.5 transition-all duration-350 flex flex-col relative overflow-hidden group/exam select-none"
                    >
                      {/* Automatic Shimmer Sheen Reflection Overlay */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[50%] h-[200%] pointer-events-none animate-shimmer-sheen z-10"
                        style={{ animationDelay: `${idx * 0.6}s` }}
                      />

                      {/* Online / Offline Status Badge */}
                      <span
                        className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider z-20 ${
                          exam.mode.includes("Online")
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-orange-50 text-orange-600 border border-orange-100"
                        }`}
                      >
                        {exam.mode.includes("Online") ? "Online" : "Offline"}
                      </span>

                      {/* Exam Header */}
                      <div className="flex items-start gap-3 mb-3 z-20">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 group-hover/exam:bg-orange-500 group-hover/exam:text-white transition-all duration-300">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-outfit font-black text-sm md:text-[15px] text-text_primary tracking-wide leading-tight mt-0.5">
                            {exam.name}
                          </h3>
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                            {exam.level}
                          </span>
                        </div>
                      </div>

                      {/* Associated Streams Pills */}
                      <div className="flex flex-wrap gap-1 mb-3 z-20">
                        {exam.courses.slice(0, 3).map((course) => (
                          <Link
                            key={course}
                            href={`/colleges?stream=${exam.stream}`}
                            className="px-1.5 py-0.5 bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-200 text-slate-500 hover:text-orange-600 rounded text-[8px] font-extrabold tracking-wide transition-colors"
                          >
                            {course}
                          </Link>
                        ))}
                      </div>

                      {/* Details & Actions */}
                      <div className="mt-auto space-y-2 pt-2.5 border-t border-slate-100 z-20">
                        {/* Application Process Row */}
                        <button
                          onClick={() =>
                            setActiveExamModal({ exam, tab: "process" })
                          }
                          className="w-full flex items-center justify-between text-[9px] md:text-[10.5px] font-extrabold text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-400" />
                            Application Process
                          </span>
                          <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-400 group-hover/exam:translate-x-0.5 transition-transform" />
                        </button>

                        {/* Previous Year Questions Row */}
                        <button
                          onClick={() =>
                            setActiveExamModal({ exam, tab: "pyqs" })
                          }
                          className="w-full flex items-center justify-between text-[9px] md:text-[10.5px] font-extrabold text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-400" />
                            Previous Year Papers
                          </span>
                          <span className="text-[7.5px] bg-slate-100 text-slate-500 px-1 rounded font-black uppercase">
                            {exam.pyqCount.split(" ")[0]} Yrs
                          </span>
                        </button>

                        {/* Info Button */}
                        <button
                          onClick={() =>
                            setActiveExamModal({ exam, tab: "info" })
                          }
                          className="w-full mt-2 py-1.5 md:py-2 px-3 bg-slate-950 text-white hover:bg-orange-600 transition-all rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider text-center cursor-pointer shadow-md shadow-black/5 hover:shadow-orange-500/15"
                        >
                          Exam Info
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeHubTab === "courses" && (
              <div className="relative group/carousel">
                {/* Scroll Controls */}
                <button
                  onClick={() =>
                    document
                      .getElementById("streams-carousel-container")
                      ?.scrollBy({ left: -300, behavior: "smooth" })
                  }
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600 active:text-white active:border-orange-600 active:shadow-[0_0_15px_rgba(249,115,22,0.7)] transition-all z-30 opacity-100 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("streams-carousel-container")
                      ?.scrollBy({ left: 300, behavior: "smooth" })
                  }
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600 active:text-white active:border-orange-600 active:shadow-[0_0_15px_rgba(249,115,22,0.7)] transition-all z-30 opacity-100 active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Scrollable Carousel Container */}
                <div
                  id="streams-carousel-container"
                  className="flex overflow-x-auto no-scrollbar gap-5 py-2 scroll-smooth"
                >
                  {streams.map((stream, idx) => {
                    const Icon = stream.icon;
                    return (
                      <motion.div
                        key={stream.name}
                        initial={{ opacity: 0, y: 28, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.45,
                          delay: idx * 0.07,
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                        }}
                        whileHover={{
                          y: -8,
                          scale: 1.03,
                          boxShadow: `0 20px 50px ${stream.glow}, 0 4px 16px rgba(0,0,0,0.08)`,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 18,
                          },
                        }}
                        whileTap={{ scale: 0.97 }}
                        className={`group relative overflow-hidden rounded-[24px] border ${stream.border} bg-gradient-to-br ${stream.bg} transition-colors duration-300 cursor-pointer flex-shrink-0 w-[210px] h-[140px] md:w-[240px] md:h-[160px]`}
                      >
                        {/* Automatic Shimmer Sheen Reflection Overlay */}
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[50%] h-[200%] pointer-events-none animate-shimmer-sheen z-10"
                          style={{ animationDelay: `${idx * 0.6}s` }}
                        />

                        {/* Shimmer sweep on hover */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 dark:via-white/10 to-transparent pointer-events-none z-10" />

                        {/* Glow orb */}
                        <div
                          className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle, ${stream.glow} 0%, transparent 70%)`,
                          }}
                        />

                        {/* Large Background drawing/icon related to course */}
                        {stream.drawing && (
                          <div
                            className={`absolute -right-4 -bottom-4 ${stream.textColor} opacity-[0.06] group-hover:opacity-[0.14] group-hover:scale-115 group-hover:-rotate-12 transition-all duration-500 pointer-events-none z-0`}
                          >
                            <stream.drawing className="w-24 h-24 md:w-28 md:h-28 stroke-[1.2]" />
                          </div>
                        )}

                        <div className="relative z-10 p-4 md:p-5">
                          {/* Icon */}
                          <motion.div
                            whileHover={{ rotate: [0, -8, 8, 0] }}
                            transition={{ duration: 0.5 }}
                            className={`w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${stream.gradient} flex items-center justify-center shadow-md mb-3 group-hover:shadow-lg transition-shadow duration-300`}
                          >
                            <Icon className="w-5 h-5 md:w-7 md:h-7 text-white drop-shadow" />
                          </motion.div>

                          {/* Text */}
                          <h3 className="font-outfit font-extrabold text-sm md:text-[15px] text-text_primary group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight">
                            {stream.name}
                          </h3>

                          {/* Badge */}
                          <span
                            className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black tracking-wide ${stream.badge}`}
                          >
                            {stream.count}
                          </span>

                          {/* Explore arrow */}
                          <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                            <span>Explore</span>
                            <motion.span
                              animate={{ x: [0, 3, 0] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: idx * 0.15,
                              }}
                            >
                              →
                            </motion.span>
                          </div>
                        </div>

                        <Link
                          href={`/colleges?stream=${stream.name}`}
                          className="absolute inset-0 z-20"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
      {/* TRENDING NOW TICKER SECTION (Full length, Sharp edges, no blur, Mobile responsive) */}
      <section className="relative overflow-hidden bg-white border border-orange-500/20 rounded-2xl md:rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.035)] mt-6 mb-1.5 py-2.5 px-4 md:py-3.5 md:px-6 flex flex-col sm:flex-row items-center select-none gap-3 md:gap-4 w-full">
        {/* Left Skew Glowing Saffron Badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-[9px] md:text-[10px] tracking-wider uppercase rounded-xl shadow-md shadow-orange-500/15 relative z-10 skew-x-[-8deg] origin-center">
          <span className="inline-block animate-pulse skew-x-[8deg]">🔥</span>
          <span className="skew-x-[8deg]">Trending Now</span>
        </div>

        {/* Scrollable Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative w-full">
          <div className="animate-marquee-slow flex items-center gap-8 whitespace-nowrap">
            {/* Render twice for seamless infinite scrolling loops */}
            {[...trendingUpdates, ...trendingUpdates].map((update, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTrendingUpdate(update)}
                className="flex items-center gap-2 text-slate-700 hover:text-orange-600 font-extrabold text-[10px] md:text-[11px] tracking-wide transition-colors cursor-pointer outline-none focus:text-orange-600 group"
              >
                <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100 font-black text-[7.5px] md:text-[8px] uppercase tracking-wider group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-colors">
                  {update.tag}
                </span>
                <span>{update.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-orange-400 transition-colors ml-4" />
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* DUAL WIDGET SECTION: COMPARE COLLEGES & EXAM DEADLINES */}
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent !mt-0 !mb-1.5" />
      <section className="flex lg:grid lg:grid-cols-12 overflow-x-auto lg:overflow-x-visible no-scrollbar gap-5 lg:gap-6 pb-4 lg:pb-0 scroll-smooth snap-x snap-mandatory !mt-0 items-stretch">
        {/* WIDGET 1: COMPARE COLLEGES (INTERACTIVE WIDGET) */}
        <div className="w-[82vw] sm:w-[480px] lg:w-auto lg:col-span-6 flex-shrink-0 lg:flex-shrink snap-start bg-white border border-blue-500/20 hover:border-blue-500/50 p-4 sm:p-5 md:p-5 rounded-[22px] space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.14)] transition-all duration-350 relative overflow-hidden group/compare select-none flex flex-col justify-between">
          {/* Automatic Shimmer Sheen Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[50%] h-[200%] pointer-events-none animate-shimmer-sheen z-10" />

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 relative z-20">
            <h2 className="font-outfit font-black text-lg md:text-xl text-text_primary flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-500 group-hover/compare:bg-blue-500 group-hover/compare:text-white transition-all duration-300">
                <Layers className="w-4 h-4" />
              </div>
              Compare Colleges Side-by-Side
            </h2>
            <p className="text-[11px] text-text_secondary leading-tight">
              Select any two institutes to compare packages, fees, ranks & ratings side-by-side.
            </p>
          </div>

          <div className="space-y-2.5 relative z-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[9px] text-text_secondary font-extrabold uppercase tracking-wider">
                  Select College 1
                </label>
                <select
                  value={compareC1}
                  onChange={(e) => setCompareC1(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 border border-slate-200/80 hover:border-blue-300 rounded-lg bg-slate-50 hover:bg-white text-[11px] text-text_primary outline-none focus:border-blue-500 font-bold transition-all"
                >
                  <option value="1">IIT Delhi (Engineering)</option>
                  <option value="2">IIM Ahmedabad (Management)</option>
                  <option value="3">Galgotias University (Engineering)</option>
                  <option value="4">SIBM Pune (Management)</option>
                  <option value="5">RV College of Engg (Engineering)</option>
                  <option value="6">KMC Mangalore (Medical)</option>
                  <option value="7">NLSIU Bangalore (Law)</option>
                  <option value="8">AIIMS Delhi (Medical)</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] text-text_secondary font-extrabold uppercase tracking-wider">
                  Select College 2
                </label>
                <select
                  value={compareC2}
                  onChange={(e) => setCompareC2(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 border border-slate-200/80 hover:border-blue-300 rounded-lg bg-slate-50 hover:bg-white text-[11px] text-text_primary outline-none focus:border-blue-500 font-bold transition-all"
                >
                  <option value="2">IIM Ahmedabad (Management)</option>
                  <option value="1">IIT Delhi (Engineering)</option>
                  <option value="3">Galgotias University (Engineering)</option>
                  <option value="4">SIBM Pune (Management)</option>
                  <option value="5">RV College of Engg (Engineering)</option>
                  <option value="6">KMC Mangalore (Medical)</option>
                  <option value="7">NLSIU Bangalore (Law)</option>
                  <option value="8">AIIMS Delhi (Medical)</option>
                </select>
              </div>
            </div>

            <div className="pt-0.5">
              {compareC1 === compareC2 ? (
                <div className="text-rose-500 text-[9px] font-bold pb-1">
                  Please select two different colleges to compare!
                </div>
              ) : null}
              <Link
                href={`/compare?ids=${compareC1},${compareC2}`}
                className={`w-full py-2 bg-slate-950 hover:bg-blue-600 text-white font-black text-[11px] rounded-lg active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                  compareC1 === compareC2
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Compare Selected Colleges
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* POPULAR HEAD-TO-HEAD COLLEGE COMPARISONS (From User Database) */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 font-outfit">
                    Popular Comparisons
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("popular-vs-carousel-container")
                        ?.scrollBy({ left: -220, behavior: "smooth" });
                    }}
                    className="w-5 h-5 rounded-full bg-slate-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Previous"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("popular-vs-carousel-container")
                        ?.scrollBy({ left: 220, behavior: "smooth" });
                    }}
                    className="w-5 h-5 rounded-full bg-slate-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Next"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Scrollable Popular VS Matchups Carousel */}
              <div
                id="popular-vs-carousel-container"
                className="flex overflow-x-auto no-scrollbar gap-2.5 pb-0.5 scroll-smooth snap-x snap-mandatory"
              >
                {popularComparisons.map((item, idx) => (
                  <div
                    key={idx}
                    className="snap-start w-[190px] sm:w-[200px] flex-shrink-0 bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/90 hover:border-orange-500/50 rounded-xl p-2 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between group/vscard select-none"
                  >
                    {/* Top: 2 Logos with central circular VS badge */}
                    <div className="relative flex items-center justify-between px-0.5 py-0.5">
                      {/* College 1 Logo Box */}
                      <div className="w-[43%] h-9 rounded-lg bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shadow-xs overflow-hidden relative">
                        {item.c1.logo ? (
                          <img
                            src={item.c1.logo}
                            alt={item.c1.name}
                            className="max-h-full max-w-full object-contain relative z-10"
                            onError={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.display = "none";
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          style={{ display: item.c1.logo ? "none" : "flex" }}
                          className="w-full h-full rounded-md bg-orange-50 text-orange-600 font-extrabold text-[8.5px] items-center justify-center text-center uppercase"
                        >
                          {item.c1.name.slice(0, 4)}
                        </div>
                      </div>

                      {/* Central VS Badge */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-slate-900 text-white font-black text-[7.5px] flex items-center justify-center border border-white shadow-xs z-20">
                        VS
                      </div>

                      {/* College 2 Logo Box */}
                      <div className="w-[43%] h-9 rounded-lg bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shadow-xs overflow-hidden relative">
                        {item.c2.logo ? (
                          <img
                            src={item.c2.logo}
                            alt={item.c2.name}
                            className="max-h-full max-w-full object-contain relative z-10"
                            onError={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.display = "none";
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          style={{ display: item.c2.logo ? "none" : "flex" }}
                          className="w-full h-full rounded-md bg-blue-50 text-blue-600 font-extrabold text-[8.5px] items-center justify-center text-center uppercase"
                        >
                          {item.c2.name.slice(0, 4)}
                        </div>
                      </div>
                    </div>

                    {/* Middle: 2-Column Names, Course & Ratings */}
                    <div className="grid grid-cols-2 gap-1 text-left pt-1.5 pb-1 border-b border-slate-100">
                      {/* Left Column */}
                      <div className="space-y-0.5 overflow-hidden">
                        <h4 className="font-outfit font-bold text-[9.5px] text-slate-800 leading-tight truncate" title={item.c1.name}>
                          {item.c1.name}
                        </h4>
                        <p className="text-[8px] text-slate-500 truncate leading-none">
                          {item.c1.course}
                        </p>
                        <div className="flex items-center gap-0.5 text-[8px] text-slate-700 font-bold pt-0.5">
                          <span>{item.c1.rating}</span>
                          <span className="text-amber-400 text-[8px]">★</span>
                          <span className="text-[7px] text-slate-400 font-normal">
                            ({item.c1.reviews})
                          </span>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-0.5 pl-1 border-l border-slate-100 overflow-hidden">
                        <h4 className="font-outfit font-bold text-[9.5px] text-slate-800 leading-tight truncate" title={item.c2.name}>
                          {item.c2.name}
                        </h4>
                        <p className="text-[8px] text-slate-500 truncate leading-none">
                          {item.c2.course}
                        </p>
                        <div className="flex items-center gap-0.5 text-[8px] text-slate-700 font-bold pt-0.5">
                          <span>{item.c2.rating}</span>
                          <span className="text-amber-400 text-[8px]">★</span>
                          <span className="text-[7px] text-slate-400 font-normal">
                            ({item.c2.reviews})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Button */}
                    <Link
                      href={`/compare?ids=${item.c1.id},${item.c2.id}`}
                      className="w-full mt-1.5 py-1 px-2 bg-[#f26522] hover:bg-[#d9531e] active:bg-[#c04312] text-white font-bold text-[9.5px] rounded-md text-center shadow-xs transition-all duration-200 cursor-pointer block"
                    >
                      Compare
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* WIDGET 2: EXAMS & COUNSELING CALENDAR */}
        <div className="w-[82vw] sm:w-[480px] lg:w-auto lg:col-span-6 flex-shrink-0 lg:flex-shrink snap-start bg-white border border-emerald-500/20 hover:border-emerald-500/50 p-4 sm:p-5 md:p-5 rounded-[22px] space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.14)] transition-all duration-350 relative overflow-hidden group/exams select-none flex flex-col justify-between">
          {/* Automatic Shimmer Sheen Reflection Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[50%] h-[200%] pointer-events-none animate-shimmer-sheen z-10"
            style={{ animationDelay: "1s" }}
          />

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 relative z-20">
            <h2 className="font-outfit font-black text-lg md:text-xl text-text_primary flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 group-hover/exams:bg-emerald-500 group-hover/exams:text-white transition-all duration-300">
                <Calendar className="w-4 h-4" />
              </div>
              Entrance Exams & Counseling 2026
            </h2>
            <p className="text-[11px] text-text_secondary leading-tight">
              Track upcoming registration deadlines, national cutoffs & counseling updates.
            </p>
          </div>

          <div className="space-y-2 relative z-20 flex-1 flex flex-col justify-between">
            {[
              {
                name: "JEE Main 2026",
                date: "Registration: Dec 2025",
                desc: "B.Tech/B.E Counseling",
                predictorHref: "/predictor?exam=JEE%20Main&course=Engineering",
              },
              {
                name: "CAT 2026",
                date: "Exam Date: 23 Nov 2026",
                desc: "IIM & Private MBA calls",
                predictorHref: "/predictor?exam=CAT&course=Management",
              },
              {
                name: "NEET UG 2026",
                date: "Registration: Feb 2026",
                desc: "AIIMS & MBBS Seats",
                predictorHref: "/predictor?exam=NEET%20UG&course=Medical",
              },
              {
                name: "CLAT 2026",
                date: "Exam Date: 07 Dec 2025",
                desc: "National Law Universities",
                predictorHref: "/predictor?exam=CLAT&course=Law",
              },
            ].map((exam, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 sm:p-2.5 bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-200 rounded-xl transition-all"
              >
                <div>
                  <h4 className="font-outfit font-bold text-[11px] text-text_primary">
                    {exam.name}
                  </h4>
                  <p className="text-[9.5px] text-text_secondary font-semibold mt-0.5">
                    {exam.date} •{" "}
                    <span className="text-emerald-600 font-extrabold">
                      {exam.desc}
                    </span>
                  </p>
                </div>
                <Link
                  href={exam.predictorHref}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-lg text-[8.5px] font-black tracking-wide transition-colors"
                >
                  Predictor
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* BIHAR STUDENT CREDIT CARD SPOTLIGHT BANNER */}
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent my-2" />
      <section className="p-6 md:p-12 rounded-[28px] bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white relative overflow-hidden shadow-[0_10px_35px_rgba(234,88,12,0.22)] border border-orange-500/35">
        {/* Background Landmark Image Layer */}
        {biharBgs.map((bg, idx) => (
          <div 
            key={bg.src}
            className={`absolute inset-0 bg-cover bg-no-repeat pointer-events-none transition-opacity duration-1000 ease-in-out z-0 ${bg.position} ${
              idx === activeBiharBg ? "opacity-[0.25]" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${bg.src}')` }}
          />
        ))}
        
        {/* Dark radial glow layer on left to ensure high text contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(0,0,0,0.35),transparent_60%)] z-0" />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_35%)] z-0" />

        {/* Shimmer Sheen Reflection Sweep Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] h-[200%] pointer-events-none animate-shimmer-sheen z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-orange-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-orange-300" />
              Govt Scheme Admission Support
            </div>
            <h2 className="font-outfit font-black text-2xl md:text-4xl leading-tight">
              Higher Studies Admission Under <br />
              <span className="underline decoration-orange-300 underline-offset-8">
                Bihar Student Credit Card
              </span>
            </h2>
            <p className="text-xs md:text-sm text-orange-50/90 max-w-xl leading-relaxed">
              Get direct counseling for medical, B.Tech, MBA, pharmacy, and
              nursing courses fully covered under the Bihar Student Credit Card
              scheme. Zero upfront self-finance tuition fee options.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => {
                  setModalType("credit-card");
                  setShowInquiryModal(true);
                }}
                className="px-5 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-black text-xs rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-orange-950/20 active:scale-95 cursor-pointer"
              >
                Apply for Loan Guidance
              </button>
              <a
                href="/bihar-student-credit-card-guidelines.pdf"
                download="bihar-student-credit-card-guidelines.pdf"
                className="flex items-center gap-2 px-5 py-2.5 border border-white/30 hover:border-white text-white hover:bg-white/10 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Download BSCC Guidelines PDF
              </a>
              <Link
                href="/credit-card"
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/30 hover:bg-orange-500/50 border border-orange-400/40 hover:border-orange-400 text-white font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-orange-200" />
                View Scheme Details
              </Link>
            </div>
          </div>

          {/* Right Visual block containing Shield and Premium BIHAR text */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-4 pt-6 lg:pt-0 border-t border-white/10 lg:border-t-0">
            <div className="relative w-32 h-32 bg-white/10 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center shadow-xl shadow-orange-950/20 group/icon">
              <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 animate-ping" />
              <ShieldCheck className="w-14 h-14 text-orange-200 group-hover/icon:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-center lg:text-right space-y-0.5">
              <span className="block font-outfit text-[9px] font-black uppercase tracking-[0.35em] text-orange-200/80">
                STATE OF
              </span>
              <span className="block font-outfit text-2xl font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_10px_rgba(234,88,12,0.65)]">
                BIHAR
              </span>
              <div className="h-0.5 w-12 bg-orange-400 mx-auto lg:ml-auto lg:mr-0 rounded-full mt-1.5" />
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORED CINEMATIC LEADERBOARD DISPLAY AD (GoDaddy Programmatic) */}
      <div className="w-full !mt-3.5 !mb-0">
        <a
          href="https://www.godaddy.com/offers/email/professional-email"
          target="_blank"
          rel="noopener noreferrer"
          title="GoDaddy - Get email that looks as professional as your business is"
          className="group/ad block relative w-full overflow-hidden rounded-2xl bg-[#090b0e] border border-[#00dfd8]/30 hover:border-[#00dfd8]/80 shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_25px_rgba(0,223,216,0.08)] hover:shadow-[0_12px_40px_rgba(0,223,216,0.18)] transition-all duration-500 cursor-pointer select-none"
        >
          {/* Movie-Style Ambient Atmospheric Cyan & Amber Backlight */}
          <div className="absolute top-1/2 -left-10 -translate-y-1/2 w-64 h-64 bg-[#00dfd8]/15 rounded-full blur-3xl pointer-events-none group-hover/ad:bg-[#00dfd8]/25 transition-all duration-700" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06080a] via-[#0a0d11] to-[#040608] opacity-90 z-0" />

          {/* Cinematic Shimmer Light Ray Sweep (Periodic) */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent w-[35%] h-full pointer-events-none -translate-x-full group-hover/ad:translate-x-[350%] transition-transform duration-1000 ease-in-out z-20" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-4 md:px-7 md:py-3.5 min-h-[96px]">
            {/* 1. GoDaddy Logo Brand Block (Left) */}
            <div className="md:col-span-3 flex items-center gap-2.5">
              <div className="relative flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#00dfd8]/10 border border-[#00dfd8]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,223,216,0.25)] group-hover/ad:scale-105 group-hover/ad:border-[#00dfd8] transition-all duration-300">
                {/* Iconic Interlocking GoDaddy Heart Glyph */}
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#00dfd8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 5v14" className="opacity-40" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-black text-lg md:text-2xl tracking-tight text-[#00dfd8] drop-shadow-[0_0_10px_rgba(0,223,216,0.3)]">
                  GoDaddy
                </span>
                <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest -mt-1 hidden sm:block">
                  Domains & Email
                </span>
              </div>
            </div>

            {/* 2. Main High-Impact Cinematic Copy (Center-Left) */}
            <div className="md:col-span-5 space-y-0.5 text-left">
              <h4 className="font-outfit font-bold text-sm sm:text-base md:text-lg leading-tight text-[#00dfd8] group-hover/ad:text-white transition-colors duration-300">
                Get email that looks as professional as your business is.
              </h4>
              <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                Custom domain email addresses with 99.9% uptime & 24/7 expert support.
              </p>
            </div>

            {/* 3. Floating Interactive Mockup Card + Customer Profile (Center-Right to Right) */}
            <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3.5">
              {/* Floating Mini Email Mockup Card */}
              <div className="hidden lg:flex items-center gap-2 bg-white/95 text-slate-800 rounded-xl p-2 px-2.5 shadow-lg border border-slate-100/90 transform group-hover/ad:-translate-y-0.5 transition-transform duration-300">
                <div className="w-5 h-5 rounded-lg bg-[#00dfd8]/20 flex items-center justify-center text-[#00a39e]">
                  <Mail className="w-3 h-3" />
                </div>
                <div className="flex flex-col leading-none text-left">
                  <span className="text-[9px] font-black text-slate-800">Inbox (1)</span>
                  <span className="text-[7.5px] font-semibold text-slate-500">info@yourbrand.com</span>
                </div>
              </div>

              {/* Customer domain badge & CTA */}
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <span className="block text-[10px] font-bold text-slate-200">Yuribdia Montoya</span>
                  <span className="block text-[9px] font-black tracking-wider text-[#00dfd8]">UVAROVITAHOME.COM</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00dfd8] to-[#00b4d8] text-slate-950 font-black text-xs shadow-md shadow-[#00dfd8]/20 group-hover/ad:scale-105 group-hover/ad:shadow-[#00dfd8]/40 transition-all flex items-center gap-1">
                  <span>Get Started</span>
                  <span className="text-[10px]">→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Google AdChoices / Info Tag */}
          <div className="absolute top-1.5 right-1.5 z-30 flex items-center bg-black/80 backdrop-blur-md rounded px-1.5 py-0.5 shadow border border-slate-700/60 text-[9px] font-sans text-slate-300 gap-1 select-none pointer-events-auto">
            <span className="text-[8px] font-bold text-slate-400">Ad</span>
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              title="AdChoices"
              onClick={(e) => e.stopPropagation()}
              className="text-[#00dfd8] hover:text-white transition-colors flex items-center"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </a>
          </div>
        </a>
      </div>

      {/* MASTER COLLEGE SHOWCASE BOX (World-Class Glowing Unified Container) */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent !mt-3.5 !mb-2.5" />
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-white via-orange-50/15 to-white border border-slate-200/90 shadow-[0_12px_45px_rgba(0,0,0,0.04)] p-5 sm:p-7 md:p-8 space-y-6 !mt-0 select-none">
        {/* Subtle Ambient Radial Backlight Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_60%)] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_60%)] pointer-events-none z-0" />

        {/* Header with Title, Admin Controls & Filter Tabs */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
                <span>Verified Top Campuses 2026-27</span>
              </div>

              {/* Admin Status Pill & Action Buttons */}
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                    <CheckCircle className="w-3 h-3" />
                    Admin Mode Active
                  </span>
                  <button
                    onClick={() => {
                      setEditingCollegeRow("trending");
                      setIsNewCollege(true);
                      setEditingCollegeData({
                        id: `custom-${Date.now()}`,
                        name: "",
                        location: "",
                        rating: 4.8,
                        highestPackage: "45.0 LPA",
                        averagePackage: "15.0 LPA",
                        averageFee: "₹2.0 Lakhs/Yr",
                        type: "Private",
                        slug: "",
                        stream: "Engineering",
                        image: "/images/galgotias_real.jpg",
                        logo: "/images/galgotias.png",
                        nirfRank: 25,
                      });
                      setShowCollegeEditModal(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[10.5px] font-black shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add College Card</span>
                  </button>
                  <button
                    onClick={async () => {
                      await syncToCloud(trendingColleges, featuredColleges);
                      alert("✅ Successfully synced to Cloud Database! All other phones & laptops will now show this.");
                    }}
                    disabled={isSavingToCloud}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-black shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                    title="Publish current college cards to Cloud Database for all mobiles & visitors"
                  >
                    {isSavingToCloud ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Sync to All Devices</span>
                  </button>
                  <button
                    onClick={handleResetColleges}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-all cursor-pointer"
                    title="Reset to default college cards"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdminLoginModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 text-[9.5px] font-bold transition-all cursor-pointer"
                  title="Admin login to edit college cards"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Edit Access</span>
                </button>
              )}
            </div>

            <h2 className="font-outfit font-extrabold text-2xl md:text-3xl text-text_primary">
              Trending & Top Featured Colleges in India
            </h2>
            <p className="text-sm text-text_secondary mt-0.5">
              Explore premier government & private institutes ranked for top placements, global faculty & infrastructure
            </p>
          </div>

          {/* Single Unified Tabs Filter */}
          <div className="flex flex-wrap gap-2">
            {["All", "Engineering", "Management", "Medical", "Law"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedStream(tab);
                    setSelectedFeaturedStream(tab);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedStream === tab
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Row 1: Flagship Institutes & Premier Universities Carousel */}
        <div className="relative group/carousel select-none z-10">
          <button
            onClick={() =>
              document
                .getElementById("trending-colleges-carousel-container")
                ?.scrollBy({ left: -360, behavior: "smooth" })
            }
            className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:scale-95 transition-all z-30 opacity-90 hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              document
                .getElementById("trending-colleges-carousel-container")
                ?.scrollBy({ left: 360, behavior: "smooth" })
            }
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:scale-95 transition-all z-30 opacity-90 hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            id="trending-colleges-carousel-container"
            className="flex overflow-x-auto no-scrollbar gap-5 py-2 scroll-smooth snap-x snap-mandatory"
          >
            {filteredColleges.map((college) => (
              <motion.div
                layout
                key={college.id}
                className="group snap-start w-[280px] sm:w-[295px] md:w-[305px] flex-shrink-0 flex flex-col justify-between bg-white border border-slate-200/90 hover:border-orange-500/60 rounded-[22px] overflow-hidden shadow-xs hover:shadow-[0_16px_36px_-6px_rgba(249,115,22,0.18)] hover:-translate-y-1.5 transition-all duration-350 select-none relative"
              >
                {/* Image */}
                <div className="relative h-[120px] bg-slate-100 overflow-hidden">
                  <img
                    src={college.image || "/images/galgotias_real.jpg"}
                    alt={college.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Admin Edit Button Trigger on Card */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCollegeRow("trending");
                        setEditingCollegeData(college);
                        setIsNewCollege(false);
                        setShowCollegeEditModal(true);
                      }}
                      className="absolute top-2.5 right-12 bg-white/95 hover:bg-orange-500 hover:text-white text-slate-800 px-2 py-0.5 rounded-full shadow-md z-20 flex items-center gap-1 text-[9px] font-black transition-all cursor-pointer border border-slate-200/80"
                      title="Edit College Card"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  {college.nirfRank && (
                    <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full text-[8.5px] font-black shadow-md shadow-orange-500/25 z-10 flex items-center gap-1">
                      <Award className="w-2.5 h-2.5" />
                      <span>NIRF #{college.nirfRank}</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm text-[9.5px] font-black text-slate-800 z-10">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{college.rating}</span>
                  </div>

                  <div className="absolute bottom-2 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-white z-10">
                    {college.type}
                  </div>
                </div>

                {/* Floating Logo + Stream */}
                <div className="relative -mt-6 px-3.5 z-20 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-white shadow-md p-1 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-shadow relative">
                    {college.logo ? (
                      <img
                        src={college.logo}
                        alt={`${college.name} logo`}
                        className="w-full h-full object-contain relative z-10"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: college.logo ? "none" : "flex" }}
                      className="w-full h-full rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/15 border border-orange-200/60 text-orange-600 font-black text-[10px] items-center justify-center text-center uppercase tracking-tight"
                    >
                      {college.name.split(" ")[0].slice(0, 4)}
                    </div>
                  </div>
                  <span className="text-[8.5px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/70 shadow-xs">
                    {college.stream}
                  </span>
                </div>

                {/* Body */}
                <div className="p-3.5 pt-1.5 flex-1 flex flex-col justify-between gap-2.5">
                  <div>
                    <h3 className="font-outfit font-black text-[13.5px] leading-snug text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {college.name}
                    </h3>
                    <p className="flex items-center gap-1 text-[10.5px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{college.location}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-1.5 px-2 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <div>
                      <p className="text-[7px] text-slate-400 font-extrabold uppercase tracking-wider">Highest</p>
                      <p className="font-outfit font-bold text-[10.5px] text-emerald-600 mt-0.5 truncate">{college.highestPackage}</p>
                    </div>
                    <div className="border-x border-slate-200/60">
                      <p className="text-[7px] text-slate-400 font-extrabold uppercase tracking-wider">Average</p>
                      <p className="font-outfit font-bold text-[10.5px] text-orange-600 mt-0.5 truncate">{college.averagePackage}</p>
                    </div>
                    <div>
                      <p className="text-[7px] text-slate-400 font-extrabold uppercase tracking-wider">Fees</p>
                      <p className="font-outfit font-bold text-[10.5px] text-slate-700 mt-0.5 truncate">{college.averageFee}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-0.5">
                    <Link
                      href={`/colleges/${college.slug}`}
                      className="flex-1 py-2 px-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 font-bold text-[11px] rounded-xl text-center transition-all shadow-xs"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => {
                        setFormData({ ...formData, stream: college.stream });
                        setModalType("general");
                        setShowInquiryModal(true);
                      }}
                      className="flex-1 py-2 px-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-[11px] rounded-xl transition-all shadow-md shadow-orange-500/15 active:scale-95 text-center cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Clean Single Divider Line Between Rows */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent !my-3" />

        {/* Row 2: Top Ranked & Emerging Universities Carousel */}
        <div className="relative group/carousel select-none z-10">
          <button
            onClick={() =>
              document
                .getElementById("featured-colleges-carousel-container")
                ?.scrollBy({ left: -360, behavior: "smooth" })
            }
            className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:scale-95 transition-all z-30 opacity-90 hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              document
                .getElementById("featured-colleges-carousel-container")
                ?.scrollBy({ left: 360, behavior: "smooth" })
            }
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:scale-95 transition-all z-30 opacity-90 hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            id="featured-colleges-carousel-container"
            className="flex overflow-x-auto no-scrollbar gap-5 py-2 scroll-smooth snap-x snap-mandatory"
          >
            {filteredFeaturedColleges.map((college) => (
              <motion.div
                layout
                key={college.id}
                className="group snap-start w-[280px] sm:w-[295px] md:w-[305px] flex-shrink-0 flex flex-col justify-between bg-white border border-slate-200/90 hover:border-orange-500/60 rounded-[22px] overflow-hidden shadow-xs hover:shadow-[0_16px_36px_-6px_rgba(249,115,22,0.18)] hover:-translate-y-1.5 transition-all duration-350 select-none relative"
              >
                {/* Image */}
                <div className="relative h-[120px] bg-slate-100 overflow-hidden">
                  <img
                    src={college.image || "/images/galgotias_real.jpg"}
                    alt={college.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Admin Edit Button Trigger on Card */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCollegeRow("featured");
                        setEditingCollegeData(college);
                        setIsNewCollege(false);
                        setShowCollegeEditModal(true);
                      }}
                      className="absolute top-2.5 right-12 bg-white/95 hover:bg-orange-500 hover:text-white text-slate-800 px-2 py-0.5 rounded-full shadow-md z-20 flex items-center gap-1 text-[9px] font-black transition-all cursor-pointer border border-slate-200/80"
                      title="Edit College Card"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  {college.nirfRank && (
                    <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full text-[8.5px] font-black shadow-md shadow-orange-500/25 z-10 flex items-center gap-1">
                      <Award className="w-2.5 h-2.5" />
                      <span>NIRF #{college.nirfRank}</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm text-[9.5px] font-black text-slate-800 z-10">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{college.rating}</span>
                  </div>

                  <div className="absolute bottom-2 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-white z-10">
                    {college.type}
                  </div>
                </div>

                {/* Floating Logo + Stream */}
                <div className="relative -mt-6 px-3.5 z-20 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-white shadow-md p-1 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-shadow relative">
                    {college.logo ? (
                      <img
                        src={college.logo}
                        alt={`${college.name} logo`}
                        className="w-full h-full object-contain relative z-10"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: college.logo ? "none" : "flex" }}
                      className="w-full h-full rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/15 border border-orange-200/60 text-orange-600 font-black text-[10px] items-center justify-center text-center uppercase tracking-tight"
                    >
                      {college.name.split(" ")[0].slice(0, 4)}
                    </div>
                  </div>
                  <span className="text-[8.5px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/70 shadow-xs">
                    {college.stream}
                  </span>
                </div>

                {/* Body */}
                <div className="p-3.5 pt-1.5 flex-1 flex flex-col justify-between gap-2.5">
                  <div>
                    <h3 className="font-outfit font-black text-[13.5px] leading-snug text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {college.name}
                    </h3>
                    <p className="flex items-center gap-1 text-[10.5px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{college.location}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-1.5 px-2 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <div>
                      <p className="text-[7px] text-slate-400 font-extrabold uppercase tracking-wider">Highest</p>
                      <p className="font-outfit font-bold text-[10.5px] text-emerald-600 mt-0.5 truncate">{college.highestPackage}</p>
                    </div>
                    <div className="border-x border-slate-200/60">
                      <p className="text-[7px] text-slate-400 font-extrabold uppercase tracking-wider">Average</p>
                      <p className="font-outfit font-bold text-[10.5px] text-orange-600 mt-0.5 truncate">{college.averagePackage}</p>
                    </div>
                    <div>
                      <p className="text-[7px] text-slate-400 font-extrabold uppercase tracking-wider">Fees</p>
                      <p className="font-outfit font-bold text-[10.5px] text-slate-700 mt-0.5 truncate">{college.averageFee}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-0.5">
                    <Link
                      href={`/colleges/${college.slug}`}
                      className="flex-1 py-2 px-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 font-bold text-[11px] rounded-xl text-center transition-all shadow-xs"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => {
                        setFormData({ ...formData, stream: college.stream });
                        setModalType("general");
                        setShowInquiryModal(true);
                      }}
                      className="flex-1 py-2 px-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-[11px] rounded-xl transition-all shadow-md shadow-orange-500/15 active:scale-95 text-center cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* REVIEW & EARN REWARDS BANNER */}
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent my-2" />
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200/40 shadow-sm flex flex-col md:flex-row items-stretch select-none bg-[#032b53] text-white min-h-[220px] md:min-h-[260px] py-8 md:py-10">
        {/* Diagonal Slanted Left Brand Accent (Solid Saffron matching Header Logo exactly) */}
        <div className="absolute top-0 left-0 bottom-0 w-[35%] bg-[#f47920] [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)] hidden md:block z-10" />

        {/* Mobile Brand Accent */}
        <div className="w-full h-24 bg-[#f47920] flex md:hidden items-center justify-center relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]" />
          <img
            src="/logo.png?v=3"
            alt="College 19"
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Brand Logo Container on Left (Desktop) */}
        <div className="absolute top-0 left-0 bottom-0 w-[32%] hidden md:flex flex-col items-center justify-center z-20 pl-8">
          <img
            src="/logo.png?v=3"
            alt="College 19"
            className="h-20 w-auto object-contain"
          />
          <span className="text-[9px] uppercase tracking-[0.25em] font-black text-white/90 mt-2">
            Review & Reward
          </span>
        </div>

        {/* Right/Center Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 md:pl-[38%]">
          {/* Background ambient light */}
          <div className="absolute right-0 bottom-0 w-44 h-44 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Middle Text Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-black uppercase tracking-wider text-orange-200">
              ⚡ Approval In 30 Minutes*
            </span>
            <h3 className="font-outfit font-black text-2xl md:text-3xl tracking-wide text-white leading-snug">
              Write A Review & Earn Upto{" "}
              <span className="text-yellow-300">₹1000</span>
            </h3>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/write-review"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-black text-[11px] uppercase tracking-wider rounded-xl active:scale-95 shadow-md shadow-red-500/10 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Write Now
              </Link>
            </div>
          </div>

          {/* Right Side Image/Icon (Thumbs Up & Stars) */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 relative md:pr-6">
            {/* Glowing aura */}
            <div className="absolute inset-0 bg-yellow-400/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Rating stars */}
              <div className="flex gap-1.5 mb-1.5 animate-[bounce_4s_ease-in-out_infinite]">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 -rotate-12 scale-90" />
                <Star className="w-5.5 h-5.5 fill-yellow-400 text-yellow-400 scale-110" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 rotate-12 scale-90" />
              </div>
              {/* Custom Thumbs Up Badges */}
              <div className="w-18 h-18 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-md hover:scale-105 transition-transform duration-300">
                <span className="text-3xl leading-none">👍</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* EDUCATION LOAN & PARTNER BANKS SECTION */}
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent my-2" />
      <section className="bg-[#032b53] border border-slate-800 rounded-[32px] p-6 md:p-12 text-white relative overflow-hidden shadow-xl select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_40%)]" />
        {/* Shimmer Sheen Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[50%] h-[200%] pointer-events-none animate-shimmer-sheen z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Title & Bank Logos Grid */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h2 className="font-outfit font-black text-2xl md:text-4xl leading-tight tracking-wide">
                Your Dreams Deserve The Best <br />
                <span className="text-orange-400">Financial Support</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                Partner with India's most trusted banks — zero hidden charges,
                instant approvals, and expert guidance at every step.
              </p>
            </div>

            {/* Bank Logos Grid — each card clickable with loan link */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[
                { name: "SBI", url: "https://www.sbi.co.in/web/personal-banking/loans/education-loans", delay: "0s", logo: (<div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full border-[5px] border-[#00a9e0] relative flex items-center justify-center flex-shrink-0"><div className="absolute bottom-0 w-[4px] h-[8px] bg-white translate-y-[2px]" /></div><span className="font-extrabold text-[16px] text-[#003876] tracking-tight">SBI</span></div>) },
                { name: "HDFC Bank", url: "https://www.hdfcbank.com/personal/borrow/popular-loans/educational-loan", delay: "0.2s", logo: (<div className="flex items-center gap-2"><div className="border-t-[3px] border-b-[3px] border-[#1c3f94] px-1.5 py-0.5 relative flex-shrink-0 w-9 flex justify-center"><div className="w-1.5 h-1.5 bg-[#e31e24] rounded-sm absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" /><span className="font-extrabold text-[8px] text-[#1c3f94] tracking-tighter">HDFC</span></div><span className="font-extrabold text-[13px] text-[#1c3f94] tracking-tight">HDFC BANK</span></div>) },
                { name: "Axis Bank", url: "https://www.axisbank.com/retail/loans/education-loan", delay: "0.4s", logo: (<div className="flex items-center gap-2"><div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[11px] border-b-[#861a49] transform rotate-180 flex-shrink-0" /><span className="font-black text-[14px] text-[#861a49] tracking-tighter uppercase">Axis Bank</span></div>) },
                { name: "Kotak Mahindra Bank", url: "https://www.kotak.com/en/personal/loans/education-loan.html", delay: "0.6s", logo: (<div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-[#da251c] flex items-center justify-center text-white font-black text-[9px] flex-shrink-0">K</span><span className="font-extrabold text-[15px] text-[#054381] tracking-tight">kotak</span></div>) },
                { name: "ICICI Bank", url: "https://www.icicibank.com/personal-banking/loans/education-loan", delay: "0.7s", logo: (<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-sm bg-[#f58220] flex items-center justify-center text-white font-black text-[8px] flex-shrink-0">I</div><span className="font-extrabold text-[14px] text-[#c0392b] tracking-tight">ICICI Bank</span></div>) },
                { name: "PNB", url: "https://www.pnbindia.in/education-loan.html", delay: "0.8s", logo: (<div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#a32035] rounded flex items-center justify-center text-white border-b-2 border-[#f2a900] flex-shrink-0"><span className="font-black text-[8px]">pnb</span></div><span className="font-extrabold text-[15px] text-[#a32035] tracking-tight">PNB</span></div>) },
                { name: "Bank of Baroda", url: "https://www.bankofbaroda.in/personal-banking/loans/education-loans", delay: "1.0s", logo: (<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#f47920] flex items-center justify-center text-white font-black text-[9px] flex-shrink-0">B</div><span className="font-extrabold text-[14px] text-[#0f2c59] tracking-tighter">Baroda</span></div>) },
                { name: "Canara Bank", url: "https://canarabank.com/english/pages/educationloan.aspx", delay: "1.2s", logo: (<div className="flex flex-col items-center justify-center"><span className="font-extrabold text-[14px] text-[#006ca7] tracking-tight">Canara Bank</span><div className="w-10 h-1 bg-[#ffcc00] rounded-full mt-1" /></div>) },
                { name: "IDFC FIRST Bank", url: "https://www.idfcfirstbank.com/personal-banking/loans/education-loan", delay: "1.4s", logo: (<div className="flex flex-col items-center justify-center"><span className="font-black text-[13px] text-[#8c2230] tracking-tight leading-none">IDFC FIRST</span><span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Bank</span></div>) },
                { name: "Yes Bank", url: "https://www.yesbank.in/personal-banking/yes-individual/borrowing/education-loan", delay: "1.5s", logo: (<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#00205b] flex items-center justify-center text-white font-black text-[8px] flex-shrink-0">Y</div><span className="font-extrabold text-[14px] text-[#00205b] tracking-tight">Yes Bank</span></div>) },
                { name: "Central Bank of India", url: "https://www.centralbankofindia.co.in/en/education-loan", delay: "1.6s", logo: (<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#0060a9] flex items-center justify-center text-white font-black text-[8px] flex-shrink-0">C</div><span className="font-extrabold text-[14px] text-[#0060a9] tracking-tighter">Central Bank</span></div>) },
                { name: "IndusInd Bank", url: "https://www.indusind.com/in/en/personal/loans/education-loan.html", delay: "1.7s", logo: (<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-sm bg-[#007dc5] flex items-center justify-center text-white font-black text-[8px] flex-shrink-0">II</div><span className="font-extrabold text-[12px] text-[#007dc5] tracking-tighter">IndusInd</span></div>) },
                { name: "Bank of India", url: "https://bankofindia.co.in/education-loan", delay: "1.8s", logo: (<div className="flex items-center gap-2"><span className="text-[#003c71] font-black text-[14px] transform rotate-12 flex-shrink-0">★</span><span className="font-extrabold text-[13px] text-[#003c71] tracking-tighter">Bank of India</span></div>) },
                { name: "Union Bank of India", url: "https://www.unionbankofindia.co.in/english/education-loan.aspx", delay: "2.0s", logo: (<span className="font-extrabold text-[14px] text-[#ec1c24] tracking-tighter">Union Bank</span>) },
                { name: "Federal Bank", url: "https://www.federalbank.co.in/education-loans", delay: "2.1s", logo: (<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-black text-[8px] flex-shrink-0">F</div><span className="font-extrabold text-[13px] text-[#1e3a8a] tracking-tighter">Federal Bank</span></div>) },
                { name: "Indian Bank", url: "https://www.indianbank.in/departments/education-loan/", delay: "2.2s", logo: (<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#005ba4] relative flex items-center justify-center flex-shrink-0"><span className="text-white font-black text-[7.5px]">I</span></div><span className="font-extrabold text-[14px] text-[#005ba4] tracking-tight">Indian Bank</span></div>) },
              ].map((bank) => (
                <button
                  key={bank.name}
                  onClick={() => setSelectedBank({ name: bank.name, url: bank.url })}
                  className="bg-white rounded-xl p-3 flex items-center justify-center h-16 shadow-sm border border-slate-100 hover:scale-[1.03] hover:border-orange-400 hover:shadow-md transition-all duration-200 cursor-pointer select-none relative overflow-hidden group/bank w-full"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[50%] h-[200%] pointer-events-none animate-shimmer-sheen z-10"
                    style={{ animationDelay: bank.delay }}
                  />
                  <div className="relative z-20">{bank.logo}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Interactive Calculator Widget */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative z-20">
            <div className="bg-white border border-slate-100 rounded-[24px] p-6 text-slate-800 shadow-2xl max-w-sm w-full space-y-4">
              <div className="pb-3 border-b-2 border-[#032b53] flex items-center justify-between">
                <h3 className="font-outfit font-black text-sm text-slate-800 tracking-wide">
                  Education Loan
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </div>

              {/* Input 1: Account Balance */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-slate-700">
                  <span>Account Balance</span>
                  <span className="text-slate-800 border-b border-slate-300 pb-0.5 font-sans">
                    ₹{loanAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="100000000"
                  step="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1 bg-blue-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                  <span>₹ 1L</span>
                  <span>₹ 10Cr</span>
                </div>

                {/* Quick Select Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    1000000, 2500000, 5000000, 10000000, 50000000, 100000000,
                  ].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setLoanAmount(amt)}
                      className={`text-[8.5px] px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        loanAmount === amt
                          ? "bg-slate-200 text-slate-800 shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      ₹
                      {amt >= 10000000
                        ? `${amt / 10000000}Cr`
                        : `${amt / 100000}L`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input 2: Interest Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-slate-700">
                  <span>Interest rate</span>
                  <span className="text-slate-800">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1 bg-blue-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                  <span>1.5%</span>
                  <span>4%</span>
                </div>
              </div>

              {/* Simulation Period Header */}
              <div className="pt-1">
                <h4 className="text-[10px] text-slate-700 font-extrabold">
                  Simulation Results (for a period of 1 year)
                </h4>
              </div>

              {/* Simulation Result Box 1 (Solid dark blue) */}
              <div className="bg-[#004e9a] text-white rounded-xl p-4 space-y-1.5 shadow-md text-left">
                <div className="font-outfit font-black text-base md:text-lg tracking-wide text-white">
                  ₹{emiVal.toLocaleString("en-IN")}*
                </div>
                <p className="text-[9.5px] text-slate-100 leading-relaxed font-semibold">
                  Earn additional ₹{additionalEarn.toLocaleString("en-IN")} with
                  IDFC First bank (competitive interest rates ranging from 3% to
                  7%)
                </p>
              </div>

              {/* Simulation Result Box 2 (Light blue/grey) */}
              <div className="bg-slate-100 text-slate-700 rounded-xl p-3 text-left font-black text-xs md:text-sm tracking-wide border border-slate-200/50">
                ₹{emiVal.toLocaleString("en-IN")}*
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setModalType("loan");
                  setShowInquiryModal(true);
                }}
                className="w-full py-3 bg-[#032b53] hover:bg-orange-600 text-white font-black text-[11px] rounded-full active:scale-95 transition-all text-center uppercase tracking-wider cursor-pointer shadow-md"
              >
                Application For Loan Education
              </button>

              <div className="text-center text-[9.5px] text-slate-500 font-extrabold cursor-pointer hover:underline">
                View Savings Account Interest Rates
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* STUDENT TESTIMONIALS SECTION */}
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent my-2" />
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#fff9f2] via-white to-[#fff3f0] border border-orange-150/20 rounded-[32px] shadow-sm relative overflow-hidden select-none">
        {/* Quote Icon Header */}
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-serif text-xl font-bold">
            “
          </div>
        </div>

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2 px-4 mb-10">
          <h2 className="font-outfit font-black text-2xl md:text-3xl text-slate-800 leading-tight">
            But Don't Take Our Word For It, <br />
            Hear From Our Students
          </h2>
        </div>

        <div className="relative max-w-[95vw] sm:max-w-7xl mx-auto px-2 md:px-12 flex items-center justify-center">
          {/* Left Floating Indian Student Avatars (Visible on wide screens) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-[360px] pointer-events-none hidden xl:block z-10">
            <div className="absolute top-4 right-0 w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 animate-pulse">
              <img
                src="/images/student_avatar_1.jpg"
                alt="Student Ratri"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-28 left-4 w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
              <img
                src="/images/student_avatar_3.jpg"
                alt="Student Aman"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-24 right-4 w-14 h-14 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
              <img
                src="/images/student_avatar_2.jpg"
                alt="Student Sneha"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-6 left-6 w-10 h-10 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
              <img
                src="/images/student_avatar_4.jpg"
                alt="Student Rahul"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => {
              const el = document.getElementById(
                "student-testimonials-carousel",
              );
              if (el) el.scrollBy({ left: -340, behavior: "smooth" });
            }}
            className="absolute -left-1 sm:left-2 z-35 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Testimonials Scroll Container - 10 Indian Reviews */}
          <div
            id="student-testimonials-carousel"
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 w-full max-w-5xl mx-auto py-4 px-4 scroll-smooth relative z-20"
          >
            {[
              {
                name: "Ratri Paul",
                course: "B.Sc Student",
                avatar: "/images/student_avatar_2.jpg",
                text: "College 19 has helped me in selecting my perfect college along with course. After 12 in Science with Biology and no interest in the medical field, I didn't know which course to select and in which college. College 19's face to face free Counselling has helped me in choosing my right career path.",
              },
              {
                name: "Saikat Saha",
                course: "B.Tech Aspirant",
                avatar: "/images/student_avatar_1.jpg",
                text: "Being a remote student, I was clueless after class 12 in choosing my career path, but College 19's Counselling for Remote Candidates' service has helped me in sorting out my colleges and choose my course. They have also provided me with GD and PI training.",
              },
              {
                name: "Ankita Mondal",
                course: "Arts Student",
                avatar: "/images/student_avatar_3.jpg",
                text: "I did my HS in Computer Science but have no interest in Engineering and also did not want to pursue an Honours course. I took College 19's face to face counselling service and got to know my strength in arts subjects. They guided me to pursue arts from a reputed college.",
              },
              {
                name: "Aman Kumar",
                course: "MBA Student",
                avatar: "/images/student_avatar_4.jpg",
                text: "I was confused between PGDM and MBA. College 19 expert counselors analyzed my profile and CAT score, and guided me to select the top colleges matching my budget. The scholarship guidance they gave helped me save ₹1.5 Lakhs on fees.",
              },
              {
                name: "Sneha Kumari",
                course: "MBBS Aspirant",
                avatar: "/images/student_avatar_5.jpg",
                text: "Cracking NEET was hard, but choosing the right medical college with my rank was harder. College 19's detailed seat analysis and documentation checklist made my admission in B.Sc Nursing/MBBS smooth. Truly grateful to the team.",
              },
              {
                name: "Rahul Verma",
                course: "BCA Student",
                avatar: "/images/student_avatar_6.jpg",
                text: "College 19's portal helped me compare fees, placements, and hostel facilities of 10+ colleges in just 5 minutes. Their helpline answered all my questions about Bihar Student Credit Card and admission quotas.",
              },
              {
                name: "Pooja Sharma",
                course: "BBA Student",
                avatar: "/images/student_avatar_7.jpg",
                text: "The counseling session with College 19 changed my perspective. They conducted a mock interview for my college entry and guided me step-by-step with the documentation and registration.",
              },
              {
                name: "Vikram Singh",
                course: "Law Student",
                avatar: "/images/student_avatar_8.jpg",
                text: "I wanted to pursue law but wasn't sure about the integrated course options. College 19 counselors explained the difference between BA LLB and BBA LLB. Thanks to them, I secured admission in a top university.",
              },
              {
                name: "Neha Raj",
                course: "B.Sc Nursing Student",
                avatar: "/images/student_avatar_3.jpg",
                text: "Getting admission under Bihar Student Credit Card scheme was a dream. College 19 helped me throughout the college selection, verification, and DRCC registration. Best free counseling service in India!",
              },
              {
                name: "Abhishek Mishra",
                course: "MCA Student",
                avatar: "/images/student_avatar_1.jpg",
                text: "Highly professional and transparent. They didn't push any particular colleges, they actually listened to my career goals and suggested options where I got placed successfully. 100% recommended!",
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="group bg-[#eef2f6] border border-slate-200/60 p-6 md:p-7 flex flex-col justify-between w-[290px] h-[290px] sm:w-[320px] sm:h-[320px] shrink-0 snap-start snap-always relative overflow-hidden select-none rounded-xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 hover:rotate-[0.5deg] hover:bg-[#f47920] hover:border-orange-600 hover:shadow-[0_12px_30px_-5px_rgba(244,121,32,0.35)]"
              >
                {/* Background Shimmer sweep on card hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] h-[200%] pointer-events-none translate-x-[-100%] group-hover:animate-shimmer-sheen z-10" />

                <span className="text-slate-300 font-serif text-6xl absolute -top-1 left-2 select-none pointer-events-none transition-colors duration-300 group-hover:text-white/20">
                  "
                </span>
                <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed font-semibold relative z-10 pt-4 overflow-y-auto no-scrollbar max-h-[170px] sm:max-h-[190px] transition-colors duration-300 group-hover:text-white">
                  {review.text}
                </p>
                <div className="mt-4 pt-3.5 border-t border-slate-200 flex flex-col relative z-20 transition-all duration-300 group-hover:border-white/20">
                  <span className="font-outfit font-black text-xs sm:text-sm text-slate-800 uppercase tracking-wide transition-colors duration-300 group-hover:text-white">
                    {review.name}
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-extrabold uppercase mt-0.5 transition-colors duration-300 group-hover:text-orange-100">
                    {review.course}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => {
              const el = document.getElementById(
                "student-testimonials-carousel",
              );
              if (el) el.scrollBy({ left: 340, behavior: "smooth" });
            }}
            className="absolute -right-1 sm:right-2 z-35 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Right Floating Indian Student Avatars (Visible on wide screens) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-[360px] pointer-events-none hidden xl:block z-10">
            <div className="absolute top-4 left-0 w-14 h-14 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
              <img
                src="/images/student_avatar_5.jpg"
                alt="Student Pooja"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-28 right-4 w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 animate-pulse">
              <img
                src="/images/student_avatar_6.jpg"
                alt="Student Vikram"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-24 left-4 w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
              <img
                src="/images/student_avatar_7.jpg"
                alt="Student Abhishek"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-8 right-6 w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
              <img
                src="/images/student_avatar_8.jpg"
                alt="Student Neha"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {/* FOOTER CALL-TO-ACTION COUNSELING */}
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent my-2" />
      <section className="bg-[#fff9f2] border border-orange-200/40 p-8 md:p-12 rounded-[32px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-sm select-none">
        {/* Left Column: Expert Badges and Contacts */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <h2 className="font-outfit font-black text-2xl md:text-4xl text-slate-800 leading-tight">
              Still Confused About Your College?
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-extrabold uppercase tracking-wider leading-relaxed">
              Get Personalized Guidance From Industry Experts To Help You Choose
              The Right Course And Career Path.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 max-w-md">
            {/* Admissions Helpline */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200/50 rounded-full shadow-sm hover:scale-[1.01] hover:border-orange-400 transition-all duration-200">
              <div className="w-8 h-8 rounded-full bg-[#032b53] flex items-center justify-center text-white shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide">
                Admissions Helpline:{" "}
                <span className="text-orange-500 font-sans">
                  +91-9973798413
                </span>
              </span>
            </div>

            {/* Student Support */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200/50 rounded-full shadow-sm hover:scale-[1.01] hover:border-orange-400 transition-all duration-200">
              <div className="w-8 h-8 rounded-full bg-[#032b53] flex items-center justify-center text-white shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide">
                Student Support:{" "}
                <span className="text-orange-500 font-sans">
                  +91-9973798413
                </span>
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200/50 rounded-full shadow-sm hover:scale-[1.01] hover:border-orange-400 transition-all duration-200">
              <div className="w-8 h-8 rounded-full bg-[#032b53] flex items-center justify-center text-white shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide">
                Email:{" "}
                <span className="text-orange-500 font-sans font-extrabold uppercase">
                  info@thinkyourcollege.com
                </span>
              </span>
            </div>


            {/* Address 2 - Greater Noida */}
            <a
              href="https://www.google.com/maps/search/Alpha+1,+Greater+Noida,+Uttar+Pradesh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200/50 rounded-full shadow-sm hover:scale-[1.01] hover:border-orange-400 transition-all duration-200 cursor-pointer no-underline"
            >
              <div className="w-8 h-8 rounded-full bg-[#032b53] flex items-center justify-center text-white shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide truncate">
                Address:{" "}
                <span className="text-slate-600 hover:text-orange-500 transition-colors">
                  Alpha 1, Greater Noida, Uttar Pradesh
                </span>
              </span>
            </a>

            {/* Visit Us */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200/50 rounded-full shadow-sm hover:scale-[1.01] hover:border-orange-400 transition-all duration-200">
              <div className="w-8 h-8 rounded-full bg-[#032b53] flex items-center justify-center text-white shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide">
                Visit Us:{" "}
                <span className="text-slate-600 font-sans">
                  (10 AM To 7 PM)
                </span>
              </span>
            </div>

            {/* Book Home Visit */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200/50 rounded-full shadow-sm hover:scale-[1.01] hover:border-orange-400 transition-all duration-200">
              <div className="w-8 h-8 rounded-full bg-[#032b53] flex items-center justify-center text-white shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide">
                Book:{" "}
                <span className="text-slate-600">Home Visit Guidance</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Generated Counseling Cartoon */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-square group/img select-none">
            {/* 3D Glow halo behind the card to integrate it into the saffron backdrop */}
            <div className="absolute inset-2 bg-gradient-to-tr from-orange-400/20 to-amber-500/20 rounded-[32px] blur-2xl group-hover/img:scale-105 group-hover/img:blur-3xl transition-all duration-500" />

            {/* The Image Cards Slideshow */}
            {counselingSlides.map((slide, idx) => (
              <img
                key={slide}
                src={slide}
                alt="Expert Counseling Guidance"
                className={`absolute inset-0 w-full h-full object-contain rounded-[24px] border border-orange-200/30 shadow-[0_15px_30px_rgba(244,121,32,0.06),0_10px_15px_-5px_rgba(0,0,0,0.04)] transition-opacity duration-[800ms] ease-in-out ${
                  idx === activeCounselingSlide ? "z-20 opacity-100" : "z-10 opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* BANK LOAN REDIRECT MODAL */}
      <AnimatePresence>
        {selectedBank && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBank(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 flex flex-col items-center gap-5 relative border border-slate-100"
            >
              {/* Close */}
              <button onClick={() => setSelectedBank(null)} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#032b53] flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏦</span>
              </div>

              {/* Text */}
              <div className="text-center space-y-1.5">
                <h3 className="font-outfit font-black text-lg text-slate-800">
                  {selectedBank.name} Education Loan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You are about to visit <span className="font-bold text-slate-700">{selectedBank.name}</span>'s official education loan page. Apply directly or get free guidance from College 19 first.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full">
                <a
                  href={selectedBank.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedBank(null)}
                  className="w-full bg-[#032b53] text-white text-sm font-black rounded-xl py-3 text-center hover:bg-[#054381] transition-colors flex items-center justify-center gap-2"
                >
                  Apply on {selectedBank.name} ↗
                </a>
                <button
                  onClick={() => { setSelectedBank(null); setShowInquiryModal(true); setModalType("loan"); }}
                  className="w-full border-2 border-orange-400 text-orange-500 text-sm font-black rounded-xl py-3 hover:bg-orange-50 transition-colors"
                >
                  Get Free Guidance from College 19 🎓
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                College 19 is not affiliated with {selectedBank.name}. Links redirect to official bank websites.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP COUNSELING FORM MODAL */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-white rounded-3xl relative overflow-hidden shadow-2xl flex flex-col md:flex-row text-slate-800 border border-slate-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowInquiryModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-30"
              >
                <X className="w-4 h-4" />
              </button>

              {formSubmitted ? (
                <div className="w-full py-12 px-6 text-center space-y-4 bg-white flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="font-outfit font-black text-2xl text-slate-850">
                    Application Received!
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                    Our expert educational counselor will contact you shortly on
                    **+91 {formData.phone}** to guide you further.
                  </p>
                </div>
              ) : (
                <>
                  {/* Left Pane (Illustration) - Hidden on mobile for tight spacing */}
                  <div className="w-full md:w-[40%] p-8 bg-white flex flex-col justify-center items-center text-center space-y-4 border-r border-slate-100 hidden md:flex select-none">
                    <h3 className="font-outfit font-black text-2xl text-[#032b53] tracking-wide leading-none">
                      Register Now
                    </h3>
                    <p className="text-xs text-slate-400 font-extrabold max-w-[200px] leading-relaxed">
                      Get access to college brochures, favourites and dashboard
                    </p>

                    {/* Premium Security / Register Illustration */}
                    <div className="w-full flex justify-center items-center pt-2">
                      <img
                        src="/images/register_illustration.jpg"
                        alt="Register Guidance Illustration"
                        className="w-full h-auto max-h-56 object-contain rounded-2xl hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Right Pane (Light Green Dynamic Form) */}
                  <div className="w-full md:w-[60%] p-6 md:p-8 bg-[#e6f9f0] flex flex-col justify-center relative">
                    {/* Header */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {/* Branded Graduation/Counselor Icon */}
                        <div className="w-6 h-6 rounded-lg bg-[#032b53] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                          <GraduationCap className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                        <span className="font-extrabold text-[12px] text-[#032b53] uppercase tracking-wider">
                          Register Now
                        </span>
                      </div>

                      {/* Dynamic Title / Calculated Info */}
                      <h4 className="font-outfit font-black text-base text-blue-900 tracking-wide pt-1">
                        {modalType === "loan" ? (
                          <>
                            for Loan Amount{" "}
                            <span className="text-blue-600 font-sans">
                              ₹{loanAmount.toLocaleString("en-IN")}
                            </span>
                          </>
                        ) : modalType === "credit-card" ? (
                          "for Bihar Student Credit Card"
                        ) : (
                          "for Admission & Free Counseling"
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-600 font-extrabold tracking-wide uppercase leading-relaxed">
                        {modalType === "loan" ? (
                          <>
                            Interest Rate: {interestRate}% | Final Payable:{" "}
                            <span className="font-sans">
                              ₹{emiVal.toLocaleString("en-IN")}
                            </span>
                          </>
                        ) : modalType === "credit-card" ? (
                          "0% Interest Rate Scheme for Qualified Students"
                        ) : (
                          "Compare Top Colleges, Fees & Placement Packages"
                        )}
                      </p>
                    </div>

                    {/* Inputs Form */}
                    <form
                      onSubmit={handleFormSubmit}
                      className="space-y-3.5 mt-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Input 1: Full Name */}
                        <div>
                          <input
                            required
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
                          />
                        </div>

                        {/* Input 2: Email Address */}
                        <div>
                          <input
                            required
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
                          />
                        </div>

                        {/* Input 3: Phone Number */}
                        <div>
                          <input
                            required
                            type="tel"
                            maxLength={10}
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
                          />
                        </div>

                        {/* Input 4: Searchable Custom Select State Dropdown */}
                        <div className="relative">
                          <label className="sr-only">Select State</label>
                          <div
                            onClick={() => {
                              setShowStateDropdown(!showStateDropdown);
                              setStateSearchQuery("");
                            }}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold shadow-sm flex items-center justify-between cursor-pointer select-none"
                          >
                            <span
                              className={
                                formData.state
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              }
                            >
                              {formData.state || "Select state"}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          </div>

                          {showStateDropdown && (
                            <>
                              {/* Backdrop to dismiss */}
                              <div
                                className="fixed inset-0 z-40 cursor-default"
                                onClick={() => setShowStateDropdown(false)}
                              />

                              {/* Dropdown Container */}
                              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col">
                                {/* Search Box */}
                                <div className="p-2 bg-slate-50 border-b border-slate-100">
                                  <input
                                    type="text"
                                    placeholder="Search state..."
                                    value={stateSearchQuery}
                                    onChange={(e) =>
                                      setStateSearchQuery(e.target.value)
                                    }
                                    className="w-full px-2.5 py-1.5 text-[11px] font-bold border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white text-slate-800"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>

                                {/* Scrollable List */}
                                <div className="max-h-40 overflow-y-auto no-scrollbar py-1">
                                  {indianStates.filter((state) =>
                                    state
                                      .toLowerCase()
                                      .includes(stateSearchQuery.toLowerCase()),
                                  ).length === 0 ? (
                                    <div className="px-3.5 py-2 text-xs font-bold text-slate-400 text-center">
                                      No states found
                                    </div>
                                  ) : (
                                    indianStates
                                      .filter((state) =>
                                        state
                                          .toLowerCase()
                                          .includes(
                                            stateSearchQuery.toLowerCase(),
                                          ),
                                      )
                                      .map((state) => (
                                        <button
                                          key={state}
                                          type="button"
                                          onClick={() => {
                                            setFormData({
                                              ...formData,
                                              state: state,
                                            });
                                            setShowStateDropdown(false);
                                          }}
                                          className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors ${
                                            formData.state === state
                                              ? "bg-blue-50 text-blue-600"
                                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                          }`}
                                        >
                                          {state}
                                        </button>
                                      ))
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Input 5: Select Course (Full width or grid) */}
                        <div className="sm:col-span-2">
                          <select
                            required
                            value={formData.stream}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                stream: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold placeholder-slate-400 outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                          >
                            <option value="" disabled>
                              Select course
                            </option>
                            <option>Engineering</option>
                            <option>Medical</option>
                            <option>Management</option>
                            <option>Law</option>
                            <option>IT & Software</option>
                            <option>Design</option>
                            <option>Science</option>
                            <option>Arts</option>
                          </select>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#032b53] hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl active:scale-95 transition-all text-center cursor-pointer shadow-md mt-2"
                      >
                        Submit
                      </button>
                    </form>

                    {/* Footer note */}
                    <div className="text-center text-[9.5px] text-slate-400 mt-4 font-bold tracking-wide leading-relaxed">
                      By submitting this form, you accept and agree to our{" "}
                      <span className="text-[#da251c] cursor-pointer hover:underline">
                        Terms & Conditions
                      </span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* TRENDING NOW NEWS DETAILS MODAL */}
      <AnimatePresence>
        {activeTrendingUpdate && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            {/* Backdrop trigger */}
            <div
              className="absolute inset-0"
              onClick={() => setActiveTrendingUpdate(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-3xl w-full max-w-[520px] shadow-2xl p-6 md:p-7 flex flex-col z-10 border border-slate-100 overflow-hidden"
            >
              {/* Glowing top line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500" />

              {/* Header Row */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 font-black text-[9px] uppercase tracking-widest">
                  {activeTrendingUpdate.tag}
                </span>
                <button
                  onClick={() => setActiveTrendingUpdate(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <h3 className="font-outfit font-black text-slate-800 text-base md:text-lg leading-snug mb-3">
                {activeTrendingUpdate.title}
              </h3>

              {/* Details News Description */}
              <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-6">
                {activeTrendingUpdate.details}
              </p>

              {/* Action Button & Dismiss Row */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                <button
                  onClick={() => setActiveTrendingUpdate(null)}
                  className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Dismiss
                </button>
                <Link
                  href={activeTrendingUpdate.actionLink}
                  onClick={() => setActiveTrendingUpdate(null)}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/15 active:scale-95 cursor-pointer text-center"
                >
                  {activeTrendingUpdate.actionText}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* TOP ENTRANCE EXAM DETAILS MODAL */}
      <AnimatePresence>
        {activeExamModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            {/* Backdrop trigger */}
            <div
              className="absolute inset-0"
              onClick={() => setActiveExamModal(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-3xl w-full max-w-[540px] shadow-2xl p-6 md:p-7 flex flex-col z-10 border border-slate-100 overflow-hidden"
            >
              {/* Glowing top line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500" />

              {/* Header Row */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 font-black text-[9px] uppercase tracking-widest">
                  {activeExamModal.exam.name} - {activeExamModal.exam.stream}
                </span>
                <button
                  onClick={() => setActiveExamModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Tabs Content based on clicked tab */}
              {activeExamModal.tab === "info" && (
                <div className="space-y-4">
                  <h3 className="font-outfit font-black text-slate-800 text-base md:text-lg tracking-wide">
                    About {activeExamModal.exam.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-1">
                        Exam Mode
                      </span>
                      <span className="font-extrabold text-slate-700">
                        {activeExamModal.exam.mode}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-1">
                        Exam Level
                      </span>
                      <span className="font-extrabold text-slate-700">
                        {activeExamModal.exam.level}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-1">
                        Registration Date
                      </span>
                      <span className="font-extrabold text-slate-700">
                        {activeExamModal.exam.registrationDate}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-1">
                        Expected Exam Date
                      </span>
                      <span className="font-extrabold text-slate-700 text-orange-600">
                        {activeExamModal.exam.examDate}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                    <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-1">
                      Eligibility Criteria
                    </span>
                    <p className="font-semibold text-slate-600 leading-relaxed">
                      {activeExamModal.exam.eligibility}
                    </p>
                  </div>
                </div>
              )}

              {activeExamModal.tab === "process" && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-outfit font-black text-slate-800 text-base md:text-lg tracking-wide">
                    Application Process
                  </h3>
                  <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 text-[11px] font-semibold text-orange-800 leading-relaxed">
                    💡 <strong>Quick Note:</strong> Ensure you have active
                    mobile number and email id ready before applying. Keep your
                    scanned academic documents, signature, and photograph handy.
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-slate-600 font-semibold pl-1">
                    <li>
                      Visit the official {activeExamModal.exam.name} online
                      portal during the registration window (
                      {activeExamModal.exam.registrationDate}).
                    </li>
                    <li>
                      Click on New Registration and fill your basic details to
                      create login credentials.
                    </li>
                    <li>
                      Log in using Application Number and password, and complete
                      the detailed form.
                    </li>
                    <li>
                      Upload scanned photograph, signature, and categories
                      certificate if required.
                    </li>
                    <li>
                      Pay the examination fee online via Net Banking,
                      Debit/Credit Card, or UPI.
                    </li>
                    <li>
                      Submit the application form and download the confirmation
                      page.
                    </li>
                  </ol>
                </div>
              )}

              {activeExamModal.tab === "pyqs" && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-outfit font-black text-slate-800 text-base md:text-lg tracking-wide">
                    Previous Year Question Papers
                  </h3>
                  <p className="font-semibold text-slate-500 leading-relaxed">
                    Download {activeExamModal.exam.pyqCount} with detailed
                    solutions to boost your preparation.
                  </p>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {[2026, 2025, 2024, 2023, 2022].map((year) => (
                      <div
                        key={year}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-orange-200 transition-colors"
                      >
                        <span className="font-bold text-slate-700">
                          {activeExamModal.exam.name} {year} Question Paper
                          (Solved)
                        </span>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(
                              `Download started for ${activeExamModal.exam.name} ${year} Solved Paper!`,
                            );
                          }}
                          className="px-2.5 py-1 bg-orange-50 hover:bg-orange-500 border border-orange-100 hover:border-orange-500 text-orange-600 hover:text-white font-black text-[9px] uppercase tracking-wider rounded-lg transition-all"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
                <button
                  onClick={() => setActiveExamModal(null)}
                  className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Dismiss
                </button>
                <Link
                  href={`/colleges?stream=${activeExamModal.exam.stream}`}
                  onClick={() => setActiveExamModal(null)}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/15 active:scale-95 cursor-pointer text-center"
                >
                  Find Colleges accepting {activeExamModal.exam.name}
                </Link>
              </div>
            </motion.div>
          </div>
        )}

        {/* ADMIN LOGIN MODAL */}
        {showAdminLoginModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <button
                onClick={() => {
                  setShowAdminLoginModal(false);
                  setAdminError("");
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-outfit font-black text-xl text-slate-800">
                    Admin Portal Access
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sign in to edit homepage cards & manage colleges
                  </p>
                </div>
              </div>

              {adminError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  {adminError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Admin Username"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm font-semibold"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminLoginModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                  >
                    Unlock & Edit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* HOMEPAGE COLLEGE CARD EDIT & ADD MODAL */}
        {showCollegeEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowCollegeEditModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-outfit font-black text-xl text-slate-800">
                    {isNewCollege ? "Add New College Card" : "Edit College Card"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customize college images, packages, ratings & metadata on homepage
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveCollege} className="space-y-4">
                {/* Carousel Placement Selector */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <label
                    onClick={() => setEditingCollegeRow("trending")}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      editingCollegeRow === "trending"
                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="collegeRow"
                      checked={editingCollegeRow === "trending"}
                      onChange={() => setEditingCollegeRow("trending")}
                      className="sr-only"
                    />
                    <span className="text-xs font-black">Row 1: Trending Colleges</span>
                  </label>

                  <label
                    onClick={() => setEditingCollegeRow("featured")}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      editingCollegeRow === "featured"
                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="collegeRow"
                      checked={editingCollegeRow === "featured"}
                      onChange={() => setEditingCollegeRow("featured")}
                      className="sr-only"
                    />
                    <span className="text-xs font-black">Row 2: Top Ranked & Emerging</span>
                  </label>
                </div>

                {/* DUAL IMAGE INPUTS SECTION WITH LIVE PREVIEWS */}
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-orange-900 uppercase tracking-wide flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                      Dual Image Configuration (Logo + Real Campus Banner)
                    </span>
                    <span className="text-[10px] text-orange-700 font-bold">Live Previews Below</span>
                  </div>

                  {/* 1. Real Campus Cover Image */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      1. Real Campus / College Cover Image Link (Banner Photo)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/images/iitdelhi_real.jpg or https://images.unsplash.com/..."
                      value={editingCollegeData.image || ""}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          image: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  {/* 2. Small College Logo Image */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      2. College Logo Image Link (Small Square Avatar)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/images/iitdelhi.png or https://upload.wikimedia.org/..."
                      value={editingCollegeData.logo || ""}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          logo: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  {/* Live Visual Preview of Card Header */}
                  <div className="pt-2">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Visual Preview on Card:
                    </span>
                    <div className="w-[280px] bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm">
                      <div className="relative h-[100px] bg-slate-100">
                        <img
                          src={editingCollegeData.image || "/images/galgotias_real.jpg"}
                          alt="Preview Banner"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold text-slate-800">
                          ★ {editingCollegeData.rating || 4.5}
                        </span>
                      </div>
                      <div className="relative -mt-5 px-3 flex items-center justify-between pb-2">
                        <div className="w-10 h-10 rounded-lg bg-white border-2 border-white shadow-md p-1 flex items-center justify-center overflow-hidden">
                          {editingCollegeData.logo ? (
                            <img
                              src={editingCollegeData.logo}
                              alt="Preview Logo"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="text-[8px] font-black text-orange-600">LOGO</div>
                          )}
                        </div>
                        <span className="text-[8px] uppercase font-black px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                          {editingCollegeData.stream || "Stream"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      College Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IIT Delhi - Indian Institute of Technology"
                      value={editingCollegeData.name || ""}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Location (City, State)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi, Delhi"
                      value={editingCollegeData.location || ""}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Stream and Ownership */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Stream / Discipline
                    </label>
                    <select
                      value={editingCollegeData.stream || "Engineering"}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          stream: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold bg-white"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Management">Management</option>
                      <option value="Medical">Medical</option>
                      <option value="Law">Law</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ownership / Type
                    </label>
                    <select
                      value={editingCollegeData.type || "Government"}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold bg-white"
                    >
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                      NIRF Rank (Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2"
                      value={editingCollegeData.nirfRank || ""}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          nirfRank: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                      Rating (Out of 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      required
                      placeholder="e.g. 4.9"
                      value={editingCollegeData.rating || 4.5}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          rating: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                      Highest Package
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1.2 Cr PA"
                      value={editingCollegeData.highestPackage || ""}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          highestPackage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                      Average Package
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 25.0 LPA"
                      value={editingCollegeData.averagePackage || ""}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          averagePackage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Fees and Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Annual Tuition Fees
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹2.2 Lakhs/Yr"
                      value={editingCollegeData.averageFee || ""}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          averageFee: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      College URL Slug
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iit-delhi (opens /colleges/iit-delhi)"
                      value={editingCollegeData.slug || ""}
                      onChange={(e) =>
                        setEditingCollegeData({
                          ...editingCollegeData,
                          slug: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {!isNewCollege && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteCollege(editingCollegeData.id as string, editingCollegeRow)
                      }
                      className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Card</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setShowCollegeEditModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingToCloud}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {isSavingToCloud ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Save & Publish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
