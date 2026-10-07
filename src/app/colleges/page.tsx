"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Map,
  Star,
  X,
  Sparkles,
  Award,
  BookOpen,
  DollarSign,
  Heart,
  ChevronRight,
  ChevronDown,
  Filter,
  MessageSquare,
  HelpCircle,
  FileText,
  Layers,
  Compass,
  GraduationCap,
  Link as LinkIcon,
  CheckCircle,
  Lock,
  Unlock,
  LogOut,
  Edit,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  stream: string;
  courses: string[];
  specializations: string[];
  exams: string[];
  feeRange: string;
  fees: number; // numeric for sorting/filtering (in Lakhs per year)
  rating: number;
  nirfRank?: number;
  type: string; // Public / Private (Ownership)
  description: string;
  logoText: string;
  slug: string;
  accreditation: string;
  image?: string;
  programMode: string; // Offline / Distance / Online
  courseTypes: string[]; // Bachelors / Masters / Doctorate / Postgraduate Diploma
  affiliation: string; // University name
  approvals: string[]; // AICTE / UGC / PCI / MHRD
}

const mockColleges: College[] = [
  {
    id: "1",
    name: "IIT Madras - Indian Institute of Technology",
    location: "Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    city: "Chennai",
    stream: "Engineering",
    courses: ["B.Tech", "M.Tech", "B.E"],
    specializations: ["Computer Science", "Mechanical", "Civil", "Electronics"],
    exams: ["JEE Main", "JEE Advanced", "GATE"],
    feeRange: "₹2.1 Lakhs/Yr",
    fees: 2.1,
    rating: 4.8,
    nirfRank: 1,
    type: "Public",
    description:
      "IIT Madras is a world-class public technical university known for its cutting-edge research, startup incubation cell, and massive lush green campus in Chennai.",
    logoText: "IITM",
    slug: "iit-madras",
    accreditation: "A++ Grade",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Bachelors", "Masters"],
    affiliation: "Delhi University", // dummy DU match for filtering
    approvals: ["AICTE", "UGC"],
  },
  {
    id: "2",
    name: "IIT Delhi - Indian Institute of Technology",
    location: "New Delhi, Delhi",
    state: "Delhi",
    city: "Delhi",
    stream: "Engineering",
    courses: ["B.Tech", "M.Tech", "B.E"],
    specializations: [
      "Computer Science",
      "Mechanical",
      "Civil",
      "Information Technology",
    ],
    exams: ["JEE Main", "JEE Advanced", "GATE"],
    feeRange: "₹2.2 Lakhs/Yr",
    fees: 2.2,
    rating: 4.9,
    nirfRank: 2,
    type: "Public",
    description:
      "IIT Delhi is a premier engineering institute recognized for its outstanding placements, global alumni network, and strategic industry collaborations in the heart of India's capital.",
    logoText: "IITD",
    slug: "iit-delhi",
    accreditation: "A++ Grade",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Bachelors", "Masters"],
    affiliation: "Delhi University",
    approvals: ["AICTE", "UGC"],
  },
  {
    id: "3",
    name: "IIM Ahmedabad - Indian Institute of Management",
    location: "Ahmedabad, Gujarat",
    state: "Gujarat",
    city: "Ahmedabad",
    stream: "Management",
    courses: ["MBA", "PGDM"],
    specializations: ["Finance", "Marketing", "General Management"],
    exams: ["CAT", "GMAT"],
    feeRange: "₹12.5 Lakhs/Yr",
    fees: 12.5,
    rating: 4.9,
    nirfRank: 1,
    type: "Public",
    description:
      "Indian Institute of Management Ahmedabad is India's leading business school, famous worldwide for its case-study pedagogy, rigorous curriculum, and high placement records.",
    logoText: "IIMA",
    slug: "iim-ahmedabad",
    accreditation: "EQUIS Accredited",
    image:
      "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Masters", "Postgraduate Diploma"],
    affiliation: "Mumbai University",
    approvals: ["UGC", "MHRD"],
  },
  {
    id: "4",
    name: "Galgotias University",
    location: "Greater Noida, Uttar Pradesh",
    state: "Uttar Pradesh",
    city: "Noida",
    stream: "Engineering",
    courses: ["B.Tech", "MBA", "B.E"],
    specializations: [
      "Computer Science",
      "Mechanical",
      "Electronics",
      "Information Technology",
    ],
    exams: ["JEE Main", "CUET"],
    feeRange: "₹1.6 Lakhs/Yr",
    fees: 1.6,
    rating: 4.2,
    nirfRank: 95,
    type: "Private",
    description:
      "Galgotias University is a highly ranked private campus offering industry-aligned engineering, management, and design programs with placement tie-ups in top Fortune 500 companies.",
    logoText: "GU",
    slug: "galgotias-university",
    accreditation: "NAAC A+",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Bachelors", "Masters"],
    affiliation: "Anna University, Chennai",
    approvals: ["AICTE", "UGC"],
  },
  {
    id: "5",
    name: "SIBM Pune - Symbiosis Institute of Business Management",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    city: "Pune",
    stream: "Management",
    courses: ["MBA", "PGDM"],
    specializations: ["Finance", "Marketing", "Human Resources"],
    exams: ["SNAP"],
    feeRange: "₹10.2 Lakhs/Yr",
    fees: 10.2,
    rating: 4.6,
    nirfRank: 17,
    type: "Private",
    description:
      "Symbiosis Institute of Business Management is a premier private management institute with a beautiful hilltop campus in Pune, celebrated for its niche student development programs.",
    logoText: "SIBM",
    slug: "sibm-pune",
    accreditation: "NAAC A++",
    image:
      "https://images.unsplash.com/photo-1541829019-259276a7f013?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Masters", "Postgraduate Diploma"],
    affiliation: "Mumbai University",
    approvals: ["UGC"],
  },
  {
    id: "6",
    name: "RV College of Engineering",
    location: "Bangalore, Karnataka",
    state: "Karnataka",
    city: "Bangalore",
    stream: "Engineering",
    courses: ["B.Tech", "M.Tech"],
    specializations: ["Computer Science", "Electronics", "Mechanical", "Civil"],
    exams: ["COMEDK", "KCET"],
    feeRange: "₹2.5 Lakhs/Yr",
    fees: 2.5,
    rating: 4.4,
    nirfRank: 85,
    type: "Private",
    description:
      "RV College of Engineering is Bangalore's premier private institution, highly recognized for excellent core engineering and computer science placements within the IT hub.",
    logoText: "RVCE",
    slug: "rv-college-of-engineering",
    accreditation: "AICTE Approved",
    image:
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Bachelors", "Masters"],
    affiliation: "JNTUH - Jawaharlal Nehru Technological University, Hyderabad",
    approvals: ["AICTE", "UGC"],
  },
  {
    id: "7",
    name: "AIIMS New Delhi - All India Institute of Medical Sciences",
    location: "New Delhi, Delhi",
    state: "Delhi",
    city: "Delhi",
    stream: "Medical",
    courses: ["MBBS"],
    specializations: ["General Medicine", "Pediatrics", "Surgery"],
    exams: ["NEET"],
    feeRange: "₹1,628/Yr",
    fees: 0.02,
    rating: 4.9,
    nirfRank: 1,
    type: "Public",
    description:
      "AIIMS New Delhi is India's premier public medical sciences university, offering highly subsidized, world-class healthcare education, research facilities, and extensive clinical exposure.",
    logoText: "AIIMS",
    slug: "aiims-delhi",
    accreditation: "MCI Approved",
    image:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Bachelors", "Doctorate"],
    affiliation: "Delhi University",
    approvals: ["UGC", "MHRD"],
  },
  {
    id: "8",
    name: "Kasturba Medical College Manipal",
    location: "Manipal, Karnataka",
    state: "Karnataka",
    city: "Bangalore",
    stream: "Medical",
    courses: ["MBBS"],
    specializations: ["General Medicine", "Surgery"],
    exams: ["NEET"],
    feeRange: "₹17.8 Lakhs/Yr",
    fees: 17.8,
    rating: 4.7,
    nirfRank: 10,
    type: "Private",
    description:
      "Kasturba Medical College Manipal is a top-ranked private medical institute offering exceptional clinical research laboratories, modern hospitals, and global learning partnerships.",
    logoText: "KMC",
    slug: "kmc-manipal",
    accreditation: "NAAC A++",
    image:
      "https://images.unsplash.com/photo-1551076805-e18690237571?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Bachelors", "Masters"],
    affiliation: "Anna University, Chennai",
    approvals: ["UGC", "PCI"],
  },
  {
    id: "9",
    name: "NID Ahmedabad - National Institute of Design",
    location: "Ahmedabad, Gujarat",
    state: "Gujarat",
    city: "Ahmedabad",
    stream: "Design",
    courses: ["B.Des", "M.Des"],
    specializations: [
      "Industrial Design",
      "Textile Design",
      "Communication Design",
    ],
    exams: ["NID DAT"],
    feeRange: "₹3.8 Lakhs/Yr",
    fees: 3.8,
    rating: 4.8,
    nirfRank: 1,
    type: "Public",
    description:
      "National Institute of Design is India's premier design institute, globally recognized for its creative industrial product designs, visual design labs, and eminent expert panels.",
    logoText: "NID",
    slug: "nid-ahmedabad",
    accreditation: "Autonomous",
    image:
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Bachelors", "Masters"],
    affiliation: "Mumbai University",
    approvals: ["UGC", "MHRD"],
  },
  {
    id: "10",
    name: "NLSIU Bangalore - National Law School of India University",
    location: "Bangalore, Karnataka",
    state: "Karnataka",
    city: "Bangalore",
    stream: "Law",
    courses: ["LLB"],
    specializations: [
      "Corporate Law",
      "Criminal Law",
      "Intellectual Property Law",
    ],
    exams: ["CLAT"],
    feeRange: "₹2.5 Lakhs/Yr",
    fees: 2.5,
    rating: 4.9,
    nirfRank: 1,
    type: "Public",
    description:
      "National Law School of India University is India's premier legal institution, serving as a pioneer of the integrated five-year law degree model with exceptional legal clinics.",
    logoText: "NLSIU",
    slug: "nlsiu-bangalore",
    accreditation: "BCI Approved",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60",
    programMode: "Offline",
    courseTypes: ["Bachelors", "Doctorate"],
    affiliation: "Delhi University",
    approvals: ["UGC", "MHRD"],
  },
  {
    id: "m1",
    name: "AIIMS New Delhi - All India Institute of Medical Sciences",
    location: "New Delhi, Delhi",
    state: "Delhi",
    city: "New Delhi",
    stream: "Medical",
    courses: ["MBBS"],
    specializations: ["General Medicine"],
    exams: ["NEET"],
    feeRange: "₹5,850 Total",
    fees: 0.05,
    rating: 5.0,
    nirfRank: 1,
    type: "Public",
    description:
      "AIIMS New Delhi is the apex medical training and research institute of India.",
    logoText: "AIIMS",
    slug: "aiims-delhi",
    accreditation: "MCI Approved",
    programMode: "Offline",
    courseTypes: ["Bachelors"],
    affiliation: "Autonomous",
    approvals: ["UGC"],
  },
  {
    id: "m2",
    name: "Kasturba Medical College (KMC) Mangalore",
    location: "Mangalore, Karnataka",
    state: "Karnataka",
    city: "Mangalore",
    stream: "Medical",
    courses: ["MBBS"],
    specializations: ["Pediatrics"],
    exams: ["NEET"],
    feeRange: "₹17.8 Lakhs/Yr",
    fees: 17.8,
    rating: 4.7,
    nirfRank: 23,
    type: "Private",
    description:
      "KMC Mangalore is one of the premier private medical colleges in Karnataka.",
    logoText: "KMC",
    slug: "kmc-mangalore",
    accreditation: "MCI Approved",
    programMode: "Offline",
    courseTypes: ["Bachelors"],
    affiliation: "Manipal Academy",
    approvals: ["UGC"],
  },
  {
    id: "p1",
    name: "National Institute of Pharmaceutical Education and Research (NIPER)",
    location: "Mohali, Punjab",
    state: "Punjab",
    city: "Mohali",
    stream: "Pharmacy",
    courses: ["B.Pharm"],
    specializations: ["Pharmaceutics"],
    exams: ["GPAT"],
    feeRange: "₹1.2 Lakhs/Yr",
    fees: 1.2,
    rating: 4.8,
    nirfRank: 1,
    type: "Public",
    description:
      "NIPER Mohali is the first national-level institute in pharmaceutical sciences.",
    logoText: "NIPER",
    slug: "niper-mohali",
    accreditation: "PCI Approved",
    programMode: "Offline",
    courseTypes: ["Bachelors"],
    affiliation: "Autonomous",
    approvals: ["UGC"],
  },
  {
    id: "a1",
    name: "School of Planning and Architecture (SPA)",
    location: "New Delhi, Delhi",
    state: "Delhi",
    city: "New Delhi",
    stream: "Architecture",
    courses: ["B.Arch"],
    specializations: ["Urban Design"],
    exams: ["JEE Main", "NATA"],
    feeRange: "₹2.1 Lakhs/Yr",
    fees: 2.1,
    rating: 4.7,
    nirfRank: 4,
    type: "Public",
    description:
      "SPA Delhi is a premier higher education institute in architecture and planning.",
    logoText: "SPA",
    slug: "spa-delhi",
    accreditation: "COA Approved",
    programMode: "Offline",
    courseTypes: ["Bachelors"],
    affiliation: "Autonomous",
    approvals: ["UGC"],
  },
  {
    id: "la1",
    name: "Symbiosis Law School (SLS) Pune",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    city: "Pune",
    stream: "Law",
    courses: ["BA LLB"],
    specializations: ["Corporate Law"],
    exams: ["SLAT"],
    feeRange: "₹3.8 Lakhs/Yr",
    fees: 3.8,
    rating: 4.6,
    nirfRank: 6,
    type: "Private",
    description:
      "SLS Pune is one of the most prominent private law schools in India.",
    logoText: "SLS",
    slug: "sls-pune",
    accreditation: "BCI Approved",
    programMode: "Offline",
    courseTypes: ["Bachelors"],
    affiliation: "Symbiosis International",
    approvals: ["UGC"],
  },
  {
    id: "de1",
    name: "National Institute of Fashion Technology (NIFT) Patna",
    location: "Patna, Bihar",
    state: "Bihar",
    city: "Patna",
    stream: "Design",
    courses: ["B.Des"],
    specializations: ["Fashion Design"],
    exams: ["NIFT Entrance"],
    feeRange: "₹2.8 Lakhs/Yr",
    fees: 2.8,
    rating: 4.5,
    nirfRank: 11,
    type: "Public",
    description:
      "NIFT Patna offers top-tier fashion education under Ministry of Textiles.",
    logoText: "NIFT",
    slug: "nift-patna",
    accreditation: "Autonomous",
    programMode: "Offline",
    courseTypes: ["Bachelors"],
    affiliation: "Autonomous",
    approvals: ["UGC"],
  },
  {
    id: "pa1",
    name: "Government Paramedical College",
    location: "Bangalore, Karnataka",
    state: "Karnataka",
    city: "Bangalore",
    stream: "Paramedical",
    courses: ["B.Sc Nursing"],
    specializations: ["General Nursing"],
    exams: ["KCET"],
    feeRange: "₹85,000/Yr",
    fees: 0.85,
    rating: 4.4,
    nirfRank: 50,
    type: "Public",
    description:
      "A premier public institution offering medical laboratory and allied healthcare courses.",
    logoText: "GPC",
    slug: "govt-paramedical-college",
    accreditation: "INC Approved",
    programMode: "Offline",
    courseTypes: ["Bachelors"],
    affiliation: "RGUHS",
    approvals: ["UGC"],
  },
];

const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

function CollegesListContent() {
  const searchParams = useSearchParams();

  // Search & Filter state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [discoveredCities, setDiscoveredCities] = useState<string[]>([]);
  const [discoveredStates, setDiscoveredStates] = useState<string[]>([]);
  const [discoveredStreams, setDiscoveredStreams] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [shortlisted, setShortlisted] = useState<string[]>([]);

  // Admin Login and Card Editing States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [editingCollege, setEditingCollege] = useState<any | null>(null);

  // Prefilled Edit Fields
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editOwnership, setEditOwnership] = useState("");
  const [editRating, setEditRating] = useState("");
  const [editNIRFRank, setEditNIRFRank] = useState("");
  const [editCoursesCount, setEditCoursesCount] = useState("");
  const [editExamsAccepted, setEditExamsAccepted] = useState("");
  const [editTuitionFees, setEditTuitionFees] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAccreditation, setEditAccreditation] = useState("");

  const [isUpdatingCollege, setIsUpdatingCollege] = useState(false);

  // States for Add College operation
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addLocation, setAddLocation] = useState("");
  const [addCity, setAddCity] = useState("");
  const [addState, setAddState] = useState("");
  const [addOwnership, setAddOwnership] = useState("Private");
  const [addRating, setAddRating] = useState("4.0");
  const [addNIRFRank, setAddNIRFRank] = useState("");
  const [addCoursesCount, setAddCoursesCount] = useState("1 Courses");
  const [addExamsAccepted, setAddExamsAccepted] = useState("None");
  const [addTuitionFees, setAddTuitionFees] = useState("-/-");
  const [addImageUrl, setAddImageUrl] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addAccreditation, setAddAccreditation] = useState("AICTE Approved");
  const [isAddingCollege, setIsAddingCollege] = useState(false);
  const [hiddenAds, setHiddenAds] = useState<number[]>([]);
  const [closedGoogleAds, setClosedGoogleAds] = useState<number[]>([]);
  const [isFlipkartAdClosed, setIsFlipkartAdClosed] = useState(false);
  const [closedFlipkartGoogleAd, setClosedFlipkartGoogleAd] = useState(false);

  const handleDeleteCollege = async (college: any) => {
    if (
      !window.confirm(
        `Are you absolutely sure you want to delete ${college.name} permanently? This will remove it from Supabase.`,
      )
    )
      return;
    try {
      const res = await fetch("/api/colleges/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Samrat1311",
          password: "1311161161",
          slug: college.slug,
        }),
      });

      if (res.ok) {
        setCollegesList((prevList) =>
          prevList.filter((c) => c.id !== college.id),
        );
        setTotalCount((prev) => prev - 1);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete college.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error deleting college.");
    }
  };

  const handleAddCollegeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingCollege(true);

    const formattedName = addName.trim();
    const formattedLocation = toTitleCase(addLocation);
    const formattedCity = toTitleCase(addCity);
    const formattedState = toTitleCase(addState);

    // Generate slug
    const slug = formattedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Serialize description and accreditation
    const serializedDesc = JSON.stringify({
      description: addDescription,
      accreditation: addAccreditation,
    });

    try {
      const res = await fetch("/api/colleges/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Samrat1311",
          password: "1311161161",
          collegeData: {
            name: formattedName,
            location: formattedLocation,
            city: formattedCity,
            state: formattedState,
            ownership: addOwnership,
            rating: addRating,
            nirf_rank: addNIRFRank || "N/A",
            courses_count: addCoursesCount,
            exams_accepted: addExamsAccepted,
            tuition_fees: addTuitionFees,
            image_url: addImageUrl,
            description: serializedDesc,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newCol = data.college;
        if (newCol) {
          const examsArr = addExamsAccepted
            ? addExamsAccepted.split(",").map((e) => e.trim())
            : [];
          const logo = formattedName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .substring(0, 3)
            .toUpperCase();

          setCollegesList((prev) => [
            {
              id: newCol.id,
              name: formattedName,
              location: formattedLocation,
              state: formattedState,
              city: formattedCity,
              stream: getStreamFromCollegeName(formattedName),
              courses: [addCoursesCount || "Courses"],
              specializations: [],
              exams: examsArr.length > 0 ? examsArr : ["None"],
              feeRange: addTuitionFees,
              fees: 0,
              rating: parseFloat(addRating) || 4.0,
              nirfRank: addNIRFRank
                ? parseInt(addNIRFRank.replace(/[^0-9]/g, ""))
                : undefined,
              type: addOwnership,
              description: addDescription,
              logoText: logo || "COL",
              slug: slug,
              accreditation: addAccreditation,
              image_url: addImageUrl,
            },
            ...prev,
          ]);
          setTotalCount((prev) => prev + 1);
        }
        setShowAddModal(false);
        // Reset form
        setAddName("");
        setAddLocation("");
        setAddCity("");
        setAddState("");
        setAddOwnership("Private");
        setAddRating("4.0");
        setAddNIRFRank("");
        setAddCoursesCount("1 Courses");
        setAddExamsAccepted("None");
        setAddTuitionFees("-/-");
        setAddImageUrl("");
        setAddDescription("");
        setAddAccreditation("AICTE Approved");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add college.");
      }
    } catch (err) {
      console.error("Add error:", err);
      alert("Network error adding college.");
    } finally {
      setIsAddingCollege(false);
    }
  };

  // Initialize Admin State from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAdmin = localStorage.getItem("think_college_admin");
      if (savedAdmin === "true") {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === "Samrat1311" && adminPass === "1311161161") {
      setIsAdmin(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("think_college_admin", "true");
      }
      setShowAdminLogin(false);
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

  const startEditing = (college: any) => {
    setEditingCollege(college);
    setEditName(college.name);
    setEditLocation(college.location || "");
    setEditCity(college.city || "");
    setEditState(college.state || "");
    setEditOwnership(college.type || "Private");
    setEditRating(college.rating.toString());
    setEditNIRFRank(college.nirfRank ? college.nirfRank.toString() : "");
    setEditCoursesCount(
      college.courses && college.courses[0] ? college.courses[0] : "",
    );
    setEditExamsAccepted(
      college.exams && college.exams[0] !== "None"
        ? college.exams.join(", ")
        : "",
    );
    setEditTuitionFees(college.feeRange || "");
    setEditImageUrl(college.image_url || "");
    setEditDescription(college.description || "");
    setEditAccreditation(college.accreditation || "AICTE Approved");
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollege) return;
    setIsUpdatingCollege(true);

    const formattedName = editName.trim();
    const formattedLocation = toTitleCase(editLocation);
    const formattedCity = toTitleCase(editCity);
    const formattedState = toTitleCase(editState);

    try {
      const serializedDesc = JSON.stringify({
        description: editDescription,
        accreditation: editAccreditation,
      });

      const res = await fetch("/api/colleges/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Samrat1311",
          password: "1311161161",
          slug: editingCollege.slug,
          updatedFields: {
            name: formattedName,
            location: formattedLocation,
            city: formattedCity,
            state: formattedState,
            ownership: editOwnership,
            rating: editRating,
            nirf_rank: editNIRFRank || "N/A",
            courses_count: editCoursesCount,
            exams_accepted: editExamsAccepted,
            tuition_fees: editTuitionFees,
            image_url: editImageUrl,
            description: serializedDesc,
          },
        }),
      });

      if (res.ok) {
        // Mutate local state array instantly
        setCollegesList((prevList) =>
          prevList.map((c) => {
            if (c.id === editingCollege.id) {
              const examsArr = editExamsAccepted
                ? editExamsAccepted.split(",").map((e) => e.trim())
                : [];
              return {
                ...c,
                name: formattedName,
                location: formattedLocation,
                city: formattedCity,
                state: formattedState,
                type: editOwnership,
                rating: parseFloat(editRating) || 4.2,
                nirfRank: editNIRFRank
                  ? parseInt(editNIRFRank.replace(/[^0-9]/g, ""))
                  : undefined,
                courses: [editCoursesCount || "Courses"],
                exams: examsArr.length > 0 ? examsArr : ["None"],
                feeRange: editTuitionFees,
                image_url: editImageUrl,
                description: editDescription,
                accreditation: editAccreditation,
              };
            }
            return c;
          }),
        );
        setEditingCollege(null);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update college details.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error updating college details.");
    } finally {
      setIsUpdatingCollege(false);
    }
  };

  // New filters states from GetMyUni screenshots
  const [selectedProgramModes, setSelectedProgramModes] = useState<string[]>(
    [],
  );
  const [selectedOwnerships, setSelectedOwnerships] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>(
    [],
  );
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [selectedFeesRanges, setSelectedFeesRanges] = useState<string[]>([]);

  // Toggle state for sidebar filter accordions
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    state: true,
    city: true,
    stream: true,
    course: true,
    specialization: true,
    programMode: true,
    ownership: true,
    exam: true,
    courseType: true,
    affiliation: true,
    approval: true,
    feesRange: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const checkUserAuth = () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("tyc-user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      if ((window as any).openTYCAuthModal) {
        (window as any).openTYCAuthModal("login");
      }
    }
    return null;
  };

  const getStreamFromCollegeName = (name: string): string => {
    const n = name.toLowerCase();
    if (
      n.includes("iim") ||
      n.includes("management") ||
      n.includes("business") ||
      n.includes("mba") ||
      n.includes("pgdm") ||
      n.includes("sibm") ||
      n.includes("spjimr") ||
      n.includes("mdi")
    )
      return "Management";
    if (
      n.includes("iit") ||
      n.includes("nit") ||
      n.includes("engineering") ||
      n.includes("technology") ||
      n.includes("b.tech") ||
      n.includes("rvce") ||
      n.includes("college of engineering")
    )
      return "Engineering";
    if (
      n.includes("aiims") ||
      n.includes("medical") ||
      n.includes("hospital") ||
      n.includes("mbbs") ||
      n.includes("kmc") ||
      n.includes("vellore") ||
      n.includes("kasturba")
    )
      return "Medical";
    if (n.includes("nift") || n.includes("nid") || n.includes("design"))
      return "Design";
    if (n.includes("law") || n.includes("nlsiu") || n.includes("nalsar"))
      return "Law";
    if (
      n.includes("pharmacy") ||
      n.includes("b.pharm") ||
      n.includes("m.pharm") ||
      n.includes("niper")
    )
      return "Pharmacy";
    if (n.includes("paramedical") || n.includes("nursing"))
      return "Paramedical";
    if (
      n.includes("architecture") ||
      n.includes("b.arch") ||
      n.includes("planning")
    )
      return "Architecture";
    if (n.includes("hotel") || n.includes("hospitality"))
      return "Hotel Management";
    if (n.includes("veterinary")) return "Veterinary";
    if (
      n.includes("commerce") ||
      n.includes("bcom") ||
      n.includes("mcom") ||
      n.includes("b.com") ||
      n.includes("m.com")
    )
      return "Commerce";
    if (
      n.includes("science") ||
      n.includes("bsc") ||
      n.includes("msc") ||
      n.includes("b.sc") ||
      n.includes("m.sc")
    )
      return "Science";
    if (n.includes("arts") || n.includes("fine arts")) return "Arts";
    if (n.includes("computer") || n.includes("mca")) return "Computer";
    if (n.includes("dental") || n.includes("bds")) return "Dental";
    if (n.includes("education") || n.includes("b.ed")) return "Education";
    return "Engineering"; // default fallback
  };

  // Local filter search options states
  const [stateFilterSearch, setStateFilterSearch] = useState("");
  const [cityFilterSearch, setCityFilterSearch] = useState("");
  const [courseFilterSearch, setCourseFilterSearch] = useState("");
  const [specFilterSearch, setSpecFilterSearch] = useState("");
  const [progSearch, setProgSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [examSearch, setExamSearch] = useState("");
  const [courseTypeSearch, setCourseTypeSearch] = useState("");
  const [affSearch, setAffSearch] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const [feesSearch, setFeesSearch] = useState("");
  const [streamFilterSearch, setStreamFilterSearch] = useState("");

  // Static options lists for UI checkboxes (GetMyUni match)
  const programModeOptions = [
    { name: "Offline", count: 12802 },
    { name: "Distance Education", count: 117 },
    { name: "Online", count: 108 },
  ];
  const ownershipOptions = [
    { name: "Private", count: 9978 },
    { name: "Public", count: 1811 },
  ];
  const examOptions = [
    { name: "Jee Main", count: 616 },
    { name: "CAT", count: 600 },
    { name: "NEET", count: 296 },
    { name: "CMAT", count: 249 },
    { name: "AP EAMCET", count: 221 },
    { name: "NATA", count: 177 },
    { name: "GATE", count: 175 },
    { name: "MAT", count: 171 },
    { name: "TS EAMCET", count: 163 },
    { name: "ATMA", count: 120 },
    { name: "KEAM", count: 119 },
    { name: "XAT", count: 114 },
    { name: "TANCET", count: 111 },
    { name: "Karnataka PGCET", count: 88 },
    { name: "GMAT", count: 85 },
    { name: "MHT CET", count: 64 },
    { name: "WBJEE", count: 63 },
    { name: "AP PGECET", count: 58 },
    { name: "AP ICET", count: 55 },
    { name: "OJEE", count: 55 },
    { name: "NEET MDS", count: 53 },
    { name: "GPAT", count: 52 },
    { name: "KCET", count: 52 },
    { name: "KMAT", count: 50 },
    { name: "TS ICET", count: 49 },
    { name: "MAH MBA/MMS CET", count: 48 },
    { name: "CLAT", count: 32 },
    { name: "COMEDK UGET", count: 27 },
    { name: "UGC NET", count: 26 },
    { name: "IIT JAM", count: 24 },
    { name: "UPTU", count: 24 },
    { name: "IPU CET", count: 23 },
    { name: "NEET PG", count: 23 },
    { name: "CUET", count: 21 },
    { name: "TNEA", count: 20 },
    { name: "NIFT", count: 19 },
    { name: "NMAT", count: 19 },
    { name: "GUJCET", count: 17 },
    { name: "GRE", count: 15 },
    { name: "LEET", count: 14 },
    { name: "CG PET", count: 13 },
    { name: "MAH CET", count: 12 },
    { name: "SNAP", count: 12 },
    { name: "JEE Advanced", count: 11 },
    { name: "DU JAT", count: 9 },
    { name: "IBSAT", count: 9 },
    { name: "Assam CEE", count: 8 },
    { name: "JEMAT", count: 8 },
    { name: "SRMJEEE", count: 8 },
    { name: "UCEED", count: 8 },
    { name: "BCECE", count: 7 },
    { name: "CSIR NET", count: 7 },
    { name: "AILET", count: 6 },
    { name: "GCET", count: 6 },
    { name: "LSAT", count: 6 },
    { name: "NIMCET", count: 6 },
    { name: "CEED", count: 5 },
    { name: "HPCET", count: 5 },
    { name: "JCECE", count: 5 },
    { name: "JELET", count: 5 },
    { name: "JEXPO", count: 5 },
    { name: "NID", count: 5 },
    { name: "SET", count: 5 },
    { name: "TS PGECET", count: 5 },
    { name: "AIIMS MBBS", count: 4 },
    { name: "AIPVT", count: 4 },
    { name: "Amity JEE", count: 4 },
    { name: "CUET PG", count: 4 },
    { name: "Jain Entrance Test", count: 4 },
    { name: "MAH MCA CET", count: 4 },
    { name: "REAP", count: 4 },
    { name: "UPCET", count: 4 },
    { name: "MAHE-OET", count: 3 },
    { name: "NEET SS", count: 3 },
    { name: "NPAT", count: 3 },
    { name: "RMCAAT", count: 3 },
    { name: "ACPC Gujarat", count: 2 },
    { name: "AIEED", count: 2 },
    { name: "AP Polycet", count: 2 },
    { name: "ATIT", count: 2 },
    { name: "AUSAT", count: 2 },
    { name: "BITSAT", count: 2 },
    { name: "BVP CET", count: 2 },
    { name: "CETPPMC", count: 2 },
    { name: "CG PPT", count: 2 },
    { name: "CUEE", count: 2 },
    { name: "GITAM GAT", count: 2 },
    { name: "ICAR AIEEA", count: 2 },
    { name: "IEMJEE", count: 2 },
    { name: "IMUCET", count: 2 },
    { name: "JEECUP", count: 2 },
    { name: "JKCET", count: 2 },
    { name: "KIITEE", count: 2 },
    { name: "MRNAT", count: 2 },
    { name: "NMIMS LAT", count: 2 },
    { name: "OUCET", count: 2 },
    { name: "PUCET", count: 2 },
    { name: "SAAT", count: 2 },
    { name: "SAT Exam", count: 2 },
    { name: "Tripura JEE", count: 2 },
    { name: "AEEE", count: 1 },
    { name: "AIAPGET", count: 1 },
    { name: "AIFSET", count: 1 },
    { name: "AIPGDEE", count: 1 },
    { name: "AIPMT", count: 1 },
    { name: "AISEEE", count: 1 },
    { name: "AMIETE", count: 1 },
    { name: "AMMI MBA MMS CET", count: 1 },
    { name: "ANUPGCET", count: 1 },
    { name: "AP EDCET", count: 1 },
    { name: "AP LAWCET", count: 1 },
    { name: "AUCET", count: 1 },
    { name: "AUMAT", count: 1 },
    { name: "bgu-entrance-test", count: 1 },
    { name: "BHU PET", count: 1 },
    { name: "BHU UET", count: 1 },
    { name: "BLAT", count: 1 },
    { name: "BUMAT", count: 1 },
    { name: "CEE AMPAI", count: 1 },
    { name: "CG PPHT", count: 1 },
    { name: "CG Pre MCA", count: 1 },
    { name: "CLAT PG", count: 1 },
    { name: "CUSATCAT", count: 1 },
    { name: "DCET", count: 1 },
    { name: "DECODE Exam", count: 1 },
    { name: "DSAT", count: 1 },
    { name: "GATA", count: 1 },
    { name: "GEEE", count: 1 },
    { name: "GITAM GOT", count: 1 },
    { name: "GLAET", count: 1 },
    { name: "Gujarat PGCET", count: 1 },
    { name: "GVSAT", count: 1 },
    { name: "HITSCAT", count: 1 },
    { name: "HITSEEE", count: 1 },
    { name: "ICMR JRF", count: 1 },
    { name: "IELTS", count: 1 },
    { name: "IGNOU OPENMAT", count: 1 },
    { name: "IIITH PGEE", count: 1 },
    { name: "IMS DIA DEE", count: 1 },
    { name: "JEST", count: 1 },
    { name: "JKLU DET", count: 1 },
    { name: "JUEE", count: 1 },
    { name: "KMAT Kerala", count: 1 },
    { name: "KUAT", count: 1 },
    { name: "LPUNEST", count: 1 },
    { name: "LUMET", count: 1 },
    { name: "MAH BEd CET", count: 1 },
    { name: "MET Exam", count: 1 },
    { name: "MGU CAT", count: 1 },
    { name: "MH CET Law", count: 1 },
    { name: "NCHMCT JEE", count: 1 },
    { name: "NMIMS CET", count: 1 },
    { name: "PAT Exam", count: 1 },
    { name: "Pearl Academy Entrance Exam", count: 1 },
    { name: "PTET", count: 1 },
    { name: "PU LLB", count: 1 },
    { name: "RULET", count: 1 },
    { name: "SAEEE", count: 1 },
    { name: "SEED", count: 1 },
    { name: "SGTUEE", count: 1 },
    { name: "SNUSAT", count: 1 },
    { name: "SUAT", count: 1 },
    { name: "SVNIRTAR CET", count: 1 },
    { name: "TS ECET", count: 1 },
    { name: "UID Design Aptitude Test", count: 1 },
    { name: "UKSEE", count: 1 },
    { name: "UPESPAT", count: 1 },
    { name: "VEE", count: 1 },
    { name: "VGUCET", count: 1 },
    { name: "VITEEE", count: 1 },
    { name: "VTUEEE", count: 1 },
    { name: "JENPAUH", count: 1 },
  ];
  const courseTypeOptions = [
    { name: "Bachelors", count: 11140 },
    { name: "Masters", count: 8297 },
    { name: "Doctorate", count: 2055 },
    { name: "Postgraduate Diploma", count: 1758 },
    { name: "Diploma", count: 627 },
    { name: "Certificate", count: 100 },
    { name: "Postgraduate Certificate", count: 64 },
  ];
  const affiliationOptions = [
    { name: "Anna University, Chennai", count: 451 },
    {
      name: "JNTUH - Jawaharlal Nehru Technological University, Hyderabad",
      count: 292,
    },
    { name: "Savitribai Phule Pune University [SPPU], Pune", count: 289 },
    { name: "University of Mumbai [UM] Mumbai", count: 225 },
    { name: "Calicut University, Calicut", count: 203 },
    { name: "Bangalore University, [BU] Bangalore", count: 189 },
    { name: "Maharshi Dayanand University, [MDU] Rohtak", count: 189 },
    { name: "VTU - Visvesvaraya Technological University", count: 189 },
    { name: "MGU Kerala - Mahatma Gandhi University", count: 167 },
    { name: "RGUHS - Rajiv Gandhi University of Health Sciences", count: 159 },
    { name: "KUK - Kurukshetra University", count: 154 },
    { name: "Jawaharlal Nehru Technological University, Kakinada", count: 152 },
    { name: "Gujarat Technological University", count: 150 },
    { name: "I.K Gujral Punjab Technical University (PTU)", count: 150 },
    { name: "CCSU - Chaudhary Charan Singh University", count: 148 },
    {
      name: "Tamil Nadu Teachers Education University, [TNTEU] Chennai",
      count: 138,
    },
    { name: "Uttar Pradesh Technical University, [UPTU] Lucknow", count: 136 },
    { name: "RTU - Rajasthan Technical University", count: 134 },
    { name: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)", count: 128 },
    { name: "Kerala University of Health Sciences", count: 128 },
    {
      name: "Maulana Abul Kalam Azad University of Technology [MAKAUT]",
      count: 124,
    },
    { name: "Biju Patnaik University of Technology", count: 119 },
    { name: "Osmania University", count: 118 },
    { name: "Rashtrasant Tukadoji Maharaj Nagpur University", count: 115 },
    { name: "Kerala University, [KU] Trivandrum", count: 113 },
    { name: "University of Calcutta, [UC] Kolkata", count: 105 },
    { name: "Shivaji University, [SUK] Kolhapur", count: 89 },
    { name: "Gauhati University, Guwahati", count: 85 },
    {
      name: "Guru Gobind Singh Indraprastha University, [GGSIPU] New Delhi",
      count: 84,
    },
    { name: "Delhi University [DU]", count: 82 },
    { name: "Bharathiar University, [BU] Coimbatore", count: 81 },
    { name: "DAVV - Devi Ahilya Vishwavidyalaya", count: 79 },
    { name: "Gujarat University, Ahmedabad", count: 77 },
    { name: "Panjab University, Chandigarh", count: 75 },
    { name: "University of Rajasthan, [UR] Jaipur", count: 73 },
    { name: "University of Madras, Chennai", count: 70 },
    {
      name: "JNTUA - Jawaharlal Nehru Technological University, Anantapur",
      count: 68,
    },
    { name: "The Tamil Nadu Dr. M.G.R. Medical University", count: 65 },
    { name: "University of Burdwan, [UB] Bardhaman", count: 64 },
    { name: "Barkatullah University, [BU] Bhopal", count: 63 },
    { name: "Guru Nanak Dev University", count: 60 },
    { name: "Andhra University, Visakhapatnam", count: 59 },
    { name: "Mangalore University, [MU] Mangalore", count: 59 },
    { name: "HPU - Himachal Pradesh University Shimla", count: 56 },
    { name: "MJPRU - Mahatma Jyotiba Phule Rohilkhand University", count: 56 },
    { name: "MUHS - Maharashtra University of Health Sciences", count: 55 },
    { name: "University of Jammu, Jammu", count: 55 },
    { name: "Acharya Nagarjuna University", count: 50 },
    { name: "Kannur University, [KU] Kannur", count: 50 },
    { name: "Dr Bhim Rao Ambedkar University, [DBRAU] Agra", count: 48 },
    { name: "UTU - Uttarakhand Technical University", count: 48 },
    { name: "Lucknow University", count: 47 },
    {
      name: "Chhatrapati Sahu Ji Maharaj University [CSJMU], Kanpur",
      count: 46,
    },
    { name: "Dibrugarh University, Dibrugarh", count: 46 },
    { name: "Pondicherry University, Puducherry", count: 45 },
    { name: "Utkal University, [UU] Bhubaneshwar", count: 45 },
    { name: "Baba Farid University of Health Sciences", count: 44 },
    {
      name: "CSVTU - Chhattisgarh Swami Vivekanand Technical University",
      count: 43,
    },
    { name: "Sant Gadge Baba Amravati University", count: 41 },
    {
      name: "Dr Babasaheb Ambedkar Marathwada University, [DBAMU] Aurangabad",
      count: 40,
    },
    { name: "Dr. NTR University of Health Sciences", count: 39 },
    {
      name: "NMU - Kavayitri Bahinabai Chaudhari North Maharashtra University",
      count: 38,
    },
    { name: "Dr. Ram Manohar Lohia Avadh University", count: 37 },
    { name: "University of Kalyani, Kalyani", count: 35 },
    { name: "Karnataka State Law University", count: 34 },
    { name: "Bharathidasan University, [BU] Tiruchirappalli", count: 33 },
    { name: "HNBGU - Hemvati Nandan Bahuguna Garhwal University", count: 33 },
    { name: "RDVV - Rani Durgavati Vishwavidyalaya", count: 33 },
    { name: "University of Mysore, [UM] Mysore", count: 33 },
    { name: "Veer Narmad South Gujarat University", count: 31 },
    { name: "Madurai Kamaraj University, [MKU] Madurai", count: 30 },
    { name: "Jiwaji University, Gwalior", count: 28 },
    {
      name: "Makhanlal Chaturvedi National University of Journalism and Communication - MCNUJC",
      count: 28,
    },
    { name: "Kakatiya University", count: 27 },
    { name: "Vidyasagar University, [VU] Midnapore", count: 27 },
    { name: "AKU - Aryabhatta Knowledge University", count: 26 },
    { name: "Kumaun University, Nainital", count: 26 },
    {
      name: "Pandit Bhagwat Dayal Sharma University of Health Sciences",
      count: 26,
    },
    {
      name: "WBUHS - The West Bengal University of Health Sciences",
      count: 26,
    },
    { name: "Sardar Patel University, Vallabh Vidyanagar, Gujarat", count: 25 },
    { name: "Karnatak University Dharwad", count: 24 },
    { name: "SIU Pune - Symbiosis International", count: 24 },
    { name: "VBU - Vinoba Bhave University", count: 24 },
    { name: "West Bengal State University, [WBSU] Barasat", count: 24 },
    { name: "CUSAT - Cochin University of Science and Technology", count: 23 },
    { name: "Magadh University, Gaya", count: 23 },
    { name: "North Bengal University", count: 23 },
    { name: "Goa University, [GU] North Goa", count: 22 },
    { name: "Rani Channamma University", count: 22 },
    { name: "HNGU - Hemchandracharya North Gujarat University", count: 21 },
    { name: "Kashmir University, Srinagar", count: 21 },
    {
      name: "Indira Gandhi National Open University, [IGNOU] New Delhi",
      count: 20,
    },
    { name: "SVU - Sri Venkateswara University", count: 20 },
    { name: "Manonmaniam Sundaranar University, [MSU] Tirunelveli", count: 19 },
    { name: "Saurashtra University, [SU] Rajkot", count: 19 },
    { name: "SRTMUN - Swami Ramanand Teerth Marathwada University", count: 19 },
    { name: "Bharati Vidyapeeth Deemed University Pune", count: 18 },
    {
      name: "GJUST - Guru Jambheshwar University of Science And Technology",
      count: 17,
    },
    { name: "HPTU - Himachal Pradesh Technical University", count: 17 },
    { name: "Mahatma Gandhi Kashi Vidyapith - MGKVP", count: 17 },
    { name: "MLSU - Mohanlal Sukhadia University", count: 17 },
    { name: "Solapur University, [SU] Solapur", count: 17 },
    { name: "University of Gour Banga", count: 17 },
    { name: "Thiruvalluvar University, Vellore", count: 16 },
    { name: "Adikavi Nannaya University, [ANU] Rajamundhry", count: 15 },
    { name: "Gulbarga University, [GU] Gulbarga", count: 15 },
    { name: "Maharaja Ganga Singh University, Bikaner", count: 15 },
    { name: "Periyar University, [PU] Salem", count: 15 },
    { name: "PRSU - Pandit Ravishankar Shukla University", count: 15 },
    { name: "Ranchi University, [RU] Ranchi", count: 15 },
    {
      name: "Pt. Deendayal Upadhyay Memorial Health Sciences and Ayush University, Raipur",
      count: 14,
    },
    { name: "LNMU - Lalit Narayan Mithila University", count: 14 },
    { name: "Manipur University, [MU] Imphal", count: 14 },
    { name: "Nagaland University - Kohima Campus", count: 14 },
    { name: "Vikram University, [VU] Ujjain", count: 14 },
    {
      name: "DCRUST - Deenbandhu Chhotu Ram University of Science and Technology",
      count: 13,
    },
    { name: "JNVU - Jai Narain Vyas University", count: 13 },
    { name: "KSOU - Karnataka State Open University", count: 13 },
    { name: "Kolhan University, Jamshedpur", count: 13 },
    { name: "SNDT Women's University, Juhu", count: 13 },
    { name: "Bundelkhand University, Jhansi", count: 12 },
    { name: "CDLU - Chaudhary Devi Lal University", count: 12 },
    { name: "Krantiguru Shyamji Krishna Verma Kachchh University", count: 12 },
    { name: "Kaloji Narayana Rao University of Health Science", count: 12 },
    { name: "Krishna University, [KU] Machilipatnam", count: 12 },
    { name: "Maharshi Dayanand Saraswati University, [MDSU] Ajmer", count: 12 },
    { name: "Manipal Academy of Higher Education, [MAHE] Manipal", count: 11 },
    { name: "VBSPU - Veer Bahadur Singh Purvanchal University", count: 11 },
    { name: "Sikkim Manipal University, [SMU] East Sikkim", count: 11 },
    { name: "Tamil Nadu Agricultural University", count: 11 },
    { name: "Berhampur University, Berhampur", count: 10 },
    { name: "Bhavnagar University, Bhavnagar", count: 10 },
    { name: "Gondwana University, [GU] Gadchiroli", count: 10 },
    { name: "KTU - APJ Abdul Kalam Technological University", count: 9 },
    { name: "DDU - Deen Dayal Upadhyaya Gorakhpur University", count: 9 },
    { name: "Dr. Harisingh Gour Vishwavidyalaya", count: 9 },
    { name: "Jai Prakash University, Chapra", count: 9 },
    { name: "Kuvempu University", count: 9 },
    { name: "Tripura University, [TU] West Tripura", count: 9 },
    { name: "Amity University, Noida", count: 8 },
    { name: "Davangere University", count: 8 },
    { name: "GITAM University Visakhapatnam Campus, Visakhapatnam", count: 8 },
    { name: "MPKV - Mahatma Phule Krishi Vidyapeeth", count: 8 },
    { name: "North Eastern Hill University, Shillong", count: 8 },
    { name: "Assam University, Silchar", count: 7 },
    { name: "Guru Ravidas Ayurved University, Hoshiarpur", count: 7 },
    {
      name: "JNAFAU - Jawaharlal Nehru Architecture And Fine Arts University",
      count: 7,
    },
    { name: "Satavahana University, [SU] Machilipatnam", count: 7 },
    {
      name: "Srimanta Sankaradeva University of Health Sciences [SSUHS] Guwahati",
      count: 7,
    },
    { name: "Ahmedabad University", count: 6 },
    {
      name: "Bhakta Kavi Narsinh Mehta University (BKNMU), Junagadh",
      count: 6,
    },
    { name: "Bhupendra Narayan Mandal University", count: 6 },
    { name: "BR AMBEDKAR BIHAR UNIVERSITY - [BRABU]", count: 6 },
    { name: "Ganpat University, Mehsana", count: 6 },
    { name: "KIIT University, Bhubaneswar", count: 6 },
    { name: "Mahatma Gandhi University, Telangana", count: 6 },
    { name: "Nirma University, [NU] Ahmedabad", count: 6 },
    { name: "Patna University, Patna", count: 6 },
    { name: "Sri Dev Suman Uttarakhand University [SDSUV], Tehri", count: 6 },
    { name: "Vikrama Simhapuri University", count: 6 },
    { name: "Vinayaka Mission's Research Foundation - VMU", count: 6 },
    { name: "Alagappa University, [AU] Karaikudi", count: 5 },
    { name: "Amrita Vishwa Vidyapeetham, Coimbatore", count: 5 },
    { name: "Banaras Hindu University, [BHU] Varanasi", count: 5 },
    { name: "APSU - Awadhesh Pratap Singh University", count: 5 },
    { name: "Chitkara University, Himachal Pradesh", count: 5 },
    { name: "Fakir Mohan University - FMU", count: 5 },
    { name: "IMU Chennai Indian Maritime University (IMUC)", count: 5 },
    { name: "Mother Teresa Women'S University - MTWU", count: 5 },
    { name: "Patliputra University, Patna", count: 5 },
    {
      name: "Rajasthan University of Veterinary and Animal Sciences",
      count: 5,
    },
    { name: "Sikkim University, [SU] Gangtok", count: 5 },
    { name: "Tamil Nadu Open University, [TNOU] Chennai", count: 5 },
    { name: "Teerthanker Mahaveer University", count: 5 },
    { name: "Tumkur University, [TU] Tumkur", count: 5 },
    { name: "University of Kota, [UK] Kota", count: 5 },
    { name: "Bharath University, Chennai", count: 4 },
    {
      name: "Hemwati Nandan Bahuguna Uttarakhand Medical Education University [HNBUMU], Dehradun",
      count: 4,
    },
    { name: "Indus University", count: 4 },
    { name: "KAU - Kerala Agricultural University", count: 4 },
    { name: "Mizoram University", count: 4 },
    { name: "Surguja University, Surguja", count: 4 },
    { name: "SVSU - Swami Vivekanand Subharti University", count: 4 },
    { name: "TMBU - Tilka Manjhi Bhagalpur University", count: 4 },
    { name: "Amity University, Gwalior", count: 3 },
    {
      name: "Dr. Babasaheb Ambedkar Open University (BAOU), Ahmedabad",
      count: 3,
    },
    { name: "PDKV - Dr Panjabrao Deshmukh Krishi Vidyapeeth", count: 3 },
    {
      name: "Dr. Sarvepalli Radhakrishnan Rajasthan Ayurved University",
      count: 3,
    },
    { name: "GGU - Guru Ghasidas Vishwavidyalaya", count: 3 },
    { name: "Kadi Sarva Vishwavidyalaya", count: 3 },
    { name: "Karnataka State Akkamahadevi Women's University", count: 3 },
    { name: "KLE University, [KLEU] Belgaum", count: 3 },
    { name: "Maharishi Markandeshwar University, Mullana", count: 3 },
    { name: "Mangalayatan University", count: 3 },
    { name: "Rajiv Gandhi University - RGU", count: 3 },
    { name: "Sri Krishnadevaraya University", count: 3 },
    { name: "Sushant University", count: 3 },
    { name: "Tamil Nadu Dr Ambedkar Law University [TNDALU]", count: 3 },
  ];
  const approvalOptions = [
    { name: "AICTE", count: 5005 },
    { name: "UGC", count: 2171 },
    { name: "PCI", count: 316 },
    { name: "MHRD", count: 154 },
    { name: "KNC", count: 22 },
    { name: "CCH", count: 1 },
  ];
  const feesRangeOptions = [
    { name: "Less than 1 Lakh", count: 1866 },
    { name: "1 to 2 Lakhs", count: 1596 },
    { name: "2 to 3 Lakhs", count: 1054 },
    { name: "3 to 5 Lakhs", count: 1095 },
    { name: "More than 5 Lakhs", count: 1053 },
  ];

  const STATIC_stateOptions = [
    { name: "Maharashtra", count: 1698 },
    { name: "Tamil Nadu", count: 1299 },
    { name: "Uttar Pradesh", count: 1294 },
    { name: "Karnataka", count: 1214 },
    { name: "Kerala", count: 864 },
    { name: "West Bengal", count: 684 },
    { name: "Telangana", count: 655 },
    { name: "Gujarat", count: 629 },
    { name: "Haryana", count: 588 },
    { name: "Andhra Pradesh", count: 574 },
    { name: "Punjab", count: 574 },
    { name: "Madhya Pradesh", count: 553 },
    { name: "Rajasthan", count: 541 },
    { name: "Delhi NCR", count: 410 },
    { name: "Odisha", count: 329 },
    { name: "Uttarakhand", count: 217 },
    { name: "Bihar", count: 207 },
    { name: "Assam", count: 194 },
    { name: "Chhattisgarh", count: 163 },
    { name: "Jharkhand", count: 123 },
    { name: "Himachal Pradesh", count: 108 },
    { name: "Jammu and Kashmir", count: 108 },
    { name: "Puducherry", count: 74 },
    { name: "Goa", count: 39 },
    { name: "Meghalaya", count: 27 },
    { name: "Tripura", count: 22 },
    { name: "Sikkim", count: 21 },
    { name: "Manipur", count: 20 },
    { name: "Nagaland", count: 19 },
    { name: "Arunachal Pradesh", count: 18 },
    { name: "Mizoram", count: 9 },
    { name: "Andaman and Nicobar Islands", count: 3 },
  ];

  const STATIC_cityOptions = [
    { name: "Pune", count: 473 },
    { name: "Delhi", count: 393 },
    { name: "Hyderabad", count: 390 },
    { name: "Mumbai", count: 381 },
    { name: "Chennai", count: 345 },
    { name: "Kolkata", count: 314 },
    { name: "Jaipur", count: 244 },
    { name: "Coimbatore", count: 191 },
    { name: "Bhopal", count: 177 },
    { name: "Ahmedabad", count: 175 },
    { name: "Lucknow", count: 157 },
    { name: "Bhubaneswar", count: 152 },
    { name: "Indore", count: 137 },
    { name: "Nagpur", count: 127 },
    { name: "Ghaziabad", count: 117 },
    { name: "Noida", count: 117 },
    { name: "Dehradun", count: 108 },
    { name: "Thiruvananthapuram", count: 108 },
    { name: "Meerut", count: 101 },
    { name: "Patna", count: 88 },
    { name: "Visakhapatnam", count: 86 },
    { name: "Guntur", count: 84 },
    { name: "Gurgaon", count: 84 },
    { name: "Mangalore", count: 83 },
    { name: "Greater Noida", count: 79 },
    { name: "Thrissur", count: 75 },
    { name: "Ernakulam", count: 74 },
    { name: "Mohali", count: 73 },
    { name: "Kanpur", count: 72 },
    { name: "Guwahati", count: 67 },
    { name: "Kottayam", count: 67 },
    { name: "Ludhiana", count: 67 },
    { name: "Ranga Reddy", count: 64 },
    { name: "Surat", count: 64 },
    { name: "Aurangabad", count: 62 },
    { name: "Nashik", count: 62 },
    { name: "Tiruchirappalli", count: 62 },
    { name: "Vadodara", count: 62 },
    { name: "Gwalior", count: 61 },
    { name: "Raipur", count: 59 },
    { name: "Faridabad", count: 58 },
    { name: "Namakkal", count: 58 },
    { name: "Udaipur", count: 58 },
    { name: "Jammu", count: 55 },
    { name: "Chandigarh", count: 54 },
    { name: "Mysore", count: 54 },
    { name: "Patiala", count: 54 },
    { name: "Malappuram", count: 53 },
    { name: "Allahabad", count: 52 },
    { name: "Kanyakumari", count: 52 },
  ];

  const STATIC_streamOptions = [
    { name: "Arts", count: 4581 },
    { name: "Management", count: 5481 },
    { name: "Engineering", count: 4140 },
    { name: "Science", count: 4281 },
    { name: "Commerce", count: 3096 },
    { name: "Computer", count: 3151 },
    { name: "Education", count: 2485 },
    { name: "Medical", count: 865 },
    { name: "Pharmacy", count: 926 },
    { name: "Law", count: 755 },
    { name: "Architecture", count: 415 },
    { name: "Paramedical", count: 344 },
    { name: "Design", count: 331 },
    { name: "Dental", count: 285 },
    { name: "Hotel Management", count: 342 },
    { name: "Mass Communication", count: 308 },
    { name: "Vocational Courses", count: 226 },
    { name: "Veterinary", count: 50 },
    { name: "Animation", count: 12 },
    { name: "Agriculture", count: 3 },
    { name: "Aviation", count: 3 },
  ];

  const stateOptions: { name: string; count: number }[] = useMemo(() => {
    const map = new globalThis.Map<string, number>();
    STATIC_stateOptions.forEach((opt) =>
      map.set(toTitleCase(opt.name), opt.count),
    );
    discoveredStates.forEach((st) => {
      if (!map.has(st)) {
        map.set(st, 1);
      }
    });
    return Array.from(map.keys()).map((name) => ({
      name,
      count: map.get(name) || 1,
    }));
  }, [discoveredStates]);

  const cityOptions: { name: string; count: number }[] = useMemo(() => {
    const map = new globalThis.Map<string, number>();
    STATIC_cityOptions.forEach((opt) =>
      map.set(toTitleCase(opt.name), opt.count),
    );
    discoveredCities.forEach((ct) => {
      if (!map.has(ct)) {
        map.set(ct, 1);
      }
    });
    return Array.from(map.keys()).map((name) => ({
      name,
      count: map.get(name) || 1,
    }));
  }, [discoveredCities]);

  const streamOptions: { name: string; count: number }[] = useMemo(() => {
    const map = new globalThis.Map<string, number>();
    STATIC_streamOptions.forEach((opt) => map.set(opt.name, opt.count));
    discoveredStreams.forEach((str) => {
      if (!map.has(str)) {
        map.set(str, 1);
      }
    });
    return Array.from(map.keys()).map((name) => ({
      name,
      count: map.get(name) || 1,
    }));
  }, [discoveredStreams]);

  const courseOptions = [
    { name: "MBA", count: 3635 },
    { name: "BSc", count: 3580 },
    { name: "BTech", count: 3170 },
    { name: "BA", count: 2906 },
    { name: "BCom", count: 2767 },
    { name: "MSc", count: 2663 },
    { name: "MTech", count: 2155 },
    { name: "BCA", count: 2094 },
    { name: "MA", count: 1934 },
    { name: "MCA", count: 1851 },
    { name: "B.Ed", count: 1804 },
    { name: "PhD", count: 1687 },
    { name: "BBA", count: 1617 },
    { name: "M.Com", count: 1526 },
    { name: "PGD", count: 1496 },
    { name: "Bachelor of Engineering", count: 1404 },
    { name: "B.Pharmacy", count: 883 },
    { name: "ME", count: 746 },
    { name: "BA Hons", count: 694 },
    { name: "BSc Hons", count: 676 },
    { name: "M.Pharm", count: 636 },
    { name: "LLB", count: 582 },
    { name: "M.Phil", count: 566 },
    { name: "M.Ed", count: 514 },
    { name: "LLM", count: 474 },
    { name: "MD", count: 411 },
    { name: "B.Arch", count: 402 },
    { name: "MBBS", count: 368 },
    { name: "MSW", count: 359 },
    { name: "BPT", count: 340 },
    { name: "BHM", count: 305 },
    { name: "M.S", count: 303 },
    { name: "B.Des", count: 289 },
    { name: "B.Lib.I.Sc", count: 281 },
    { name: "Advance Diploma", count: 266 },
    { name: "BDS", count: 253 },
    { name: "BBM", count: 247 },
    { name: "B.P.Ed", count: 234 },
    { name: "B.Voc", count: 221 },
    { name: "MDS", count: 219 },
    { name: "M.Lib.I.Sc", count: 207 },
    { name: "PGP", count: 207 },
    { name: "BCom Hons", count: 202 },
    { name: "MPT", count: 200 },
    { name: "Diploma", count: 189 },
    { name: "BFA", count: 161 },
    { name: "BBA Hons", count: 150 },
    { name: "BJMC", count: 150 },
    { name: "Executive MBA", count: 148 },
    { name: "M.Des", count: 144 },
    { name: "Pharm.D", count: 142 },
    { name: "BSW", count: 136 },
    { name: "MJMC", count: 131 },
    { name: "M.P.Ed", count: 129 },
    { name: "Post Basic Nursing", count: 129 },
    { name: "BMS", count: 128 },
    { name: "PGDM", count: 126 },
    { name: "Master of Chirurgiae [M.Ch]", count: 121 },
    { name: "M.Arch", count: 119 },
    { name: "BAMS", count: 107 },
    { name: "MFA", count: 101 },
    { name: "MMS", count: 93 },
    { name: "MPH", count: 88 },
    { name: "DM", count: 84 },
    { name: "GNM Nursing", count: 84 },
    { name: "BHMS", count: 83 },
    { name: "B.Optom", count: 83 },
    { name: "BMLT", count: 78 },
    { name: "MHA", count: 72 },
    { name: "Distance MBA", count: 66 },
    { name: "ANM Nursing", count: 64 },
    { name: "PGC", count: 63 },
    { name: "Certificate", count: 59 },
    { name: "BVA", count: 56 },
    { name: "MHM", count: 56 },
    { name: "Distance BCA", count: 54 },
    { name: "BMM", count: 52 },
    { name: "Distance MCA", count: 52 },
    { name: "Bachelor of Performing Arts", count: 49 },
    { name: "MTTM", count: 48 },
    { name: "B.V.Sc", count: 46 },
    { name: "M.Plan", count: 46 },
    { name: "BTech Hons", count: 42 },
    { name: "BNYS", count: 41 },
    { name: "MPA", count: 40 },
    { name: "M.V.Sc", count: 40 },
    { name: "Bachelor of Occupational Therapy [BOT]", count: 38 },
    { name: "Advance Certificate", count: 35 },
    { name: "M.Optom", count: 34 },
    { name: "Distance BBA", count: 33 },
    { name: "MAM", count: 33 },
    { name: "B.Planning", count: 31 },
    { name: "BASLP", count: 30 },
    { name: "Distance B.Com", count: 30 },
    { name: "M.Voc", count: 28 },
    { name: "BFSc", count: 27 },
    { name: "BHMCT", count: 27 },
    { name: "BMC", count: 27 },
    { name: "B.Th", count: 27 },
    { name: "MHRM", count: 26 },
    { name: "MCM", count: 26 },
    { name: "MTM", count: 26 },
    { name: "MIB", count: 25 },
    { name: "B.El.Ed", count: 24 },
    { name: "BPES", count: 24 },
    { name: "ETT", count: 24 },
    { name: "MFM", count: 24 },
    { name: "M.F.Sc", count: 24 },
    { name: "BID", count: 23 },
    { name: "BTM", count: 23 },
    { name: "BUMS", count: 22 },
    { name: "MFC", count: 22 },
    { name: "B.Des Hons", count: 21 },
    { name: "MOT", count: 21 },
    { name: "MSc Hons", count: 21 },
    { name: "BFTech", count: 20 },
    { name: "MMM", count: 19 },
    { name: "M.Th", count: 19 },
    { name: "MVA", count: 19 },
    { name: "BTTM", count: 18 },
    { name: "BCA Hons", count: 18 },
    { name: "Post Doctoral", count: 18 },
    { name: "DNB", count: 16 },
    { name: "MCJ", count: 16 },
    { name: "MPM", count: 16 },
    { name: "BHA", count: 15 },
    { name: "MLib", count: 15 },
    { name: "Executive Program", count: 14 },
    { name: "MFM", count: 14 },
    { name: "MLT", count: 13 },
    { name: "Bachelor of Music", count: 12 },
    { name: "BSMS", count: 12 },
    { name: "BCS", count: 12 },
    { name: "MHRD", count: 12 },
    { name: "BLit", count: 11 },
    { name: "Bachelor of Hospitality Management", count: 11 },
    { name: "D.Litt", count: 11 },
    { name: "MA Hons", count: 11 },
    { name: "MATA", count: 10 },
    { name: "BPO", count: 9 },
    { name: "BTS", count: 9 },
    { name: "MPP", count: 9 },
    { name: "BFAD", count: 8 },
    { name: "Bachelor of Fashion Design", count: 8 },
    { name: "BTTH", count: 8 },
    { name: "D.Pharma", count: 8 },
    { name: "MFTech", count: 8 },
    { name: "HMCT", count: 8 },
    { name: "AME", count: 7 },
    { name: "BMLS", count: 7 },
    { name: "MBM", count: 7 },
    { name: "MSM", count: 7 },
    { name: "MBE", count: 7 },
    { name: "BLib", count: 6 },
    { name: "BBS", count: 6 },
    { name: "CFA", count: 6 },
    { name: "D.Sc", count: 6 },
    { name: "LLD", count: 6 },
    { name: "Masters in Hospital Management", count: 6 },
    { name: "MSC", count: 6 },
    { name: "MMus", count: 6 },
    { name: "BPH", count: 5 },
    { name: "Bachelor of Animation", count: 5 },
    { name: "BCJ", count: 5 },
    { name: "BEIED", count: 5 },
    { name: "BFIA", count: 5 },
    { name: "Bachelor of Sports Management", count: 5 },
    { name: "BPP", count: 5 },
    { name: "MID", count: 5 },
    { name: "MBS", count: 5 },
    { name: "MFD", count: 5 },
    { name: "Bachelor in Culinary Arts & Bakery", count: 4 },
    { name: "BM", count: 4 },
    { name: "BRS", count: 4 },
    { name: "BRIT", count: 4 },
    { name: "BStat", count: 4 },
    { name: "BFD", count: 4 },
    { name: "BAF", count: 4 },
    { name: "BBE", count: 4 },
    { name: "MEM", count: 4 },
    { name: "MJ", count: 4 },
    { name: "MPH", count: 4 },
    { name: "MIM", count: 4 },
    { name: "MMLS", count: 4 },
    { name: "BSc CVT", count: 3 },
    { name: "BMS", count: 3 },
    { name: "Bachelor of Aviation Management", count: 3 },
    { name: "Bachelor of Cosmetic Technology", count: 3 },
    { name: "BRE", count: 3 },
    { name: "CA", count: 3 },
    { name: "D.Ed", count: 3 },
    { name: "GMP", count: 3 },
    { name: "MTHM", count: 3 },
    { name: "MURP", count: 3 },
    { name: "MUD", count: 3 },
    { name: "MABM", count: 3 },
    { name: "MBL", count: 3 },
    { name: "MCS", count: 3 },
    { name: "MHTM", count: 3 },
    { name: "LLM", count: 3 },
    { name: "MMin", count: 3 },
    { name: "MSPT", count: 3 },
    { name: "MRE", count: 3 },
    { name: "MText", count: 3 },
    { name: "MUP", count: 3 },
    { name: "MPlan", count: 3 },
    { name: "Masters in Sports Nutrition", count: 3 },
    { name: "MBA Hons", count: 3 },
    { name: "M.Com Hons", count: 3 },
    { name: "BText", count: 2 },
    { name: "BMGA", count: 2 },
    { name: "BFM", count: 2 },
    { name: "BLS", count: 2 },
    { name: "BMM", count: 2 },
    { name: "BMMC", count: 2 },
    { name: "BPD", count: 2 },
    { name: "BSL", count: 2 },
    { name: "Bachelors in Logistics Management", count: 2 },
    { name: "BETP", count: 2 },
    { name: "BMS Hons", count: 2 },
    { name: "BPH", count: 2 },
    { name: "BPT", count: 2 },
    { name: "Distance M.Sc Biochemistry", count: 2 },
    { name: "MLL & LW", count: 2 },
    { name: "MMC", count: 2 },
    { name: "Master of Bioprocessing Engineering", count: 2 },
    { name: "MEILC", count: 2 },
    { name: "MFT", count: 2 },
    { name: "MGB", count: 2 },
    { name: "MPS", count: 2 },
    { name: "MTA", count: 2 },
    { name: "Online MBA", count: 2 },
    { name: "BAA", count: 1 },
    { name: "Bachelor in Graphics & Multimedia", count: 1 },
    { name: "BJD&M", count: 1 },
    { name: "BPHBS", count: 1 },
    { name: "BPP", count: 1 },
    { name: "BAM", count: 1 },
    { name: "BAP", count: 1 },
    { name: "BPharm Ayurveda", count: 1 },
    { name: "BBC", count: 1 },
    { name: "BEC", count: 1 },
    { name: "BEM", count: 1 },
    { name: "BFS", count: 1 },
    { name: "BFA", count: 1 },
    { name: "BLW", count: 1 },
    { name: "BMRSC", count: 1 },
    { name: "BMin", count: 1 },
    { name: "BOL", count: 1 },
    { name: "BRTT", count: 1 },
    { name: "BUD", count: 1 },
    { name: "BUP", count: 1 },
    { name: "B.Des in Textile Design", count: 1 },
    { name: "B.Com LLB", count: 1 },
    { name: "D.El.Ed", count: 1 },
    { name: "Distance B.Ed", count: 1 },
    { name: "EPGP)", count: 1 },
    { name: "MASLP", count: 1 },
    { name: "MHM", count: 1 },
    { name: "MOT", count: 1 },
    { name: "MPM", count: 1 },
    { name: "MSDEM", count: 1 },
    { name: "MAEP", count: 1 },
    { name: "MCCA", count: 1 },
    { name: "MEM", count: 1 },
    { name: "MHPE", count: 1 },
    { name: "MHRM", count: 1 },
    { name: "MIRM", count: 1 },
    { name: "LLM IPR", count: 1 },
    { name: "Master of Musicology", count: 1 },
    { name: "MOL", count: 1 },
    { name: "MPO", count: 1 },
    { name: "MSpED", count: 1 },
    { name: "MUH", count: 1 },
    { name: "MUI", count: 1 },
    { name: "MUM", count: 1 },
    { name: "MUTS", count: 1 },
    { name: "MTP", count: 1 },
    { name: "MSc in GIS and Remote Sensing", count: 1 },
    { name: "MPharm", count: 1 },
    { name: "MPlan", count: 1 },
    { name: "MRS", count: 1 },
    { name: "MCA Hons", count: 1 },
    { name: "MQPM", count: 1 },
  ];

  const specializationOptions = [
    { name: "BTech Computer Science", count: 2368 },
    { name: "BTech Mechanical Engineering", count: 2262 },
    { name: "BTech Civil Engineering", count: 2038 },
    { name: "BTech Electronics Communication Engineering", count: 1856 },
    { name: "MTech Computer Science Engineering", count: 1331 },
    { name: "BTech Information Technology", count: 1249 },
    { name: "Bachelor of Engineering Mechanical Engineering", count: 1223 },
    { name: "BSc Mathematics", count: 1216 },
    { name: "BA English", count: 1206 },
    { name: "BSc Chemistry", count: 1166 },
    { name: "MBA Hr", count: 1159 },
    { name: "MBA Marketing", count: 1124 },
    { name: "Bachelor of Engineering Civil Engineering", count: 1100 },
    { name: "BSc Physics", count: 1100 },
    { name: "BTech Electrical And Electronics Engineering", count: 1093 },
    { name: "MSc Chemistry", count: 1035 },
    { name: "BA Economics", count: 1033 },
    { name: "BSc Computer Science", count: 1032 },
    { name: "Bachelor of Engineering Computer Science", count: 1031 },
    { name: "Bachelor of Engineering Electronics", count: 1027 },
    { name: "MBA Finance", count: 1027 },
    { name: "MA English", count: 1014 },
    { name: "MSc Mathematics", count: 996 },
    { name: "BA History", count: 980 },
    { name: "MSc Physics", count: 929 },
    { name: "BA Political Science", count: 869 },
    { name: "BTech Electrical Engineering", count: 815 },
    { name: "BSc Botany", count: 788 },
    { name: "MA Economics", count: 775 },
    { name: "BSc Zoology", count: 763 },
    {
      name: "Bachelor of Engineering Electrical And Electronics Engineering",
      count: 720,
    },
    { name: "MSc Computer Science", count: 674 },
    { name: "MA History", count: 594 },
    { name: "BA Hindi", count: 591 },
    { name: "BSc Biotech", count: 589 },
    { name: "BA Sociology", count: 578 },
    { name: "MSc Zoology", count: 560 },
    { name: "MSc Biotechnology", count: 553 },
    { name: "MSc Microbiology", count: 548 },
    { name: "MA Political Science", count: 545 },
    { name: "MA Hindi", count: 537 },
    { name: "MSc Botany", count: 534 },
    { name: "BSc Nursing", count: 504 },
    { name: "MTech Electronics Communication Engineering", count: 484 },
    { name: "BCom Computer Application", count: 468 },
    { name: "PGD Computer Application", count: 467 },
    { name: "MA Sociology", count: 466 },
    { name: "BA Sanskrit", count: 462 },
    { name: "BSc Information Technology", count: 462 },
    { name: "BA English Hons", count: 455 },
    { name: "PhD Computer Science", count: 451 },
    { name: "PhD Chemistry", count: 445 },
    { name: "MTech Mechanical Engineering", count: 432 },
    { name: "MBA Business Administration", count: 430 },
    { name: "ME Computer Science", count: 430 },
    { name: "BA Geography", count: 429 },
    { name: "BSc Microbiology", count: 428 },
    { name: "M.Pharm Pharmaceutics", count: 425 },
    { name: "MTech Structural Engineering", count: 423 },
    { name: "M.Phil Philosophy", count: 419 },
    { name: "PhD Mathematics", count: 394 },
    { name: "Bachelor of Engineering Information Technology", count: 391 },
    { name: "PhD Physics", count: 387 },
    { name: "MSc Information Technology", count: 384 },
    { name: "MBA International Business", count: 378 },
    { name: "BCA Computer Application", count: 365 },
    { name: "BA Economics Hons", count: 363 },
    { name: "MBA Information Technology", count: 363 },
    { name: "BA Political Science Hons", count: 361 },
    { name: "MSW Social Work", count: 356 },
    { name: "BA History Hons", count: 355 },
    { name: "BA Philosophy", count: 339 },
    { name: "MSc Biochemistry", count: 337 },
    { name: "BA Psychology", count: 336 },
    { name: "BSc Chemistry Hons", count: 325 },
    { name: "BBA Business Administration", count: 315 },
    { name: "MTech Civil Engineering", count: 313 },
    { name: "Bachelor of Engineering Electrical Engineering", count: 311 },
    { name: "BPT Physiotherapy", count: 307 },
    { name: "PhD Mechanical Engineering", count: 303 },
    { name: "BTech Artificial Intelligence", count: 302 },
    { name: "PhD Electronics", count: 302 },
    { name: "BTech Electronics Engineering", count: 295 },
    { name: "M.Pharm Pharmacology", count: 291 },
    { name: "BSc Electronics", count: 289 },
    { name: "BSc Mathematics Hons", count: 289 },
    { name: "PhD English", count: 287 },
    { name: "MA Sanskrit", count: 287 },
    { name: "MA Psychology", count: 285 },
    { name: "MTech Vlsi Design", count: 282 },
    { name: "BSc Physics Hons", count: 278 },
    { name: "BTech Chemical Engineering", count: 277 },
    { name: "MA Geography", count: 275 },
    { name: "MBA Operations Management", count: 269 },
    { name: "BSc Statistics", count: 266 },
    { name: "PhD Economics", count: 259 },
    { name: "BA English Literature", count: 258 },
    { name: "PhD Biotech", count: 257 },
    { name: "MTech Power Electronics", count: 255 },
    { name: "BTech Biotech Engineering", count: 252 },
    { name: "ME Electronics", count: 250 },
    { name: "MD Pathology", count: 241 },
    { name: "BBM Business Management", count: 238 },
    { name: "MSc Nursing", count: 235 },
    { name: "Bachelor of Engineering Computer Engineering", count: 233 },
    { name: "MSc Statistics", count: 233 },
    { name: "B.P.Ed Physical Education", count: 230 },
    { name: "MD Paediatrics", count: 229 },
    { name: "BA Philosophy Hons", count: 228 },
    { name: "PhD Civil Engineering", count: 228 },
    { name: "BSc Biochemistry", count: 226 },
    { name: "BTech Communication Engineering", count: 225 },
    { name: "MD Microbiology", count: 225 },
    { name: "MD Pharmacology", count: 223 },
    {
      name: "Bachelor of Engineering Electronics And Telecom Engineering",
      count: 222,
    },
    { name: "MSc Environmental Science", count: 221 },
    { name: "MTech Thermal Engineering", count: 220 },
    { name: "MD Physiology", count: 218 },
    { name: "BSc Zoology Hons", count: 217 },
    { name: "MTech Information Technology", count: 211 },
    { name: "MA Journalism And Mass Communication", count: 210 },
    { name: "BA Bengali Hons", count: 209 },
    { name: "M.S General Surgery", count: 209 },
    { name: "MTech Embedded Systems", count: 207 },
    { name: "MCA Computer Application", count: 206 },
    { name: "BSc Botany Hons", count: 205 },
    { name: "MD Anaesthesia", count: 203 },
    { name: "MTech Machine Design", count: 203 },
    { name: "MBA Business Analytics", count: 202 },
    { name: "MD General Medicine", count: 199 },
    { name: "MA Philosophy", count: 198 },
    { name: "BA Journalism And Mass Communication", count: 197 },
    { name: "M.Pharm Pharmaceutical Chemistry", count: 197 },
    { name: "BA Mathematics", count: 196 },
    { name: "MD Biochemistry", count: 195 },
    { name: "M.S Orthopaedics", count: 193 },
    { name: "BA Sanskrit Hons", count: 191 },
    { name: "MTech Electrical Engineering", count: 188 },
    { name: "BSc Medical Laboratory Technology", count: 187 },
    { name: "MPT Physiotherapy", count: 187 },
    { name: "ME Structural Engineering", count: 183 },
    { name: "MD Psychiatry", count: 182 },
    { name: "MTech Power System Engineering", count: 180 },
    { name: "BSc Agriculture", count: 179 },
    { name: "BTech Automobile Engineering", count: 178 },
    { name: "BA Home Science", count: 176 },
    { name: "MD Community Medicine", count: 176 },
    { name: "MD Medicine", count: 175 },
    { name: "M.Phil English", count: 175 },
    { name: "PhD Management Studies", count: 174 },
    { name: "MD Anatomy", count: 170 },
    { name: "M.S Ophthalmology", count: 170 },
    { name: "MTech Electronics", count: 170 },
    { name: "MTech Software Engineering", count: 170 },
    { name: "BSc Hotel Management", count: 167 },
    { name: "PhD Microbiology", count: 166 },
    { name: "MA Public Administration", count: 165 },
    { name: "MBA Financial Management", count: 164 },
    { name: "BTech Data Science", count: 163 },
    { name: "PhD Botany", count: 163 },
    { name: "BBA Finance", count: 162 },
    { name: "BSc Home Science", count: 162 },
    { name: "MTech Digital Communication", count: 162 },
    { name: "BSc Biology", count: 161 },
    { name: "BA Geography Hons", count: 160 },
    { name: "B.Des Fashion Design", count: 160 },
    { name: "PhD Zoology", count: 159 },
    { name: "MTech Biotech", count: 159 },
    { name: "BSc Computer Science Hons", count: 158 },
    { name: "BA Bengali", count: 157 },
    { name: "BA Hindi Hons", count: 157 },
    { name: "BSc Fashion Design", count: 157 },
    { name: "MD Dermatology", count: 157 },
    { name: "M.Phil Mathematics", count: 155 },
    { name: "BBA Marketing", count: 153 },
    { name: "BFA Fine Arts", count: 153 },
    { name: "MBA Systems Management", count: 153 },
    { name: "BSc Economics", count: 151 },
    { name: "PhD History", count: 149 },
    { name: "ME Vlsi Design", count: 148 },
    { name: "PGD Hr", count: 148 },
    { name: "PGD Journalism", count: 148 },
    { name: "MTech Vlsi Design Embedded System", count: 146 },
    { name: "BHM Hotel Management", count: 144 },
    { name: "M.S Ecology", count: 144 },
    { name: "MSc Electronics", count: 143 },
    { name: "MTech Computer Engineering", count: 143 },
    { name: "M.Pharm Quality Assurance", count: 142 },
    { name: "ME Applied Electronics", count: 139 },
    { name: "BA Urdu", count: 138 },
    { name: "MBA Retail Management", count: 138 },
    { name: "M.Pharm Pharmaceutical Analysis", count: 138 },
    { name: "M.Phil Economics", count: 138 },
    { name: "MSc Biotech", count: 138 },
    { name: "MTech Environmental Engineering", count: 138 },
    { name: "M.Phil Chemistry", count: 136 },
    { name: "MSc Geography", count: 136 },
    { name: "BA Psychology Hons", count: 134 },
    { name: "BSc Psychology", count: 134 },
    { name: "BJMC Journalism", count: 133 },
    { name: "PhD Philosophy", count: 133 },
    { name: "M.Phil Computer Science", count: 133 },
    { name: "BA Tamil", count: 132 },
    { name: "MDS Conservative Dentistry", count: 132 },
    { name: "BSc Agriculture Hons", count: 131 },
    { name: "BSW Social Work", count: 131 },
    { name: "BBA Hr", count: 130 },
    { name: "BSc Hospitality", count: 130 },
    { name: "MA Mathematics", count: 129 },
    { name: "M.P.Ed Physical Education", count: 129 },
    { name: "Bachelor of Engineering Automobile Engineering", count: 128 },
    { name: "MA English Literature", count: 128 },
    { name: "MD Forensic Medicine", count: 128 },
    { name: "Post Basic Nursing Nursing", count: 128 },
    { name: "BCom Accounting And Finance", count: 126 },
    { name: "PhD Electrical Engineering", count: 126 },
    { name: "MDS Prosthodontics", count: 126 },
    { name: "MSc Psychology", count: 126 },
    { name: "MTech Chemical Engineering", count: 126 },
    { name: "BBA Business Administration Hons", count: 125 },
    { name: "MBA Banking", count: 124 },
    { name: "BSc Geography", count: 122 },
    { name: "BTech Cyber Security", count: 122 },
    { name: "MA Urdu", count: 121 },
    { name: "M.Com Finance", count: 121 },
    { name: "MSc Geology", count: 121 },
    { name: "PhD Hindi", count: 119 },
    { name: "BA Sociology Hons", count: 118 },
    { name: "PhD Sociology", count: 118 },
    { name: "PGD Business Management", count: 118 },
    { name: "PhD Psychology", count: 117 },
    { name: "MSc Bioinformatics", count: 116 },
    { name: "BSc Imaging Technology", count: 115 },
    { name: "MD Radiodiagnosis", count: 115 },
    { name: "BA Hindi Literature", count: 113 },
    { name: "BBA Business Analytics", count: 113 },
    { name: "MBA Supply Chain Management", count: 113 },
    { name: "MBA Entrepreneurship", count: 112 },
    { name: "MJMC Journalism", count: 112 },
    { name: "MSc Biology", count: 112 },
    { name: "PhD Biochemistry", count: 111 },
    { name: "PhD Political Science", count: 111 },
    { name: "MSc Organic Chemistry", count: 111 },
    { name: "BTech Computer Engineering", count: 110 },
    { name: "ME Computer Engineering", count: 110 },
    { name: "MTech Production Engineering", count: 109 },
    { name: "BCom Banking", count: 107 },
    { name: "BSc Interior Design", count: 107 },
    { name: "BTech Aeronautical Engineering", count: 107 },
    { name: "M.S Ent", count: 107 },
    { name: "MSc Genetics", count: 107 },
    { name: "BSc Geology", count: 106 },
    { name: "BSc Non Medical", count: 106 },
    { name: "M.Phil History", count: 106 },
    { name: "BA Physical Education", count: 104 },
    { name: "MA Tamil", count: 104 },
    { name: "ME Communication Systems", count: 104 },
    { name: "PGD Yoga", count: 104 },
    { name: "BA Marathi", count: 103 },
    { name: "Bachelor of Engineering Information Science", count: 103 },
    { name: "MA Music", count: 103 },
    { name: "MD Ecology", count: 103 },
    { name: "M.Pharm Pharmacognosy", count: 103 },
    { name: "BA Public Administration", count: 102 },
    { name: "MSc Agronomy", count: 102 },
    { name: "Bachelor of Engineering Aeronautical Engineering", count: 101 },
    { name: "ME Mechanical Engineering", count: 101 },
    { name: "MTech Communication Engineering", count: 101 },
    { name: "MTech Power Electronics And Drives", count: 101 },
    { name: "MTech Computer Science", count: 100 },
    { name: "MBA Business Management", count: 99 },
    { name: "BSc Optometry", count: 98 },
    { name: "BTech Agricultural Engineering", count: 97 },
    { name: "BBA Digital Marketing", count: 96 },
    { name: "BSc Biotech Hons", count: 95 },
    { name: "MSc Horticulture", count: 94 },
    { name: "PhD Environmental Science", count: 93 },
    { name: "MTech Transportation Engineering", count: 93 },
    { name: "BCom Finance", count: 92 },
    { name: "BTech Electronics And Telecom Engineering", count: 92 },
    { name: "MSc Medical Surgical Nursing", count: 92 },
    { name: "Bachelor of Engineering Chemical Engineering", count: 91 },
    { name: "Bachelor of Engineering Communication Engineering", count: 90 },
    { name: "MTech Communication Systems", count: 90 },
    { name: "MFA Fine Arts", count: 89 },
    { name: "BSc Computer Application", count: 88 },
    { name: "BTech Food Technology Engineering", count: 88 },
    { name: "MA Mass Communication", count: 87 },
    { name: "M.S Anatomy", count: 87 },
    { name: "BSc Environmental Science", count: 86 },
    { name: "BSc Visual Communication", count: 85 },
    { name: "PhD Information Technology", count: 85 },
    { name: "MBA Hospital Management", count: 85 },
    { name: "MSc Physiology", count: 85 },
    { name: "MTech Electrical And Electronics Engineering", count: 85 },
    { name: "BTech Mining Engineering", count: 84 },
    { name: "MBA Digital Marketing", count: 84 },
    { name: "MBA Tourism", count: 83 },
    { name: "MTech Artificial Intelligence", count: 83 },
    { name: "MTech Digital Electronics And Communication Systems", count: 83 },
    { name: "BCom Accountancy", count: 82 },
    { name: "BSc Economics Hons", count: 82 },
    { name: "ME Manufacturing Engineering", count: 82 },
    { name: "MPH Public Health", count: 82 },
    { name: "MBA Logistics And Supply Chain Management", count: 81 },
    { name: "ME Thermal Engineering", count: 81 },
    { name: "BBA Hospital Management", count: 80 },
    { name: "B.Des Interior Design", count: 80 },
    { name: "B.Optom Optometry", count: 80 },
    { name: "BCom Corporate Secretaryship", count: 79 },
    { name: "PhD Sanskrit", count: 79 },
    { name: "ME Engineering Design", count: 79 },
    { name: "BCom Taxation", count: 78 },
    { name: "BSc Microbiology Hons", count: 78 },
    { name: "PGD Information Technology", count: 78 },
    { name: "PhD Computer Application", count: 77 },
    { name: "MDS Orthodontics", count: 77 },
    { name: "MTech Data Science", count: 77 },
    { name: "BSc Operation Theatre Technology", count: 76 },
    { name: "PhD Statistics", count: 76 },
    { name: "M.Phil Botany", count: 76 },
    { name: "BA Journalism", count: 75 },
    { name: "BAMS Medical Sciences", count: 75 },
    { name: "B.Ed English", count: 75 },
    { name: "Master of Chirurgiae [M.Ch] Urology", count: 75 },
    { name: "MSc Home Science", count: 75 },
    { name: "BA Mass Communication", count: 74 },
    { name: "BMLT Medical Laboratory Technology", count: 74 },
    { name: "BSc Forensic Science", count: 74 },
    { name: "BTech Biomedical Engineering", count: 74 },
    { name: "PhD Chemical Engineering", count: 74 },
    { name: "PhD Social Work", count: 74 },
    { name: "MA Marathi", count: 74 },
    { name: "MA Social Work", count: 74 },
    { name: "MDS Periodontics", count: 74 },
    { name: "B.Ed Mathematics", count: 73 },
    { name: "PhD Geography", count: 73 },
    { name: "MDS Oral Medicine And Radiology", count: 73 },
    { name: "M.Phil Biotech", count: 73 },
    { name: "MSc Analytical Chemistry", count: 73 },
    { name: "MTech Industrial Engineering", count: 73 },
    { name: "BSc Data Science", count: 72 },
    { name: "MA Bengali", count: 72 },
    { name: "M.Phil Hindi", count: 72 },
    { name: "PGDM Marketing", count: 72 },
    { name: "BA Arabic", count: 71 },
    { name: "BTech Computer Science Engineering", count: 71 },
    { name: "GNM Nursing Nursing", count: 71 },
    { name: "MA Punjabi", count: 71 },
    { name: "M.Phil Sociology", count: 71 },
    { name: "BBA Entrepreneurship", count: 70 },
    { name: "M.Com Computer Application", count: 70 },
    { name: "BBA Banking", count: 69 },
    { name: "BSc Geography Hons", count: 69 },
    { name: "MMS Management Studies", count: 69 },
    { name: "PGDM Hr", count: 69 },
    { name: "BA Computer Application", count: 68 },
    { name: "PhD Pharmacology", count: 68 },
    { name: "MA Home Science", count: 68 },
    { name: "MSc Fashion Design", count: 68 },
    { name: "BCom Accounting And Finance Hons", count: 67 },
    { name: "Bachelor of Engineering Biomedical Engineering", count: 67 },
    { name: "PhD Social Science", count: 67 },
    { name: "PhD Tamil", count: 67 },
    { name: "MBA Banking And Finance", count: 67 },
    { name: "BSc Nutrition", count: 66 },
    { name: "Master of Chirurgiae [M.Ch] Neuro Surgery", count: 66 },
    { name: "MDS Microbiology", count: 66 },
    { name: "MHA Hospital Administration", count: 66 },
    { name: "MSc Forensic Science", count: 66 },
    { name: "MSc Medical Laboratory Technology", count: 66 },
    { name: "BA Ancient History", count: 65 },
    { name: "BA Malayalam", count: 65 },
    { name: "BBA Retail Management", count: 65 },
    { name: "PhD Physiology", count: 65 },
    { name: "ME Power System Engineering", count: 65 },
    { name: "MTech Power Engineering", count: 65 },
    { name: "PGD Counselling", count: 65 },
    { name: "BBA International Business", count: 64 },
    { name: "BCA Data Science", count: 64 },
    { name: "PhD Physical Education", count: 64 },
    { name: "BA Kannada", count: 63 },
    { name: "MD Radiotherapy", count: 63 },
    { name: "Advance Diploma Fashion Design", count: 62 },
    { name: "BTech Aerospace Engineering", count: 62 },
    { name: "PhD Agriculture", count: 62 },
    { name: "PGD International Business", count: 62 },
    { name: "BA Assamese", count: 61 },
    { name: "PhD Journalism", count: 61 },
    { name: "MDS Dentistry", count: 61 },
    { name: "ME Civil Engineering", count: 61 },
    { name: "MSc Economics", count: 61 },
    { name: "MTech Geotechnical Engineering", count: 61 },
    { name: "PGD Financial Management", count: 61 },
    { name: "PGD Marketing Management", count: 61 },
    { name: "BA Music Vocal", count: 60 },
    { name: "BA Statistics", count: 60 },
    { name: "B.Des Product Design", count: 60 },
    { name: "B.Ed Physical Science", count: 60 },
    { name: "BSc Statistics Hons", count: 60 },
    { name: "BTech Production Engineering", count: 60 },
    { name: "BCom Accountancy Hons", count: 59 },
    { name: "MSc Food Technology", count: 59 },
    { name: "MSc Obstetrics Gynaecology", count: 59 },
    { name: "MTech Power Systems", count: 59 },
    { name: "MBA Healthcare Management", count: 58 },
    { name: "MBA Hospitality Management", count: 58 },
    { name: "ME Electronics And Telecommunication Engineering", count: 58 },
    { name: "MSc Anatomy", count: 58 },
    { name: "BA Urdu Hons", count: 57 },
    { name: "DM Cardiology", count: 57 },
    { name: "M.Com Accountancy", count: 57 },
    { name: "MSc Data Science", count: 57 },
    { name: "BCom Accounting", count: 56 },
    { name: "Bachelor of Engineering Production Engineering", count: 56 },
    { name: "BTech Biotech", count: 56 },
    { name: "PhD Genetics", count: 56 },
    { name: "PhD Pathology", count: 56 },
    { name: "M.S Laryngology", count: 56 },
    { name: "PGD Marketing", count: 56 },
    { name: "BSc Horticulture", count: 55 },
    { name: "MBA Information System", count: 55 },
    { name: "BA Music", count: 54 },
    { name: "BTech Mechatronics Engineering", count: 54 },
    { name: "Distance BCA Computer Application", count: 54 },
    { name: "Master of Chirurgiae [M.Ch] Plastic Surgery", count: 54 },
    { name: "ANM Nursing Nursing", count: 54 },
    { name: "PGD Ecology", count: 54 },
    { name: "MA Arabic", count: 53 },
    { name: "MA Yoga", count: 53 },
    { name: "MDS Orthopaedics", count: 53 },
    { name: "ME Embedded Systems", count: 53 },
    { name: "MTech Information Security", count: 53 },
    { name: "BA Mathematics Hons", count: 52 },
    { name: "BCA Cyber Security", count: 52 },
    { name: "BTech Applied Electronics And Instrumentation", count: 52 },
    { name: "BTech Metallurgical Engineering", count: 52 },
    { name: "MSc Nutrition", count: 52 },
    { name: "PGDM Finance", count: 52 },
    { name: "BCA Artificial Intelligence", count: 51 },
    { name: "Bachelor of Engineering Mechatronics Engineering", count: 51 },
    { name: "PhD Business Administration", count: 51 },
    { name: "MTech Nanotechnology", count: 51 },
    { name: "BA Gujarati", count: 50 },
    { name: "B.Des Communication Design", count: 50 },
    { name: "BSc Fashion Technology", count: 50 },
    { name: "Distance MCA Computer Application", count: 50 },
    { name: "PhD Marketing", count: 50 },
    { name: "MHM Hotel Management", count: 50 },
    { name: "M.Phil Microbiology", count: 50 },
    { name: "MSc Yoga", count: 50 },
    { name: "B.Des Textile Design", count: 49 },
    { name: "BMM Mass Media", count: 49 },
    { name: "BTech Petroleum Engineering", count: 49 },
    { name: "PhD Hr", count: 49 },
    { name: "Master of Chirurgiae [M.Ch] Thoracic Surgery", count: 49 },
    { name: "ME Construction Engineering", count: 49 },
    { name: "MSc Pathology", count: 49 },
    { name: "MTech Construction Engineering", count: 49 },
    { name: "BCom Marketing", count: 48 },
    { name: "Bachelor of Engineering Biotech", count: 48 },
    { name: "B.Ed Special Education", count: 48 },
    { name: "MBA Hospital Administration", count: 48 },
    { name: "MSc Food Science", count: 48 },
    { name: "MSc Pharmacology", count: 48 },
    { name: "PGD Fashion Design", count: 48 },
    { name: "BBA Computer Application", count: 47 },
    { name: "PhD Nursing", count: 47 },
    { name: "MA Anthropology", count: 47 },
    { name: "MA Rural Development", count: 47 },
    { name: "ME Information Technology", count: 47 },
    { name: "M.Pharm Industrial Pharmacy", count: 47 },
    { name: "MTech Cyber Security", count: 47 },
    { name: "MTech Network Engineering", count: 47 },
    { name: "PGD Business Administration", count: 47 },
    { name: "PGD Hotel Management", count: 47 },
    { name: "BBA Tourism", count: 46 },
    { name: "BSc Anaesthesia Technology", count: 46 },
    { name: "BSc Life Science", count: 46 },
    { name: "DM Neurology", count: 46 },
    { name: "PhD Information Science", count: 46 },
    { name: "MDS Periodontology", count: 46 },
    { name: "MDS Public Health", count: 46 },
    { name: "MSc Interior Design", count: 46 },
    { name: "PGD Advertising", count: 46 },
    { name: "BA Journalism And Mass Communication Hons", count: 45 },
    { name: "BSc Food Technology", count: 45 },
    { name: "PhD Biology", count: 45 },
    { name: "MA Telugu", count: 45 },
    { name: "M.Com Banking", count: 45 },
    { name: "MDS Pedodontics", count: 45 },
    { name: "MSc Entomology", count: 45 },
    { name: "PGD English", count: 45 },
    { name: "PGD Retail Management", count: 45 },
    { name: "Advance Diploma Interior Design", count: 44 },
    { name: "BA Politics", count: 44 },
    { name: "B.Ed Social Science", count: 44 },
    { name: "BSc Tourism", count: 44 },
    { name: "PhD Geology", count: 44 },
    { name: "MA Journalism", count: 44 },
    { name: "MDS Pathology", count: 44 },
    { name: "ME Software Engineering", count: 44 },
    { name: "M.Phil Geography", count: 44 },
    { name: "MSc Life Science", count: 44 },
    { name: "MSc Soil Science", count: 44 },
    { name: "MTech Electronics And Telecommunication Engineering", count: 44 },
    { name: "BA Painting", count: 43 },
    { name: "LLM Criminal Law", count: 43 },
    { name: "MD Ayurveda", count: 43 },
    { name: "MSc Computer Application", count: 43 },
    { name: "MTTM Tourism", count: 43 },
    { name: "BBA Logistics And Supply Chain Management", count: 42 },
    { name: "BTech Control Engineering", count: 42 },
    { name: "PhD Home Science", count: 42 },
    { name: "PhD Humanities", count: 42 },
    { name: "MA Linguistics", count: 42 },
    { name: "M.Phil Biochemistry", count: 42 },
    { name: "MSc Clinical Research", count: 42 },
    { name: "MTech Renewable Energy", count: 42 },
    { name: "BCom Professional Accounting", count: 41 },
    { name: "BHM Hospitality Management", count: 41 },
    { name: "BSc Physiology", count: 41 },
    { name: "MA Kannada", count: 41 },
    { name: "MA Painting", count: 41 },
    { name: "MBA Production Management", count: 41 },
    { name: "MBA Technology Management", count: 41 },
    { name: "PGD Human Rights", count: 41 },
    { name: "BA Fashion Design", count: 40 },
    { name: "Bachelor of Engineering Instrumentation Engineering", count: 40 },
    { name: "BSc Electronics Hons", count: 40 },
    { name: "BTech Machine Learning", count: 40 },
    { name: "MA Malayalam", count: 40 },
    { name: "M.Des Fashion Design", count: 40 },
    { name: "ME Environmental Engineering", count: 40 },
    { name: "MSc Agricultural Economics", count: 40 },
    { name: "BSc Forestry", count: 39 },
    { name: "MBA Aviation Management", count: 39 },
    { name: "ME Electrical Engineering", count: 39 },
    { name: "MSc Applied Psychology", count: 39 },
    { name: "MSc Nutrition And Dietetics", count: 39 },
    { name: "MTech Food Technology", count: 39 },
    { name: "MTech Robotics", count: 39 },
    { name: "PGD Anaesthesia", count: 39 },
    { name: "PGD Orthopaedics", count: 39 },
    { name: "BA Music Hons", count: 38 },
    { name: "B.Ed History", count: 38 },
    { name: "BSc Physical Science", count: 38 },
    { name: "MSc Anthropology", count: 38 },
    { name: "BA Computer Science", count: 37 },
    { name: "BBA Aviation", count: 37 },
    { name: "Bachelor of Engineering Artificial Intelligence", count: 37 },
    { name: "Bachelor of Engineering Control Engineering", count: 37 },
    { name: "BSc Yoga", count: 37 },
    { name: "PhD Mass Communication", count: 37 },
    { name: "MA Statistics", count: 37 },
    { name: "PGD Disaster Management", count: 37 },
    { name: "BA Punjabi", count: 36 },
    { name: "BA Tourism Management", count: 36 },
    { name: "MBA Agribusiness Management", count: 36 },
    { name: "M.Pharm Pharmaceutical Technology", count: 36 },
    { name: "MTech Biomedical Engineering", count: 36 },
    { name: "PGD Child Health", count: 36 },
    {
      name: "Bachelor of Occupational Therapy [BOT] Occupational Therapy",
      count: 35,
    },
    { name: "PhD Finance", count: 35 },
    { name: "PhD Public Administration", count: 35 },
    { name: "MD Ophthalmology", count: 35 },
    { name: "MTech Material Science", count: 35 },
    { name: "PGD Banking", count: 35 },
    { name: "PGD Bioinformatics", count: 35 },
    { name: "PGD Finance", count: 35 },
    { name: "PGD Tourism Management", count: 35 },
    { name: "BA Applied Psychology Hons", count: 34 },
    { name: "BBA Hospitality Management", count: 34 },
    { name: "BBA Information Technology", count: 34 },
    { name: "B.Des Fashion Communication", count: 34 },
    { name: "BDS Dental Surgery", count: 34 },
    { name: "BSc Costume Design", count: 34 },
    { name: "BSc Perfusion Technology", count: 34 },
    { name: "PhD Agronomy", count: 34 },
    { name: "PhD Bioinformatics", count: 34 },
    { name: "PhD Medicine", count: 34 },
    { name: "PhD Physiotherapy", count: 34 },
    { name: "MA Applied Psychology", count: 34 },
    { name: "MBA Logistics Management", count: 34 },
    { name: "MSc Geoinformatics", count: 34 },
    { name: "PGD Mass Communication", count: 34 },
    { name: "PGDM Business Analytics", count: 34 },
    { name: "BSc Artificial Intelligence", count: 33 },
    { name: "BSc Genetics", count: 33 },
    { name: "BSc Nutrition And Dietetics", count: 33 },
    { name: "BTech Electronics and Communication", count: 33 },
    { name: "B.Voc Software Development", count: 33 },
    { name: "DM Nephrology", count: 33 },
    { name: "PhD Anatomy", count: 33 },
    { name: "MA Human Rights", count: 33 },
    { name: "M.Optom Optometry", count: 33 },
    { name: "MBA Hotel Management", count: 33 },
    { name: "MBA Rural Development", count: 33 },
    { name: "MCA Data Science", count: 33 },
    { name: "MSc Forestry", count: 33 },
    { name: "MTech Computer Aided Design", count: 33 },
    { name: "PGD Ophthalmology", count: 33 },
    { name: "BA Persian", count: 32 },
    { name: "BCA Cloud Computing", count: 32 },
    { name: "PhD Library and Information Science", count: 32 },
    { name: "Executive MBA Business Administration", count: 32 },
    { name: "MA Persian", count: 32 },
    { name: "MSc Human Development", count: 32 },
    { name: "MTech Control Systems", count: 32 },
    { name: "B.Ed Biological Sciences", count: 31 },
    { name: "BSc Biochemistry Hons", count: 31 },
    { name: "BSc Film Making", count: 31 },
    { name: "MBA Project Management", count: 31 },
    { name: "MBA Travel And Tourism", count: 31 },
    { name: "M.Com Accounting And Finance", count: 31 },
    { name: "MPT Orthopaedics", count: 31 },
    { name: "MSc Imaging Technology", count: 31 },
    { name: "MSc Resource Management", count: 31 },
    { name: "MTech Control Engineering", count: 31 },
    { name: "MTech Water Resources Engineering", count: 31 },
    { name: "BA Anthropology", count: 30 },
    { name: "BA Tourism", count: 30 },
    { name: "BSc Anthropology", count: 30 },
    { name: "BSc Geology Hons", count: 30 },
    { name: "BSc Nutrition Hons", count: 30 },
    { name: "BSc Physical Education", count: 30 },
    { name: "BTech Cloud Computing", count: 30 },
    { name: "BTech Robotics", count: 30 },
    { name: "PhD Public Health", count: 30 },
    { name: "MBA Pharmaceutical Management", count: 30 },
    { name: "MCA Artificial Intelligence", count: 30 },
    { name: "M.Com Financial Management", count: 30 },
    { name: "MD Cardiology", count: 30 },
    { name: "M.Des Interior Design", count: 30 },
    { name: "MPA Performing Arts", count: 30 },
    { name: "MTech Computer Integrated Manufacturing", count: 30 },
    { name: "PGD Cyber Law", count: 30 },
    { name: "BA Film Making", count: 29 },
    { name: "BA Mass Communication Hons", count: 29 },
    { name: "BA Yoga", count: 29 },
    { name: "Bachelor of Performing Arts Performing Arts", count: 29 },
    { name: "BSc Forensic Science Hons", count: 29 },
    { name: "BSc Physiology Hons", count: 29 },
    { name: "BTech Marine Engineering", count: 29 },
    { name: "DM Gastroenterology", count: 29 },
    { name: "PhD Anthropology", count: 29 },
    { name: "PhD Entomology", count: 29 },
    { name: "PhD Food Technology", count: 29 },
    { name: "PhD Horticulture", count: 29 },
    { name: "PhD Pharmaceutical Sciences", count: 29 },
    { name: "PhD Urdu", count: 29 },
    { name: "LLM Corporate Law", count: 29 },
    { name: "MA Gujarati", count: 29 },
    { name: "MBA Insurance", count: 29 },
    { name: "MBBS Medicine", count: 29 },
    { name: "MTech Manufacturing Engineering", count: 29 },
    { name: "PGD Entrepreneurship", count: 29 },
    { name: "PGD Hindi", count: 29 },
    { name: "PGD Hospital Management", count: 29 },
    { name: "PGD Labour Law", count: 29 },
    { name: "PGD Public Relations", count: 29 },
    { name: "BASLP Audiology", count: 28 },
    { name: "B.Ed Natural Science", count: 28 },
    { name: "BSc Biology Hons", count: 28 },
    { name: "BSc Cyber Security", count: 28 },
    { name: "BSc Renal Dialysis Technology", count: 28 },
    { name: "BSc Textile Design", count: 28 },
    { name: "PhD Computer Engineering", count: 28 },
    { name: "PhD Ecology", count: 28 },
    { name: "PhD Music", count: 28 },
    { name: "MA Ancient History", count: 28 },
    { name: "MA Assamese", count: 28 },
    { name: "MTech Automobile Engineering", count: 28 },
    { name: "PGD Laryngology", count: 28 },
    { name: "PGD Supply Chain Management", count: 28 },
    { name: "BA French", count: 27 },
    { name: "BA Telugu", count: 27 },
    { name: "BBA Hotel Management", count: 27 },
    { name: "BCom Business Economics", count: 27 },
    { name: "BFSc Fisheries Science", count: 27 },
    { name: "BSc Hospitality Management", count: 27 },
    { name: "BTech Industrial Engineering", count: 27 },
    { name: "PhD Life Science", count: 27 },
    { name: "PhD Pharmaceutics", count: 27 },
    { name: "LLM Human Rights", count: 27 },
    { name: "MA French", count: 27 },
    { name: "MA International Relations", count: 27 },
    { name: "M.Com Marketing", count: 27 },
    { name: "M.Com Taxation", count: 27 },
    { name: "MD Emergency Medicine", count: 27 },
    { name: "MD Pulmonary Medicine", count: 27 },
    { name: "ME Instrumentation Engineering", count: 27 },
    { name: "PGD Dermatology", count: 27 },
    { name: "PGD Taxation", count: 27 },
    { name: "BA Fine Arts", count: 26 },
    { name: "BCA Machine Learning", count: 26 },
    { name: "BCom Finance Hons", count: 26 },
    { name: "B.Ed Tamil", count: 26 },
    { name: "BSc Radiotherapy", count: 26 },
    { name: "BTech Agriculture", count: 26 },
    { name: "PhD Business Management", count: 26 },
    { name: "PhD Nutrition", count: 26 },
    { name: "PhD Tourism", count: 26 },
    { name: "MA Hr", count: 26 },
    { name: "MHRM Hr", count: 26 },
    { name: "MCA Cyber Security", count: 26 },
    { name: "MCM Computer Management", count: 26 },
    { name: "ME Digital Communication", count: 26 },
    { name: "MSc Food Science And Technology", count: 26 },
    { name: "MTech Applied Electronics", count: 26 },
    { name: "MTech Bioinformatics", count: 26 },
    { name: "MTech Energy Systems", count: 26 },
    { name: "MTech Environmental Science", count: 26 },
    { name: "MTech Mechatronics", count: 26 },
    { name: "PGP Marketing", count: 26 },
    { name: "BBA Event Management", count: 25 },
    { name: "BBA Supply Chain Management", count: 25 },
    { name: "BSc Cardiac Care", count: 25 },
    { name: "BSc Horticulture Hons", count: 25 },
    { name: "BTech Bioinformatics", count: 25 },
    { name: "BTech Computer Science Hons", count: 25 },
    { name: "BTech Dairy Technology", count: 25 },
    { name: "B.Th Theology", count: 25 },
    { name: "Diploma Nursing", count: 25 },
    { name: "MA Fine Arts", count: 25 },
    { name: "MBA Rural Management", count: 25 },
    { name: "Master of Chirurgiae [M.Ch] Oncology", count: 25 },
    { name: "ME Machine Design", count: 25 },
    { name: "MIB International Business", count: 25 },
    { name: "M.Phil Environmental Science", count: 25 },
    { name: "MTech Construction Management", count: 25 },
    { name: "PGD Tourism", count: 25 },
    { name: "BFA Applied Arts", count: 24 },
    { name: "BPES Physical Education", count: 24 },
    { name: "BSc Environmental Science Hons", count: 24 },
    { name: "BSc Food Science", count: 24 },
    { name: "BTech Big Data Analytics", count: 24 },
    { name: "BTech Information Science", count: 24 },
    { name: "BTech Instrumentation Engineering", count: 24 },
    { name: "MA Tourism", count: 24 },
    { name: "MBA Event Management", count: 24 },
    { name: "MBA Media Management", count: 24 },
    { name: "MD Social Medicine", count: 24 },
    { name: "MSc Fashion Technology", count: 24 },
    { name: "MSc Visual Communication", count: 24 },
    { name: "PGD Interior Design", count: 24 },
    { name: "PGD Rural Development", count: 24 },
    { name: "BID Interior Design", count: 23 },
    { name: "BBA Business Management", count: 23 },
    { name: "BBA Financial Services", count: 23 },
    { name: "BCom Marketing Hons", count: 23 },
    { name: "Bachelor of Engineering Mining Engineering", count: 23 },
    { name: "BMS Management Studies", count: 23 },
    { name: "BSc Clinical Research", count: 23 },
    { name: "BSc Radiography", count: 23 },
    { name: "BTech Environmental Engineering", count: 23 },
    { name: "BVA Visual Arts", count: 23 },
    { name: "MA Public Relations", count: 23 },
    { name: "MD Neurology", count: 23 },
    { name: "MFM Fashion Management", count: 23 },
    { name: "M.Phil Public Administration", count: 23 },
    { name: "MTech Product Design", count: 23 },
    { name: "MTech Remote Sensing", count: 23 },
    { name: "PGD Event Management", count: 23 },
    { name: "PGP Finance", count: 23 },
    { name: "BA Social Science", count: 22 },
    { name: "BBA Financial Market", count: 22 },
    { name: "BCom Tourism", count: 22 },
    {
      name: "Bachelor of Engineering Information Science And Engineering",
      count: 22,
    },
    { name: "B.Ed Computer Science", count: 22 },
    { name: "BNYS Naturopathy", count: 22 },
    { name: "BSc Clinical Nutrition", count: 22 },
    { name: "BSc Nautical Science", count: 22 },
    { name: "BTech Mechatronics", count: 22 },
    { name: "BUMS Medicine", count: 22 },
    { name: "PhD Communication Engineering", count: 22 },
    { name: "PhD Soil Science", count: 22 },
    { name: "ME Chemical Engineering", count: 22 },
    { name: "MFC Finance", count: 22 },
    { name: "MMS Finance", count: 22 },
    { name: "M.Phil Electronics", count: 22 },
    { name: "MSc Nano Science", count: 22 },
    { name: "MSc Plant Pathology", count: 22 },
    { name: "MSc Tourism", count: 22 },
    { name: "MTech Energy Technology", count: 22 },
    { name: "MTech Nano Science", count: 22 },
    { name: "MTech Wireless Communication", count: 22 },
    { name: "M.V.Sc Ecology", count: 22 },
    { name: "PGD Clinical Research", count: 22 },
    { name: "PGD Forensic Science", count: 22 },
    { name: "PGD Industrial Relation", count: 22 },
    { name: "PGD Industrial Safety", count: 22 },
    { name: "PGD Medical Laboratory Technology", count: 22 },
    { name: "PGD Medicine", count: 22 },
    { name: "PGD Operations Management", count: 22 },
    { name: "BA Arabic Hons", count: 21 },
    { name: "BA Punjabi Hons", count: 21 },
    { name: "BTM Tourism", count: 21 },
    { name: "BCom Financial Market", count: 21 },
    { name: "Bachelor of Engineering Industrial Engineering", count: 21 },
    { name: "Bachelor of Engineering Marine Engineering", count: 21 },
    { name: "B.Ed Economics", count: 21 },
    { name: "B.Ed Hindi", count: 21 },
    { name: "BSc Cardiovascular Technology", count: 21 },
    { name: "BSc Food Technology Hons", count: 21 },
    { name: "BTech Textile Engineering", count: 21 },
    { name: "B.Voc Hospitality Management", count: 21 },
    { name: "PhD Linguistics", count: 21 },
    { name: "PhD Metallurgical Engineering", count: 21 },
    { name: "Executive MBA Marketing", count: 21 },
    { name: "LLM Business Law", count: 21 },
    { name: "MA Film Making", count: 21 },
    { name: "MBA Data Analytics", count: 21 },
    { name: "MCA Cloud Computing", count: 21 },
    { name: "M.Com Business Management", count: 21 },
    { name: "MDS Medicine", count: 21 },
    { name: "ME Communication Engineering", count: 21 },
    { name: "ME Industrial Engineering", count: 21 },
    { name: "M.Pharm Biotech", count: 21 },
    { name: "MTech Aerospace Engineering", count: 21 },
    { name: "PGD Biotech", count: 21 },
    { name: "PGD Clinical Pathology", count: 21 },
    { name: "Advance Diploma Computer Application", count: 20 },
    { name: "Advance Diploma French", count: 20 },
    { name: "BA Public Administration Hons", count: 20 },
    { name: "BA Social Work", count: 20 },
    { name: "BBA Aviation Management", count: 20 },
    { name: "B.Des Graphic Designing", count: 20 },
    { name: "BMC Mass Communication", count: 20 },
    { name: "BNYS Yogic Science", count: 20 },
    { name: "BSc Forestry Hons", count: 20 },
    { name: "BSc Physician Assistant", count: 20 },
    { name: "BSc Psychology Hons", count: 20 },
    { name: "B.Voc Medical Laboratory Technology", count: 20 },
    { name: "B.Voc Retail Management", count: 20 },
    { name: "PhD Electrical And Electronics Engineering", count: 20 },
    { name: "MA Literature", count: 20 },
    { name: "MA Physical Education", count: 20 },
    { name: "MA Public Policy", count: 20 },
    { name: "MOT Occupational Therapy", count: 20 },
    { name: "M.Com Business Administration", count: 20 },
    { name: "MSc Community Health Nursing", count: 20 },
    { name: "MTech Agricultural Engineering", count: 20 },
    { name: "MTech Computer Application", count: 20 },
    { name: "MTech Electrical Power Systems", count: 20 },
    { name: "MTM Tourism", count: 20 },
    { name: "PGD Hospital Administration", count: 20 },
    { name: "PGD Remote Sensing", count: 20 },
    { name: "BBA Operations Management", count: 19 },
    { name: "BCom Business Administration", count: 19 },
    { name: "BCom Secretarial Practice", count: 19 },
    { name: "BCom Taxation Hons", count: 19 },
    { name: "B.Voc Interior Design", count: 19 },
    { name: "B.V.Sc Veterinary Science", count: 19 },
    { name: "DM Endocrinology", count: 19 },
    { name: "PhD Applied chemistry", count: 19 },
    { name: "PhD Applied Sciences", count: 19 },
    { name: "Executive MBA Finance", count: 19 },
    { name: "MA Business Economics", count: 19 },
    { name: "MA Islamic Studies", count: 19 },
    { name: "MA Women Studies", count: 19 },
    { name: "MBA Financial Services", count: 19 },
    { name: "Master of Chirurgiae [M.Ch] Gastroenterology", count: 19 },
    { name: "MD Haematology", count: 19 },
    { name: "ME Vlsi Design Embedded System", count: 19 },
    { name: "M.Phil Journalism", count: 19 },
    { name: "M.Phil Music", count: 19 },
    { name: "M.S Anaesthesia", count: 19 },
    { name: "MSc Hotel Management", count: 19 },
    { name: "MTech Food Technology Engineering", count: 19 },
    { name: "MTech Mining Engineering", count: 19 },
    { name: "M.Th Theology", count: 19 },
    { name: "M.V.Sc Nutrition", count: 19 },
    { name: "PGD Business Analytics", count: 19 },
    { name: "PGD Sports Management", count: 19 },
    { name: "PGD Yogic Science", count: 19 },
    { name: "PGDM International Business", count: 19 },
    { name: "PGDM Operations Management", count: 19 },
    { name: "PGP Hr", count: 19 },
    { name: "Advance Diploma German", count: 18 },
    { name: "Advance Diploma Russian", count: 18 },
    { name: "BAMS Medicine", count: 18 },
    { name: "BBA Business Analytics Hons", count: 18 },
    { name: "BBA Hospital Administration", count: 18 },
    { name: "BBA Hr Hons", count: 18 },
    { name: "BBA Marketing Hons", count: 18 },
    { name: "BCom Accounting Hons", count: 18 },
    { name: "BCom Economics", count: 18 },
    { name: "B.Des Accessory Design", count: 18 },
    { name: "Bachelor of Engineering Data Science", count: 18 },
    { name: "BHM Tourism", count: 18 },
    { name: "B.Lib.I.Sc Library and Information Science", count: 18 },
    { name: "BSc Cardiology", count: 18 },
    { name: "BSc Home Science Hons", count: 18 },
    { name: "B.Voc Tourism", count: 18 },
    { name: "PhD Arabic", count: 18 },
    { name: "PhD Food and Nutrition", count: 18 },
    { name: "PhD Food Science", count: 18 },
    { name: "PhD Kannada", count: 18 },
    { name: "PhD Marathi", count: 18 },
    { name: "PhD Pharmacognosy", count: 18 },
    { name: "PhD Production Engineering", count: 18 },
    { name: "LLM International Law", count: 18 },
    { name: "MBA Airport Management", count: 18 },
    { name: "M.Pharm Drug Regulatory Affairs", count: 18 },
    { name: "MSc Ecology", count: 18 },
    { name: "MSc Food and Nutrition", count: 18 },
    { name: "MTech Cad Cam", count: 18 },
    { name: "MTech Engineering Design", count: 18 },
    { name: "PGD Computer Science", count: 18 },
    { name: "PGD Networking", count: 18 },
    { name: "PGD Nutrition", count: 18 },
    { name: "PGD Public Health", count: 18 },
    { name: "BBA Sports Management", count: 17 },
    { name: "BCom Co Operation", count: 17 },
    { name: "B.Des Interior Design Hons", count: 17 },
    { name: "Bachelor of Engineering Environmental Engineering", count: 17 },
    { name: "BHM Hospital Management", count: 17 },
    { name: "BSc Information Technology Hons", count: 17 },
    { name: "BTech Petrochemical Engineering", count: 17 },
    { name: "PhD Fashion Design", count: 17 },
    { name: "PhD Women Studies", count: 17 },
    { name: "PhD Yoga", count: 17 },
    { name: "MA Dance", count: 17 },
    { name: "MA Development Studies", count: 17 },
    { name: "ME Computer Aided Design", count: 17 },
    { name: "ME Transportation Engineering", count: 17 },
    { name: "M.F.Sc Fisheries Science", count: 17 },
    { name: "M.Pharm Pharmaceutical Management", count: 17 },
    { name: "MSc Mechanical Engineering", count: 17 },
    { name: "MSc Optometry", count: 17 },
    { name: "MSc Remote Sensing", count: 17 },
    { name: "MTech Geoinformatics", count: 17 },
    { name: "M.V.Sc Biochemistry", count: 17 },
    { name: "PGD Data Science", count: 17 },
    { name: "BA Dance", count: 16 },
    { name: "BA German", count: 16 },
    { name: "BA Hotel Management", count: 16 },
    { name: "BBA Advertising", count: 16 },
    { name: "BBA Finance Hons", count: 16 },
    { name: "BCA Cloud Technology", count: 16 },
    { name: "BCom Banking Hons", count: 16 },
    { name: "BCom Statistics", count: 16 },
    { name: "Bachelor of Engineering Agricultural Engineering", count: 16 },
    { name: "BSc Data Science Hons", count: 16 },
    { name: "BSc Fisheries", count: 16 },
    { name: "BSc Visual Effects", count: 16 },
    { name: "BTech Food Technology", count: 16 },
    { name: "PhD Bengali", count: 16 },
    { name: "PhD Biomedical Engineering", count: 16 },
    { name: "PhD Earth Science", count: 16 },
    { name: "PhD Fine Arts", count: 16 },
    { name: "PhD Forensic Science", count: 16 },
    { name: "PhD Forestry", count: 16 },
    { name: "PhD Operations Management", count: 16 },
    { name: "MCJ Journalism", count: 16 },
    { name: "MBA Business Economics", count: 16 },
    { name: "MBA Materials Management", count: 16 },
    { name: "MD Gastroenterology", count: 16 },
    { name: "MDS Dental Surgery", count: 16 },
    { name: "ME Safety Engineering", count: 16 },
    { name: "MMM Marketing", count: 16 },
    { name: "MMS Hr", count: 16 },
    { name: "MMS Marketing", count: 16 },
    { name: "M.Phil Biology", count: 16 },
    { name: "MSc Aquaculture", count: 16 },
    { name: "MSc Cyber Security", count: 16 },
    { name: "MTech Metallurgical Engineering", count: 16 },
    { name: "M.V.Sc Genetics", count: 16 },
    { name: "M.V.Sc Veterinary Science", count: 16 },
    { name: "PGD Environmental Management", count: 16 },
    { name: "PGD Rural Management", count: 16 },
    { name: "PGDM Information Technology", count: 16 },
    { name: "PGP Business Management", count: 16 },
    { name: "Advance Diploma Hospitality Management", count: 15 },
    { name: "Advance Diploma Information Technology", count: 15 },
    { name: "BA Business Economics Hons", count: 15 },
    { name: "BA French Hons", count: 15 },
    { name: "BA Journalism Hons", count: 15 },
    { name: "BHA Hospital Administration", count: 15 },
    { name: "B.Ed Malayalam", count: 15 },
    { name: "BHMCT Hotel Management", count: 15 },
    { name: "BHMS Medicine", count: 15 },
    { name: "BSc Anthropology Hons", count: 15 },
    { name: "BSc Critical Care Technology", count: 15 },
    { name: "BSc Culinary Arts", count: 15 },
    { name: "BTech Engineering Physics", count: 15 },
    { name: "BTech Nanotechnology", count: 15 },
    { name: "BVA Applied Arts", count: 15 },
    { name: "BVA Painting", count: 15 },
    { name: "PhD Community Medicine", count: 15 },
    { name: "PhD Dentistry", count: 15 },
    { name: "PhD French", count: 15 },
    { name: "PhD Human Development", count: 15 },
    { name: "PhD Nanotechnology", count: 15 },
    { name: "Executive MBA Hr", count: 15 },
    { name: "MA Politics", count: 15 },
    { name: "MBA Marketing Management", count: 15 },
    { name: "M.Com International Business", count: 15 },
    { name: "MD Nephrology", count: 15 },
    { name: "ME Cad Cam", count: 15 },
    { name: "ME Production Engineering", count: 15 },
    { name: "M.Ed Special Education", count: 15 },
    { name: "MJMC Mass Communication", count: 15 },
    { name: "M.Pharm Clinical Pharmacy", count: 15 },
    { name: "MSc Electronic Media", count: 15 },
    { name: "MSc Environment Science", count: 15 },
    { name: "MSc Naturopathy", count: 15 },
    { name: "MTech Big Data Analytics", count: 15 },
    { name: "M.V.Sc Medicine", count: 15 },
    { name: "M.V.Sc Microbiology", count: 15 },
    { name: "M.V.Sc Pathology", count: 15 },
    { name: "PGD Environmental Law", count: 15 },
    { name: "PGD Export Management", count: 15 },
    { name: "PGD Foreign Trade", count: 15 },
    { name: "PGD Health Management", count: 15 },
    { name: "PGD Information System", count: 15 },
    { name: "PGD Naturopathy", count: 15 },
    { name: "BA Home Science Hons", count: 14 },
    { name: "BA Interior Design", count: 14 },
    { name: "BA Islamic Studies", count: 14 },
    { name: "BA Liberal Arts", count: 14 },
    { name: "BA Liberal Arts Hons", count: 14 },
    { name: "BA Persian Hons", count: 14 },
    { name: "BCA Information Security", count: 14 },
    { name: "BCom Hr", count: 14 },
    { name: "Bachelor of Engineering Electronics Engineering", count: 14 },
    { name: "Bachelor of Engineering Manufacturing Engineering", count: 14 },
    { name: "B.Ed Geography", count: 14 },
    { name: "B.Lib.I.Sc Library Science", count: 14 },
    { name: "BSc Aviation", count: 14 },
    { name: "BSc Biotechnology", count: 14 },
    { name: "BSc Information System", count: 14 },
    { name: "B.Voc Fashion Design", count: 14 },
    { name: "PhD Aerospace Engineering", count: 14 },
    { name: "PhD Biological Sciences", count: 14 },
    { name: "PhD Persian", count: 14 },
    { name: "PhD Resource Management", count: 14 },
    { name: "PhD Visual Arts", count: 14 },
    { name: "MA Criminology", count: 14 },
    { name: "MBA Data Science", count: 14 },
    { name: "MBA Hospitality", count: 14 },
    { name: "MBA Shipping Management", count: 14 },
    { name: "MD Physical Medicine and Rehabilitation", count: 14 },
    { name: "M.Des Product Design", count: 14 },
    { name: "MDS Oral Surgery", count: 14 },
    { name: "ME Aeronautical Engineering", count: 14 },
    { name: "ME Networking", count: 14 },
    { name: "M.Lib.I.Sc Library Science", count: 14 },
    { name: "MPA Music", count: 14 },
    { name: "M.Phil Arabic", count: 14 },
    { name: "M.Phil Geology", count: 14 },
    { name: "MSc Artificial Intelligence", count: 14 },
    { name: "MSc Counselling", count: 14 },
    { name: "MSc Criminology", count: 14 },
    { name: "MSc Hospitality Management", count: 14 },
    { name: "MSc Nanotechnology", count: 14 },
    { name: "MSc Social Work", count: 14 },
    { name: "MTech Electrical Power Engineering", count: 14 },
    { name: "MTech Energy Management", count: 14 },
    { name: "MTech Mathematics", count: 14 },
    { name: "MTech Petroleum Engineering", count: 14 },
    { name: "M.V.Sc Public Health", count: 14 },
    { name: "PGD Digital Marketing", count: 14 },
    { name: "PGD Logistics And Supply Chain Management", count: 14 },
    { name: "PGD Production Management", count: 14 },
    { name: "BBA Data Analytics", count: 13 },
    { name: "BCA Computer Application Hons", count: 13 },
    { name: "BCA Data Analytics", count: 13 },
    { name: "BCA Mobile Application", count: 13 },
    { name: "B.Des Game Design", count: 13 },
    { name: "B.Des Industrial Design", count: 13 },
    { name: "B.Des User Experience Design", count: 13 },
    {
      name: "Bachelor of Engineering Aircraft Maintenance Engineering",
      count: 13,
    },
    { name: "BSc Audiology", count: 13 },
    { name: "BSc Bioinformatics", count: 13 },
    { name: "BSc Maths", count: 13 },
    { name: "BSc Medical Technology", count: 13 },
    { name: "BTech Fashion Technology", count: 13 },
    { name: "BTech Mathematics", count: 13 },
    { name: "BTech Mechanical Engineering Hons", count: 13 },
    { name: "B.Voc Banking", count: 13 },
    { name: "B.Voc Hotel Management", count: 13 },
    { name: "DM Neonatology", count: 13 },
    { name: "PhD Agricultural Economics", count: 13 },
    { name: "PhD Entrepreneurship", count: 13 },
    { name: "PhD Painting", count: 13 },
    { name: "PhD Rural Development", count: 13 },
    { name: "MA Performing Arts", count: 13 },
    { name: "M.Arch Urban Design", count: 13 },
    { name: "MFM Financial Management", count: 13 },
    { name: "MBA Biotech", count: 13 },
    { name: "M.Com Hr", count: 13 },
    { name: "MD Biology", count: 13 },
    { name: "ME Biotech", count: 13 },
    { name: "ME Mechatronics", count: 13 },
    { name: "M.Phil Marathi", count: 13 },
    { name: "MSc Electronic Science", count: 13 },
    { name: "MSc Polymer Science", count: 13 },
    { name: "MSc Software Engineering", count: 13 },
    { name: "MSc Yogic Science", count: 13 },
    { name: "M.V.Sc Pharmacology", count: 13 },
    { name: "PGD Paediatrics", count: 13 },
    { name: "PGDM Entrepreneurship", count: 13 },
    { name: "BA Fashion Design Hons", count: 12 },
    { name: "Bachelor of Music Music", count: 12 },
    { name: "Bachelor of Performing Arts Dance", count: 12 },
    { name: "Bachelor of Performing Arts Music", count: 12 },
    { name: "BSMS Medicine", count: 12 },
    { name: "B.Arch Interior Design", count: 12 },
    { name: "BBA Artificial Intelligence", count: 12 },
    { name: "BBA Digital Marketing Hons", count: 12 },
    { name: "BBA Logistics Management", count: 12 },
    { name: "BCom Computer Science", count: 12 },
    { name: "B.Des Visual Communication", count: 12 },
    { name: "Bachelor of Engineering Metallurgical Engineering", count: 12 },
    { name: "BFTech Fashion Technology", count: 12 },
    { name: "BJMC Journalism And Mass Communication", count: 12 },
    { name: "B Pharmacy Ayurveda", count: 12 },
    { name: "B Pharmacy Pharmacology", count: 12 },
    { name: "BSc Anatomy", count: 12 },
    { name: "BSc Biomedical Science Hons", count: 12 },
    { name: "BSc Nutrition And Dietetics Hons", count: 12 },
    { name: "BSc Pathology", count: 12 },
    { name: "BSc VFX", count: 12 },
    { name: "DM Medicine", count: 12 },
    { name: "PhD Automobile Engineering", count: 12 },
    { name: "PhD Ayurveda", count: 12 },
    { name: "PhD Electronic Science", count: 12 },
    { name: "PhD Food Technology Engineering", count: 12 },
    { name: "PhD Hotel Management", count: 12 },
    { name: "PhD Nano Science", count: 12 },
    { name: "PhD Performing Arts", count: 12 },
    { name: "PhD Veterinary Science", count: 12 },
    { name: "MA Archaeology", count: 12 },
    { name: "MA Russian", count: 12 },
    { name: "MBA Design management", count: 12 },
    { name: "MBA Fashion Design", count: 12 },
    { name: "MBA Service Management", count: 12 },
    { name: "M.Des Communication Design", count: 12 },
    { name: "ME Automobile Engineering", count: 12 },
    { name: "M.F.Sc Aquaculture", count: 12 },
    { name: "MHRD Hr", count: 12 },
    { name: "MLT Medical Laboratory Technology", count: 12 },
    { name: "MSc Agriculture", count: 12 },
    { name: "MSc Applied Electronics", count: 12 },
    { name: "MSc Civil Engineering", count: 12 },
    { name: "MSc Clinical Embryology", count: 12 },
    { name: "MSc Clinical Nutrition", count: 12 },
    { name: "MSc Data Analytics", count: 12 },
    { name: "MTech Automotive Engineering", count: 12 },
    { name: "MTech Microwave Engineering", count: 12 },
    { name: "MVA Visual Arts", count: 12 },
    { name: "PGD Insurance Management", count: 12 },
    { name: "PGD Psychiatry", count: 12 },
    { name: "PGD Psychology", count: 12 },
    { name: "PGDM Financial Management", count: 12 },
    { name: "Advance Diploma Hospitality", count: 11 },
    { name: "Advance Diploma Hotel Management", count: 11 },
    { name: "BA Hospitality Management", count: 11 },
    { name: "BA Social Work Hons", count: 11 },
    { name: "BLit Literature", count: 11 },
    { name: "BAMS Ayurveda", count: 11 },
    { name: "BCA Business Analytics", count: 11 },
    { name: "BCom Banking And Finance Hons", count: 11 },
    { name: "BCom Information System", count: 11 },
    { name: "BCom International Business", count: 11 },
    { name: "B.Lib.I.Sc Information Science", count: 11 },
    { name: "BSc Game Design", count: 11 },
    { name: "BSc Medical Record", count: 11 },
    { name: "BTech Electronics Communication Engineering Hons", count: 11 },
    { name: "BTech Material Science", count: 11 },
    { name: "PhD Dance", count: 11 },
    { name: "PhD Gujarati", count: 11 },
    { name: "PhD Management Science", count: 11 },
    { name: "MA Fashion Design", count: 11 },
    { name: "MA German", count: 11 },
    { name: "MA Religious Studies", count: 11 },
    { name: "M.Arch Landscape Architecture", count: 11 },
    { name: "MBA Artificial Intelligence", count: 11 },
    { name: "MBA Fashion Management", count: 11 },
    { name: "MBA Infrastructure Management", count: 11 },
    { name: "MBA Sales Management", count: 11 },
    { name: "MBA Sports Management", count: 11 },
    { name: "MCA Machine Learning", count: 11 },
    { name: "MD Hospital Administration", count: 11 },
    { name: "ME Power Systems", count: 11 },
    { name: "M.Phil Home Science", count: 11 },
    { name: "M.Phil Kannada", count: 11 },
    { name: "M.S Ayurveda", count: 11 },
    { name: "MSc Audiology", count: 11 },
    { name: "MSc Meteorology", count: 11 },
    { name: "MSc Operation Theatre Technology", count: 11 },
    { name: "MSc Plant Science", count: 11 },
    { name: "MSc Public Health", count: 11 },
    { name: "MTech Instrumentation Engineering", count: 11 },
    { name: "MTech Robotics Engineering", count: 11 },
    { name: "M.V.Sc Physiology", count: 11 },
    { name: "PGD Financial Services", count: 11 },
    { name: "PGD Hospitality Management", count: 11 },
    { name: "PGD Linguistics", count: 11 },
    { name: "PGD Logistics Management", count: 11 },
    { name: "PGP Entrepreneurship", count: 11 },
    { name: "PGP Operations Management", count: 11 },
    { name: "Advance Diploma Fashion Technology", count: 10 },
    { name: "Advance Diploma Industrial Safety", count: 10 },
    { name: "BA Hospitality", count: 10 },
    { name: "BA Literature", count: 10 },
    { name: "BA Photography", count: 10 },
    { name: "BA Social Science Hons", count: 10 },
    { name: "BTTM Tourism", count: 10 },
    { name: "BBA Airport Management", count: 10 },
    { name: "BBA Financial Management", count: 10 },
    { name: "BBA Foreign Trade", count: 10 },
    { name: "BCom Business Analytics", count: 10 },
    { name: "BCom Computer Application Hons", count: 10 },
    { name: "BCom Management Accounting", count: 10 },
    { name: "Bachelor of Engineering Cyber Security", count: 10 },
    { name: "Bachelor of Engineering Machine Learning", count: 10 },
    { name: "B.Ed Home Science", count: 10 },
    { name: "B Pharmacy Pharmaceutics", count: 10 },
    { name: "BSc 3D Animation", count: 10 },
    { name: "BSc Agronomy", count: 10 },
    { name: "BSc Emergency Medicine", count: 10 },
    { name: "BSc Nuclear Medicine", count: 10 },
    { name: "BSc Nursing Hons", count: 10 },
    { name: "BTech Electronics", count: 10 },
    { name: "BTech Safety And Fire Engineering", count: 10 },
    { name: "BTech Software Engineering", count: 10 },
    { name: "B.Voc Fashion Technology", count: 10 },
    { name: "B.Voc Food Processing Technology", count: 10 },
    { name: "Diploma Mechanical Engineering", count: 10 },
    { name: "PhD Agricultural Engineering", count: 10 },
    { name: "PhD Aquaculture", count: 10 },
    { name: "PhD Control Engineering", count: 10 },
    { name: "PhD Environmental Engineering", count: 10 },
    { name: "PhD Floriculture", count: 10 },
    { name: "PhD Human Rights", count: 10 },
    { name: "PhD Industrial Engineering", count: 10 },
    { name: "PhD Information System", count: 10 },
    { name: "PhD Literature", count: 10 },
    { name: "PhD Material Science", count: 10 },
    { name: "PhD Media Studies", count: 10 },
    { name: "PhD Mining Engineering", count: 10 },
    { name: "PhD Production Management", count: 10 },
    { name: "PhD Telugu", count: 10 },
    { name: "LLM Cyber Law", count: 10 },
    { name: "LLM Taxation", count: 10 },
    { name: "MA International Studies", count: 10 },
    { name: "MATA Tourism", count: 10 },
    { name: "MBA Aviation", count: 10 },
    { name: "MBA Computer Management", count: 10 },
    { name: "MBA Human Resource Management", count: 10 },
    { name: "MBA Interior Design", count: 10 },
    { name: "M.Com Economics", count: 10 },
    { name: "MD Endocrinology", count: 10 },
    { name: "MD General Surgery", count: 10 },
    { name: "MD Nuclear Medicine", count: 10 },
    { name: "M.Des User Experience Design", count: 10 },
    { name: "ME Biomedical Engineering", count: 10 },
    { name: "ME Control Systems", count: 10 },
    { name: "M.Lib.I.Sc Library and Information Science", count: 10 },
    { name: "M.Phil Bengali", count: 10 },
    { name: "MPT Neurology", count: 10 },
    { name: "MPT Paediatrics", count: 10 },
    { name: "MSc Biomedical Science", count: 10 },
    { name: "MSc Business Analytics", count: 10 },
    { name: "MSc Chemistry Hons", count: 10 },
    { name: "MSc Information Security", count: 10 },
    { name: "MSc Journalism", count: 10 },
    { name: "MSc Maths", count: 10 },
    { name: "MSc Medical Technology", count: 10 },
    { name: "MSc Nematology", count: 10 },
    { name: "MSc Pharmaceutics", count: 10 },
    { name: "MSc Physics Hons", count: 10 },
    { name: "MSc Textile Design", count: 10 },
    { name: "MTech Aeronautical Engineering", count: 10 },
    { name: "MTech Environmental Management", count: 10 },
    { name: "MTech Industrial Safety", count: 10 },
    { name: "MTech Networking", count: 10 },
    { name: "M.V.Sc Anatomy", count: 10 },
    { name: "M.V.Sc Animal husbandry", count: 10 },
    { name: "M.V.Sc Biotech", count: 10 },
    { name: "PGD Clinical Nutrition", count: 10 },
    { name: "PGD Criminology", count: 10 },
    { name: "PGD Cyber Security", count: 10 },
    { name: "PGD Dance", count: 10 },
    { name: "PGD Data Management", count: 10 },
    { name: "PGD Fashion Technology", count: 10 },
    { name: "PGD Project Management", count: 10 },
    { name: "PGD Statistics", count: 10 },
    { name: "PGD Web Designing", count: 10 },
    { name: "PGDM Supply Chain Management", count: 10 },
    { name: "Advance Diploma 3D Animation", count: 9 },
    { name: "Advance Diploma Advertising", count: 9 },
    { name: "Advance Diploma Textile Design", count: 9 },
    { name: "BA Criminology", count: 9 },
    { name: "BA Event Management", count: 9 },
    { name: "BA German Hons", count: 9 },
    { name: "BA Naturopathy", count: 9 },
    { name: "BA Performing Arts", count: 9 },
    { name: "BA Statistics Hons", count: 9 },
    { name: "BA Travel And Tourism", count: 9 },
    { name: "BPO Prosthetic", count: 9 },
    { name: "BTS Tourism", count: 9 },
    { name: "BBA Accounting", count: 9 },
    { name: "BBA Entrepreneurship Hons", count: 9 },
    { name: "BBA Hospitality", count: 9 },
    { name: "BBA Mass Media", count: 9 },
    { name: "BCom Foreign Trade", count: 9 },
    { name: "BCom Logistics And Supply Chain Management", count: 9 },
    { name: "BCom Management Studies", count: 9 },
    { name: "BCom Mathematics", count: 9 },
    { name: "Bachelor of Engineering Robotics", count: 9 },
    {
      name: "Bachelor of Hospitality Management Hospitality Management",
      count: 9,
    },
    { name: "BMS Event Management", count: 9 },
    { name: "BSc Anaesthesia", count: 9 },
    { name: "BSc Industrial Chemistry", count: 9 },
    { name: "BSc Journalism", count: 9 },
    { name: "BSc Networking", count: 9 },
    { name: "BTech Biotechnology", count: 9 },
    { name: "BTech Chemistry", count: 9 },
    { name: "BTech Civil Engineering Hons", count: 9 },
    { name: "BTech Humanities", count: 9 },
    { name: "BTech Robotics Engineering", count: 9 },
    { name: "B.Voc Graphic Designing", count: 9 },
    { name: "B.Voc Renewable Energy", count: 9 },
    { name: "Diploma Civil Engineering", count: 9 },
    { name: "DM Hematology", count: 9 },
    { name: "PhD Biomedical Science", count: 9 },
    { name: "PhD Library Science", count: 9 },
    { name: "PhD Petroleum Engineering", count: 9 },
    { name: "PhD Polymer Science", count: 9 },
    { name: "PhD Psychiatry", count: 9 },
    { name: "Executive MBA Business Analytics", count: 9 },
    { name: "LLM Environmental Law", count: 9 },
    { name: "MA Gender Studies", count: 9 },
    { name: "MA Naturopathy", count: 9 },
    { name: "MA Population Studies", count: 9 },
    { name: "MA Social Science", count: 9 },
    { name: "MBA Leadership", count: 9 },
    { name: "M.Com Accounting", count: 9 },
    { name: "M.Com Corporate Secretaryship", count: 9 },
    { name: "MD Chemistry", count: 9 },
    { name: "M.Des Industrial Design", count: 9 },
    { name: "ME Digital Systems", count: 9 },
    { name: "ME Power Electronics", count: 9 },
    { name: "ME Product Design", count: 9 },
    { name: "M.Lib.I.Sc Information Science", count: 9 },
    { name: "M.Phil Hr", count: 9 },
    { name: "M.Phil Life Science", count: 9 },
    { name: "MPT Neuroscience", count: 9 },
    { name: "M.S Pharmacology", count: 9 },
    { name: "M.S Physiology", count: 9 },
    { name: "MSc Actuarial Science", count: 9 },
    { name: "MSc Agroforestry", count: 9 },
    { name: "MSc Biophysics", count: 9 },
    { name: "MSc Costume Design", count: 9 },
    { name: "MSc Earth Science", count: 9 },
    { name: "MSc Food Service Management", count: 9 },
    { name: "MSc Hospital Administration", count: 9 },
    { name: "MSc Hospitality", count: 9 },
    { name: "MSc Information Science", count: 9 },
    { name: "MSc Mathematics Hons", count: 9 },
    { name: "MSc Medicine", count: 9 },
    { name: "MSc Sociology", count: 9 },
    { name: "MTech Biotechnology", count: 9 },
    { name: "MTech Cloud Computing", count: 9 },
    { name: "MTech Dairy Technology", count: 9 },
    { name: "MTech Highway Engineering", count: 9 },
    { name: "MTech Marine Engineering", count: 9 },
    { name: "MTech Process Engineering", count: 9 },
    { name: "PGD Banking And Finance", count: 9 },
    { name: "PGD Chemistry", count: 9 },
    { name: "PGD Clinical Psychology", count: 9 },
    { name: "PGD Drug Regulatory Affairs", count: 9 },
    { name: "PGD Film Making", count: 9 },
    { name: "PGD Women Studies", count: 9 },
    { name: "PGDM Banking", count: 9 },
    { name: "PGC Retail Management", count: 9 },
    { name: "PGP Data Science", count: 9 },
    { name: "PGP Information Technology", count: 9 },
    { name: "Advance Diploma Banking And Insurance", count: 8 },
    { name: "Advance Diploma Bioinformatics", count: 8 },
    { name: "Advance Diploma Business Administration", count: 8 },
    { name: "Advance Diploma Medical Laboratory Technology", count: 8 },
    { name: "BA Acting", count: 8 },
    { name: "BA Anthropology Hons", count: 8 },
    { name: "BA English Literature Hons", count: 8 },
    { name: "BA Marketing", count: 8 },
    { name: "BA Public Policy", count: 8 },
    { name: "BA Visual Arts", count: 8 },
    { name: "BBA Accountancy", count: 8 },
    { name: "BBA Accounting And Finance", count: 8 },
    { name: "BBA Healthcare Management", count: 8 },
    { name: "BBA International Business Hons", count: 8 },
    { name: "BCom Banking And Finance", count: 8 },
    { name: "BCom Banking And Insurance Hons", count: 8 },
    { name: "BCom Financial Market Hons", count: 8 },
    { name: "B.Des Knitwear Design", count: 8 },
    {
      name: "Bachelor of Engineering Electronics Communication Engineering",
      count: 8,
    },
    { name: "Bachelor of Engineering Petrochemical Engineering", count: 8 },
    { name: "B.Ed Sanskrit", count: 8 },
    { name: "BHM Culinary Arts", count: 8 },
    { name: "BSc Actuarial Science", count: 8 },
    { name: "BSc Aquaculture", count: 8 },
    { name: "BSc Electronic Media", count: 8 },
    { name: "BSc Finance", count: 8 },
    { name: "BSc Multimedia Technology", count: 8 },
    { name: "BSc Naturopathy", count: 8 },
    { name: "BSc Physiotherapy", count: 8 },
    { name: "BSc Quality Control", count: 8 },
    { name: "BTech Power Engineering", count: 8 },
    { name: "B.Voc Information Technology", count: 8 },
    { name: "Distance MBA Hr", count: 8 },
    { name: "DM Anaesthesia", count: 8 },
    { name: "DM Pulmonary Medicine", count: 8 },
    { name: "PhD Ancient History", count: 8 },
    { name: "PhD Applied Psychology", count: 8 },
    { name: "PhD Artificial Intelligence", count: 8 },
    { name: "PhD Data Science", count: 8 },
    { name: "PhD Forensic Medicine", count: 8 },
    { name: "PhD Immunology", count: 8 },
    { name: "PhD Instrumentation Engineering", count: 8 },
    { name: "PhD Liberal Arts", count: 8 },
    { name: "PhD Orthopaedics", count: 8 },
    { name: "PhD Pharmaceutical Analysis", count: 8 },
    { name: "PhD Public Policy", count: 8 },
    { name: "PhD Structural Engineering", count: 8 },
    { name: "PhD Supply Chain Management", count: 8 },
    { name: "Executive MBA Information Technology", count: 8 },
    { name: "Executive MBA Operations Management", count: 8 },
    { name: "LLM Dispute Resolution", count: 8 },
    { name: "LLM Labour Law", count: 8 },
    { name: "MA Advertising", count: 8 },
    { name: "MA Folklore", count: 8 },
    { name: "MA Industrial Relation", count: 8 },
    { name: "MA Spanish", count: 8 },
    { name: "MA Yogic Science", count: 8 },
    { name: "M.Arch Sustainable Architecture", count: 8 },
    { name: "MFTech Fashion Technology", count: 8 },
    { name: "HMCT Hotel Management", count: 8 },
    { name: "MLib Library and Information Science", count: 8 },
    { name: "MBA Agribusiness", count: 8 },
    { name: "MBA Economics", count: 8 },
    { name: "MBA Financial Market", count: 8 },
    { name: "MBA Public Relations", count: 8 },
    { name: "MCA Information Technology", count: 8 },
    { name: "M.Com Co-Operative Management", count: 8 },
    { name: "M.Com Financial Analysis", count: 8 },
    { name: "MD Orthopaedics", count: 8 },
    { name: "ME Computer Integrated Manufacturing", count: 8 },
    { name: "ME Infrastructure Engineering", count: 8 },
    { name: "ME Power Engineering", count: 8 },
    { name: "M.Ed English", count: 8 },
    { name: "M.Ed Mathematics", count: 8 },
    { name: "MPP Public Policy", count: 8 },
    { name: "M.S Obstetrics Gynaecology", count: 8 },
    { name: "MSc Biology Hons", count: 8 },
    { name: "MSc Environmental Management", count: 8 },
    { name: "MSc Finance", count: 8 },
    { name: "MSc Mass Communication", count: 8 },
    { name: "MSc Mental Health", count: 8 },
    { name: "MSc Multimedia Technology", count: 8 },
    { name: "MSc Plantation Crops", count: 8 },
    { name: "MTech Information Science", count: 8 },
    { name: "MTech Production Technology", count: 8 },
    { name: "MTech Project Management", count: 8 },
    { name: "MTech Water Conservation", count: 8 },
    { name: "MVA Painting", count: 8 },
    { name: "PGD Cosmetology", count: 8 },
    { name: "PGD Financial Market", count: 8 },
    { name: "PGD French", count: 8 },
    { name: "PGD Geriatric Medicine", count: 8 },
    { name: "PGD Media Management", count: 8 },
    { name: "PGD Music", count: 8 },
    { name: "PGD Resource Management", count: 8 },
    { name: "PGD Risk Management", count: 8 },
    { name: "Advance Diploma Business Management", count: 7 },
    { name: "BA Business Economics", count: 7 },
    { name: "BA Rural Development", count: 7 },
    { name: "BA Spanish Hons", count: 7 },
    { name: "BA Visual Communication", count: 7 },
    { name: "BFAD Fashion Design", count: 7 },
    { name: "Bachelor of Fashion Design Fashion Design", count: 7 },
    { name: "BCom Auditing", count: 7 },
    { name: "BCom Bank Management", count: 7 },
    { name: "BCom Business Administration Hons", count: 7 },
    { name: "BCom Economics Hons", count: 7 },
    { name: "BCom Information Technology", count: 7 },
    {
      name: "Bachelor of Engineering Electronics and Instrumentation",
      count: 7,
    },
    { name: "B.Ed Physical Education", count: 7 },
    { name: "BSc Aeronautical Science", count: 7 },
    { name: "BSc Biomedical Science", count: 7 },
    { name: "BSc Business Management", count: 7 },
    { name: "BSc Defence Studies", count: 7 },
    { name: "BSc Food and Nutrition Hons", count: 7 },
    { name: "BSc Food Processing Technology", count: 7 },
    { name: "BSc Hindi", count: 7 },
    { name: "BSc Life Science Hons", count: 7 },
    { name: "BSc Media Science", count: 7 },
    { name: "BSc Operation Theatre Technology Hons", count: 7 },
    { name: "BSc Plant Science", count: 7 },
    { name: "BTech Data Analytics", count: 7 },
    { name: "BTech Electronics Engineering Hons", count: 7 },
    { name: "BTech Food Science", count: 7 },
    { name: "BTech Leather Technology", count: 7 },
    { name: "BTech Process Engineering", count: 7 },
    { name: "BTech Safety Engineering", count: 7 },
    { name: "BVA Product Design", count: 7 },
    { name: "Diploma Electrical Engineering", count: 7 },
    { name: "Distance MBA Finance", count: 7 },
    { name: "Distance MBA Marketing", count: 7 },
    { name: "PhD Aeronautical Engineering", count: 7 },
    { name: "PhD Anaesthesia", count: 7 },
    { name: "PhD Biophysics", count: 7 },
    { name: "PhD Business Economics", count: 7 },
    { name: "PhD Conservative Dentistry", count: 7 },
    { name: "PhD Development Studies", count: 7 },
    { name: "PhD Food Science And Technology", count: 7 },
    { name: "PhD Geoinformatics", count: 7 },
    { name: "PhD Islamic Studies", count: 7 },
    { name: "PhD Malayalam", count: 7 },
    { name: "PhD Ophthalmology", count: 7 },
    { name: "PhD Orthodontics", count: 7 },
    { name: "Executive MBA Business Management", count: 7 },
    { name: "MA Theology", count: 7 },
    { name: "M.Arch Construction Management", count: 7 },
    { name: "MSM Sports Management", count: 7 },
    { name: "MBA Accounting", count: 7 },
    { name: "MBA Accounting And Finance", count: 7 },
    { name: "MBA Communication Management", count: 7 },
    { name: "MBA Disaster Management", count: 7 },
    { name: "MBA Education Management", count: 7 },
    { name: "MBA Energy Management", count: 7 },
    { name: "MBA Environmental Management", count: 7 },
    { name: "MBA Financial Technology", count: 7 },
    { name: "MBA Power Management", count: 7 },
    { name: "MBA Risk Management", count: 7 },
    { name: "MBA Strategic Management", count: 7 },
    { name: "MBE Business Economics", count: 7 },
    { name: "MD Homeopathy", count: 7 },
    { name: "M.Des Design management", count: 7 },
    { name: "M.Des Graphic Designing", count: 7 },
    { name: "M.Des Interaction Design", count: 7 },
    { name: "M.Des Textile Design", count: 7 },
    { name: "ME Network Engineering", count: 7 },
    { name: "ME Water Resources Engineering", count: 7 },
    { name: "ME Wireless Communication", count: 7 },
    { name: "M.Pharm Chemistry", count: 7 },
    { name: "M.Phil Bioinformatics", count: 7 },
    { name: "M.Phil Food Science", count: 7 },
    { name: "M.Phil Information Technology", count: 7 },
    { name: "M.Phil Marketing", count: 7 },
    { name: "M.S Medicine", count: 7 },
    { name: "M.S Paediatrics", count: 7 },
    { name: "M.S Pathology", count: 7 },
    { name: "MSc Animal husbandry", count: 7 },
    { name: "MSc Atmospheric Science", count: 7 },
    { name: "MSc Biotech Hons", count: 7 },
    { name: "MSc Electrical Engineering", count: 7 },
    { name: "MSc Film Making", count: 7 },
    { name: "MSc Floriculture", count: 7 },
    { name: "MSc Material Science", count: 7 },
    { name: "MSc Neuroscience", count: 7 },
    { name: "MSc Software System", count: 7 },
    { name: "MSc Virology", count: 7 },
    { name: "MTech Avionics", count: 7 },
    { name: "MTech Biomedical Instrumentation", count: 7 },
    { name: "MTech Engineering Management", count: 7 },
    { name: "MTech Industrial Engineering And Management", count: 7 },
    { name: "MTech Information System", count: 7 },
    { name: "MTech Infrastructure Engineering", count: 7 },
    { name: "MTech Mechatronics Engineering", count: 7 },
    { name: "MTech Polymer Science", count: 7 },
    { name: "M.V.Sc Epidemiology", count: 7 },
    { name: "PGD Actuarial Science", count: 7 },
    { name: "PGD Finance Management", count: 7 },
    { name: "PGD German", count: 7 },
    { name: "PGD Healthcare Management", count: 7 },
    { name: "PGD Information Security", count: 7 },
    { name: "PGD Insurance", count: 7 },
    { name: "PGD Mass Media", count: 7 },
    { name: "PGD Museology", count: 7 },
    { name: "PGD Radiodiagnosis", count: 7 },
    { name: "PGD Tailoring", count: 7 },
    { name: "PGDM Business Management", count: 7 },
    { name: "PGDM Digital Marketing", count: 7 },
    { name: "PGP International Business", count: 7 },
    { name: "Advance Diploma English", count: 6 },
    { name: "Advance Diploma Foreign Trade", count: 6 },
    { name: "Advance Diploma Hr", count: 6 },
    { name: "Advance Diploma Marketing", count: 6 },
    { name: "BA Civil Service", count: 6 },
    { name: "BA Environmental Science", count: 6 },
    { name: "BA Film Making Hons", count: 6 },
    { name: "BA Hr", count: 6 },
    { name: "BA Islamic Studies Hons", count: 6 },
    { name: "BA Media Studies Hons", count: 6 },
    { name: "BA Physical Education Hons", count: 6 },
    { name: "BA Public Policy Hons", count: 6 },
    { name: "BBA Agriculture", count: 6 },
    { name: "BBA Banking And Finance", count: 6 },
    { name: "BBA Financial Market Hons", count: 6 },
    { name: "BBA Information System", count: 6 },
    { name: "BBA Supply Chain Management Hons", count: 6 },
    { name: "BBA Tourism Hons", count: 6 },
    { name: "BBS Business Studies", count: 6 },
    { name: "BCA Big Data", count: 6 },
    { name: "BCA Information Technology", count: 6 },
    { name: "BCom Business Analytics Hons", count: 6 },
    { name: "BCom Data Analytics", count: 6 },
    { name: "BCom Financial Services", count: 6 },
    { name: "BCom Insurance", count: 6 },
    { name: "BCom Insurance Management", count: 6 },
    { name: "BCom International Accounting Hons", count: 6 },
    { name: "BCom Marketing Management", count: 6 },
    { name: "B.Des Interaction Design", count: 6 },
    { name: "Bachelor of Engineering Aerospace Engineering", count: 6 },
    { name: "Bachelor of Engineering Architecture Engineering", count: 6 },
    { name: "Bachelor of Engineering Food Technology Engineering", count: 6 },
    { name: "Bachelor of Engineering Mechatronics", count: 6 },
    { name: "Bachelor of Engineering Power Engineering", count: 6 },
    { name: "B.Ed Mental Retardation", count: 6 },
    { name: "BHMS Homeopathy", count: 6 },
    { name: "BMS Hospitality Management", count: 6 },
    { name: "B Pharmacy Chemistry", count: 6 },
    { name: "BSc Cyber Security Hons", count: 6 },
    { name: "BSc Digital Marketing", count: 6 },
    { name: "BSc Entomology", count: 6 },
    { name: "BSc Fashion Communication", count: 6 },
    { name: "BSc Food Science Hons", count: 6 },
    { name: "BSc Hospital Administration", count: 6 },
    { name: "BSc Human Nutrition", count: 6 },
    { name: "BSc Medical Laboratory Technology Hons", count: 6 },
    { name: "BSc Military Science", count: 6 },
    { name: "BSc Public Health", count: 6 },
    { name: "BSc Sanskrit", count: 6 },
    { name: "BSc Sociology", count: 6 },
    { name: "BSc Soil Science", count: 6 },
    { name: "BSc Sound Engineering", count: 6 },
    { name: "BTech Architecture Engineering", count: 6 },
    { name: "BTech Artificial Intelligence Hons", count: 6 },
    { name: "BTech Chemical Technology", count: 6 },
    { name: "BTech Cyber Security Hons", count: 6 },
    { name: "BTech Fashion Design", count: 6 },
    { name: "BTech Information Security", count: 6 },
    { name: "BTech Manufacturing Engineering", count: 6 },
    { name: "BTech Pharmaceutical Technology", count: 6 },
    { name: "BTech Structural Engineering", count: 6 },
    { name: "BTech Technology Engineering", count: 6 },
    { name: "B.Voc Journalism", count: 6 },
    { name: "B.Voc Refrigeration and Air Conditioning", count: 6 },
    { name: "B.V.Sc Animal husbandry", count: 6 },
    { name: "B.V.Sc Microbiology", count: 6 },
    { name: "B.V.Sc Pathology", count: 6 },
    { name: "Diploma Computer Engineering", count: 6 },
    { name: "Diploma Hotel Management", count: 6 },
    { name: "D.Litt Literature", count: 6 },
    { name: "DM Rheumatology", count: 6 },
    { name: "PhD Banking", count: 6 },
    { name: "PhD Chemical Sciences", count: 6 },
    { name: "PhD Dairy Science", count: 6 },
    { name: "PhD Film Making", count: 6 },
    { name: "PhD Finance Management", count: 6 },
    { name: "PhD Financial Management", count: 6 },
    { name: "PhD Fisheries", count: 6 },
    { name: "PhD Geotechnical Engineering", count: 6 },
    { name: "PhD Homeopathy", count: 6 },
    { name: "PhD Hospitality", count: 6 },
    { name: "PhD Information Science And Engineering", count: 6 },
    { name: "PhD International Business", count: 6 },
    { name: "PhD Medical Sciences", count: 6 },
    { name: "PhD Meteorology", count: 6 },
    { name: "PhD Neurology", count: 6 },
    { name: "PhD Paediatrics", count: 6 },
    { name: "PhD Physical Science", count: 6 },
    { name: "PhD Punjabi", count: 6 },
    { name: "PhD Russian", count: 6 },
    { name: "PhD Strategic Management", count: 6 },
    { name: "Executive MBA Supply Chain Management", count: 6 },
    { name: "MA Ancient Indian History", count: 6 },
    { name: "MA Chinese", count: 6 },
    { name: "MA Defence Studies", count: 6 },
    { name: "MA Disaster Management", count: 6 },
    { name: "MA Museology", count: 6 },
    { name: "MA Odia", count: 6 },
    { name: "M.Arch Conservation", count: 6 },
    { name: "Masters in Hospital Management Hospital Management", count: 6 },
    { name: "MMus Music", count: 6 },
    { name: "MBA Airline Management", count: 6 },
    { name: "MBA Construction Management", count: 6 },
    { name: "MBA Finance Management", count: 6 },
    { name: "MBA Insurance Management", count: 6 },
    { name: "MBA International Management", count: 6 },
    { name: "MBA Investment Management", count: 6 },
    { name: "MBA Textile Design", count: 6 },
    { name: "M.Com Business Economics", count: 6 },
    { name: "M.Com Entrepreneurship", count: 6 },
    { name: "MD Family Medicine", count: 6 },
    { name: "MD Philosophy", count: 6 },
    { name: "M.Des Merchandising", count: 6 },
    { name: "ME Construction Management", count: 6 },
    { name: "M.Ed Social Science", count: 6 },
    { name: "M.Phil Accountancy", count: 6 },
    { name: "M.Phil Development Studies", count: 6 },
    { name: "M.Phil Financial Management", count: 6 },
    { name: "M.Phil Physics", count: 6 },
    { name: "MPT Cardiology", count: 6 },
    { name: "M.S Microbiology", count: 6 },
    { name: "MSc Applied Nutrition", count: 6 },
    { name: "MSc Biological Sciences", count: 6 },
    { name: "MSc Botany Hons", count: 6 },
    { name: "MSc Clinical Psychology", count: 6 },
    { name: "MSc Communication Management", count: 6 },
    { name: "MSc Conservation", count: 6 },
    { name: "MSc Electrical And Electronics Engineering", count: 6 },
    { name: "MSc Game Design", count: 6 },
    { name: "MSc Medicinal Plants", count: 6 },
    { name: "MSc Molecular Biology", count: 6 },
    { name: "MSc Nuclear Medicine", count: 6 },
    { name: "MSc Perfusion Technology", count: 6 },
    { name: "MSc Physical Science", count: 6 },
    { name: "MSc Toxicology", count: 6 },
    { name: "MTech Chemical Technology", count: 6 },
    { name: "MTech Chemistry", count: 6 },
    { name: "MTech Digital Electronics", count: 6 },
    { name: "MTech Electronics and Communication", count: 6 },
    { name: "MTech Industrial Metallurgy", count: 6 },
    { name: "MTech Machine Learning", count: 6 },
    { name: "MTech Nuclear Engineering", count: 6 },
    { name: "MTech Nuclear Science", count: 6 },
    { name: "MTech Ocean Engineering", count: 6 },
    { name: "MTech Pharmaceutical Technology", count: 6 },
    { name: "MTech Production Management", count: 6 },
    { name: "MTech Technology Management", count: 6 },
    { name: "M.Voc Fashion Design", count: 6 },
    { name: "PGD Acting", count: 6 },
    { name: "PGD Archaeology", count: 6 },
    { name: "PGD Astrology", count: 6 },
    { name: "PGD Clinical Embryology", count: 6 },
    { name: "PGD Corporate Law", count: 6 },
    { name: "PGD Data Analytics", count: 6 },
    { name: "PGD Electronic Media", count: 6 },
    { name: "PGD Energy Management", count: 6 },
    { name: "PGD Insurance Law", count: 6 },
    { name: "PGD Nanotechnology", count: 6 },
    { name: "PGD Nutrition And Dietetics", count: 6 },
    { name: "PGD Pharmaceutical Management", count: 6 },
    { name: "PGD Quality Management", count: 6 },
    { name: "PGD Social Work", count: 6 },
    { name: "PGD Textile Design", count: 6 },
    { name: "PGDM Financial Services", count: 6 },
    { name: "PGP Banking", count: 6 },
    { name: "PGP Business Analytics", count: 6 },
    { name: "PGP Leadership", count: 6 },
    { name: "Advance Diploma Banking", count: 5 },
    { name: "Advance Diploma Chinese", count: 5 },
    { name: "Advance Diploma Japanese", count: 5 },
    { name: "Advance Diploma Journalism", count: 5 },
    { name: "Advance Diploma Mass Communication", count: 5 },
    { name: "Advance Diploma Retail Management", count: 5 },
    { name: "Advance Diploma Tourism", count: 5 },
    { name: "Advance Diploma Urdu", count: 5 },
    { name: "BA Applied Psychology", count: 5 },
    { name: "BA Astrology", count: 5 },
    { name: "BA Culinary Arts", count: 5 },
    { name: "BA Fine Arts Hons", count: 5 },
    { name: "BA Human Rights", count: 5 },
    { name: "BA Human Rights Hons", count: 5 },
    { name: "BA Information Technology", count: 5 },
    { name: "BA International Relations", count: 5 },
    { name: "BA International Relations Hons", count: 5 },
    { name: "BA Linguistics", count: 5 },
    { name: "BA Music Vocal Hons", count: 5 },
    { name: "BA Nepali", count: 5 },
    { name: "BA Spanish", count: 5 },
    { name: "BPH Public Health", count: 5 },
    { name: "BEIED Elementary Education", count: 5 },
    { name: "Bachelor of Sports Management Sports Management", count: 5 },
    { name: "BTTM Tourism Management", count: 5 },
    { name: "BBA Healthcare Management Hons", count: 5 },
    { name: "BBA International Management", count: 5 },
    { name: "BBA Retail Management Hons", count: 5 },
    { name: "BBA Rural Management", count: 5 },
    { name: "BBA Tourism Management", count: 5 },
    { name: "BCA Big Data Analytics", count: 5 },
    { name: "BCom Advertising", count: 5 },
    { name: "BCom Business Management", count: 5 },
    { name: "BCom Entrepreneurship", count: 5 },
    { name: "BCom Entrepreneurship Hons", count: 5 },
    { name: "BCom Financial Management", count: 5 },
    { name: "BCom Investment Management", count: 5 },
    { name: "B.Des Fashion Design Hons", count: 5 },
    { name: "B.Des Film Making", count: 5 },
    { name: "BDS General Surgery", count: 5 },
    { name: "Bachelor of Engineering Agriculture", count: 5 },
    { name: "BMC Media Communication", count: 5 },
    { name: "BMS Sports Management", count: 5 },
    { name: "BSc Airport Management", count: 5 },
    { name: "BSc Applied Mathematics Hons", count: 5 },
    { name: "BSc Applied Psychology Hons", count: 5 },
    { name: "BSc Bioinformatics Hons", count: 5 },
    { name: "BSc Clinical Psychology Hons", count: 5 },
    { name: "BSc Dairy Technology", count: 5 },
    { name: "BSc Data Analytics", count: 5 },
    { name: "BSc English", count: 5 },
    { name: "BSc Food Science And Technology", count: 5 },
    { name: "BSc Graphic Designing", count: 5 },
    { name: "BSc Human Development Hons", count: 5 },
    { name: "BSc Interior Design Hons", count: 5 },
    { name: "BSc Liberal Arts", count: 5 },
    { name: "BSc Mass Communication", count: 5 },
    { name: "BSc Safety Management", count: 5 },
    { name: "BSc Visual Media", count: 5 },
    { name: "BTech Applied Electronics", count: 5 },
    { name: "BTech Automotive Engineering", count: 5 },
    { name: "BTech Business Analytics", count: 5 },
    { name: "BTech Ceramic Engineering", count: 5 },
    { name: "BTech Information Science And Engineering", count: 5 },
    { name: "BTech Polymer Science", count: 5 },
    { name: "BVA Graphic Designing", count: 5 },
    { name: "B.Voc Digital Marketing", count: 5 },
    { name: "B.Voc Electronics", count: 5 },
    { name: "B.Voc Energy Management", count: 5 },
    { name: "B.Voc Hospitality", count: 5 },
    { name: "B.Voc Imaging Technology", count: 5 },
    { name: "B.Voc Production Technology", count: 5 },
    { name: "B.V.Sc Anatomy", count: 5 },
    { name: "B.V.Sc Genetics", count: 5 },
    { name: "B.V.Sc Nutrition", count: 5 },
    { name: "Diploma Acting", count: 5 },
    { name: "Diploma Electronics", count: 5 },
    { name: "Diploma Photography", count: 5 },
    { name: "DM Pharmacology", count: 5 },
    { name: "PhD Accounting", count: 5 },
    { name: "PhD Animal husbandry", count: 5 },
    { name: "PhD Applied Mechanics", count: 5 },
    { name: "PhD Assamese", count: 5 },
    { name: "PhD Atmospheric Science", count: 5 },
    { name: "PhD Clinical Research", count: 5 },
    { name: "PhD Finance and Accounting", count: 5 },
    { name: "PhD Fisheries Science", count: 5 },
    { name: "PhD German", count: 5 },
    { name: "PhD Health Sciences", count: 5 },
    { name: "PhD International Relations", count: 5 },
    { name: "PhD Neuroscience", count: 5 },
    { name: "PhD Politics", count: 5 },
    { name: "PhD Quality Assurance", count: 5 },
    { name: "PhD Remote Sensing", count: 5 },
    { name: "PhD Renewable Energy", count: 5 },
    { name: "PhD Technology Management", count: 5 },
    { name: "PhD Water Resources Engineering", count: 5 },
    { name: "Executive MBA Banking", count: 5 },
    { name: "Executive MBA Fashion Design", count: 5 },
    { name: "Executive MBA Medicine", count: 5 },
    { name: "LLM Information Technology", count: 5 },
    { name: "LLM International Trade", count: 5 },
    { name: "MA Applied Linguistics", count: 5 },
    { name: "MA English Hons", count: 5 },
    { name: "MA Geology", count: 5 },
    { name: "MA Marketing", count: 5 },
    { name: "MA Photography", count: 5 },
    { name: "MA Rajasthani", count: 5 },
    { name: "MA Visual Arts", count: 5 },
    { name: "M.Arch Interior Design", count: 5 },
    { name: "MBM Business Management", count: 5 },
    { name: "MBS Business Studies", count: 5 },
    { name: "MFD Fashion Design", count: 5 },
    { name: "MBA Big Data Analytics", count: 5 },
    { name: "MBA Health Management", count: 5 },
    { name: "MBBS Anatomy", count: 5 },
    { name: "MBBS Orthopaedics", count: 5 },
    { name: "MBBS Physiology", count: 5 },
    { name: "M.Com Business Studies", count: 5 },
    { name: "MD Ent", count: 5 },
    { name: "MD Hematology", count: 5 },
    { name: "M.Des Visual Communication", count: 5 },
    { name: "ME Computer Application", count: 5 },
    { name: "ME Geotechnical Engineering", count: 5 },
    { name: "ME High Voltage Engineering", count: 5 },
    { name: "ME Robotics", count: 5 },
    { name: "MMS Event Management", count: 5 },
    { name: "MPA Dance", count: 5 },
    { name: "MPH Epidemiology", count: 5 },
    { name: "M.Pharm Medicine", count: 5 },
    { name: "M.Phil Business Management", count: 5 },
    { name: "M.Phil Corporate Secretaryship", count: 5 },
    { name: "M.Phil Fine Arts", count: 5 },
    { name: "M.Phil Gujarati", count: 5 },
    { name: "M.Phil Odia", count: 5 },
    { name: "MPM Industrial Relation", count: 5 },
    { name: "M.S Community Medicine", count: 5 },
    { name: "M.S General Medicine", count: 5 },
    { name: "MSc Anaesthesia Technology", count: 5 },
    { name: "MSc Applied chemistry", count: 5 },
    { name: "MSc Applied Mathematics", count: 5 },
    { name: "MSc Astrophysics", count: 5 },
    { name: "MSc Chemical Engineering", count: 5 },
    { name: "MSc Child Development", count: 5 },
    { name: "MSc Communication Engineering", count: 5 },
    { name: "MSc Epidemiology", count: 5 },
    { name: "MSc Fisheries", count: 5 },
    { name: "MSc Humanities", count: 5 },
    { name: "MSc Information System", count: 5 },
    { name: "MSc Library and Information Science", count: 5 },
    { name: "MSc Marketing", count: 5 },
    { name: "MSc Media Science", count: 5 },
    { name: "MSc Medical Microbiology", count: 5 },
    { name: "MSc Military Science", count: 5 },
    { name: "MSc Networking", count: 5 },
    { name: "MSc Oceanography", count: 5 },
    { name: "MSc Pharmaceutical Chemistry", count: 5 },
    { name: "MSc Physician Assistant", count: 5 },
    { name: "MSc Plant Protection", count: 5 },
    { name: "MSc Renewable Energy", count: 5 },
    { name: "MSW Hr", count: 5 },
    { name: "MTech Biology", count: 5 },
    { name: "MTech Data Analytics", count: 5 },
    { name: "MTech Earthquake Engineering", count: 5 },
    { name: "MTech Engineering Physics", count: 5 },
    { name: "MTech Geology", count: 5 },
    { name: "MTech High Voltage Engineering", count: 5 },
    { name: "MTech Plastic Engineering", count: 5 },
    { name: "MTech Safety Engineering", count: 5 },
    { name: "MTech Technology Engineering", count: 5 },
    { name: "MTech Tool Engineering", count: 5 },
    { name: "MVA Applied Arts", count: 5 },
    { name: "M.Voc Interior Design", count: 5 },
    { name: "PGD Accounting", count: 5 },
    { name: "PGD Analytical Techniques", count: 5 },
    { name: "PGD Applied Nutrition", count: 5 },
    { name: "PGD Arabic", count: 5 },
    { name: "PGD Corporate Communication", count: 5 },
    { name: "PGD Earth Science", count: 5 },
    { name: "PGD Economics", count: 5 },
    { name: "PGD Family Medicine", count: 5 },
    { name: "PGD Financial Analysis", count: 5 },
    { name: "PGD Financial Planning", count: 5 },
    { name: "PGD Food Safety", count: 5 },
    { name: "PGD Geoinformatics", count: 5 },
    { name: "PGD Graphic Designing", count: 5 },
    { name: "PGD Hospitality", count: 5 },
    { name: "PGD Imaging Technology", count: 5 },
    { name: "PGD Leadership", count: 5 },
    { name: "PGD Materials Management", count: 5 },
    { name: "PGD Pathology", count: 5 },
    { name: "PGD Pharmacovigilance", count: 5 },
    { name: "PGD Physics", count: 5 },
    { name: "PGD Physiology", count: 5 },
    { name: "PGD Public Administration", count: 5 },
    { name: "PGD Renewable Energy", count: 5 },
    { name: "PGD Safety Management", count: 5 },
    { name: "PGD Sanskrit", count: 5 },
    { name: "PGD Secretarial Practice", count: 5 },
    { name: "PGD Tamil", count: 5 },
    { name: "PGDM Retail Management", count: 5 },
    { name: "PGC Business Analytics", count: 5 },
    { name: "PGC Business Management", count: 5 },
    { name: "PGC International Business", count: 5 },
    { name: "PGC Marketing", count: 5 },
    { name: "PGP Healthcare Management", count: 5 },
    { name: "PGP Journalism", count: 5 },
    { name: "PGP Risk Management", count: 5 },
    { name: "Advance Certificate Fashion Design", count: 4 },
    { name: "Advance Diploma Counselling", count: 4 },
    { name: "Advance Diploma Event Management", count: 4 },
    { name: "Advance Diploma Graphic Designing", count: 4 },
    { name: "Advance Diploma Persian", count: 4 },
    { name: "Advance Diploma Supply Chain Management", count: 4 },
    { name: "Advance Diploma VFX", count: 4 },
    { name: "Advance Diploma Web Designing", count: 4 },
    { name: "BA Applied Arts", count: 4 },
    { name: "BA Dance Hons", count: 4 },
    { name: "BA Hospitality Management Hons", count: 4 },
    { name: "BA International Studies", count: 4 },
    { name: "BA Konkani", count: 4 },
    { name: "BA Mass Media", count: 4 },
    { name: "BA Media Studies", count: 4 },
    { name: "BA Russian", count: 4 },
    { name: "BA Russian Hons", count: 4 },
    { name: "BA Secretarial Practice", count: 4 },
    { name: "BA Tourism Hons", count: 4 },
    { name: "BA Visual Effects", count: 4 },
    { name: "BCJ Journalism", count: 4 },
    { name: "BStat Statistics", count: 4 },
    { name: "BFD Fashion Design", count: 4 },
    { name: "BAF Accounting And Finance", count: 4 },
    { name: "BBA Banking And Insurance", count: 4 },
    { name: "BBA Brand Management", count: 4 },
    { name: "BBA Business Intelligence", count: 4 },
    { name: "BBA Digital Business", count: 4 },
    { name: "BBA Financial Analysis", count: 4 },
    { name: "BBA Human Resource Management", count: 4 },
    { name: "BBA Insurance", count: 4 },
    { name: "BBA Leadership", count: 4 },
    { name: "BBA Operations Management Hons", count: 4 },
    { name: "BBA Pharmaceutical Management", count: 4 },
    { name: "BBA Risk Management", count: 4 },
    { name: "BBA Sales Management", count: 4 },
    { name: "BBE Business Economics", count: 4 },
    { name: "BCA Computer Science", count: 4 },
    { name: "BCA Digital Marketing", count: 4 },
    { name: "BCA Ethical Hacking", count: 4 },
    { name: "BCA Networking", count: 4 },
    { name: "BCom Brand Management", count: 4 },
    { name: "BCom Digital Marketing", count: 4 },
    { name: "BCom English", count: 4 },
    { name: "BCom Finance and Accounting", count: 4 },
    { name: "BCom Hindi", count: 4 },
    { name: "BCom International Accounting", count: 4 },
    { name: "BCom Management Accounting Hons", count: 4 },
    { name: "BCom Professional Accounting Hons", count: 4 },
    { name: "BCom Risk Management Hons", count: 4 },
    { name: "B.Des Communication Design Hons", count: 4 },
    { name: "B.Des Fashion Styling", count: 4 },
    { name: "BDS Biochemistry", count: 4 },
    {
      name: "Bachelor of Engineering Applied Electronics And Instrumentation",
      count: 4,
    },
    { name: "Bachelor of Engineering Chemical Technology", count: 4 },
    { name: "Bachelor of Engineering Food Technology", count: 4 },
    { name: "B.Ed Life Science", count: 4 },
    { name: "B.Ed Political Science", count: 4 },
    { name: "BFA Textile Design", count: 4 },
    { name: "BMS Finance", count: 4 },
    { name: "BMS Marketing", count: 4 },
    { name: "B Pharmacy Pharmacognosy", count: 4 },
    { name: "BSc Animal husbandry", count: 4 },
    { name: "BSc Animal husbandry Hons", count: 4 },
    { name: "BSc Big Data Analytics", count: 4 },
    { name: "BSc Blood Bank", count: 4 },
    { name: "BSc Cardio Vascular", count: 4 },
    { name: "BSc Electronic Science", count: 4 },
    { name: "BSc Film Making Hons", count: 4 },
    { name: "BSc Food and Nutrition", count: 4 },
    { name: "BSc Hospital Management", count: 4 },
    { name: "BSc Information Science", count: 4 },
    { name: "BSc Nano Science", count: 4 },
    { name: "BSc Nanotechnology", count: 4 },
    { name: "BSc Occupational Therapy", count: 4 },
    { name: "BSc Product Design", count: 4 },
    { name: "BSc Social Science", count: 4 },
    { name: "BSc Software System", count: 4 },
    { name: "BSW Social Work Hons", count: 4 },
    { name: "BTech Aircraft Maintenance Engineering", count: 4 },
    { name: "BTech Communication Systems", count: 4 },
    { name: "BTech Engineering Design", count: 4 },
    { name: "BTech Engineering Science", count: 4 },
    { name: "BTech Graphic Designing", count: 4 },
    { name: "BTech Information Technology Hons", count: 4 },
    { name: "BTech Ocean Engineering", count: 4 },
    { name: "BTech Ship Building", count: 4 },
    { name: "BTech Vlsi Design", count: 4 },
    { name: "BVA Visual Effects", count: 4 },
    { name: "B.Voc 3D Animation", count: 4 },
    { name: "B.Voc Computer Application", count: 4 },
    { name: "B.Voc Entrepreneurship", count: 4 },
    { name: "B.Voc Film Making", count: 4 },
    { name: "B.Voc Marketing", count: 4 },
    { name: "B.Voc Sales Management", count: 4 },
    { name: "B.V.Sc Ecology", count: 4 },
    { name: "B.V.Sc Pharmacology", count: 4 },
    { name: "B.V.Sc Public Health", count: 4 },
    { name: "Certificate Acting", count: 4 },
    { name: "Certificate Aircraft Maintenance Engineering", count: 4 },
    { name: "Certificate Nursery Teacher Training", count: 4 },
    { name: "Diploma Fashion Design", count: 4 },
    { name: "Diploma Information Technology", count: 4 },
    { name: "Diploma Medical Laboratory Technology", count: 4 },
    { name: "Diploma Tourism", count: 4 },
    { name: "Distance B.Com Computer Application", count: 4 },
    { name: "Distance MBA Information Technology", count: 4 },
    { name: "DM Immunology", count: 4 },
    { name: "DM Medical Gastroenterology", count: 4 },
    { name: "PhD Accountancy", count: 4 },
    { name: "PhD Agroforestry", count: 4 },
    { name: "PhD Allied Health Science", count: 4 },
    { name: "PhD Applied Economics", count: 4 },
    { name: "PhD Applied Electronics", count: 4 },
    { name: "PhD Audiology", count: 4 },
    { name: "PhD Aviation", count: 4 },
    { name: "PhD Business Studies", count: 4 },
    { name: "PhD Cardiology", count: 4 },
    { name: "PhD Chemical Technology", count: 4 },
    { name: "PhD Dermatology", count: 4 },
    { name: "PhD Environment Science", count: 4 },
    { name: "PhD Folklore", count: 4 },
    { name: "PhD Gender Studies", count: 4 },
    { name: "PhD Hospital Administration", count: 4 },
    { name: "PhD Industrial Management", count: 4 },
    { name: "PhD International Studies", count: 4 },
    { name: "PhD Medical Surgical Nursing", count: 4 },
    { name: "PhD Molecular Medicine", count: 4 },
    { name: "PhD Nutrition And Dietetics", count: 4 },
    { name: "PhD Periodontics", count: 4 },
    { name: "PhD Pharmaceutical Technology", count: 4 },
    { name: "PhD Plant Pathology", count: 4 },
    { name: "PhD Prosthodontics", count: 4 },
    { name: "PhD Software Engineering", count: 4 },
    { name: "PhD Special Education", count: 4 },
    { name: "PhD Sustainable Architecture", count: 4 },
    { name: "PhD Textile Engineering", count: 4 },
    { name: "PhD Theology", count: 4 },
    { name: "PhD Thermal Engineering", count: 4 },
    { name: "PhD Virology", count: 4 },
    { name: "PhD Visual Communication", count: 4 },
    { name: "Executive MBA Aviation Management", count: 4 },
    { name: "Executive MBA Digital Marketing", count: 4 },
    { name: "Executive MBA Hospital Management", count: 4 },
    { name: "Executive MBA Hospitality Management", count: 4 },
    { name: "Executive MBA Information System", count: 4 },
    { name: "Executive MBA Leadership", count: 4 },
    { name: "Executive MBA Retail Management", count: 4 },
    { name: "LLM Mercantile Law", count: 4 },
    { name: "MA Adult Education", count: 4 },
    { name: "MA Astrology", count: 4 },
    { name: "MA Corporate Communication", count: 4 },
    { name: "MA Cultural Studies", count: 4 },
    { name: "MA Development Administration", count: 4 },
    { name: "MA Economics Hons", count: 4 },
    { name: "MA Graphic Designing", count: 4 },
    { name: "MA Human Development", count: 4 },
    { name: "MA Interior Design", count: 4 },
    { name: "MA Japanese", count: 4 },
    { name: "MA Leadership", count: 4 },
    { name: "MA Media Studies", count: 4 },
    { name: "MA Public Health", count: 4 },
    { name: "MA Textile Design", count: 4 },
    { name: "M.Arch Architectural Design", count: 4 },
    { name: "MID Interior Design", count: 4 },
    { name: "MEM Event Management", count: 4 },
    { name: "MJ Journalism", count: 4 },
    { name: "MOT Mental Health", count: 4 },
    { name: "MBA Advertising", count: 4 },
    { name: "MBA Corporate Secretaryship", count: 4 },
    { name: "MBA Cyber Security", count: 4 },
    { name: "MBA Digital Business", count: 4 },
    { name: "MBA Foreign Trade", count: 4 },
    { name: "MBA Health Care Administration", count: 4 },
    { name: "MBA Industrial Management", count: 4 },
    { name: "MBA Information Management", count: 4 },
    { name: "MBA Management Studies", count: 4 },
    { name: "MBA Product Management", count: 4 },
    { name: "MBA Public Health", count: 4 },
    { name: "MBA Safety Management", count: 4 },
    { name: "MBBS Biochemistry", count: 4 },
    { name: "MBBS Community Medicine", count: 4 },
    { name: "MBBS General Medicine", count: 4 },
    { name: "MBBS General Surgery", count: 4 },
    { name: "MCA Big Data Analytics", count: 4 },
    { name: "MCA Cloud Technology", count: 4 },
    { name: "M.Com Bank Management", count: 4 },
    { name: "M.Com Financial Services", count: 4 },
    { name: "M.Com Statistics", count: 4 },
    { name: "M.Des Fashion Merchandising", count: 4 },
    { name: "M.Des Furniture Design", count: 4 },
    { name: "ME Communication and Networking", count: 4 },
    { name: "ME Computer Science Engineering", count: 4 },
    { name: "ME Energy Systems", count: 4 },
    { name: "ME Industrial Safety", count: 4 },
    { name: "ME Nano Science", count: 4 },
    { name: "ME Plastic Engineering", count: 4 },
    { name: "ME Textile Engineering", count: 4 },
    { name: "M.Ed Physical Science", count: 4 },
    { name: "MHA Health Administration", count: 4 },
    { name: "M.Phil Ancient History", count: 4 },
    { name: "M.Phil Dance", count: 4 },
    { name: "M.Phil Entrepreneurship", count: 4 },
    { name: "M.Phil Finance", count: 4 },
    { name: "M.Phil Genetics", count: 4 },
    { name: "M.Phil Painting", count: 4 },
    { name: "M.Phil Punjabi", count: 4 },
    { name: "M.S Biochemistry", count: 4 },
    { name: "MSc 3D Animation", count: 4 },
    { name: "MSc Applied Statistics", count: 4 },
    { name: "MSc Big Data Analytics", count: 4 },
    { name: "MSc Cardiology", count: 4 },
    { name: "MSc Cardiovascular Technology", count: 4 },
    { name: "MSc Chemical Sciences", count: 4 },
    { name: "MSc Communication Systems", count: 4 },
    { name: "MSc Disaster Management", count: 4 },
    { name: "MSc Economics Hons", count: 4 },
    { name: "MSc Hr", count: 4 },
    { name: "MSc Laryngology", count: 4 },
    { name: "MSc Medical Biochemistry", count: 4 },
    { name: "MSc Molecular Medicine", count: 4 },
    { name: "MSc Natural Resource Management", count: 4 },
    { name: "MSc Physiotherapy", count: 4 },
    { name: "MSc Radiotherapy", count: 4 },
    { name: "MSc Regenerative Medicine", count: 4 },
    { name: "MSc Visual Effects", count: 4 },
    { name: "MSc Zoology Hons", count: 4 },
    { name: "MTech Ceramic Engineering", count: 4 },
    { name: "MTech Communications", count: 4 },
    { name: "MTech Food Safety", count: 4 },
    { name: "MTech Leather Technology", count: 4 },
    { name: "MTech Manufacturing Science And Engineering", count: 4 },
    { name: "MTech Micro Electronics", count: 4 },
    { name: "MTech Microbiology", count: 4 },
    { name: "MTech Optical Engineering", count: 4 },
    { name: "MTech Physics", count: 4 },
    { name: "MTech Software System", count: 4 },
    { name: "PGD Acupuncture", count: 4 },
    { name: "PGD Adult Education", count: 4 },
    { name: "PGD Analytical Chemistry", count: 4 },
    { name: "PGD Artificial Intelligence", count: 4 },
    { name: "PGD Aviation Management", count: 4 },
    { name: "PGD Brand Management", count: 4 },
    { name: "PGD Cardiology", count: 4 },
    { name: "PGD Child Rights", count: 4 },
    { name: "PGD Cinematography", count: 4 },
    { name: "PGD Communication Skills", count: 4 },
    { name: "PGD Consumer Laws", count: 4 },
    { name: "PGD Consumer Protection", count: 4 },
    { name: "PGD Criminal Justice", count: 4 },
    { name: "PGD Dispute Resolution", count: 4 },
    { name: "PGD Educational Management", count: 4 },
    { name: "PGD Electronics", count: 4 },
    { name: "PGD Embedded Systems", count: 4 },
    { name: "PGD Environmental Education", count: 4 },
    { name: "PGD Fashion Communication", count: 4 },
    { name: "PGD Game Design", count: 4 },
    { name: "PGD Genomics", count: 4 },
    { name: "PGD History", count: 4 },
    { name: "PGD Instructional Design", count: 4 },
    { name: "PGD International Trade", count: 4 },
    { name: "PGD Investment Management", count: 4 },
    { name: "PGD Japanese", count: 4 },
    { name: "PGD Kannada", count: 4 },
    { name: "PGD Mechanical Engineering", count: 4 },
    { name: "PGD Microbiology", count: 4 },
    { name: "PGD Molecular Diagnostics", count: 4 },
    { name: "PGD Persian", count: 4 },
    { name: "PGD Philosophy", count: 4 },
    { name: "PGD Portfolio Management", count: 4 },
    { name: "PGD Psychotherapy", count: 4 },
    { name: "PGD Sales Management", count: 4 },
    { name: "PGD Spanish", count: 4 },
    { name: "PGD Special Education", count: 4 },
    { name: "PGD Stress Management", count: 4 },
    { name: "PGD Technical Writing", count: 4 },
    { name: "PGD Theatre Arts", count: 4 },
    { name: "PGD Urdu", count: 4 },
    { name: "PGD Visual Effects", count: 4 },
    { name: "PGD Web Technology", count: 4 },
    { name: "PGDM Sales Management", count: 4 },
    { name: "Post Doctoral Anaesthesia", count: 4 },
    { name: "PGC Cyber Law", count: 4 },
    { name: "PGC Digital Marketing", count: 4 },
    { name: "PGC Finance", count: 4 },
    { name: "PGC Hr", count: 4 },
    { name: "PGP Public Policy", count: 4 },
    { name: "PGP Retail Management", count: 4 },
    { name: "Advance Certificate Advertising", count: 3 },
    { name: "Advance Certificate Interior Design", count: 3 },
    { name: "Advance Diploma Arabic", count: 3 },
    { name: "Advance Diploma Banking And Finance", count: 3 },
    { name: "Advance Diploma Cinematography", count: 3 },
    { name: "Advance Diploma Clinical Research", count: 3 },
    { name: "Advance Diploma Cosmetology", count: 3 },
    { name: "Advance Diploma Culinary Arts", count: 3 },
    { name: "Advance Diploma Entrepreneurship", count: 3 },
    { name: "Advance Diploma Environmental Engineering", count: 3 },
    { name: "Advance Diploma Fashion Marketing", count: 3 },
    { name: "Advance Diploma Film Making", count: 3 },
    { name: "Advance Diploma Finance Management", count: 3 },
    { name: "Advance Diploma Fine Arts", count: 3 },
    { name: "Advance Diploma Imaging Technology", count: 3 },
    { name: "Advance Diploma Marketing Management", count: 3 },
    { name: "Advance Diploma Materials Management", count: 3 },
    { name: "Advance Diploma Merchandising", count: 3 },
    { name: "Advance Diploma Photography", count: 3 },
    { name: "Advance Diploma Product Design", count: 3 },
    { name: "Advance Diploma Risk Management", count: 3 },
    { name: "Advance Diploma Taxation", count: 3 },
    { name: "BA Accountancy", count: 3 },
    { name: "BA Advertising", count: 3 },
    { name: "BA Ancient History Hons", count: 3 },
    { name: "BA Business Management Hons", count: 3 },
    { name: "BA Chinese Hons", count: 3 },
    { name: "BA Cultural Studies", count: 3 },
    { name: "BA Cultural Studies Hons", count: 3 },
    { name: "BA Graphic Designing Hons", count: 3 },
    { name: "BA Interior Design Hons", count: 3 },
    { name: "BA Linguistics Hons", count: 3 },
    { name: "BA Literature Hons", count: 3 },
    { name: "BA Odia Hons", count: 3 },
    { name: "BA Physics", count: 3 },
    { name: "BA Public Relations", count: 3 },
    { name: "BSc CVT Cardiovascular Technology", count: 3 },
    { name: "BLib Library Science", count: 3 },
    { name: "BMS Media Science", count: 3 },
    { name: "Bachelor of Music Music Vocal", count: 3 },
    { name: "Bachelor of Performing Arts Music Vocal", count: 3 },
    { name: "BTTH Business Management", count: 3 },
    { name: "BBA Agribusiness Management", count: 3 },
    { name: "BBA Aviation Hons", count: 3 },
    { name: "BBA Data Science", count: 3 },
    { name: "BBA Economics", count: 3 },
    { name: "BBA Fashion Design", count: 3 },
    { name: "BBA Financial Management Hons", count: 3 },
    { name: "BBA Logistics And Supply Chain Management Hons", count: 3 },
    { name: "BBA Management Accounting", count: 3 },
    { name: "BBA Management Studies", count: 3 },
    { name: "BBA Marketing Management", count: 3 },
    { name: "BBA Media Management", count: 3 },
    { name: "BBA Project Management", count: 3 },
    { name: "BBA Retailing", count: 3 },
    { name: "BCA Data Science Hons", count: 3 },
    { name: "BCA Software Development", count: 3 },
    { name: "BCA Software Engineering", count: 3 },
    { name: "BCA Web Technology", count: 3 },
    { name: "BCom Business Law", count: 3 },
    { name: "BCom Business Process Management", count: 3 },
    { name: "BCom Data Science", count: 3 },
    { name: "BCom Financial Analysis", count: 3 },
    { name: "BCom Financial Analysis Hons", count: 3 },
    { name: "BCom Financial System", count: 3 },
    { name: "BCom Industrial Management", count: 3 },
    { name: "BCom International Finance", count: 3 },
    { name: "BCom Supply Chain Management", count: 3 },
    { name: "B.Des Communications", count: 3 },
    { name: "B.Des Design management", count: 3 },
    { name: "B.Des Product Design Hons", count: 3 },
    { name: "BDS Anatomy", count: 3 },
    { name: "BDS General Medicine", count: 3 },
    { name: "BDS Microbiology", count: 3 },
    { name: "BDS Orthodontics", count: 3 },
    { name: "BDS Pathology", count: 3 },
    { name: "BDS Pharmacology", count: 3 },
    { name: "BDS Physiology", count: 3 },
    { name: "BDS Prosthodontics", count: 3 },
    {
      name: "Bachelor of Engineering Industrial Engineering And Management",
      count: 3,
    },
    { name: "Bachelor of Engineering Material Science", count: 3 },
    { name: "Bachelor of Engineering Pharmaceutical Engineering", count: 3 },
    { name: "Bachelor of Engineering Polymer Science", count: 3 },
    { name: "Bachelor of Engineering Safety Engineering", count: 3 },
    { name: "Bachelor of Engineering Software Engineering", count: 3 },
    { name: "B.Ed Psychology", count: 3 },
    { name: "B.Ed Urdu", count: 3 },
    { name: "BFA Dance", count: 3 },
    { name: "BHM Hospital Management Hons", count: 3 },
    { name: "BJMC Mass Communication", count: 3 },
    { name: "BMS International Business", count: 3 },
    { name: "B Pharmacy Pharmaceutical Sciences", count: 3 },
    { name: "BSc Agribusiness", count: 3 },
    { name: "BSc Agribusiness Hons", count: 3 },
    { name: "BSc Analytical Chemistry", count: 3 },
    { name: "BSc Applied Electronics", count: 3 },
    { name: "BSc Artificial Intelligence Hons", count: 3 },
    { name: "BSc Aviation Management", count: 3 },
    { name: "BSc Beauty Care", count: 3 },
    { name: "BSc Biological Sciences", count: 3 },
    { name: "BSc Biophysics", count: 3 },
    { name: "BSc Business Administration", count: 3 },
    { name: "BSc Chemical Technology", count: 3 },
    { name: "BSc Communication Systems", count: 3 },
    { name: "BSc Computer Maintenance", count: 3 },
    { name: "BSc Cosmetology", count: 3 },
    { name: "BSc Environment Science", count: 3 },
    { name: "BSc Fashion Design Hons", count: 3 },
    { name: "BSc Fisheries Hons", count: 3 },
    { name: "BSc Food Science And Technology Hons", count: 3 },
    { name: "BSc Game Design Hons", count: 3 },
    { name: "BSc Health Information Management", count: 3 },
    { name: "BSc Hotel Management Hons", count: 3 },
    { name: "BSc Imaging Technology Hons", count: 3 },
    { name: "BSc Industrial Microbiology", count: 3 },
    { name: "BSc Industrial Safety", count: 3 },
    { name: "BSc Maths Hons", count: 3 },
    { name: "BSc Meteorology", count: 3 },
    { name: "BSc Neuroscience", count: 3 },
    { name: "BSc Optometry Hons", count: 3 },
    { name: "BSc Pharmacology", count: 3 },
    { name: "BSc Photography", count: 3 },
    { name: "BSc Physical Science Hons", count: 3 },
    { name: "BSc Prosthetic", count: 3 },
    { name: "BSc Renewable Energy", count: 3 },
    { name: "BSc Rural Development", count: 3 },
    { name: "BSc Software Engineering", count: 3 },
    { name: "BSc Sports Management", count: 3 },
    { name: "BSc Telecommunication", count: 3 },
    { name: "BSc Travel And Tourism", count: 3 },
    { name: "BSc Web Technology", count: 3 },
    { name: "BTech Avionics", count: 3 },
    { name: "BTech Business Administration", count: 3 },
    { name: "BTech Cloud Technology", count: 3 },
    { name: "BTech Communication Engineering Hons", count: 3 },
    { name: "BTech Construction Engineering", count: 3 },
    { name: "BTech Electrical Engineering Hons", count: 3 },
    { name: "BTech Food Processing Technology", count: 3 },
    { name: "BTech Industrial Engineering And Management", count: 3 },
    { name: "BTech Maths", count: 3 },
    { name: "BTech Nuclear Science", count: 3 },
    { name: "BTech Pharmaceutical Engineering", count: 3 },
    { name: "BTech Software Development", count: 3 },
    { name: "BTech Transportation Engineering", count: 3 },
    { name: "BVA Multimedia Design", count: 3 },
    { name: "B.Voc Food Technology Engineering", count: 3 },
    { name: "B.Voc Hospital Administration", count: 3 },
    { name: "B.Voc Networking", count: 3 },
    { name: "B.Voc Nutrition", count: 3 },
    { name: "B.Voc Power Distribution", count: 3 },
    { name: "B.Voc Tourism Management", count: 3 },
    { name: "B.V.Sc Physiology", count: 3 },
    { name: "Certificate Event Management", count: 3 },
    { name: "Certificate Fashion Design", count: 3 },
    { name: "Certificate Interior Design", count: 3 },
    { name: "Certificate Web Designing", count: 3 },
    { name: "CFA Chartered Financial Analyst", count: 3 },
    { name: "CFA Finance", count: 3 },
    { name: "Diploma 3D Animation", count: 3 },
    { name: "Diploma Film Making", count: 3 },
    { name: "Diploma Food Production", count: 3 },
    { name: "Diploma Interior Design", count: 3 },
    { name: "Diploma Journalism", count: 3 },
    { name: "Distance MBA Banking And Finance", count: 3 },
    { name: "Distance MBA Hospital Management", count: 3 },
    { name: "Distance MBA Quality Management", count: 3 },
    { name: "Distance MBA Tourism", count: 3 },
    { name: "DM Hepatology", count: 3 },
    { name: "DM Pathology", count: 3 },
    { name: "DNB General Medicine", count: 3 },
    { name: "PhD Archaeology", count: 3 },
    { name: "PhD Astronomy", count: 3 },
    { name: "PhD Brand Management", count: 3 },
    { name: "PhD Business Communication", count: 3 },
    { name: "PhD Criminology", count: 3 },
    { name: "PhD Cyber Security", count: 3 },
    { name: "PhD Earthquake Engineering", count: 3 },
    { name: "PhD Electronic Media", count: 3 },
    { name: "PhD Environmental Planning", count: 3 },
    { name: "PhD Epidemiology", count: 3 },
    { name: "PhD Fashion Technology", count: 3 },
    { name: "PhD General Surgery", count: 3 },
    { name: "PhD Genomics", count: 3 },
    { name: "PhD Healthcare Management", count: 3 },
    { name: "PhD Hospitality Management", count: 3 },
    { name: "PhD Information Security", count: 3 },
    { name: "PhD Logistics And Supply Chain Management", count: 3 },
    { name: "PhD Naturopathy", count: 3 },
    { name: "PhD Nematology", count: 3 },
    { name: "PhD Optometry", count: 3 },
    { name: "PhD Oral Medicine And Radiology", count: 3 },
    { name: "PhD Oral Surgery", count: 3 },
    { name: "PhD Periodontology", count: 3 },
    { name: "PhD Plant Science", count: 3 },
    { name: "PhD Plantation Crops", count: 3 },
    { name: "PhD Power Systems", count: 3 },
    { name: "PhD Product Design", count: 3 },
    { name: "PhD Pulmonary Medicine", count: 3 },
    { name: "PhD Theatre Arts", count: 3 },
    { name: "PhD Toxicology", count: 3 },
    { name: "PhD Transportation Engineering", count: 3 },
    { name: "PhD Travel And Tourism", count: 3 },
    { name: "PhD Urology", count: 3 },
    { name: "PhD Vedic Science", count: 3 },
    { name: "PhD Yogic Science", count: 3 },
    { name: "Executive MBA Construction Management", count: 3 },
    { name: "Executive MBA Emergency Medicine", count: 3 },
    { name: "Executive MBA Entrepreneurship", count: 3 },
    { name: "Executive MBA Hospital Administration", count: 3 },
    { name: "Executive MBA Neurology", count: 3 },
    { name: "Executive MBA Pharmaceutical Management", count: 3 },
    { name: "Executive MBA Project Management", count: 3 },
    { name: "Executive MBA Safety Management", count: 3 },
    {
      name: "Executive Program Logistics And Supply Chain Management",
      count: 3,
    },
    { name: "LLM Criminology", count: 3 },
    { name: "LLM Cyber Security", count: 3 },
    { name: "LLM Public Policy", count: 3 },
    { name: "MA Computer Science", count: 3 },
    { name: "MA Electronic Media", count: 3 },
    { name: "MA Entrepreneurship", count: 3 },
    { name: "MA Environmental Science", count: 3 },
    { name: "MA Event Management", count: 3 },
    { name: "MA Finance", count: 3 },
    { name: "MA Media Management", count: 3 },
    { name: "MA Nutrition", count: 3 },
    { name: "MA Physics", count: 3 },
    { name: "MA Psychology Hons", count: 3 },
    { name: "MA Retail Management", count: 3 },
    { name: "MA Rural Management", count: 3 },
    { name: "MA Visual Effects", count: 3 },
    { name: "M.Arch Digital Architecture", count: 3 },
    { name: "MUD Urban Design", count: 3 },
    { name: "MBL Business Law", count: 3 },
    { name: "MCS Computer Science", count: 3 },
    { name: "MHTM Hospitality and Tourism Management", count: 3 },
    { name: "MOT Paediatrics", count: 3 },
    { name: "MSPT Sports Physiotherapy", count: 3 },
    { name: "Masters in Sports Nutrition Nutrition", count: 3 },
    { name: "MBA Bioinformatics", count: 3 },
    { name: "MBA Business Research", count: 3 },
    { name: "MBA Consultancy Management", count: 3 },
    { name: "MBA Development Management", count: 3 },
    { name: "MBA Financial Planning", count: 3 },
    { name: "MBA Industrial Safety", count: 3 },
    { name: "MBA Marketing Hons", count: 3 },
    { name: "MBA Quality Management", count: 3 },
    { name: "MBA Tourism Management", count: 3 },
    { name: "MBBS Dermatology", count: 3 },
    { name: "MBBS Forensic Medicine", count: 3 },
    { name: "MBBS Microbiology", count: 3 },
    { name: "MBBS Ophthalmology", count: 3 },
    { name: "MBBS Pathology", count: 3 },
    { name: "MBBS Pharmacology", count: 3 },
    { name: "MBBS Psychiatry", count: 3 },
    { name: "MCA Computer Science", count: 3 },
    { name: "Master of Chirurgiae [M.Ch] Endocrine Surgery", count: 3 },
    { name: "Master of Chirurgiae [M.Ch] Medicine", count: 3 },
    { name: "M.Com Insurance", count: 3 },
    { name: "M.Com International Finance", count: 3 },
    { name: "MD Anaesthesiology", count: 3 },
    { name: "MD Geriatric Medicine", count: 3 },
    { name: "MD Hepatology", count: 3 },
    { name: "MD Laryngology", count: 3 },
    { name: "MD Medical Gastroenterology", count: 3 },
    { name: "MD Neonatology", count: 3 },
    { name: "MD Tropical Medicine", count: 3 },
    { name: "MD Yoga", count: 3 },
    { name: "M.Des Accessory Design", count: 3 },
    { name: "M.Des Advertising", count: 3 },
    { name: "M.Des Fashion Communication", count: 3 },
    { name: "M.Des Fashion Management", count: 3 },
    { name: "M.Des Fashion Styling", count: 3 },
    { name: "M.Des Retail Design", count: 3 },
    { name: "M.Des Visual Merchandising", count: 3 },
    { name: "MDS Paediatrics", count: 3 },
    { name: "ME Automotive Engineering", count: 3 },
    { name: "ME Cyber Security", count: 3 },
    { name: "ME Environmental Management", count: 3 },
    { name: "ME Graphic Designing", count: 3 },
    { name: "ME Material Science", count: 3 },
    { name: "ME Water Resources Management", count: 3 },
    { name: "M.Ed Malayalam", count: 3 },
    { name: "M.Ed Physical Education", count: 3 },
    { name: "MFA Finance", count: 3 },
    { name: "M.F.Sc Economics", count: 3 },
    { name: "MIM Information Management", count: 3 },
    { name: "M.Pharm Ayurveda", count: 3 },
    { name: "M.Pharm Clinical Research", count: 3 },
    { name: "M.Phil Assamese", count: 3 },
    { name: "M.Phil Biophysics", count: 3 },
    { name: "M.Phil Business Economics", count: 3 },
    { name: "M.Phil Civil Engineering", count: 3 },
    { name: "M.Phil Fashion Design", count: 3 },
    { name: "M.Phil Folklore", count: 3 },
    { name: "M.Phil Food Service Management", count: 3 },
    { name: "M.Phil Human Development", count: 3 },
    { name: "M.Phil Humanities", count: 3 },
    { name: "M.Phil Information Science", count: 3 },
    { name: "M.Phil International Relations", count: 3 },
    { name: "M.Phil Linguistics", count: 3 },
    { name: "M.Phil Literature", count: 3 },
    { name: "M.Phil Management Science", count: 3 },
    { name: "M.Phil Mechanical Engineering", count: 3 },
    { name: "M.Phil Operations Management", count: 3 },
    { name: "M.Phil Physical Education", count: 3 },
    { name: "M.Phil Psychology", count: 3 },
    { name: "M.Phil Rural Development", count: 3 },
    { name: "M.Phil Special Education", count: 3 },
    { name: "M.Phil Tamil", count: 3 },
    { name: "M.Phil Visual Media", count: 3 },
    { name: "M.Phil Zoology", count: 3 },
    { name: "MPT Medicine", count: 3 },
    { name: "M.S Dermatology", count: 3 },
    { name: "M.S Forensic Medicine", count: 3 },
    { name: "MSc Agricultural Chemistry", count: 3 },
    { name: "MSc Climate science", count: 3 },
    { name: "MSc Computational Biology", count: 3 },
    { name: "MSc Computer Science Hons", count: 3 },
    { name: "MSc Dairy Science", count: 3 },
    { name: "MSc Electronics and Instrumentation", count: 3 },
    { name: "MSc English", count: 3 },
    { name: "MSc Entrepreneurship", count: 3 },
    { name: "MSc Genomics", count: 3 },
    { name: "MSc Hospital Management", count: 3 },
    { name: "MSc Human Nutrition", count: 3 },
    { name: "MSc Medical Biotechnology", count: 3 },
    { name: "MSc Medical Physics", count: 3 },
    { name: "MSc Museology", count: 3 },
    { name: "MSc Occupational Therapy", count: 3 },
    { name: "MSc Organic Farming", count: 3 },
    { name: "MSc Physical Education", count: 3 },
    { name: "MSc Quality Assurance", count: 3 },
    { name: "MSc Quality Management", count: 3 },
    { name: "MSc Rural Development", count: 3 },
    { name: "MSc Sanskrit", count: 3 },
    { name: "MSc Software Technology", count: 3 },
    { name: "MSc Telecommunication", count: 3 },
    { name: "MSc Tissue Engineering", count: 3 },
    { name: "MSc VFX", count: 3 },
    { name: "MSW Psychiatry", count: 3 },
    { name: "MTech Automotive Electronics", count: 3 },
    { name: "MTech Biomedical Science", count: 3 },
    { name: "MTech Climate science", count: 3 },
    { name: "MTech Computer Networks", count: 3 },
    { name: "MTech Electric Vehicles", count: 3 },
    { name: "MTech Electronics Engineering", count: 3 },
    { name: "MTech Environment Science", count: 3 },
    { name: "MTech Geomatics", count: 3 },
    { name: "MTech Industrial Design", count: 3 },
    { name: "MTech Information Science And Engineering", count: 3 },
    { name: "MTech Reliability Engineering", count: 3 },
    { name: "MTech Telematics", count: 3 },
    { name: "MTech Textile Engineering", count: 3 },
    { name: "MTM Hospitality Management", count: 3 },
    { name: "MVA Graphic Designing", count: 3 },
    { name: "M.Voc Entrepreneurship", count: 3 },
    { name: "M.Voc Fashion Technology", count: 3 },
    { name: "M.V.Sc Virology", count: 3 },
    { name: "PGD Aquaculture", count: 3 },
    { name: "PGD Bank Management", count: 3 },
    { name: "PGD Banking And Insurance", count: 3 },
    { name: "PGD Bio-statistics", count: 3 },
    { name: "PGD Biochemistry", count: 3 },
    { name: "PGD Biology", count: 3 },
    { name: "PGD Broadcast Journalism", count: 3 },
    { name: "PGD Business Law", count: 3 },
    { name: "PGD Career Counselling", count: 3 },
    { name: "PGD Chemical Technology", count: 3 },
    { name: "PGD Cheminformatics", count: 3 },
    { name: "PGD Civil Engineering", count: 3 },
    { name: "PGD Cloud Computing", count: 3 },
    { name: "PGD Communications", count: 3 },
    { name: "PGD Computer Accounting", count: 3 },
    { name: "PGD Conservation", count: 3 },
    { name: "PGD Criminal Law", count: 3 },
    { name: "PGD Critical Care Nursing", count: 3 },
    { name: "PGD Development Management", count: 3 },
    { name: "PGD Digital Business", count: 3 },
    { name: "PGD Early Childhood Care and Education", count: 3 },
    { name: "PGD Electrical Engineering", count: 3 },
    { name: "PGD Emergency Medicine", count: 3 },
    { name: "PGD Ethics", count: 3 },
    { name: "PGD Folklore", count: 3 },
    { name: "PGD Gender Studies", count: 3 },
    { name: "PGD Horticulture", count: 3 },
    { name: "PGD Hospitality and Tourism Management", count: 3 },
    { name: "PGD Industrial Engineering", count: 3 },
    { name: "PGD Industrial Management", count: 3 },
    { name: "PGD Information Science", count: 3 },
    { name: "PGD Investment Banking", count: 3 },
    { name: "PGD Machine Learning", count: 3 },
    { name: "PGD Marine Engineering", count: 3 },
    { name: "PGD Medical Record", count: 3 },
    { name: "PGD Merchandising", count: 3 },
    { name: "PGD Merchandising Management", count: 3 },
    { name: "PGD Mobile Technology", count: 3 },
    { name: "PGD Multimedia Technology", count: 3 },
    { name: "PGD Nano Science", count: 3 },
    { name: "PGD Nursing", count: 3 },
    { name: "PGD Perfusion Technology", count: 3 },
    { name: "PGD Photography", count: 3 },
    { name: "PGD Physician Assistant", count: 3 },
    { name: "PGD Polymer Science", count: 3 },
    { name: "PGD Public Policy", count: 3 },
    { name: "PGD Quality Assurance", count: 3 },
    { name: "PGD Robotics", count: 3 },
    { name: "PGD Sociology", count: 3 },
    { name: "PGD Software Engineering", count: 3 },
    { name: "PGD Theology", count: 3 },
    { name: "PGD Watershed Management", count: 3 },
    { name: "PGDM Data Science", count: 3 },
    { name: "PGDM Healthcare Management", count: 3 },
    { name: "PGDM Logistics Management", count: 3 },
    { name: "PGDM Marketing Management", count: 3 },
    { name: "Post Doctoral Medicine", count: 3 },
    { name: "PGC Entrepreneurship", count: 3 },
    { name: "PGP Brand Management", count: 3 },
    { name: "PGP Business Administration", count: 3 },
    { name: "PGP Development Management", count: 3 },
    { name: "PGP Digital Marketing", count: 3 },
    { name: "PGP Foreign Trade", count: 3 },
    { name: "PGP Infrastructure Management", count: 3 },
    { name: "PGP Rural Management", count: 3 },
    { name: "PGP Sales Management", count: 3 },
    { name: "Advance Certificate Entrepreneurship", count: 2 },
    { name: "Advance Certificate International Business", count: 2 },
    { name: "Advance Certificate Marketing Management", count: 2 },
    { name: "Advance Certificate Nursing", count: 2 },
    { name: "Advance Certificate Production Management", count: 2 },
    { name: "Advance Certificate Retail Management", count: 2 },
    { name: "Advance Certificate Risk Management", count: 2 },
    { name: "Advance Diploma Accounting", count: 2 },
    { name: "Advance Diploma Acting", count: 2 },
    { name: "Advance Diploma Anaesthesia Technology", count: 2 },
    { name: "Advance Diploma Aviation", count: 2 },
    { name: "Advance Diploma Construction Management", count: 2 },
    { name: "Advance Diploma Export Management", count: 2 },
    { name: "Advance Diploma Finance", count: 2 },
    { name: "Advance Diploma Furniture Design", count: 2 },
    { name: "Advance Diploma Hospital Administration", count: 2 },
    { name: "Advance Diploma International Business", count: 2 },
    { name: "Advance Diploma Italian", count: 2 },
    { name: "Advance Diploma Logistics Management", count: 2 },
    { name: "Advance Diploma Media Management", count: 2 },
    { name: "Advance Diploma Music", count: 2 },
    { name: "Advance Diploma Naturopathy", count: 2 },
    { name: "Advance Diploma Networking", count: 2 },
    { name: "Advance Diploma Operations Management", count: 2 },
    { name: "Advance Diploma Performing Arts", count: 2 },
    { name: "Advance Diploma Production Management", count: 2 },
    { name: "Advance Diploma Quality Management", count: 2 },
    { name: "Advance Diploma Safety Engineering", count: 2 },
    { name: "Advance Diploma Safety Management", count: 2 },
    { name: "Advance Diploma Sanskrit", count: 2 },
    { name: "Advance Diploma Software Development", count: 2 },
    { name: "Advance Diploma Spanish", count: 2 },
    { name: "Advance Diploma Tourism Management", count: 2 },
    { name: "Advance Diploma Visual Communication", count: 2 },
    { name: "Advance Diploma Visual Effects", count: 2 },
    { name: "Advance Diploma Visual Merchandising", count: 2 },
    { name: "Advance Diploma Yoga", count: 2 },
    { name: "BA Applied Economics", count: 2 },
    { name: "BA Archaeology", count: 2 },
    { name: "BA Botany Hons", count: 2 },
    { name: "BA Brand Management", count: 2 },
    { name: "BA Business Administration Hons", count: 2 },
    { name: "BA Business Law", count: 2 },
    { name: "BA Chemistry Hons", count: 2 },
    { name: "BA Co-Operative Management", count: 2 },
    { name: "BA Criminal Law Hons", count: 2 },
    { name: "BA Culinary Arts Hons", count: 2 },
    { name: "BA Development Studies", count: 2 },
    { name: "BA Electronics", count: 2 },
    { name: "BA Fashion Technology", count: 2 },
    { name: "BA Foreign Trade", count: 2 },
    { name: "BA Indian Culture", count: 2 },
    { name: "BA International Law", count: 2 },
    { name: "BA International Law Hons", count: 2 },
    { name: "BA Japanese Hons", count: 2 },
    { name: "BA Magadhi", count: 2 },
    { name: "BA Media Management", count: 2 },
    { name: "BA Museology", count: 2 },
    { name: "BA Nutrition", count: 2 },
    { name: "BA Odia", count: 2 },
    { name: "BA Painting Hons", count: 2 },
    { name: "BA Politics Hons", count: 2 },
    { name: "BA Rajasthani", count: 2 },
    { name: "BA Social Studies", count: 2 },
    { name: "BA Special Education", count: 2 },
    { name: "BA Visual Communication Hons", count: 2 },
    { name: "Bachelor in Culinary Arts & Bakery Culinary Arts", count: 2 },
    { name: "Bachelor of Aviation Management Aviation", count: 2 },
    { name: "BMM Marketing Management", count: 2 },
    { name: "BRIT Imaging Technology", count: 2 },
    { name: "BTM Tourism Management", count: 2 },
    { name: "BTTH Hospitality", count: 2 },
    { name: "BTTH Hospitality Management", count: 2 },
    { name: "B.Arch Landscape Architecture", count: 2 },
    { name: "BBA Accounting And Finance Hons", count: 2 },
    { name: "BBA Agribusiness Management Hons", count: 2 },
    { name: "BBA Business Economics", count: 2 },
    { name: "BBA Business Process Management", count: 2 },
    { name: "BBA Criminal Law Hons", count: 2 },
    { name: "BBA Design management", count: 2 },
    { name: "BBA Economics Hons", count: 2 },
    { name: "BBA Export Management", count: 2 },
    { name: "BBA Global Management", count: 2 },
    { name: "BBA Hospitality Management Hons", count: 2 },
    { name: "BBA Information Technology Hons", count: 2 },
    { name: "BBA International Law Hons", count: 2 },
    { name: "BBA Investment Management", count: 2 },
    { name: "BBA Mass Communication", count: 2 },
    { name: "BBA Networking", count: 2 },
    { name: "BBA Production Management", count: 2 },
    { name: "BBA Psychology", count: 2 },
    { name: "BBA Public Relations", count: 2 },
    { name: "BBA Rural Development", count: 2 },
    { name: "BBA Shipping", count: 2 },
    { name: "BBA Sports Management Hons", count: 2 },
    { name: "BBA Statistics Hons", count: 2 },
    { name: "BBA Systems Management", count: 2 },
    { name: "BBA Telecommunication", count: 2 },
    { name: "BBA Travel And Tourism", count: 2 },
    { name: "BBM Digital Marketing", count: 2 },
    { name: "BBM Hr", count: 2 },
    { name: "BBM Marketing", count: 2 },
    { name: "BCA Banking", count: 2 },
    { name: "BCA Block Chain Technology", count: 2 },
    { name: "BCA Cloud Computing Hons", count: 2 },
    { name: "BCA Culinary Arts", count: 2 },
    { name: "BCA Cyber Security Hons", count: 2 },
    { name: "BCA Gaming Technology", count: 2 },
    { name: "BCA Graphic Designing", count: 2 },
    { name: "BCA Web Designing", count: 2 },
    { name: "BCom Actuarial Science", count: 2 },
    { name: "BCom Business Communication", count: 2 },
    { name: "BCom Business Environment", count: 2 },
    { name: "BCom Corporate Secretaryship Hons", count: 2 },
    { name: "BCom Customer Service", count: 2 },
    { name: "BCom Finance and Accounting Hons", count: 2 },
    { name: "BCom Financial Management Hons", count: 2 },
    { name: "BCom Financial System Hons", count: 2 },
    { name: "BCom Hr Hons", count: 2 },
    { name: "BCom Investment Banking Hons", count: 2 },
    { name: "BCom Kannada", count: 2 },
    { name: "BCom Logistics And Supply Chain Management Hons", count: 2 },
    { name: "BCom Logistics Management", count: 2 },
    { name: "BCom Merchandising", count: 2 },
    { name: "BCom Retail Management", count: 2 },
    { name: "BCom Sales Management", count: 2 },
    { name: "BCom Sanskrit", count: 2 },
    { name: "BCom Special Education", count: 2 },
    { name: "BCom Urdu", count: 2 },
    { name: "B.Des 3D Animation", count: 2 },
    { name: "B.Des Automobile Design", count: 2 },
    { name: "B.Des Digital Design", count: 2 },
    { name: "B.Des Furniture Design", count: 2 },
    { name: "B.Des Industrial Design Hons", count: 2 },
    { name: "B.Des Interaction Design Hons", count: 2 },
    { name: "B.Des Retail Design", count: 2 },
    { name: "B.Des Visual Effects", count: 2 },
    { name: "BDS Data Science", count: 2 },
    { name: "BDS Dentistry", count: 2 },
    { name: "BDS Medicine", count: 2 },
    { name: "BDS Pedodontics", count: 2 },
    { name: "BDS Periodontics", count: 2 },
    { name: "Bachelor of Engineering Biotechnology", count: 2 },
    { name: "Bachelor of Engineering Computer Science Hons", count: 2 },
    { name: "Bachelor of Engineering Construction Engineering", count: 2 },
    { name: "Bachelor of Engineering Electronics Hons", count: 2 },
    { name: "Bachelor of Engineering Environmental Science", count: 2 },
    { name: "Bachelor of Engineering Humanities", count: 2 },
    { name: "Bachelor of Engineering Industrial Production", count: 2 },
    { name: "Bachelor of Engineering Petroleum Engineering", count: 2 },
    { name: "Bachelor of Engineering Textile Engineering", count: 2 },
    { name: "B.Ed Arabic", count: 2 },
    { name: "B.Ed Business Studies", count: 2 },
    { name: "B.Ed Chemistry", count: 2 },
    { name: "B.Ed Computer Education", count: 2 },
    { name: "B.Ed Music", count: 2 },
    { name: "B.Ed Nutrition", count: 2 },
    { name: "B.Ed Social Studies", count: 2 },
    { name: "B.Ed Telugu", count: 2 },
    { name: "B.Ed Yoga", count: 2 },
    { name: "B.El.Ed Elementary Education", count: 2 },
    { name: "BFA Graphic Designing", count: 2 },
    { name: "BFA Interior Design", count: 2 },
    { name: "BFA Music", count: 2 },
    { name: "BETP Film Making", count: 2 },
    { name: "Bachelor of Hospitality Management Hospitality", count: 2 },
    { name: "BMM Journalism", count: 2 },
    { name: "BMS Aviation", count: 2 },
    { name: "BMS Digital Business", count: 2 },
    { name: "BMS Digital Marketing", count: 2 },
    { name: "BMS Economics", count: 2 },
    { name: "BMS Entrepreneurship", count: 2 },
    { name: "BMS Hotel Management", count: 2 },
    { name: "BMS Hr", count: 2 },
    { name: "B Pharmacy Pharmaceutical Chemistry", count: 2 },
    { name: "BPT Medical Technology", count: 2 },
    { name: "BSc Agricultural Engineering", count: 2 },
    { name: "BSc Aircraft Maintenance Engineering", count: 2 },
    { name: "BSc Allied Health Science", count: 2 },
    { name: "BSc Applied Nutrition", count: 2 },
    { name: "BSc Applied Nutrition Hons", count: 2 },
    { name: "BSc Applied Physics", count: 2 },
    { name: "BSc Applied Sciences", count: 2 },
    { name: "BSc Astrophysics Hons", count: 2 },
    { name: "BSc Avionics", count: 2 },
    { name: "BSc Ayurveda", count: 2 },
    { name: "BSc Bakery", count: 2 },
    { name: "BSc Big Data Analytics Hons", count: 2 },
    { name: "BSc Business Management Hons", count: 2 },
    { name: "BSc Cardiac Care Hons", count: 2 },
    { name: "BSc Chemical Sciences", count: 2 },
    { name: "BSc Communication Design", count: 2 },
    { name: "BSc Computer Application Hons", count: 2 },
    { name: "BSc Criminology", count: 2 },
    { name: "BSc Earth Science", count: 2 },
    { name: "BSc Ecology", count: 2 },
    { name: "BSc Event Management", count: 2 },
    { name: "BSc Exercise Sciences Hons", count: 2 },
    { name: "BSc Export Management", count: 2 },
    { name: "BSc Fisheries Science", count: 2 },
    { name: "BSc Food Service Management", count: 2 },
    { name: "BSc French", count: 2 },
    { name: "BSc Genetics Hons", count: 2 },
    { name: "BSc Geoinformatics", count: 2 },
    { name: "BSc German", count: 2 },
    { name: "BSc Health Sciences", count: 2 },
    { name: "BSc Health Sciences Hons", count: 2 },
    { name: "BSc Human Science", count: 2 },
    { name: "BSc Industrial Chemistry Hons", count: 2 },
    { name: "BSc Information Security", count: 2 },
    { name: "BSc Infrastructure Management", count: 2 },
    { name: "BSc Interaction Design", count: 2 },
    { name: "BSc Jewelry Design", count: 2 },
    { name: "BSc Library and Information Science", count: 2 },
    { name: "BSc Mass Communication Hons", count: 2 },
    { name: "BSc Medical Microbiology", count: 2 },
    { name: "BSc Medical Sciences", count: 2 },
    { name: "BSc Nematology", count: 2 },
    { name: "BSc Organic Farming", count: 2 },
    { name: "BSc Pharmaceutical Chemistry Hons", count: 2 },
    { name: "BSc Polymer Science Hons", count: 2 },
    { name: "BSc Punjabi", count: 2 },
    { name: "BSc Radiography Hons", count: 2 },
    { name: "BSc Radiology Technician", count: 2 },
    { name: "BSc Retail Management", count: 2 },
    { name: "BSc Robotics", count: 2 },
    { name: "BSc Rural Development Hons", count: 2 },
    { name: "BSc Telugu", count: 2 },
    { name: "BSc Urdu", count: 2 },
    { name: "BSc Urology", count: 2 },
    { name: "BSc Web Designing", count: 2 },
    { name: "BSc Yogic Science", count: 2 },
    { name: "BTech 3D Animation", count: 2 },
    { name: "BTech Applied Mechanics", count: 2 },
    { name: "BTech Big Data", count: 2 },
    { name: "BTech Big Data Analytics Hons", count: 2 },
    { name: "BTech Biological Sciences", count: 2 },
    { name: "BTech Cloud Computing Hons", count: 2 },
    { name: "BTech Computer Aided Design", count: 2 },
    { name: "BTech Construction Management", count: 2 },
    { name: "BTech Data Science Hons", count: 2 },
    { name: "BTech Genetic Engineering", count: 2 },
    { name: "BTech Geoinformatics", count: 2 },
    { name: "BTech Horticulture", count: 2 },
    { name: "BTech Industrial Production", count: 2 },
    { name: "BTech Infrastructure Engineering", count: 2 },
    { name: "BTech Mobile Application", count: 2 },
    { name: "BTech Networking", count: 2 },
    { name: "BTech Physics", count: 2 },
    { name: "BTech Product Design", count: 2 },
    { name: "BTech Production Management", count: 2 },
    { name: "BTech Renewable Energy", count: 2 },
    { name: "BTech Sound Engineering", count: 2 },
    { name: "BTech Telecommunication Engineering", count: 2 },
    { name: "BTech Water Conservation", count: 2 },
    { name: "BTech Water Resources Engineering", count: 2 },
    { name: "B.Voc Accounting", count: 2 },
    { name: "B.Voc Aquaculture", count: 2 },
    { name: "B.Voc Automobile Engineering", count: 2 },
    { name: "B.Voc Biochemistry", count: 2 },
    { name: "B.Voc Biotech", count: 2 },
    { name: "B.Voc Dairy Technology", count: 2 },
    { name: "B.Voc English", count: 2 },
    { name: "B.Voc Financial Services", count: 2 },
    { name: "B.Voc Garment Designing", count: 2 },
    { name: "B.Voc Hindi", count: 2 },
    { name: "B.Voc Journalism And Mass Communication", count: 2 },
    { name: "B.Voc Logistics Management", count: 2 },
    { name: "B.Voc Machine Learning", count: 2 },
    { name: "B.Voc Mass Communication", count: 2 },
    { name: "B.Voc Mechatronics", count: 2 },
    { name: "B.Voc Microbiology", count: 2 },
    { name: "B.Voc Optometry", count: 2 },
    { name: "B.Voc Physiotherapy", count: 2 },
    { name: "B.Voc Quality Control", count: 2 },
    { name: "B.Voc Robotics", count: 2 },
    { name: "B.Voc Taxation", count: 2 },
    { name: "B.Voc Visual Communication", count: 2 },
    { name: "Certificate 3D Animation", count: 2 },
    { name: "Certificate Cinematography", count: 2 },
    { name: "Certificate Data Analytics", count: 2 },
    { name: "Certificate Digital Marketing", count: 2 },
    { name: "Certificate English", count: 2 },
    { name: "Certificate Film Making", count: 2 },
    { name: "Certificate Food Production", count: 2 },
    { name: "Certificate Hospitality Management", count: 2 },
    { name: "Certificate Music Instrumental", count: 2 },
    { name: "Certificate Textile Design", count: 2 },
    { name: "Certificate Visual Effects", count: 2 },
    { name: "Diploma Airport Management", count: 2 },
    { name: "Diploma Automobile Engineering", count: 2 },
    { name: "Diploma Chemical Engineering", count: 2 },
    { name: "Diploma Dental Technician", count: 2 },
    { name: "Diploma Elementary Education", count: 2 },
    { name: "Diploma Graphic Designing", count: 2 },
    { name: "Diploma Hospitality Management", count: 2 },
    { name: "Diploma Visual Communication", count: 2 },
    { name: "Diploma Visual Effects", count: 2 },
    { name: "Distance MBA Industrial Management", count: 2 },
    { name: "Distance MBA Logistics And Supply Chain Management", count: 2 },
    { name: "Distance MBA Materials Management", count: 2 },
    { name: "DM Ecology", count: 2 },
    { name: "DM Forensic Medicine", count: 2 },
    { name: "DM Haematology", count: 2 },
    { name: "DM Oncology", count: 2 },
    { name: "DNB Ecology", count: 2 },
    { name: "DNB Family Medicine", count: 2 },
    { name: "DNB Gastroenterology", count: 2 },
    { name: "DNB General Surgery", count: 2 },
    { name: "DNB Neuro Surgery", count: 2 },
    { name: "DNB Neurology", count: 2 },
    { name: "DNB Respiratory Diseases", count: 2 },
    { name: "PhD Accounting And Finance", count: 2 },
    { name: "PhD Agribusiness", count: 2 },
    { name: "PhD Analytical Chemistry", count: 2 },
    { name: "PhD Applied Arts", count: 2 },
    { name: "PhD Applied Mathematics", count: 2 },
    { name: "PhD Applied Physics", count: 2 },
    { name: "PhD Astrology", count: 2 },
    { name: "PhD Astrophysics", count: 2 },
    { name: "PhD Ceramic Engineering", count: 2 },
    { name: "PhD Chinese", count: 2 },
    { name: "PhD Clinical Psychology", count: 2 },
    { name: "PhD Cloud Computing", count: 2 },
    { name: "PhD Cognitive Science", count: 2 },
    { name: "PhD Communication Management", count: 2 },
    { name: "PhD Communications", count: 2 },
    { name: "PhD Computational Linguistics", count: 2 },
    { name: "PhD Conservation", count: 2 },
    { name: "PhD Construction Management", count: 2 },
    { name: "PhD Cultural Studies", count: 2 },
    { name: "PhD Dairy Technology", count: 2 },
    { name: "PhD Data Analytics", count: 2 },
    { name: "PhD Design management", count: 2 },
    { name: "PhD Disaster Management", count: 2 },
    { name: "PhD Education Technology", count: 2 },
    { name: "PhD Electronics Engineering", count: 2 },
    { name: "PhD Embedded Systems", count: 2 },
    { name: "PhD Endocrinology", count: 2 },
    { name: "PhD English Literature", count: 2 },
    { name: "PhD General Medicine", count: 2 },
    { name: "PhD Genetic Engineering", count: 2 },
    { name: "PhD Graphic Designing", count: 2 },
    { name: "PhD Hospital Management", count: 2 },
    { name: "PhD Industrial Design", count: 2 },
    { name: "PhD Industrial Engineering And Management", count: 2 },
    { name: "PhD Interior Design", count: 2 },
    { name: "PhD Leadership", count: 2 },
    { name: "PhD Machine Learning", count: 2 },
    { name: "PhD Manufacturing Engineering", count: 2 },
    { name: "PhD Marine Engineering", count: 2 },
    { name: "PhD Maths", count: 2 },
    { name: "PhD Mechatronics Engineering", count: 2 },
    { name: "PhD Medical Microbiology", count: 2 },
    { name: "PhD Molecular Biology", count: 2 },
    { name: "PhD Museology", count: 2 },
    { name: "PhD Nephrology", count: 2 },
    { name: "PhD Nuclear Science", count: 2 },
    { name: "PhD Occupational Health", count: 2 },
    { name: "PhD Operation Theatre Technology", count: 2 },
    { name: "PhD Petrochemical Engineering", count: 2 },
    { name: "PhD Pharmaceutical Chemistry", count: 2 },
    { name: "PhD Plastic Surgery", count: 2 },
    { name: "PhD Population Studies", count: 2 },
    { name: "PhD Power Engineering", count: 2 },
    { name: "PhD Process Engineering", count: 2 },
    { name: "PhD Religious Studies", count: 2 },
    { name: "PhD Rural Management", count: 2 },
    { name: "PhD Social Medicine", count: 2 },
    { name: "PhD Soil Conservation", count: 2 },
    { name: "PhD Sugar Technology", count: 2 },
    { name: "PhD Systems Management", count: 2 },
    { name: "PhD Telecommunication", count: 2 },
    { name: "PhD Textile Design", count: 2 },
    { name: "PhD Thoracic Surgery", count: 2 },
    { name: "PhD Vlsi Design", count: 2 },
    { name: "PhD Wireless Communication", count: 2 },
    { name: "Executive MBA Aesthetic Dentistry", count: 2 },
    { name: "Executive MBA Cardiology", count: 2 },
    { name: "Executive MBA Dentistry", count: 2 },
    { name: "Executive MBA Energy Management", count: 2 },
    { name: "Executive MBA Event Management", count: 2 },
    { name: "Executive MBA Forensic Odontology", count: 2 },
    { name: "Executive MBA Healthcare Management", count: 2 },
    { name: "Executive MBA Hotel Management", count: 2 },
    { name: "Executive MBA International Business", count: 2 },
    { name: "Executive MBA Logistics And Supply Chain Management", count: 2 },
    { name: "Executive MBA Logistics Management", count: 2 },
    { name: "Executive MBA Materials Management", count: 2 },
    { name: "Executive MBA Media Management", count: 2 },
    { name: "Executive MBA Neonatology", count: 2 },
    { name: "Executive MBA Production Management", count: 2 },
    { name: "Executive MBA Risk Management", count: 2 },
    { name: "Executive Program Business Analytics", count: 2 },
    { name: "Executive Program Business Management", count: 2 },
    { name: "Executive Program Data Science", count: 2 },
    { name: "Executive Program Hr", count: 2 },
    { name: "Executive Program Risk Management", count: 2 },
    { name: "GMP Global Management", count: 2 },
    { name: "LLB Criminal Law", count: 2 },
    { name: "LLM Banking", count: 2 },
    { name: "MA Acting", count: 2 },
    { name: "MA Applied Arts", count: 2 },
    { name: "MA Aviation", count: 2 },
    { name: "MA Chemistry", count: 2 },
    { name: "MA Clinical Psychology", count: 2 },
    { name: "MA Computational Linguistics", count: 2 },
    { name: "MA Conflict Management", count: 2 },
    { name: "MA Corporate Secretaryship", count: 2 },
    { name: "MA Counselling", count: 2 },
    { name: "MA Criminal Justice", count: 2 },
    { name: "MA Development Management", count: 2 },
    { name: "MA Digital Marketing", count: 2 },
    { name: "MA Environment and Development", count: 2 },
    { name: "MA Ethics", count: 2 },
    { name: "MA European Studies", count: 2 },
    { name: "MA Fashion Communication", count: 2 },
    { name: "MA Fashion Management", count: 2 },
    { name: "MA Fashion Technology", count: 2 },
    { name: "MA Forensic Science", count: 2 },
    { name: "MA History Hons", count: 2 },
    { name: "MA Information Science", count: 2 },
    { name: "MA Liberal Arts", count: 2 },
    { name: "MA Library and Information Science", count: 2 },
    { name: "MA Mass Media", count: 2 },
    { name: "MA Military Science", count: 2 },
    { name: "MA Nepali", count: 2 },
    { name: "MA Political Science Hons", count: 2 },
    { name: "MA Social Welfare Administration", count: 2 },
    { name: "MA Vedic Science", count: 2 },
    { name: "MA Visual Media", count: 2 },
    { name: "MAM Aviation Management", count: 2 },
    { name: "M.Arch Computer Application", count: 2 },
    { name: "Labour Welfare", count: 2 },
    { name: "MMC Mass Communication", count: 2 },
    { name: "MTHM Hotel Management", count: 2 },
    { name: "MABM Business Management", count: 2 },
    { name: "MBM Agribusiness Management", count: 2 },
    { name: "MFT Foreign Trade", count: 2 },
    { name: "MLib Information Science", count: 2 },
    { name: "MLib Information System", count: 2 },
    { name: "MPS Population Studies", count: 2 },
    { name: "MTA Theatre Arts", count: 2 },
    { name: "MBA Banking And Insurance", count: 2 },
    { name: "MBA Brand Management", count: 2 },
    { name: "MBA Business Intelligence", count: 2 },
    { name: "MBA Communications", count: 2 },
    { name: "MBA Corporate Communication", count: 2 },
    { name: "MBA Enterprise Resource Planning", count: 2 },
    { name: "MBA Executive Management", count: 2 },
    { name: "MBA Export Management", count: 2 },
    { name: "MBA Financial Analysis", count: 2 },
    { name: "MBA Food Technology", count: 2 },
    { name: "MBA Forensic Accounting", count: 2 },
    { name: "MBA Global Financial Markets", count: 2 },
    { name: "MBA Insurance Services", count: 2 },
    { name: "MBA Journalism", count: 2 },
    { name: "MBA Machine Learning", count: 2 },
    { name: "MBA Management Accounting", count: 2 },
    { name: "MBA Mass Communication", count: 2 },
    { name: "MBA Mass Media", count: 2 },
    { name: "MBA Media Studies", count: 2 },
    { name: "MBA Public Policy", count: 2 },
    { name: "MBA Shipping", count: 2 },
    { name: "MBA Waste Management", count: 2 },
    { name: "MBBS Anaesthesia", count: 2 },
    { name: "MBBS Dentistry", count: 2 },
    { name: "MBBS Ecology", count: 2 },
    { name: "MBBS Ent", count: 2 },
    { name: "MBBS Paediatrics", count: 2 },
    { name: "MCA Ethical Hacking", count: 2 },
    { name: "MCA Information Security", count: 2 },
    { name: "MCA Networking", count: 2 },
    { name: "MCA Software Development", count: 2 },
    { name: "MCA Software Engineering", count: 2 },
    { name: "MCA Web Technology", count: 2 },
    { name: "Master of Chirurgiae [M.Ch] Cardiology", count: 2 },
    { name: "Master of Chirurgiae [M.Ch] Ophthalmology", count: 2 },
    { name: "M.Com Education Management", count: 2 },
    { name: "M.Com Foreign Trade", count: 2 },
    { name: "M.Com Information Technology", count: 2 },
    { name: "M.Com Management Accounting", count: 2 },
    { name: "M.Com Rural Development", count: 2 },
    { name: "MD Genetics", count: 2 },
    { name: "MD Health Administration", count: 2 },
    { name: "MD Homeopathic Materia Medica", count: 2 },
    { name: "MD Naturopathy", count: 2 },
    { name: "MD Orthodontics", count: 2 },
    { name: "MD Respiratory Diseases", count: 2 },
    { name: "M.Des Automobile Design", count: 2 },
    { name: "M.Des Digital Communication", count: 2 },
    { name: "M.Des Fashion Technology", count: 2 },
    { name: "M.Des Film Making", count: 2 },
    { name: "M.Des Game Design", count: 2 },
    { name: "M.Des Photography", count: 2 },
    { name: "MDS Implantology", count: 2 },
    { name: "ME Artificial Intelligence", count: 2 },
    { name: "ME Avionics", count: 2 },
    { name: "ME Chemical Technology", count: 2 },
    { name: "ME Cloud Computing", count: 2 },
    { name: "ME Communications", count: 2 },
    { name: "ME Data Science", count: 2 },
    { name: "ME Earthquake Engineering", count: 2 },
    { name: "ME Electrical And Electronics Engineering", count: 2 },
    { name: "ME Energy Technology", count: 2 },
    { name: "ME Engineering Management", count: 2 },
    { name: "ME Food Technology", count: 2 },
    { name: "ME Food Technology Engineering", count: 2 },
    { name: "ME Highway Engineering", count: 2 },
    { name: "ME Industrial Metallurgy", count: 2 },
    { name: "ME Information Security", count: 2 },
    { name: "ME Marine Engineering", count: 2 },
    { name: "ME Metallurgical Engineering", count: 2 },
    { name: "ME Multimedia Technology", count: 2 },
    { name: "ME Network Security", count: 2 },
    { name: "ME Pharmaceutical Technology", count: 2 },
    { name: "ME Power Electronics And Drives", count: 2 },
    { name: "ME Web Technology", count: 2 },
    { name: "ME Wireless Technology", count: 2 },
    { name: "M.Ed Natural Science", count: 2 },
    { name: "M.Ed Visual Impairment", count: 2 },
    { name: "MFA Applied Arts", count: 2 },
    { name: "MFA Financial Analysis", count: 2 },
    { name: "M.F.Sc Biology", count: 2 },
    { name: "M.F.Sc Biotech", count: 2 },
    { name: "MHA Hospital Management", count: 2 },
    { name: "MHM Hospital Management", count: 2 },
    { name: "MJMC Journalism And Mass Communication", count: 2 },
    { name: "MMM Marketing Management", count: 2 },
    { name: "MMS Banking", count: 2 },
    { name: "MMS Management Science", count: 2 },
    { name: "MMS Operations Management", count: 2 },
    { name: "M.Pharm Pharmaceutical Quality Assurance", count: 2 },
    { name: "M.Phil Applied Linguistics", count: 2 },
    { name: "M.Phil Applied Psychology", count: 2 },
    { name: "M.Phil Aquaculture", count: 2 },
    { name: "M.Phil Banking", count: 2 },
    { name: "M.Phil Biomedical Science", count: 2 },
    { name: "M.Phil Chemical Sciences", count: 2 },
    { name: "M.Phil Christianity", count: 2 },
    { name: "M.Phil Clinical Psychology", count: 2 },
    { name: "M.Phil Counselling", count: 2 },
    { name: "M.Phil Cultural Studies", count: 2 },
    { name: "M.Phil Education Management", count: 2 },
    { name: "M.Phil Electronic Science", count: 2 },
    { name: "M.Phil Fisheries Science", count: 2 },
    { name: "M.Phil Forensic Science", count: 2 },
    { name: "M.Phil Gender Studies", count: 2 },
    { name: "M.Phil Geoinformatics", count: 2 },
    { name: "M.Phil Horticulture", count: 2 },
    { name: "M.Phil Human Rights", count: 2 },
    { name: "M.Phil Information System", count: 2 },
    { name: "M.Phil International Business", count: 2 },
    { name: "M.Phil Management Studies", count: 2 },
    { name: "M.Phil Nano Science", count: 2 },
    { name: "M.Phil Neuroscience", count: 2 },
    { name: "M.Phil Nursing", count: 2 },
    { name: "M.Phil Pharmaceutics", count: 2 },
    { name: "M.Phil Political Science", count: 2 },
    { name: "M.Phil Population Studies", count: 2 },
    { name: "M.Phil Production Engineering", count: 2 },
    { name: "M.Phil Rajasthani", count: 2 },
    { name: "M.Phil Religious Studies", count: 2 },
    { name: "M.Phil Social Work", count: 2 },
    { name: "M.Phil Tourism", count: 2 },
    { name: "M.Phil Vedic Science", count: 2 },
    { name: "M.Phil Yogic Science", count: 2 },
    { name: "M.Plan Environmental Planning", count: 2 },
    { name: "M.S Chemistry", count: 2 },
    { name: "M.S Neuro Surgery", count: 2 },
    { name: "M.S Psychiatry", count: 2 },
    { name: "M.S Urology", count: 2 },
    { name: "MSc Archaeology", count: 2 },
    { name: "MSc Astronomy", count: 2 },
    { name: "MSc Ayurveda", count: 2 },
    { name: "MSc Banking", count: 2 },
    { name: "MSc Beauty Care", count: 2 },
    { name: "MSc Big Data", count: 2 },
    { name: "MSc Biochemistry Hons", count: 2 },
    { name: "MSc Biological Sciences Hons", count: 2 },
    { name: "MSc Business Management", count: 2 },
    { name: "MSc Cardio Vascular", count: 2 },
    { name: "MSc Clinical Microbiology", count: 2 },
    { name: "MSc Cognitive Science", count: 2 },
    { name: "MSc Community Medicine", count: 2 },
    { name: "MSc Critical Care Technology", count: 2 },
    { name: "MSc Dairy Technology", count: 2 },
    { name: "MSc Development Studies", count: 2 },
    { name: "MSc Digital Marketing", count: 2 },
    { name: "MSc Embedded Systems", count: 2 },
    { name: "MSc Environmental Engineering", count: 2 },
    { name: "MSc Event Management", count: 2 },
    { name: "MSc Fisheries Science", count: 2 },
    { name: "MSc Food Processing Technology", count: 2 },
    { name: "MSc Food Safety", count: 2 },
    { name: "MSc Forensic Medicine", count: 2 },
    { name: "MSc Forensic Odontology", count: 2 },
    { name: "MSc General Surgery", count: 2 },
    { name: "MSc Genetic Engineering", count: 2 },
    { name: "MSc Haematology", count: 2 },
    { name: "MSc Health Information Management", count: 2 },
    { name: "MSc Home Management", count: 2 },
    { name: "MSc Immunology", count: 2 },
    { name: "MSc Industrial Biotechnology", count: 2 },
    { name: "MSc Industrial Chemistry", count: 2 },
    { name: "MSc Industrial Engineering", count: 2 },
    { name: "MSc Insurance", count: 2 },
    { name: "MSc Machine Learning", count: 2 },
    { name: "MSc Medicinal Chemistry", count: 2 },
    { name: "MSc Merchandising", count: 2 },
    { name: "MSc Metallurgical Engineering", count: 2 },
    { name: "MSc Network Technology", count: 2 },
    { name: "MSc Occupational Health", count: 2 },
    { name: "MSc Ophthalmology", count: 2 },
    { name: "MSc Pharmaceutical Analysis", count: 2 },
    { name: "MSc Pharmacovigilance", count: 2 },
    { name: "MSc Philosophy", count: 2 },
    { name: "MSc Psychiatry", count: 2 },
    { name: "MSc Psychotherapy", count: 2 },
    { name: "MSc Safety Management", count: 2 },
    { name: "MSc Shipping", count: 2 },
    { name: "MSc Sugar Technology", count: 2 },
    { name: "MSc Urology", count: 2 },
    { name: "MSc Vlsi Design", count: 2 },
    { name: "MSc Watershed Management", count: 2 },
    { name: "MTech Atmospheric Science", count: 2 },
    { name: "MTech Big Data", count: 2 },
    { name: "MTech Biological Sciences", count: 2 },
    { name: "MTech Communication and Networking", count: 2 },
    { name: "MTech Communication Networks", count: 2 },
    { name: "MTech Cyber Law", count: 2 },
    { name: "MTech Data Engineering", count: 2 },
    { name: "MTech Digital Image Processing", count: 2 },
    { name: "MTech Electronic Design", count: 2 },
    { name: "MTech Food Science And Technology", count: 2 },
    { name: "MTech Genetic Engineering", count: 2 },
    { name: "MTech Green Technology", count: 2 },
    { name: "MTech Maintenance Engineering", count: 2 },
    { name: "MTech Medical Informatics", count: 2 },
    { name: "MTech Network Technology", count: 2 },
    { name: "MTech Neural Networks", count: 2 },
    { name: "MTech Pharmaceutical BioTechnology", count: 2 },
    { name: "MTech Web Technology", count: 2 },
    { name: "MTM Tourism Management", count: 2 },
    { name: "MTTM Tourism Management", count: 2 },
    { name: "MTTM Travel And Tourism", count: 2 },
    { name: "MVA History", count: 2 },
    { name: "M.Voc Software Development", count: 2 },
    { name: "M.V.Sc Economics", count: 2 },
    { name: "M.V.Sc Jurisprudence", count: 2 },
    { name: "PGD Accountancy", count: 2 },
    { name: "PGD Advanced Computing", count: 2 },
    { name: "PGD Anatomy", count: 2 },
    { name: "PGD Applied Economics", count: 2 },
    { name: "PGD Assamese", count: 2 },
    { name: "PGD Beauty Care", count: 2 },
    { name: "PGD Bioethics", count: 2 },
    { name: "PGD Blood Bank", count: 2 },
    { name: "PGD Business Economics", count: 2 },
    { name: "PGD Cardiac Care", count: 2 },
    { name: "PGD Chemical Analysis", count: 2 },
    { name: "PGD Chemical Engineering", count: 2 },
    { name: "PGD Child Psychology", count: 2 },
    { name: "PGD Cloud Technology", count: 2 },
    { name: "PGD Communication Design", count: 2 },
    { name: "PGD Communication Management", count: 2 },
    { name: "PGD Community Medicine", count: 2 },
    { name: "PGD Computational Biology", count: 2 },
    { name: "PGD Computer Aided Design", count: 2 },
    { name: "PGD Culinary Arts", count: 2 },
    { name: "PGD Cultural Studies", count: 2 },
    { name: "PGD Dentistry", count: 2 },
    { name: "PGD Design management", count: 2 },
    { name: "PGD Development Administration", count: 2 },
    { name: "PGD Dialysis Technician", count: 2 },
    { name: "PGD Education Technology", count: 2 },
    { name: "PGD Electronics Communication Engineering", count: 2 },
    { name: "PGD Environmental Health", count: 2 },
    { name: "PGD Epigraphy", count: 2 },
    { name: "PGD Facilities Management", count: 2 },
    { name: "PGD Farm Management", count: 2 },
    { name: "PGD Fashion Styling", count: 2 },
    { name: "PGD Forensic Medicine", count: 2 },
    { name: "PGD General Medicine", count: 2 },
    { name: "PGD Genetics", count: 2 },
    { name: "PGD Health and Sanitation", count: 2 },
    { name: "PGD Health Information Management", count: 2 },
    { name: "PGD Health Sciences", count: 2 },
    { name: "PGD Heritage Tourism", count: 2 },
    { name: "PGD Home Science", count: 2 },
    { name: "PGD Indian Culture", count: 2 },
    { name: "PGD Indian Stock Market", count: 2 },
    { name: "PGD Industrial Microbiology", count: 2 },
    { name: "PGD Information Management", count: 2 },
    { name: "PGD Infrastructure Management", count: 2 },
    { name: "PGD Journalism And Mass Communication", count: 2 },
    { name: "PGD Jurisprudence", count: 2 },
    { name: "PGD Korean", count: 2 },
    { name: "PGD Library Science", count: 2 },
    { name: "PGD Mathematics", count: 2 },
    { name: "PGD Medical Technology", count: 2 },
    { name: "PGD Meditation", count: 2 },
    { name: "PGD Mental Health", count: 2 },
    { name: "PGD Oncology", count: 2 },
    { name: "PGD Operation Theatre Technology", count: 2 },
    { name: "PGD Organic Farming", count: 2 },
    { name: "PGD Palmistry", count: 2 },
    { name: "PGD Pharmaceutical Analysis", count: 2 },
    { name: "PGD Pharmaceutical Chemistry", count: 2 },
    { name: "PGD Pharmacology", count: 2 },
    { name: "PGD Physiotherapy", count: 2 },
    { name: "PGD Plant Tissue Culture", count: 2 },
    { name: "PGD Population Studies", count: 2 },
    { name: "PGD Product Design", count: 2 },
    { name: "PGD Psycho Social Rehabilitation", count: 2 },
    { name: "PGD Radiotherapy", count: 2 },
    { name: "PGD Rehabilitation Psychology", count: 2 },
    { name: "PGD Safety Engineering", count: 2 },
    { name: "PGD School Leadership", count: 2 },
    { name: "PGD Social Welfare", count: 2 },
    { name: "PGD Software Testing", count: 2 },
    { name: "PGD Structural Engineering", count: 2 },
    { name: "PGD Systems Management", count: 2 },
    { name: "PGD Toxicology", count: 2 },
    { name: "PGD VFX", count: 2 },
    { name: "PGD Vlsi Design", count: 2 },
    { name: "PGD Water Conservation", count: 2 },
    { name: "PGD Women Empowerment", count: 2 },
    { name: "PGDM Artificial Intelligence", count: 2 },
    { name: "PGDM Finance Management", count: 2 },
    { name: "PGDM Hospital Management", count: 2 },
    { name: "PGDM Hospitality Management", count: 2 },
    { name: "PGDM Human Resource Management", count: 2 },
    { name: "PGDM Information System", count: 2 },
    { name: "PGDM Logistics And Supply Chain Management", count: 2 },
    { name: "PGDM Pharmaceutical Management", count: 2 },
    { name: "PGDM Service Management", count: 2 },
    { name: "PGDM Systems Management", count: 2 },
    { name: "Pharm.D Pharmacology", count: 2 },
    { name: "Post Doctoral Cardiology", count: 2 },
    { name: "Post Doctoral Dermatology", count: 2 },
    { name: "Post Doctoral Emergency Medicine", count: 2 },
    { name: "Post Doctoral Endocrine Surgery", count: 2 },
    { name: "Post Doctoral Genetics", count: 2 },
    { name: "Post Doctoral Haematology", count: 2 },
    { name: "Post Doctoral Laryngology", count: 2 },
    { name: "Post Doctoral Nephrology", count: 2 },
    { name: "Post Doctoral Oncology", count: 2 },
    { name: "Post Doctoral Otology", count: 2 },
    { name: "Post Doctoral Paediatrics", count: 2 },
    { name: "Post Doctoral Pathology", count: 2 },
    { name: "Post Doctoral Physiology", count: 2 },
    { name: "Post Doctoral Psychiatry", count: 2 },
    { name: "Post Doctoral Urology", count: 2 },
    { name: "PGC Cloud Computing", count: 2 },
    { name: "PGC Cyber Security", count: 2 },
    { name: "PGC Data Science", count: 2 },
    { name: "PGC Healthcare Management", count: 2 },
    { name: "PGC Leadership", count: 2 },
    { name: "PGC Machine Learning", count: 2 },
    { name: "PGC Operations Management", count: 2 },
    { name: "PGP Advertising", count: 2 },
    { name: "PGP Agribusiness Management", count: 2 },
    { name: "PGP Communications", count: 2 },
    { name: "PGP Construction Management", count: 2 },
    { name: "PGP Economics", count: 2 },
    { name: "PGP Electrical And Electronics Engineering", count: 2 },
    { name: "PGP Event Management", count: 2 },
    { name: "PGP Fashion Design", count: 2 },
    { name: "PGP Financial Management", count: 2 },
    { name: "PGP International Management", count: 2 },
    { name: "PGP International Marketing", count: 2 },
    { name: "PGP Machine Learning", count: 2 },
    { name: "PGP Marketing Management", count: 2 },
    { name: "PGP Mechanical Engineering", count: 2 },
    { name: "PGP Product Design", count: 2 },
    { name: "PGP Sports Management", count: 2 },
    { name: "PGP Strategic Management", count: 2 },
    { name: "PGP Supply Chain Management", count: 2 },
    { name: "PGP Systems Management", count: 2 },
    { name: "Advance Certificate Bakery", count: 1 },
    { name: "Advance Certificate Business Management", count: 1 },
    { name: "Advance Certificate Cardiology", count: 1 },
    { name: "Advance Certificate Civil Engineering", count: 1 },
    { name: "Advance Certificate Computer Application", count: 1 },
    { name: "Advance Certificate Counselling", count: 1 },
    { name: "Advance Certificate Cyber Security", count: 1 },
    { name: "Advance Certificate Data Analytics", count: 1 },
    { name: "Advance Certificate Data Engineering", count: 1 },
    { name: "Advance Certificate Dentistry", count: 1 },
    { name: "Advance Certificate Digital Marketing", count: 1 },
    { name: "Advance Certificate Disaster Management", count: 1 },
    { name: "Advance Certificate English", count: 1 },
    { name: "Advance Certificate Finance", count: 1 },
    { name: "Advance Certificate Financial Management", count: 1 },
    { name: "Advance Certificate Foreign Trade", count: 1 },
    { name: "Advance Certificate Health Management", count: 1 },
    { name: "Advance Certificate Hospitality", count: 1 },
    { name: "Advance Certificate Hr", count: 1 },
    { name: "Advance Certificate Industrial Training", count: 1 },
    { name: "Advance Certificate Information Security", count: 1 },
    {
      name: "Advance Certificate Logistics And Supply Chain Management",
      count: 1,
    },
    { name: "Advance Certificate Logistics Management", count: 1 },
    { name: "Advance Certificate Medicine", count: 1 },
    { name: "Advance Certificate Meditation", count: 1 },
    { name: "Advance Certificate Naturopathy", count: 1 },
    { name: "Advance Certificate Nutrition", count: 1 },
    { name: "Advance Certificate Operations Management", count: 1 },
    { name: "Advance Certificate Portfolio Management", count: 1 },
    { name: "Advance Certificate Power Distribution", count: 1 },
    { name: "Advance Certificate Social Science", count: 1 },
    { name: "Advance Certificate Vedic Science", count: 1 },
    { name: "Advance Diploma Accountancy", count: 1 },
    { name: "Advance Diploma Aeronautical Engineering", count: 1 },
    { name: "Advance Diploma Analytical Chemistry", count: 1 },
    { name: "Advance Diploma Analytical Techniques", count: 1 },
    { name: "Advance Diploma Applied Linguistics", count: 1 },
    { name: "Advance Diploma Aquaculture", count: 1 },
    { name: "Advance Diploma Architectural Design", count: 1 },
    { name: "Advance Diploma Aviation Management", count: 1 },
    { name: "Advance Diploma Bakery", count: 1 },
    { name: "Advance Diploma Bengali", count: 1 },
    { name: "Advance Diploma Brand Management", count: 1 },
    { name: "Advance Diploma Business Analytics", count: 1 },
    { name: "Advance Diploma Cardiology", count: 1 },
    { name: "Advance Diploma Clinical Diagnostic", count: 1 },
    { name: "Advance Diploma Communication Skills", count: 1 },
    { name: "Advance Diploma Communications", count: 1 },
    { name: "Advance Diploma Computer Maintenance", count: 1 },
    { name: "Advance Diploma Cyber Law", count: 1 },
    { name: "Advance Diploma Cyber Security", count: 1 },
    { name: "Advance Diploma Dance", count: 1 },
    { name: "Advance Diploma Data Analytics", count: 1 },
    { name: "Advance Diploma Design management", count: 1 },
    { name: "Advance Diploma Digital Marketing", count: 1 },
    { name: "Advance Diploma Disaster Management", count: 1 },
    { name: "Advance Diploma Early Childhood Care and Education", count: 1 },
    { name: "Advance Diploma Energy Management", count: 1 },
    { name: "Advance Diploma Environmental Education", count: 1 },
    { name: "Advance Diploma Fashion Styling", count: 1 },
    { name: "Advance Diploma Food Preparation", count: 1 },
    { name: "Advance Diploma Food Technology", count: 1 },
    { name: "Advance Diploma Game Design", count: 1 },
    { name: "Advance Diploma Garment Designing", count: 1 },
    { name: "Advance Diploma Gas Safety", count: 1 },
    { name: "Advance Diploma Handicraft", count: 1 },
    { name: "Advance Diploma Healthcare Management", count: 1 },
    { name: "Advance Diploma Hospital Management", count: 1 },
    { name: "Advance Diploma Industrial Chemistry", count: 1 },
    { name: "Advance Diploma Insurance", count: 1 },
    { name: "Advance Diploma Insurance Management", count: 1 },
    { name: "Advance Diploma International Trade", count: 1 },
    { name: "Advance Diploma Jewelry Design", count: 1 },
    { name: "Advance Diploma Labour Law", count: 1 },
    { name: "Advance Diploma Leadership", count: 1 },
    { name: "Advance Diploma Library Science", count: 1 },
    { name: "Advance Diploma Life Science", count: 1 },
    { name: "Advance Diploma Logistics And Supply Chain Management", count: 1 },
    { name: "Advance Diploma Marine Engineering", count: 1 },
    { name: "Advance Diploma Mechtronics", count: 1 },
    { name: "Advance Diploma Medical Informatics", count: 1 },
    { name: "Advance Diploma Medicine", count: 1 },
    { name: "Advance Diploma Micro Finance", count: 1 },
    { name: "Advance Diploma Molecular Biology", count: 1 },
    { name: "Advance Diploma Nutrition", count: 1 },
    { name: "Advance Diploma Nutrition And Dietetics", count: 1 },
    { name: "Advance Diploma Painting", count: 1 },
    { name: "Advance Diploma Pharmaceutical Chemistry", count: 1 },
    { name: "Advance Diploma Pharmaceutical Management", count: 1 },
    { name: "Advance Diploma Physician Assistant", count: 1 },
    { name: "Advance Diploma Plant Biotechnology", count: 1 },
    { name: "Advance Diploma Project Management", count: 1 },
    { name: "Advance Diploma Psychology", count: 1 },
    { name: "Advance Diploma Public Health", count: 1 },
    { name: "Advance Diploma Quality Control", count: 1 },
    { name: "Advance Diploma Radiotherapy", count: 1 },
    { name: "Advance Diploma Remote Sensing", count: 1 },
    { name: "Advance Diploma Rural Development", count: 1 },
    { name: "Advance Diploma Rural Management", count: 1 },
    { name: "Advance Diploma Sales and Marketing", count: 1 },
    { name: "Advance Diploma Screenwriting", count: 1 },
    { name: "Advance Diploma Script Writing", count: 1 },
    { name: "Advance Diploma Secretarial Practice", count: 1 },
    { name: "Advance Diploma Strategic Management", count: 1 },
    { name: "Advance Diploma Tailoring", count: 1 },
    { name: "Advance Diploma Visual Arts", count: 1 },
    { name: "BText Chemistry", count: 1 },
    { name: "BText Fashion Technology", count: 1 },
    { name: "BText Textile Engineering", count: 1 },
    { name: "BA Accounting And Finance Hons", count: 1 },
    { name: "BA Agriculture", count: 1 },
    { name: "BA Ancient Indian History", count: 1 },
    { name: "BA Ancient Indian History Hons", count: 1 },
    { name: "BA Applied Economics Hons", count: 1 },
    { name: "BA Aviation", count: 1 },
    { name: "BA Banking", count: 1 },
    { name: "BA Banking Hons", count: 1 },
    { name: "BA Botany", count: 1 },
    { name: "BA Business Law Hons", count: 1 },
    { name: "BA Business Studies Hons", count: 1 },
    { name: "BA Chinese", count: 1 },
    { name: "BA Christianity", count: 1 },
    { name: "BA Cinematography", count: 1 },
    { name: "BA Communication Design", count: 1 },
    { name: "BA Communication Design Hons", count: 1 },
    { name: "BA Computer Application Hons", count: 1 },
    { name: "BA Computer Maintenance", count: 1 },
    { name: "BA Computer Science Hons", count: 1 },
    { name: "BA Corporate Secretaryship", count: 1 },
    { name: "BA Cosmetology", count: 1 },
    { name: "BA Counselling", count: 1 },
    { name: "BA Criminal Justice Hons", count: 1 },
    { name: "BA Criminal Law", count: 1 },
    { name: "BA Data Science Hons", count: 1 },
    { name: "BA Defence Studies", count: 1 },
    { name: "BA Digital Design", count: 1 },
    { name: "BA Disaster Management", count: 1 },
    { name: "BA Early Childhood Care and Education", count: 1 },
    { name: "BA Entrepreneurship Hons", count: 1 },
    { name: "BA Environmental Education", count: 1 },
    { name: "BA Event Management Hons", count: 1 },
    { name: "BA Fashion Communication", count: 1 },
    { name: "BA Fashion Styling Hons", count: 1 },
    { name: "BA Finance", count: 1 },
    { name: "BA Finance Hons", count: 1 },
    { name: "BA Foreign Languages", count: 1 },
    { name: "BA Foreign Languages Hons", count: 1 },
    { name: "BA Game Design", count: 1 },
    { name: "BA Gender Studies Hons", count: 1 },
    { name: "BA Geology", count: 1 },
    { name: "BA Graphic Designing", count: 1 },
    { name: "BA Hindi Literature Hons", count: 1 },
    { name: "BA Hospitality and Tourism Management", count: 1 },
    { name: "BA Hospitality Hons", count: 1 },
    { name: "BA Hotel Management Hons", count: 1 },
    { name: "BA Human Development", count: 1 },
    { name: "BA Humanities", count: 1 },
    { name: "BA Humanities Hons", count: 1 },
    { name: "BA Industrial Relation", count: 1 },
    { name: "BA Information Science", count: 1 },
    { name: "BA Insurance", count: 1 },
    { name: "BA Japanese", count: 1 },
    { name: "BA Korean Hons", count: 1 },
    { name: "BA Labour and Social Welfare", count: 1 },
    { name: "BA Labour and Social Welfare Hons", count: 1 },
    { name: "BA Leadership Hons", count: 1 },
    { name: "BA Library and Information Science Hons", count: 1 },
    { name: "BA Marketing Management", count: 1 },
    { name: "BA Materials Management", count: 1 },
    { name: "BA Maths", count: 1 },
    { name: "BA Military Science", count: 1 },
    { name: "BA Physics Hons", count: 1 },
    { name: "BA Product Design", count: 1 },
    { name: "BA Product Design Hons", count: 1 },
    { name: "BA Religious Studies Hons", count: 1 },
    { name: "BA Rural Development Hons", count: 1 },
    { name: "BA Sales Management", count: 1 },
    { name: "BA Sales Management Hons", count: 1 },
    { name: "BA Screenwriting", count: 1 },
    { name: "BA Secretarial Practice Hons", count: 1 },
    { name: "BA Social Studies Hons", count: 1 },
    { name: "BA Software Development", count: 1 },
    { name: "BA Taxation", count: 1 },
    { name: "BA Textile Design", count: 1 },
    { name: "BA Theology", count: 1 },
    { name: "BA Theology Hons", count: 1 },
    { name: "BA Vedic Science", count: 1 },
    { name: "BA Video Editing", count: 1 },
    { name: "BA Visual Arts Hons", count: 1 },
    { name: "BA Vocal Music Hons", count: 1 },
    { name: "BA Women Studies", count: 1 },
    { name: "Bachelor in Graphics & Multimedia Graphic Designing", count: 1 },
    { name: "BLib Information Science", count: 1 },
    { name: "BPP Public Policy", count: 1 },
    { name: "Bachelor of Animation Multimedia Technology", count: 1 },
    { name: "Bachelor of Animation Visual Effects", count: 1 },
    { name: "BAP Applied Psychology", count: 1 },
    { name: "Bachelor of Aviation Management Aviation Management", count: 1 },
    { name: "BPharm Ayurveda Ayurvedic Pharmacy", count: 1 },
    { name: "BBC Business Communication", count: 1 },
    { name: "BEC Economics", count: 1 },
    { name: "BEM Environmental Management", count: 1 },
    { name: "BFS Financial Services", count: 1 },
    { name: "BLW Labour Welfare", count: 1 },
    { name: "BMRSC Medical Record", count: 1 },
    { name: "BMMC Media Communication", count: 1 },
    { name: "Bachelor of Music Music Hons", count: 1 },
    { name: "BOL Sanskrit", count: 1 },
    { name: "Bachelor of Performing Arts Acting", count: 1 },
    { name: "Bachelor of Performing Arts Performing Arts Hons", count: 1 },
    { name: "Bachelor of Performing Arts Theatre Arts", count: 1 },
    { name: "BTTM Hospitality Management", count: 1 },
    { name: "BTTH Tourism Management", count: 1 },
    { name: "BUD Urban Design", count: 1 },
    {
      name: "Bachelors in Logistics Management Logistics Management",
      count: 1,
    },
    { name: "B.Des in Textile Design Textile Design", count: 1 },
    { name: "BAMS Naturopathy", count: 1 },
    { name: "BASLP Speech Therapy", count: 1 },
    { name: "BBA Agriculture Hons", count: 1 },
    { name: "BBA Banking Hons", count: 1 },
    { name: "BBA Big Data", count: 1 },
    { name: "BBA Bioinformatics Hons", count: 1 },
    { name: "BBA Biotech", count: 1 },
    { name: "BBA Business Communication", count: 1 },
    { name: "BBA Business Environment", count: 1 },
    { name: "BBA Business Environment Hons", count: 1 },
    { name: "BBA Business Intelligence Hons", count: 1 },
    { name: "BBA Business Law", count: 1 },
    { name: "BBA Business Law Hons", count: 1 },
    { name: "BBA Business Studies", count: 1 },
    { name: "BBA Co-Operative Management", count: 1 },
    { name: "BBA Communication Management", count: 1 },
    { name: "BBA Computer Science", count: 1 },
    { name: "BBA Criminal Law", count: 1 },
    { name: "BBA Culinary Arts", count: 1 },
    { name: "BBA Cyber Security Hons", count: 1 },
    { name: "BBA Data Analytics Hons", count: 1 },
    { name: "BBA Disaster Management", count: 1 },
    { name: "BBA Export Management Hons", count: 1 },
    { name: "BBA Fashion Design Hons", count: 1 },
    { name: "BBA Film Making", count: 1 },
    { name: "BBA Finance Management", count: 1 },
    { name: "BBA Financial Analysis Hons", count: 1 },
    { name: "BBA Financial Planning", count: 1 },
    { name: "BBA Financial Planning Hons", count: 1 },
    { name: "BBA Industrial Management", count: 1 },
    { name: "BBA Interior Design", count: 1 },
    { name: "BBA International Accounting", count: 1 },
    { name: "BBA International Law", count: 1 },
    { name: "BBA International Relations", count: 1 },
    { name: "BBA Liberal Arts", count: 1 },
    { name: "BBA Life Science", count: 1 },
    { name: "BBA Media Communication", count: 1 },
    { name: "BBA Media Science Hons", count: 1 },
    { name: "BBA Media Studies", count: 1 },
    { name: "BBA Nursing", count: 1 },
    { name: "BBA Pharmaceutical Management Hons", count: 1 },
    { name: "BBA Project Management Hons", count: 1 },
    { name: "BBA Public Administration", count: 1 },
    { name: "BBA Public Health Hons", count: 1 },
    { name: "BBA Safety Management Hons", count: 1 },
    { name: "BBA Secretarial Practice", count: 1 },
    { name: "BBA Shipping Management", count: 1 },
    { name: "BBA Social Media", count: 1 },
    { name: "BBA Social Welfare", count: 1 },
    { name: "BBA Strategic Management", count: 1 },
    { name: "BBA Taxation", count: 1 },
    { name: "BBA Technology Management", count: 1 },
    { name: "BBA Tourism Management Hons", count: 1 },
    { name: "BBM Advertising", count: 1 },
    { name: "BBM Arabic", count: 1 },
    { name: "BBM Business Analytics", count: 1 },
    { name: "BBM Entrepreneurship", count: 1 },
    { name: "BBM Finance", count: 1 },
    { name: "BBM Hospitality Management", count: 1 },
    { name: "BBM Hr Hons", count: 1 },
    { name: "BBM Marketing Hons", count: 1 },
    { name: "BBM Mass Media", count: 1 },
    { name: "BBM Retail Management", count: 1 },
    { name: "BBM Supply Chain Management", count: 1 },
    { name: "BCA Arabic", count: 1 },
    { name: "BCA Big Data Analytics Hons", count: 1 },
    { name: "BCA Business Administration", count: 1 },
    { name: "BCA Business Intelligence", count: 1 },
    { name: "BCA Computer Networks", count: 1 },
    { name: "BCA DevOps", count: 1 },
    { name: "BCA Gaming Technology Hons", count: 1 },
    { name: "BCA Information System", count: 1 },
    { name: "BCA Mobile Technology", count: 1 },
    { name: "BCA Video Editing", count: 1 },
    { name: "BCA Web Technology Hons", count: 1 },
    { name: "BCom Airport Management", count: 1 },
    { name: "BCom Arabic", count: 1 },
    { name: "BCom Auditing Hons", count: 1 },
    { name: "BCom Business Economics Hons", count: 1 },
    { name: "BCom Business Studies", count: 1 },
    { name: "BCom Business Studies Hons", count: 1 },
    { name: "BCom Computerized Accounting", count: 1 },
    { name: "BCom Fashion Design", count: 1 },
    { name: "BCom Finance Management", count: 1 },
    { name: "BCom Financial Planning", count: 1 },
    { name: "BCom Forensic Accounting Hons", count: 1 },
    { name: "BCom French", count: 1 },
    { name: "BCom Geography", count: 1 },
    { name: "BCom German", count: 1 },
    { name: "BCom Graphic Designing", count: 1 },
    { name: "BCom Hotel Management", count: 1 },
    { name: "BCom Human Resource Management", count: 1 },
    { name: "BCom Income Tax", count: 1 },
    { name: "BCom Insurance Hons", count: 1 },
    { name: "BCom International Business Hons", count: 1 },
    { name: "BCom Investment Banking", count: 1 },
    { name: "BCom Malayalam", count: 1 },
    { name: "BCom Marketing Management Hons", count: 1 },
    { name: "BCom Mass Communication", count: 1 },
    { name: "BCom Maths", count: 1 },
    { name: "BCom Operations Management", count: 1 },
    { name: "BCom Persian", count: 1 },
    { name: "BCom Rural Development", count: 1 },
    { name: "BCom Sales and Marketing", count: 1 },
    { name: "BCom Secretarial Practice Hons", count: 1 },
    { name: "BCom Shipping", count: 1 },
    { name: "BCom Shipping Management", count: 1 },
    { name: "BCom Sports Management", count: 1 },
    { name: "BCom Strategic Finance Hons", count: 1 },
    { name: "BCom Systems Management", count: 1 },
    { name: "BCom Tamil", count: 1 },
    { name: "BCom Telugu", count: 1 },
    { name: "BCom Transport Management", count: 1 },
    { name: "BCom Wealth Management", count: 1 },
    { name: "BCS Computer Science", count: 1 },
    { name: "B.Des Advertising", count: 1 },
    { name: "B.Des Fashion Management", count: 1 },
    { name: "B.Des Fashion Merchandising", count: 1 },
    { name: "B.Des Fashion Technology", count: 1 },
    { name: "B.Des Furniture Design Hons", count: 1 },
    { name: "B.Des Glass Design", count: 1 },
    { name: "B.Des Information Design", count: 1 },
    { name: "B.Des Life Science", count: 1 },
    { name: "B.Des Merchandising", count: 1 },
    { name: "B.Des Production Management", count: 1 },
    { name: "B.Des Visual Arts", count: 1 },
    { name: "B.Des Visual Design", count: 1 },
    { name: "BDS Oral Surgery", count: 1 },
    { name: "BDS Periodontology", count: 1 },
    { name: "BDS Public Health", count: 1 },
    { name: "Bachelor of Engineering Applied Electronics", count: 1 },
    { name: "Bachelor of Engineering Big Data Analytics", count: 1 },
    { name: "Bachelor of Engineering Biomedical Instrumentation", count: 1 },
    { name: "Bachelor of Engineering Business Administration", count: 1 },
    { name: "Bachelor of Engineering Ceramic Engineering", count: 1 },
    { name: "Bachelor of Engineering Ceramics", count: 1 },
    { name: "Bachelor of Engineering Chemical Engineering Hons", count: 1 },
    { name: "Bachelor of Engineering Chemistry", count: 1 },
    {
      name: "Bachelor of Engineering Computer Integrated Manufacturing",
      count: 1,
    },
    { name: "Bachelor of Engineering Computer Science Engineering", count: 1 },
    { name: "Bachelor of Engineering Dairy Technology", count: 1 },
    {
      name: "Bachelor of Engineering Electronics And Telecommunication Engineering",
      count: 1,
    },
    { name: "Bachelor of Engineering Fashion Technology", count: 1 },
    { name: "Bachelor of Engineering Fire Engineering", count: 1 },
    { name: "Bachelor of Engineering Fisheries", count: 1 },
    { name: "Bachelor of Engineering Food Processing Technology", count: 1 },
    { name: "Bachelor of Engineering Graphic Designing", count: 1 },
    { name: "Bachelor of Engineering Hotel Management", count: 1 },
    { name: "Bachelor of Engineering Infrastructure Engineering", count: 1 },
    { name: "Bachelor of Engineering Maintenance Engineering", count: 1 },
    { name: "Bachelor of Engineering Mechanical Engineering Hons", count: 1 },
    { name: "Bachelor of Engineering Nanotechnology", count: 1 },
    { name: "Bachelor of Engineering Physics", count: 1 },
    { name: "Bachelor of Engineering Ship Building", count: 1 },
    { name: "Bachelor of Engineering Technology Management", count: 1 },
    { name: "Bachelor of Engineering Thermal Engineering", count: 1 },
    { name: "B.Ed Bengali", count: 1 },
    { name: "B.Ed Fine Arts", count: 1 },
    { name: "B.Ed Information Technology", count: 1 },
    { name: "B.Ed Public Administration", count: 1 },
    { name: "B.Ed Punjabi", count: 1 },
    { name: "B.Ed Statistics", count: 1 },
    { name: "B.Ed Visual Impairment", count: 1 },
    { name: "BFA Cinematography", count: 1 },
    { name: "BFA Film Making", count: 1 },
    { name: "BFA Fine Arts Hons", count: 1 },
    { name: "BFA Visual Communication", count: 1 },
    { name: "BHM Event Management", count: 1 },
    { name: "BHM French", count: 1 },
    { name: "BHM Hospitality", count: 1 },
    { name: "BHM Soft Skill", count: 1 },
    { name: "BHMCT Culinary Arts", count: 1 },
    { name: "BHMCT Hospitality", count: 1 },
    { name: "BHMCT Medical Laboratory Technology", count: 1 },
    { name: "BJMC Banking", count: 1 },
    { name: "BJMC Digital Marketing", count: 1 },
    { name: "BJMC Electronic Media", count: 1 },
    { name: "BJMC Event Management", count: 1 },
    { name: "BJMC Hindi", count: 1 },
    { name: "BMM Digital Marketing", count: 1 },
    { name: "BMS Airport Management", count: 1 },
    { name: "BMS Computer Application", count: 1 },
    { name: "BMS Film Making", count: 1 },
    { name: "BMS Insurance", count: 1 },
    { name: "BMS Leadership", count: 1 },
    { name: "BMS Logistics Management", count: 1 },
    { name: "BMS Management Studies Hons", count: 1 },
    { name: "BMS Mass Communication", count: 1 },
    { name: "BMS Media Science Hons", count: 1 },
    { name: "BMS Media Studies", count: 1 },
    { name: "BMS Rural Development", count: 1 },
    { name: "BMS Supply Chain Management", count: 1 },
    { name: "B.Optom Medicine", count: 1 },
    { name: "BPH Human Development Hons", count: 1 },
    { name: "B Pharmacy Agriculture", count: 1 },
    { name: "B Pharmacy Anatomy", count: 1 },
    { name: "B Pharmacy Ayurvedic Pharmacy", count: 1 },
    { name: "B Pharmacy Biology", count: 1 },
    { name: "B Pharmacy Business Administration", count: 1 },
    { name: "B Pharmacy English", count: 1 },
    { name: "B Pharmacy Hospitality", count: 1 },
    { name: "B Pharmacy Mathematics", count: 1 },
    { name: "B Pharmacy Pharmaceutical Technology", count: 1 },
    { name: "B Pharmacy Quality Assurance", count: 1 },
    { name: "B Pharmacy Sales Management", count: 1 },
    { name: "BPT Community Medicine", count: 1 },
    { name: "BPT Optometry", count: 1 },
    { name: "BPT Graphic Designing", count: 1 },
    { name: "BSc Acting", count: 1 },
    { name: "BSc Actuarial Science Hons", count: 1 },
    { name: "BSc Acupuncture", count: 1 },
    { name: "BSc Advertising", count: 1 },
    { name: "BSc Aeronautical Engineering", count: 1 },
    { name: "BSc Aerospace Engineering", count: 1 },
    { name: "BSc Agribusiness Management", count: 1 },
    { name: "BSc Agribusiness Management Hons", count: 1 },
    { name: "BSc Agroforestry Hons", count: 1 },
    { name: "BSc Anaesthesia Hons", count: 1 },
    { name: "BSc Applied Psychology", count: 1 },
    { name: "BSc Applied Sciences Hons", count: 1 },
    { name: "BSc Arabic", count: 1 },
    { name: "BSc Astronomy", count: 1 },
    { name: "BSc Automation Technology", count: 1 },
    { name: "BSc Banking", count: 1 },
    { name: "BSc Banking Hons", count: 1 },
    { name: "BSc Bengali", count: 1 },
    { name: "BSc Business Law", count: 1 },
    { name: "BSc Cardiology Hons", count: 1 },
    { name: "BSc Chemical Engineering", count: 1 },
    { name: "BSc Child Development", count: 1 },
    { name: "BSc Child Health", count: 1 },
    { name: "BSc Cinematography", count: 1 },
    { name: "BSc Clinical Microbiology", count: 1 },
    { name: "BSc Clinical Nutrition Hons", count: 1 },
    { name: "BSc Clinical Research Hons", count: 1 },
    { name: "BSc Cloud Computing", count: 1 },
    { name: "BSc Cloud Computing Hons", count: 1 },
    { name: "BSc Communication Networks", count: 1 },
    { name: "BSc Community Health Nursing", count: 1 },
    { name: "BSc Computer Engineering", count: 1 },
    { name: "BSc Construction Management", count: 1 },
    { name: "BSc Criminal Law", count: 1 },
    { name: "BSc Data Analytics Hons", count: 1 },
    { name: "BSc Dental Hygiene", count: 1 },
    { name: "BSc Disaster Management", count: 1 },
    { name: "BSc Earth Science Hons", count: 1 },
    { name: "BSc Electronic Science Hons", count: 1 },
    { name: "BSc Emergency Medical Services", count: 1 },
    { name: "BSc Emergency Medical Services Hons", count: 1 },
    { name: "BSc Emergency Medicine Hons", count: 1 },
    { name: "BSc Environment Science Hons", count: 1 },
    { name: "BSc Environmental Education", count: 1 },
    { name: "BSc Environmental Health Hons", count: 1 },
    { name: "BSc Ethical Hacking", count: 1 },
    { name: "BSc Exercise Sciences", count: 1 },
    { name: "BSc Farm Management", count: 1 },
    { name: "BSc Fashion Technology Hons", count: 1 },
    { name: "BSc Fine Arts", count: 1 },
    { name: "BSc Food Preservation", count: 1 },
    { name: "BSc Food Production", count: 1 },
    { name: "BSc Forensic Medicine", count: 1 },
    { name: "BSc Gemology", count: 1 },
    { name: "BSc Home Management", count: 1 },
    { name: "BSc Hospital Management Hons", count: 1 },
    { name: "BSc Human Development", count: 1 },
    { name: "BSc Humanities Hons", count: 1 },
    { name: "BSc Industrial Design", count: 1 },
    { name: "BSc Information Management", count: 1 },
    { name: "BSc Information System Hons", count: 1 },
    { name: "BSc Instrumentation Engineering", count: 1 },
    { name: "BSc International Law", count: 1 },
    { name: "BSc Journalism Hons", count: 1 },
    { name: "BSc Kannada", count: 1 },
    { name: "BSc Liberal Arts Hons", count: 1 },
    { name: "BSc Library and Information Science Hons", count: 1 },
    { name: "BSc Machine Learning", count: 1 },
    { name: "BSc Maintenance Engineering", count: 1 },
    { name: "BSc Malayalam", count: 1 },
    { name: "BSc Marathi", count: 1 },
    { name: "BSc Marketing Hons", count: 1 },
    { name: "BSc Mechatronics", count: 1 },
    { name: "BSc Media Management", count: 1 },
    { name: "BSc Medical Biotechnology Hons", count: 1 },
    { name: "BSc Medical Surgical Nursing", count: 1 },
    { name: "BSc Medicine", count: 1 },
    { name: "BSc Mental Health", count: 1 },
    { name: "BSc Merchandising", count: 1 },
    { name: "BSc Mobile Application", count: 1 },
    { name: "BSc Mobile Technology", count: 1 },
    { name: "BSc Molecular Medicine", count: 1 },
    { name: "BSc Molecular Medicine Hons", count: 1 },
    { name: "BSc Music", count: 1 },
    { name: "BSc Nano Science Hons", count: 1 },
    { name: "BSc Natural Resource Management Hons", count: 1 },
    { name: "BSc Network Security", count: 1 },
    { name: "BSc Networking Hons", count: 1 },
    { name: "BSc Neuroscience Hons", count: 1 },
    { name: "BSc Ophthalmology", count: 1 },
    { name: "BSc Perfusion Technology Hons", count: 1 },
    { name: "BSc Persian", count: 1 },
    { name: "BSc Physical Education Hons", count: 1 },
    { name: "BSc Physician Assistant Hons", count: 1 },
    { name: "BSc Pisciculture", count: 1 },
    { name: "BSc Plant Protection", count: 1 },
    { name: "BSc Political Science", count: 1 },
    { name: "BSc Public Administration", count: 1 },
    { name: "BSc Public Health Hons", count: 1 },
    { name: "BSc Resource Management", count: 1 },
    { name: "BSc Resource Management Hons", count: 1 },
    { name: "BSc Russian", count: 1 },
    { name: "BSc Sanskrit Hons", count: 1 },
    { name: "BSc Ship Building", count: 1 },
    { name: "BSc Social Work", count: 1 },
    { name: "BSc Special Education", count: 1 },
    { name: "BSc Speech Therapy", count: 1 },
    { name: "BSc Sports Management Hons", count: 1 },
    { name: "BSc Supply Chain Management", count: 1 },
    { name: "BSc Tamil", count: 1 },
    { name: "BSc Taxation", count: 1 },
    { name: "BSc Technology Management", count: 1 },
    { name: "BSc Textile Design Hons", count: 1 },
    { name: "BSc Tourism Hons", count: 1 },
    { name: "BSc Veterinary Science", count: 1 },
    { name: "BSc X-Ray Technician", count: 1 },
    { name: "BSc Yoga Hons", count: 1 },
    { name: "BTech Aerospace Engineering Hons", count: 1 },
    { name: "BTech Agricultural Engineering Hons", count: 1 },
    { name: "BTech Astrophysics", count: 1 },
    { name: "BTech Biomedical Instrumentation", count: 1 },
    { name: "BTech Biotech Hons", count: 1 },
    { name: "BTech Botany", count: 1 },
    { name: "BTech Cad Cam", count: 1 },
    { name: "BTech Chemical Engineering Hons", count: 1 },
    { name: "BTech Communications", count: 1 },
    { name: "BTech Computational Mechanics", count: 1 },
    { name: "BTech Computer Engineering Hons", count: 1 },
    { name: "BTech Computer Integrated Manufacturing", count: 1 },
    { name: "BTech Computer Science Engineering Hons", count: 1 },
    { name: "BTech Data Engineering", count: 1 },
    { name: "BTech Digital Techniques", count: 1 },
    { name: "BTech Earth Science", count: 1 },
    { name: "BTech Education Technology", count: 1 },
    { name: "BTech Electrical And Electronics Engineering Hons", count: 1 },
    { name: "BTech Electronics Hons", count: 1 },
    { name: "BTech Embedded Systems", count: 1 },
    { name: "BTech Embedded Systems Hons", count: 1 },
    { name: "BTech Energy Systems", count: 1 },
    { name: "BTech Energy Systems Hons", count: 1 },
    { name: "BTech Entrepreneurship Hons", count: 1 },
    { name: "BTech Environmental Engineering Hons", count: 1 },
    { name: "BTech Environmental Science", count: 1 },
    { name: "BTech Film Making", count: 1 },
    { name: "BTech Food Technology Engineering Hons", count: 1 },
    { name: "BTech Geology", count: 1 },
    { name: "BTech Geotechnical Engineering", count: 1 },
    { name: "BTech Geotechnical Engineering Hons", count: 1 },
    { name: "BTech High Performance Computing", count: 1 },
    { name: "BTech Industrial Design", count: 1 },
    { name: "BTech Industrial Engineering And Management Hons", count: 1 },
    { name: "BTech Industrial Engineering Hons", count: 1 },
    { name: "BTech Industrial Safety", count: 1 },
    { name: "BTech Life Science", count: 1 },
    { name: "BTech Machine Design", count: 1 },
    { name: "BTech Machine Learning Hons", count: 1 },
    { name: "BTech Manufacturing Science And Engineering", count: 1 },
    { name: "BTech Manufacturing Science And Engineering Hons", count: 1 },
    { name: "BTech Medical Technology", count: 1 },
    { name: "BTech Metallurgical Engineering Hons", count: 1 },
    { name: "BTech Microwave Engineering", count: 1 },
    { name: "BTech Microwave Engineering Hons", count: 1 },
    { name: "BTech Mining Engineering Hons", count: 1 },
    { name: "BTech Nano Science", count: 1 },
    { name: "BTech Network Engineering", count: 1 },
    { name: "BTech Network Security", count: 1 },
    { name: "BTech Ocean Engineering Hons", count: 1 },
    { name: "BTech Optical Engineering", count: 1 },
    { name: "BTech Plastic Engineering", count: 1 },
    { name: "BTech Power Electronics", count: 1 },
    { name: "BTech Power System Engineering", count: 1 },
    { name: "BTech Power Systems", count: 1 },
    { name: "BTech Process Engineering Hons", count: 1 },
    { name: "BTech Production Technology", count: 1 },
    { name: "BTech Quality Assurance", count: 1 },
    { name: "BTech Safety Engineering Hons", count: 1 },
    { name: "BTech Safety Management", count: 1 },
    { name: "BTech Scientific Computing", count: 1 },
    { name: "BTech Social Science", count: 1 },
    { name: "BTech Structural Engineering Hons", count: 1 },
    { name: "BTech Telecommunication Hons", count: 1 },
    { name: "BTech Thermal Engineering", count: 1 },
    { name: "BTech Tissue Engineering", count: 1 },
    { name: "BTech Tool Engineering", count: 1 },
    { name: "BTech Transportation Engineering Hons", count: 1 },
    { name: "BTech Vlsi Design Hons", count: 1 },
    { name: "BTech Water Resources Engineering Hons", count: 1 },
    { name: "BVA 3D Animation", count: 1 },
    { name: "BVA Communications", count: 1 },
    { name: "BVA Film Making", count: 1 },
    { name: "BVA History", count: 1 },
    { name: "BVA Multimedia Technology", count: 1 },
    { name: "BVA Photography", count: 1 },
    { name: "B.Voc Accessory Design", count: 1 },
    { name: "B.Voc Airport Management", count: 1 },
    { name: "B.Voc Applied Arts", count: 1 },
    { name: "B.Voc Beauty Care", count: 1 },
    { name: "B.Voc Beauty Therapy", count: 1 },
    { name: "B.Voc Biomedical Science", count: 1 },
    { name: "B.Voc Building Maintenance", count: 1 },
    { name: "B.Voc Chemistry", count: 1 },
    { name: "B.Voc Cinematography", count: 1 },
    { name: "B.Voc Clinical Nutrition", count: 1 },
    { name: "B.Voc Cloud Computing", count: 1 },
    { name: "B.Voc Communications", count: 1 },
    { name: "B.Voc Computer Engineering", count: 1 },
    { name: "B.Voc Computer Maintenance", count: 1 },
    { name: "B.Voc Computer Science", count: 1 },
    { name: "B.Voc Construction Management", count: 1 },
    { name: "B.Voc Culinary Arts", count: 1 },
    { name: "B.Voc Energy Technology", count: 1 },
    { name: "B.Voc Fabric Painting", count: 1 },
    { name: "B.Voc Financial Market", count: 1 },
    { name: "B.Voc Floriculture", count: 1 },
    { name: "B.Voc Food Science And Technology", count: 1 },
    { name: "B.Voc Foreign Languages", count: 1 },
    { name: "B.Voc Game Design", count: 1 },
    { name: "B.Voc Gemology", count: 1 },
    { name: "B.Voc Health Administration", count: 1 },
    { name: "B.Voc Healthcare Management", count: 1 },
    { name: "B.Voc Library Science", count: 1 },
    { name: "B.Voc Life Science", count: 1 },
    { name: "B.Voc Logistics And Supply Chain Management", count: 1 },
    { name: "B.Voc Mass Media", count: 1 },
    { name: "B.Voc Media Studies", count: 1 },
    { name: "B.Voc Mobile Technology", count: 1 },
    { name: "B.Voc Nutrition And Dietetics", count: 1 },
    { name: "B.Voc Organic Farming", count: 1 },
    { name: "B.Voc Pottery", count: 1 },
    { name: "B.Voc Project Management", count: 1 },
    { name: "B.Voc Rural Development", count: 1 },
    { name: "B.Voc Secretarial Practice", count: 1 },
    { name: "B.Voc Textile Design", count: 1 },
    { name: "B.Voc Visual Media", count: 1 },
    { name: "B.Voc Vlsi Design", count: 1 },
    { name: "B.Voc Waste Management", count: 1 },
    { name: "B.Voc Web Designing", count: 1 },
    { name: "B.Voc Women Studies", count: 1 },
    { name: "B.V.Sc Aquaculture", count: 1 },
    { name: "B.V.Sc Biochemistry", count: 1 },
    { name: "B.V.Sc Chemistry", count: 1 },
    { name: "B.V.Sc Medicine", count: 1 },
    { name: "B.V.Sc Toxicology", count: 1 },
    { name: "Certificate Advertising", count: 1 },
    { name: "Certificate Airport Management", count: 1 },
    { name: "Certificate AutoCAD", count: 1 },
    { name: "Certificate Aviation", count: 1 },
    { name: "Certificate Aviation Management", count: 1 },
    { name: "Certificate Bakery", count: 1 },
    { name: "Certificate Clinical Research", count: 1 },
    { name: "Certificate Cyber Security", count: 1 },
    { name: "Certificate Dance", count: 1 },
    { name: "Certificate Diamond Grading", count: 1 },
    { name: "Certificate Digital Communication", count: 1 },
    { name: "Certificate Entrepreneurship", count: 1 },
    { name: "Certificate Graphic Designing", count: 1 },
    { name: "Certificate Hotel Management", count: 1 },
    { name: "Certificate International Business", count: 1 },
    { name: "Certificate Journalism", count: 1 },
    { name: "Certificate Medical Laboratory Technology", count: 1 },
    { name: "Certificate Merchandising", count: 1 },
    { name: "Certificate Music", count: 1 },
    { name: "Certificate Organic Farming", count: 1 },
    { name: "Certificate Pattern Making", count: 1 },
    { name: "Certificate Performing Arts", count: 1 },
    { name: "Certificate Personality Development", count: 1 },
    { name: "Certificate Photography", count: 1 },
    { name: "Certificate Physical Education", count: 1 },
    { name: "Certificate Tourism", count: 1 },
    { name: "Certificate Tourism Management", count: 1 },
    { name: "Certificate Travel And Tourism", count: 1 },
    { name: "Certificate VFX", count: 1 },
    { name: "Diploma Advanced Computing", count: 1 },
    { name: "Diploma Aeronautical Engineering", count: 1 },
    { name: "Diploma Anaesthesia Technology", count: 1 },
    { name: "Diploma Arabic", count: 1 },
    { name: "Diploma Aviation", count: 1 },
    { name: "Diploma Bakery", count: 1 },
    { name: "Diploma Banking And Insurance", count: 1 },
    { name: "Diploma Biomedical Engineering", count: 1 },
    { name: "Diploma Blood Bank", count: 1 },
    { name: "Diploma Computer Application", count: 1 },
    { name: "Diploma Computer Science", count: 1 },
    { name: "Diploma Culinary Arts", count: 1 },
    { name: "Diploma Cyber Law", count: 1 },
    { name: "Diploma Dairy Technology", count: 1 },
    { name: "Diploma Dance", count: 1 },
    { name: "Diploma Dialysis Technician", count: 1 },
    { name: "Diploma Digital Marketing", count: 1 },
    { name: "Diploma Economics", count: 1 },
    { name: "Diploma Electronics Communication Engineering", count: 1 },
    { name: "Diploma Environmental Engineering", count: 1 },
    { name: "Diploma Fashion Photography", count: 1 },
    { name: "Diploma Fashion Technology", count: 1 },
    { name: "Diploma Financial Management", count: 1 },
    { name: "Diploma Financial Services", count: 1 },
    { name: "Diploma Fine Arts", count: 1 },
    { name: "Diploma Food Preparation", count: 1 },
    { name: "Diploma Foreign Trade", count: 1 },
    { name: "Diploma Gemology", count: 1 },
    { name: "Diploma Health Inspector", count: 1 },
    { name: "Diploma Hospital Management", count: 1 },
    { name: "Diploma Hospitality", count: 1 },
    { name: "Diploma Imaging Technology", count: 1 },
    { name: "Diploma Logistics Management", count: 1 },
    { name: "Diploma Medical Record", count: 1 },
    { name: "Diploma Metallurgical Engineering", count: 1 },
    { name: "Diploma Mining Engineering", count: 1 },
    { name: "Diploma Nursery Teacher Training", count: 1 },
    { name: "Diploma Operation Theatre Technology", count: 1 },
    { name: "Diploma Ophthalmology", count: 1 },
    { name: "Diploma Optometry", count: 1 },
    { name: "Diploma Painting", count: 1 },
    { name: "Diploma Palmistry", count: 1 },
    { name: "Diploma Petrochemical Engineering", count: 1 },
    { name: "Diploma Special Education", count: 1 },
    { name: "Diploma Textile Design", count: 1 },
    { name: "Diploma Video Editing", count: 1 },
    { name: "Diploma Vocal Music", count: 1 },
    { name: "Diploma Yoga", count: 1 },
    { name: "Distance BBA Tourism Hons", count: 1 },
    { name: "Distance MBA Banking", count: 1 },
    { name: "Distance MBA Bioinformatics", count: 1 },
    { name: "Distance MBA Biotech", count: 1 },
    { name: "Distance MBA Business Administration", count: 1 },
    { name: "Distance MBA Business Management", count: 1 },
    { name: "Distance MBA Corporate Law", count: 1 },
    { name: "Distance MBA Criminology", count: 1 },
    { name: "Distance MBA Disaster Management", count: 1 },
    { name: "Distance MBA Educational Management", count: 1 },
    { name: "Distance MBA Entrepreneurship", count: 1 },
    { name: "Distance MBA Environmental Management", count: 1 },
    { name: "Distance MBA Fashion Design", count: 1 },
    { name: "Distance MBA Financial Management", count: 1 },
    { name: "Distance MBA Foreign Trade", count: 1 },
    { name: "Distance MBA Forensic Science", count: 1 },
    { name: "Distance MBA Geoinformatics", count: 1 },
    { name: "Distance MBA Green Technology", count: 1 },
    { name: "Distance MBA Health Management", count: 1 },
    { name: "Distance MBA Hotel Management", count: 1 },
    { name: "Distance MBA Information System", count: 1 },
    { name: "Distance MBA Instructional Design", count: 1 },
    { name: "Distance MBA Insurance", count: 1 },
    { name: "Distance MBA International Business", count: 1 },
    { name: "Distance MBA Logistics Management", count: 1 },
    { name: "Distance MBA Media Management", count: 1 },
    { name: "Distance MBA Medicinal Plants", count: 1 },
    { name: "Distance MBA Nanotechnology", count: 1 },
    { name: "Distance MBA Operations Management", count: 1 },
    { name: "Distance MBA Organic Farming", count: 1 },
    { name: "Distance MBA Population Studies", count: 1 },
    { name: "Distance MBA Retail Management", count: 1 },
    { name: "Distance MBA Rural Development", count: 1 },
    { name: "Distance MBA Social Work", count: 1 },
    { name: "Distance MBA Systems Management", count: 1 },
    { name: "Distance MBA Technology Management", count: 1 },
    { name: "Distance MBA Travel And Tourism", count: 1 },
    { name: "D.Litt Dance", count: 1 },
    { name: "D.Litt Graphic Designing", count: 1 },
    { name: "D.Litt History", count: 1 },
    { name: "D.Litt Museology", count: 1 },
    { name: "D.Litt Music", count: 1 },
    { name: "D.Litt Painting", count: 1 },
    { name: "D.Litt Visual Arts", count: 1 },
    { name: "DM Biochemistry", count: 1 },
    { name: "DM Community Medicine", count: 1 },
    { name: "DM Mental Health", count: 1 },
    { name: "DM Paediatrics", count: 1 },
    { name: "DM Physiology", count: 1 },
    { name: "DM Radiotherapy", count: 1 },
    { name: "DM Sleep Medicine", count: 1 },
    { name: "DM Thoracic Surgery", count: 1 },
    { name: "DNB Cardiology", count: 1 },
    { name: "DNB Nephrology", count: 1 },
    { name: "DNB Physical Medicine and Rehabilitation", count: 1 },
    { name: "DNB Psychiatry", count: 1 },
    { name: "DNB Urology", count: 1 },
    { name: "PhD Actuarial Science", count: 1 },
    { name: "PhD Agricultural Chemistry", count: 1 },
    { name: "PhD Ancient Indian History", count: 1 },
    { name: "PhD Applied Statistics", count: 1 },
    { name: "PhD Architecture Engineering", count: 1 },
    { name: "PhD Automation Technology", count: 1 },
    { name: "PhD Ayurvedic Pharmacy", count: 1 },
    { name: "PhD Big Data", count: 1 },
    { name: "PhD Bioelectronics", count: 1 },
    { name: "PhD Biotechnology", count: 1 },
    { name: "PhD Building Maintenance", count: 1 },
    { name: "PhD Cad Cam", count: 1 },
    { name: "PhD Child Development", count: 1 },
    { name: "PhD Christianity", count: 1 },
    { name: "PhD Clinical Embryology", count: 1 },
    { name: "PhD Clinical Pharmacy", count: 1 },
    { name: "PhD Co Operation", count: 1 },
    { name: "PhD Communication and Networking", count: 1 },
    { name: "PhD Communication Design", count: 1 },
    { name: "PhD Communication Skills", count: 1 },
    { name: "PhD Computer Aided Design", count: 1 },
    { name: "PhD Computer Networks", count: 1 },
    { name: "PhD Computer Science Engineering", count: 1 },
    { name: "PhD Control Systems", count: 1 },
    { name: "PhD Corporate Law", count: 1 },
    { name: "PhD Costume Design", count: 1 },
    { name: "PhD Criminal Law", count: 1 },
    { name: "PhD Cyber Law", count: 1 },
    { name: "PhD Defence Studies", count: 1 },
    { name: "PhD Digital Communication", count: 1 },
    { name: "PhD Drug Regulatory Affairs", count: 1 },
    { name: "PhD Economics and Finance", count: 1 },
    { name: "PhD Education Management", count: 1 },
    { name: "PhD Energy Technology", count: 1 },
    { name: "PhD Engineering Design", count: 1 },
    { name: "PhD Engineering Physics", count: 1 },
    { name: "PhD Engineering Science", count: 1 },
    { name: "PhD Ent", count: 1 },
    { name: "PhD Environmental Management", count: 1 },
    { name: "PhD Ethics", count: 1 },
    { name: "PhD European Studies", count: 1 },
    { name: "PhD Fire Engineering", count: 1 },
    { name: "PhD Food Processing Technology", count: 1 },
    { name: "PhD Food Service Management", count: 1 },
    { name: "PhD Gastroenterology", count: 1 },
    { name: "PhD Geographic Information Systems", count: 1 },
    { name: "PhD Green Technology", count: 1 },
    { name: "PhD Health Management", count: 1 },
    { name: "PhD Human Nutrition", count: 1 },
    { name: "PhD Human Science", count: 1 },
    { name: "PhD Hydrology", count: 1 },
    { name: "PhD Imaging Technology", count: 1 },
    { name: "PhD Information Management", count: 1 },
    { name: "PhD Insurance Law", count: 1 },
    { name: "PhD International Trade", count: 1 },
    { name: "PhD Japanese", count: 1 },
    { name: "PhD Konkani", count: 1 },
    { name: "PhD Labour Welfare", count: 1 },
    { name: "PhD Machine Design", count: 1 },
    { name: "PhD Magadhi", count: 1 },
    { name: "PhD Maintenance Engineering", count: 1 },
    { name: "PhD Marketing Management", count: 1 },
    { name: "PhD Mass Media", count: 1 },
    { name: "PhD Mechatronics", count: 1 },
    { name: "PhD Media Management", count: 1 },
    { name: "PhD Media Science", count: 1 },
    { name: "PhD Medical Biotechnology", count: 1 },
    { name: "PhD Medical Informatics", count: 1 },
    { name: "PhD Medical Laboratory Technology", count: 1 },
    { name: "PhD Medical Pharmacology", count: 1 },
    { name: "PhD Medical Physiology", count: 1 },
    { name: "PhD Medical Technology", count: 1 },
    { name: "PhD Meditation", count: 1 },
    { name: "PhD Multimedia Technology", count: 1 },
    { name: "PhD Nautical Science", count: 1 },
    { name: "PhD Nepali", count: 1 },
    { name: "PhD Networking", count: 1 },
    { name: "PhD Nuclear Engineering", count: 1 },
    { name: "PhD Nuclear Medicine", count: 1 },
    { name: "PhD Ocean Engineering", count: 1 },
    { name: "PhD Oceanography", count: 1 },
    { name: "PhD Oncology", count: 1 },
    { name: "PhD Organizational Behaviour", count: 1 },
    { name: "PhD Pedodontics", count: 1 },
    { name: "PhD Pharmaceutical Management", count: 1 },
    { name: "PhD Physical Therapy", count: 1 },
    { name: "PhD Plant Protection", count: 1 },
    { name: "PhD Plastic Engineering", count: 1 },
    { name: "PhD Project Management", count: 1 },
    { name: "PhD Public Relations", count: 1 },
    { name: "PhD Regional Development", count: 1 },
    { name: "PhD Retail Management", count: 1 },
    { name: "PhD School Management", count: 1 },
    { name: "PhD Social Development", count: 1 },
    { name: "PhD Social Welfare", count: 1 },
    { name: "PhD Sports Management", count: 1 },
    { name: "PhD Taxation", count: 1 },
    { name: "PhD Tourism Management", count: 1 },
    { name: "PhD Visual Media", count: 1 },
    { name: "PhD Water Conservation", count: 1 },
    { name: "Executive MBA Anaesthesia", count: 1 },
    { name: "Executive MBA Banking And Finance", count: 1 },
    { name: "Executive MBA Bioinformatics", count: 1 },
    { name: "Executive MBA Clinical Research", count: 1 },
    { name: "Executive MBA Computer Science", count: 1 },
    { name: "Executive MBA Data Analytics", count: 1 },
    { name: "Executive MBA Data Science", count: 1 },
    { name: "Executive MBA Dental Surgery", count: 1 },
    { name: "Executive MBA Education Management", count: 1 },
    { name: "Executive MBA Epidemiology", count: 1 },
    { name: "Executive MBA Financial Services", count: 1 },
    { name: "Executive MBA Foreign Trade", count: 1 },
    { name: "Executive MBA French", count: 1 },
    { name: "Executive MBA Gastroenterology", count: 1 },
    { name: "Executive MBA Genetics", count: 1 },
    { name: "Executive MBA Implantology", count: 1 },
    { name: "Executive MBA Industrial Safety", count: 1 },
    { name: "Executive MBA Insurance Management", count: 1 },
    { name: "Executive MBA Interior Design", count: 1 },
    { name: "Executive MBA Journalism", count: 1 },
    { name: "Executive MBA Mass Communication", count: 1 },
    { name: "Executive MBA Nephrology", count: 1 },
    { name: "Executive MBA Nursing", count: 1 },
    { name: "Executive MBA Occupational Health", count: 1 },
    { name: "Executive MBA Pathology", count: 1 },
    { name: "Executive MBA Pharmaceutical Sciences", count: 1 },
    { name: "Executive MBA Physiology", count: 1 },
    { name: "Executive MBA Power Management", count: 1 },
    { name: "Executive MBA Prosthodontics", count: 1 },
    { name: "Executive MBA Public Administration", count: 1 },
    { name: "Executive MBA Public Health", count: 1 },
    { name: "Executive MBA Quality Management", count: 1 },
    { name: "Executive MBA Rural Management", count: 1 },
    { name: "Executive MBA Sales Management", count: 1 },
    { name: "Executive MBA Strategic Management", count: 1 },
    { name: "Executive MBA Taxation", count: 1 },
    { name: "Executive MBA Technology Management", count: 1 },
    { name: "Executive MBA Tourism", count: 1 },
    { name: "Executive MBA Travel And Tourism", count: 1 },
    { name: "Executive Program Artificial Intelligence", count: 1 },
    { name: "Executive Program Business Administration", count: 1 },
    { name: "Executive Program Business Intelligence", count: 1 },
    { name: "Executive Program Business Law", count: 1 },
    { name: "Executive Program Data Analytics Hons", count: 1 },
    { name: "Executive Program Digital Marketing", count: 1 },
    { name: "Executive Program Financial Analysis", count: 1 },
    { name: "Executive Program Financial Management", count: 1 },
    { name: "Executive Program Healthcare Management", count: 1 },
    { name: "Executive Program International Trade", count: 1 },
    { name: "Executive Program Journalism", count: 1 },
    { name: "Executive Program Machine Learning", count: 1 },
    { name: "Executive Program Marketing Management", count: 1 },
    { name: "Executive Program Portfolio Management", count: 1 },
    { name: "Executive Program Sales Management", count: 1 },
    { name: "Executive Program Strategic Management", count: 1 },
    { name: "LLB Business Law", count: 1 },
    { name: "LLB Business Management", count: 1 },
    { name: "LLM English", count: 1 },
    { name: "LLM Gender Studies", count: 1 },
    { name: "LLM Jurisprudence", count: 1 },
    { name: "MA Business Management", count: 1 },
    { name: "MA Career Counselling", count: 1 },
    { name: "MA Child Development", count: 1 },
    { name: "MA Christianity", count: 1 },
    { name: "MA Cinematography", count: 1 },
    { name: "MA Communication for Development", count: 1 },
    { name: "MA Communications", count: 1 },
    { name: "MA Community Development", count: 1 },
    { name: "MA Conservation", count: 1 },
    { name: "MA Costume Design", count: 1 },
    { name: "MA Criminal Law", count: 1 },
    { name: "MA Dispute Resolution", count: 1 },
    { name: "MA Early Childhood Care and Education", count: 1 },
    { name: "MA Earth Science", count: 1 },
    { name: "MA Education Management", count: 1 },
    { name: "MA Electronics", count: 1 },
    { name: "MA Elementary Education", count: 1 },
    { name: "MA Ent", count: 1 },
    { name: "MA Environmental Management", count: 1 },
    { name: "MA Foreign Languages", count: 1 },
    { name: "MA Health Sciences", count: 1 },
    { name: "MA Hindi Hons", count: 1 },
    { name: "MA Hindi Literature", count: 1 },
    { name: "MA Home Science Hons", count: 1 },
    { name: "MA Hospital Administration", count: 1 },
    { name: "MA Hospital Management", count: 1 },
    { name: "MA Hospitality Management Hons", count: 1 },
    { name: "MA Humanities", count: 1 },
    { name: "MA Kokborok", count: 1 },
    { name: "MA Konkani", count: 1 },
    { name: "MA Labour Management", count: 1 },
    { name: "MA Labour Welfare", count: 1 },
    { name: "MA Landscape Architecture", count: 1 },
    { name: "MA Laser Technology", count: 1 },
    { name: "MA Life Science", count: 1 },
    { name: "MA Magadhi", count: 1 },
    { name: "MA Management Studies", count: 1 },
    { name: "MA Mathematics Hons", count: 1 },
    { name: "MA Media Communication", count: 1 },
    { name: "MA Mental Health", count: 1 },
    { name: "MA Merchandising", count: 1 },
    { name: "MA Philosophy Hons", count: 1 },
    { name: "MA Politics Hons", count: 1 },
    { name: "MA Production Management", count: 1 },
    { name: "MA Psychotherapy", count: 1 },
    { name: "MA Public Policy Hons", count: 1 },
    { name: "MA Punjabi Hons", count: 1 },
    { name: "MA Risk Management", count: 1 },
    { name: "MA Sanskrit Hons", count: 1 },
    { name: "MA Script Writing", count: 1 },
    { name: "MA Social Studies", count: 1 },
    { name: "MA Social Welfare", count: 1 },
    { name: "MA Sociology Hons", count: 1 },
    { name: "MA Statistics Hons", count: 1 },
    { name: "MA Theatre Arts", count: 1 },
    { name: "MA Tourism Management", count: 1 },
    { name: "MA Transport Management", count: 1 },
    { name: "MA Value Education", count: 1 },
    { name: "MA Video Editing", count: 1 },
    { name: "MA Visual Communication", count: 1 },
    { name: "MA Vocal Music", count: 1 },
    { name: "MA Women Empowerment", count: 1 },
    { name: "M.Arch History", count: 1 },
    { name: "M.Arch Industrial Design", count: 1 },
    { name: "MID Architectural Design", count: 1 },
    { name: "MAEP Applied Economics", count: 1 },
    { name: "MBM Aviation Management", count: 1 },
    { name: "MBM Banking", count: 1 },
    { name: "MBM Business Analytics", count: 1 },
    { name: "MBM Hr", count: 1 },
    { name: "MEM Anatomy", count: 1 },
    { name: "MEM Cardiology", count: 1 },
    { name: "MEM Dermatology", count: 1 },
    { name: "MEM Emergency Medicine", count: 1 },
    { name: "MEM Ent", count: 1 },
    { name: "MEM Forensic Medicine", count: 1 },
    { name: "MEM General Medicine", count: 1 },
    { name: "MEM General Surgery", count: 1 },
    { name: "MEM Microbiology", count: 1 },
    { name: "MEM Ophthalmology", count: 1 },
    { name: "MEM Pathology", count: 1 },
    { name: "MEM Pharmacology", count: 1 },
    { name: "MEM Physiology", count: 1 },
    { name: "MEM Psychiatry", count: 1 },
    { name: "MEM Engineering Management", count: 1 },
    { name: "MGB Finance", count: 1 },
    { name: "MGB Logistics And Supply Chain Management", count: 1 },
    { name: "MGB Marketing Management", count: 1 },
    { name: "MIRM Risk Management", count: 1 },
    { name: "Master of Musicology Music", count: 1 },
    { name: "MOT Neurology", count: 1 },
    { name: "MOT Orthopaedics", count: 1 },
    { name: "MSPT Sports Physiotherapy Hons", count: 1 },
    { name: "MPO Prosthetic", count: 1 },
    { name: "MSpED Special Education", count: 1 },
    { name: "MText Chemistry", count: 1 },
    { name: "MText Textile Design", count: 1 },
    { name: "MSc in GIS and Remote Sensing Information System", count: 1 },
    { name: "MBA Actuarial Science", count: 1 },
    { name: "MBA Big Data", count: 1 },
    { name: "MBA Business Law", count: 1 },
    { name: "MBA Co-Operative Management", count: 1 },
    { name: "MBA Computer Application", count: 1 },
    { name: "MBA Computer Science", count: 1 },
    { name: "MBA Consumer Behaviour", count: 1 },
    { name: "MBA Digital Communication", count: 1 },
    { name: "MBA Education Technology", count: 1 },
    { name: "MBA Educational Management", count: 1 },
    { name: "MBA Engineering Management", count: 1 },
    { name: "MBA Fashion Technology", count: 1 },
    { name: "MBA Forensic Science", count: 1 },
    { name: "MBA Geoinformatics", count: 1 },
    { name: "MBA German", count: 1 },
    { name: "MBA Global Management", count: 1 },
    { name: "MBA Graphic Designing", count: 1 },
    { name: "MBA Industrial Relation", count: 1 },
    { name: "MBA Information Security", count: 1 },
    { name: "MBA Innovation Management", count: 1 },
    { name: "MBA International Relations", count: 1 },
    { name: "MBA International Trade", count: 1 },
    { name: "MBA Labour Welfare", count: 1 },
    { name: "MBA Media Science", count: 1 },
    { name: "MBA Networking", count: 1 },
    { name: "MBA Public Administration", count: 1 },
    { name: "MBA Public Enterprise", count: 1 },
    { name: "MBA Resource Management", count: 1 },
    { name: "MBA Restaurant Management", count: 1 },
    { name: "MBA Retailing", count: 1 },
    { name: "MBA Social Work", count: 1 },
    { name: "MBA Tour And Travel Management", count: 1 },
    { name: "MBA Transport Management", count: 1 },
    { name: "MBA Wealth Management", count: 1 },
    { name: "MBBS Ayurveda", count: 1 },
    { name: "MBBS Chemistry", count: 1 },
    { name: "MBBS Laryngology", count: 1 },
    { name: "MBBS Radiodiagnosis", count: 1 },
    { name: "MBBS Respiratory Diseases", count: 1 },
    { name: "MCA Advanced Computing", count: 1 },
    { name: "MCA Banking", count: 1 },
    { name: "MCA Business Intelligence", count: 1 },
    { name: "MCA Computer Application Hons", count: 1 },
    { name: "MCA Data Analytics", count: 1 },
    { name: "MCA Data Mining", count: 1 },
    { name: "MCA Data Science Hons", count: 1 },
    { name: "MCA Digital Marketing", count: 1 },
    { name: "MCA Embedded Systems", count: 1 },
    { name: "MCA Game Design", count: 1 },
    { name: "MCA Gaming Technology", count: 1 },
    { name: "MCA Information Management", count: 1 },
    { name: "MCA Scientific Computing", count: 1 },
    { name: "MCA Social Work", count: 1 },
    { name: "MCA Software System", count: 1 },
    { name: "MCA Systems Management", count: 1 },
    { name: "Master of Chirurgiae [M.Ch] Anatomy", count: 1 },
    { name: "Master of Chirurgiae [M.Ch] Ecology", count: 1 },
    { name: "Master of Chirurgiae [M.Ch] General Surgery", count: 1 },
    { name: "Master of Chirurgiae [M.Ch] Immunology", count: 1 },
    { name: "Master of Chirurgiae [M.Ch] Spine Surgery", count: 1 },
    { name: "M.Com Actuarial Science", count: 1 },
    { name: "M.Com Applied Economics", count: 1 },
    { name: "M.Com Chemical Technology", count: 1 },
    { name: "M.Com Chemistry", count: 1 },
    { name: "M.Com Co Operation", count: 1 },
    { name: "M.Com Data Science", count: 1 },
    { name: "M.Com English", count: 1 },
    { name: "M.Com Environmental Science", count: 1 },
    { name: "M.Com Finance and Accounting Hons", count: 1 },
    { name: "M.Com Finance Hons", count: 1 },
    { name: "M.Com History", count: 1 },
    { name: "M.Com Information Science", count: 1 },
    { name: "M.Com International Accounting", count: 1 },
    { name: "M.Com International Business Hons", count: 1 },
    { name: "M.Com International Trade", count: 1 },
    { name: "M.Com International Trade Hons", count: 1 },
    { name: "M.Com Marketing Hons", count: 1 },
    { name: "M.Com Marketing Management", count: 1 },
    { name: "M.Com Mathematics", count: 1 },
    { name: "M.Com Organizational Behaviour", count: 1 },
    { name: "M.Com Physics", count: 1 },
    { name: "M.Com Political Science", count: 1 },
    { name: "M.Com Risk Management", count: 1 },
    { name: "M.Com Sanskrit", count: 1 },
    { name: "MD Biophysics", count: 1 },
    { name: "MD Child Health", count: 1 },
    { name: "MD Dental Surgery", count: 1 },
    { name: "MD Imaging Technology", count: 1 },
    { name: "MD Medical Sciences", count: 1 },
    { name: "MD Nutrition", count: 1 },
    { name: "MD Oncology", count: 1 },
    { name: "MD Otology", count: 1 },
    { name: "MD Phychiatry", count: 1 },
    { name: "MD Rheumatology", count: 1 },
    { name: "MD Venereal Diseases", count: 1 },
    { name: "M.Des 3D Animation", count: 1 },
    { name: "M.Des Brand Management", count: 1 },
    { name: "M.Des Cinematography", count: 1 },
    { name: "M.Des Entrepreneurship", count: 1 },
    { name: "M.Des Information Design", count: 1 },
    { name: "M.Des Marketing", count: 1 },
    { name: "M.Des Production Management", count: 1 },
    { name: "M.Des Urban Design", count: 1 },
    { name: "ME Architecture Engineering", count: 1 },
    { name: "ME Big Data Analytics", count: 1 },
    { name: "ME Bioinformatics", count: 1 },
    { name: "ME Clinical Pharmacy", count: 1 },
    { name: "ME Control Engineering", count: 1 },
    { name: "ME Data Analytics", count: 1 },
    { name: "ME Digital Electronics And Communication Systems", count: 1 },
    { name: "ME Digital Techniques", count: 1 },
    { name: "ME Earth Science", count: 1 },
    { name: "ME Food Processing Technology", count: 1 },
    { name: "ME Geoinformatics", count: 1 },
    { name: "ME Hydrology", count: 1 },
    { name: "ME Maintenance Engineering", count: 1 },
    { name: "ME Manufacturing Science And Engineering", count: 1 },
    { name: "ME Medical Electronics", count: 1 },
    { name: "ME Microwave Engineering", count: 1 },
    { name: "ME Mining Engineering", count: 1 },
    { name: "ME Nanotechnology", count: 1 },
    { name: "ME Petroleum Engineering", count: 1 },
    { name: "ME Power Management", count: 1 },
    { name: "ME Production Management", count: 1 },
    { name: "ME Public Health", count: 1 },
    { name: "ME Remote Sensing", count: 1 },
    { name: "ME Software System", count: 1 },
    { name: "ME Technology Engineering", count: 1 },
    { name: "ME Tool Engineering", count: 1 },
    { name: "M.Ed Computer Education", count: 1 },
    { name: "M.Ed Economics", count: 1 },
    { name: "M.Ed Fine Arts", count: 1 },
    { name: "M.Ed Geography", count: 1 },
    { name: "M.Ed Hindi", count: 1 },
    { name: "M.Ed History", count: 1 },
    { name: "M.Ed Home Science", count: 1 },
    { name: "M.Ed Mental Retardation", count: 1 },
    { name: "M.Ed Music", count: 1 },
    { name: "M.Ed Political Science", count: 1 },
    { name: "M.Ed Psychology", count: 1 },
    { name: "M.Ed Public Administration", count: 1 },
    { name: "M.Ed Punjabi", count: 1 },
    { name: "M.Ed Social Studies", count: 1 },
    { name: "M.Ed Statistics", count: 1 },
    { name: "MFA Accounting", count: 1 },
    { name: "MFA English", count: 1 },
    { name: "MFA Fashion Design", count: 1 },
    { name: "MFA Finance and Accounting", count: 1 },
    { name: "MFA Financial Management", count: 1 },
    { name: "MFA Marketing", count: 1 },
    { name: "MFA Music", count: 1 },
    { name: "MFM Fashion Technology", count: 1 },
    { name: "MFM Finance Management", count: 1 },
    { name: "M.F.Sc Food Safety", count: 1 },
    { name: "M.F.Sc Food Science Hons", count: 1 },
    { name: "M.F.Sc Genetics", count: 1 },
    { name: "M.F.Sc Pathology", count: 1 },
    { name: "M.F.Sc Quality Assurance", count: 1 },
    { name: "MHM Hospitality", count: 1 },
    { name: "MJMC Cinematography", count: 1 },
    { name: "MJMC Film Making", count: 1 },
    { name: "MLT Biochemistry", count: 1 },
    { name: "MMLS Biochemistry", count: 1 },
    { name: "MMLS Medical Microbiology", count: 1 },
    { name: "MMS Business Analytics", count: 1 },
    { name: "MMS Information Technology", count: 1 },
    { name: "MMS Pharmaceutical Management", count: 1 },
    { name: "MMS Project Management", count: 1 },
    { name: "MMS Supply Chain Management", count: 1 },
    { name: "MMS Tourism", count: 1 },
    { name: "MPA Folk Dance", count: 1 },
    { name: "MPA Kuchipudi", count: 1 },
    { name: "MPA Theatre Arts", count: 1 },
    { name: "MPH Community Medicine", count: 1 },
    { name: "MPH Economics", count: 1 },
    { name: "MPH Environmental Health", count: 1 },
    { name: "MPH Health Management", count: 1 },
    { name: "MPH Maternal and Child Health", count: 1 },
    { name: "MPH Occupational Health", count: 1 },
    { name: "M.Pharm Energy Technology", count: 1 },
    { name: "M.Pharm Healthcare Management", count: 1 },
    { name: "M.Pharm Insurance", count: 1 },
    { name: "M.Phil Agricultural Engineering", count: 1 },
    { name: "M.Phil Analytical Chemistry", count: 1 },
    { name: "M.Phil Anthropology", count: 1 },
    { name: "M.Phil Applied Arts", count: 1 },
    { name: "M.Phil Applied Electronics", count: 1 },
    { name: "M.Phil Archaeology", count: 1 },
    { name: "M.Phil Automobile Engineering", count: 1 },
    { name: "M.Phil Ayurveda", count: 1 },
    { name: "M.Phil Cad Cam", count: 1 },
    { name: "M.Phil Chinese", count: 1 },
    { name: "M.Phil Computational Biology", count: 1 },
    { name: "M.Phil Computational Linguistics", count: 1 },
    { name: "M.Phil Development Administration", count: 1 },
    { name: "M.Phil Ecology", count: 1 },
    { name: "M.Phil Electrical And Electronics Engineering", count: 1 },
    { name: "M.Phil Electrical Engineering", count: 1 },
    { name: "M.Phil Endocrinology", count: 1 },
    { name: "M.Phil Environmental Engineering", count: 1 },
    { name: "M.Phil European Studies", count: 1 },
    { name: "M.Phil Fisheries", count: 1 },
    { name: "M.Phil Food Science And Technology", count: 1 },
    { name: "M.Phil Food Technology", count: 1 },
    { name: "M.Phil Instrumentation Engineering", count: 1 },
    { name: "M.Phil Insurance Law", count: 1 },
    { name: "M.Phil International Trade", count: 1 },
    { name: "M.Phil Islamic Studies", count: 1 },
    { name: "M.Phil Italian", count: 1 },
    { name: "M.Phil Japanese", count: 1 },
    { name: "M.Phil Labour Welfare", count: 1 },
    { name: "M.Phil Leadership", count: 1 },
    { name: "M.Phil Library and Information Science", count: 1 },
    { name: "M.Phil Library Science", count: 1 },
    { name: "M.Phil Magadhi", count: 1 },
    { name: "M.Phil Malayalam", count: 1 },
    { name: "M.Phil Marine Engineering", count: 1 },
    { name: "M.Phil Mass Communication", count: 1 },
    { name: "M.Phil Material Science", count: 1 },
    { name: "M.Phil Medical Technology", count: 1 },
    { name: "M.Phil Meteorology", count: 1 },
    { name: "M.Phil Mining Engineering", count: 1 },
    { name: "M.Phil Nanotechnology", count: 1 },
    { name: "M.Phil Petroleum Engineering", count: 1 },
    { name: "M.Phil Pharmacognosy", count: 1 },
    { name: "M.Phil Pharmacology", count: 1 },
    { name: "M.Phil Physiology", count: 1 },
    { name: "M.Phil Plant Protection", count: 1 },
    { name: "M.Phil Politics", count: 1 },
    { name: "M.Phil Polymer Science", count: 1 },
    { name: "M.Phil Public Health", count: 1 },
    { name: "M.Phil Quality Assurance", count: 1 },
    { name: "M.Phil Remote Sensing", count: 1 },
    { name: "M.Phil Resource Management", count: 1 },
    { name: "M.Phil Sanskrit", count: 1 },
    { name: "M.Phil Social Justice", count: 1 },
    { name: "M.Phil Social Science", count: 1 },
    { name: "M.Phil Social Studies", count: 1 },
    { name: "M.Phil Social Welfare", count: 1 },
    { name: "M.Phil Statistics", count: 1 },
    { name: "M.Phil Sugar Technology", count: 1 },
    { name: "M.Phil Systems Management", count: 1 },
    { name: "M.Phil Textile Engineering", count: 1 },
    { name: "M.Phil Toxicology", count: 1 },
    { name: "M.Phil Urdu", count: 1 },
    { name: "M.Phil Urology", count: 1 },
    { name: "M.Phil Visual Communication", count: 1 },
    { name: "M.Phil Yoga", count: 1 },
    { name: "M.Plan Urban Design", count: 1 },
    { name: "MPT Cardio Vascular", count: 1 },
    { name: "MPT Physical Therapy", count: 1 },
    { name: "M.S Applied Economics", count: 1 },
    { name: "M.S Artificial Intelligence", count: 1 },
    { name: "M.S Biophysics", count: 1 },
    { name: "M.S Biotech", count: 1 },
    { name: "M.S Business Administration", count: 1 },
    { name: "M.S Business Management", count: 1 },
    { name: "M.S Computer Application", count: 1 },
    { name: "M.S Dental Surgery", count: 1 },
    { name: "M.S Economics", count: 1 },
    { name: "M.S Gastroenterology", count: 1 },
    { name: "M.S Implantology", count: 1 },
    { name: "M.S Information Technology", count: 1 },
    { name: "M.S Merchandising", count: 1 },
    { name: "M.S Plastic Surgery", count: 1 },
    { name: "M.S Radiodiagnosis", count: 1 },
    { name: "M.S Radiotherapy", count: 1 },
    { name: "M.S Social Medicine", count: 1 },
    { name: "M.S Thoracic Surgery", count: 1 },
    { name: "MSc Acting", count: 1 },
    { name: "MSc Aerospace Engineering", count: 1 },
    { name: "MSc Agribusiness", count: 1 },
    { name: "MSc Agronomy Hons", count: 1 },
    { name: "MSc Allied Health Science", count: 1 },
    { name: "MSc Alternate Medicine", count: 1 },
    { name: "MSc Apiculture", count: 1 },
    { name: "MSc Applied Arts", count: 1 },
    { name: "MSc Applied Economics", count: 1 },
    { name: "MSc Astrology", count: 1 },
    { name: "MSc Aviation", count: 1 },
    { name: "MSc Aviation Management", count: 1 },
    { name: "MSc Banking And Finance", count: 1 },
    { name: "MSc Bioethics", count: 1 },
    { name: "MSc Bioinformatics Hons", count: 1 },
    { name: "MSc Biomechanics", count: 1 },
    { name: "MSc Blood Bank", count: 1 },
    { name: "MSc Brand Management", count: 1 },
    { name: "MSc Business Administration", count: 1 },
    { name: "MSc Business Intelligence", count: 1 },
    { name: "MSc Chemical Technology", count: 1 },
    { name: "MSc Cheminformatics", count: 1 },
    { name: "MSc Chinese", count: 1 },
    { name: "MSc Cinematography", count: 1 },
    { name: "MSc Co-Operative Management", count: 1 },
    { name: "MSc Computational Linguistics", count: 1 },
    { name: "MSc Computer Engineering", count: 1 },
    { name: "MSc Control Engineering", count: 1 },
    { name: "MSc Digital Design", count: 1 },
    { name: "MSc Endocrinology", count: 1 },
    { name: "MSc Engineering Physics", count: 1 },
    { name: "MSc Ent", count: 1 },
    { name: "MSc Environmental Health", count: 1 },
    { name: "MSc Environmental Planning", count: 1 },
    { name: "MSc Environmental Science Hons", count: 1 },
    { name: "MSc Export Management", count: 1 },
    { name: "MSc Fashion Communication", count: 1 },
    { name: "MSc Fashion Management", count: 1 },
    { name: "MSc Food Biotechnology", count: 1 },
    { name: "MSc Food Science Hons", count: 1 },
    { name: "MSc Foreign Trade", count: 1 },
    { name: "MSc Furniture Design", count: 1 },
    { name: "MSc Gemology", count: 1 },
    { name: "MSc Genetics Hons", count: 1 },
    { name: "MSc Geology Hons", count: 1 },
    { name: "MSc Green Technology", count: 1 },
    { name: "MSc Health Sciences", count: 1 },
    { name: "MSc Hindi", count: 1 },
    { name: "MSc Histopathology", count: 1 },
    { name: "MSc History", count: 1 },
    { name: "MSc Human Rights", count: 1 },
    { name: "MSc Human Science", count: 1 },
    { name: "MSc Hydrology", count: 1 },
    { name: "MSc Industrial Hygiene", count: 1 },
    { name: "MSc Industrial Pharmacy", count: 1 },
    { name: "MSc Information Management", count: 1 },
    { name: "MSc Infrastructure Management", count: 1 },
    { name: "MSc Leadership", count: 1 },
    { name: "MSc Management Science", count: 1 },
    { name: "MSc Management Studies", count: 1 },
    { name: "MSc Materials Management", count: 1 },
    { name: "MSc Medical Genetics", count: 1 },
    { name: "MSc Medical Informatics", count: 1 },
    { name: "MSc Medical Sciences", count: 1 },
    { name: "MSc Merchandising Management", count: 1 },
    { name: "MSc Mobile Application", count: 1 },
    { name: "MSc Mobile Technology", count: 1 },
    { name: "MSc Molecular Medicine Hons", count: 1 },
    { name: "MSc Natural Science", count: 1 },
    { name: "MSc Nautical Science", count: 1 },
    { name: "MSc Network Security", count: 1 },
    { name: "MSc Non Medical", count: 1 },
    { name: "MSc Operations Management", count: 1 },
    { name: "MSc Paediatrics", count: 1 },
    { name: "MSc Painting", count: 1 },
    { name: "MSc Pharmaceutical Sciences", count: 1 },
    { name: "MSc Physical Therapy", count: 1 },
    { name: "MSc Plant Tissue Culture", count: 1 },
    { name: "MSc Plastic Surgery", count: 1 },
    { name: "MSc Political Science", count: 1 },
    { name: "MSc Population Studies", count: 1 },
    { name: "MSc Production Engineering", count: 1 },
    { name: "MSc Production Management", count: 1 },
    { name: "MSc Prosthetic", count: 1 },
    { name: "MSc Quality Control", count: 1 },
    { name: "MSc Renal Dialysis Technology", count: 1 },
    { name: "MSc Retail Management", count: 1 },
    { name: "MSc Scientific Computing", count: 1 },
    { name: "MSc Social Science", count: 1 },
    { name: "MSc Soil Conservation", count: 1 },
    { name: "MSc Speech Therapy", count: 1 },
    { name: "MSc Strategic Management", count: 1 },
    { name: "MSc System Administration", count: 1 },
    { name: "MSc Vedic Science", count: 1 },
    { name: "MSc Waste Management", count: 1 },
    { name: "MSc Water Conservation", count: 1 },
    { name: "MSW Industrial Relation", count: 1 },
    { name: "MSW Labour Welfare", count: 1 },
    { name: "MTech Advanced Computing", count: 1 },
    { name: "MTech Agriculture", count: 1 },
    { name: "MTech Applied Mechanics", count: 1 },
    { name: "MTech Architecture Engineering", count: 1 },
    { name: "MTech Astronomy", count: 1 },
    { name: "MTech Bioelectronics", count: 1 },
    { name: "MTech Biotech Engineering", count: 1 },
    { name: "MTech Botany", count: 1 },
    { name: "MTech Business Administration", count: 1 },
    { name: "MTech Business Analytics", count: 1 },
    { name: "MTech Ceramics", count: 1 },
    { name: "MTech Chemical Analysis", count: 1 },
    { name: "MTech Cheminformatics", count: 1 },
    { name: "MTech Computational Mechanics", count: 1 },
    { name: "MTech Computer Aided Manufacturing", count: 1 },
    { name: "MTech Conservation", count: 1 },
    { name: "MTech Dance", count: 1 },
    { name: "MTech Data Mining", count: 1 },
    { name: "MTech DevOps", count: 1 },
    { name: "MTech Economics", count: 1 },
    { name: "MTech Environmental Health", count: 1 },
    { name: "MTech Fashion Technology", count: 1 },
    { name: "MTech Fisheries", count: 1 },
    { name: "MTech Food Biotechnology", count: 1 },
    { name: "MTech Health and Environment", count: 1 },
    { name: "MTech Hr", count: 1 },
    { name: "MTech Humanities", count: 1 },
    { name: "MTech Hydraulic Engineering", count: 1 },
    { name: "MTech Infrastructure Management", count: 1 },
    { name: "MTech Laser Technology", count: 1 },
    { name: "MTech Maths", count: 1 },
    { name: "MTech Mobile Technology", count: 1 },
    { name: "MTech Molecular Medicine", count: 1 },
    { name: "MTech Multimedia Technology", count: 1 },
    { name: "MTech Network Security", count: 1 },
    { name: "MTech Neuroscience", count: 1 },
    { name: "MTech Occupational Health", count: 1 },
    { name: "MTech Operations Management", count: 1 },
    { name: "MTech Petrochemical Engineering", count: 1 },
    { name: "MTech Process Design", count: 1 },
    { name: "MTech Quality Management", count: 1 },
    { name: "MTech Resource Management", count: 1 },
    { name: "MTech Safety Management", count: 1 },
    { name: "MTech Ship Building", count: 1 },
    { name: "MTech Sound Engineering", count: 1 },
    { name: "MTech Statistics", count: 1 },
    { name: "MTech Supply Chain Management", count: 1 },
    { name: "MTech Telecommunication Engineering", count: 1 },
    { name: "M.Th Christianity", count: 1 },
    { name: "M.Th Theology Hons", count: 1 },
    { name: "MTM Hospitality and Tourism Management", count: 1 },
    { name: "MVA Fashion Design", count: 1 },
    { name: "MVA Museology", count: 1 },
    { name: "M.Voc 3D Animation", count: 1 },
    { name: "M.Voc Electronics", count: 1 },
    { name: "M.Voc Embedded Systems", count: 1 },
    { name: "M.Voc Food Technology Engineering", count: 1 },
    { name: "M.Voc Journalism", count: 1 },
    { name: "M.Voc Logistics Management", count: 1 },
    { name: "M.Voc Medical Laboratory Technology", count: 1 },
    { name: "M.Voc Mobile Technology", count: 1 },
    { name: "M.Voc Power Management", count: 1 },
    { name: "M.Voc Renewable Energy", count: 1 },
    { name: "M.Voc Supply Chain Management", count: 1 },
    { name: "M.Voc Tourism", count: 1 },
    { name: "M.V.Sc Immunology", count: 1 },
    { name: "M.V.Sc Statistics", count: 1 },
    { name: "PGD Accounting And Finance", count: 1 },
    { name: "PGD Acupressure", count: 1 },
    { name: "PGD Agribusiness", count: 1 },
    { name: "PGD Airport Management", count: 1 },
    { name: "PGD Anaesthesia Technology", count: 1 },
    { name: "PGD Applied Linguistics", count: 1 },
    { name: "PGD Applied Psychology", count: 1 },
    { name: "PGD Applied Statistics", count: 1 },
    { name: "PGD Architecture Engineering", count: 1 },
    { name: "PGD Bakery", count: 1 },
    { name: "PGD Banking laws", count: 1 },
    { name: "PGD Bengali", count: 1 },
    { name: "PGD Big Data Analytics", count: 1 },
    { name: "PGD Biological Sciences", count: 1 },
    { name: "PGD Block Chain Technology", count: 1 },
    { name: "PGD Chemo Informatics", count: 1 },
    { name: "PGD Child Development", count: 1 },
    { name: "PGD Chinese", count: 1 },
    { name: "PGD Clinical Pharmacy", count: 1 },
    { name: "PGD Co-Operative Management", count: 1 },
    { name: "PGD Cognitive Science", count: 1 },
    { name: "PGD Community Based Rehabilitation", count: 1 },
    { name: "PGD Computer Education", count: 1 },
    { name: "PGD Computer Maintenance", count: 1 },
    { name: "PGD Computer Management", count: 1 },
    { name: "PGD Computer Science Engineering", count: 1 },
    { name: "PGD Conflict Management", count: 1 },
    { name: "PGD Conservative Dentistry", count: 1 },
    { name: "PGD Construction Management", count: 1 },
    { name: "PGD Corporate Secretaryship", count: 1 },
    { name: "PGD Dairy Technology", count: 1 },
    { name: "PGD Data Mining", count: 1 },
    { name: "PGD Development Studies", count: 1 },
    { name: "PGD Digital Video", count: 1 },
    { name: "PGD Disaster Nursing", count: 1 },
    { name: "PGD Emergency Medical Services", count: 1 },
    { name: "PGD Engineering Design", count: 1 },
    { name: "PGD Engineering Management", count: 1 },
    { name: "PGD Environmental Economics", count: 1 },
    { name: "PGD Environmental Engineering", count: 1 },
    { name: "PGD Environmental Impact Assessment", count: 1 },
    { name: "PGD Environmental Science", count: 1 },
    { name: "PGD Epidemiology", count: 1 },
    { name: "PGD European Studies", count: 1 },
    { name: "PGD Exercise Therapy", count: 1 },
    { name: "PGD Export Marketing", count: 1 },
    { name: "PGD Fashion Illustration", count: 1 },
    { name: "PGD Fashion Management", count: 1 },
    { name: "PGD Financial System", count: 1 },
    { name: "PGD Fine Arts", count: 1 },
    { name: "PGD Floriculture", count: 1 },
    { name: "PGD Folk Dance", count: 1 },
    { name: "PGD Food Science", count: 1 },
    { name: "PGD Food Service Management", count: 1 },
    { name: "PGD Forestry", count: 1 },
    { name: "PGD Gardening", count: 1 },
    { name: "PGD Gas Safety", count: 1 },
    { name: "PGD General Surgery", count: 1 },
    { name: "PGD Genetic Engineering", count: 1 },
    { name: "PGD Geography", count: 1 },
    { name: "PGD Geology", count: 1 },
    { name: "PGD Gerontology", count: 1 },
    { name: "PGD Global Financial Markets", count: 1 },
    { name: "PGD Haematology", count: 1 },
    { name: "PGD Humanities", count: 1 },
    { name: "PGD Hydrology", count: 1 },
    { name: "PGD Immunology", count: 1 },
    { name: "PGD Implantology", count: 1 },
    { name: "PGD Industrial Design", count: 1 },
    { name: "PGD Industrial Engineering And Management", count: 1 },
    { name: "PGD Industrial Marketing", count: 1 },
    { name: "PGD Innovation Management", count: 1 },
    { name: "PGD Inorganic Chemistry", count: 1 },
    { name: "PGD Interaction Design", count: 1 },
    { name: "PGD International Management", count: 1 },
    { name: "PGD International Marketing", count: 1 },
    { name: "PGD International Studies", count: 1 },
    { name: "PGD Jewelry Design", count: 1 },
    { name: "PGD Knitting", count: 1 },
    { name: "PGD Kokborok", count: 1 },
    { name: "PGD Labour Welfare", count: 1 },
    { name: "PGD Liberal Arts", count: 1 },
    { name: "PGD Life Science", count: 1 },
    { name: "PGD Literature", count: 1 },
    { name: "PGD Management Accounting", count: 1 },
    { name: "PGD Marathi", count: 1 },
    { name: "PGD Maritime Laws", count: 1 },
    { name: "PGD Massage", count: 1 },
    { name: "PGD Material Science", count: 1 },
    { name: "PGD Maternal and Child Health", count: 1 },
    { name: "PGD Media Communication", count: 1 },
    { name: "PGD Media Studies", count: 1 },
    { name: "PGD Medical Biotechnology", count: 1 },
    { name: "PGD Medical Genetics", count: 1 },
    { name: "PGD Medical Informatics", count: 1 },
    { name: "PGD Medical Law", count: 1 },
    { name: "PGD Medical Microbiology", count: 1 },
    { name: "PGD Medical Sciences", count: 1 },
    { name: "PGD Medicinal Plants", count: 1 },
    { name: "PGD Mercantile Law", count: 1 },
    { name: "PGD Molecular Biology", count: 1 },
    { name: "PGD Multimedia Design", count: 1 },
    { name: "PGD Nepali", count: 1 },
    { name: "PGD Nuclear Medicine", count: 1 },
    { name: "PGD Occupational Health", count: 1 },
    { name: "PGD Organic Chemistry", count: 1 },
    { name: "PGD Otology", count: 1 },
    { name: "PGD Painting", count: 1 },
    { name: "PGD Pattern Making", count: 1 },
    { name: "PGD Performing Arts", count: 1 },
    { name: "PGD Pharmaceutical Quality Assurance", count: 1 },
    { name: "PGD Pharmaceutics", count: 1 },
    { name: "PGD Physical Science", count: 1 },
    { name: "PGD Plant Protection", count: 1 },
    { name: "PGD Power Electronics", count: 1 },
    { name: "PGD Power Engineering", count: 1 },
    { name: "PGD Primary Education", count: 1 },
    { name: "PGD Process Engineering", count: 1 },
    { name: "PGD Prosthodontics", count: 1 },
    { name: "PGD Pulmonary Medicine", count: 1 },
    { name: "PGD Quality Control", count: 1 },
    { name: "PGD Radiography", count: 1 },
    { name: "PGD Regenerative Medicine", count: 1 },
    { name: "PGD Religious Studies", count: 1 },
    { name: "PGD Renal Dialysis Technology", count: 1 },
    { name: "PGD Retailing", count: 1 },
    { name: "PGD Russian", count: 1 },
    { name: "PGD School Administration", count: 1 },
    { name: "PGD Scientific Computing", count: 1 },
    { name: "PGD Screenwriting", count: 1 },
    { name: "PGD Script Writing", count: 1 },
    { name: "PGD Service Management", count: 1 },
    { name: "PGD Shipping", count: 1 },
    { name: "PGD Shipping Management", count: 1 },
    { name: "PGD Social Media", count: 1 },
    { name: "PGD Social Science", count: 1 },
    { name: "PGD Social Welfare Administration", count: 1 },
    { name: "PGD Software Application", count: 1 },
    { name: "PGD Talent Management", count: 1 },
    { name: "PGD Technology Management", count: 1 },
    { name: "PGD Telecommunication", count: 1 },
    { name: "PGD Telugu", count: 1 },
    { name: "PGD Textile Engineering", count: 1 },
    { name: "PGD Training and Development", count: 1 },
    { name: "PGD Transport Management", count: 1 },
    { name: "PGD Travel And Tourism", count: 1 },
    { name: "PGD Veterinary Science", count: 1 },
    { name: "PGD Video Editing", count: 1 },
    { name: "PGD Visual Arts", count: 1 },
    { name: "PGD Visual Communication", count: 1 },
    { name: "PGD Waste Management", count: 1 },
    { name: "PGD Water Resources Management", count: 1 },
    { name: "PGD Wealth Management", count: 1 },
    { name: "PGDM Advertising", count: 1 },
    { name: "PGDM Agribusiness Management", count: 1 },
    { name: "PGDM Aviation Management", count: 1 },
    { name: "PGDM Big Data Analytics", count: 1 },
    { name: "PGDM Biotech", count: 1 },
    { name: "PGDM Data Analytics", count: 1 },
    { name: "PGDM Digital Business", count: 1 },
    { name: "PGDM Economics", count: 1 },
    { name: "PGDM Energy Management", count: 1 },
    { name: "PGDM Insurance", count: 1 },
    { name: "PGDM International Management", count: 1 },
    { name: "PGDM Medical Laboratory Technology", count: 1 },
    { name: "PGDM Project Management", count: 1 },
    { name: "PGDM Risk Management", count: 1 },
    { name: "PGDM Rural Management", count: 1 },
    { name: "PGDM Sports Management", count: 1 },
    { name: "Pharm.D Medicine", count: 1 },
    { name: "Post Doctoral Cardio Vascular", count: 1 },
    { name: "Post Doctoral Chemistry", count: 1 },
    { name: "Post Doctoral Clinical Embryology", count: 1 },
    { name: "Post Doctoral Dentistry", count: 1 },
    { name: "Post Doctoral Ecology", count: 1 },
    { name: "Post Doctoral General Medicine", count: 1 },
    { name: "Post Doctoral Geriatric Medicine", count: 1 },
    { name: "Post Doctoral Hepatology", count: 1 },
    { name: "Post Doctoral Immunology", count: 1 },
    { name: "Post Doctoral Neonatology", count: 1 },
    { name: "Post Doctoral Neurology", count: 1 },
    { name: "Post Doctoral Neuroscience", count: 1 },
    { name: "Post Doctoral Nuclear Medicine", count: 1 },
    { name: "Post Doctoral Orthopaedics", count: 1 },
    { name: "Post Doctoral Plastic Surgery", count: 1 },
    { name: "Post Doctoral Prosthetic", count: 1 },
    { name: "Post Doctoral Radiodiagnosis", count: 1 },
    { name: "Post Doctoral Sanskrit", count: 1 },
    { name: "Post Doctoral Sleep Medicine", count: 1 },
    { name: "Post Doctoral Spine Surgery", count: 1 },
    { name: "Post Doctoral Thoracic Surgery", count: 1 },
    { name: "Post Doctoral Toxicology", count: 1 },
    { name: "PGC Adult Education", count: 1 },
    { name: "PGC Banking", count: 1 },
    { name: "PGC Big Data", count: 1 },
    { name: "PGC Big Data Analytics", count: 1 },
    { name: "PGC Cinematography", count: 1 },
    { name: "PGC Data Analytics", count: 1 },
    { name: "PGC Dentistry", count: 1 },
    { name: "PGC Embedded Systems", count: 1 },
    { name: "PGC Event Management", count: 1 },
    { name: "PGC Financial Market", count: 1 },
    { name: "PGC French", count: 1 },
    { name: "PGC Geoinformatics", count: 1 },
    { name: "PGC Hindi", count: 1 },
    { name: "PGC Hospital Administration", count: 1 },
    { name: "PGC Hospitality Management", count: 1 },
    { name: "PGC Implantology", count: 1 },
    { name: "PGC Industrial Safety", count: 1 },
    { name: "PGC Investment Banking", count: 1 },
    { name: "PGC Logistics And Supply Chain Management", count: 1 },
    { name: "PGC Logistics Management", count: 1 },
    { name: "PGC Management Accounting", count: 1 },
    { name: "PGC Nursing", count: 1 },
    { name: "PGC Persian", count: 1 },
    { name: "PGC Pharmacovigilance", count: 1 },
    { name: "PGC Product Management", count: 1 },
    { name: "PGC Quality Control", count: 1 },
    { name: "PGC Tourism Management", count: 1 },
    { name: "PGC Video Editing", count: 1 },
    { name: "PGC Women Studies", count: 1 },
    { name: "PGP Applied Arts", count: 1 },
    { name: "PGP Artificial Intelligence", count: 1 },
    { name: "PGP Banking And Finance", count: 1 },
    { name: "PGP Bengali", count: 1 },
    { name: "PGP Business Communication", count: 1 },
    { name: "PGP Chemistry", count: 1 },
    { name: "PGP Communication Design", count: 1 },
    { name: "PGP Consumer Behaviour", count: 1 },
    { name: "PGP Cyber Security", count: 1 },
    { name: "PGP Design management", count: 1 },
    { name: "PGP Digital Electronics And Communication Systems", count: 1 },
    { name: "PGP Energy Management", count: 1 },
    { name: "PGP English", count: 1 },
    { name: "PGP Fashion Communication", count: 1 },
    { name: "PGP Fashion Marketing", count: 1 },
    { name: "PGP Fashion Styling", count: 1 },
    { name: "PGP Finance and Accounting", count: 1 },
    { name: "PGP Financial Analysis", count: 1 },
    { name: "PGP Geography", count: 1 },
    { name: "PGP Hindi", count: 1 },
    { name: "PGP History", count: 1 },
    { name: "PGP Hospital Administration", count: 1 },
    { name: "PGP Hospitality", count: 1 },
    { name: "PGP Hotel Management", count: 1 },
    { name: "PGP Industrial Relation", count: 1 },
    { name: "PGP Interaction Design", count: 1 },
    { name: "PGP Interior Design", count: 1 },
    { name: "PGP Investment Banking", count: 1 },
    { name: "PGP Life Insurance", count: 1 },
    { name: "PGP Logistics Management", count: 1 },
    { name: "PGP Mass Communication", count: 1 },
    { name: "PGP Mathematics", count: 1 },
    { name: "PGP Mental Health", count: 1 },
    { name: "PGP Philosophy", count: 1 },
    { name: "PGP Physics", count: 1 },
    { name: "PGP Public Relations", count: 1 },
    { name: "PGP Sanskrit", count: 1 },
    { name: "PGP Securities Markets", count: 1 },
    { name: "PGP Service Management", count: 1 },
    { name: "PGP Sustainable Management", count: 1 },
    { name: "PGP Tourism", count: 1 },
  ];

  // Read URL search params on mount
  useEffect(() => {
    const streamParam = searchParams.get("stream");
    const stateParam = searchParams.get("state");
    const cityParam = searchParams.get("city");
    const searchParam = searchParams.get("search");

    if (streamParam) setSelectedStreams([streamParam]);
    if (stateParam) setSelectedStates([stateParam.replace("-", " ")]);
    if (cityParam) setSelectedCities([cityParam]);
    if (searchParam) setSearchTerm(searchParam);
  }, [searchParams]);

  // Extract unique filter options from mockup database
  const filterOptions = useMemo(() => {
    const states = Array.from(new Set(mockColleges.map((c) => c.state)));
    const cities = Array.from(new Set(mockColleges.map((c) => c.city)));
    const streams = Array.from(new Set(mockColleges.map((c) => c.stream)));

    const coursesSet = new Set<string>();
    mockColleges.forEach((c) =>
      c.courses.forEach((course) => coursesSet.add(course)),
    );

    const specializationsSet = new Set<string>();
    mockColleges.forEach((c) =>
      c.specializations.forEach((s) => specializationsSet.add(s)),
    );

    return {
      states,
      cities,
      streams,
      courses: Array.from(coursesSet),
      specializations: Array.from(specializationsSet),
    };
  }, []);

  const [collegesList, setCollegesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch colleges from API based on active filters
  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", "12");
        if (searchTerm.trim()) queryParams.append("search", searchTerm);
        if (selectedStates.length > 0)
          queryParams.append("state", selectedStates.join(","));
        if (selectedCities.length > 0)
          queryParams.append("city", selectedCities.join(","));
        if (selectedOwnerships.length > 0)
          queryParams.append("ownership", selectedOwnerships.join(","));
        if (selectedExams.length > 0)
          queryParams.append("exam", selectedExams.join(","));

        const res = await fetch(`/api/colleges?${queryParams.toString()}`);
        const data = await res.json();

        if (data.colleges) {
          // Map database format to layout structure
          const mapped = data.colleges.map((c: any) => {
            const examsArr = c.exams_accepted
              ? c.exams_accepted.split(",").map((e: any) => e.trim())
              : [];
            const logo = c.name
              .split(" ")
              .map((w: any) => w[0])
              .join("")
              .substring(0, 3)
              .toUpperCase();
            let displayDesc = c.description || "";
            let displayAccreditation = "AICTE Approved";
            if (
              displayDesc.trim().startsWith("{") &&
              displayDesc.trim().endsWith("}")
            ) {
              try {
                const parsed = JSON.parse(displayDesc);
                displayDesc = parsed.description || parsed.about || "";
                displayAccreditation =
                  parsed.accreditation ||
                  parsed.accreditation_details ||
                  "AICTE Approved";
              } catch (e) {}
            }

            return {
              id: c.id,
              name: c.name,
              location: c.location,
              state: c.state,
              city: c.city,
              stream: getStreamFromCollegeName(c.name),
              courses: [c.courses_count || "Courses"],
              specializations: [],
              exams: examsArr.length > 0 ? examsArr : ["None"],
              feeRange: c.tuition_fees || "N/A",
              fees: 0,
              rating: parseFloat(c.rating) || 4.2,
              nirfRank:
                c.nirf_rank && c.nirf_rank !== "N/A"
                  ? parseInt(c.nirf_rank.replace(/[^0-9]/g, ""))
                  : undefined,
              type: c.ownership || "Private",
              description: displayDesc,
              logoText: logo || "COL",
              slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              accreditation: displayAccreditation,
              image_url: c.image_url || "",
            };
          });
          setCollegesList(mapped);
          setTotalPages(data.pages || 1);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error("Error fetching colleges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [
    page,
    searchTerm,
    selectedStates,
    selectedCities,
    selectedOwnerships,
    selectedExams,
    sortBy,
  ]);

  // Discover dynamic custom filter values (cities, states, streams) from loaded colleges
  useEffect(() => {
    if (collegesList.length > 0) {
      const citiesToAdd = collegesList
        .map((c) => toTitleCase(c.city))
        .filter(
          (c) =>
            c && !STATIC_cityOptions.some((opt) => toTitleCase(opt.name) === c),
        );

      const statesToAdd = collegesList
        .map((c) => toTitleCase(c.state))
        .filter(
          (s) =>
            s &&
            !STATIC_stateOptions.some((opt) => toTitleCase(opt.name) === s),
        );

      const streamsToAdd = collegesList
        .map((c) => c.stream)
        .filter(
          (s) => s && !STATIC_streamOptions.some((opt) => opt.name === s),
        );

      if (citiesToAdd.length > 0) {
        setDiscoveredCities((prev) =>
          Array.from(new Set([...prev, ...citiesToAdd])),
        );
      }
      if (statesToAdd.length > 0) {
        setDiscoveredStates((prev) =>
          Array.from(new Set([...prev, ...statesToAdd])),
        );
      }
      if (streamsToAdd.length > 0) {
        setDiscoveredStreams((prev) =>
          Array.from(new Set([...prev, ...streamsToAdd])),
        );
      }
    }
  }, [collegesList]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    selectedStates,
    selectedCities,
    selectedOwnerships,
    selectedExams,
    sortBy,
  ]);

  // Define filteredColleges alias for zero-break compatibility with existing template code
  const filteredColleges = useMemo(() => {
    if (selectedStreams.length === 0) return collegesList;
    return collegesList.filter((c) => selectedStreams.includes(c.stream));
  }, [collegesList, selectedStreams]);

  // Read More inline toggle helper
  const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>(
    [],
  );
  const toggleDescription = (id: string) => {
    if (expandedDescriptions.includes(id)) {
      setExpandedDescriptions(
        expandedDescriptions.filter((descId) => descId !== id),
      );
    } else {
      setExpandedDescriptions([...expandedDescriptions, id]);
    }
  };

  // Toggle checklist filter options helper
  const toggleFilter = (type: string, value: string) => {
    if (type === "state") {
      setSelectedStates((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "city") {
      setSelectedCities((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "stream") {
      setSelectedStreams((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "course") {
      setSelectedCourses((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "specialization") {
      setSelectedSpecializations((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "programMode") {
      setSelectedProgramModes((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "ownership") {
      setSelectedOwnerships((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "exam") {
      setSelectedExams((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "courseType") {
      setSelectedCourseTypes((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "affiliation") {
      setSelectedAffiliations((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "approval") {
      setSelectedApprovals((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (type === "feesRange") {
      setSelectedFeesRanges((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    }
  };

  // Reset all filters helper
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedStreams([]);
    setSelectedCourses([]);
    setSelectedSpecializations([]);
    setSelectedProgramModes([]);
    setSelectedOwnerships([]);
    setSelectedExams([]);
    setSelectedCourseTypes([]);
    setSelectedAffiliations([]);
    setSelectedApprovals([]);
    setSelectedFeesRanges([]);
  };

  // Trigger admission modal on click of Apply Now/Brochure (opens globally handled modal)
  const openInquiryModal = (stream: string) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("openAdmissionAlert", {
        detail: { stream },
      });
      window.dispatchEvent(event);
    }
  };

  const renderFilterContent = () => {
    return (
      <div className="space-y-5 select-none">
        {/* SEARCH BOX */}
        <div className="space-y-2">
          <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
            Search Colleges
          </h4>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for college details..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
            />
          </div>
        </div>

        {/* FILTER SECTIONS (Non-collapsible, hamesha uge hue) */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          {/* STATE FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("state")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                State
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.state ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.state && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={stateFilterSearch}
                      onChange={(e) => setStateFilterSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {stateOptions
                        .filter((s) =>
                          s.name
                            .toLowerCase()
                            .includes(stateFilterSearch.toLowerCase()),
                        )
                        .map((state) => (
                          <label
                            key={state.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStates.includes(state.name)}
                              onChange={() => toggleFilter("state", state.name)}
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {state.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({state.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CITY FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("city")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <Map className="w-3.5 h-3.5 text-orange-500" />
                City
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.city ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.city && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={cityFilterSearch}
                      onChange={(e) => setCityFilterSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {cityOptions
                        .filter((c) =>
                          c.name
                            .toLowerCase()
                            .includes(cityFilterSearch.toLowerCase()),
                        )
                        .map((city) => (
                          <label
                            key={city.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCities.includes(city.name)}
                              onChange={() => toggleFilter("city", city.name)}
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {city.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({city.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* STREAM FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("stream")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                Stream / Category
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.stream ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.stream && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={streamFilterSearch}
                      onChange={(e) => setStreamFilterSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {streamOptions
                        .filter((s) =>
                          s.name
                            .toLowerCase()
                            .includes(streamFilterSearch.toLowerCase()),
                        )
                        .map((stream) => (
                          <label
                            key={stream.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStreams.includes(stream.name)}
                              onChange={() =>
                                toggleFilter("stream", stream.name)
                              }
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {stream.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({stream.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COURSES FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("course")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                Courses Offered
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.course ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.course && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={courseFilterSearch}
                      onChange={(e) => setCourseFilterSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {courseOptions
                        .filter((c) =>
                          c.name
                            .toLowerCase()
                            .includes(courseFilterSearch.toLowerCase()),
                        )
                        .map((course) => (
                          <label
                            key={course.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCourses.includes(course.name)}
                              onChange={() =>
                                toggleFilter("course", course.name)
                              }
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {course.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({course.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SPECIALIZATION FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("specialization")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                Specialization
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.specialization ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.specialization && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={specFilterSearch}
                      onChange={(e) => setSpecFilterSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {specializationOptions
                        .filter((sp) =>
                          sp.name
                            .toLowerCase()
                            .includes(specFilterSearch.toLowerCase()),
                        )
                        .map((spec) => (
                          <label
                            key={spec.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSpecializations.includes(
                                spec.name,
                              )}
                              onChange={() =>
                                toggleFilter("specialization", spec.name)
                              }
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {spec.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({spec.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PROGRAM MODE FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("programMode")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-orange-500" />
                Program Mode
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.programMode ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.programMode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={progSearch}
                      onChange={(e) => setProgSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {programModeOptions
                        .filter((opt) =>
                          opt.name
                            .toLowerCase()
                            .includes(progSearch.toLowerCase()),
                        )
                        .map((opt) => (
                          <label
                            key={opt.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedProgramModes.includes(opt.name)}
                              onChange={() =>
                                toggleFilter("programMode", opt.name)
                              }
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {opt.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({opt.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* OWNERSHIP FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("ownership")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-orange-500" />
                Ownership
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.ownership ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.ownership && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={ownerSearch}
                      onChange={(e) => setOwnerSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {ownershipOptions
                        .filter((opt) =>
                          opt.name
                            .toLowerCase()
                            .includes(ownerSearch.toLowerCase()),
                        )
                        .map((opt) => (
                          <label
                            key={opt.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedOwnerships.includes(opt.name)}
                              onChange={() =>
                                toggleFilter("ownership", opt.name)
                              }
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {opt.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({opt.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* EXAMS ACCEPTED FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("exam")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-orange-500" />
                Exams Accepted
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.exam ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.exam && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={examSearch}
                      onChange={(e) => setExamSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {examOptions
                        .filter((opt) =>
                          opt.name
                            .toLowerCase()
                            .includes(examSearch.toLowerCase()),
                        )
                        .map((opt) => (
                          <label
                            key={opt.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedExams.includes(opt.name)}
                              onChange={() => toggleFilter("exam", opt.name)}
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {opt.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({opt.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COURSE TYPE FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("courseType")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                Course Type
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.courseType ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.courseType && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={courseTypeSearch}
                      onChange={(e) => setCourseTypeSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {courseTypeOptions
                        .filter((opt) =>
                          opt.name
                            .toLowerCase()
                            .includes(courseTypeSearch.toLowerCase()),
                        )
                        .map((opt) => (
                          <label
                            key={opt.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCourseTypes.includes(opt.name)}
                              onChange={() =>
                                toggleFilter("courseType", opt.name)
                              }
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {opt.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({opt.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AFFILIATED BY FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("affiliation")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-orange-500" />
                Affiliated By
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.affiliation ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.affiliation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={affSearch}
                      onChange={(e) => setAffSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {affiliationOptions
                        .filter((opt) =>
                          opt.name
                            .toLowerCase()
                            .includes(affSearch.toLowerCase()),
                        )
                        .map((opt) => (
                          <label
                            key={opt.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAffiliations.includes(opt.name)}
                              onChange={() =>
                                toggleFilter("affiliation", opt.name)
                              }
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {opt.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({opt.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* APPROVALS FILTER */}
          <div className="border-b border-slate-100 pb-5">
            <button
              onClick={() => toggleSection("approval")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                Approvals
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.approval ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.approval && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {approvalOptions
                        .filter((opt) =>
                          opt.name
                            .toLowerCase()
                            .includes(appSearch.toLowerCase()),
                        )
                        .map((opt) => (
                          <label
                            key={opt.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedApprovals.includes(opt.name)}
                              onChange={() =>
                                toggleFilter("approval", opt.name)
                              }
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {opt.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({opt.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TOTAL FEES FILTER */}
          <div className="pb-2">
            <button
              onClick={() => toggleSection("feesRange")}
              className="w-full font-outfit font-black text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer select-none group/title py-1 outline-none"
            >
              <span className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                Total Fees
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-500 transition-transform duration-300 ease-out ${
                  expandedSections.feesRange ? "rotate-180" : ""
                } group-hover/title:scale-110`}
              />
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.feesRange && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={feesSearch}
                      onChange={(e) => setFeesSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1.5 custom-filter-scrollbar pr-1 pt-1">
                      {feesRangeOptions
                        .filter((opt) =>
                          opt.name
                            .toLowerCase()
                            .includes(feesSearch.toLowerCase()),
                        )
                        .map((opt) => (
                          <label
                            key={opt.name}
                            className="group flex items-center gap-2 cursor-pointer select-none py-1 px-2 -mx-2 rounded-lg hover:bg-orange-50/30 transition-all duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFeesRanges.includes(opt.name)}
                              onChange={() =>
                                toggleFilter("feesRange", opt.name)
                              }
                              className="accent-orange-500 rounded border-slate-300 w-3.5 h-3.5 group-hover:scale-108 transition-transform duration-200"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
                              {opt.name}
                              <span className="text-slate-400 font-medium ml-1">
                                ({opt.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Admin Login Portal Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center select-none mt-2">
          {isAdmin ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Logged in as Admin
              </span>
              <button
                onClick={handleAdminLogout}
                className="text-[9px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAdminError("");
                setShowAdminLogin(true);
              }}
              className="text-[10px] font-black text-slate-400 hover:text-orange-500 uppercase tracking-widest flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              Admin Access
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-32 pb-16 md:pt-40">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6">
        {/* BREADCRUMBS & COUNT HEADER */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              <Link href="/" className="hover:text-orange-500">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-600">All Colleges</span>
            </div>
            <h1 className="font-outfit font-black text-2xl md:text-3xl text-slate-800 leading-tight mt-1 flex items-center gap-2">
              <Award className="w-7 h-7 text-orange-500" />
              Showing {totalCount} Colleges
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="ml-3 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  ➕ Add New College
                </button>
              )}
            </h1>
          </div>

          {/* SORTING SELECT */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm self-stretch md:self-auto">
            <span className="text-[10px] font-black uppercase text-slate-400">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="popularity">Popularity (Rank)</option>
              <option value="rating">Rating (Stars)</option>
              <option value="fees_asc">Fees: Low to High</option>
              <option value="fees_desc">Fees: High to Low</option>
            </select>
          </div>
        </div>

        {/* ACTIVE FILTERS TAGS */}
        {(selectedStates.length > 0 ||
          selectedCities.length > 0 ||
          selectedStreams.length > 0 ||
          selectedCourses.length > 0 ||
          selectedSpecializations.length > 0 ||
          selectedProgramModes.length > 0 ||
          selectedOwnerships.length > 0 ||
          selectedExams.length > 0 ||
          selectedCourseTypes.length > 0 ||
          selectedAffiliations.length > 0 ||
          selectedApprovals.length > 0 ||
          selectedFeesRanges.length > 0 ||
          searchTerm !== "") && (
          <div className="flex flex-wrap gap-2 items-center mb-6 bg-orange-50/50 border border-orange-100 p-3 rounded-2xl">
            <span className="text-[9px] uppercase font-black text-orange-600 tracking-wider">
              Active Filters:
            </span>

            {searchTerm !== "" && (
              <span className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                Query: "{searchTerm}"
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              </span>
            )}

            {selectedStates.map((st) => (
              <span
                key={st}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {st}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("state", st)}
                />
              </span>
            ))}

            {selectedCities.map((ct) => (
              <span
                key={ct}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {ct}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("city", ct)}
                />
              </span>
            ))}

            {selectedStreams.map((str) => (
              <span
                key={str}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {str}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("stream", str)}
                />
              </span>
            ))}

            {selectedCourses.map((cr) => (
              <span
                key={cr}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {cr}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("course", cr)}
                />
              </span>
            ))}

            {selectedSpecializations.map((sp) => (
              <span
                key={sp}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {sp}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("specialization", sp)}
                />
              </span>
            ))}

            {selectedProgramModes.map((pm) => (
              <span
                key={pm}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {pm}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("programMode", pm)}
                />
              </span>
            ))}

            {selectedOwnerships.map((os) => (
              <span
                key={os}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {os}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("ownership", os)}
                />
              </span>
            ))}

            {selectedExams.map((ex) => (
              <span
                key={ex}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {ex}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("exam", ex)}
                />
              </span>
            ))}

            {selectedCourseTypes.map((ct) => (
              <span
                key={ct}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {ct}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("courseType", ct)}
                />
              </span>
            ))}

            {selectedAffiliations.map((af) => (
              <span
                key={af}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {af}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("affiliation", af)}
                />
              </span>
            ))}

            {selectedApprovals.map((ap) => (
              <span
                key={ap}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {ap}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("approval", ap)}
                />
              </span>
            ))}

            {selectedFeesRanges.map((fr) => (
              <span
                key={fr}
                className="flex items-center gap-1 bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold"
              >
                {fr}
                <X
                  className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                  onClick={() => toggleFilter("feesRange", fr)}
                />
              </span>
            ))}

            <button
              onClick={clearAllFilters}
              className="text-[9px] font-extrabold text-orange-600 hover:text-orange-700 uppercase tracking-widest hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* MAIN CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT SIDEBAR: FILTERS CARD (Visible only on desktop/laptop, mobile uses floating drawer button) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 hover:border-orange-500/20 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.05)] transition-all duration-350 space-y-5 select-none">
            {renderFilterContent()}
          </aside>

          {/* RIGHT SIDE: COLLEGES CARDS LIST */}
          <main className="col-span-1 lg:col-span-9 lg:h-[3200px] lg:overflow-y-auto lg:pr-4 custom-filter-scrollbar space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Colleges cards list (Takes 8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-200/80 rounded-3xl gap-4">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                        Loading colleges from database...
                      </p>
                    </div>
                  ) : filteredColleges.length > 0 ? (
                    filteredColleges.map((college, idx) => {
                      const isExpanded = expandedDescriptions.includes(
                        college.id,
                      );
                      const isShortlisted = shortlisted.includes(college.id);
                      return (
                        <React.Fragment key={college.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            whileHover={{ scale: 1.01, y: -3 }}
                            whileTap={{ scale: 0.99 }}
                            className="group bg-white border border-slate-300 md:border-slate-200/80 hover:border-orange-500 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.025)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.16)] transition-all duration-300 ease-out relative flex flex-col lg:grid lg:grid-cols-12 lg:gap-5 p-4 md:p-6 lg:p-7 max-w-[600px] lg:mx-0 w-full"
                          >
                            {/* Premium AI Glowing Top Accent Line */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* ADMIN CARD CONTROL TRIGGERS */}
                            {isAdmin && (
                              <div className="absolute top-4 right-4 z-30 flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditing(college);
                                  }}
                                  className="p-2 rounded-xl bg-orange-100 hover:bg-orange-600 text-orange-600 hover:text-white transition-all cursor-pointer shadow-sm border border-orange-200"
                                  title="Edit College details"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCollege(college);
                                  }}
                                  className="p-2 rounded-xl bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-all cursor-pointer shadow-sm border border-red-200"
                                  title="Delete College permanently"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            {/* LEFT PANEL: LOGO & RANKING BADGES */}
                            <div className="col-span-12 lg:col-span-3 flex flex-row lg:flex-col items-center justify-between lg:justify-center lg:border-r lg:border-slate-200/60 lg:pr-4 gap-4 flex-shrink-0 select-none pb-4 lg:pb-0 border-b lg:border-b-0 border-slate-100">
                              {/* Logo and Ranking Group */}
                              <div className="flex items-center lg:flex-col gap-3 lg:gap-2.5 text-center">
                                {/* Logo Box */}
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 flex items-center justify-center text-xl lg:text-2xl font-black text-slate-800 uppercase tracking-widest shadow-sm group-hover:scale-105 group-hover:shadow-md group-hover:border-orange-500/30 group-hover:from-orange-50/40 group-hover:to-orange-100/10 transition-all duration-300 overflow-hidden relative flex-shrink-0">
                                  {college.image_url ? (
                                    <>
                                      <img
                                        src={college.image_url}
                                        alt={college.name}
                                        className="w-full h-full object-contain p-0.5 bg-white absolute inset-0"
                                        id={`img-${college.id}`}
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                          const txt = document.getElementById(
                                            `txt-${college.id}`,
                                          );
                                          if (txt) txt.style.display = "block";
                                        }}
                                      />
                                      <span
                                        id={`txt-${college.id}`}
                                        style={{ display: "none" }}
                                      >
                                        {college.logoText}
                                      </span>
                                    </>
                                  ) : (
                                    college.logoText
                                  )}
                                </div>

                                {/* Rank indicator (Shiksha style) */}
                                {college.nirfRank ? (
                                  <div className="text-left lg:text-center">
                                    <span className="block font-outfit font-black text-base lg:text-lg text-slate-800 leading-tight">
                                      #{college.nirfRank}
                                    </span>
                                    <span className="block text-[8px] font-black text-orange-600 uppercase tracking-widest">
                                      NIRF Rank
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-left lg:text-center">
                                    <span className="block font-outfit font-black text-base lg:text-lg text-slate-800 leading-tight">
                                      ★ {college.rating}
                                    </span>
                                    <span className="block text-[8px] font-black text-amber-600 uppercase tracking-widest">
                                      Rating
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Mobile view Rating/NIRF fallback badge */}
                              <div className="lg:hidden flex items-center gap-2">
                                <span className="bg-amber-50 text-amber-700 border border-amber-100/50 px-2 py-0.5 rounded-lg text-[9px] font-extrabold flex items-center gap-0.5">
                                  ★ {college.rating}
                                </span>
                                <span className="bg-orange-50 text-orange-700 border border-orange-100/50 px-2 py-0.5 rounded-lg text-[9px] font-extrabold">
                                  {college.accreditation}
                                </span>
                              </div>
                            </div>

                            {/* CENTER PANEL: COLLEGE DETAILS (Shiksha + GetMyUni style hybrid) */}
                            <div className="col-span-12 lg:col-span-6 flex flex-col space-y-3 mt-4 lg:mt-0">
                              {/* Title and Location */}
                              <div className="space-y-1">
                                <Link
                                  href={`/colleges/${college.slug}`}
                                  className="font-outfit font-black text-sm md:text-base text-slate-800 hover:text-orange-500 hover:underline leading-snug transition-colors line-clamp-1"
                                >
                                  {college.name}
                                </Link>

                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-bold text-slate-500">
                                  <span className="flex items-center gap-1 text-slate-600 group-hover:text-slate-700 transition-colors">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                    {college.location}
                                  </span>
                                  <span>•</span>
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-wider font-extrabold">
                                    {college.type}
                                  </span>
                                </div>
                              </div>

                              {/* Short Description */}
                              <p
                                className={`text-[11px] text-slate-500 leading-relaxed font-semibold ${isExpanded ? "" : "line-clamp-2"}`}
                              >
                                {college.description}
                              </p>

                              {/* Metadata Grid (GetMyUni inspired, custom modern border box) */}
                              <div className="grid grid-cols-2 gap-2 md:gap-3.5 select-none">
                                {/* Courses */}
                                <div className="p-2 md:p-3 bg-slate-50/60 border border-slate-100 rounded-xl md:rounded-2xl hover:bg-white hover:border-orange-500/35 hover:shadow-[0_8px_20px_rgba(249,115,22,0.04)] hover:scale-[1.01] transition-all duration-300 space-y-0.5 md:space-y-1">
                                  <p className="text-[7px] md:text-[7.5px] text-slate-400 font-black uppercase tracking-widest">
                                    Courses
                                  </p>
                                  <p className="font-outfit font-black text-[9px] md:text-[10px] text-slate-700 uppercase line-clamp-1">
                                    {college.courses.join(", ")}
                                  </p>
                                </div>

                                {/* Exams */}
                                <div className="p-2 md:p-3 bg-slate-50/60 border border-slate-100 rounded-xl md:rounded-2xl hover:bg-white hover:border-orange-500/35 hover:shadow-[0_8px_20px_rgba(249,115,22,0.04)] hover:scale-[1.01] transition-all duration-300 space-y-0.5 md:space-y-1">
                                  <p className="text-[7px] md:text-[7.5px] text-slate-400 font-black uppercase tracking-widest">
                                    Exams Accepted
                                  </p>
                                  <p className="font-outfit font-black text-[9px] md:text-[10px] text-slate-700 line-clamp-1">
                                    {college.exams.join(", ")}
                                  </p>
                                </div>

                                {/* Fees */}
                                <div className="p-2 md:p-3 bg-slate-50/60 border border-slate-100 rounded-xl md:rounded-2xl hover:bg-white hover:border-orange-500/35 hover:shadow-[0_8px_20px_rgba(249,115,22,0.04)] hover:scale-[1.01] transition-all duration-300 space-y-0.5 md:space-y-1">
                                  <p className="text-[7px] md:text-[7.5px] text-slate-400 font-black uppercase tracking-widest">
                                    Tuition Fees
                                  </p>
                                  <p className="font-outfit font-black text-[9px] md:text-[10px] text-orange-600 line-clamp-1">
                                    {college.feeRange}
                                  </p>
                                </div>

                                {/* Accreditation */}
                                <div className="p-2 md:p-3 bg-slate-50/60 border border-slate-100 rounded-xl md:rounded-2xl hover:bg-white hover:border-orange-500/35 hover:shadow-[0_8px_20px_rgba(249,115,22,0.04)] hover:scale-[1.01] transition-all duration-300 space-y-0.5 md:space-y-1">
                                  <p className="text-[7px] md:text-[7.5px] text-slate-400 font-black uppercase tracking-widest">
                                    Accreditation
                                  </p>
                                  <p className="font-outfit font-black text-[9px] md:text-[10px] text-slate-600 uppercase line-clamp-1">
                                    {college.accreditation}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT PANEL: ACTIONS CTA (Stacked Vertically on Desktop) */}
                            <div className="col-span-12 lg:col-span-3 flex lg:flex-col items-center justify-between lg:justify-center gap-2.5 md:gap-3 lg:pl-4 lg:border-l lg:border-slate-200/60 mt-3 md:mt-4 lg:mt-0 w-full">
                              {/* Read More button as secondary details trigger */}
                              <button
                                onClick={() => toggleDescription(college.id)}
                                className="hidden lg:block text-[9px] font-black text-slate-400 hover:text-orange-600 uppercase tracking-widest hover:underline transition-colors mr-auto"
                              >
                                {isExpanded ? "Hide Details" : "Show Details"}
                              </button>

                              {/* Shortlist Toggle */}
                              <button
                                onClick={() => {
                                  const loggedInUser = checkUserAuth();
                                  if (!loggedInUser) return;
                                  if (isShortlisted) {
                                    setShortlisted((prev) =>
                                      prev.filter((id) => id !== college.id),
                                    );
                                  } else {
                                    setShortlisted((prev) => [
                                      ...prev,
                                      college.id,
                                    ]);
                                  }
                                }}
                                className={`flex items-center justify-center gap-1.5 px-4 py-2 md:py-2.5 border rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all w-1/2 lg:w-full ${
                                  isShortlisted
                                    ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm"
                                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }`}
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${isShortlisted ? "fill-orange-500 text-orange-500" : ""}`}
                                />
                                {isShortlisted ? "Shortlisted" : "Shortlist"}
                              </button>

                              {/* Apply / Brochure CTA */}
                              <button
                                onClick={() => {
                                  const loggedInUser = checkUserAuth();
                                  if (!loggedInUser) return;
                                  openInquiryModal(college.stream);
                                }}
                                className="flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/10 active:scale-95 cursor-pointer w-1/2 lg:w-full text-center hover:shadow-[0_4px_15px_rgba(249,115,22,0.25)]"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Apply / Brochure
                              </button>
                            </div>
                          </motion.div>

                          {/* Dynamic Ad Banner after every 4 colleges */}
                          {(idx + 1) % 4 === 0 && (
                            <React.Fragment>
                              {/* Alternating Ad Slots: Odd slots show real UPES Ad, Even slots show Google Ad placeholder */}
                              {Math.floor((idx + 1) / 4) % 2 === 1 ? (
                                // Real UPES Ad Slot
                                !hiddenAds.includes(idx) ? (
                                  <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative w-full max-w-[600px] lg:mx-0 select-none mt-2 mb-6 flex items-center justify-center group"
                                  >
                                    {/* Invisible Close Trigger Overlay aligned exactly to the [x] in the image */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setHiddenAds((prev) => [...prev, idx]);
                                      }}
                                      className="absolute top-[2px] right-[2px] w-[30px] h-[30px] bg-transparent cursor-pointer z-30 border-0 outline-none"
                                      title="Close Ad"
                                    />

                                    <a
                                      href="https://www.upes.ac.in/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full block"
                                    >
                                      <div className="w-full h-auto overflow-hidden flex items-center justify-center bg-transparent rounded-lg">
                                        <img
                                          src="/upes_ad.png"
                                          alt="UPES Admission Ad"
                                          className="w-full h-auto object-contain max-h-[140px] md:max-h-[120px] transition-transform duration-300 group-hover:scale-[1.002]"
                                        />
                                      </div>
                                    </a>
                                  </motion.div>
                                ) : (
                                  // Google Closed Screen replacement overlay for UPES Ad (Matches Google Adsense Closed UI)
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center max-w-[600px] lg:mx-0 w-full mt-2 mb-6 flex items-center justify-center gap-4 relative min-h-[90px]"
                                  >
                                    {/* Left Back Arrow */}
                                    <div className="absolute left-4 text-slate-300 text-sm select-none pointer-events-none">
                                      ←
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 mx-auto">
                                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                        Ad served by{" "}
                                        <span className="text-slate-600 font-black">
                                          Google
                                        </span>
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <button
                                          disabled
                                          className="px-3 py-1.5 bg-blue-600 text-white font-black text-[9px] uppercase tracking-wider rounded border border-blue-500 opacity-60"
                                        >
                                          Stop seeing this ad
                                        </button>
                                        <button
                                          onClick={() =>
                                            setHiddenAds((prev) =>
                                              prev.filter((id) => id !== idx),
                                            )
                                          }
                                          className="px-3 py-1.5 bg-white text-orange-500 border border-slate-200 hover:bg-slate-50 font-black text-[9px] uppercase tracking-wider rounded transition-all cursor-pointer"
                                        >
                                          Undo
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              ) : // Google Ad Placeholder Slot (Even indices)
                              !closedGoogleAds.includes(idx) ? (
                                <motion.div
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.25 }}
                                  className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-5 relative flex flex-col items-center justify-center gap-4 text-center max-w-[600px] lg:mx-0 w-full mt-2 mb-6 min-h-[140px] md:min-h-[120px]"
                                >
                                  {/* Left Back Arrow indicator */}
                                  <div className="absolute left-4 text-slate-300 text-sm select-none pointer-events-none">
                                    ←
                                  </div>

                                  <div className="flex flex-col items-center gap-1">
                                    <p className="text-[11px] md:text-xs text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5 select-none">
                                      Ad served by{" "}
                                      <span className="text-slate-600 font-black">
                                        Google
                                      </span>
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                                    <button
                                      onClick={() =>
                                        setClosedGoogleAds((prev) => [
                                          ...prev,
                                          idx,
                                        ])
                                      }
                                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] md:text-xs uppercase tracking-wider rounded-lg shadow-sm border border-blue-500 transition-all cursor-pointer"
                                    >
                                      Stop seeing this ad
                                    </button>
                                    <a
                                      href="https://support.google.com/adspolicy/answer/6023676"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-500 font-black text-[10px] md:text-xs uppercase tracking-wider rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1"
                                    >
                                      Why this ad?
                                      <span className="w-3.5 h-3.5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold border border-slate-200">
                                        i
                                      </span>
                                    </a>
                                  </div>
                                </motion.div>
                              ) : (
                                // Google Closed State replacement overlay for Placeholder Slot
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center max-w-[600px] lg:mx-0 w-full mt-2 mb-6 flex items-center justify-center gap-4 relative min-h-[90px]"
                                >
                                  {/* Left Back Arrow */}
                                  <div className="absolute left-4 text-slate-300 text-sm select-none pointer-events-none">
                                    ←
                                  </div>
                                  <div className="flex flex-col items-center gap-1.5 mx-auto">
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                      Ad served by{" "}
                                      <span className="text-slate-600 font-black">
                                        Google
                                      </span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <button
                                        disabled
                                        className="px-3 py-1.5 bg-blue-600 text-white font-black text-[9px] uppercase tracking-wider rounded border border-blue-500 opacity-60"
                                      >
                                        Stop seeing this ad
                                      </button>
                                      <button
                                        onClick={() =>
                                          setClosedGoogleAds((prev) =>
                                            prev.filter((id) => id !== idx),
                                          )
                                        }
                                        className="px-3 py-1.5 bg-white text-orange-500 border border-slate-200 hover:bg-slate-50 font-black text-[9px] uppercase tracking-wider rounded transition-all cursor-pointer"
                                      >
                                        Undo
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <div className="py-16 px-4 bg-white border border-slate-200 rounded-3xl text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                        <HelpCircle className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-outfit font-black text-lg text-slate-800">
                          No Colleges Found
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                          We couldn't find any colleges matching your active
                          filters. Try adjusting or clearing filters to browse
                          others.
                        </p>
                      </div>
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </AnimatePresence>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white border border-slate-200/80 px-6 py-4 rounded-3xl shadow-sm mt-8">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer active:scale-95"
                    >
                      Previous
                    </button>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer active:scale-95"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Right Sidebar Ad slot (Takes 4 cols, only visible on desktop view) */}
              <div className="hidden lg:block lg:col-span-4 sticky top-4 select-none">
                {!isFlipkartAdClosed ? (
                  // Active Flipkart Ad Banner
                  <div className="relative w-full overflow-hidden rounded-2xl flex flex-col items-center justify-center group bg-white shadow-sm border border-slate-200/50 p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsFlipkartAdClosed(true);
                      }}
                      className="absolute top-[6px] right-[6px] w-[28px] h-[28px] bg-transparent cursor-pointer z-30 border-0 outline-none"
                      title="Close Ad"
                    />

                    <a
                      href="https://www.flipkart.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <img
                        src="/flipkart_ad.png"
                        alt="Flipkart Smart Shop Ad"
                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.002] rounded-xl"
                      />
                    </a>
                  </div>
                ) : // Google Ad placeholder or closed state if closed
                !closedFlipkartGoogleAd ? (
                  <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-5 relative flex flex-col items-center justify-center gap-4 text-center w-full min-h-[200px]">
                    {/* Left Back Arrow */}
                    <div className="absolute left-4 text-slate-300 text-sm select-none pointer-events-none">
                      ←
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-wider select-none">
                        Ad served by{" "}
                        <span className="text-slate-600 font-black">
                          Google
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-full px-2">
                      <button
                        onClick={() => setClosedFlipkartGoogleAd(true)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] md:text-xs uppercase tracking-wider rounded-lg shadow-sm border border-blue-500 transition-all cursor-pointer"
                      >
                        Stop seeing this ad
                      </button>
                      <a
                        href="https://support.google.com/adspolicy/answer/6023676"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-white hover:bg-slate-50 text-slate-500 font-black text-[10px] md:text-xs uppercase tracking-wider rounded-lg border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1"
                      >
                        Why this ad?
                        <span className="w-3.5 h-3.5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold border border-slate-200">
                          i
                        </span>
                      </a>
                    </div>
                  </div>
                ) : (
                  // Closed Confirmation State
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center w-full flex flex-col items-center justify-center gap-2 relative min-h-[100px]">
                    <p className="text-[10px] text-slate-400 font-bold leading-normal px-4">
                      Ad hidden by Google. We will try not to show it again.
                    </p>
                    <button
                      onClick={() => {
                        setClosedFlipkartGoogleAd(false);
                        setIsFlipkartAdClosed(false);
                      }}
                      className="text-[10px] font-black text-orange-500 hover:underline uppercase tracking-wider"
                    >
                      Undo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MOBILE FLOATING FILTER TOGGLE BUTTON */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/25 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          Filters & Search
        </button>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER FOR FILTERS */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden flex flex-col justify-end">
            <div
              className="absolute inset-0"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative bg-white rounded-t-[32px] w-full max-h-[85vh] shadow-2xl p-5 flex flex-col z-10"
            >
              {/* Drag handle line */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 flex-shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 flex-shrink-0">
                <h3 className="font-outfit font-black text-slate-800 text-sm uppercase tracking-wide">
                  Filters & Search (
                  {selectedStates.length +
                    selectedCities.length +
                    selectedStreams.length +
                    selectedCourses.length +
                    selectedSpecializations.length +
                    selectedExams.length +
                    selectedOwnerships.length}{" "}
                  Active)
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable filters content */}
              <div className="flex-1 overflow-y-auto pr-1">
                {renderFilterContent()}
              </div>

              {/* Drawer sticky footer */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE COLLAPSIBLE DRAWER FOR CONTACT OPTIONS */}
      <AnimatePresence>
        {isContactDrawerOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] md:hidden flex flex-col justify-end">
            <div
              className="absolute inset-0"
              onClick={() => setIsContactDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative bg-white rounded-t-[32px] w-full shadow-2xl p-5 flex flex-col z-10 select-none pb-8"
            >
              {/* Drag handle line */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 flex-shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 flex-shrink-0">
                <div className="text-left">
                  <h3 className="font-outfit font-black text-slate-800 text-xs md:text-sm uppercase tracking-wide">
                    Contact Counseling Expert
                  </h3>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                    Choose your preferred way to connect
                  </p>
                </div>
                <button
                  onClick={() => setIsContactDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {/* WhatsApp Option */}
                <a
                  href="https://wa.me/918585951111?text=Hi%20Sarthi,%20I%20have%20a%20query%20about%20college%20admissions."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsContactDrawerOpen(false)}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 text-emerald-800 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.277L6.5 20.5l5.397-1.398c.95.534 2.12.87 3.114.872 3.182 0 5.768-2.587 5.77-5.767 0-3.18-2.587-5.767-5.77-5.767zm3.61 7.223c-.15.075-.89.44-1.03.49-.14.05-.24.07-.34-.07-.1.15-.39.49-.48.59-.09.1-.18.11-.33.04-.9-.45-1.6-1.21-2.07-2.02-.04-.06-.01-.13.03-.19.03-.06.07-.15.1-.22.04-.08.06-.13.09-.19.03-.06.02-.12-.01-.19-.03-.07-.24-.58-.33-.8-.09-.2-.18-.17-.24-.17h-.2c-.07 0-.18.03-.28.14-.1.1-.39.38-.39.93s.4 1.08.45 1.15c.05.07 1.34 2.05 3.25 2.87.45.19.81.3 1.08.39.45.14.86.12 1.18.07.36-.05.89-.36 1.02-.71.13-.35.13-.65.09-.71-.04-.07-.16-.11-.31-.19z" />
                    </svg>
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-black uppercase tracking-wider">
                      Chat on WhatsApp
                    </p>
                    <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">
                      Instant response from senior counselors
                    </p>
                  </div>
                </a>

                {/* Direct Call Option */}
                <a
                  href="tel:+918585951111"
                  onClick={() => setIsContactDrawerOpen(false)}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100/70 border border-orange-100 text-orange-800 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-black uppercase tracking-wider">
                      Direct Voice Call
                    </p>
                    <p className="text-[9px] text-orange-600 font-semibold mt-0.5">
                      Call +91 85859 51111 directly
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN ACCESS LOGIN MODAL */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative border border-slate-100"
            >
              <button
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 z-50 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="font-outfit font-black text-xl text-slate-800">
                    Admin Authentication
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Provide secure console key
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Username
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Enter admin username"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      className="w-full mt-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Password
                    </label>
                    <input
                      required
                      type="password"
                      placeholder="Enter admin password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="w-full mt-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                {adminError && (
                  <p className="text-[10px] text-red-500 font-bold text-center mt-1">
                    {adminError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  Verify Access
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN ADD COLLEGE MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl relative border border-slate-100 my-8 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-5 right-5 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 z-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleAddCollegeSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-outfit font-black text-lg text-slate-800">
                    Add New College
                  </h3>
                  <p className="text-[10px] font-bold text-emerald-500">
                    Insert record into Supabase in real-time
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      College Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. IIT Patna"
                      value={addName}
                      onChange={(e) => setAddName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Image URL / Path
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /images/iit-patna.jpg"
                      value={addImageUrl}
                      onChange={(e) => setAddImageUrl(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Location *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Patna, Bihar"
                      value={addLocation}
                      onChange={(e) => setAddLocation(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Patna"
                      value={addCity}
                      onChange={(e) => setAddCity(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      State *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Bihar"
                      value={addState}
                      onChange={(e) => setAddState(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Ownership *
                    </label>
                    <select
                      value={addOwnership}
                      onChange={(e) => setAddOwnership(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Rating *
                    </label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={addRating}
                      onChange={(e) => setAddRating(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      NIRF Rank
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 52"
                      value={addNIRFRank}
                      onChange={(e) => setAddNIRFRank(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Courses Count
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6 Courses"
                      value={addCoursesCount}
                      onChange={(e) => setAddCoursesCount(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Exams Accepted (comma-sep)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JEE Main, JEE Advanced"
                      value={addExamsAccepted}
                      onChange={(e) => setAddExamsAccepted(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Tuition Fees *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. ₹2.0 Lakhs/Yr"
                      value={addTuitionFees}
                      onChange={(e) => setAddTuitionFees(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Accreditation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AICTE Approved"
                      value={addAccreditation}
                      onChange={(e) => setAddAccreditation(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                    About/Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the newly added institution..."
                    value={addDescription}
                    onChange={(e) => setAddDescription(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingCollege}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isAddingCollege ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Create Record
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN EDIT CARD MODAL */}
      <AnimatePresence>
        {editingCollege && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl relative border border-slate-100 my-8 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => setEditingCollege(null)}
                className="absolute top-5 right-5 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 z-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleSaveChanges} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-outfit font-black text-lg text-slate-800">
                    Edit College Card
                  </h3>
                  <p className="text-[10px] font-bold text-orange-500">
                    Updating slug: {editingCollege.slug}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      College Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Image URL / Path
                    </label>
                    <input
                      type="text"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Location *
                    </label>
                    <input
                      required
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      State *
                    </label>
                    <input
                      required
                      type="text"
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Ownership *
                    </label>
                    <select
                      value={editOwnership}
                      onChange={(e) => setEditOwnership(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Rating *
                    </label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={editRating}
                      onChange={(e) => setEditRating(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      NIRF Rank
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 23"
                      value={editNIRFRank}
                      onChange={(e) => setEditNIRFRank(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Courses Count
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Courses"
                      value={editCoursesCount}
                      onChange={(e) => setEditCoursesCount(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Exams Accepted (comma-sep)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JEE Main, DASA"
                      value={editExamsAccepted}
                      onChange={(e) => setEditExamsAccepted(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Tuition Fees *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. ₹2.2 Lakhs/Yr"
                      value={editTuitionFees}
                      onChange={(e) => setEditTuitionFees(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                      Accreditation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AICTE APPROVED"
                      value={editAccreditation}
                      onChange={(e) => setEditAccreditation(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                    About/Description
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingCollege(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingCollege}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingCollege ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE STICKY BOTTOM TALK TO EXPERTS BAR */}
      <div
        onClick={() => setIsContactDrawerOpen(true)}
        className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-[10.5px] tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer z-40 md:hidden shadow-[0_-5px_20px_rgba(249,115,22,0.25)] border-t border-orange-400/20 active:scale-[0.99] transition-all"
      >
        <MessageSquare className="w-4 h-4 animate-bounce" />
        Talk to Counseling Experts
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
            Loading colleges...
          </p>
        </div>
      }
    >
      <CollegesListContent />
    </Suspense>
  );
}
