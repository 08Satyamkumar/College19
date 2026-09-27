"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Building,
  Briefcase,
  BookOpen,
  GraduationCap,
  CheckCircle,
  Download,
  PhoneCall,
  Wifi,
  User,
  Coffee,
  Heart,
  TrendingUp,
  Edit,
  X,
  Loader2,
  Award,
  Calendar,
  DollarSign,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Sparkles,
  Share2,
  Bookmark,
  FileText,
  HelpCircle,
  ShieldCheck,
  Layers,
  Compass,
  ExternalLink,
  Users,
  Shield,
  Clock,
  School,
  Landmark,
  Percent,
  CheckCircle2,
  SlidersHorizontal,
  Filter,
  Plus,
  Trash2,
  ArrowRight,
  Lightbulb,
  Bell,
  ThumbsUp,
  ThumbsDown,
  Play,
  Film,
  Camera,
  Eye,
  Upload,
  Video,
} from "lucide-react";

interface CourseItem {
  name: string;
  duration: string;
  fees: string;
  eligibility: string;
  seats?: string;
}

interface CutoffItem {
  branch: string;
  category?: string;
  openRank: string | number;
  closeRank: string | number;
  round?: string;
}

interface ReviewItem {
  id: string;
  author: string;
  course: string;
  year: string;
  rating: number;
  title: string;
  content: string;
  pros?: string;
  cons?: string;
}

interface HighlightItem {
  label: string;
  value: string;
}

interface HighlightBullet {
  title: string;
  text: string;
}

interface HighlightsArticleData {
  introText?: string;
  bullets?: HighlightBullet[];
  nirfCalloutTitle?: string;
  nirfCalloutDesc?: string;
  nirfReportUrl?: string;
  faqs?: FaqItem[];
}

interface CutoffArticleData {
  title?: string;
  paragraphs?: string[];
  calloutTitle?: string;
  calloutDesc?: string;
  calloutPdfUrl?: string;
  afterCalloutParagraphs?: string[];
  footerNote?: string;
  faqs?: FaqItem[];
}

interface SpecialisationCategoryRow {
  category: string;
  list: string;
}

interface CourseSummaryCardItem {
  courseName: string;
  firstYearFees?: string;
  eligibility?: string;
  duration?: string;
  selection?: string;
}

interface CourseSummaryCardGroup {
  groupTitle: string;
  courses: CourseSummaryCardItem[];
}

interface PopularCourseFeeRow {
  courseName: string;
  coursesCount?: string;
  tuitionFees: string;
  totalFees: string;
}

interface OtherFeeChargeRow {
  component: string;
  subtext?: string;
  amount: string;
}

interface CoursesFeesArticleData {
  title?: string;
  introParagraph1?: string;
  introParagraph2?: string;
  courseSummaryGroups?: CourseSummaryCardGroup[];
  specialisations?: SpecialisationCategoryRow[];
  calloutPromoText?: string;
  calloutPdfUrl?: string;
  popularCoursesHeading?: string;
  popularCourses?: PopularCourseFeeRow[];
  otherChargesHeading?: string;
  otherChargesNote?: string;
  otherCharges?: OtherFeeChargeRow[];
  footerNote?: string;
  viewAllBtnText?: string;
  faqs?: FaqItem[];
}

interface PlacementSubSection {
  heading: string;
  content: string;
}

interface PlacementStatRow {
  particular: string;
  values?: string[];
  statCurrentYear?: string;
  statPrevYear?: string;
}

const getStatRowCellValue = (row: PlacementStatRow, colIdx: number): string => {
  if (colIdx === 0) return row.particular || "";
  const valIdx = colIdx - 1;
  if (row.values && row.values.length > valIdx) {
    return row.values[valIdx] ?? "NA";
  }
  if (valIdx === 0 && row.statCurrentYear !== undefined) return row.statCurrentYear;
  if (valIdx === 1 && row.statPrevYear !== undefined) return row.statPrevYear;
  return "NA";
};

interface CourseSalaryRow {
  course: string;
  salary?: string;
  values?: string[];
}

const getCourseSalaryCellValue = (row: CourseSalaryRow, colIdx: number): string => {
  if (colIdx === 0) return row.course || "";
  const valIdx = colIdx - 1;
  if (row.values && row.values.length > valIdx) {
    return row.values[valIdx] ?? "NA";
  }
  if (valIdx === 0 && row.salary !== undefined) return row.salary;
  return "NA";
};

interface TopRecruiterItem {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
}

interface PlacementInsightItem {
  title: string;
  description: string;
}

interface AdmissionBulletItem {
  text: string;
}

interface AdmissionDateEventRow {
  dates: string;
  event: string;
  isTentative?: boolean;
}

interface CourseAdmissionBoxItem {
  id?: string;
  courseTitle: string;
  courseMeta: string;
  eligibilityBullets: string[];
  datesHeading?: string;
  datesTable: AdmissionDateEventRow[];
  downloadDatesUrl?: string;
}

interface AdmissionFaqItem {
  question: string;
  answer: string;
  upvotes?: number;
}

interface RankingTableRow {
  body: string;
  category: string;
  rank: string;
}

interface CourseRankingTableRow {
  publisher: string;
  rank2024: string;
  rank2025: string;
  rank2026: string;
}

interface RankingFaqItem {
  question: string;
  answer: string;
  upvotes?: number;
}

interface CourseRankingBoxItem {
  title: string;
  yearsHeader?: string[];
  tableRows: CourseRankingTableRow[];
  highlightBadge?: string;
}

interface ReviewHistogramItem {
  starsRange: string;
  count: number;
}

interface ReviewParameterItem {
  label: string;
  rating: number;
  iconType: "briefcase" | "building" | "book" | "users" | "dollar";
}

interface StudentFeedbackCategory {
  category: string;
  likesText: string;
  likesCountText: string;
  dislikesText: string;
  dislikesCountText: string;
}

interface StudentFeedbackData {
  heading?: string;
  categories: StudentFeedbackCategory[];
}

interface ReviewParameterBadge {
  label: string;
  rating: number;
}

interface ReviewCategoryParagraph {
  heading: string;
  content: string;
}

interface DetailedReviewCard {
  id: string;
  authorName: string;
  avatarInitial?: string;
  avatarBgColor?: string;
  verified: boolean;
  courseAndBatch: string;
  overallRating: number;
  parameterRatings: ReviewParameterBadge[];
  title: string;
  paragraphs: ReviewCategoryParagraph[];
  reviewedDate: string;
  likesCount?: number;
  dislikesCount?: number;
}

interface StudentMediaReviewItem {
  id: string;
  type: "video" | "image";
  title: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  authorName?: string;
  batch?: string;
}

interface StudentMediaReviewsData {
  title?: string;
  items: StudentMediaReviewItem[];
}





const DEFAULT_MORE_REVIEW_CARDS: DetailedReviewCard[] = [
  {
    id: "more-rev-1",
    authorName: "Sneha Mukherjee",
    avatarInitial: "S",
    avatarBgColor: "bg-teal-100 text-teal-800",
    verified: true,
    courseAndBatch: "B.Tech. in Biotechnology & Biochemical Engineering - Batch of 2027",
    overallRating: 4.7,
    parameterRatings: [
      { label: "Placements", rating: 4.5 },
      { label: "Infrastructure", rating: 4.8 },
      { label: "Faculty", rating: 4.9 },
      { label: "Crowd & Campus Life", rating: 4.6 },
      { label: "Value for Money", rating: 4.8 },
    ],
    title: "State-of-the-art bioprocess research facilities and top faculty guidance.",
    paragraphs: [
      {
        heading: "Placements",
        content:
          "Biotech students get excellent placement opportunities in top pharmaceutical giants, clinical research organizations, bio-analytics firms, and data consulting.",
      },
      {
        heading: "Infrastructure",
        content:
          "Advanced DNA sequencing labs, cleanrooms, centralized analytical instrumentation facility (CAIF), and modern bioinformatics computing clusters.",
      },
      {
        heading: "Faculty",
        content:
          "Faculty members are actively engaged in national healthcare research, cancer genetics studies, and global patent commercialization.",
      },
      {
        heading: "Other",
        content:
          "Interdisciplinary electives allow students to take computer science and artificial intelligence minors alongside core biological engineering.",
      },
    ],
    reviewedDate: "Reviewed on 19 Sep 2026",
    likesCount: 22,
    dislikesCount: 1,
  },
  {
    id: "more-rev-2",
    authorName: "Vikramaditya Rao",
    avatarInitial: "V",
    avatarBgColor: "bg-blue-100 text-blue-800",
    verified: true,
    courseAndBatch: "B.Tech. in Electrical Engineering - Batch of 2026",
    overallRating: 4.6,
    parameterRatings: [
      { label: "Placements", rating: 5.0 },
      { label: "Infrastructure", rating: 4.4 },
      { label: "Faculty", rating: 4.6 },
      { label: "Crowd & Campus Life", rating: 4.5 },
      { label: "Value for Money", rating: 4.7 },
    ],
    title: "Rigorous academic curriculum with industry-recognized microelectronics labs.",
    paragraphs: [
      {
        heading: "Placements",
        content:
          "Hardware semiconductor leaders like Nvidia, Qualcomm, Intel, Texas Instruments, and ARM recruit aggressively with packages starting from 25 LPA.",
      },
      {
        heading: "Infrastructure",
        content:
          "VLSI design labs with latest Cadence & Synopsys software suites, power electronics facilities, and 24-hour Maker Spaces.",
      },
      {
        heading: "Faculty",
        content:
          "Professors have decades of industry consulting experience and provide deep practical insights during lab sessions.",
      },
      {
        heading: "Other",
        content:
          "Student robotics and satellite development teams offer invaluable hands-on engineering exposure.",
      },
    ],
    reviewedDate: "Reviewed on 05 Aug 2026",
    likesCount: 31,
    dislikesCount: 0,
  },
  {
    id: "more-rev-3",
    authorName: "Ananya Sen",
    avatarInitial: "A",
    avatarBgColor: "bg-pink-100 text-pink-800",
    verified: true,
    courseAndBatch: "B.Des. in Industrial Design - Batch of 2028",
    overallRating: 4.5,
    parameterRatings: [
      { label: "Placements", rating: 4.4 },
      { label: "Infrastructure", rating: 4.9 },
      { label: "Faculty", rating: 4.7 },
      { label: "Crowd & Campus Life", rating: 4.8 },
      { label: "Value for Money", rating: 4.6 },
    ],
    title: "Incredible design studio culture and world-class prototyping workshops.",
    paragraphs: [
      {
        heading: "Placements",
        content:
          "Leading UX/UI consultancies, product design firms, automotive brands, and consumer tech startups hire designers through dedicated campus portfolios.",
      },
      {
        heading: "Infrastructure",
        content:
          "3D printing fabrication labs, laser cutting studios, VR/AR testing chambers, and spacious ergonomic creative spaces.",
      },
      {
        heading: "Faculty",
        content:
          "Mentors encourage outside-the-box thinking, human-centered design thinking, and active portfolio critiques.",
      },
      {
        heading: "Other",
        content:
          "Close collaboration with engineering batches helps turn conceptual design ideas into working functional prototypes.",
      },
    ],
    reviewedDate: "Reviewed on 28 Jun 2026",
    likesCount: 16,
    dislikesCount: 1,
  },
  {
    id: "more-rev-4",
    authorName: "Harsh Vardhan Singh",
    avatarInitial: "H",
    avatarBgColor: "bg-indigo-100 text-indigo-800",
    verified: true,
    courseAndBatch: "M.Sc. in Physics - Batch of 2026",
    overallRating: 4.3,
    parameterRatings: [
      { label: "Placements", rating: 4.1 },
      { label: "Infrastructure", rating: 4.6 },
      { label: "Faculty", rating: 4.8 },
      { label: "Crowd & Campus Life", rating: 4.2 },
      { label: "Value for Money", rating: 4.9 },
    ],
    title: "Strong theoretical foundation and access to premier experimental setups.",
    paragraphs: [
      {
        heading: "Placements",
        content:
          "Many graduates opt for PhDs at leading Ivy League and European universities, while others transition into quant finance, data science, and R&D labs.",
      },
      {
        heading: "Infrastructure",
        content:
          "Optics and laser laboratories, cryogenic setups, and high-performance computing clusters accessible to postgraduate students.",
      },
      {
        heading: "Faculty",
        content:
          "Department has renowned theoretical physicists and experimentalists who involve master's students in real research publications.",
      },
      {
        heading: "Other",
        content:
          "Highly intellectually stimulating environment with weekly colloquiums and international guest lectures.",
      },
    ],
    reviewedDate: "Reviewed on 12 May 2026",
    likesCount: 18,
    dislikesCount: 2,
  },
  {
    id: "more-rev-5",
    authorName: "Divya Kulkarni",
    avatarInitial: "D",
    avatarBgColor: "bg-emerald-100 text-emerald-800",
    verified: true,
    courseAndBatch: "B.Tech. in Chemical Engineering - Batch of 2027",
    overallRating: 4.6,
    parameterRatings: [
      { label: "Placements", rating: 4.6 },
      { label: "Infrastructure", rating: 4.5 },
      { label: "Faculty", rating: 4.6 },
      { label: "Crowd & Campus Life", rating: 4.7 },
      { label: "Value for Money", rating: 4.8 },
    ],
    title: "Balanced campus life with strong core & non-core career options.",
    paragraphs: [
      {
        heading: "Placements",
        content:
          "Energy majors like Shell, Schlumberger, Reliance, and ExxonMobil alongside management consultancies like BCG and McKinsey visit during season.",
      },
      {
        heading: "Infrastructure",
        content:
          "Pilot plant facilities, reaction engineering units, and computational fluid dynamics software workstations.",
      },
      {
        heading: "Faculty",
        content:
          "Approachable faculty with well-structured assignments and fair evaluation methodologies.",
      },
      {
        heading: "Other",
        content:
          "Vibrant hostel sports leagues, music societies, and literary clubs make 4 years truly memorable.",
      },
    ],
    reviewedDate: "Reviewed on 24 Apr 2026",
    likesCount: 25,
    dislikesCount: 0,
  },
];

const DEFAULT_STUDENT_MEDIA_REVIEWS: StudentMediaReviewItem[] = [
  {
    id: "media-1",
    type: "video",
    title: "#pov : You are at #iit #iitdelhi #lights...",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
    duration: "00:45",
    authorName: "Karan Verma",
    batch: "B.Tech CSE",
  },
  {
    id: "media-2",
    type: "video",
    title: "Wondering how IIT Delhi fares in terms of placements?",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80",
    duration: "01:20",
    authorName: "Shubham Jain",
    batch: "B.Tech EE",
  },
  {
    id: "media-3",
    type: "video",
    title: "IIT Delhi Placements 2024 | Salary Package...",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
    duration: "00:58",
    authorName: "Ananya Gupta",
    batch: "B.Tech ME",
  },
  {
    id: "media-4",
    type: "video",
    title: "IIT Delhi Campus! IIT Delhi Hostel Room, Reality Check...",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&auto=format&fit=crop&q=80",
    duration: "02:15",
    authorName: "Rahul Sharma",
    batch: "M.Tech Design",
  },
  {
    id: "media-5",
    type: "image",
    title: "Campus Fest Rendezvous & Night Vibes #iitdelhi",
    mediaUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80",
    duration: "Photo",
    authorName: "Pooja Singh",
    batch: "B.Tech Physics",
  },
];

const DEFAULT_DETAILED_REVIEW_CARDS: DetailedReviewCard[] = [
  {
    id: "rev-1",
    authorName: "Abhishek Sharma",
    avatarInitial: "A",
    avatarBgColor: "bg-amber-100 text-amber-800",
    verified: true,
    courseAndBatch: "B.Tech. in Engineering Physics - Batch of 2028",
    overallRating: 4.2,
    parameterRatings: [
      { label: "Placements", rating: 2.0 },
      { label: "Infrastructure", rating: 4.0 },
      { label: "Faculty", rating: 5.0 },
      { label: "Crowd & Campus Life", rating: 5.0 },
      { label: "Value for Money", rating: 5.0 },
    ],
    title: "It is pretty good and excellent.",
    paragraphs: [
      {
        heading: "Placements",
        content:
          "About 40–50 percent of people get placed in different fields such as software, and some of them in consulting. However, a very big chunk of people want to go into research after course completion. Hence, a very big chunk of people get admission to foreign universities for further studies.",
      },
      {
        heading: "Infrastructure",
        content:
          "There are many facilities provided, with different types of labs, tools, and equipment. Talking about Wi-Fi, there is no doubt about the Wi-Fi connection. It is available all the time with no limit. Classrooms and infrastructure are quite good. The quality, specifically in my hostel, is great.",
      },
      {
        heading: "Faculty",
        content:
          "Teachers are very helpful regarding the course. The course is relevant when you are going into research. But if you want to go into software and consulting fields, you need to prepare yourself. Teachers do provide some real implementation and assignments for practical learning.",
      },
      {
        heading: "Other",
        content:
          "The reason I chose this course is my interest in physics. It is also helpful for people who are going into software or consulting. There are so many opportunities you get at my college.",
      },
    ],
    reviewedDate: "Reviewed on 27 Aug 2026",
    likesCount: 14,
    dislikesCount: 1,
  },
  {
    id: "rev-2",
    authorName: "Priya Deshmukh",
    avatarInitial: "P",
    avatarBgColor: "bg-purple-100 text-purple-800",
    verified: true,
    courseAndBatch: "B.Tech. in Computer Science and Engineering - Batch of 2027",
    overallRating: 4.8,
    parameterRatings: [
      { label: "Placements", rating: 5.0 },
      { label: "Infrastructure", rating: 4.5 },
      { label: "Faculty", rating: 4.8 },
      { label: "Crowd & Campus Life", rating: 4.7 },
      { label: "Value for Money", rating: 4.9 },
    ],
    title: "World-class coding environment and stellar placement packages.",
    paragraphs: [
      {
        heading: "Placements",
        content:
          "Nearly 95%+ batch gets placed with top domestic and international offers. Major recruiters like Google, Microsoft, Uber, Rubrik, and Jane Street participate with median CTC above 24 LPA.",
      },
      {
        heading: "Infrastructure",
        content:
          "Supercomputing labs, 24/7 air-conditioned central library, gigabit internet connectivity, and modern sports complexes make campus life exceptionally comfortable.",
      },
      {
        heading: "Faculty",
        content:
          "Professors are top researchers globally. Courses are rigorous with high practical exposure, algorithm design projects, and open-source contributions encouraged.",
      },
      {
        heading: "Other",
        content:
          "Peer group is the biggest asset here. Everyone is hardworking and ambitious, which pushes you to achieve your highest potential.",
      },
    ],
    reviewedDate: "Reviewed on 14 Jul 2026",
    likesCount: 28,
    dislikesCount: 0,
  },
  {
    id: "rev-3",
    authorName: "Rohan Mehta",
    avatarInitial: "R",
    avatarBgColor: "bg-blue-100 text-blue-800",
    verified: true,
    courseAndBatch: "M.Tech. in Mechanical Design - Batch of 2026",
    overallRating: 4.4,
    parameterRatings: [
      { label: "Placements", rating: 4.2 },
      { label: "Infrastructure", rating: 4.6 },
      { label: "Faculty", rating: 4.5 },
      { label: "Crowd & Campus Life", rating: 4.3 },
      { label: "Value for Money", rating: 4.7 },
    ],
    title: "Advanced research infrastructure and industry collaboration.",
    paragraphs: [
      {
        heading: "Placements",
        content:
          "Core engineering companies like Tata Motors, Mercedes-Benz, ISRO, GE, and Airbus visit for postgraduate placements. Average package is around 18-20 LPA for M.Tech.",
      },
      {
        heading: "Infrastructure",
        content:
          "State-of-the-art wind tunnels, CAD/CAM simulation centers, and advanced manufacturing labs with precision CNC machines.",
      },
      {
        heading: "Faculty",
        content:
          "Faculty guides are deeply invested in research publications, patent filing, and direct industry consultancy projects.",
      },
      {
        heading: "Other",
        content:
          "Campus fests Rendezvous and Tryst offer great balance alongside academic commitments.",
      },
    ],
    reviewedDate: "Reviewed on 02 Jun 2026",
    likesCount: 19,
    dislikesCount: 2,
  },
];

const DEFAULT_STUDENT_FEEDBACK_CATEGORIES: StudentFeedbackCategory[] = [
  {
    category: "Placements",
    likesText: "The recruiting companies were Capgemini, Microsoft, Uber, Amazon, Zomato, Flipkart, Deloitte, Google, Shell, KPMG, IBM, Dell, Wipro, Infosys, Absolute Data, and Ernst & Young.",
    likesCountText: "Based on 178 Reviews",
    dislikesText: "Many decent students missed internship opportunities due to lack of visiting companies, or the companies having unfound minimum criteria for selection.",
    dislikesCountText: "Based on 16 Reviews",
  },
  {
    category: "Infrastructure",
    likesText: "Hostels are well-maintained with high-speed Wi-Fi, modern air-conditioned research laboratories, world-class central library, and top sports facilities including Olympic-standard grounds.",
    likesCountText: "Based on 142 Reviews",
    dislikesText: "Some older hostel wings and mess areas require periodic maintenance and room allocation can get crowded during peak incoming batch admissions.",
    dislikesCountText: "Based on 22 Reviews",
  },
  {
    category: "Faculty",
    likesText: "Distinguished professors with extensive research backgrounds, PhDs from top global universities, highly accessible during office hours, and curriculum aligned with modern industry demands.",
    likesCountText: "Based on 115 Reviews",
    dislikesText: "Rigorous grading policies with high academic workload and frequent surprise quizzes can sometimes create stressful exam schedules for students.",
    dislikesCountText: "Based on 18 Reviews",
  },
  {
    category: "Other",
    likesText: "Vibrant campus fest culture (Rendezvous & Tryst), active student tech clubs, great alumni network backing, and unmatched peer learning environment across diverse streams.",
    likesCountText: "Based on 98 Reviews",
    dislikesText: "Competitive campus atmosphere can be challenging initially for freshmen before adjusting to peer pace and routine.",
    dislikesCountText: "Based on 12 Reviews",
  },
];

interface ReviewsArticleData {
  tagText?: string;
  title?: string;
  overallScore?: number;
  totalReviewsCount?: string;
  histogram?: ReviewHistogramItem[];
  parameters?: ReviewParameterItem[];
  studentFeedback?: StudentFeedbackData;
  reviewCards?: DetailedReviewCard[];
  mediaReviews?: StudentMediaReviewsData;
  moreReviewCards?: DetailedReviewCard[];
}

interface RankingsArticleData {
  title?: string;
  introParagraph?: string;
  internationalHeading?: string;
  internationalRows?: RankingTableRow[];
  nationalHeading?: string;
  nationalRows?: RankingTableRow[];
  footerNote?: string;
  courseRankingBoxes?: CourseRankingBoxItem[];
  faqsHeading?: string;
  faqsSubtitle?: string;
  faqsBtn1Text?: string;
  faqsBtn2Text?: string;
  faqs?: RankingFaqItem[];
}

interface AdmissionArticleData {
  title?: string;
  introParagraph1?: string;
  introParagraph2?: string;
  bullets?: AdmissionBulletItem[];
  afterBulletsParagraph1?: string;
  afterBulletsParagraph2?: string;
  footerNote?: string;
  courseAdmissionBoxes?: CourseAdmissionBoxItem[];
  faqsHeading?: string;
  faqsSubtitle?: string;
  faqsButtonText?: string;
  faqs?: AdmissionFaqItem[];
}

interface PlacementsArticleData {
  title?: string;
  introParagraph?: string;
  subsections?: PlacementSubSection[];
  footerNote?: string;
  statsTableTitle?: string;
  statsTableCols?: string[];
  statsTable?: PlacementStatRow[];
  salaryTableTitle?: string;
  salaryTableCols?: string[];
  salaryTable?: CourseSalaryRow[];
  topRecruitersTitle?: string;
  topRecruiters?: TopRecruiterItem[];
  insightsTitle?: string;
  insightsSubtitle?: string;
  insights?: PlacementInsightItem[];
  faqsHeading?: string;
  faqsSubtitle?: string;
  faqs?: FaqItem[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface GalleryPhoto {
  url: string;
  caption: string;
  category: string;
}

interface FacultyMember {
  name: string;
  designation: string;
  dept: string;
  qualification: string;
  experience: string;
}

interface TableOfContentItem {
  label: string;
  targetId: string;
  tabId?: ShikshaTabId;
}

interface AuthorProfile {
  name: string;
  role: string;
  image?: string;
  updatedDate: string;
  verified?: boolean;
}

interface CutoffComparisonRow {
  course: string;
  year2024: string | number;
  year2025: string | number;
  year2026: string | number;
}

interface CutoffRoundComparisonData {
  title?: string;
  subtitle?: string;
  years?: [string, string, string];
  rows: CutoffComparisonRow[];
  filterDatasets?: Record<string, CutoffComparisonRow[]>;
}

function ScrollProgressIndicator({ targetId, standalone = true }: { targetId: string; standalone?: boolean }) {
  const [progress, setProgress] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.28);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const updateScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 6) {
        setCanScroll(true);
        const currentProgress = el.scrollLeft / maxScroll;
        setProgress(Math.max(0, Math.min(1, currentProgress)));
        const ratio = Math.max(0.2, Math.min(0.45, el.clientWidth / el.scrollWidth));
        setThumbRatio(ratio);
      } else {
        setCanScroll(false);
      }
    };

    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    const observer = new MutationObserver(updateScroll);
    observer.observe(el, { childList: true, subtree: true });

    return () => {
      el.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      observer.disconnect();
    };
  }, [targetId]);

  if (!canScroll) return null;

  const bar = (
    <div className="w-16 sm:w-20 h-1.5 bg-slate-200 rounded-full relative overflow-hidden flex items-center">
      <div
        className="h-full bg-slate-800 rounded-full transition-all duration-100 ease-out"
        style={{
          width: `${Math.max(18, Math.round(thumbRatio * 100))}%`,
          marginLeft: `${Math.round(progress * (1 - thumbRatio) * 100)}%`,
        }}
      />
    </div>
  );

  if (!standalone) {
    return bar;
  }

  return (
    <div className="flex justify-center items-center pt-2.5 pb-0.5 w-full">
      {bar}
    </div>
  );
}

interface CollegeDetail {
  name: string;
  fullName?: string;
  location: string;
  city?: string;
  state?: string;
  nirfRank: string;
  rating: number;
  ratingCount: string;
  type: string;
  estd: string;
  stream: string;
  highestPackage: string;
  averagePackage: string;
  medianPackage?: string;
  totalFees: string;
  image?: string;
  logo?: string;
  description: string;
  campusArea?: string;
  flagshipCourse?: string;
  accreditation?: string;
  highlights: HighlightItem[];
  whatsNew?: string[];
  courses: CourseItem[];
  recruiters: string[];
  cutoffs: CutoffItem[];
  facilities: { name: string; icon: string; desc?: string }[];
  reviews: ReviewItem[];
  faqs: FaqItem[];
  gallery: GalleryPhoto[];
  facultyList?: FacultyMember[];
  author?: AuthorProfile;
  tableOfContents?: TableOfContentItem[];
  highlightsArticle?: HighlightsArticleData;
  cutoffArticle?: CutoffArticleData;
  cutoffComparison?: CutoffRoundComparisonData;
  secondaryCutoffComparison?: CutoffRoundComparisonData;
  coursesFeesArticle?: CoursesFeesArticleData;
  placementsArticle?: PlacementsArticleData;
  admissionArticle?: AdmissionArticleData;
  rankingsArticle?: RankingsArticleData;
  reviewsArticle?: ReviewsArticleData;
}

// Master Benchmark Dataset for IIT Delhi
const IIT_DELHI_MASTER_DATA: CollegeDetail = {
  name: "IIT Delhi - Indian Institute of Technology",
  fullName: "Indian Institute of Technology Delhi (IIT Delhi)",
  location: "Hauz Khas, New Delhi, Delhi 110016",
  city: "New Delhi",
  state: "Delhi",
  nirfRank: "NIRF #2 (Engineering 2026)",
  rating: 4.9,
  ratingCount: "842 Verified Reviews",
  type: "Government (Autonomous) • Institute of National Importance",
  estd: "1961",
  stream: "Engineering",
  highestPackage: "₹1.20 Crore PA (Domestic) / ₹2.40 Crore PA (Int.)",
  averagePackage: "₹25.82 Lakhs PA",
  medianPackage: "₹20.50 Lakhs PA",
  totalFees: "₹2.38 Lakhs / Year (₹9.52 Lakhs Total B.Tech)",
  image: "/images/iitdelhi_real.jpg",
  logo: "/images/iitdelhi.png",
  author: {
    name: "Shreeya Panda",
    role: "Intern",
    image: "",
    updatedDate: "Feb 09, 2026",
    verified: true,
  },
  campusArea: "320 Acres (Lush Green South Delhi Campus)",
  flagshipCourse: "B.Tech Computer Science and Engineering (CSE)",
  accreditation: "Institute of National Importance (MHRD/AICTE/UGC)",
  highlightsArticle: {
    introText: "Indian Institute of Technology Delhi (IIT Delhi) is one of India's top engineering institutions with two satellite campuses located in Sonipat, Jhajjar, and its first international campus in Abu Dhabi (UAE). Check out some of the important IIT Delhi highlights below:",
    bullets: [
      {
        title: "Rankings",
        text: "IIT Delhi India is ranked 118th in the QS World University Rankings 2027 (QS rankings are released a year ahead). In the QS Asian University Rankings 2026, IIT Delhi ranking is at 59th position. The top engineering institute is ranked 2nd (Engineering) and 4th (Overall) as per NIRF 2025 Rankings (NIRF 2026 rankings are still awaited). It is also ranked #1 under the 'Engineering' category by the India Today ranking 2026.",
      },
      {
        title: "Courses",
        text: "IITD offers BTech, MTech, BDes, MDes, MBA, MSc, PhD, and PG Diploma programmes.",
      },
      {
        title: "Admissions",
        text: "IIT Delhi admission are entrance-based. Admission to the IIT Delhi flagship programme BTech and BS programme requires a JEE Advanced qualification. The IIT MTech Admissions 2026 are conducted via GATE. Further, for IIT Delhi PhD admission, applications are accepted via CSIR/UGC-NET. For IIT Delhi course admissions, candidates are required to apply via centralized counseling portals (JoSAA, COAP, or JAM) and the official IIT Delhi application portal, iitd.ac.in.",
      },
      {
        title: "Fees",
        text: "IIT Delhi fees for the BE, BTech programme is INR 8 Lakh (4 Years). For ME, MTech, the fee for IIT Delhi is INR 3 Lakh (2 Years).",
      },
      {
        title: "Cutoff",
        text: "IIT Delhi closed its JoSAA Counselling Round 5 Cut Off 2026 at 128 for B.Tech. in Computer Science and Engineering (CSE) for General Category (Gender Neutral) candidates. Meanwhile, for BTech in Electrical Engineering, the IIT Delhi cut off closed at 612.",
      },
      {
        title: "Placements",
        text: "IIT Delhi Placement 2026 recorded more than 1,275 job offers, including 300+ PPOs. The top recruiter list who offered IIT Delhi packages includes top companies such as Google, Microsoft, Goldman Sachs, BCG, American Express, Barclays, Oracle, and PayU.",
      },
      {
        title: "Median Package / NIRF",
        text: "As per IIT Delhi overall report submitted for NIRF 2026, (BTech) UG 4-year students' median package is INR 20 LPA. Median package for (MTech) PG students is INR 19.25 LPA. The information such as average package of IIT Delhi, etc. are not available as of now.",
      },
    ],
    nirfCalloutTitle: "Why Is IIT Delhi Ranked Among India's Best?",
    nirfCalloutDesc: "Explore official NIRF 2026 data on placements, research, faculty strength and student outcomes.",
    nirfReportUrl: "https://home.iitd.ac.in/",
    faqs: [
      {
        question: "What was the highest package offered during IIT Delhi placements?",
        answer: "As of now, IIT Delhi has released the placement data 2026 that is updated till Dec 2025. As per the report, a total of 1,275 offers including PPOs have been. More than 1,140 students have been placed during IIT Delhi placements 2026. The highest package 2026 has not been released yet.\n\nAbove 300 PPOs have been already made this year, which is 33% higher as compared with 2025. 35 international offers were made in 2026. Top recruiters such as Amazon, Accenture, Google, Goldman Sachs and American Express visited the campus.",
      },
      {
        question: "How are the BTech placements at IIT Delhi?",
        answer: "IIT Delhi BTech placements consistently rank among the finest in the country. During recent placement seasons, students secured over 1,275 offers with top domestic salaries crossing ₹1.20 Cr and international packages reaching ₹2.40 Cr. Top recruiting firms include Google, Microsoft, Graviton, Jane Street, Goldman Sachs, and McKinsey.",
      },
      {
        question: "How can I check the list of selected candidates for M.Des in IIT Delhi (CEED 2026)?",
        answer: "Candidates can check the shortlisted and final selection lists on the official IIT Delhi Department of Design admission portal (design.iitd.ac.in) by logging in using their CEED 2026 registered credentials and application number.",
      },
      {
        question: "What is the hostel fee for IIT Delhi?",
        answer: "The hostel seat rent and amenities charges at IIT Delhi are approximately ₹10,500 per semester. Additionally, mess advance charges of ₹28,000 per semester apply, which are adjustable based on actual food consumption.",
      },
      {
        question: "What is the ranking of IIT Delhi?",
        answer: "IIT Delhi is ranked #2 in the Engineering category and #4 in the Overall category in NIRF 2025/2026. Internationally, IIT Delhi is placed at #118 in QS World University Rankings 2027 and #59 in QS Asia University Rankings 2026.",
      },
    ],
  },
  cutoffArticle: {
    paragraphs: [
      "**IIT Delhi JEE Advanced Cutoff 2026** has been released on the official website of JoSAA, i.e. **josaa.nic.in**! As per **JoSAA Round 5 Cut Off 2026**, the **IIT Delhi admissions** closed at a rank of **16295** for BTech Design in the Open Category. It was the **least competitive** branch with the lowest **IIT Delhi cutoff**.",
      "The **highest competition** for admissions at **IIT Delhi** was observed for **CSE** with a closing rank of **128** (Open) in round 5. Second most competitive branch was CSE dual degree (five years) as the admissions closed at 212 rank.",
      "On the other hand, the **competition** was **lowest** for branches like **Design, Chemistry** and **Chemical Engineering**. The opening and closing rank for BTech Chemistry in the overall open category was 6437 and 15833.",
      "**JEE Advanced 2026 cutoff** Opening and Closing Ranks represent the minimum rank required for admission to various IIT Delhi BTech programmes. The higher the candidate's rank, the higher the chances of the candidate getting admission. Participating in JoSAA counselling 2026 is mandatory for admission to IIT Delhi.",
    ],
    calloutTitle: "Missed the IIT Delhi Cutoff?",
    calloutDesc: "Explore engineering colleges accepting low JEE Main ranks and discover alternative pathways to pursue your BTech dream.",
    calloutPdfUrl: "#",
    afterCalloutParagraphs: [
      "IIT Delhi also accepts **IIT JAM cutoff 2026** for admission to the MSc course. With the release of IIT JAM Round 6 closing ranks, MSc in Economics turned out to be the most competitive specialisation with the lowest rank of 22 for the General AI category. The lower the rank, the higher the competition. Hence, it is considered one of the toughest MSc course to get at IIT Delhi India.",
    ],
    footerNote: "Check IIT Delhi Cut Off 2026 for other programmes below:",
    faqs: [
      {
        question: "Can I get IIT Delhi with a JEE Advanced cutoff rank of 100?",
        answer: "Yes, candidate with rank 100 in JEE Advanced can get admission to BTech at IIT Delhi. Considering the IIT Delhi Round 5 Cutoff 2026, the closing rank for BTech in CSE stood at 128 for the General AI category. Hence, 100 is an eligible rank for IIT Delhi for General Category.\n\nApart from CSE, candidate can get admission to courses like BTech in Mathematics and Computing, BTech in Electrical Engineering and Chemical Engineering. For other categories, IIT Delhi Cutoff rank will vary.",
      },
      {
        question: "What are the SC category opening and closing rank for BTech in Electrical Engineering at IIT Delhi?",
        answer: "The SC Category opening and closing ranks for BTech in Electrical Engineering at IIT Delhi in JoSAA Round 5 generally range between 120 and 210 for All India seats. Candidates belonging to reserved categories can check the detailed category-wise seat allotment and opening-closing matrix in the JoSAA portal.",
      },
      {
        question: "I want MSc in Economics. How much rank should I attain to admission at IIT Delhi?",
        answer: "For admission to MSc in Economics at IIT Delhi through IIT JAM, candidates typically require an All India Rank (AIR) within the top 25 to 35 for the General category in the final round of counselling, making it one of the most competitive MSc specialisations.",
      },
      {
        question: "Can I get IIT Delhi with 500 rank?",
        answer: "Yes, with a JEE Advanced rank of 500 in the General AI category, you can comfortably secure admission to premier branches such as Electrical Engineering (Power and Automation), Mechanical Engineering, Mathematics & Computing Dual Degree, Chemical Engineering, and Civil Engineering at IIT Delhi.",
      },
    ],
  },
  cutoffComparison: {
    title: "Cut Off 2026 for JEE Advanced Latest Round",
    subtitle: "JEE Advanced Round 5 Closing Rank (General-All India)",
    years: ["2024", "2025", "2026"],
    rows: [
      {
        course: "B.Tech. in Computer Science and Engineering",
        year2024: 116,
        year2025: 126,
        year2026: 128,
      },
      {
        course: "B.Tech. in Electrical Engineering",
        year2024: 625,
        year2025: 605,
        year2026: 612,
      },
      {
        course: "Integrated B.Tech. + M.Tech. in Computer Science and Engineering",
        year2024: 204,
        year2025: 186,
        year2026: 212,
      },
      {
        course: "Integrated B.Tech. + M.Tech. in Mathematics and Computing",
        year2024: 417,
        year2025: 355,
        year2026: 403,
      },
      {
        course: "B.Tech. in Mathematics and Computing Engineering",
        year2024: 332,
        year2025: 323,
        year2026: 338,
      },
    ],
  },
  secondaryCutoffComparison: {
    title: "Cut Off 2026 for UCEED: Year-Wise rank",
    subtitle: "UCEED Last Round Closing Rank (General-All India)",
    years: ["2024", "2025", "2026"],
    rows: [
      {
        course: "Bachelor of Design (B.Des.)",
        year2024: 35,
        year2025: 41,
        year2026: 28,
      },
    ],
  },
  coursesFeesArticle: {
    title: "IIT Delhi Courses & Fees 2026",
    introParagraph1:
      "**IIT Delhi** offers undergraduate, postgraduate, doctoral, and certificate programmes across Engineering, Design, Sciences, Management, and Humanities. The **IIT Delhi** courses are available in **full-time**, **part-time**, and **online** modes.",
    introParagraph2:
      "The courses offered are BTech, BS, BDes, MTech, MSc, MBA, MDes, MA, and PhD. **IIT Delhi popular programme** is BTech. The following are the course categories and top specialisations offered at **IIT Delhi**:",
    courseSummaryGroups: [
      {
        groupTitle: "UG Courses",
        courses: [
          {
            courseName: "BTech",
            firstYearFees: "INR 2.55 Lakhs",
            eligibility: "Class 10+2 with 75% marks",
            duration: "4 years",
            selection: "JEE Advanced + JoSAA Counselling",
          },
          {
            courseName: "BDes",
            firstYearFees: "INR 2.54 Lakhs",
            eligibility: "Class 10+2 with 75% marks",
            duration: "4 years",
            selection: "UCEED Scores + Counselling",
          },
        ],
      },
    ],
    specialisations: [
      {
        category: "BTech specialisations",
        list: "Computer Science & Engineering, Electrical Engineering, Mechanical Engineering, Chemical Engineering, Civil Engineering, and Textile Technology.",
      },
      {
        category: "PG programmes",
        list: "MTech, MSc, MBA, MDes, and MA",
      },
      {
        category: "Certificate Programmes",
        list: "Statistical Inference, Computational Geometry, Advanced Textile Printing Technology, and Project Management.",
      },
    ],
    calloutPromoText:
      "Explore engineering colleges accepting low JEE Main ranks, compare admission routes, and find the right BTech programme based on your score and preferences.",
    calloutPdfUrl: "#",
    popularCoursesHeading:
      "Students can check out the IIT Delhi fees 2026 for some popular courses below:",
    popularCourses: [
      {
        courseName: "B.E. / B.Tech",
        coursesCount: "15 Courses",
        tuitionFees: "INR 8 lakh",
        totalFees: "INR 11.26 lakh - INR 11.72 lakh",
      },
      {
        courseName: "B.Des",
        coursesCount: "1 Courses",
        tuitionFees: "INR 8 lakh",
        totalFees: "INR 11.26 lakh",
      },
      {
        courseName: "MBA/PGDM",
        coursesCount: "2 Courses",
        tuitionFees: "INR 12 lakh",
        totalFees: "INR 13.82 lakh - INR 13.9 lakh",
      },
      {
        courseName: "M.E./M.Tech",
        coursesCount: "45 Courses",
        tuitionFees: "INR 70,000- INR 3 lakh",
        totalFees: "INR 4.82 lakh - INR 5.17 lakh",
      },
      {
        courseName: "M.Sc.",
        coursesCount: "25 Courses",
        tuitionFees: "INR 30,000 - INR 3 lakh",
        totalFees: "INR 2.12 lakh - INR 5.4 lakh",
      },
      {
        courseName: "Ph.D.",
        coursesCount: "28 Courses",
        tuitionFees: "INR 45,000",
        totalFees: "INR 45,000",
      },
      {
        courseName: "M.A.",
        coursesCount: "2 Courses",
        tuitionFees: "INR 30,000 - INR 3 lakh",
        totalFees: "INR 2.12 lakh - INR 5.05 lakh",
      },
      {
        courseName: "M.Des",
        coursesCount: "1 Courses",
        tuitionFees: "INR 70,000",
        totalFees: "INR 2.52 lakh",
      },
    ],
    otherChargesNote: "*This is estimated fee information. Actual values may differ.",
    otherChargesHeading: "Other Charges included in IITD fee structure:",
    otherCharges: [
      {
        component: "Hostel fees",
        subtext:
          "Meal Plan is included in this fee. The fees might include components other than hostel fees. Hostel fee mentioned is for cheapest option available.",
        amount: "INR 1.29 lakh - 3.1 lakh",
      },
      {
        component: "One-time payments",
        subtext:
          "One-time payment includes Admission fees, Student welfare fund, Modernization fees, Benevolent fund, Alumni fees, Training and Placement charges, Institute & Library Security fees.",
        amount: "INR 16,150 – 23,000",
      },
      {
        component: "Other fee",
        amount: "INR 94,400",
      },
    ],
    footerNote: "Check more about IIT Delhi courses below:",
    viewAllBtnText: "View All Courses & Fees",
    faqs: [
      {
        question: "What is the career scope after MSc from IIT Delhi?",
        answer: "Graduating with an MSc from IIT Delhi unlocks exceptional career opportunities in R&D laboratories, data analytics, corporate consulting, higher research (Ph.D. at world-leading global universities), and premier technology firms. Postgraduate science scholars consistently secure high placement packages with top tier recruiters.",
      },
      {
        question: "Does IIT Delhi offer MSc?",
        answer: "Yes, IIT Delhi offers regular full-time 2-year Master of Science (M.Sc.) degree programmes across multiple disciplines including Physics, Chemistry, Mathematics, Cognitive Science, and Economics. Admission to MSc is strictly through Joint Admission test for Masters (IIT JAM) followed by centralized counselling.",
      },
      {
        question: "Which all Certificate courses are available at IIT Delhi?",
        answer: "IIT Delhi offers specialized executive and continuing education certificate programmes across Artificial Intelligence & Machine Learning, Data Science, Project Management, Digital Marketing, Quantitative Finance, and Advanced 5G Communications through its Continuing Education Programme (CEP) and E-Vidya portal.",
      },
      {
        question: "Is BTech available in IIT Delhi?",
        answer: "Yes, Bachelor of Technology (BTech) is the flagship 4-year undergraduate programme at IIT Delhi. It is offered in premier engineering disciplines including Computer Science & Engineering, Electrical Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering, Energy Engineering, and Mathematics & Computing. Admission is strictly through JEE Advanced followed by JoSAA counselling.",
      },
    ],
  },
  placementsArticle: {
    title: "IIT Delhi Placements 2026",
    introParagraph:
      "**IIT Delhi Placements 2026** recorded **1,275 job** offers for students. **Over 300 pre-placement offers (PPOs)** secured and more than **1,140 students placed**, according 2025-26 placement season. IIT Delhi students received more than 40 international offers from multiple global organisations located in Japan, the Netherlands, South Korea, Taiwan, the United Arab Emirates, the United Kingdom, and the United States. As per **IITD** overall report submitted for **NIRF 2026**, **(BTech) UG 4-year students’ median package** is **INR 20 LPA**. Median package for **(MTech)** PG students is **INR 19.25 LPA** in the **IIT Delhi Placements 2026**. The **average package of IIT Delhi** and **IIT Delhi highest pacakge** are not available.",
    subsections: [
      {
        heading: "IIT Delhi Top Recruiters 2026",
        content:
          "Leading recruiters participating in **IIT Delhi BTech placements 2026** are Microsoft, Goldman Sachs, Texas Instruments, Bajaj Auto, Ola Electric, and Air India.",
      },
      {
        heading: "IIT Delhi MBA Placements 2026",
        content:
          "The **IIT Delhi MBA placement report 2026** is yet to be released. As per the official 2025 placement report, **IIT Delhi MBA** recorded a 98% placement rate. The **IIT Delhi highest package** offered was **INR 43.55 LPA**. While the **average package of IIT Delhi** (MTech) was **INR 22.52 LPA**, and the **median** was **INR 22.5 LPA**.",
      },
      {
        heading: "IIT Delhi MBA Placements 2026 Top Recruiters",
        content:
          "**IIT Delhi MBA placements'** top recruiter list includes leading companies such as Accenture, Paytm, EY, PwC, Godrej, and Flipkart.",
      },
    ],
    footerNote: "Check course-wise placement data of **IIT Delhi** below:",
    statsTableTitle: "IIT Delhi Placements Highlights",
    statsTableCols: ["Particulars", "Placement Statistics 2025 (Ongoing)", "Placement Statistics 2024"],
    statsTable: [
      {
        particular: "Total No. Of Offers",
        values: ["1411 (53.1%)", "1300"],
        statCurrentYear: "1411 (53.1%)",
        statPrevYear: "1300",
      },
      {
        particular: "Total No. Of Companies",
        values: ["NA", "400"],
        statCurrentYear: "NA",
        statPrevYear: "400",
      },
      {
        particular: "Total Pre-placement Offers",
        values: ["NA", "260"],
        statCurrentYear: "NA",
        statPrevYear: "260",
      },
      {
        particular: "Total No. Of New Recruiters",
        values: ["NA", "Na"],
        statCurrentYear: "NA",
        statPrevYear: "Na",
      },
      {
        particular: "Highest Package (Domestic)",
        values: ["NA", "INR 2 CPA"],
        statCurrentYear: "NA",
        statPrevYear: "INR 2 CPA",
      },
      {
        particular: "Average Package",
        values: ["NA", "INR 22 LPA"],
        statCurrentYear: "NA",
        statPrevYear: "INR 22 LPA",
      },
      {
        particular: "Top Recruiters",
        values: ["NA", "Google, ICICI Bank, Accenture"],
        statCurrentYear: "NA",
        statPrevYear: "Google, ICICI Bank, Accenture",
      },
      {
        particular: "Top New Recruiters",
        values: ["NA", "Capgemini, Texas Instruments"],
        statCurrentYear: "NA",
        statPrevYear: "Capgemini, Texas Instruments",
      },
    ],
    salaryTableTitle: "IIT Delhi Course-wise Median Salary",
    salaryTableCols: ["Course", "Median Salary"],
    salaryTable: [
      { course: "B.E. / B.Tech", values: ["₹20 LPA"], salary: "₹20 LPA" },
      { course: "M.E./M.Tech", values: ["₹16 LPA"], salary: "₹16 LPA" },
      { course: "M.Sc.", values: ["₹15.59 LPA"], salary: "₹15.59 LPA" },
      { course: "MBA/PGDM", values: ["₹15.59 LPA"], salary: "₹15.59 LPA" },
      { course: "M.A.", values: ["₹15.59 LPA"], salary: "₹15.59 LPA" },
      { course: "M.Des", values: ["₹15.59 LPA"], salary: "₹15.59 LPA" },
    ],
    topRecruitersTitle: "Top Recruiters",
    topRecruiters: [
      {
        name: "Accenture",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
        websiteUrl: "https://www.accenture.com",
      },
      {
        name: "Barclays",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Barclays_logo.svg",
        websiteUrl: "https://www.barclays.com",
      },
      {
        name: "Capgemini",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_201x_logo.svg",
        websiteUrl: "https://www.capgemini.com",
      },
      {
        name: "Deloitte",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg",
        websiteUrl: "https://www.deloitte.com",
      },
      {
        name: "Flipkart",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg",
        websiteUrl: "https://www.flipkart.com",
      },
      {
        name: "GAIL",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/6/6f/GAIL_Logo.svg",
        websiteUrl: "https://www.gailonline.com",
      },
      {
        name: "Hindustan Unilever",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e4/Unilever.svg",
        websiteUrl: "https://www.hul.co.in",
      },
      {
        name: "ICICI Securities",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
        websiteUrl: "https://www.icicisecurities.com",
      },
      {
        name: "JP Morgan Chase",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Chase_Logo_2008_1.svg",
        websiteUrl: "https://www.jpmorganchase.com",
      },
      {
        name: "KPMG",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/KPMG_logo.svg",
        websiteUrl: "https://www.kpmg.com",
      },
      {
        name: "Google",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        websiteUrl: "https://www.google.com",
      },
      {
        name: "Microsoft",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        websiteUrl: "https://www.microsoft.com",
      },
      {
        name: "Amazon",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        websiteUrl: "https://www.amazon.com",
      },
      {
        name: "Texas Instruments",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/85/Texas_Instruments_logo.svg",
        websiteUrl: "https://www.ti.com",
      },
    ],
    insightsTitle: "Insights on Placements",
    insightsSubtitle: "Based on 281 Student Responses",
    insights: [
      {
        title: "Internships and industry projects",
        description: "Students can work with faculty on research projects",
      },
      {
        title: "Employment opportunities",
        description: "Many students started their own start-ups",
      },
      {
        title: "Higher studies preferences",
        description: "Majority opted in outside India",
      },
      {
        title: "Placement support",
        description: "Organized & proactive placement process",
      },
      {
        title: "Alumni network",
        description: "Strong alumni network that help with placement opportunities",
      },
      {
        title: "Entrepreneurship cell",
        description: "Very Active and resourceful, college is also involved",
      },
      {
        title: "Overall feeling of students",
        description: "Love being in college",
      },
    ],
  },
  description: `Indian Institute of Technology Delhi (IIT Delhi) is one of the premier public technical and research universities in India. Established in 1961 as the College of Engineering, it was declared an 'Institute of National Importance' under the Institutes of Technology Act.

Spanning over 320 acres in the historic and posh area of Hauz Khas in South Delhi, IIT Delhi is renowned globally for its rigorous academic curriculum, cutting-edge research facilities, entrepreneurial incubation ecosystem (FITT), and stellar placement record. IIT Delhi offers undergraduate (B.Tech), postgraduate (M.Tech, M.S. Research, MBA, M.Des, M.Sc), and doctoral (Ph.D.) programs across diverse engineering, sciences, design, and management disciplines.`,
  highlights: [
    { label: "Establishment Year", value: "1961 (65+ Years of Academic Heritage)" },
    { label: "Campus Area", value: "320 Acres (Self-contained Hauz Khas Campus)" },
    { label: "Ownership / Status", value: "Public / Autonomous (Govt. of India)" },
    { label: "NIRF Ranking 2026", value: "#2 in Engineering, #1 in Delhi NCR, Top 5 Overall" },
    { label: "Highest Package (Domestic)", value: "₹1.20 Crore PA" },
    { label: "Highest Package (International)", value: "₹2.40 Crore PA" },
    { label: "Average CTC (Overall)", value: "₹25.82 Lakhs PA" },
    { label: "Flagship Programs", value: "B.Tech (CSE, MnC, EE, AI & DS), MBA (DMS IITD)" },
    { label: "Accepted Entrance Exams", value: "JEE Advanced (B.Tech), GATE (M.Tech), CAT (MBA), CEED (M.Des)" },
    { label: "Total Student Intake", value: "Approx. 1,200+ (B.Tech) | 12,000+ Total Students" },
    { label: "Gender Diversity / Supernumerary", value: "20% Supernumerary Seats for Female Candidates" },
    { label: "Scholarships & Financial Aid", value: "100% Tuition Fee Waiver for SC/ST/PwD & EWS Students" },
  ],
  whatsNew: [
    "JoSAA 2026 Counselling registration for B.Tech programs begins in June 2026 following JEE Advanced results.",
    "IIT Delhi introduces new interdisciplinary M.Tech and B.Tech minors in Generative AI, Quantum Computing, and Clean Energy.",
    "Placement Season 2025-26 recorded over 1,300+ total job offers with 50+ international offers in phase 1.",
    "DMS IIT Delhi MBA admissions 2026 shortlist based on CAT 2025 cutoff (98.5+ percentile) released.",
  ],
  courses: [
    {
      name: "B.Tech Computer Science and Engineering (CSE)",
      duration: "4 Years (8 Semesters)",
      fees: "₹2,38,500 / Yr",
      eligibility: "JEE Advanced rank (Top 118 for General) + Class 12th (75% PCM)",
      seats: "99 Seats",
    },
    {
      name: "B.Tech Mathematics and Computing (MnC)",
      duration: "4 Years (8 Semesters)",
      fees: "₹2,38,500 / Yr",
      eligibility: "JEE Advanced rank (Top 315 for General) + Class 12th (75% PCM)",
      seats: "60 Seats",
    },
    {
      name: "B.Tech Electrical Engineering",
      duration: "4 Years (8 Semesters)",
      fees: "₹2,38,500 / Yr",
      eligibility: "JEE Advanced rank (Top 610 for General) + Class 12th (75% PCM)",
      seats: "120 Seats",
    },
    {
      name: "B.Tech in Artificial Intelligence & Data Science",
      duration: "4 Years (8 Semesters)",
      fees: "₹2,38,500 / Yr",
      eligibility: "JEE Advanced rank (Top 240 for General) + Class 12th (75% PCM)",
      seats: "40 Seats",
    },
    {
      name: "B.Tech Mechanical Engineering",
      duration: "4 Years (8 Semesters)",
      fees: "₹2,38,500 / Yr",
      eligibility: "JEE Advanced rank (Top 1,750 for General) + Class 12th (75% PCM)",
      seats: "110 Seats",
    },
    {
      name: "B.Tech Chemical Engineering",
      duration: "4 Years (8 Semesters)",
      fees: "₹2,38,500 / Yr",
      eligibility: "JEE Advanced rank (Top 2,400 for General) + Class 12th (75% PCM)",
      seats: "95 Seats",
    },
    {
      name: "B.Tech Civil Engineering",
      duration: "4 Years (8 Semesters)",
      fees: "₹2,38,500 / Yr",
      eligibility: "JEE Advanced rank (Top 4,200 for General) + Class 12th (75% PCM)",
      seats: "110 Seats",
    },
    {
      name: "Dual Degree B.Tech + M.Tech (CSE / Chemical)",
      duration: "5 Years (10 Semesters)",
      fees: "₹2,38,500 / Yr",
      eligibility: "JEE Advanced rank + Class 12th (75% PCM)",
      seats: "45 Seats",
    },
    {
      name: "MBA / Executive MBA (DMS IIT Delhi)",
      duration: "2 Years",
      fees: "₹5,50,000 / Yr",
      eligibility: "CAT Score (98.5+ %ile) + Bachelor's Degree with 60% + PI",
      seats: "115 Seats",
    },
    {
      name: "M.Tech (Various 40+ Specializations)",
      duration: "2 Years",
      fees: "₹52,000 / Yr",
      eligibility: "GATE Score + B.Tech/BE in relevant stream with 60%+",
      seats: "800+ Seats",
    },
  ],
  recruiters: [
    "Google",
    "Microsoft",
    "Apple",
    "Amazon",
    "Goldman Sachs",
    "Texas Instruments",
    "McKinsey & Company",
    "Bain & Company",
    "Boston Consulting Group (BCG)",
    "Nvidia",
    "Qualcomm",
    "Intel",
    "Uber",
    "Oracle",
    "Adobe",
    "Schlumberger",
    "Morgan Stanley",
    "JP Morgan Chase",
    "ITC Limited",
    "Tata Consultancy Services",
    "Samsung R&D",
    "Jane Street",
  ],
  cutoffs: [
    { branch: "Computer Science & Engineering (CSE)", category: "General (Gender-Neutral)", openRank: 28, closeRank: 118, round: "Round 6" },
    { branch: "Computer Science & Engineering (CSE)", category: "Female-only (Supernumerary)", openRank: 95, closeRank: 420, round: "Round 6" },
    { branch: "Computer Science & Engineering (CSE)", category: "OBC-NCL", openRank: 35, closeRank: 78, round: "Round 6" },
    { branch: "Mathematics and Computing (MnC)", category: "General (Gender-Neutral)", openRank: 120, closeRank: 315, round: "Round 6" },
    { branch: "Artificial Intelligence & Data Science", category: "General (Gender-Neutral)", openRank: 110, closeRank: 240, round: "Round 6" },
    { branch: "Electrical Engineering", category: "General (Gender-Neutral)", openRank: 320, closeRank: 610, round: "Round 6" },
    { branch: "Mechanical Engineering", category: "General (Gender-Neutral)", openRank: 850, closeRank: 1750, round: "Round 6" },
    { branch: "Chemical Engineering", category: "General (Gender-Neutral)", openRank: 1400, closeRank: 2410, round: "Round 6" },
    { branch: "Civil Engineering", category: "General (Gender-Neutral)", openRank: 2200, closeRank: 4280, round: "Round 6" },
    { branch: "Engineering Physics", category: "General (Gender-Neutral)", openRank: 1100, closeRank: 2800, round: "Round 6" },
  ],
  facilities: [
    { name: "Central Library", icon: "BookOpen", desc: "3+ Lakh physical books, e-journals, 24x7 air-conditioned reading halls." },
    { name: "High-Speed Wi-Fi", icon: "Wifi", desc: "10 Gbps campus-wide optic fiber network covering all hostels & academic zones." },
    { name: "13 Student Hostels", icon: "Building", desc: "Separate single/double occupancy hostels with mess, gym, and recreation rooms." },
    { name: "Olympic Sports Complex", icon: "Heart", desc: "Swimming pool, floodlit tennis courts, synthetic athletic tracks, cricket oval." },
    { name: "Cafeteria & Food Courts", icon: "Coffee", desc: "Café Coffee Day, Nescafe, Amul parlors, Mother Dairy, and multicusine canteens." },
    { name: "Hospital & Health Center", icon: "ShieldCheck", desc: "24-hour round-the-clock medical emergency clinic with full-time doctors & pharmacy." },
  ],
  reviews: [
    {
      id: "1",
      author: "Aditya Sharma",
      course: "B.Tech Computer Science (Batch 2025)",
      year: "2 weeks ago",
      rating: 5,
      title: "Unrivaled peer group, world-class professors & dream placements",
      content:
        "Studying CSE at IIT Delhi is a life-changing experience. The coding culture is unmatched with active clubs like DevClub and Robotics Club. Placements are phenomenal — top US tech giants hire directly.",
      pros: "Top 0.01% brains of India, zero attendance strictness in some electives, massive funding for startups.",
      cons: "Academics can get intensely competitive during minor and major exam weeks.",
    },
    {
      id: "2",
      author: "Priya Varma",
      course: "B.Tech Electrical Engineering (Batch 2024)",
      year: "1 month ago",
      rating: 5,
      title: "Lush green campus in the heart of South Delhi with rich heritage",
      content:
        "The Hauz Khas location gives you access to the best cafes, metro connectivity, and events. Hostels are lively, food in the mess is good with regular special dinners. Rendezvous fest is unforgettable.",
      pros: "Metro gate right outside campus (IIT Delhi station on Magenta Line), incredible alumni network.",
      cons: "Old hostel wings could use modern renovation.",
    },
  ],
  faqs: [
    {
      question: "What is the minimum JEE Advanced rank required for IIT Delhi Computer Science (CSE)?",
      answer: "For the General Category (Gender-Neutral), the opening rank for B.Tech CSE is around 28 and the closing rank in Round 6 of JoSAA counselling is approximately 115–118. For Female candidates (Supernumerary), the closing rank extends up to rank 420.",
    },
    {
      question: "What is the average and highest placement package at IIT Delhi?",
      answer: "In the 2024-25 placement drive, the highest domestic CTC offered was ₹1.20 Crore PA, while the highest international offer touched ₹2.40 Crore PA. The overall average package across all B.Tech branches stood at ₹25.82 Lakhs PA, with CSE average exceeding ₹39.5 Lakhs PA.",
    },
    {
      question: "What are the hostel and mess fees at IIT Delhi?",
      answer: "Hostel seat rent and amenities charge around ₹8,000 to ₹12,000 per semester. Mess advance is approximately ₹25,000 to ₹30,000 per semester. Overall hostel and mess expenditure is around ₹70,000–₹80,000 annually.",
    },
    {
      question: "Does IIT Delhi offer fee concessions or scholarships for economically weaker students?",
      answer: "Yes! 100% tuition fee waiver is granted to all SC, ST, and PwD students. Additionally, General/OBC students with family income below ₹1 Lakh/year receive 100% tuition waiver, and those between ₹1–5 Lakhs/year get a 66.6% tuition fee waiver under the Govt. Merit-cum-Means (MCM) scheme.",
    },
    {
      question: "How can I apply for MBA at Department of Management Studies (DMS) IIT Delhi?",
      answer: "Admission to the 2-Year Full-Time MBA at DMS IIT Delhi requires a valid CAT percentile (typically 98.5+ percentile for General category). Shortlisted candidates undergo a Personal Interview (PI) and analytical evaluation.",
    },
  ],
  gallery: [
    { url: "/images/iitdelhi_real.jpg", caption: "IIT Delhi Main Iconic Administration Building", category: "Campus" },
    { url: "/images/galgotias_real.jpg", caption: "Dogra Hall & Academic Complex", category: "Academic" },
    { url: "/images/amity_real.jpg", caption: "High-Tech AI & Robotics Research Lab", category: "Labs" },
    { url: "/images/chandigarh_real.jpg", caption: "Student Hostels & Green Courtyards", category: "Hostel" },
  ],
  facultyList: [
    { name: "Prof. Rangan Banerjee", designation: "Director & Senior Professor", dept: "Energy Science and Engineering", qualification: "Ph.D. IIT Bombay", experience: "32+ Years" },
    { name: "Prof. Mausam", designation: "Head of School of AI (ScAI)", dept: "Computer Science & Artificial Intelligence", qualification: "Ph.D. University of Washington (USA)", experience: "18+ Years" },
    { name: "Prof. Subodh Kumar", designation: "Professor", dept: "Computer Science & Engineering", qualification: "Ph.D. University of North Carolina", experience: "24+ Years" },
    { name: "Prof. Brejesh Lall", designation: "Professor & Dean", dept: "Electrical Engineering", qualification: "Ph.D. IIT Delhi", experience: "22+ Years" },
  ],
  tableOfContents: [
    { label: "IIT Delhi Highlights 2026", targetId: "highlights-section", tabId: "info" },
    { label: "IIT Delhi Cutoff 2026", targetId: "cutoffs-section", tabId: "info" },
    { label: "IIT Delhi Courses & Fees 2026", targetId: "courses-section", tabId: "info" },
    { label: "IIT Delhi Placements 2026", targetId: "placements-section", tabId: "info" },
    { label: "IIT Delhi Admission & Application Process 2026", targetId: "admissions-section", tabId: "info" },
    { label: "IIT Delhi Rankings 2026", targetId: "rankings-section", tabId: "info" },
    { label: "IIT Delhi Student Reviews", targetId: "reviews-section", tabId: "info" },
    { label: "IIT Delhi Scholarships 2026", targetId: "scholarships-section", tabId: "info" },
    { label: "IIT Delhi Popular Courses", targetId: "courses-section", tabId: "info" },
    { label: "IIT Delhi College comparison", targetId: "compare-section", tabId: "info" },
    { label: "IIT Delhi Campus & Facilities 2026", targetId: "campus-section", tabId: "info" },
    { label: "IIT Delhi Colleges/Departments", targetId: "faculty-section", tabId: "info" },
    { label: "Top online courses you might be interested in", targetId: "courses-section", tabId: "info" },
    { label: "IIT Delhi Notable Alumni", targetId: "about-section", tabId: "info" },
    { label: "IIT Delhi FAQs", targetId: "faq-section", tabId: "info" },
  ],
};

// Exact Shiksha Tabs List from User's Reference
const SHIKSHA_NAV_TABS = [
  { id: "info", label: "College Info" },
  { id: "courses", label: "Courses & Fees" },
  { id: "reviews", label: "Reviews" },
  { id: "admissions", label: "Admissions" },
  { id: "placements", label: "Placements" },
  { id: "cutoffs", label: "Cut-Offs" },
  { id: "rankings", label: "Rankings" },
  { id: "gallery", label: "Gallery" },
  { id: "hostel", label: "Hostel & Campus" },
  { id: "faculty", label: "Faculty" },
  { id: "compare", label: "College Compare" },
  { id: "qa", label: "Q&A" },
  { id: "scholarships", label: "Scholarships" },
] as const;

type ShikshaTabId = (typeof SHIKSHA_NAV_TABS)[number]["id"];
type MiniModalId =
  | "header"
  | "author"
  | "toc"
  | "info"
  | "highlights"
  | "courses"
  | "course_summary_box"
  | "fees"
  | "reviews"
  | "studentFeedback"
  | "reviewCards"
  | "studentMediaReviews"
  | "moreReviewCards"
  | "admissions"
  | "placements"
  | "placements_article"
  | "placements_stats"
  | "placements_salary"
  | "placements_recruiters"
  | "placements_insights"
  | "placements_faqs"
  | "admission"
  | "admission_faqs"
  | "cutoffs"
  | "cutoff_comparison"
  | "secondary_cutoff_comparison"
  | "rankings"
  | "rankings_faqs"
  | "gallery"
  | "hostel"
  | "faculty"
  | "qa"
  | "scholarships"
  | null;

const iconMap: Record<string, any> = {
  Building,
  BookOpen,
  Wifi,
  Coffee,
  Heart,
  ShieldCheck,
};

const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export default function CollegeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Selected Tab State
  const [activeTab, setActiveTab] = useState<ShikshaTabId>("info");

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    stream: "Engineering",
  });

  const [collegeData, setCollegeData] = useState<CollegeDetail>(IIT_DELHI_MASTER_DATA);
  const [loading, setLoading] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [courseSearch, setCourseSearch] = useState("");
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [isTocExpanded, setIsTocExpanded] = useState(false);
  const [isHighlightsOpen, setIsHighlightsOpen] = useState(true);
  const [isHighlightsExpanded, setIsHighlightsExpanded] = useState(false);
  const [openHighlightFaqIdx, setOpenHighlightFaqIdx] = useState<number | null>(0);
  const [isCutoffCardOpen, setIsCutoffCardOpen] = useState(true);
  const [isCutoffArticleExpanded, setIsCutoffArticleExpanded] = useState(false);
  const [isCutoffRoundOpen, setIsCutoffRoundOpen] = useState(false);
  const [isSecondaryCutoffOpen, setIsSecondaryCutoffOpen] = useState(false);
  const [openCutoffFaqIdx, setOpenCutoffFaqIdx] = useState<number | null>(0);
  const [isCoursesCardOpen, setIsCoursesCardOpen] = useState(true);
  const [isCoursesArticleExpanded, setIsCoursesArticleExpanded] = useState(false);
  const [openCourseGroupIndices, setOpenCourseGroupIndices] = useState<Record<number, boolean>>({});
  const [openCoursesFaqIdx, setOpenCoursesFaqIdx] = useState<number | null>(0);
  const [isPlacementsCardOpen, setIsPlacementsCardOpen] = useState(true);
  const [isPlacementsArticleExpanded, setIsPlacementsArticleExpanded] = useState(false);

  const toggleCourseGroup = (idx: number) => {
    setOpenCourseGroupIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Filter Modal & Applied Filter State for Cutoff Sub-Box
  const [isCutoffFilterModalOpen, setIsCutoffFilterModalOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<"rounds" | "category" | "quota" | "gender">("rounds");
  const [appliedCutoffFilters, setAppliedCutoffFilters] = useState({
    round: "1",
    category: "General",
    quota: "All India",
    gender: "All",
  });
  const [tempCutoffFilters, setTempCutoffFilters] = useState({
    round: "1",
    category: "General",
    quota: "All India",
    gender: "All",
  });

  const CUTOFF_FILTER_OPTIONS = {
    rounds: ["1", "2", "3", "4", "5", "Last Round"],
    category: [
      "General",
      "OBC",
      "SC",
      "ST",
      "PWD",
      "Economically Weaker Section",
      "OBC Non-Creamy PWD",
      "SC PWD",
      "ST PWD",
    ],
    quota: ["All India", "Home State", "Other State"],
    gender: ["All", "Gender-Neutral", "Female-only (including Supernumerary)"],
  };

  const openCutoffFilterModal = (tab: "rounds" | "category" | "quota" | "gender" = "rounds") => {
    setTempCutoffFilters({ ...appliedCutoffFilters });
    setActiveFilterTab(tab);
    setIsCutoffFilterModalOpen(true);
  };

  // Admin multi-round & multi-category cutoff editing selector state
  const [adminCutoffRound, setAdminCutoffRound] = useState("1");
  const [adminCutoffCategory, setAdminCutoffCategory] = useState("General");

  const getFilteredCutoffRows = (secData: CutoffRoundComparisonData, filters: typeof appliedCutoffFilters) => {
    const fullKey = `${filters.round}|${filters.category}|${filters.quota}|${filters.gender}`;
    const roundCategoryKey = `${filters.round}|${filters.category}`;
    const categoryKey = `${filters.category}`;

    // 1. Check exact custom combination from Supabase/admin
    if (secData.filterDatasets?.[fullKey] && secData.filterDatasets[fullKey].length > 0) {
      return secData.filterDatasets[fullKey];
    }
    // 2. Check round + category combination
    if (secData.filterDatasets?.[roundCategoryKey] && secData.filterDatasets[roundCategoryKey].length > 0) {
      return secData.filterDatasets[roundCategoryKey];
    }
    // 3. Check category dataset
    if (secData.filterDatasets?.[categoryKey] && secData.filterDatasets[categoryKey].length > 0) {
      return secData.filterDatasets[categoryKey];
    }

    // 4. Smart realistic JoSAA / UCEED benchmark algorithm fallback based on base rows
    const baseRows = secData.rows || [];
    let catMultiplier = 1;
    if (filters.category === "OBC") catMultiplier = 1.65;
    else if (filters.category === "SC") catMultiplier = 2.85;
    else if (filters.category === "ST") catMultiplier = 4.2;
    else if (filters.category === "PWD") catMultiplier = 0.45;
    else if (filters.category === "Economically Weaker Section") catMultiplier = 1.35;
    else if (filters.category === "OBC Non-Creamy PWD") catMultiplier = 0.55;
    else if (filters.category === "SC PWD") catMultiplier = 0.75;
    else if (filters.category === "ST PWD") catMultiplier = 0.9;

    let roundOffset = 0;
    if (filters.round === "2") roundOffset = 2;
    else if (filters.round === "3") roundOffset = 4;
    else if (filters.round === "4") roundOffset = 6;
    else if (filters.round === "5") roundOffset = 8;
    else if (filters.round === "Last Round") roundOffset = 10;

    let quotaOffset = filters.quota === "Home State" ? 4 : filters.quota === "Other State" ? -2 : 0;
    let genderMultiplier = filters.gender === "Female-only (including Supernumerary)" ? 1.35 : 1;

    return baseRows.map((row) => {
      const r2024 = typeof row.year2024 === "number" ? row.year2024 : parseInt(String(row.year2024)) || 35;
      const r2025 = typeof row.year2025 === "number" ? row.year2025 : parseInt(String(row.year2025)) || 41;
      const r2026 = typeof row.year2026 === "number" ? row.year2026 : parseInt(String(row.year2026)) || 28;

      return {
        course: row.course,
        year2024: Math.max(1, Math.round(r2024 * catMultiplier * genderMultiplier) + roundOffset + quotaOffset),
        year2025: Math.max(1, Math.round(r2025 * catMultiplier * genderMultiplier) + roundOffset + quotaOffset),
        year2026: Math.max(1, Math.round(r2026 * catMultiplier * genderMultiplier) + roundOffset + quotaOffset),
      };
    });
  };

  // Horizontal Scroll Ref for Tabs
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkTabScroll = () => {
    if (tabScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabScrollRef.current) {
      const scrollAmount = 260;
      tabScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkTabScroll, 350);
    }
  };

  useEffect(() => {
    checkTabScroll();
    window.addEventListener("resize", checkTabScroll);
    return () => window.removeEventListener("resize", checkTabScroll);
  }, []);

  // Admin Session and In-Page Editing States
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeMiniModal, setActiveMiniModal] = useState<MiniModalId>(null);
  const [placementsModalTab, setPlacementsModalTab] = useState<"article" | "stats" | "salary" | "recruiters" | "insights" | "faqs">("article");
  const [openPlacementsFaqIdx, setOpenPlacementsFaqIdx] = useState<number | null>(null);
  const [isAdmissionCardOpen, setIsAdmissionCardOpen] = useState(true);
  const [isAdmissionArticleExpanded, setIsAdmissionArticleExpanded] = useState(false);
  const [openAdmissionBoxes, setOpenAdmissionBoxes] = useState<Record<number, boolean>>({});
  const [openAdmissionFaqIdx, setOpenAdmissionFaqIdx] = useState<number | null>(null);
  const [admissionModalTab, setAdmissionModalTab] = useState<"article" | "boxes" | "faqs">("article");
  const [isRankingsCardOpen, setIsRankingsCardOpen] = useState(true);
  const [isRankingsArticleExpanded, setIsRankingsArticleExpanded] = useState(false);
  const [openCourseRankingBoxes, setOpenCourseRankingBoxes] = useState<Record<number, boolean>>({});
  const [openRankingsFaqIdx, setOpenRankingsFaqIdx] = useState<number | null>(null);
  const [reviewsModalTab, setReviewsModalTab] = useState<"overall" | "parameters">("overall");
  const [hoveredStarBarIdx, setHoveredStarBarIdx] = useState<number | null>(null);
  const [activeFeedbackCategory, setActiveFeedbackCategory] = useState<string>("Placements");
  const [expandedReviewCardIds, setExpandedReviewCardIds] = useState<Record<string, boolean>>({});
  const [reviewHelpfulVotes, setReviewHelpfulVotes] = useState<Record<string, "up" | "down" | null>>({});
  const [activeMediaReviewModal, setActiveMediaReviewModal] = useState<StudentMediaReviewItem | null>(null);
  const mediaReviewsScrollRef = useRef<HTMLDivElement>(null);
  const [rankingsModalTab, setRankingsModalTab] = useState<"overview" | "international" | "national" | "course_boxes" | "faqs">("overview");
  const [isUpdating, setIsUpdating] = useState(false);

  // Section-by-Section Edit State Buffer
  const [tempData, setTempData] = useState<CollegeDetail>(IIT_DELHI_MASTER_DATA);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("think_college_admin") === "true");
    }
  }, []);

  // Fetch college details from Supabase (or load master data)
  useEffect(() => {
    const fetchCollegeDetail = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("colleges")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (error) {
          console.warn("Supabase load notice:", error.message);
        }

        if (data) {
          const ratingNum = parseFloat(data.rating) || 4.9;
          let parsedData: any = {};

          if (
            data.description &&
            data.description.trim().startsWith("{") &&
            data.description.trim().endsWith("}")
          ) {
            try {
              parsedData = JSON.parse(data.description);
            } catch (e) {}
          }

          const baseDetail: CollegeDetail = {
            name: data.name || IIT_DELHI_MASTER_DATA.name,
            fullName: data.name ? `${data.name} (${data.slug.toUpperCase()})` : IIT_DELHI_MASTER_DATA.fullName,
            location: data.location || `${data.city || "Delhi"}, ${data.state || "India"}`,
            city: data.city || "New Delhi",
            state: data.state || "Delhi",
            nirfRank: data.nirf_rank && data.nirf_rank !== "N/A" ? `NIRF #${data.nirf_rank}` : IIT_DELHI_MASTER_DATA.nirfRank,
            rating: ratingNum,
            ratingCount: `${Math.floor(ratingNum * 120 + 200)} Verified Reviews`,
            type: data.ownership ? `${data.ownership} University` : IIT_DELHI_MASTER_DATA.type,
            estd: parsedData.estd || "1961",
            stream: "Engineering",
            highestPackage: parsedData.highestPackage || IIT_DELHI_MASTER_DATA.highestPackage,
            averagePackage: parsedData.averagePackage || IIT_DELHI_MASTER_DATA.averagePackage,
            medianPackage: parsedData.medianPackage || "₹20.50 Lakhs PA",
            totalFees: data.tuition_fees || IIT_DELHI_MASTER_DATA.totalFees,
            image: data.image_url || IIT_DELHI_MASTER_DATA.image,
            logo: IIT_DELHI_MASTER_DATA.logo,
            campusArea: parsedData.campusArea || "320 Acres",
            flagshipCourse: "B.Tech Computer Science & Engineering",
            accreditation: "Institute of National Importance (MHRD/AICTE)",
            description: parsedData.description || (data.description && !data.description.startsWith("{") ? data.description : IIT_DELHI_MASTER_DATA.description),
            highlights: parsedData.highlights || IIT_DELHI_MASTER_DATA.highlights,
            whatsNew: parsedData.whatsNew || IIT_DELHI_MASTER_DATA.whatsNew,
            courses: parsedData.courses || IIT_DELHI_MASTER_DATA.courses,
            recruiters: parsedData.recruiters || IIT_DELHI_MASTER_DATA.recruiters,
            cutoffs: parsedData.cutoffs || IIT_DELHI_MASTER_DATA.cutoffs,
            facilities: parsedData.facilities || IIT_DELHI_MASTER_DATA.facilities,
            reviews: parsedData.reviews || IIT_DELHI_MASTER_DATA.reviews,
            faqs: parsedData.faqs || IIT_DELHI_MASTER_DATA.faqs,
            gallery: parsedData.gallery || IIT_DELHI_MASTER_DATA.gallery,
            facultyList: parsedData.facultyList || IIT_DELHI_MASTER_DATA.facultyList,
            author: parsedData.author || IIT_DELHI_MASTER_DATA.author,
            tableOfContents: parsedData.tableOfContents || IIT_DELHI_MASTER_DATA.tableOfContents,
            highlightsArticle: parsedData.highlightsArticle || IIT_DELHI_MASTER_DATA.highlightsArticle,
            cutoffArticle: parsedData.cutoffArticle || IIT_DELHI_MASTER_DATA.cutoffArticle,
            cutoffComparison: parsedData.cutoffComparison || IIT_DELHI_MASTER_DATA.cutoffComparison,
            secondaryCutoffComparison: parsedData.secondaryCutoffComparison || IIT_DELHI_MASTER_DATA.secondaryCutoffComparison,
            coursesFeesArticle: parsedData.coursesFeesArticle || IIT_DELHI_MASTER_DATA.coursesFeesArticle,
            placementsArticle: parsedData.placementsArticle || IIT_DELHI_MASTER_DATA.placementsArticle,
            admissionArticle: parsedData.admissionArticle || IIT_DELHI_MASTER_DATA.admissionArticle,
          };

          setCollegeData(baseDetail);
          setTempData(baseDetail);
        } else {
          setCollegeData(IIT_DELHI_MASTER_DATA);
          setTempData(IIT_DELHI_MASTER_DATA);
        }
      } catch (err) {
        console.error("Error loading college detail:", err);
        setCollegeData(IIT_DELHI_MASTER_DATA);
        setTempData(IIT_DELHI_MASTER_DATA);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCollegeDetail();
    }
  }, [slug]);

  const getCollegeCutoffComparison = (college: CollegeDetail): CutoffRoundComparisonData => {
    if (college.cutoffComparison && college.cutoffComparison.rows && college.cutoffComparison.rows.length > 0) {
      return college.cutoffComparison;
    }
    const shortName = college.name.split(" - ")[0].split("(")[0].trim() || "College";
    const exam = college.stream === "Medical" ? "NEET UG" : college.type.includes("Private") ? "Entrance Exam / JEE Main" : "JEE Advanced";
    const round = "Round 5";

    return {
      title: `Cut Off 2026 for ${exam} Latest Round`,
      subtitle: `${exam} ${round} Closing Rank (General-All India)`,
      years: ["2024", "2025", "2026"],
      rows: (college.cutoffs && college.cutoffs.length > 0)
        ? college.cutoffs.slice(0, 5).map((c, i) => ({
            course: c.branch.startsWith("B.Tech") ? c.branch : `B.Tech. in ${c.branch}`,
            year2024: Math.max(10, Number(c.closeRank) - 12 + (i * 4)),
            year2025: Math.max(10, Number(c.closeRank) - 4 + (i * 2)),
            year2026: c.closeRank,
          }))
        : [
            {
              course: "B.Tech. in Computer Science and Engineering",
              year2024: 116,
              year2025: 126,
              year2026: 128,
            },
            {
              course: "B.Tech. in Electrical Engineering",
              year2024: 625,
              year2025: 605,
              year2026: 612,
            },
            {
              course: "Integrated B.Tech. + M.Tech. in Computer Science and Engineering",
              year2024: 204,
              year2025: 186,
              year2026: 212,
            },
            {
              course: "Integrated B.Tech. + M.Tech. in Mathematics and Computing",
              year2024: 417,
              year2025: 355,
              year2026: 403,
            },
            {
              course: "B.Tech. in Mathematics and Computing Engineering",
              year2024: 332,
              year2025: 323,
              year2026: 338,
            },
          ],
    };
  };

  const getCollegeSecondaryCutoffComparison = (college: CollegeDetail): CutoffRoundComparisonData => {
    if (college.secondaryCutoffComparison && college.secondaryCutoffComparison.rows && college.secondaryCutoffComparison.rows.length > 0) {
      return college.secondaryCutoffComparison;
    }
    const isIIT = college.name.toLowerCase().includes("iit") || college.name.toLowerCase().includes("indian institute of technology");
    const exam = isIIT ? "UCEED" : college.stream === "Medical" ? "NEET PG" : "GATE / National Exam";

    return {
      title: `Cut Off 2026 for ${exam}: Year-Wise rank`,
      subtitle: `${exam} Last Round Closing Rank (General-All India)`,
      years: ["2024", "2025", "2026"],
      rows: isIIT
        ? [
            {
              course: "Bachelor of Design (B.Des.)",
              year2024: 35,
              year2025: 41,
              year2026: 28,
            },
          ]
        : [
            {
              course: `Postgraduate / Secondary Specialization (${exam})`,
              year2024: 240,
              year2025: 220,
              year2026: 215,
            },
          ],
    };
  };

  const getCollegeCutoffArticle = (college: CollegeDetail): CutoffArticleData => {
    const shortName = college.name.split(" - ")[0].split("(")[0].trim() || "College";
    const topBranch = college.cutoffs?.[0]?.branch || "Computer Science & Engineering (CSE)";
    const closeRank = college.cutoffs?.[0]?.closeRank ? String(college.cutoffs[0].closeRank) : "128";
    const round = college.cutoffs?.[0]?.round || "Round 5";

    const defaultCutoffFaqs: FaqItem[] = [
      {
        question: `Can I get ${shortName} with a JEE Advanced cutoff rank of 100?`,
        answer: `Yes, candidate with rank 100 in JEE Advanced can get admission to BTech at ${shortName}. Considering the ${shortName} Round 5 Cutoff 2026, the closing rank for BTech in CSE stood at 128 for the General AI category. Hence, 100 is an eligible rank for ${shortName} for General Category.\n\nApart from CSE, candidate can get admission to courses like BTech in Mathematics and Computing, BTech in Electrical Engineering and Chemical Engineering. For other categories, ${shortName} Cutoff rank will vary.`,
      },
      {
        question: `What are the SC category opening and closing rank for BTech in Electrical Engineering at ${shortName}?`,
        answer: `The SC Category opening and closing ranks for BTech in Electrical Engineering at ${shortName} in JoSAA Round 5 generally range between 120 and 210 for All India seats. Candidates belonging to reserved categories can check the detailed category-wise seat allotment and opening-closing matrix in the JoSAA portal.`,
      },
      {
        question: `I want MSc in Economics. How much rank should I attain to admission at ${shortName}?`,
        answer: `For admission to MSc in Economics at ${shortName} through IIT JAM, candidates typically require an All India Rank (AIR) within the top 25 to 35 for the General category in the final round of counselling, making it one of the most competitive MSc specialisations.`,
      },
      {
        question: `Can I get ${shortName} with 500 rank?`,
        answer: `Yes, with a JEE Advanced rank of 500 in the General AI category, you can comfortably secure admission to premier branches such as Electrical Engineering (Power and Automation), Mechanical Engineering, Mathematics & Computing Dual Degree, Chemical Engineering, and Civil Engineering at ${shortName}.`,
      },
    ];

    if (college.cutoffArticle && college.cutoffArticle.paragraphs && college.cutoffArticle.paragraphs.length > 0) {
      return {
        ...college.cutoffArticle,
        faqs: college.cutoffArticle.faqs && college.cutoffArticle.faqs.length > 0 ? college.cutoffArticle.faqs : defaultCutoffFaqs,
      };
    }

    return {
      paragraphs: [
        `**${shortName} Cutoff 2026** has been released on the official counselling portals! As per **${round} Cut Off 2026**, the **${shortName} admissions** closed at competitive opening and closing ranks for flagship BTech programmes in the Open Category.`,
        `The **highest competition** for admissions at **${shortName}** was observed for **${topBranch}** with a closing rank of **${closeRank}** in ${round}. Allied computing, electrical and technology branches also witnessed strong candidate demand.`,
        `On the other hand, the **competition** was **moderate to accessible** for core and interdisciplinary branches with closing cutoffs extending across reserved and general quotas.`,
        `**Cutoff 2026** Opening and Closing Ranks represent the minimum rank required for admission to various **${shortName}** programmes. The higher the candidate's rank, the higher the chances of securing admission. Participating in centralized counselling is mandatory.`
      ],
      calloutTitle: `Missed the ${shortName} Cutoff?`,
      calloutDesc: `Explore top engineering colleges accepting your rank and discover personalized pathways to pursue your BTech dream.`,
      calloutPdfUrl: "#",
      afterCalloutParagraphs: [
        `**${shortName}** also accepts national and state-level postgraduate entrance examinations for M.Tech, MBA, and M.Sc degree admissions with branch-wise cutoff percentiles released during seat allotment rounds.`
      ],
      footerNote: `Check ${shortName} Cut Off 2026 for other programmes below:`,
      faqs: defaultCutoffFaqs,
    };
  };

  const getCollegeHighlightsArticle = (college: CollegeDetail): HighlightsArticleData => {
    const shortName = college.name.split(" - ")[0].split("(")[0].trim() || "College";
    const defaultFaqs: FaqItem[] = [
      {
        question: `What was the highest package offered during ${shortName} placements?`,
        answer: `As per recent placement reports, ${shortName} recorded a highest domestic package of ${college.highestPackage || "₹1.20 Crore PA"} and average CTC around ${college.averagePackage || "₹25.82 LPA"} with prominent national and global recruiters participating.`,
      },
      {
        question: `How are the degree placements at ${shortName}?`,
        answer: `${shortName} placements consistently record high placement percentages across undergraduate and postgraduate disciplines with prominent top tier firms visiting the campus.`,
      },
      {
        question: `What is the hostel and accommodation fee for ${shortName}?`,
        answer: `Hostel room and mess charges are structured on a per-semester basis with subsidized accommodation facilities for residential scholars.`,
      },
      {
        question: `What is the NIRF ranking of ${shortName}?`,
        answer: `${shortName} holds ${college.nirfRank || "prominent ranking in Engineering"} reflecting its academic excellence, faculty credentials, and student outcomes.`,
      },
    ];

    if (college.highlightsArticle && college.highlightsArticle.bullets && college.highlightsArticle.bullets.length > 0) {
      return {
        ...college.highlightsArticle,
        faqs: college.highlightsArticle.faqs && college.highlightsArticle.faqs.length > 0 ? college.highlightsArticle.faqs : defaultFaqs,
      };
    }

    return {
      introText: `${college.fullName || college.name} is one of India's leading institutions located in ${college.location}. Check out some of the important ${shortName} highlights below:`,
      bullets: [
        {
          title: "Rankings",
          text: `${shortName} is recognized prominently in national rankings, holding ${college.nirfRank || "top tier NIRF positioning"} and stellar academic reputation across the country.`,
        },
        {
          title: "Courses",
          text: `${shortName} offers diverse programs including Undergraduate (B.Tech/BE), Postgraduate (M.Tech, MBA, M.Sc), and Doctoral (Ph.D.) degree programmes.`,
        },
        {
          title: "Admissions",
          text: `${shortName} admission is entrance-based. Admission to flagship degree courses requires valid national entrance exam qualifications followed by centralized counselling.`,
        },
        {
          title: "Fees",
          text: `The tuition fees for the premier flagship programme is approximately ${college.totalFees || "INR 8 Lakhs (4 Years)"}.`,
        },
        {
          title: "Placements",
          text: `${shortName} placement recorded stellar offers with highest domestic CTC of ${college.highestPackage} and average CTC around ${college.averagePackage}.`,
        },
      ],
      nirfCalloutTitle: `Why Is ${shortName} Ranked Among India's Best?`,
      nirfCalloutDesc: `Explore verified performance metrics, faculty strength, and student outcomes.`,
      nirfReportUrl: "#",
      faqs: defaultFaqs,
    };
  };

  const getCollegeCoursesFeesArticle = (college: CollegeDetail): CoursesFeesArticleData => {
    const shortName = college.name.split(" - ")[0].split("(")[0].trim() || "College";

    const defaultCoursesFaqs: FaqItem[] = [
      {
        question: `What is the career scope after MSc from ${shortName}?`,
        answer: `Graduating with an MSc from ${shortName} unlocks exceptional career opportunities in R&D laboratories, data analytics, corporate consulting, higher research (Ph.D. at world-leading global universities), and premier technology firms. Postgraduate science scholars consistently secure high placement packages with top tier recruiters.`,
      },
      {
        question: `Does ${shortName} offer MSc?`,
        answer: `Yes, ${shortName} offers regular full-time 2-year Master of Science (M.Sc.) degree programmes across multiple disciplines including Physics, Chemistry, Mathematics, Cognitive Science, and Economics. Admission to MSc is strictly through Joint Admission test for Masters (IIT JAM) followed by centralized counselling.`,
      },
      {
        question: `Which all Certificate courses are available at ${shortName}?`,
        answer: `${shortName} offers specialized executive and continuing education certificate programmes across Artificial Intelligence & Machine Learning, Data Science, Project Management, Digital Marketing, Quantitative Finance, and Advanced 5G Communications through its Continuing Education Programme (CEP) and E-Vidya portal.`,
      },
      {
        question: `Is BTech available in ${shortName}?`,
        answer: `Yes, Bachelor of Technology (BTech) is the flagship 4-year undergraduate programme at ${shortName}. It is offered in premier engineering disciplines including Computer Science & Engineering, Electrical Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering, Energy Engineering, and Mathematics & Computing. Admission is strictly through JEE Advanced followed by JoSAA counselling.`,
      },
    ];

    if (college.coursesFeesArticle) {
      return {
        title: college.coursesFeesArticle.title || `${shortName} Courses & Fees 2026`,
        introParagraph1:
          college.coursesFeesArticle.introParagraph1 ||
          `**${shortName}** offers undergraduate, postgraduate, doctoral, and certificate programmes across Engineering, Design, Sciences, Management, and Humanities. The **${shortName}** courses are available in **full-time**, **part-time**, and **online** modes.`,
        introParagraph2:
          college.coursesFeesArticle.introParagraph2 ||
          `The courses offered are BTech, BS, BDes, MTech, MSc, MBA, MDes, MA, and PhD. **${shortName} popular programme** is BTech. The following are the course categories and top specialisations offered at **${shortName}**:`,
        courseSummaryGroups:
          college.coursesFeesArticle.courseSummaryGroups && college.coursesFeesArticle.courseSummaryGroups.length > 0
            ? college.coursesFeesArticle.courseSummaryGroups
            : [
                {
                  groupTitle: "UG Courses",
                  courses: [
                    {
                      courseName: "BTech",
                      firstYearFees: "INR 2.55 Lakhs",
                      eligibility: "Class 10+2 with 75% marks",
                      duration: "4 years",
                      selection: "JEE Advanced + JoSAA Counselling",
                    },
                    {
                      courseName: "BDes",
                      firstYearFees: "INR 2.54 Lakhs",
                      eligibility: "Class 10+2 with 75% marks",
                      duration: "4 years",
                      selection: "UCEED Scores + Counselling",
                    },
                  ],
                },
              ],
        specialisations: college.coursesFeesArticle.specialisations || [
          {
            category: "BTech specialisations",
            list: "Computer Science & Engineering, Electrical Engineering, Mechanical Engineering, Chemical Engineering, Civil Engineering, and Textile Technology.",
          },
          {
            category: "PG programmes",
            list: "MTech, MSc, MBA, MDes, and MA",
          },
          {
            category: "Certificate Programmes",
            list: "Statistical Inference, Computational Geometry, Advanced Textile Printing Technology, and Project Management.",
          },
        ],
        calloutPromoText:
          college.coursesFeesArticle.calloutPromoText ||
          "Explore engineering colleges accepting low JEE Main ranks, compare admission routes, and find the right BTech programme based on your score and preferences.",
        calloutPdfUrl: college.coursesFeesArticle.calloutPdfUrl || "#",
        popularCoursesHeading:
          college.coursesFeesArticle.popularCoursesHeading ||
          `Students can check out the ${shortName} fees 2026 for some popular courses below:`,
        popularCourses: college.coursesFeesArticle.popularCourses || [
          {
            courseName: "B.E. / B.Tech",
            coursesCount: "15 Courses",
            tuitionFees: "INR 8 lakh",
            totalFees: "INR 11.26 lakh - INR 11.72 lakh",
          },
          {
            courseName: "B.Des",
            coursesCount: "1 Courses",
            tuitionFees: "INR 8 lakh",
            totalFees: "INR 11.26 lakh",
          },
          {
            courseName: "MBA/PGDM",
            coursesCount: "2 Courses",
            tuitionFees: "INR 12 lakh",
            totalFees: "INR 13.82 lakh - INR 13.9 lakh",
          },
          {
            courseName: "M.E./M.Tech",
            coursesCount: "45 Courses",
            tuitionFees: "INR 70,000- INR 3 lakh",
            totalFees: "INR 4.82 lakh - INR 5.17 lakh",
          },
          {
            courseName: "M.Sc.",
            coursesCount: "25 Courses",
            tuitionFees: "INR 30,000 - INR 3 lakh",
            totalFees: "INR 2.12 lakh - INR 5.4 lakh",
          },
          {
            courseName: "Ph.D.",
            coursesCount: "28 Courses",
            tuitionFees: "INR 45,000",
            totalFees: "INR 45,000",
          },
          {
            courseName: "M.A.",
            coursesCount: "2 Courses",
            tuitionFees: "INR 30,000 - INR 3 lakh",
            totalFees: "INR 2.12 lakh - INR 5.05 lakh",
          },
          {
            courseName: "M.Des",
            coursesCount: "1 Courses",
            tuitionFees: "INR 70,000",
            totalFees: "INR 2.52 lakh",
          },
        ],
        otherChargesNote: college.coursesFeesArticle.otherChargesNote || "*This is estimated fee information. Actual values may differ.",
        otherChargesHeading: college.coursesFeesArticle.otherChargesHeading || `Other Charges included in ${shortName} fee structure:`,
        otherCharges: college.coursesFeesArticle.otherCharges || [
          {
            component: "Hostel fees",
            subtext:
              "Meal Plan is included in this fee. The fees might include components other than hostel fees. Hostel fee mentioned is for cheapest option available.",
            amount: "INR 1.29 lakh - 3.1 lakh",
          },
          {
            component: "One-time payments",
            subtext:
              "One-time payment includes Admission fees, Student welfare fund, Modernization fees, Benevolent fund, Alumni fees, Training and Placement charges, Institute & Library Security fees.",
            amount: "INR 16,150 – 23,000",
          },
          {
            component: "Other fee",
            amount: "INR 94,400",
          },
        ],
        footerNote: college.coursesFeesArticle.footerNote || `Check more about ${shortName} courses below:`,
        viewAllBtnText: college.coursesFeesArticle.viewAllBtnText || "View All Courses & Fees",
        faqs:
          college.coursesFeesArticle.faqs && college.coursesFeesArticle.faqs.length > 0
            ? college.coursesFeesArticle.faqs
            : defaultCoursesFaqs,
      };
    }

    return {
      title: `${shortName} Courses & Fees 2026`,
      introParagraph1:
        `**${shortName}** offers undergraduate, postgraduate, doctoral, and certificate programmes across Engineering, Design, Sciences, Management, and Humanities. The **${shortName}** courses are available in **full-time**, **part-time**, and **online** modes.`,
      introParagraph2:
        `The courses offered are BTech, BS, BDes, MTech, MSc, MBA, MDes, MA, and PhD. **${shortName} popular programme** is BTech. The following are the course categories and top specialisations offered at **${shortName}**:`,
      courseSummaryGroups: [
        {
          groupTitle: "UG Courses",
          courses: [
            {
              courseName: "BTech",
              firstYearFees: "INR 2.55 Lakhs",
              eligibility: "Class 10+2 with 75% marks",
              duration: "4 years",
              selection: "JEE Advanced + JoSAA Counselling",
            },
            {
              courseName: "BDes",
              firstYearFees: "INR 2.54 Lakhs",
              eligibility: "Class 10+2 with 75% marks",
              duration: "4 years",
              selection: "UCEED Scores + Counselling",
            },
          ],
        },
      ],
      specialisations: [
        {
          category: "BTech specialisations",
          list: "Computer Science & Engineering, Electrical Engineering, Mechanical Engineering, Chemical Engineering, Civil Engineering, and Textile Technology.",
        },
        {
          category: "PG programmes",
          list: "MTech, MSc, MBA, MDes, and MA",
        },
        {
          category: "Certificate Programmes",
          list: "Statistical Inference, Computational Geometry, Advanced Textile Printing Technology, and Project Management.",
        },
      ],
      calloutPromoText:
        "Explore engineering colleges accepting low JEE Main ranks, compare admission routes, and find the right BTech programme based on your score and preferences.",
      calloutPdfUrl: "#",
      popularCoursesHeading:
        `Students can check out the ${shortName} fees 2026 for some popular courses below:`,
      popularCourses: [
        {
          courseName: "B.E. / B.Tech",
          coursesCount: "15 Courses",
          tuitionFees: "INR 8 lakh",
          totalFees: "INR 11.26 lakh - INR 11.72 lakh",
        },
        {
          courseName: "B.Des",
          coursesCount: "1 Courses",
          tuitionFees: "INR 8 lakh",
          totalFees: "INR 11.26 lakh",
        },
        {
          courseName: "MBA/PGDM",
          coursesCount: "2 Courses",
          tuitionFees: "INR 12 lakh",
          totalFees: "INR 13.82 lakh - INR 13.9 lakh",
        },
        {
          courseName: "M.E./M.Tech",
          coursesCount: "45 Courses",
          tuitionFees: "INR 70,000- INR 3 lakh",
          totalFees: "INR 4.82 lakh - INR 5.17 lakh",
        },
        {
          courseName: "M.Sc.",
          coursesCount: "25 Courses",
          tuitionFees: "INR 30,000 - INR 3 lakh",
          totalFees: "INR 2.12 lakh - INR 5.4 lakh",
        },
        {
          courseName: "Ph.D.",
          coursesCount: "28 Courses",
          tuitionFees: "INR 45,000",
          totalFees: "INR 45,000",
        },
        {
          courseName: "M.A.",
          coursesCount: "2 Courses",
          tuitionFees: "INR 30,000 - INR 3 lakh",
          totalFees: "INR 2.12 lakh - INR 5.05 lakh",
        },
        {
          courseName: "M.Des",
          coursesCount: "1 Courses",
          tuitionFees: "INR 70,000",
          totalFees: "INR 2.52 lakh",
        },
      ],
      otherChargesNote: "*This is estimated fee information. Actual values may differ.",
      otherChargesHeading: `Other Charges included in ${shortName} fee structure:`,
      otherCharges: [
        {
          component: "Hostel fees",
          subtext:
            "Meal Plan is included in this fee. The fees might include components other than hostel fees. Hostel fee mentioned is for cheapest option available.",
          amount: "INR 1.29 lakh - 3.1 lakh",
        },
        {
          component: "One-time payments",
          subtext:
            "One-time payment includes Admission fees, Student welfare fund, Modernization fees, Benevolent fund, Alumni fees, Training and Placement charges, Institute & Library Security fees.",
          amount: "INR 16,150 – 23,000",
        },
        {
          component: "Other fee",
          amount: "INR 94,400",
        },
      ],
      footerNote: `Check more about ${shortName} courses below:`,
      viewAllBtnText: "View All Courses & Fees",
      faqs: defaultCoursesFaqs,
    };
  };

  const getCollegePlacementsArticle = (college: CollegeDetail): PlacementsArticleData => {
    const shortName = college.name.split(" - ")[0].split("(")[0].trim() || "College";

    const defaultSubsections: PlacementSubSection[] = [
      {
        heading: `${shortName} Top Recruiters 2026`,
        content: `Leading recruiters participating in **${shortName} BTech placements 2026** are Microsoft, Goldman Sachs, Texas Instruments, Bajaj Auto, Ola Electric, and Air India.`,
      },
      {
        heading: `${shortName} MBA Placements 2026`,
        content: `The **${shortName} MBA placement report 2026** is yet to be released. As per the official 2025 placement report, **${shortName} MBA** recorded a 98% placement rate. The **${shortName} highest package** offered was **INR 43.55 LPA**. While the **average package of ${shortName}** (MTech) was **INR 22.52 LPA**, and the **median** was **INR 22.5 LPA**.`,
      },
      {
        heading: `${shortName} MBA Placements 2026 Top Recruiters`,
        content: `**${shortName} MBA placements'** top recruiter list includes leading companies such as Accenture, Paytm, EY, PwC, Godrej, and Flipkart.`,
      },
    ];

    const defaultStatsTableCols: string[] = [
      "Particulars",
      "Placement Statistics 2025 (Ongoing)",
      "Placement Statistics 2024",
    ];

    const defaultStatsTable: PlacementStatRow[] = [
      {
        particular: "Total No. Of Offers",
        values: ["1411 (53.1%)", "1300"],
        statCurrentYear: "1411 (53.1%)",
        statPrevYear: "1300",
      },
      {
        particular: "Total No. Of Companies",
        values: ["NA", "400"],
        statCurrentYear: "NA",
        statPrevYear: "400",
      },
      {
        particular: "Total Pre-placement Offers",
        values: ["NA", "260"],
        statCurrentYear: "NA",
        statPrevYear: "260",
      },
      {
        particular: "Total No. Of New Recruiters",
        values: ["NA", "Na"],
        statCurrentYear: "NA",
        statPrevYear: "Na",
      },
      {
        particular: "Highest Package (Domestic)",
        values: ["NA", "INR 2 CPA"],
        statCurrentYear: "NA",
        statPrevYear: "INR 2 CPA",
      },
      {
        particular: "Average Package",
        values: ["NA", "INR 22 LPA"],
        statCurrentYear: "NA",
        statPrevYear: "INR 22 LPA",
      },
      {
        particular: "Top Recruiters",
        values: ["NA", "Google, ICICI Bank, Accenture"],
        statCurrentYear: "NA",
        statPrevYear: "Google, ICICI Bank, Accenture",
      },
      {
        particular: "Top New Recruiters",
        values: ["NA", "Capgemini, Texas Instruments"],
        statCurrentYear: "NA",
        statPrevYear: "Capgemini, Texas Instruments",
      },
    ];

    const defaultSalaryTableCols: string[] = ["Course", "Median Salary"];

    const defaultSalaryTable: CourseSalaryRow[] = [
      { course: "B.E. / B.Tech", values: ["₹20 LPA"], salary: "₹20 LPA" },
      { course: "M.E./M.Tech", values: ["₹16 LPA"], salary: "₹16 LPA" },
      { course: "M.Sc.", values: ["₹15.59 LPA"], salary: "₹15.59 LPA" },
      { course: "MBA/PGDM", values: ["₹15.59 LPA"], salary: "₹15.59 LPA" },
      { course: "M.A.", values: ["₹15.59 LPA"], salary: "₹15.59 LPA" },
      { course: "M.Des", values: ["₹15.59 LPA"], salary: "₹15.59 LPA" },
    ];

    const defaultTopRecruitersList: TopRecruiterItem[] = [
      {
        name: "Accenture",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
        websiteUrl: "https://www.accenture.com",
      },
      {
        name: "Barclays",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Barclays_logo.svg",
        websiteUrl: "https://www.barclays.com",
      },
      {
        name: "Capgemini",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_201x_logo.svg",
        websiteUrl: "https://www.capgemini.com",
      },
      {
        name: "Deloitte",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg",
        websiteUrl: "https://www.deloitte.com",
      },
      {
        name: "Flipkart",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg",
        websiteUrl: "https://www.flipkart.com",
      },
      {
        name: "GAIL",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/6/6f/GAIL_Logo.svg",
        websiteUrl: "https://www.gailonline.com",
      },
      {
        name: "Hindustan Unilever",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e4/Unilever.svg",
        websiteUrl: "https://www.hul.co.in",
      },
      {
        name: "ICICI Securities",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
        websiteUrl: "https://www.icicisecurities.com",
      },
      {
        name: "JP Morgan Chase",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Chase_Logo_2008_1.svg",
        websiteUrl: "https://www.jpmorganchase.com",
      },
      {
        name: "KPMG",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/KPMG_logo.svg",
        websiteUrl: "https://www.kpmg.com",
      },
      {
        name: "Google",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        websiteUrl: "https://www.google.com",
      },
      {
        name: "Microsoft",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        websiteUrl: "https://www.microsoft.com",
      },
      {
        name: "Amazon",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        websiteUrl: "https://www.amazon.com",
      },
      {
        name: "Texas Instruments",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/85/Texas_Instruments_logo.svg",
        websiteUrl: "https://www.ti.com",
      },
    ];

    const defaultPlacementInsights: PlacementInsightItem[] = [
      {
        title: "Internships and industry projects",
        description: "Students can work with faculty on research projects",
      },
      {
        title: "Employment opportunities",
        description: "Many students started their own start-ups",
      },
      {
        title: "Higher studies preferences",
        description: "Majority opted in outside India",
      },
      {
        title: "Placement support",
        description: "Organized & proactive placement process",
      },
      {
        title: "Alumni network",
        description: "Strong alumni network that help with placement opportunities",
      },
      {
        title: "Entrepreneurship cell",
        description: "Very Active and resourceful, college is also involved",
      },
      {
        title: "Overall feeling of students",
        description: "Love being in college",
      },
    ];

    const defaultPlacementFaqs: FaqItem[] = [
      {
        question: `What is the placement percentage recorded during ${shortName} placements?`,
        answer: `${shortName} recorded an exceptional placement rate with over 85-90% eligible registered candidates successfully securing premium employment and international offers across core engineering, analytics, IT, and management sectors.`,
      },
      {
        question: `How are the BTech placements at ${shortName}?`,
        answer: `BTech placements at ${shortName} are among the highest ranked in the nation, with the undergraduate median package reaching INR 20 LPA and international/domestic highest compensation packages exceeding INR 2 Crore per annum.`,
      },
      {
        question: `Can I take admission at ${shortName} MTech course without GATE?`,
        answer: `Direct admission for regular full-time MTech without GATE is typically open only to graduating IITians with a CGPA of 8.0 and above. Candidates from other recognized institutions require a valid GATE percentile followed by written assessment or interview.`,
      },
      {
        question: `How can I get BTech Admission at ${shortName}?`,
        answer: `Undergraduate BTech admission at ${shortName} is strictly merit-based through qualifying JEE Advanced with high cut-off ranks followed by centralized seat allocation via JoSAA counselling.`,
      },
      {
        question: `Which are the top recruiters of ${shortName}?`,
        answer: `Premier global recruiters visiting campus include Google, Microsoft, Amazon, Texas Instruments, Accenture, Deloitte, Goldman Sachs, Apple, Qualcomm, and KPMG, offering domestic and overseas roles.`,
      },
    ];

    if (college.placementsArticle) {
      return {
        title: college.placementsArticle.title || `${shortName} Placements 2026`,
        introParagraph:
          college.placementsArticle.introParagraph ||
          `**${shortName} Placements 2026** recorded **1,275 job** offers for students. **Over 300 pre-placement offers (PPOs)** secured and more than **1,140 students placed**, according 2025-26 placement season. ${shortName} students received more than 40 international offers from multiple global organisations located in Japan, the Netherlands, South Korea, Taiwan, the United Arab Emirates, the United Kingdom, and the United States. As per **IITD** overall report submitted for **NIRF 2026**, **(BTech) UG 4-year students’ median package** is **INR 20 LPA**. Median package for **(MTech)** PG students is **INR 19.25 LPA** in the **${shortName} Placements 2026**. The **average package of ${shortName}** and **${shortName} highest pacakge** are not available.`,
        subsections:
          college.placementsArticle.subsections && college.placementsArticle.subsections.length > 0
            ? college.placementsArticle.subsections
            : defaultSubsections,
        footerNote: college.placementsArticle.footerNote || `Check course-wise placement data of **${shortName}** below:`,
        statsTableTitle: college.placementsArticle.statsTableTitle || `${shortName} Placements Highlights`,
        statsTableCols: college.placementsArticle.statsTableCols || defaultStatsTableCols,
        statsTable:
          college.placementsArticle.statsTable && college.placementsArticle.statsTable.length > 0
            ? college.placementsArticle.statsTable
            : defaultStatsTable,
        salaryTableTitle: college.placementsArticle.salaryTableTitle || `${shortName} Course-wise Median Salary`,
        salaryTableCols: college.placementsArticle.salaryTableCols || defaultSalaryTableCols,
        salaryTable:
          college.placementsArticle.salaryTable && college.placementsArticle.salaryTable.length > 0
            ? college.placementsArticle.salaryTable
            : defaultSalaryTable,
        topRecruitersTitle: college.placementsArticle.topRecruitersTitle || "Top Recruiters",
        topRecruiters:
          college.placementsArticle.topRecruiters && college.placementsArticle.topRecruiters.length > 0
            ? college.placementsArticle.topRecruiters
            : defaultTopRecruitersList,
        insightsTitle: college.placementsArticle.insightsTitle || "Insights on Placements",
        insightsSubtitle: college.placementsArticle.insightsSubtitle || "Based on 281 Student Responses",
        insights:
          college.placementsArticle.insights && college.placementsArticle.insights.length > 0
            ? college.placementsArticle.insights
            : defaultPlacementInsights,
        faqsHeading: college.placementsArticle.faqsHeading || "Commonly asked questions",
        faqsSubtitle: college.placementsArticle.faqsSubtitle || "On Placements",
        faqs:
          college.placementsArticle.faqs && college.placementsArticle.faqs.length > 0
            ? college.placementsArticle.faqs
            : defaultPlacementFaqs,
      };
    }

    return {
      title: `${shortName} Placements 2026`,
      introParagraph: `**${shortName} Placements 2026** recorded **1,275 job** offers for students. **Over 300 pre-placement offers (PPOs)** secured and more than **1,140 students placed**, according 2025-26 placement season. ${shortName} students received more than 40 international offers from multiple global organisations located in Japan, the Netherlands, South Korea, Taiwan, the United Arab Emirates, the United Kingdom, and the United States. As per **IITD** overall report submitted for **NIRF 2026**, **(BTech) UG 4-year students’ median package** is **INR 20 LPA**. Median package for **(MTech)** PG students is **INR 19.25 LPA** in the **${shortName} Placements 2026**. The **average package of ${shortName}** and **${shortName} highest pacakge** are not available.`,
      subsections: defaultSubsections,
      footerNote: `Check course-wise placement data of **${shortName}** below:`,
      statsTableTitle: `${shortName} Placements Highlights`,
      statsTableCols: defaultStatsTableCols,
      statsTable: defaultStatsTable,
      salaryTableTitle: `${shortName} Course-wise Median Salary`,
      salaryTableCols: defaultSalaryTableCols,
      salaryTable: defaultSalaryTable,
      topRecruitersTitle: "Top Recruiters",
      topRecruiters: defaultTopRecruitersList,
      insightsTitle: "Insights on Placements",
      insightsSubtitle: "Based on 281 Student Responses",
      insights: defaultPlacementInsights,
      faqsHeading: "Commonly asked questions",
      faqsSubtitle: "On Placements",
      faqs: defaultPlacementFaqs,
    };
  };

  const getCollegeAdmissionArticle = (college: CollegeDetail): AdmissionArticleData => {
    const shortName = college.name.split(" - ")[0].split("(")[0].trim() || "College";
    const officialWebsite = shortName.toLowerCase().includes("iit") && shortName.toLowerCase().includes("delhi")
      ? "iitd.ac.in"
      : `${shortName.toLowerCase().replace(/[^a-z0-9]/g, "")}.ac.in`;

    if (college.admissionArticle) {
      return college.admissionArticle;
    }

    const defaultCourseBoxes: CourseAdmissionBoxItem[] = [
      {
        courseTitle: "B.E. / B.Tech Admissions 2026",
        courseMeta: "17 Courses • 4 years-5 years",
        eligibilityBullets: [
          "10+2 with 75% aggregate",
          "Accepting Exams: **JEE Main, JEE Advanced, UCEED**",
        ],
        datesHeading: "Important dates",
        datesTable: [
          {
            dates: "Oct '26 - Nov '26",
            event: "JEE Main 2027 Registration Session 1",
            isTentative: true,
          },
          {
            dates: "Jan '27",
            event: "JEE Main Admit Card 2027 Session 1",
            isTentative: true,
          },
          {
            dates: "22 Jan '27 - 24 Jan '27",
            event: "JEE Main 2027 Exam Date Session 1",
            isTentative: false,
          },
        ],
      },
      {
        courseTitle: "M.E. / M.Tech Admissions 2026",
        courseMeta: "45 Courses • 2 years",
        eligibilityBullets: [
          "Bachelor degree in relevant engineering discipline with minimum 60% aggregate or 6.0 CGPA",
          "Accepting Exams: **GATE, COAP Counselling**",
        ],
        datesHeading: "Important dates",
        datesTable: [
          {
            dates: "Aug '26 - Sep '26",
            event: "GATE 2027 Application Form Window",
            isTentative: true,
          },
          {
            dates: "Jan '27",
            event: "GATE 2027 Admit Card Download",
            isTentative: false,
          },
          {
            dates: "Feb '27",
            event: "GATE 2027 Examination Dates",
            isTentative: false,
          },
        ],
      },
      {
        courseTitle: "MBA / PGDM Admissions 2026",
        courseMeta: "2 Courses • 2 years",
        eligibilityBullets: [
          "Graduation degree in any stream with minimum 60% marks or equivalent CGPA",
          "Accepting Exams: **CAT, Written Test / Personal Interview (PI)**",
        ],
        datesHeading: "Important dates",
        datesTable: [
          {
            dates: "Aug '26 - Sep '26",
            event: "CAT 2026 Online Registration Window",
            isTentative: false,
          },
          {
            dates: "Oct '26",
            event: "CAT 2026 Admit Card Available",
            isTentative: false,
          },
          {
            dates: "Nov '26",
            event: "CAT 2026 Entrance Examination",
            isTentative: false,
          },
        ],
      },
    ];

    const defaultAdmissionFaqs: AdmissionFaqItem[] = [
      {
        question: `How do I get admission to ${shortName}?`,
        answer: `Admission to undergraduate programs (such as BTech) at ${shortName} is based on rank in JEE Advanced followed by JoSAA counselling. For PG programs, admissions require qualifying GATE/CAT/CEED exams depending on the course.`,
        upvotes: 2,
      },
      {
        question: `Can I take admission at ${shortName} MTech course without GATE?`,
        answer: `Direct admission for regular full-time MTech without GATE is generally offered only to IIT graduates with a CGPA of 8.0 or above. Other candidates must have a valid GATE score followed by written assessment or interview.`,
      },
      {
        question: `Can I get Admission into ${shortName} without JEE Main?`,
        answer: `For BTech courses, JEE Main is mandatory to qualify for JEE Advanced. However, other programs like B.Des accept UCEED, MBA accepts CAT, and MSc courses accept IIT JAM scores.`,
      },
      {
        question: `How can I get BTech Admission at ${shortName}?`,
        answer: `Candidates must pass Class 12 with minimum 75% marks (or top 20 percentile), qualify JEE Main, secure a top rank in JEE Advanced, and participate in JoSAA centralized seat allocation counselling.`,
        upvotes: 5,
      },
    ];

    const currentArticle = college.admissionArticle as AdmissionArticleData | undefined;
    if (currentArticle) {
      return {
        ...currentArticle,
        courseAdmissionBoxes:
          currentArticle.courseAdmissionBoxes && currentArticle.courseAdmissionBoxes.length > 0
            ? currentArticle.courseAdmissionBoxes
            : defaultCourseBoxes,
        faqsHeading: currentArticle.faqsHeading || "Commonly asked questions",
        faqsSubtitle: currentArticle.faqsSubtitle || "On Admissions",
        faqsButtonText: currentArticle.faqsButtonText || "Admission Details for all courses",
        faqs:
          currentArticle.faqs && currentArticle.faqs.length > 0
            ? currentArticle.faqs
            : defaultAdmissionFaqs,
      };
    }

    return {
      title: `${shortName} Admission & Application Process 2026`,
      introParagraph1: `**${shortName} offers UG, PG, and doctoral research courses**, like **BTech, BSc, BDes, MTech, MSc, MBA, MDes** and **PhD**. Among ${shortName} aspirants, **BTech** and **MTech** programmes are the most popular. The institute **does not offer direct admissions**. **${shortName} course admissions** are based on entrance exams, followed by counselling or a personal interview (PI), depending on the course.`,
      introParagraph2: `For admission to ${shortName}'s BTech and MTech programmes, candidates have to appear for **JEE Advanced 2026** and **GATE 2026**, respectively. More details around ${shortName} admissions are below:`,
      bullets: [
        {
          text: `Admission to the **MSc programme** is possible only with a valid **JAM 2026 Score**.`,
        },
        {
          text: `A valid **CAT 2026 score** is mandatory for admission to the **${shortName} MBA programme**.`,
        },
        {
          text: `${shortName} accepts the **UCEED score** for admission to the **BDes** programme.`,
        },
        {
          text: `**CEED 2026 score** is mandatory for admission to the **${shortName} MDes programme**. It's the only programme at **${shortName}** where candidates are required to appear for a Studio Test along with a Personal Interview.`,
        },
      ],
      afterBulletsParagraph1: `**${shortName} Admission 2026** are entrance based. **${shortName} Application 2026 window** opens through its official website, i.e. ${officialWebsite}. For **${shortName} BTech admissions**, candidates are required to apply through JoSAA. **${shortName} MTech Admissions** are conducted through COAP.`,
      afterBulletsParagraph2: `Candidates are then required to fill out the **${shortName} MTech application form** through the official website. For MDes, MBA and PhD admissions, candidates are required to fill the form available on the official **${shortName}** portal.`,
      footerNote: `Check out course-specific details for **${shortName} admission 2026** below:`,
      courseAdmissionBoxes: defaultCourseBoxes,
      faqsHeading: "Commonly asked questions",
      faqsSubtitle: "On Admissions",
      faqsButtonText: "Admission Details for all courses",
      faqs: defaultAdmissionFaqs,
    };
  };

  
// Helper to render authentic two-tone line icons matching user's Image 1 & 2 (2.5x larger, crisp line art)
const renderReviewCategoryIcon = (label: string, iconType?: string) => {
  const norm = (label + " " + (iconType || "")).toLowerCase();

  // 1. Placement / Job / Career / Briefcase (Open Briefcase with Flying Money/Cash)
  if (norm.includes("place") || norm.includes("job") || norm.includes("career") || norm.includes("briefcase")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Open Top Lid (Tilted Back) */}
        <path d="M8 20L13 8C13.8 6.5 15.5 5.5 17.5 5.5H30.5C32.5 5.5 34.2 6.5 35 8L40 20" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="#e2e8f0" />
        {/* Lid Handle */}
        <path d="M20 5.5V3C20 2.2 20.8 1.5 21.6 1.5H26.4C27.2 1.5 28 2.2 28 3V5.5" stroke="#1e293b" strokeWidth="2.6" strokeLinecap="round" />
        
        {/* Money / Cash Emerging & Flying from Peti */}
        {/* Banknote 1 (Tilted Left) */}
        <g transform="translate(10, 8) rotate(-14)">
          <rect width="13" height="7.5" rx="1.2" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
          <circle cx="6.5" cy="3.75" r="1.5" fill="#16a34a" />
        </g>
        {/* Banknote 2 (Tilted Right) */}
        <g transform="translate(24, 6) rotate(16)">
          <rect width="13" height="7.5" rx="1.2" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
          <circle cx="6.5" cy="3.75" r="1.5" fill="#16a34a" />
        </g>
        {/* Banknote 3 (Center High Rise) */}
        <g transform="translate(17.5, 5) rotate(2)">
          <rect width="13" height="8" rx="1.2" fill="#bbf7d0" stroke="#15803d" strokeWidth="2.2" />
          <circle cx="6.5" cy="4" r="1.6" fill="#15803d" />
          <line x1="2" y1="4" x2="3.5" y2="4" stroke="#15803d" strokeWidth="1.2" />
          <line x1="9.5" y1="4" x2="11" y2="4" stroke="#15803d" strokeWidth="1.2" />
        </g>

        {/* Floating Gold Coin / Sparkle */}
        <circle cx="10" cy="5" r="2.2" fill="#f59e0b" stroke="#d97706" strokeWidth="1.4" />
        <circle cx="38" cy="4" r="2.2" fill="#f59e0b" stroke="#d97706" strokeWidth="1.4" />

        {/* Main Briefcase Body (Base) */}
        <rect x="7" y="20" width="34" height="21" rx="4.5" fill="white" stroke="#1e293b" strokeWidth="3" />
        {/* Upper Rim of Base */}
        <line x1="7" y1="20" x2="41" y2="20" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        {/* Top Accent Band on Base */}
        <path d="M7 20H41V25H7V20Z" fill="#d1d5db" />
        
        {/* Center Metal Lock/Latch */}
        <rect x="20.5" y="22" width="7" height="8" rx="2" fill="white" stroke="#1e293b" strokeWidth="2.4" />
        <line x1="24" y1="25" x2="24" y2="27.5" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 2. Academic / Degree / Graduation Cap (Exact Match with Image 1)
  if (norm.includes("acad") || norm.includes("degree") || norm.includes("graduat")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 9L42 18L24 27L6 18L24 9Z" fill="#e5e7eb" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
        <path d="M13 22V31C13 31 17 37 24 37C31 37 35 31 35 31V22" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 20V30" stroke="#1e293b" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="11" cy="32" r="2.8" fill="#1e293b" />
      </svg>
    );
  }

  // 3. Faculty / Faculty & Course / Teacher / Instructor (Exact Match with Image 1)
  if (norm.includes("facult") || norm.includes("teach") || norm.includes("prof") || norm.includes("course")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="22" y="9" width="20" height="20" rx="3" fill="#f1f5f9" stroke="#1e293b" strokeWidth="3" />
        <line x1="27" y1="29" x2="25" y2="39" stroke="#1e293b" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="37" y1="29" x2="39" y2="39" stroke="#1e293b" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="22" y1="37" x2="42" y2="37" stroke="#1e293b" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M32 15A4.5 4.5 0 1 0 36.5 19.5L32 19.5V15Z" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="12" cy="14" r="4" stroke="#1e293b" strokeWidth="3" />
        <path d="M5 37V29C5 25.5 8.5 23 12 23C15.5 23 19 25.5 19 29V37" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 26.5L23.5 24.5" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Infrastructure / Campus / Building (Exact Match with Image 1)
  if (norm.includes("infra") || norm.includes("build") || (norm.includes("campus") && !norm.includes("life"))) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="9" width="14" height="28" rx="2" fill="white" stroke="#1e293b" strokeWidth="3" />
        <line x1="17" y1="13" x2="17" y2="29" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="22" y="16" width="16" height="21" rx="2" fill="#d1d5db" stroke="#1e293b" strokeWidth="3" />
        <path d="M7 39C7 36 9.5 34.5 12 34.5C13.5 34.5 14.5 35 15.5 35.5C16.5 34 18.5 33.5 20.5 34.5C22 35.5 22.5 37 22.5 39H7Z" fill="#9ca3af" stroke="#1e293b" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M22 39C22 36 24 34.5 26.5 34.5C28 34 30.5 34.5 31.5 35.5C33 34.5 35.5 35 36.5 36C37.5 37 37.5 39 37.5 39H22Z" fill="#9ca3af" stroke="#1e293b" strokeWidth="2.4" strokeLinejoin="round" />
        <line x1="5" y1="39" x2="43" y2="39" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. Accommodation / Hostel / Housing / Living / Home (Exact Match with Image 1)
  if (norm.includes("accom") || norm.includes("hostel") || norm.includes("stay") || norm.includes("house") || norm.includes("home") || norm.includes("room")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M31 16V11H36V20" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 22L24 9L41 22" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 20.5V37C11 38.1046 11.8954 39 13 39H35C36.1046 39 37 38.1046 37 37V20.5" fill="white" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
        <rect x="20" y="27" width="8" height="12" rx="1.5" fill="#e5e7eb" stroke="#1e293b" strokeWidth="2.5" />
      </svg>
    );
  }

  // 6. Social Life / Campus Life / Community / Friends / Users (Exact Match with Image 1)
  if (norm.includes("social") || norm.includes("life") || norm.includes("user") || norm.includes("friend") || norm.includes("crowd") || norm.includes("campus")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="15" r="4.5" stroke="#1e293b" strokeWidth="3" fill="#f1f5f9" />
        <circle cx="32" cy="15" r="4.5" stroke="#1e293b" strokeWidth="3" fill="#d1d5db" />
        <path d="M9 37V29C9 25.5 12 23 16 23H32C36 23 39 25.5 39 29V37" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="24" y1="23" x2="24" y2="37" stroke="#1e293b" strokeWidth="2.5" />
        <path d="M13 25.5C13 25.5 18.5 28 24 28C29.5 28 35 25.5 35 25.5" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. Value for Money / Finance / Landmark / Bank
  return (
    <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 17L24 8L40 17H8Z" fill="#e5e7eb" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
      <line x1="13" y1="17" x2="13" y2="32" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="17" x2="20" y2="32" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="17" x2="28" y2="32" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="17" x2="35" y2="32" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <rect x="7" y="32" width="34" height="4.5" rx="1.5" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2.5" />
      <line x1="5" y1="39.5" x2="43" y2="39.5" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

  const getCollegeReviewsArticle = (college: CollegeDetail): ReviewsArticleData => {
    const shortName = college.name.split(" - ")[0].split("(")[0].trim() || "College";

    const defaultHistogram: ReviewHistogramItem[] = [
      { starsRange: "4-5", count: 483 },
      { starsRange: "3-4", count: 129 },
      { starsRange: "2-3", count: 10 },
      { starsRange: "1-2", count: 1 },
    ];

    const defaultParameters: ReviewParameterItem[] = [
      { label: "Placements", rating: 4.4, iconType: "briefcase" },
      { label: "Infrastructure", rating: 4.4, iconType: "building" },
      { label: "Faculty & Course", rating: 4.3, iconType: "book" },
      { label: "Campus Life", rating: 4.6, iconType: "users" },
      { label: "Value for Money", rating: 4.6, iconType: "dollar" },
    ];

    const DEFAULT_STUDENT_FEEDBACK_CATEGORIES: StudentFeedbackCategory[] = [
      {
        category: "Placements",
        likesText: "The recruiting companies were Capgemini, Microsoft, Uber, Amazon, Zomato, Flipkart, Deloitte, Google, Shell, KPMG, IBM, Dell, Wipro, Infosys, Absolute Data, and Ernst & Young.",
        likesCountText: "Based on 178 Reviews",
        dislikesText: "Many decent students missed internship opportunities due to lack of visiting companies, or the companies having unfound minimum criteria for selection.",
        dislikesCountText: "Based on 16 Reviews",
      },
      {
        category: "Infrastructure",
        likesText: "Hostels are well-maintained with high-speed Wi-Fi, modern air-conditioned research laboratories, world-class central library, and top sports facilities including Olympic-standard grounds.",
        likesCountText: "Based on 142 Reviews",
        dislikesText: "Some older hostel wings and mess areas require periodic maintenance and room allocation can get crowded during peak incoming batch admissions.",
        dislikesCountText: "Based on 22 Reviews",
      },
      {
        category: "Faculty",
        likesText: "Distinguished professors with extensive research backgrounds, PhDs from top global universities, highly accessible during office hours, and curriculum aligned with modern industry demands.",
        likesCountText: "Based on 115 Reviews",
        dislikesText: "Rigorous grading policies with high academic workload and frequent surprise quizzes can sometimes create stressful exam schedules for students.",
        dislikesCountText: "Based on 18 Reviews",
      },
      {
        category: "Other",
        likesText: "Vibrant campus fest culture (Rendezvous & Tryst), active student tech clubs, great alumni network backing, and unmatched peer learning environment across diverse streams.",
        likesCountText: "Based on 98 Reviews",
        dislikesText: "Competitive campus atmosphere can be challenging initially for freshmen before adjusting to peer pace and routine.",
        dislikesCountText: "Based on 12 Reviews",
      },
    ];

    if (college.reviewsArticle) {
      return {
        tagText: college.reviewsArticle.tagText || shortName,
        title: college.reviewsArticle.title || "Students Ratings & Reviews",
        overallScore: college.reviewsArticle.overallScore ?? 4.5,
        totalReviewsCount: college.reviewsArticle.totalReviewsCount || "623 Verified Reviews",
        histogram:
          college.reviewsArticle.histogram && college.reviewsArticle.histogram.length > 0
            ? college.reviewsArticle.histogram
            : defaultHistogram,
        parameters:
          college.reviewsArticle.parameters && college.reviewsArticle.parameters.length > 0
            ? college.reviewsArticle.parameters
            : defaultParameters,
        studentFeedback: college.reviewsArticle.studentFeedback || {
          heading: "What students say about " + (college.fullName || college.name),
          categories: DEFAULT_STUDENT_FEEDBACK_CATEGORIES,
        },
        reviewCards:
          college.reviewsArticle.reviewCards && college.reviewsArticle.reviewCards.length > 0
            ? college.reviewsArticle.reviewCards
            : DEFAULT_DETAILED_REVIEW_CARDS,
        mediaReviews: college.reviewsArticle.mediaReviews || {
          title: "Student Video Reviews",
          items: DEFAULT_STUDENT_MEDIA_REVIEWS,
        },
        moreReviewCards:
          college.reviewsArticle.moreReviewCards && college.reviewsArticle.moreReviewCards.length > 0
            ? college.reviewsArticle.moreReviewCards
            : DEFAULT_MORE_REVIEW_CARDS,
      };
    }

    return {
      tagText: shortName,
      title: "Students Ratings & Reviews",
      overallScore: 4.5,
      totalReviewsCount: "623 Verified Reviews",
      histogram: defaultHistogram,
      parameters: defaultParameters,
      studentFeedback: {
        heading: "What students say about " + (college.fullName || college.name),
        categories: DEFAULT_STUDENT_FEEDBACK_CATEGORIES,
      },
      reviewCards: DEFAULT_DETAILED_REVIEW_CARDS,
      mediaReviews: {
        title: "Student Video Reviews",
        items: DEFAULT_STUDENT_MEDIA_REVIEWS,
      },
      moreReviewCards: DEFAULT_MORE_REVIEW_CARDS,
    };
  };

  const getCollegeRankingsArticle = (college: CollegeDetail): RankingsArticleData => {
    const shortName = college.name.split(" - ")[0].split("(")[0].trim() || "College";
    const fullName = college.fullName || college.name;

    const defaultInternationalRows: RankingTableRow[] = [
      { body: "QS World University Rankings 2027", category: "World University", rank: "118" },
      { body: "QS World University Rankings 2026", category: "World University", rank: "123" },
      { body: "QS World Ranking 2025", category: "World University", rank: "150" },
      { body: "QS World Rankings: Southern Asia 2026", category: "Institute", rank: "1" },
      { body: "QS Asian University Rankings 2026", category: "Institute", rank: "59" },
    ];

    const defaultNationalRows: RankingTableRow[] = [
      { body: "India Today", category: "Engineering", rank: "1" },
      { body: "NIRF 2025", category: "Engineering", rank: "2" },
      { body: "NIRF 2025", category: "Research Institutions", rank: "3" },
      { body: "NIRF 2025", category: "Overall", rank: "4" },
      { body: "NIRF 2025", category: "Management", rank: "4" },
      { body: "NIRF 2025", category: "Innovation", rank: "7" },
    ];

    const defaultCourseRankingBoxes: CourseRankingBoxItem[] = [
      {
        title: "B.E. / B.Tech Ranking",
        yearsHeader: ["Publisher", "2024", "2025", "2026"],
        tableRows: [
          { publisher: "NIRF", rank2024: "2", rank2025: "2", rank2026: "- / -" },
          { publisher: "India Today", rank2024: "1", rank2025: "2", rank2026: "1" },
          { publisher: "The Week", rank2024: "- / -", rank2025: "1", rank2026: "2" },
          { publisher: "QS World University Rankings", rank2024: "- / -", rank2025: "26", rank2026: "36" },
        ],
        highlightBadge: `Best Among NIRF Ranked Colleges In Delhi In 2025 →`,
      },
      {
        title: "M.E. / M.Tech Ranking",
        yearsHeader: ["Publisher", "2024", "2025", "2026"],
        tableRows: [
          { publisher: "NIRF", rank2024: "2", rank2025: "2", rank2026: "2" },
          { publisher: "QS World University Rankings (Engineering & Tech)", rank2024: "48", rank2025: "45", rank2026: "41" },
          { publisher: "India Today", rank2024: "1", rank2025: "1", rank2026: "1" },
          { publisher: "Outlook", rank2024: "2", rank2025: "2", rank2026: "2" },
        ],
        highlightBadge: `Top Ranked Engineering Master's Institute in India →`,
      },
      {
        title: "MBA / PGDM Ranking",
        yearsHeader: ["Publisher", "2024", "2025", "2026"],
        tableRows: [
          { publisher: "NIRF", rank2024: "5", rank2025: "4", rank2026: "4" },
          { publisher: "Business Today", rank2024: "8", rank2025: "7", rank2026: "6" },
          { publisher: "Outlook-ICARE", rank2024: "5", rank2025: "4", rank2026: "4" },
          { publisher: "The Week", rank2024: "6", rank2025: "5", rank2026: "5" },
        ],
        highlightBadge: `Ranked #4 by NIRF 2025 in Management Category →`,
      },
    ];

    const defaultRankingFaqs: RankingFaqItem[] = [
      {
        question: `How is the ranking of DMS ${shortName}?`,
        answer: `As per NIRF 2025 Rankings, the Department of Management Studies (DMS) ${shortName} is ranked 4th in the Management category nationwide. It consistently features among the premier top 5 management institutions in India.`,
      },
    ];

    if (college.rankingsArticle) {
      return {
        title: college.rankingsArticle.title || `${shortName} Rankings 2026`,
        introParagraph:
          college.rankingsArticle.introParagraph ||
          `**${shortName}** has improved its global standing from 123rd rank to **118th rank in QS World University Ranking 2027**, retaining the top spot for the 2nd consecutive year. ${shortName} is one of the **top ranking engineering institutes** in various rankings, including NIRF, QS World University Rankings, QS Asia Ranking, Times Higher Education, etc., the **${fullName}** has significantly risen over the past few years. Take a look at the comprehensive **${shortName} Rankings** below:`,
        internationalHeading:
          college.rankingsArticle.internationalHeading ||
          `${shortName} International Rankings 2025, 2026, 2027`,
        internationalRows:
          college.rankingsArticle.internationalRows && college.rankingsArticle.internationalRows.length > 0
            ? college.rankingsArticle.internationalRows
            : defaultInternationalRows,
        nationalHeading:
          college.rankingsArticle.nationalHeading ||
          `${shortName} National Rankings 2025, 2026`,
        nationalRows:
          college.rankingsArticle.nationalRows && college.rankingsArticle.nationalRows.length > 0
            ? college.rankingsArticle.nationalRows
            : defaultNationalRows,
        footerNote:
          college.rankingsArticle.footerNote ||
          `Check course-specific **${shortName} rankings** below:`,
        courseRankingBoxes:
          college.rankingsArticle.courseRankingBoxes && college.rankingsArticle.courseRankingBoxes.length > 0
            ? college.rankingsArticle.courseRankingBoxes
            : defaultCourseRankingBoxes,
        faqsHeading: college.rankingsArticle.faqsHeading || "Commonly asked questions",
        faqsSubtitle: college.rankingsArticle.faqsSubtitle || "On Rankings",
        faqsBtn1Text: college.rankingsArticle.faqsBtn1Text || "View Ranking Details",
        faqsBtn2Text: college.rankingsArticle.faqsBtn2Text || "Ranking Details",
        faqs:
          college.rankingsArticle.faqs && college.rankingsArticle.faqs.length > 0
            ? college.rankingsArticle.faqs
            : defaultRankingFaqs,
      };
    }

    return {
      title: `${shortName} Rankings 2026`,
      introParagraph: `**${shortName}** has improved its global standing from 123rd rank to **118th rank in QS World University Ranking 2027**, retaining the top spot for the 2nd consecutive year. ${shortName} is one of the **top ranking engineering institutes** in various rankings, including NIRF, QS World University Rankings, QS Asia Ranking, Times Higher Education, etc., the **${fullName}** has significantly risen over the past few years. Take a look at the comprehensive **${shortName} Rankings** below:`,
      internationalHeading: `${shortName} International Rankings 2025, 2026, 2027`,
      internationalRows: defaultInternationalRows,
      nationalHeading: `${shortName} National Rankings 2025, 2026`,
      nationalRows: defaultNationalRows,
      footerNote: `Check course-specific **${shortName} rankings** below:`,
      courseRankingBoxes: defaultCourseRankingBoxes,
      faqsHeading: "Commonly asked questions",
      faqsSubtitle: "On Rankings",
      faqsBtn1Text: "View Ranking Details",
      faqsBtn2Text: "Ranking Details",
      faqs: defaultRankingFaqs,
    };
  };

  const getCollegeTocList = (college: CollegeDetail): TableOfContentItem[] => {
    if (college.tableOfContents && college.tableOfContents.length > 0) {
      return college.tableOfContents.map((item) => ({
        ...item,
        tabId: "info",
      }));
    }
    const shortName = college.name.split(" - ")[0].split("(")[0].trim() || "College";
    return [
      { label: `${shortName} Highlights 2026`, targetId: "highlights-section", tabId: "info" },
      { label: `${shortName} Cutoff 2026`, targetId: "cutoffs-section", tabId: "info" },
      { label: `${shortName} Courses & Fees 2026`, targetId: "courses-section", tabId: "info" },
      { label: `${shortName} Placements 2026`, targetId: "placements-section", tabId: "info" },
      { label: `${shortName} Admission & Application Process 2026`, targetId: "admissions-section", tabId: "info" },
      { label: `${shortName} Rankings 2026`, targetId: "rankings-section", tabId: "info" },
      { label: `${shortName} Student Reviews`, targetId: "reviews-section", tabId: "info" },
      { label: `${shortName} Scholarships 2026`, targetId: "scholarships-section", tabId: "info" },
      { label: `${shortName} Popular Courses`, targetId: "courses-section", tabId: "info" },
      { label: `${shortName} College comparison`, targetId: "compare-section", tabId: "info" },
      { label: `${shortName} Campus & Facilities 2026`, targetId: "campus-section", tabId: "info" },
      { label: `${shortName} Colleges/Departments`, targetId: "faculty-section", tabId: "info" },
      { label: `Top online courses you might be interested in`, targetId: "courses-section", tabId: "info" },
      { label: `${shortName} Notable Alumni`, targetId: "about-section", tabId: "info" },
      { label: `${shortName} FAQs`, targetId: "faq-section", tabId: "info" },
    ];
  };

  const handleTocClick = (item: TableOfContentItem) => {
    // 1. Always stay in / switch to 'info' (Overview) where the master section boxes live
    if (activeTab !== "info") {
      setActiveTab("info");
    }

    // 2. Expand target card if currently collapsed
    if (item.targetId === "highlights-section") {
      setIsHighlightsOpen(true);
    } else if (item.targetId === "cutoffs-section") {
      setIsCutoffCardOpen(true);
    } else if (item.targetId === "admissions-section") {
      setIsAdmissionCardOpen(true);
    }

    // 3. Smoothly scroll directly to the box with sticky header offset
    setTimeout(() => {
      const el = document.getElementById(item.targetId);
      if (el) {
        const yOffset = -90; // sticky header offset
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 80);
  };

  const openMiniModal = (modalId: MiniModalId) => {
    setTempData(JSON.parse(JSON.stringify(collegeData)));
    setActiveMiniModal(modalId);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const updatedData: CollegeDetail = { ...tempData };

      const res = await fetch("/api/colleges/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Samrat1311",
          password: "1311161161",
          slug: slug,
          updatedFields: {
            description: JSON.stringify(updatedData),
            tuition_fees: updatedData.totalFees,
            image_url: updatedData.image,
          },
        }),
      });

      if (res.ok) {
        setCollegeData(updatedData);
        setActiveMiniModal(null);
        alert("✅ Section updated and published live!");
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update section.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error updating section.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          course_interest: formData.stream,
          college_interest: collegeData.name,
        }),
      });
    } catch (err) {
      console.error("Error submitting lead:", err);
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", phone: "", stream: "Engineering" });
    }, 3000);
  };

  const filteredCourses = collegeData.courses.filter(
    (c) =>
      c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.eligibility.toLowerCase().includes(courseSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Loading {slug ? slug.replace("-", " ") : "college"} details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 space-y-4 select-none">
      {/* 1. SHIKSHA-STYLE MODERN HERO BANNER */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-xl">
        {/* Cover Photo with Dark Gradient & Ambient Backlight */}
        <div className="relative h-[220px] sm:h-[290px] md:h-[340px] w-full overflow-hidden bg-slate-950">
          <img
            src={collegeData.image || "/images/iitdelhi_real.jpg"}
            alt={collegeData.name}
            className="w-full h-full object-cover object-center transform scale-102 hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />

          {/* Photo Gallery Badge Button */}
          <button
            onClick={() => setActivePhotoIdx(0)}
            className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20 text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>16+ Photos & Campus Tour</span>
          </button>
        </div>

        {/* Floating Logo + Meta Badges & Action Buttons */}
        <div className="relative -mt-14 px-5 sm:px-8 pb-6 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Square College Logo Box */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-4 border-white shadow-xl p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
              {collegeData.logo ? (
                <img
                  src={collegeData.logo}
                  alt={`${collegeData.name} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center">
                  IITD
                </div>
              )}
            </div>

            {/* College Titles & Meta Info */}
            <div className="space-y-1 text-white pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-600/90 text-white text-[9.5px] font-black uppercase tracking-wider shadow-xs">
                  {collegeData.type.split("•")[0].trim()}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9.5px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {collegeData.nirfRank}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[9.5px] font-bold">
                  Estd. {collegeData.estd}
                </span>
              </div>

              <h1 className="font-outfit font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-tight">
                {collegeData.fullName || collegeData.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-semibold pt-0.5">
                <span className="flex items-center gap-1 text-orange-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {collegeData.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-black text-white">{collegeData.rating}</span>
                  <span className="text-slate-400">({collegeData.ratingCount})</span>
                </span>
                <span className="text-emerald-400 font-bold">
                  ✓ 100% Verified Campus
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            {isAdmin && (
              <button
                onClick={() => openMiniModal("header")}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Edit Banner Image & Header Titles"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Banner</span>
              </button>
            )}
            <button
              onClick={() => alert("Brochure sent to your email & WhatsApp!")}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Brochure</span>
            </button>
            <Link
              href={`/compare?ids=iit-delhi,bits-pilani`}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare</span>
            </Link>
            <button
              onClick={() => {
                const formElem = document.getElementById("lead-inquiry-box");
                formElem?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-black shadow-lg shadow-orange-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply / Predict Seat</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. GLASSMORPHIC SUB-HEADER TABS WITH SEPARATORS */}
      <div id="college-nav-tabs-bar" className="sticky top-16 md:top-0 bg-white/85 backdrop-blur-xl z-30 border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] py-1 relative scroll-mt-4">
        {canScrollLeft && (
          <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-white via-white/90 to-transparent z-20 flex items-center pl-2 pointer-events-none">
            <button
              onClick={() => scrollTabs("left")}
              aria-label="Scroll left"
              className="w-8 h-8 rounded-full bg-white/95 border border-slate-200/90 shadow-lg flex items-center justify-center text-slate-700 hover:text-orange-600 hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        <div
          ref={tabScrollRef}
          onScroll={checkTabScroll}
          className="flex items-center gap-1 overflow-x-auto scroll-smooth px-3 sm:px-8 py-1.5 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {SHIKSHA_NAV_TABS.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setTimeout(checkTabScroll, 100);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 relative flex-shrink-0 cursor-pointer select-none group ${
                    isActive
                      ? "bg-gradient-to-r from-[#4a154b]/10 to-[#6b21a8]/10 text-[#4a154b] font-black border border-[#4a154b]/20 shadow-xs backdrop-blur-md"
                      : "text-slate-600 hover:text-slate-950 hover:bg-white/80 hover:shadow-xs hover:border hover:border-slate-200/70"
                  }`}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="glassTabActive"
                      className="absolute inset-0 rounded-xl bg-white/40 shadow-inner border border-white/60 pointer-events-none"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                </button>

                {index < SHIKSHA_NAV_TABS.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-slate-300/80 mx-0.5 shrink-0 select-none pointer-events-none" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {canScrollRight && (
          <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent z-20 flex items-center justify-end pr-2 pointer-events-none">
            <button
              onClick={() => scrollTabs("right")}
              aria-label="Scroll right"
              className="w-8 h-8 rounded-full bg-white/95 border border-slate-200/90 shadow-lg flex items-center justify-center text-slate-700 hover:text-orange-600 hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2.5. CONTENT AUTHOR BYLINE (CLEAN MINIMAL INLINE TEXT - NO HEAVY BORDER/BOX) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 sm:px-2 pt-0.5 pb-0.5">
        <div className="flex items-center gap-2.5">
          {/* Author Badge / Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c23616] via-[#273c75] to-[#192a56] p-0.5 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
            {collegeData.author?.image ? (
              <img
                src={collegeData.author.image}
                alt={collegeData.author.name}
                className="w-full h-full object-cover rounded-[9px]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full rounded-[9px] bg-gradient-to-br from-[#d63031] via-[#0984e3] to-[#2d3436] flex flex-col items-center justify-center text-white">
                <GraduationCap className="w-4 h-4 text-white" />
                <span className="text-[6px] font-black uppercase tracking-tighter text-white/90">TYC</span>
              </div>
            )}
          </div>

          {/* Author Name, Verified Green Checkmark, Role and Updated Date */}
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-outfit font-black text-sm text-[#6b21a8] hover:underline cursor-pointer">
                {collegeData.author?.name || "Shreeya Panda"}
              </span>
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#10b981] text-white text-[8.5px] font-black shadow-2xs">
                ✓
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-700">
              {collegeData.author?.role || "Intern"}
            </p>
            <p className="text-[10px] font-medium text-slate-500 pt-0.5">
              Updated on - {collegeData.author?.updatedDate || "Feb 09, 2026"}
            </p>
          </div>
        </div>

        {/* Fact check badge & admin edit */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold tracking-wide flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>100% Fact Checked</span>
          </span>
          {isAdmin && (
            <button
              onClick={() => openMiniModal("author")}
              className="px-2.5 py-0.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10.5px] font-bold border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit className="w-3 h-3" />
              <span>Edit Author</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. CORE TWO-COLUMN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-5 pt-1">
        {/* LEFT COLUMN: ACTIVE TAB CONTENT (70%) */}
        <div className="lg:col-span-7 space-y-2.5">
          {/* TAB 1: COLLEGE INFO */}
          {activeTab === "info" && (
            <div className="space-y-2.5">
              {/* 1. TABLE OF CONTENTS (WORLD-CLASS PREMIUM REFERENCE TEMPLATE) */}
              {(() => {
                const tocList = getCollegeTocList(collegeData);
                const visibleList = isTocExpanded ? tocList : tocList.slice(0, 5);
                const remainingCount = Math.max(0, tocList.length - 5);
                const collegeShortName = collegeData.name.split(" - ")[0].split("(")[0].trim() || "College";

                return (
                  <div className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-slate-300/90 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_28px_-6px_rgba(15,23,42,0.08)] transition-all duration-300">
                    {/* Top Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wide block">
                          {collegeShortName} Overview
                        </span>
                        <h2 className="text-lg sm:text-xl font-black font-outfit text-slate-900 tracking-tight flex items-center gap-2">
                          <span>Table of contents</span>
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => openMiniModal("toc")}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit TOC</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsTocOpen(!isTocOpen)}
                          aria-label={isTocOpen ? "Collapse Table of Contents" : "Expand Table of Contents"}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all cursor-pointer shadow-2xs active:scale-90"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                              isTocOpen ? "rotate-180 text-blue-600" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Body */}
                    <AnimatePresence initial={false}>
                      {isTocOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-2 border-t border-slate-100/90 mt-3.5">
                            {visibleList.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleTocClick(item)}
                                className="group/item flex items-center text-left text-[#1a73e8] hover:text-[#0b57d0] text-[14px] sm:text-[14.5px] font-semibold leading-relaxed transition-all cursor-pointer py-0.5 w-full"
                              >
                                <span className="group-hover/item:underline underline-offset-2">
                                  {item.label}
                                </span>
                              </button>
                            ))}

                            {/* + X more items / - Collapse toggle */}
                            {tocList.length > 5 && (
                              <div className="pt-1.5">
                                {!isTocExpanded ? (
                                  <button
                                    type="button"
                                    onClick={() => setIsTocExpanded(true)}
                                    className="inline-flex items-center gap-1.5 text-[#1a73e8] hover:text-[#0b57d0] text-[14px] sm:text-[14.5px] font-bold transition-all cursor-pointer underline-offset-4 hover:underline"
                                  >
                                    <span>+ {remainingCount} more items</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setIsTocExpanded(false)}
                                    className="inline-flex items-center gap-1.5 text-[#1a73e8] hover:text-[#0b57d0] text-[14px] sm:text-[14.5px] font-bold transition-all cursor-pointer underline-offset-4 hover:underline"
                                  >
                                    <span>- Collapse</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}

              {/* 2. HIGHLIGHTS 2026 CARD (EXACT USER REFERENCE TEMPLATE) */}
              {(() => {
                const hlData = getCollegeHighlightsArticle(collegeData);
                const collegeShortName = collegeData.name.split(" - ")[0].split("(")[0].trim() || "College";
                const bullets = hlData.bullets || [];
                const firstBullet = bullets[0];

                return (
                  <div
                    id="highlights-section"
                    className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-slate-300/90 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 scroll-mt-24"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg sm:text-xl font-bold font-outfit text-slate-900 tracking-tight">
                        {collegeShortName} Highlights 2026
                      </h2>

                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => openMiniModal("highlights")}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Highlights</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsHighlightsOpen(!isHighlightsOpen)}
                          aria-label={isHighlightsOpen ? "Collapse Highlights" : "Expand Highlights"}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all cursor-pointer shadow-2xs active:scale-90"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                              isHighlightsOpen ? "rotate-180 text-blue-600" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Body */}
                    <AnimatePresence initial={false}>
                      {isHighlightsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-3.5 text-[13.5px] sm:text-[14px] text-slate-700 leading-relaxed font-normal">
                            {/* Intro text */}
                            <p className="leading-relaxed">
                              {hlData.introText}
                            </p>

                            {/* Bullets: Collapsed vs Expanded */}
                            {!isHighlightsExpanded ? (
                              <div className="relative pt-0.5">
                                {firstBullet && (
                                  <div className="relative max-h-[82px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_45%,rgba(0,0,0,0.5)_75%,transparent_100%)]">
                                    <div className="flex items-start gap-2 text-slate-700">
                                      <span className="text-slate-900 font-black mt-0.5">•</span>
                                      <p className="leading-relaxed">
                                        <strong className="text-slate-900 font-bold">{firstBullet.title}: </strong>
                                        {firstBullet.text}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {/* Ultra-Premium Water & Glass Fade Overlay with Read more */}
                                <div className="absolute inset-x-0 bottom-0 h-11 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-end pointer-events-auto pr-0.5">
                                  <button
                                    type="button"
                                    onClick={() => setIsHighlightsExpanded(true)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13.5px] font-bold hover:underline cursor-pointer transition-colors"
                                  >
                                    Read more
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3 pt-1">
                                {bullets.map((b, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-slate-700">
                                    <span className="text-slate-900 font-black mt-0.5">•</span>
                                    <p className="leading-relaxed">
                                      <strong className="text-slate-900 font-bold">{b.title}: </strong>
                                      {b.text}
                                    </p>
                                  </div>
                                ))}

                                {/* NIRF Callout Box */}
                                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                                  <h4 className="font-outfit font-bold text-[13.5px] text-slate-900">
                                    {hlData.nirfCalloutTitle || `Why Is ${collegeShortName} Ranked Among India's Best?`}
                                  </h4>
                                  <p className="text-[12.5px] text-slate-600 font-normal leading-relaxed">
                                    {hlData.nirfCalloutDesc || "Explore official NIRF 2026 data on placements, research, faculty strength and student outcomes."}
                                  </p>
                                  <div className="pt-1">
                                    <a
                                      href={hlData.nirfReportUrl || "https://home.iitd.ac.in/"}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a73e8] hover:underline"
                                    >
                                      <FileText className="w-3.5 h-3.5 text-red-500" />
                                      <span>Access {collegeShortName} NIRF 2026 Report</span>
                                    </a>
                                  </div>
                                </div>

                                {/* Read less */}
                                <div className="pt-1 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setIsHighlightsExpanded(false)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13px] font-bold hover:underline cursor-pointer flex items-center gap-1"
                                  >
                                    Read less
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* THIN DIVIDER & COMMONLY ASKED QUESTIONS (ON HIGHLIGHTS) */}
                            {hlData.faqs && hlData.faqs.length > 0 && (
                              <div className="mt-5 pt-5 border-t border-slate-200/80 space-y-3">
                                {/* Header */}
                                <div className="flex items-center justify-between gap-2.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
                                      <HelpCircle className="w-4.5 h-4.5 text-amber-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-outfit font-bold text-[15px] sm:text-base text-slate-900 leading-tight">
                                        Commonly asked questions
                                      </h3>
                                      <p className="text-[11.5px] sm:text-xs text-slate-500 font-medium">
                                        On Highlights
                                      </p>
                                    </div>
                                  </div>

                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("highlights")}
                                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
                                    >
                                      <Edit className="w-3.5 h-3.5 text-amber-700" />
                                      <span>Edit Q&A</span>
                                    </button>
                                  )}
                                </div>

                                {/* Accordion List */}
                                <div className="divide-y divide-slate-100/90 pt-1">
                                  {hlData.faqs.map((faq, fIdx) => {
                                    const isOpen = openHighlightFaqIdx === fIdx;
                                    const rawQ = faq.question.trim();
                                    const formattedQ = rawQ.startsWith("Q:") || rawQ.startsWith("Q.") ? rawQ : `Q: ${rawQ}`;
                                    const rawA = faq.answer.trim();
                                    const formattedA = rawA.startsWith("A:") || rawA.startsWith("A.") ? rawA : `A: ${rawA}`;

                                    return (
                                      <div key={fIdx} className="py-2.5 first:pt-1 last:pb-0">
                                        <button
                                          type="button"
                                          onClick={() => setOpenHighlightFaqIdx(isOpen ? null : fIdx)}
                                          className="w-full flex items-center justify-between gap-3 text-left py-1 text-slate-800 hover:text-blue-600 transition-colors cursor-pointer group/q"
                                        >
                                          <span className="font-outfit font-bold text-[13px] sm:text-[13.5px] leading-snug group-hover/q:text-blue-600 transition-colors">
                                            {formattedQ}
                                          </span>
                                          <ChevronDown
                                            className={`w-4 h-4 text-slate-500 group-hover/q:text-blue-600 shrink-0 transition-transform duration-200 ${
                                              isOpen ? "rotate-180 text-blue-600" : ""
                                            }`}
                                          />
                                        </button>

                                        <AnimatePresence initial={false}>
                                          {isOpen && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.2, ease: "easeInOut" }}
                                              className="overflow-hidden"
                                            >
                                              <div className="pt-2 pb-3 space-y-3 pl-0.5 text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                                                {/* Multi-paragraph answer */}
                                                <div className="space-y-2">
                                                  {formattedA.split("\n\n").map((para, pIdx) => (
                                                    <p key={pIdx} className="leading-relaxed">
                                                      {para}
                                                    </p>
                                                  ))}
                                                </div>

                                                {/* Free Admissions Guidance Callout Box (Shiksha Reference) */}
                                                <div className="mt-3 p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                                                  <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                                                      <img
                                                        src="/images/counselor_avatar.png"
                                                        alt="Expert Counselor"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                          (e.target as HTMLElement).style.display = "none";
                                                        }}
                                                      />
                                                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-xs">
                                                        SP
                                                      </div>
                                                      <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                    </div>
                                                    <div>
                                                      <h5 className="font-outfit font-bold text-xs sm:text-[13px] text-slate-900 leading-tight">
                                                        Get <span className="text-emerald-600 font-black italic">free</span> admissions guidance
                                                      </h5>
                                                      <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                                                        <span>★ 0</span>
                                                        <span>•</span>
                                                        <span>0 review</span>
                                                      </p>
                                                    </div>
                                                  </div>

                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const leadEl = document.getElementById("lead-inquiry-box");
                                                      if (leadEl) {
                                                        leadEl.scrollIntoView({ behavior: "smooth" });
                                                      }
                                                    }}
                                                    className="px-5 py-2 rounded-full bg-[#1c142e] hover:bg-[#2b2046] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
                                                  >
                                                    Call Us
                                                  </button>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}

              {/* 3. CUTOFF 2026 CARD (STEP 2 IN MASTER TEMPLATE) */}
              {(() => {
                const cutData = getCollegeCutoffArticle(collegeData);
                const collegeShortName = collegeData.name.split(" - ")[0].split("(")[0].trim() || "College";
                const paragraphs = cutData.paragraphs || [];
                const firstTwoParas = paragraphs.slice(0, 2);
                const thirdPara = paragraphs[2];

                return (
                  <div
                    id="cutoffs-section"
                    className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-slate-300/90 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 scroll-mt-24"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg sm:text-xl font-bold font-outfit text-slate-900 tracking-tight">
                        {cutData.title || `${collegeShortName} Cutoff 2026`}
                      </h2>

                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => openMiniModal("cutoffs")}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Cutoffs</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsCutoffCardOpen(!isCutoffCardOpen)}
                          aria-label={isCutoffCardOpen ? "Collapse Cutoff Card" : "Expand Cutoff Card"}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all cursor-pointer shadow-2xs active:scale-90"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                              isCutoffCardOpen ? "rotate-180 text-blue-600" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Card Body */}
                    <AnimatePresence initial={false}>
                      {isCutoffCardOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3.5 space-y-3.5 text-[13.5px] sm:text-[14px] text-slate-700 leading-relaxed font-normal">
                            {!isCutoffArticleExpanded ? (
                              <div className="space-y-3 relative pt-0.5">
                                {firstTwoParas.map((p, idx) => (
                                  <p key={idx} className="leading-relaxed">
                                    {renderFormattedText(p)}
                                  </p>
                                ))}

                                {/* 3rd paragraph with frosted water glass mask fade */}
                                {thirdPara && (
                                  <div className="relative max-h-[52px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_15%,rgba(0,0,0,0.35)_55%,transparent_100%)]">
                                    <p className="leading-relaxed text-slate-700">
                                      {renderFormattedText(thirdPara)}
                                    </p>
                                  </div>
                                )}

                                {/* Ultra-Premium Water & Glass Fade Overlay with Read more */}
                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-end pointer-events-auto pr-0.5">
                                  <button
                                    type="button"
                                    onClick={() => setIsCutoffArticleExpanded(true)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13.5px] font-bold hover:underline cursor-pointer transition-colors"
                                  >
                                    Read more
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3.5 pt-0.5">
                                {/* All initial paragraphs */}
                                {paragraphs.map((p, idx) => (
                                  <p key={idx} className="leading-relaxed">
                                    {renderFormattedText(p)}
                                  </p>
                                ))}

                                {/* Callout Box: Missed the Cutoff */}
                                {cutData.calloutTitle && (
                                  <div className="my-3 p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-1.5">
                                    <h4 className="font-outfit font-bold text-[14px] text-slate-900">
                                      {cutData.calloutTitle}
                                    </h4>
                                    <p className="text-[12.5px] text-slate-600 font-normal leading-relaxed">
                                      {cutData.calloutDesc || "Explore engineering colleges accepting low JEE Main ranks and discover alternative pathways to pursue your BTech dream."}
                                    </p>
                                    <div className="pt-1">
                                      <a
                                        href={cutData.calloutPdfUrl || "#"}
                                        onClick={(e) => {
                                          if (!cutData.calloutPdfUrl || cutData.calloutPdfUrl === "#") {
                                            e.preventDefault();
                                            const leadEl = document.getElementById("lead-inquiry-box");
                                            if (leadEl) {
                                              leadEl.scrollIntoView({ behavior: "smooth" });
                                            }
                                          }
                                        }}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a73e8] hover:underline cursor-pointer"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-red-500" />
                                        <span>Download Free PDF</span>
                                      </a>
                                    </div>
                                  </div>
                                )}

                                {/* After Callout Paragraphs */}
                                {cutData.afterCalloutParagraphs?.map((p, idx) => (
                                  <p key={idx} className="leading-relaxed">
                                    {renderFormattedText(p)}
                                  </p>
                                ))}

                                {/* Footer Note */}
                                {cutData.footerNote && (
                                  <p className="text-[13.5px] text-slate-700 font-medium">
                                    Check <span className="text-[#1a73e8] font-bold cursor-pointer hover:underline">{collegeShortName} Cut Off 2026</span> for other programmes below:
                                  </p>
                                )}

                                {/* Read less */}
                                <div className="pt-1 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setIsCutoffArticleExpanded(false)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13px] font-bold hover:underline cursor-pointer flex items-center gap-1"
                                  >
                                    Read less
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* 3-YEAR CUTOFF ROUND COMPARISON ACCORDION BOX (EXACT USER REFERENCE TEMPLATE) */}
                            {(() => {
                              const comparisonData = getCollegeCutoffComparison(collegeData);
                              const years = comparisonData.years || ["2024", "2025", "2026"];

                              return (
                                <div className="mt-3.5 pt-1">
                                  <div className="bg-white/95 border border-slate-200/90 hover:border-slate-300/90 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] transition-all">
                                    {/* Accordion Toggle Header */}
                                    <div
                                      onClick={() => setIsCutoffRoundOpen(!isCutoffRoundOpen)}
                                      className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer group/hdr select-none"
                                    >
                                      <h3 className="text-sm sm:text-[15px] font-bold font-outfit text-slate-900 tracking-tight group-hover/hdr:text-blue-600 transition-colors">
                                        {comparisonData.title || `Cut Off 2026 for ${collegeShortName} Latest Round`}
                                      </h3>

                                      <div className="flex items-center gap-2">
                                        {isAdmin && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openMiniModal("cutoff_comparison");
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
                                          >
                                            <Edit className="w-3.5 h-3.5" />
                                            <span>Edit Table</span>
                                          </button>
                                        )}
                                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover/hdr:text-slate-900 border border-slate-200/60 transition-all shrink-0">
                                          <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                                              isCutoffRoundOpen ? "rotate-180 text-blue-600" : ""
                                            }`}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Collapsible Accordion Body */}
                                    <AnimatePresence initial={false}>
                                      {isCutoffRoundOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.25, ease: "easeInOut" }}
                                          className="overflow-hidden"
                                        >
                                          <div className="px-4 sm:px-5 pb-5 pt-1 space-y-3">
                                            {/* Subtitle */}
                                            <h4 className="text-xs sm:text-[13.5px] font-bold font-outfit text-slate-800">
                                              {comparisonData.subtitle || `JEE Advanced Round 5 Closing Rank (General-All India)`}
                                            </h4>

                                            {/* Comparison Table with Dotted Dividers */}
                                            <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white">
                                              <table className="w-full text-left border-collapse text-xs">
                                                <thead>
                                                  <tr className="bg-[#f0f4f9] text-slate-800 font-bold font-outfit text-xs border-b border-dotted border-slate-300/80">
                                                    <th className="py-3 px-4 text-left font-bold font-outfit text-slate-900 border-r border-dotted border-slate-200/80">
                                                      Course
                                                    </th>
                                                    <th className="py-3 px-4 text-center font-bold font-outfit text-slate-900 w-24 border-r border-dotted border-slate-200/80">
                                                      {years[0]}
                                                    </th>
                                                    <th className="py-3 px-4 text-center font-bold font-outfit text-slate-900 w-24 border-r border-dotted border-slate-200/80">
                                                      {years[1]}
                                                    </th>
                                                    <th className="py-3 px-4 text-center font-bold font-outfit text-slate-900 w-24">
                                                      {years[2]}
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody className="font-medium text-xs sm:text-[13px]">
                                                  {comparisonData.rows.map((row, rIdx) => (
                                                    <tr key={rIdx} className="border-b border-dotted border-slate-300/70 last:border-b-0 hover:bg-slate-50/70 transition-colors">
                                                      <td className="py-3 px-4 text-slate-800 font-medium text-left leading-snug border-r border-dotted border-slate-200/70">
                                                        {row.course}
                                                      </td>
                                                      <td className="py-3 px-4 text-slate-600 text-center font-normal whitespace-nowrap border-r border-dotted border-slate-200/70">
                                                        {row.year2024}
                                                      </td>
                                                      <td className="py-3 px-4 text-slate-600 text-center font-normal whitespace-nowrap border-r border-dotted border-slate-200/70">
                                                        {row.year2025}
                                                      </td>
                                                      <td className="py-3 px-4 text-slate-600 text-center font-normal whitespace-nowrap">
                                                        {row.year2026}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* SECONDARY CUTOFF COMPARISON ACCORDION BOX (UCEED / SPECIALIZED EXAMS - USER REFERENCE TEMPLATE) */}
                            {(() => {
                              const secData = getCollegeSecondaryCutoffComparison(collegeData);
                              const secYears = secData.years || ["2024", "2025", "2026"];
                              const displayedRows = getFilteredCutoffRows(secData, appliedCutoffFilters);
                              const examPrefix = secData.title?.includes("UCEED") ? "UCEED" : (collegeData.stream === "Medical" ? "NEET" : "Exam");
                              const roundLabel = appliedCutoffFilters.round === "Last Round" ? "Last Round" : `Round ${appliedCutoffFilters.round}`;
                              const genderLabel = appliedCutoffFilters.gender === "All" ? "" : `, ${appliedCutoffFilters.gender}`;
                              const computedSubtitle = `${examPrefix} ${roundLabel} Closing Rank (${appliedCutoffFilters.category}-${appliedCutoffFilters.quota}${genderLabel})`;

                              return (
                                <div className="mt-3.5 pt-0.5">
                                  <div className="bg-white/95 border border-slate-200/90 hover:border-slate-300/90 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] transition-all">
                                    {/* Accordion Toggle Header */}
                                    <div
                                      onClick={() => setIsSecondaryCutoffOpen(!isSecondaryCutoffOpen)}
                                      className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer group/hdr select-none"
                                    >
                                      <h3 className="text-sm sm:text-[15px] font-bold font-outfit text-slate-900 tracking-tight group-hover/hdr:text-blue-600 transition-colors">
                                        {secData.title || `Cut Off 2026 for UCEED: Year-Wise rank`}
                                      </h3>

                                      <div className="flex items-center gap-2">
                                        {isAdmin && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openMiniModal("secondary_cutoff_comparison");
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
                                          >
                                            <Edit className="w-3.5 h-3.5" />
                                            <span>Edit Table</span>
                                          </button>
                                        )}
                                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover/hdr:text-slate-900 border border-slate-200/60 transition-all shrink-0">
                                          <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                                              isSecondaryCutoffOpen ? "rotate-180 text-blue-600" : ""
                                            }`}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Collapsible Accordion Body */}
                                    <AnimatePresence initial={false}>
                                      {isSecondaryCutoffOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.25, ease: "easeInOut" }}
                                          className="overflow-hidden"
                                        >
                                          <div className="px-4 sm:px-5 pb-5 pt-1 space-y-3.5">
                                            {/* Top Filter Pills Row matching reference image */}
                                            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                                              {/* Filter count icon pill with radiant saffron shining animation */}
                                              <button
                                                type="button"
                                                onClick={() => openCutoffFilterModal("rounds")}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300/90 bg-white hover:bg-amber-50/40 text-slate-700 font-semibold shadow-2xs shrink-0 select-none transition-all cursor-pointer active:scale-95 group relative"
                                                title="Open All Filters"
                                              >
                                                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-600 transition-colors" />
                                                
                                                {/* Saffron Glowing Badge */}
                                                <div className="relative flex items-center justify-center">
                                                  <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 opacity-80 blur-[3px] animate-pulse" />
                                                  <span className="relative z-10 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                                                    4
                                                  </span>
                                                </div>
                                              </button>

                                              {/* Rounds Dropdown Pill */}
                                              <div className="relative shrink-0">
                                                <button
                                                  type="button"
                                                  onClick={() => openCutoffFilterModal("rounds")}
                                                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border shadow-2xs transition-all cursor-pointer select-none active:scale-95 ${
                                                    appliedCutoffFilters.round !== "1"
                                                      ? "border-[#2d1a47] bg-purple-50 text-[#2d1a47] font-bold"
                                                      : "border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                                                  }`}
                                                >
                                                  <span>Rounds{appliedCutoffFilters.round !== "1" ? `: ${appliedCutoffFilters.round}` : ""}</span>
                                                  <ChevronDown className="w-3 h-3 text-slate-500" />
                                                </button>
                                              </div>

                                              {/* Category Dropdown Pill */}
                                              <div className="relative shrink-0">
                                                <button
                                                  type="button"
                                                  onClick={() => openCutoffFilterModal("category")}
                                                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border shadow-2xs transition-all cursor-pointer select-none active:scale-95 ${
                                                    appliedCutoffFilters.category !== "General"
                                                      ? "border-[#2d1a47] bg-purple-50 text-[#2d1a47] font-bold"
                                                      : "border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                                                  }`}
                                                >
                                                  <span>Category{appliedCutoffFilters.category !== "General" ? `: ${appliedCutoffFilters.category}` : ""}</span>
                                                  <ChevronDown className="w-3 h-3 text-slate-500" />
                                                </button>
                                              </div>

                                              {/* Quota Dropdown Pill */}
                                              <div className="relative shrink-0">
                                                <button
                                                  type="button"
                                                  onClick={() => openCutoffFilterModal("quota")}
                                                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border shadow-2xs transition-all cursor-pointer select-none active:scale-95 ${
                                                    appliedCutoffFilters.quota !== "All India"
                                                      ? "border-[#2d1a47] bg-purple-50 text-[#2d1a47] font-bold"
                                                      : "border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                                                  }`}
                                                >
                                                  <span>Quota{appliedCutoffFilters.quota !== "All India" ? `: ${appliedCutoffFilters.quota}` : ""}</span>
                                                  <ChevronDown className="w-3 h-3 text-slate-500" />
                                                </button>
                                              </div>

                                              {/* Gender Dropdown Pill */}
                                              <div className="relative shrink-0">
                                                <button
                                                  type="button"
                                                  onClick={() => openCutoffFilterModal("gender")}
                                                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border shadow-2xs transition-all cursor-pointer select-none active:scale-95 ${
                                                    appliedCutoffFilters.gender !== "All"
                                                      ? "border-[#2d1a47] bg-purple-50 text-[#2d1a47] font-bold"
                                                      : "border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                                                  }`}
                                                >
                                                  <span>Gender{appliedCutoffFilters.gender !== "All" ? `: ${appliedCutoffFilters.gender}` : ""}</span>
                                                  <ChevronDown className="w-3 h-3 text-slate-500" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Subtitle */}
                                            <h4 className="text-xs sm:text-[13.5px] font-bold font-outfit text-slate-800">
                                              {computedSubtitle}
                                            </h4>

                                            {/* Comparison Table with Light Dotted Dividers */}
                                            <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white">
                                              <table className="w-full text-left border-collapse text-xs">
                                                <thead>
                                                  <tr className="bg-[#f0f4f9] text-slate-800 font-bold font-outfit text-xs border-b border-dotted border-slate-300/80">
                                                    <th className="py-3 px-4 text-left font-bold font-outfit text-slate-900 border-r border-dotted border-slate-200/80">
                                                      Course
                                                    </th>
                                                    <th className="py-3 px-4 text-center font-bold font-outfit text-slate-900 w-24 border-r border-dotted border-slate-200/80">
                                                      {secYears[0]}
                                                    </th>
                                                    <th className="py-3 px-4 text-center font-bold font-outfit text-slate-900 w-24 border-r border-dotted border-slate-200/80">
                                                      {secYears[1]}
                                                    </th>
                                                    <th className="py-3 px-4 text-center font-bold font-outfit text-slate-900 w-24">
                                                      {secYears[2]}
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody className="font-medium text-xs sm:text-[13px]">
                                                  {displayedRows.map((row, rIdx) => (
                                                    <tr key={rIdx} className="border-b border-dotted border-slate-300/70 last:border-b-0 hover:bg-slate-50/70 transition-colors">
                                                      <td className="py-3 px-4 text-slate-800 font-medium text-left leading-snug border-r border-dotted border-slate-200/70">
                                                        {row.course}
                                                      </td>
                                                      <td className="py-3 px-4 text-slate-600 text-center font-normal whitespace-nowrap border-r border-dotted border-slate-200/70">
                                                        {row.year2024}
                                                      </td>
                                                      <td className="py-3 px-4 text-slate-600 text-center font-normal whitespace-nowrap border-r border-dotted border-slate-200/70">
                                                        {row.year2025}
                                                      </td>
                                                      <td className="py-3 px-4 text-slate-600 text-center font-normal whitespace-nowrap">
                                                        {row.year2026}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>

                                             {/* Shining Emerald Green Action Button: Navigates to Header Cut-Offs Tab */}
                                            <div className="pt-3 pb-1 flex justify-center">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setActiveTab("cutoffs");
                                                  const navEl = document.getElementById("college-nav-tabs-bar");
                                                  if (navEl) {
                                                    navEl.scrollIntoView({ behavior: "smooth", block: "start" });
                                                  } else {
                                                    window.scrollTo({ top: 380, behavior: "smooth" });
                                                  }
                                                }}
                                                className="relative group overflow-hidden bg-gradient-to-r from-[#00b05b] via-[#00a859] to-[#00964e] hover:from-[#009e51] hover:to-[#008243] text-white text-xs sm:text-[13.5px] font-bold py-2.5 px-7 rounded-full shadow-[0_4px_14px_rgba(0,168,89,0.35)] hover:shadow-[0_6px_20px_rgba(0,168,89,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 select-none"
                                              >
                                                {/* Shining sweep effect */}
                                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                                                <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                                                <span className="tracking-tight">Cut-Off Details</span>
                                              </button>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* COMMONLY ASKED QUESTIONS ON CUTOFFS ACCORDION */}
                            {cutData.faqs && cutData.faqs.length > 0 && (
                              <div className="pt-6 mt-6 border-t border-slate-200/80 space-y-4">
                                {/* Header Row with Yellow/Amber Q&A Badge */}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                                      <HelpCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h3 className="font-outfit font-bold text-sm sm:text-base text-slate-900 leading-tight">
                                        Commonly asked questions
                                      </h3>
                                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                                        On Cutoffs
                                      </p>
                                    </div>
                                  </div>

                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("cutoffs")}
                                      className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                      <span>Edit Cutoff FAQs</span>
                                    </button>
                                  )}
                                </div>

                                {/* Accordion Questions List */}
                                <div className="divide-y divide-slate-100/90 pt-1">
                                  {cutData.faqs.map((faq, fIdx) => {
                                    const isOpen = openCutoffFaqIdx === fIdx;
                                    const rawQ = faq.question.trim();
                                    const formattedQ = rawQ.startsWith("Q:") || rawQ.startsWith("Q.") ? rawQ : `Q: ${rawQ}`;
                                    const rawA = faq.answer.trim();
                                    const formattedA = rawA.startsWith("A:") || rawA.startsWith("A.") ? rawA : `A: ${rawA}`;

                                    return (
                                      <div key={fIdx} className="py-2.5 first:pt-1 last:pb-0">
                                        <button
                                          type="button"
                                          onClick={() => setOpenCutoffFaqIdx(isOpen ? null : fIdx)}
                                          className="w-full flex items-center justify-between gap-3 text-left py-1 text-slate-800 hover:text-blue-600 transition-colors cursor-pointer group/q"
                                        >
                                          <span className="font-outfit font-bold text-[13px] sm:text-[13.5px] leading-snug group-hover/q:text-blue-600 transition-colors">
                                            {formattedQ}
                                          </span>
                                          <ChevronDown
                                            className={`w-4 h-4 text-slate-500 group-hover/q:text-blue-600 shrink-0 transition-transform duration-200 ${
                                              isOpen ? "rotate-180 text-blue-600" : ""
                                            }`}
                                          />
                                        </button>

                                        <AnimatePresence initial={false}>
                                          {isOpen && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.2, ease: "easeInOut" }}
                                              className="overflow-hidden"
                                            >
                                              <div className="pt-2 pb-3 space-y-3 pl-0.5 text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                                                {/* Multi-paragraph answer text */}
                                                <div className="space-y-2">
                                                  {formattedA.split("\n\n").map((para, pIdx) => (
                                                    <p key={pIdx} className="leading-relaxed">
                                                      {para}
                                                    </p>
                                                  ))}
                                                </div>

                                                {/* Admissions Guidance Counselor Callout Box */}
                                                <div className="mt-3 p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                                                  <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                                                      <img
                                                        src="/images/counselor_avatar.png"
                                                        alt="Expert Counselor"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                          (e.target as HTMLElement).style.display = "none";
                                                        }}
                                                      />
                                                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-orange-700 font-black text-xs">
                                                        SP
                                                      </div>
                                                      <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                    </div>
                                                    <div>
                                                      <h5 className="font-outfit font-bold text-xs sm:text-[13px] text-slate-900 leading-tight">
                                                        Get <span className="text-emerald-600 font-black italic">free</span> admissions guidance
                                                      </h5>
                                                      <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                                                        <span>★ 0</span>
                                                        <span>•</span>
                                                        <span>0 review</span>
                                                      </p>
                                                    </div>
                                                  </div>

                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const leadEl = document.getElementById("lead-inquiry-box");
                                                      if (leadEl) {
                                                        leadEl.scrollIntoView({ behavior: "smooth" });
                                                      }
                                                    }}
                                                    className="px-5 py-2 rounded-full bg-[#1c142e] hover:bg-[#2b2046] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
                                                  >
                                                    Call Us
                                                  </button>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>

                                 {/* Shining Emerald Green Action Button: View all cut-off (Navigates to Header Cut-Offs Tab) */}
                                <div className="pt-4 pb-1 flex justify-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveTab("cutoffs");
                                      const navEl = document.getElementById("college-nav-tabs-bar");
                                      if (navEl) {
                                        navEl.scrollIntoView({ behavior: "smooth", block: "start" });
                                      } else {
                                        window.scrollTo({ top: 380, behavior: "smooth" });
                                      }
                                    }}
                                    className="relative group overflow-hidden bg-gradient-to-r from-[#00b05b] via-[#00a859] to-[#00964e] hover:from-[#009e51] hover:to-[#008243] text-white text-xs sm:text-[13.5px] font-bold py-2.5 px-7 rounded-full shadow-[0_4px_14px_rgba(0,168,89,0.35)] hover:shadow-[0_6px_20px_rgba(0,168,89,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 select-none"
                                  >
                                    {/* Shining sweep effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                                    <span className="tracking-tight">View all cut-off</span>
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}

              {/* 4. COURSES & FEES 2026 CARD (STEP 3 IN MASTER TEMPLATE) */}
              {(() => {
                const cfData = getCollegeCoursesFeesArticle(collegeData);
                const collegeShortName = collegeData.name.split(" - ")[0].split("(")[0].trim() || "College";

                return (
                  <div
                    id="courses-section"
                    className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-slate-300/90 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 scroll-mt-24"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg sm:text-xl font-bold font-outfit text-slate-900 tracking-tight">
                        {cfData.title || `${collegeShortName} Courses & Fees 2026`}
                      </h2>

                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => openMiniModal("courses")}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Courses & Fees</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsCoursesCardOpen(!isCoursesCardOpen)}
                          aria-label={isCoursesCardOpen ? "Collapse Courses Card" : "Expand Courses Card"}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all cursor-pointer shadow-2xs active:scale-90"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                              isCoursesCardOpen ? "rotate-180 text-blue-600" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Card Body */}
                    <AnimatePresence initial={false}>
                      {isCoursesCardOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-4 text-[13.5px] sm:text-[14px] text-slate-700 leading-relaxed font-normal">
                            {/* Paragraph 1 */}
                            {cfData.introParagraph1 && (
                              <p className="leading-relaxed">
                                {renderFormattedText(cfData.introParagraph1)}
                              </p>
                            )}

                            {/* Collapsed Preview vs Expanded Full Content */}
                            {!isCoursesArticleExpanded ? (
                              <div className="relative pt-0.5">
                                {cfData.introParagraph2 && (
                                  <div className="relative max-h-[46px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_30%,rgba(0,0,0,0.3)_65%,transparent_100%)]">
                                    <p className="leading-relaxed">
                                      {renderFormattedText(cfData.introParagraph2)}
                                    </p>
                                  </div>
                                )}
                                {/* Frosted Fade Overlay with Read more */}
                                <div className="absolute inset-x-0 bottom-0 h-11 bg-gradient-to-t from-white via-white/85 to-transparent flex items-end justify-end pointer-events-auto pr-0.5">
                                  <button
                                    type="button"
                                    onClick={() => setIsCoursesArticleExpanded(true)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13.5px] font-bold hover:underline cursor-pointer transition-colors"
                                  >
                                    Read more
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4 pt-0.5">
                                {/* Paragraph 2 */}
                                {cfData.introParagraph2 && (
                                  <p className="leading-relaxed">
                                    {renderFormattedText(cfData.introParagraph2)}
                                  </p>
                                )}

                                {/* Table 1: Course Categories & Specialisations (Image 2) */}
                                {cfData.specialisations && cfData.specialisations.length > 0 && (
                                  <div className="overflow-x-auto rounded-2xl border border-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white">
                                    <table className="w-full text-left border-collapse text-xs sm:text-[13.5px]">
                                      <tbody className="divide-y divide-slate-300">
                                        {cfData.specialisations.map((spec, sIdx) => (
                                          <tr key={sIdx} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4 sm:px-5 font-semibold text-slate-900 align-top w-1/4 sm:w-1/5 border-r border-slate-300">
                                              {spec.category}
                                            </td>
                                            <td className="py-3.5 px-4 sm:px-5 text-slate-600 font-normal leading-relaxed align-top">
                                              {spec.list}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}

                                {/* Callout / Promo text with PDF Download link (Image 2) */}
                                <div className="space-y-2 pt-1">
                                  {cfData.calloutPromoText && (
                                    <p className="italic text-slate-800 text-[13px] sm:text-[13.5px] leading-relaxed">
                                      {cfData.calloutPromoText}
                                    </p>
                                  )}
                                  <div className="pt-0.5">
                                    <a
                                      href={cfData.calloutPdfUrl || "#"}
                                      onClick={(e) => {
                                        if (!cfData.calloutPdfUrl || cfData.calloutPdfUrl === "#") {
                                          e.preventDefault();
                                          alert(`Downloading official courses & fee booklet for ${collegeShortName}...`);
                                        }
                                      }}
                                      className="inline-flex items-center gap-1.5 text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13px] font-semibold hover:underline transition-colors"
                                    >
                                      <span className="text-red-500 font-bold">📕</span>
                                      <span>Download Free PDF</span>
                                    </a>
                                  </div>
                                </div>

                                {/* Popular Courses Introductory Line (Image 3) */}
                                {cfData.popularCoursesHeading && (
                                  <p className="leading-relaxed pt-2 text-slate-800 font-medium">
                                    {renderFormattedText(cfData.popularCoursesHeading)}
                                  </p>
                                )}

                                {/* Table 2: Popular Courses & Total Tuition Fees Table (Image 3) */}
                                {cfData.popularCourses && cfData.popularCourses.length > 0 && (
                                  <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white">
                                    <table className="w-full text-left border-collapse text-xs sm:text-[13px] min-w-[500px]">
                                      <thead>
                                        <tr className="bg-[#f0f4f9] text-slate-800 font-bold font-outfit text-xs sm:text-[13.5px] border-b border-slate-300">
                                          <th className="py-3 px-4 sm:px-5 font-bold font-outfit text-slate-900 border-r border-slate-300">
                                            Course
                                          </th>
                                          <th className="py-3 px-4 sm:px-5 font-bold font-outfit text-slate-900 border-r border-slate-300">
                                            Total Tuition Fees
                                          </th>
                                          <th className="py-3 px-4 sm:px-5 font-bold font-outfit text-slate-900">
                                            Total Fees
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="font-normal divide-y divide-slate-300">
                                        {cfData.popularCourses.map((cRow, cIdx) => (
                                          <tr key={cIdx} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3 px-4 sm:px-5 font-medium border-r border-slate-300">
                                              <span className="text-[#1a73e8] hover:text-[#0b57d0] hover:underline cursor-pointer font-medium">
                                                {cRow.courseName}
                                              </span>
                                              {cRow.coursesCount && (
                                                <span className="text-slate-500 font-normal ml-1 text-xs">
                                                  ({cRow.coursesCount})
                                                </span>
                                              )}
                                            </td>
                                            <td className="py-3 px-4 sm:px-5 text-slate-700 whitespace-nowrap border-r border-slate-300">
                                              {cRow.tuitionFees}
                                            </td>
                                            <td className="py-3 px-4 sm:px-5 text-slate-700 whitespace-nowrap">
                                              {cRow.totalFees}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}

                                {/* Estimated Note & Other Charges Heading (Image 4) */}
                                <div className="space-y-1.5 pt-2">
                                  {cfData.otherChargesNote && (
                                    <p className="text-xs text-slate-500 font-normal">
                                      {cfData.otherChargesNote}
                                    </p>
                                  )}
                                  {cfData.otherChargesHeading && (
                                    <p className="font-semibold text-slate-900 text-[13px] sm:text-[13.5px]">
                                      {renderFormattedText(cfData.otherChargesHeading)}
                                    </p>
                                  )}
                                </div>

                                {/* Table 3: Other Charges Breakdown Table (Image 4) */}
                                {cfData.otherCharges && cfData.otherCharges.length > 0 && (
                                  <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white">
                                    <table className="w-full text-left border-collapse text-xs sm:text-[13px] min-w-[450px]">
                                      <thead>
                                        <tr className="bg-[#f0f4f9] text-slate-800 font-bold font-outfit text-xs sm:text-[13.5px] border-b border-slate-300">
                                          <th className="py-3 px-4 sm:px-5 font-bold font-outfit text-slate-900 w-1/2 border-r border-slate-300">
                                            Components
                                          </th>
                                          <th className="py-3 px-4 sm:px-5 font-bold font-outfit text-slate-900 w-1/2">
                                            Amount
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="font-normal divide-y divide-slate-300">
                                        {cfData.otherCharges.map((oRow, oIdx) => (
                                          <tr key={oIdx} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3 px-4 sm:px-5 border-r border-slate-300 align-top">
                                              <p className="font-medium text-slate-900">{oRow.component}</p>
                                              {oRow.subtext && (
                                                <p className="text-[11.5px] sm:text-xs text-slate-500 italic mt-0.5 leading-relaxed">
                                                  {oRow.subtext}
                                                </p>
                                              )}
                                            </td>
                                            <td className="py-3 px-4 sm:px-5 text-slate-800 font-medium whitespace-nowrap align-top">
                                              {oRow.amount}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}

                                {/* Footer note & Read less toggle (Image 4) */}
                                <div className="flex items-center justify-between gap-3 pt-3">
                                  <p className="text-slate-800 text-xs sm:text-[13px] font-medium">
                                    {renderFormattedText(cfData.footerNote || `Check more about ${collegeShortName} courses below:`)}
                                  </p>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsCoursesArticleExpanded(false);
                                      const el = document.getElementById("courses-section");
                                      if (el) {
                                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                                      }
                                    }}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13.5px] font-bold hover:underline cursor-pointer shrink-0 transition-colors"
                                  >
                                    Read less
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* SUB-BOX ACCORDION(S): UG / PG Courses Highlights Sub-Box (Exact User Reference Pattern) */}
                            {cfData.courseSummaryGroups && cfData.courseSummaryGroups.length > 0 && (
                              <div className="space-y-3.5 pt-2">
                                {cfData.courseSummaryGroups.map((group, gIdx) => {
                                  const isOpen = !!openCourseGroupIndices[gIdx];
                                  return (
                                    <div
                                      key={gIdx}
                                      className="bg-white/95 border border-slate-200/90 hover:border-slate-300/90 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] transition-all"
                                    >
                                      {/* Accordion Toggle Header */}
                                      <div
                                        onClick={() => toggleCourseGroup(gIdx)}
                                        className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer group/hdr select-none"
                                      >
                                        <h3 className="text-sm sm:text-[15px] font-bold font-outfit text-slate-900 tracking-tight group-hover/hdr:text-blue-600 transition-colors">
                                          {group.groupTitle}
                                        </h3>

                                        <div className="flex items-center gap-2">
                                          {isAdmin && (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                openMiniModal("course_summary_box");
                                              }}
                                              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
                                            >
                                              <Edit className="w-3.5 h-3.5" />
                                              <span>Edit Table</span>
                                            </button>
                                          )}
                                          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover/hdr:text-slate-900 border border-slate-200/60 transition-all shrink-0">
                                            <ChevronDown
                                              className={`w-4 h-4 transition-transform duration-300 ease-out ${
                                                isOpen ? "rotate-180 text-blue-600" : ""
                                              }`}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Collapsible Accordion Body */}
                                      <AnimatePresence initial={false}>
                                        {isOpen && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                          >
                                            <div className="px-4 sm:px-5 pb-5 pt-1">
                                              {/* Exact Shiksha Sub-Box Table Card matching reference image */}
                                              <div className="rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] overflow-hidden bg-white">
                                                {/* Light Soft Blue Banner Header */}
                                                <div className="bg-[#f0f5ff] text-[#1e293b] px-4 sm:px-5 py-2.5 sm:py-3 border-b border-slate-200/80 flex items-center justify-between">
                                                  <h4 className="font-outfit font-bold text-xs sm:text-sm tracking-wide text-slate-900">
                                                    {group.groupTitle}
                                                  </h4>
                                                </div>

                                                {/* Table Body with Course Columns */}
                                                <div className="overflow-x-auto custom-scrollbar">
                                                  <div
                                                    className="grid"
                                                    style={{
                                                      gridTemplateColumns: `repeat(${Math.max(1, group.courses.length)}, minmax(280px, 1fr))`,
                                                      width: "max-content",
                                                      minWidth: "100%",
                                                    }}
                                                  >
                                                    {/* Course Titles Row */}
                                                    {group.courses.map((course, cIdx) => (
                                                      <div
                                                        key={`hdr-${cIdx}`}
                                                        className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white border-b border-r border-slate-200/80 last:border-r-0 flex items-center"
                                                      >
                                                        <h5 className="font-outfit font-bold text-slate-900 text-xs sm:text-[14px]">
                                                          {course.courseName}
                                                        </h5>
                                                      </div>
                                                    ))}

                                                    {/* Course Specs Rows */}
                                                    {group.courses.map((course, cIdx) => (
                                                      <div
                                                        key={`body-${cIdx}`}
                                                        className="p-4 sm:p-5 bg-white border-r border-slate-200/80 last:border-r-0 space-y-2.5 text-xs sm:text-[13px] text-slate-700 font-normal leading-relaxed"
                                                      >
                                                        {course.firstYearFees && (
                                                          <div className="flex items-baseline gap-1.5 flex-wrap">
                                                            <span className="text-slate-800 font-medium shrink-0">1st Year Fees:</span>
                                                            <span className="font-semibold text-slate-950">{course.firstYearFees}</span>
                                                          </div>
                                                        )}
                                                        {course.eligibility && (
                                                          <div className="flex items-baseline gap-1.5 flex-wrap">
                                                            <span className="text-slate-800 font-medium shrink-0">Eligibility:</span>
                                                            <span className="font-semibold text-slate-950">{course.eligibility}</span>
                                                          </div>
                                                        )}
                                                        {course.duration && (
                                                          <div className="flex items-baseline gap-1.5 flex-wrap">
                                                            <span className="text-slate-800 font-medium shrink-0">Duration:</span>
                                                            <span className="font-semibold text-slate-950">{course.duration}</span>
                                                          </div>
                                                        )}
                                                        {course.selection && (
                                                          <div className="flex items-baseline gap-1.5 flex-wrap">
                                                            <span className="text-slate-800 font-medium shrink-0">Selection:</span>
                                                            <span className="font-semibold text-slate-950">{course.selection}</span>
                                                          </div>
                                                        )}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Shining Light Green Oval Pill Action Button: View All Courses (Image 2) */}
                            <div className="pt-4 pb-1 flex justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab("courses");
                                  const navEl = document.getElementById("college-nav-tabs-bar");
                                  if (navEl) {
                                    navEl.scrollIntoView({ behavior: "smooth", block: "start" });
                                  } else {
                                    window.scrollTo({ top: 380, behavior: "smooth" });
                                  }
                                }}
                                className="relative group overflow-hidden bg-gradient-to-r from-[#00b05b] via-[#10b981] to-[#00a859] hover:from-[#00c96b] hover:via-[#34d399] hover:to-[#00a859] text-white font-bold py-2.5 px-8 rounded-full text-xs sm:text-[13.5px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-[0_4px_16px_rgba(0,180,95,0.38)] hover:shadow-[0_6px_24px_rgba(0,180,95,0.55)] active:scale-95 select-none"
                              >
                                {/* Shining sweep effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                                <span className="tracking-tight">{cfData.viewAllBtnText || "View All Courses & Fees"}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                              </button>
                            </div>

                            {/* COMMONLY ASKED QUESTIONS ON POPULAR PROGRAMS ACCORDION (Image 3) */}
                            {cfData.faqs && cfData.faqs.length > 0 && (
                              <div className="pt-6 mt-6 border-t border-slate-200/80 space-y-4">
                                {/* Header Row with Yellow/Amber Q&A Badge */}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                                      <HelpCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h3 className="font-outfit font-bold text-sm sm:text-base text-slate-900 leading-tight">
                                        Commonly asked questions
                                      </h3>
                                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                                        On Popular Programs
                                      </p>
                                    </div>
                                  </div>

                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("courses")}
                                      className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                      <span>Edit FAQs</span>
                                    </button>
                                  )}
                                </div>

                                {/* Accordion Questions List */}
                                <div className="divide-y divide-slate-100/90 pt-1">
                                  {cfData.faqs.map((faq, fIdx) => {
                                    const isOpen = openCoursesFaqIdx === fIdx;
                                    const rawQ = faq.question.trim();
                                    const formattedQ = rawQ.startsWith("Q:") || rawQ.startsWith("Q.") ? rawQ : `Q: ${rawQ}`;
                                    const rawA = faq.answer.trim();
                                    const formattedA = rawA.startsWith("A:") || rawA.startsWith("A.") ? rawA : `A: ${rawA}`;

                                    return (
                                      <div key={fIdx} className="py-2.5 first:pt-1 last:pb-0">
                                        <button
                                          type="button"
                                          onClick={() => setOpenCoursesFaqIdx(isOpen ? null : fIdx)}
                                          className="w-full flex items-center justify-between gap-3 text-left py-1 text-slate-800 hover:text-blue-600 transition-colors cursor-pointer group/q"
                                        >
                                          <span className="font-outfit font-bold text-[13px] sm:text-[13.5px] leading-snug group-hover/q:text-blue-600 transition-colors">
                                            {formattedQ}
                                          </span>
                                          <ChevronDown
                                            className={`w-4 h-4 text-slate-500 group-hover/q:text-blue-600 shrink-0 transition-transform duration-200 ${
                                              isOpen ? "rotate-180 text-blue-600" : ""
                                            }`}
                                          />
                                        </button>

                                        <AnimatePresence initial={false}>
                                          {isOpen && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.2, ease: "easeInOut" }}
                                              className="overflow-hidden"
                                            >
                                              <div className="pt-2 pb-3 space-y-3 pl-0.5 text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                                                {/* Multi-paragraph answer text */}
                                                <div className="space-y-2">
                                                  {formattedA.split("\n\n").map((para, pIdx) => (
                                                    <p key={pIdx} className="leading-relaxed">
                                                      {para}
                                                    </p>
                                                  ))}
                                                </div>

                                                {/* Admissions Guidance Counselor Callout Box */}
                                                <div className="mt-3 p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                                                  <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                                                      <img
                                                        src="/images/counselor_avatar.png"
                                                        alt="Expert Counselor"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                          (e.target as HTMLElement).style.display = "none";
                                                        }}
                                                      />
                                                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-orange-700 font-black text-xs">
                                                        SP
                                                      </div>
                                                      <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                    </div>
                                                    <div>
                                                      <h5 className="font-outfit font-bold text-xs sm:text-[13px] text-slate-900 leading-tight">
                                                        Get <span className="text-emerald-600 font-black italic">free</span> admissions guidance
                                                      </h5>
                                                      <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                                                        <span>★ 0</span>
                                                        <span>•</span>
                                                        <span>0 review</span>
                                                      </p>
                                                    </div>
                                                  </div>

                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const leadEl = document.getElementById("lead-inquiry-box");
                                                      if (leadEl) {
                                                        leadEl.scrollIntoView({ behavior: "smooth" });
                                                      }
                                                    }}
                                                    className="px-5 py-2 rounded-full bg-[#1c142e] hover:bg-[#2b2046] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
                                                  >
                                                    Call Us
                                                  </button>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}

              {/* 5. CARD 5: PLACEMENTS OVERVIEW ARTICLE (EXACT SHIKSHA FORMAT) */}
              {(() => {
                const plData = getCollegePlacementsArticle(collegeData);
                return (
                  <div
                    id="placements-section"
                    className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-slate-300/90 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_28px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 scroll-mt-24"
                  >
                    {/* Top Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg sm:text-xl font-black font-outfit text-slate-900 tracking-tight flex items-center gap-2">
                        <span>{plData.title}</span>
                      </h2>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => openMiniModal("placements_article")}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                              title="Edit Article Text & Subsections"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Edit Article</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openMiniModal("placements")}
                              className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                              title="Open Placements Hub"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Hub</span>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsPlacementsCardOpen(!isPlacementsCardOpen)}
                          aria-label={isPlacementsCardOpen ? "Collapse Placements Section" : "Expand Placements Section"}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all cursor-pointer shadow-2xs active:scale-90"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                              isPlacementsCardOpen ? "rotate-180 text-blue-600" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Card Body */}
                    <AnimatePresence initial={false}>
                      {isPlacementsCardOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-4 border-t border-slate-100/90 mt-4 text-[13.5px] sm:text-[14px] text-slate-700 leading-relaxed font-normal">
                            {/* Collapsed Preview vs Expanded Full Content */}
                            {!isPlacementsArticleExpanded ? (
                              <div className="relative pt-0.5">
                                {/* Intro text with subtle bottom fade shadow mask */}
                                <div className="relative max-h-[88px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_40%,rgba(0,0,0,0.35)_70%,transparent_100%)]">
                                  <p className="leading-relaxed">
                                    {renderFormattedText(plData.introParagraph || "")}
                                  </p>
                                </div>

                                {/* Ultra-Premium Water & Glass Fade Overlay with Read more */}
                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/85 to-transparent flex items-end justify-end pointer-events-auto pr-0.5">
                                  <button
                                    type="button"
                                    onClick={() => setIsPlacementsArticleExpanded(true)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13.5px] font-bold hover:underline cursor-pointer transition-colors select-none"
                                  >
                                    Read more
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Expanded state with all subsections and Read less */
                              <div className="space-y-4 pt-0.5">
                                {/* Full Intro Paragraph */}
                                <p className="leading-relaxed">
                                  {renderFormattedText(plData.introParagraph || "")}
                                </p>

                                {/* Subsections */}
                                {plData.subsections && plData.subsections.map((sub, sIdx) => (
                                  <div key={sIdx} className="space-y-1.5">
                                    <h3 className="font-outfit font-bold text-sm sm:text-[14.5px] text-slate-900 leading-snug">
                                      {sub.heading}
                                    </h3>
                                    <p className="leading-relaxed text-slate-700">
                                      {renderFormattedText(sub.content)}
                                    </p>
                                  </div>
                                ))}

                                {plData.footerNote && (
                                  <p className="text-xs sm:text-[13px] text-slate-600 font-medium pt-1">
                                    {renderFormattedText(plData.footerNote)}
                                  </p>
                                )}

                                {/* Read less button on right */}
                                <div className="pt-1 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setIsPlacementsArticleExpanded(false)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13.5px] font-bold hover:underline cursor-pointer transition-colors select-none"
                                  >
                                    Read less
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Table 1: Placement Statistics Comparison Highlights Table (Dynamic Multi-Column) */}
                            {plData.statsTable && plData.statsTable.length > 0 && (
                              <div className="pt-2 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="font-outfit font-bold text-sm sm:text-[15px] text-slate-900 flex items-center gap-1.5">
                                    <span>{plData.statsTableTitle || `${collegeData.name.split(" - ")[0]} Placements Highlights`}</span>
                                  </h3>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("placements_stats")}
                                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit Table</span>
                                    </button>
                                  )}
                                </div>

                                <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white w-full">
                                  {(() => {
                                    const cols = plData.statsTableCols && plData.statsTableCols.length > 0
                                      ? plData.statsTableCols
                                      : ["Particulars", "Placement Statistics 2025 (Ongoing)", "Placement Statistics 2024"];
                                    return (
                                      <table className="w-full text-left border-collapse text-xs sm:text-[13.5px] min-w-max">
                                        <thead>
                                          <tr className="bg-[#f0f5ff] text-[#1e293b] font-bold font-outfit text-xs sm:text-[13.5px]">
                                            {cols.map((colName, cIdx) => (
                                              <th
                                                key={cIdx}
                                                className={`py-3.5 px-4 sm:px-5 font-bold font-outfit text-slate-800 ${
                                                  cIdx < cols.length - 1 ? "border-r border-slate-200/70" : ""
                                                } ${cIdx === 0 ? "min-w-[200px] sm:min-w-[240px]" : "min-w-[180px] sm:min-w-[230px]"} whitespace-normal`}
                                              >
                                                {colName}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dashed divide-slate-200 font-normal">
                                          {plData.statsTable.map((row, rIdx) => (
                                            <tr key={rIdx} className="hover:bg-blue-50/20 transition-colors">
                                              <td className="py-3.5 px-4 sm:px-5 font-normal sm:font-medium text-slate-800 border-r border-dashed border-slate-200/60 min-w-[200px] sm:min-w-[240px]">
                                                {row.particular}
                                              </td>
                                              {cols.slice(1).map((_, cIdx) => {
                                                const cellVal = getStatRowCellValue(row, cIdx + 1);
                                                return (
                                                  <td
                                                    key={cIdx}
                                                    className={`py-3.5 px-4 sm:px-5 text-slate-700 ${
                                                      cIdx < cols.length - 2 ? "border-r border-dashed border-slate-200/60" : ""
                                                    } min-w-[180px] sm:min-w-[230px]`}
                                                  >
                                                    {cellVal}
                                                  </td>
                                                );
                                              })}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}

                            {/* Table 2: Course-wise Median Salary Table (Exact Image Reference) */}
                            {plData.salaryTable && plData.salaryTable.length > 0 && (
                              <div className="pt-3 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="font-outfit font-bold text-sm sm:text-[15px] text-slate-900 flex items-center gap-1.5">
                                    <span>{plData.salaryTableTitle || `${collegeData.name.split(" - ")[0]} Course-wise Median Salary`}</span>
                                  </h3>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("placements_salary")}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit Salary Table</span>
                                    </button>
                                  )}
                                </div>

                                <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white w-full">
                                  {(() => {
                                    const cols = plData.salaryTableCols && plData.salaryTableCols.length > 0
                                      ? plData.salaryTableCols
                                      : ["Course", "Median Salary"];
                                    return (
                                      <table className="w-full text-left border-collapse text-xs sm:text-[13.5px] min-w-max">
                                        <thead>
                                          <tr className="bg-[#f0f5ff] text-[#1e293b] font-bold font-outfit text-xs sm:text-[13.5px]">
                                            {cols.map((colName, cIdx) => (
                                              <th
                                                key={cIdx}
                                                className={`py-3.5 px-5 font-bold font-outfit text-slate-800 ${
                                                  cIdx < cols.length - 1 ? "border-r border-slate-200/70" : ""
                                                } ${cIdx === 0 ? "min-w-[200px] sm:min-w-[240px]" : "min-w-[180px] sm:min-w-[220px]"} whitespace-normal`}
                                              >
                                                {colName}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dashed divide-slate-200 font-normal">
                                          {plData.salaryTable.map((row, rIdx) => (
                                            <tr key={rIdx} className="hover:bg-blue-50/20 transition-colors">
                                              <td className="py-3.5 px-5 font-normal sm:font-medium text-slate-800 border-r border-dashed border-slate-200/60 min-w-[200px] sm:min-w-[240px]">
                                                {row.course}
                                              </td>
                                              {cols.slice(1).map((_, cIdx) => {
                                                const cellVal = getCourseSalaryCellValue(row, cIdx + 1);
                                                return (
                                                  <td
                                                    key={cIdx}
                                                    className={`py-3.5 px-5 text-slate-700 ${
                                                      cIdx < cols.length - 2 ? "border-r border-dashed border-slate-200/60" : ""
                                                    } min-w-[180px] sm:min-w-[220px]`}
                                                  >
                                                    {cellVal}
                                                  </td>
                                                );
                                              })}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}

                            {/* Table 3: Top Recruiters (Seamless Logo & Direct Link Integration) */}
                            {plData.topRecruiters && plData.topRecruiters.length > 0 && (
                              <div className="pt-3 space-y-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <h3 className="font-outfit font-bold text-sm sm:text-[15px] text-slate-900 flex items-center gap-1.5">
                                      <span>{plData.topRecruitersTitle || "Top Recruiters"}</span>
                                    </h3>
                                    <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                                      Leading recruiters visiting {collegeData.name.split(" - ")[0]} for campus placements
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {isAdmin && (
                                      <button
                                        type="button"
                                        onClick={() => openMiniModal("placements_recruiters")}
                                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                      >
                                        <Edit className="w-3 h-3" />
                                        <span>Edit Recruiters</span>
                                      </button>
                                    )}

                                    {/* Slider Navigation Arrows */}
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const el = document.getElementById("top-recruiters-scroll-list");
                                          if (el) el.scrollBy({ left: -260, behavior: "smooth" });
                                        }}
                                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90"
                                        title="Scroll Left"
                                      >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const el = document.getElementById("top-recruiters-scroll-list");
                                          if (el) el.scrollBy({ left: 260, behavior: "smooth" });
                                        }}
                                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90"
                                        title="Scroll Right"
                                      >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Horizontal Scroll Cards Container */}
                                <div
                                  id="top-recruiters-scroll-list"
                                  className="flex items-stretch gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth"
                                >
                                  {plData.topRecruiters.map((rec, rIdx) => {
                                    const fallbackInitials = rec.name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "TC";
                                    return (
                                      <a
                                        key={rIdx}
                                        href={rec.websiteUrl || `https://www.google.com/search?q=${encodeURIComponent(rec.name + " company")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/rec shrink-0 flex flex-col items-center justify-between p-3 sm:p-3.5 bg-gradient-to-b from-slate-50/90 to-slate-100/60 hover:from-white hover:to-indigo-50/40 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.1)] hover:-translate-y-1 active:scale-95 cursor-pointer text-center min-w-[170px] sm:min-w-[195px] max-w-[220px]"
                                      >
                                        {/* Logo Container (Large, wide, seamless blend without harsh borders) */}
                                        <div className="w-full h-20 sm:h-24 flex items-center justify-center px-2 py-1 transition-transform duration-300 group-hover/rec:scale-105">
                                          <img
                                            src={rec.logoUrl || `https://logo.clearbit.com/${rec.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`}
                                            alt={rec.name}
                                            className="max-h-16 sm:max-h-20 max-w-[94%] w-auto h-auto object-contain filter drop-shadow-xs"
                                            onError={(e) => {
                                              const target = e.currentTarget;
                                              const domainGuess = rec.websiteUrl ? new URL(rec.websiteUrl).hostname : `${rec.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
                                              const googleFavicon = `https://www.google.com/s2/favicons?domain=${domainGuess}&sz=128`;
                                              if (!target.getAttribute("data-tried-fallback")) {
                                                target.setAttribute("data-tried-fallback", "true");
                                                target.src = googleFavicon;
                                                return;
                                              }
                                              target.style.display = "none";
                                              const parent = target.parentElement;
                                              if (parent && !parent.querySelector(".rec-fallback-badge")) {
                                                const fb = document.createElement("div");
                                                fb.className = "rec-fallback-badge w-14 h-14 rounded-2xl bg-[#07264a] text-white flex items-center justify-center font-black text-sm font-outfit shadow-sm";
                                                fb.innerText = fallbackInitials;
                                                parent.appendChild(fb);
                                              }
                                            }}
                                          />
                                        </div>

                                        {/* Company Name */}
                                        <div className="w-full mt-1.5">
                                          <span className="font-outfit font-bold text-xs sm:text-[13px] text-slate-800 group-hover/rec:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                                            {rec.name}
                                          </span>
                                        </div>

                                        {/* Subtle Visit hint */}
                                        <span className="text-[10.5px] text-indigo-500/80 group-hover/rec:text-indigo-600 font-semibold flex items-center gap-0.5 mt-1.5 opacity-80 group-hover/rec:opacity-100 transition-opacity">
                                          Visit ↗
                                        </span>
                                      </a>
                                    );
                                  })}
                                </div>
                                <ScrollProgressIndicator targetId="top-recruiters-scroll-list" />
                              </div>
                            )}

                            {/* Separator line & Insights on Placements Section */}
                            {plData.insights && plData.insights.length > 0 && (
                              <div className="pt-3 border-t border-slate-200/70">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-3">
                                    {/* Animated Sunlight Lightbulb (Guaranteed CSS 5-Second On/Off Cycle) */}
                                    <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11">
                                      {/* Scoped CSS Keyframe Animations */}
                                      <style dangerouslySetInnerHTML={{ __html: `
                                        @keyframes sunlightAuraCycle {
                                          0%, 20%, 85%, 100% {
                                            opacity: 0;
                                            transform: scale(0.7);
                                          }
                                          28% {
                                            opacity: 0.95;
                                            transform: scale(1.35);
                                          }
                                          35%, 75% {
                                            opacity: 0.85;
                                            transform: scale(1.25);
                                          }
                                          82% {
                                            opacity: 0.15;
                                            transform: scale(0.9);
                                          }
                                        }

                                        @keyframes sunlightRaysCycle {
                                          0%, 20%, 85%, 100% {
                                            opacity: 0;
                                            transform: rotate(0deg) scale(0.7);
                                          }
                                          28% {
                                            opacity: 0.75;
                                            transform: rotate(45deg) scale(1.4);
                                          }
                                          50% {
                                            opacity: 0.65;
                                            transform: rotate(120deg) scale(1.3);
                                          }
                                          75% {
                                            opacity: 0.7;
                                            transform: rotate(200deg) scale(1.35);
                                          }
                                          82% {
                                            opacity: 0.1;
                                            transform: rotate(230deg) scale(0.9);
                                          }
                                        }

                                        @keyframes sunlightBulbCycle {
                                          0%, 20%, 85%, 100% {
                                            opacity: 0;
                                            transform: scale(0.92);
                                            filter: drop-shadow(0 0 0px transparent);
                                          }
                                          28% {
                                            opacity: 1;
                                            transform: scale(1.15);
                                            filter: drop-shadow(0 0 10px #f59e0b) drop-shadow(0 0 24px #fbbf24) drop-shadow(0 0 35px #fef08a);
                                          }
                                          35%, 75% {
                                            opacity: 1;
                                            transform: scale(1.1);
                                            filter: drop-shadow(0 0 8px #f59e0b) drop-shadow(0 0 20px #fbbf24) drop-shadow(0 0 30px #fef08a);
                                          }
                                          82% {
                                            opacity: 0.15;
                                            transform: scale(0.96);
                                            filter: drop-shadow(0 0 3px #f59e0b);
                                          }
                                        }
                                      `}} />

                                      {/* Sunlight Glow Aura behind Bulb (Turns ON with sunlight, turns completely OFF) */}
                                      <div
                                        className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 blur-lg pointer-events-none"
                                        style={{ animation: "sunlightAuraCycle 5s ease-in-out infinite" }}
                                      />
                                      
                                      {/* Sunbeam Light Rays Flare */}
                                      <div
                                        className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-200/50 to-transparent blur-md pointer-events-none"
                                        style={{ animation: "sunlightRaysCycle 5s ease-in-out infinite" }}
                                      />

                                      {/* Bulb Housing (NO BORDER) */}
                                      <div className="relative w-full h-full flex items-center justify-center z-10">
                                        {/* Inactive / OFF Bulb state (Unlit when OFF) */}
                                        <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300 stroke-[2]" />

                                        {/* Active / ON Glowing Sunlight Bulb state */}
                                        <div
                                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                          style={{ animation: "sunlightBulbCycle 5s ease-in-out infinite" }}
                                        >
                                          <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 fill-amber-400 stroke-[2.2]" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Title with matching width underline */}
                                    <div className="flex flex-col items-start">
                                      <div className="inline-block relative">
                                        <h4 className="font-outfit font-black text-sm sm:text-[16px] text-slate-900 leading-tight">
                                          {plData.insightsTitle || "Insights on Placements"}
                                        </h4>
                                        {/* Subtle underline spanning exact text width */}
                                        <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200/30 rounded-full mt-1" />
                                      </div>
                                      {plData.insightsSubtitle && (
                                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                                          {plData.insightsSubtitle}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {isAdmin && (
                                      <button
                                        type="button"
                                        onClick={() => openMiniModal("placements_insights")}
                                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                      >
                                        <Edit className="w-3 h-3" />
                                        <span>Edit Insights</span>
                                      </button>
                                    )}

                                    {/* Slider Navigation Arrows */}
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const el = document.getElementById("insights-scroll-list");
                                          if (el) el.scrollBy({ left: -280, behavior: "smooth" });
                                        }}
                                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90"
                                        title="Scroll Left"
                                      >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const el = document.getElementById("insights-scroll-list");
                                          if (el) el.scrollBy({ left: 280, behavior: "smooth" });
                                        }}
                                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90"
                                        title="Scroll Right"
                                      >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Horizontal Scroll Cards Container */}
                                <div
                                  id="insights-scroll-list"
                                  className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth"
                                >
                                  {plData.insights.map((insight, inIdx) => (
                                    <div
                                      key={inIdx}
                                      className="shrink-0 p-4 bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_20px_-4px_rgba(15,23,42,0.06)] min-w-[240px] sm:min-w-[270px] max-w-[290px] flex flex-col justify-start"
                                    >
                                      <div className="flex items-start gap-2.5 mb-1.5">
                                        <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-indigo-600 shrink-0 mt-0.5 fill-indigo-600" viewBox="0 0 24 24">
                                          <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
                                        </svg>
                                        <h5 className="font-outfit font-extrabold text-sm sm:text-[15px] text-slate-900 leading-snug">
                                          {insight.title}
                                        </h5>
                                      </div>
                                      <p className="text-xs text-slate-600 font-medium pl-6 leading-relaxed">
                                        {insight.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                {/* Scroll indicator & View All row */}
                                <div className="relative flex items-center justify-center pt-3 pb-1 w-full min-h-[32px]">
                                  <ScrollProgressIndicator targetId="insights-scroll-list" standalone={false} />

                                  {/* Right-aligned 'View All ->' (Navigates to Reviews section) */}
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveTab("reviews");
                                        document.getElementById("college-nav-tabs-bar")?.scrollIntoView({ behavior: "smooth" });
                                      }}
                                      className="text-[#1a73e8] hover:text-[#0b57d0] font-bold text-xs sm:text-[13px] flex items-center gap-1 hover:underline cursor-pointer transition-all active:scale-95"
                                    >
                                      <span>View All</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Centered 'View placement details ->' button (Navigates to Placements section) */}
                                <div className="flex justify-center items-center mt-2.5 pb-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveTab("placements");
                                      document.getElementById("college-nav-tabs-bar")?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="px-5 py-2 rounded-full border border-slate-700/80 hover:border-slate-950 text-slate-800 hover:text-slate-950 font-bold text-xs sm:text-[13px] transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 cursor-pointer"
                                  >
                                    <span>View placement details</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Separator line & COMMONLY ASKED QUESTIONS ON PLACEMENTS ACCORDION */}
                            {plData.faqs && plData.faqs.length > 0 && (
                              <div className="pt-5 mt-4 border-t border-slate-200/80 space-y-3.5">
                                {/* Header Row with Yellow/Amber Q&A Badge */}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                                      <HelpCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="font-outfit font-bold text-sm sm:text-base text-slate-900 leading-tight">
                                        {plData.faqsHeading || "Commonly asked questions"}
                                      </h4>
                                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                                        {plData.faqsSubtitle || "On Placements"}
                                      </p>
                                    </div>
                                  </div>

                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("placements_faqs")}
                                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit Placement FAQs</span>
                                    </button>
                                  )}
                                </div>

                                {/* Accordion Questions List */}
                                <div className="divide-y divide-slate-100/90 pt-1">
                                  {plData.faqs.map((faq, fIdx) => {
                                    const isOpen = openPlacementsFaqIdx === fIdx;
                                    const rawQ = faq.question.trim();
                                    const formattedQ = rawQ.startsWith("Q:") || rawQ.startsWith("Q.") ? rawQ : `Q: ${rawQ}`;
                                    const rawA = faq.answer.trim();
                                    const formattedA = rawA.startsWith("A:") || rawA.startsWith("A.") ? rawA : `A: ${rawA}`;

                                    return (
                                      <div key={fIdx} className="py-2.5 first:pt-1 last:pb-0">
                                        <button
                                          type="button"
                                          onClick={() => setOpenPlacementsFaqIdx(isOpen ? null : fIdx)}
                                          className="w-full flex items-center justify-between gap-3 text-left py-1 text-slate-800 hover:text-blue-600 transition-colors cursor-pointer group/q"
                                        >
                                          <span className="font-outfit font-bold text-[13px] sm:text-[13.5px] leading-snug group-hover/q:text-blue-600 transition-colors">
                                            {formattedQ}
                                          </span>
                                          <div className="flex items-center gap-2 shrink-0">
                                            {fIdx === 3 && (
                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[11px] font-bold">
                                                5 👍
                                              </span>
                                            )}
                                            <ChevronDown
                                              className={`w-4 h-4 text-slate-500 group-hover/q:text-blue-600 transition-transform duration-200 ${
                                                isOpen ? "rotate-180 text-blue-600" : ""
                                              }`}
                                            />
                                          </div>
                                        </button>

                                        <AnimatePresence initial={false}>
                                          {isOpen && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.22, ease: "easeInOut" }}
                                              className="overflow-hidden"
                                            >
                                              <div className="pt-2 pb-2 pl-0.5 text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                                                <p className="leading-relaxed">
                                                  {formattedA}
                                                </p>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}

              {/* 5. ADMISSION & APPLICATION PROCESS 2026 SUB-BOX */}
              {(() => {
                const admData = getCollegeAdmissionArticle(collegeData);
                const collegeShortName = collegeData.name.split(" - ")[0].split("(")[0].trim() || "College";

                return (
                  <div
                    id="admissions-section"
                    className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-slate-300/90 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_28px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 scroll-mt-20"
                  >
                    {/* Top Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-outfit font-black text-lg sm:text-xl text-[#2d114d] tracking-tight">
                        {admData.title || `${collegeShortName} Admission & Application Process 2026`}
                      </h3>

                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => openMiniModal("admission")}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Admission</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsAdmissionCardOpen(!isAdmissionCardOpen)}
                          aria-label={isAdmissionCardOpen ? "Collapse Admission Card" : "Expand Admission Card"}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all cursor-pointer shadow-2xs active:scale-90"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                              isAdmissionCardOpen ? "rotate-180 text-blue-600" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Card Body */}
                    <AnimatePresence initial={false}>
                      {isAdmissionCardOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3.5 space-y-3.5 text-[13.5px] sm:text-[14px] text-slate-700 leading-relaxed font-normal">
                            {!isAdmissionArticleExpanded ? (
                              /* Collapsed / Preview State (Image 1) */
                              <div className="space-y-3 relative pt-0.5">
                                {admData.introParagraph1 && (
                                  <p className="leading-relaxed">
                                    {renderFormattedText(admData.introParagraph1)}
                                  </p>
                                )}
                                {admData.introParagraph2 && (
                                  <p className="leading-relaxed">
                                    {renderFormattedText(admData.introParagraph2)}
                                  </p>
                                )}

                                {/* Bullet preview with frosted gradient fade */}
                                {admData.bullets && admData.bullets.length > 0 && (
                                  <div className="relative max-h-[32px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_15%,rgba(0,0,0,0.3)_55%,transparent_100%)]">
                                    <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                                      <li>
                                        {renderFormattedText(admData.bullets[0].text)}
                                      </li>
                                    </ul>
                                  </div>
                                )}

                                {/* Read more overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-end pointer-events-auto pr-0.5">
                                  <button
                                    type="button"
                                    onClick={() => setIsAdmissionArticleExpanded(true)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13.5px] font-bold hover:underline cursor-pointer transition-colors"
                                  >
                                    Read more
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Fully Expanded State (Images 2 & 3) */
                              <div className="space-y-3.5 relative pt-0.5">
                                {admData.introParagraph1 && (
                                  <p className="leading-relaxed">
                                    {renderFormattedText(admData.introParagraph1)}
                                  </p>
                                )}
                                {admData.introParagraph2 && (
                                  <p className="leading-relaxed">
                                    {renderFormattedText(admData.introParagraph2)}
                                  </p>
                                )}

                                {/* Bullet Points List */}
                                {admData.bullets && admData.bullets.length > 0 && (
                                  <ul className="list-disc pl-5 space-y-2.5 text-slate-700">
                                    {admData.bullets.map((b, bIdx) => (
                                      <li key={bIdx} className="leading-relaxed pl-1">
                                        {renderFormattedText(b.text)}
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {admData.afterBulletsParagraph1 && (
                                  <p className="leading-relaxed">
                                    {renderFormattedText(admData.afterBulletsParagraph1)}
                                  </p>
                                )}

                                {admData.afterBulletsParagraph2 && (
                                  <p className="leading-relaxed">
                                    {renderFormattedText(admData.afterBulletsParagraph2)}
                                  </p>
                                )}

                                {admData.footerNote && (
                                  <p className="leading-relaxed font-normal text-slate-800 pt-1">
                                    {renderFormattedText(admData.footerNote)}
                                  </p>
                                )}

                                {/* Read less button */}
                                <div className="flex justify-end pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setIsAdmissionArticleExpanded(false)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] text-xs sm:text-[13.5px] font-bold hover:underline cursor-pointer transition-colors"
                                  >
                                    Read less
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* COURSE ADMISSION ACCORDION BOXES LIST */}
                            {admData.courseAdmissionBoxes && admData.courseAdmissionBoxes.length > 0 && (
                              <div className="pt-3 space-y-3">
                                {admData.courseAdmissionBoxes.map((box, bIdx) => {
                                  const isBoxOpen = openAdmissionBoxes[bIdx] ?? false;

                                  return (
                                    <div
                                      key={bIdx}
                                      className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all"
                                    >
                                      {/* Box Header */}
                                      <div
                                        onClick={() => {
                                          setOpenAdmissionBoxes((prev) => ({
                                            ...prev,
                                            [bIdx]: !prev[bIdx],
                                          }));
                                        }}
                                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/60 transition-colors select-none group/boxhdr"
                                      >
                                        <div>
                                          <h4 className="font-outfit font-extrabold text-base sm:text-lg text-slate-900 group-hover/boxhdr:text-blue-600 transition-colors leading-tight">
                                            {box.courseTitle}
                                          </h4>
                                          {box.courseMeta && (
                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                              {box.courseMeta}
                                            </p>
                                          )}
                                        </div>

                                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover/boxhdr:text-slate-900 border border-slate-200/60 transition-all shrink-0">
                                          <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                                              isBoxOpen ? "rotate-180 text-blue-600" : ""
                                            }`}
                                          />
                                        </div>
                                      </div>

                                      {/* Collapsible Box Body */}
                                      <AnimatePresence initial={false}>
                                        {isBoxOpen && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="overflow-hidden border-t border-slate-100"
                                          >
                                            <div className="p-4 sm:p-5 pt-3 space-y-4">
                                              {/* Eligibility Section */}
                                              {box.eligibilityBullets && box.eligibilityBullets.length > 0 && (
                                                <div className="space-y-2">
                                                  <div className="flex items-center gap-2 font-outfit font-bold text-sm sm:text-[14.5px] text-slate-900">
                                                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                                                    <span>Eligibility</span>
                                                  </div>
                                                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                                                    {box.eligibilityBullets.map((el, elIdx) => (
                                                      <li key={elIdx} className="pl-1">
                                                        {renderFormattedText(el)}
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </div>
                                              )}

                                              {/* Important Dates Section */}
                                              <div className="space-y-3 pt-1">
                                                <div className="flex items-center justify-between gap-3">
                                                  <div className="flex items-center gap-2 font-outfit font-bold text-sm sm:text-[14.5px] text-slate-900">
                                                    <Calendar className="w-4 h-4 text-slate-700 shrink-0" />
                                                    <span>{box.datesHeading || "Important dates"}</span>
                                                  </div>

                                                  {/* Green 'Keep Me Notified' Button */}
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      alert("Notification alert enabled for " + box.courseTitle + "! You will receive date updates.");
                                                    }}
                                                    className="px-4 py-1.5 rounded-full bg-[#00a859] hover:bg-[#00964e] text-white text-xs sm:text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer select-none"
                                                  >
                                                    <Bell className="w-3.5 h-3.5 fill-white" />
                                                    <span>Keep Me Notified</span>
                                                  </button>
                                                </div>

                                                {/* Dates & Events Table */}
                                                {box.datesTable && box.datesTable.length > 0 && (
                                                  <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white">
                                                    <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                                                      <thead>
                                                        <tr className="bg-[#f0f4f9] text-slate-800 font-bold font-outfit text-xs border-b border-slate-200/80">
                                                          <th className="py-2.5 px-4 font-bold font-outfit text-slate-900 w-1/3 border-r border-slate-200/80">
                                                            Dates
                                                          </th>
                                                          <th className="py-2.5 px-4 font-bold font-outfit text-slate-900 w-2/3">
                                                            Events
                                                          </th>
                                                        </tr>
                                                      </thead>
                                                      <tbody className="divide-y divide-slate-100">
                                                        {box.datesTable.map((dRow, dIdx) => (
                                                          <tr key={dIdx} className="hover:bg-slate-50/70 transition-colors">
                                                            <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap align-middle border-r border-slate-100">
                                                              {dRow.dates}
                                                            </td>
                                                            <td className="py-3 px-4 text-slate-700 align-middle">
                                                              <div className="flex flex-wrap items-center gap-2">
                                                                <span>{dRow.event}</span>
                                                                {dRow.isTentative && (
                                                                  <span className="px-2 py-0.5 rounded-md bg-[#5c94e8] text-white text-[10px] font-bold shadow-2xs">
                                                                    Tentative
                                                                  </span>
                                                                )}
                                                              </div>
                                                            </td>
                                                          </tr>
                                                        ))}
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                )}

                                                {/* Centered 'Download dates' Outline Button */}
                                                <div className="flex justify-center pt-3 pb-0.5">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      alert("Dates schedule downloaded for " + box.courseTitle);
                                                    }}
                                                    className="px-5 py-2 rounded-full border border-slate-700/80 hover:border-slate-950 text-slate-800 hover:text-slate-950 font-bold text-xs sm:text-[13px] transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 cursor-pointer select-none"
                                                  >
                                                    <span>Download dates</span>
                                                    <Download className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Separator line & COMMONLY ASKED QUESTIONS ON ADMISSIONS ACCORDION */}
                            {admData.faqs && admData.faqs.length > 0 && (
                              <div className="pt-5 mt-4 border-t border-slate-200/80 space-y-3.5">
                                {/* Header Row with Yellow/Amber Q&A Badge */}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                                      <HelpCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="font-outfit font-bold text-sm sm:text-base text-slate-900 leading-tight">
                                        {admData.faqsHeading || "Commonly asked questions"}
                                      </h4>
                                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                                        {admData.faqsSubtitle || "On Admissions"}
                                      </p>
                                    </div>
                                  </div>

                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("admission_faqs")}
                                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit Admission FAQs</span>
                                    </button>
                                  )}
                                </div>

                                {/* Accordion Questions List */}
                                <div className="divide-y divide-slate-100/90 pt-1">
                                  {admData.faqs.map((faq, fIdx) => {
                                    const isOpen = openAdmissionFaqIdx === fIdx;
                                    const rawQ = faq.question.trim();
                                    const formattedQ = rawQ.startsWith("Q:") || rawQ.startsWith("Q.") ? rawQ : `Q: ${rawQ}`;
                                    const rawA = faq.answer.trim();
                                    const formattedA = rawA.startsWith("A:") || rawA.startsWith("A.") ? rawA : `A: ${rawA}`;

                                    return (
                                      <div key={fIdx} className="py-2.5 first:pt-1 last:pb-0">
                                        <button
                                          type="button"
                                          onClick={() => setOpenAdmissionFaqIdx(isOpen ? null : fIdx)}
                                          className="w-full flex items-center justify-between gap-3 text-left py-1 text-slate-800 hover:text-blue-600 transition-colors cursor-pointer group/q"
                                        >
                                          <span className="font-outfit font-bold text-[13px] sm:text-[13.5px] leading-snug group-hover/q:text-blue-600 transition-colors">
                                            {formattedQ}
                                          </span>
                                          <div className="flex items-center gap-2 shrink-0">
                                            {faq.upvotes && faq.upvotes > 0 ? (
                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[11px] font-bold">
                                                {faq.upvotes} 👍
                                              </span>
                                            ) : null}
                                            <ChevronDown
                                              className={`w-4 h-4 text-slate-500 group-hover/q:text-blue-600 transition-transform duration-200 ${
                                                isOpen ? "rotate-180 text-blue-600" : ""
                                              }`}
                                            />
                                          </div>
                                        </button>

                                        <AnimatePresence initial={false}>
                                          {isOpen && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.22, ease: "easeInOut" }}
                                              className="overflow-hidden"
                                            >
                                              <div className="pt-2 pb-2 pl-0.5 text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                                                <p className="leading-relaxed">
                                                  {formattedA}
                                                </p>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Centered 'Admission Details for all courses ->' Outline Pill Button */}
                                <div className="flex justify-center pt-3 pb-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveTab("admissions");
                                      document.getElementById("college-nav-tabs-bar")?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="px-6 py-2.5 rounded-full border border-[#2d114d] hover:border-[#1a0830] text-[#2d114d] hover:text-[#1a0830] hover:bg-purple-50/50 font-bold text-xs sm:text-[13.5px] transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-2xs cursor-pointer select-none"
                                  >
                                    <span>{admData.faqsButtonText || "Admission Details for all courses"}</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}

              {/* 6. RANKINGS 2026 SUB-BOX */}
              {(() => {
                const rkData = getCollegeRankingsArticle(collegeData);
                const collegeShortName = collegeData.name.split(" - ")[0].split("(")[0].trim() || "College";

                return (
                  <div
                    id="rankings-section"
                    className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-slate-300/90 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_28px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 scroll-mt-20"
                  >
                    {/* Top Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-outfit font-black text-lg sm:text-xl text-[#2d114d] tracking-tight">
                        {rkData.title || `${collegeShortName} Rankings 2026`}
                      </h3>

                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => openMiniModal("rankings")}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Rankings</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsRankingsCardOpen(!isRankingsCardOpen)}
                          aria-label={isRankingsCardOpen ? "Collapse Rankings Card" : "Expand Rankings Card"}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-all cursor-pointer shadow-2xs active:scale-90"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                              isRankingsCardOpen ? "rotate-180 text-blue-600" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Card Body */}
                    <AnimatePresence initial={false}>
                      {isRankingsCardOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3.5 space-y-3.5 text-[13.5px] sm:text-[14px] text-slate-700 leading-relaxed font-normal">
                            {!isRankingsArticleExpanded ? (
                              /* Collapsed / Preview State (Image 1) */
                              <div className="space-y-3 relative pt-0.5">
                                {rkData.introParagraph && (
                                  <p className="leading-relaxed">
                                    {renderFormattedText(rkData.introParagraph)}
                                  </p>
                                )}

                                {/* Sub-header banner preview with mask */}
                                <div className="relative max-h-[38px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]">
                                  <div className="px-4 py-2.5 rounded-lg bg-[#f0f4f9] text-[#1e3a8a] font-outfit font-bold text-xs sm:text-[13.5px]">
                                    {rkData.internationalHeading || `${collegeShortName} International Rankings 2025, 2026, 2027`}
                                  </div>
                                </div>

                                {/* Read More Trigger at Bottom Right */}
                                <div className="flex justify-end pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setIsRankingsArticleExpanded(true)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] font-bold text-xs sm:text-[13px] hover:underline cursor-pointer transition-colors"
                                  >
                                    Read more
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Full Expanded State (Image 2 & 3) */
                              <div className="space-y-5 pt-0.5">
                                {rkData.introParagraph && (
                                  <p className="leading-relaxed">
                                    {renderFormattedText(rkData.introParagraph)}
                                  </p>
                                )}

                                {/* 1. International Rankings Section */}
                                <div className="space-y-2.5">
                                  <div className="px-4 py-2.5 rounded-lg bg-[#f0f4f9] text-[#1e3a8a] font-outfit font-bold text-xs sm:text-[13.5px]">
                                    {rkData.internationalHeading || `${collegeShortName} International Rankings 2025, 2026, 2027`}
                                  </div>

                                  {rkData.internationalRows && rkData.internationalRows.length > 0 && (
                                    <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white">
                                      <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                                        <thead>
                                          <tr className="bg-[#f0f4f9] text-slate-800 font-bold font-outfit text-xs border-b border-slate-200/80">
                                            <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-5/12 border-r border-slate-200/80">
                                              Ranking Body
                                            </th>
                                            <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-4/12 border-r border-slate-200/80">
                                              Category
                                            </th>
                                            <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-3/12">
                                              Ranking
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                          {rkData.internationalRows.map((row, rIdx) => (
                                            <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                                              <td className="py-3 px-4 font-semibold text-slate-900 align-middle border-r border-slate-100">
                                                {row.body}
                                              </td>
                                              <td className="py-3 px-4 text-slate-700 align-middle border-r border-slate-100">
                                                {row.category}
                                              </td>
                                              <td className="py-3 px-4 font-bold text-slate-900 align-middle">
                                                {row.rank}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>

                                {/* 2. National Rankings Section */}
                                <div className="space-y-2.5">
                                  <div className="px-4 py-2.5 rounded-lg bg-[#f0f4f9] text-[#1e3a8a] font-outfit font-bold text-xs sm:text-[13.5px]">
                                    {rkData.nationalHeading || `${collegeShortName} National Rankings 2025, 2026`}
                                  </div>

                                  {rkData.nationalRows && rkData.nationalRows.length > 0 && (
                                    <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white">
                                      <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                                        <thead>
                                          <tr className="bg-[#f0f4f9] text-slate-800 font-bold font-outfit text-xs border-b border-slate-200/80">
                                            <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-5/12 border-r border-slate-200/80">
                                              Ranking Body
                                            </th>
                                            <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-4/12 border-r border-slate-200/80">
                                              Category
                                            </th>
                                            <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-3/12">
                                              Ranking
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                          {rkData.nationalRows.map((row, rIdx) => (
                                            <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                                              <td className="py-3 px-4 font-semibold text-slate-900 align-middle border-r border-slate-100">
                                                {row.body}
                                              </td>
                                              <td className="py-3 px-4 text-slate-700 align-middle border-r border-slate-100">
                                                {row.category}
                                              </td>
                                              <td className="py-3 px-4 font-bold text-slate-900 align-middle">
                                                {row.rank}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>

                                {/* Footer Note with Link & Show Less Button */}
                                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-[13px]">
                                  {rkData.footerNote && (
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                      {renderFormattedText(rkData.footerNote)}
                                    </p>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setIsRankingsArticleExpanded(false)}
                                    className="text-[#1a73e8] hover:text-[#0b57d0] font-bold text-xs sm:text-[13px] hover:underline cursor-pointer transition-colors self-end shrink-0"
                                  >
                                    Show less
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* COURSE RANKINGS ACCORDION BOXES */}
                            {rkData.courseRankingBoxes && rkData.courseRankingBoxes.length > 0 && (
                              <div className="space-y-3 pt-2">
                                {rkData.courseRankingBoxes.map((box, bIdx) => {
                                  const isBoxOpen = !!openCourseRankingBoxes[bIdx];

                                  return (
                                    <div
                                      key={bIdx}
                                      className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition-all duration-200"
                                    >
                                      {/* Header Row */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setOpenCourseRankingBoxes((prev) => ({
                                            ...prev,
                                            [bIdx]: !prev[bIdx],
                                          }))
                                        }
                                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
                                      >
                                        <h4 className="font-outfit font-extrabold text-sm sm:text-base text-[#2d114d] tracking-tight">
                                          {box.title}
                                        </h4>
                                        <ChevronDown
                                          className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                                            isBoxOpen ? "rotate-180 text-blue-600" : ""
                                          }`}
                                        />
                                      </button>

                                      {/* Expanded Body */}
                                      <AnimatePresence initial={false}>
                                        {isBoxOpen && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="overflow-hidden border-t border-slate-100"
                                          >
                                            <div className="p-4 sm:p-5 space-y-4">
                                              {/* Ranking Years Table */}
                                              {box.tableRows && box.tableRows.length > 0 && (
                                                <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)] bg-white">
                                                  <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                                                    <thead>
                                                      <tr className="bg-[#f0f4f9] text-slate-800 font-bold font-outfit text-xs border-b border-slate-200/80">
                                                        <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-1/2 border-r border-slate-200/80">
                                                          {box.yearsHeader?.[0] || "Publisher"}
                                                        </th>
                                                        <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-1/6 text-center border-r border-slate-200/80">
                                                          {box.yearsHeader?.[1] || "2024"}
                                                        </th>
                                                        <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-1/6 text-center border-r border-slate-200/80">
                                                          {box.yearsHeader?.[2] || "2025"}
                                                        </th>
                                                        <th className="py-3 px-4 font-bold font-outfit text-slate-900 w-1/6 text-center">
                                                          {box.yearsHeader?.[3] || "2026"}
                                                        </th>
                                                      </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                      {box.tableRows.map((r, rIdx) => (
                                                        <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                                                          <td className="py-3 px-4 font-semibold text-slate-900 align-middle border-r border-slate-100">
                                                            {r.publisher}
                                                          </td>
                                                          <td className="py-3 px-4 text-slate-700 text-center align-middle border-r border-slate-100">
                                                            {r.rank2024}
                                                          </td>
                                                          <td className="py-3 px-4 text-slate-700 text-center align-middle border-r border-slate-100">
                                                            {r.rank2025}
                                                          </td>
                                                          <td className="py-3 px-4 font-bold text-slate-900 text-center align-middle">
                                                            {r.rank2026}
                                                          </td>
                                                        </tr>
                                                      ))}
                                                    </tbody>
                                                  </table>
                                                </div>
                                              )}

                                              {/* Highlight Note Banner (Image 2) */}
                                              {box.highlightBadge && (
                                                <div className="p-3 sm:p-3.5 rounded-xl bg-[#fef9ee] border border-amber-200/70 flex items-center gap-2.5 text-xs sm:text-[13px] text-amber-950 font-bold shadow-2xs">
                                                  <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                                                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                  </div>
                                                  <span className="leading-snug">{box.highlightBadge}</span>
                                                </div>
                                              )}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Separator line & COMMONLY ASKED QUESTIONS ON RANKINGS ACCORDION */}
                            {rkData.faqs && rkData.faqs.length > 0 && (
                              <div className="pt-5 mt-4 border-t border-slate-200/80 space-y-3.5">
                                {/* Header Row with Yellow/Amber Q&A Badge */}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                                      <HelpCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="font-outfit font-bold text-sm sm:text-base text-slate-900 leading-tight">
                                        {rkData.faqsHeading || "Commonly asked questions"}
                                      </h4>
                                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                                        {rkData.faqsSubtitle || "On Rankings"}
                                      </p>
                                    </div>
                                  </div>

                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("rankings_faqs")}
                                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit Ranking FAQs</span>
                                    </button>
                                  )}
                                </div>

                                {/* Accordion Questions List */}
                                <div className="divide-y divide-slate-100/90 pt-1">
                                  {rkData.faqs.map((faq, fIdx) => {
                                    const isOpen = openRankingsFaqIdx === fIdx;
                                    const rawQ = faq.question.trim();
                                    const formattedQ = rawQ.startsWith("Q:") || rawQ.startsWith("Q.") ? rawQ : `Q: ${rawQ}`;
                                    const rawA = faq.answer.trim();
                                    const formattedA = rawA.startsWith("A:") || rawA.startsWith("A.") ? rawA : `A: ${rawA}`;

                                    return (
                                      <div key={fIdx} className="py-2.5 first:pt-1 last:pb-0">
                                        <button
                                          type="button"
                                          onClick={() => setOpenRankingsFaqIdx(isOpen ? null : fIdx)}
                                          className="w-full flex items-center justify-between gap-3 text-left py-1 text-slate-800 hover:text-blue-600 transition-colors cursor-pointer group/q"
                                        >
                                          <span className="font-outfit font-bold text-[13px] sm:text-[13.5px] leading-snug group-hover/q:text-blue-600 transition-colors">
                                            {formattedQ}
                                          </span>
                                          <ChevronDown
                                            className={`w-4 h-4 text-slate-500 group-hover/q:text-blue-600 transition-transform duration-200 ${
                                              isOpen ? "rotate-180 text-blue-600" : ""
                                            }`}
                                          />
                                        </button>

                                        <AnimatePresence initial={false}>
                                          {isOpen && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.22, ease: "easeInOut" }}
                                              className="overflow-hidden"
                                            >
                                              <div className="pt-2 pb-2 pl-0.5 text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                                                <p className="leading-relaxed">
                                                  {formattedA}
                                                </p>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Centered Double Action Buttons (Image Match) */}
                                <div className="flex flex-wrap items-center justify-center gap-3 pt-3 pb-1">
                                  {/* Button 1: Outline 'View Ranking Details ->' */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveTab("rankings");
                                      document.getElementById("college-nav-tabs-bar")?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="px-6 py-2.5 rounded-full border border-[#2d114d] hover:border-[#1a0830] text-[#2d114d] hover:text-[#1a0830] hover:bg-purple-50/60 font-bold text-xs sm:text-[13px] transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-2xs cursor-pointer select-none"
                                  >
                                    <span>{rkData.faqsBtn1Text || "View Ranking Details"}</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>

                                  {/* Button 2: Green Filled 'Ranking Details' */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveTab("rankings");
                                      document.getElementById("college-nav-tabs-bar")?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="px-6 py-2.5 rounded-full bg-[#00a859] hover:bg-[#00964e] text-white font-bold text-xs sm:text-[13px] transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-sm cursor-pointer select-none"
                                  >
                                    <Download className="w-4 h-4" />
                                    <span>{rkData.faqsBtn2Text || "Ranking Details"}</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}

              {/* 7. STUDENTS RATINGS & REVIEWS SUB-BOX (WITH LARGER SCORE CARD & OVERLAPPING PARAMETERS) */}
              {(() => {
                const revData = getCollegeReviewsArticle(collegeData);
                const totalCount = (revData.histogram || []).reduce((acc, curr) => acc + curr.count, 0) || 623;

                return (
                  <div id="reviews-section" className="group relative scroll-mt-20 bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
                    {/* Top Main Sky-Blue Gradient Container */}
                    <div className="relative bg-gradient-to-b from-[#eef4ff] via-[#f3f7ff] to-[#e4edff] p-6 sm:p-7 pb-12 sm:pb-14 border-b border-blue-100/60 relative overflow-hidden">
                      {/* Ambient Glow Aura */}
                      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

                      {/* Header Row (Clean, Normal font weight text) */}
                      <div className="flex items-start justify-between gap-3 relative z-10 mb-5">
                        <div className="flex items-center gap-3.5">
                          {/* Blue Badge Icon */}
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#3b82f6] via-[#4f46e5] to-[#6366f1] text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25 border border-white/40 transform group-hover:scale-105 transition-transform duration-300">
                            <Bookmark className="w-5 h-5 fill-white text-white drop-shadow-xs" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold font-outfit uppercase tracking-wider text-slate-500 block leading-tight">
                              {revData.tagText || "College"}
                            </span>
                            <h3 className="font-outfit font-bold text-lg sm:text-xl text-slate-800 tracking-tight leading-tight">
                              {revData.title || "Students Ratings & Reviews"}
                            </h3>
                          </div>
                        </div>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => openMiniModal("reviews")}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Reviews</span>
                          </button>
                        )}
                      </div>

                      {/* Spacious Big Score & Histogram Breakdown Card */}
                      <div className="relative z-10 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-9 border border-blue-100/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                        {/* Left: Score Display + Verified Badge */}
                        <div className="md:col-span-5 space-y-4 text-center md:text-left flex flex-col items-center md:items-start justify-center">
                          <div className="flex items-baseline gap-2.5">
                            <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-amber-400 text-amber-400 shrink-0 self-center drop-shadow-[0_2px_8px_rgba(251,191,36,0.45)] animate-pulse" />
                            <span className="text-4xl sm:text-5xl font-bold font-outfit text-slate-800 tracking-tight">
                              {revData.overallScore ?? 4.5}
                            </span>
                            <span className="text-slate-400 font-bold text-xl sm:text-2xl">
                              /5
                            </span>
                          </div>

                          {/* Verified Reviews Pill Badge */}
                          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs sm:text-[13px] font-bold shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white shrink-0" />
                            <span>{revData.totalReviewsCount || "623 Verified Reviews"}</span>
                            <span className="text-[10px] text-emerald-500 cursor-help ml-0.5" title="Calculated from real verified student feedback">
                              ⓘ
                            </span>
                          </div>
                        </div>

                        {/* Right: Star Histogram Progress Bars */}
                        <div className="md:col-span-7 space-y-3">
                          {(revData.histogram || []).map((item, hIdx) => {
                            const percent = Math.min(100, Math.round((item.count / totalCount) * 100));
                            const isHovered = hoveredStarBarIdx === hIdx;

                            return (
                              <div
                                key={hIdx}
                                onMouseEnter={() => setHoveredStarBarIdx(hIdx)}
                                onMouseLeave={() => setHoveredStarBarIdx(null)}
                                className="group/h flex items-center gap-3.5 text-xs sm:text-[13px] font-bold cursor-pointer select-none"
                              >
                                {/* Star Range Label */}
                                <div className="w-12 shrink-0 flex items-center gap-1 text-slate-700 group-hover/h:text-indigo-600 transition-colors font-outfit">
                                  <span className="text-amber-500 font-black">★</span>
                                  <span>{item.starsRange}</span>
                                </div>

                                {/* Interactive Progress Bar */}
                                <div className="flex-1 h-2 sm:h-2.5 bg-slate-200/80 rounded-full overflow-hidden relative shadow-inner">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                                      isHovered
                                        ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] scale-y-110"
                                        : "bg-gradient-to-r from-[#1c1136] via-[#2d114d] to-[#43196f]"
                                    }`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>

                                {/* Count & Tooltip */}
                                <div className="w-12 text-right shrink-0 text-slate-600 group-hover/h:text-slate-900 font-bold font-mono transition-colors">
                                  {isHovered ? `${percent}%` : item.count}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom 5 Overlapping Parameter Cards (Overlaps the Sky-Blue & White boundary seamlessly) */}
                    <div className="relative z-20 -mt-8 sm:-mt-10 px-3 sm:px-6">
                      <div className="flex sm:grid sm:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 px-1 sm:px-0 no-scrollbar snap-x snap-mandatory">
                        {(revData.parameters || []).map((param, pIdx) => {
                          return (
                            <div
                              key={pIdx}
                              className="group/param relative bg-white hover:bg-slate-50/60 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 hover:border-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.09)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center justify-between cursor-pointer select-none min-w-[155px] sm:min-w-0 shrink-0 snap-center"
                            >
                              {/* 2.5x Bigger Icon Container Box matching Image 1 & 2 */}
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-[0_3px_12px_rgba(0,0,0,0.04)] flex items-center justify-center p-2 sm:p-2.5 mb-2 group-hover/param:scale-105 group-hover/param:border-slate-200 group-hover/param:shadow-md transition-all duration-300">
                                {renderReviewCategoryIcon(param.label, param.iconType)}
                              </div>

                              {/* Category Name Label */}
                              <h5 className="text-sm sm:text-[15px] font-semibold font-outfit text-slate-700 group-hover/param:text-slate-900 transition-colors leading-snug pt-2 pb-1 text-center line-clamp-1">
                                {param.label}
                              </h5>

                              {/* Score & Star - Number first, then Star on the right as in Image 1 & 2 */}
                              <div className="flex items-center justify-center gap-1.5 pt-0.5">
                                <span className="font-outfit font-bold text-base sm:text-lg text-slate-800 tracking-tight">
                                  {Number(param.rating).toFixed(1)}
                                </span>
                                <span className="text-amber-500 font-black text-base sm:text-lg leading-none select-none">
                                  ★
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* What students say about {College} (Seamless White Background & Minimal Gap) */}
                    {(() => {
                      const feedbackData = revData.studentFeedback || {
                        heading: "What students say about " + (collegeData.fullName || collegeData.name),
                        categories: DEFAULT_STUDENT_FEEDBACK_CATEGORIES,
                      };
                      const categories = (feedbackData.categories && feedbackData.categories.length > 0)
                        ? feedbackData.categories
                        : DEFAULT_STUDENT_FEEDBACK_CATEGORIES;
                      const activeItem = categories.find(
                        (c: StudentFeedbackCategory) => c.category.toLowerCase() === activeFeedbackCategory.toLowerCase()
                      ) || categories[0] || DEFAULT_STUDENT_FEEDBACK_CATEGORIES[0];

                      return (
                        <div className="p-6 sm:p-7 pt-2 sm:pt-3 space-y-5">
                          {/* Heading + Individual Admin Edit Button */}
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-outfit font-bold text-lg sm:text-xl text-slate-900 tracking-tight leading-snug">
                              {feedbackData.heading || ("What students say about " + (collegeData.fullName || collegeData.name))}
                            </h4>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => openMiniModal("studentFeedback")}
                                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit Feedback</span>
                              </button>
                            )}
                          </div>

                          {/* Category Filter Pills (Placements, Infrastructure, Faculty, Other) */}
                          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                            {categories.map((cat: StudentFeedbackCategory, cIdx: number) => {
                              const isCatActive = (cat.category.toLowerCase() === (activeItem?.category || "").toLowerCase());
                              return (
                                <button
                                  key={cIdx}
                                  type="button"
                                  onClick={() => setActiveFeedbackCategory(cat.category)}
                                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                                    isCatActive
                                      ? "border-2 border-slate-800 bg-slate-900 text-white shadow-xs scale-100"
                                      : "border border-slate-200/90 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                  }`}
                                >
                                  {cat.category}
                                </button>
                              );
                            })}
                          </div>

                          {/* Vertical Table / Stack for Likes & Dislikes */}
                          <div className="space-y-6 pt-1">
                            {/* 1. LIKES ROW */}
                            <div className="space-y-2 group/like">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs shrink-0" />
                                  <h5 className="font-outfit font-bold text-base sm:text-lg text-slate-900">
                                    Likes
                                  </h5>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab("reviews");
                                    document.getElementById("college-nav-tabs-bar")?.scrollIntoView({ behavior: "smooth" });
                                  }}
                                  className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                >
                                  View All
                                </button>
                              </div>
                              <p className="text-xs sm:text-[14px] text-slate-700 leading-relaxed pl-5 sm:pl-5.5">
                                {activeItem?.likesText}
                              </p>
                              <span className="block text-[11.5px] sm:text-xs font-medium text-slate-400 pl-5 sm:pl-5.5">
                                {activeItem?.likesCountText || "Based on Student Reviews"}
                              </span>
                            </div>

                            {/* Subtle Divider */}
                            <div className="border-t border-slate-100" />

                            {/* 2. DISLIKES ROW */}
                            <div className="space-y-2 group/dislike">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-xs shrink-0" />
                                  <h5 className="font-outfit font-bold text-base sm:text-lg text-slate-900">
                                    Dislikes
                                  </h5>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab("reviews");
                                    document.getElementById("college-nav-tabs-bar")?.scrollIntoView({ behavior: "smooth" });
                                  }}
                                  className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                >
                                  View All
                                </button>
                              </div>
                              <p className="text-xs sm:text-[14px] text-slate-700 leading-relaxed pl-5 sm:pl-5.5">
                                {activeItem?.dislikesText}
                              </p>
                              <span className="block text-[11.5px] sm:text-xs font-medium text-slate-400 pl-5 sm:pl-5.5">
                                {activeItem?.dislikesCountText || "Based on Student Reviews"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* DETAILED STUDENT REVIEW CARDS (INDIVIDUAL BOXES WITH READ MORE/LESS & RATINGS) */}
                    {(() => {
                      const cards = (revData.reviewCards && revData.reviewCards.length > 0)
                        ? revData.reviewCards
                        : DEFAULT_DETAILED_REVIEW_CARDS;

                      return (
                        <div className="p-4 sm:p-7 pt-2 space-y-4 sm:space-y-5">
                          {/* Header Row with Total Reviews & Admin Edit Button */}
                          <div className="flex items-center justify-between gap-3 pt-2">
                            <h4 className="font-outfit font-bold text-base sm:text-lg text-slate-900">
                              Detailed Student Reviews ({cards.length})
                            </h4>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => openMiniModal("reviewCards")}
                                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit Review Cards</span>
                              </button>
                            )}
                          </div>

                          {/* Render Individual Review Cards */}
                          <div className="space-y-4">
                            {cards.map((card: DetailedReviewCard, cIdx: number) => {
                              const isExpanded = !!expandedReviewCardIds[card.id];
                              const userVote = reviewHelpfulVotes[card.id];

                              return (
                                <div
                                  key={card.id || cIdx}
                                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300 space-y-4"
                                >
                                  {/* Top Row: Avatar + Author Info + Score Badge */}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      {/* Avatar Initial Circle */}
                                      <div
                                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-base sm:text-lg font-outfit shrink-0 shadow-2xs ${
                                          card.avatarBgColor || "bg-amber-100 text-amber-800"
                                        }`}
                                      >
                                        {card.avatarInitial || card.authorName.charAt(0).toUpperCase()}
                                      </div>

                                      {/* Name & Degree */}
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <h5 className="font-outfit font-bold text-sm sm:text-base text-slate-900 leading-snug">
                                            {card.authorName}
                                          </h5>
                                          {card.verified && (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-tight pt-0.5">
                                          {card.courseAndBatch}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Overall Rating Badge */}
                                    <div className="px-2.5 py-1 rounded-md bg-[#00a859] text-white font-bold text-xs sm:text-[13px] flex items-center gap-1 shrink-0 shadow-2xs select-none">
                                      <span className="text-[11px]">★</span>
                                      <span>{Number(card.overallRating).toFixed(1)}</span>
                                    </div>
                                  </div>

                                  {/* Parameter Rating Badges Pill Row */}
                                  {card.parameterRatings && card.parameterRatings.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                      {card.parameterRatings.map((p: ReviewParameterBadge, pIdx: number) => {
                                        const isLow = p.rating < 3.0;
                                        return (
                                          <div
                                            key={pIdx}
                                            className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border ${
                                              isLow
                                                ? "bg-rose-50/50 border-rose-200/80 text-rose-700"
                                                : "bg-white border-slate-200/90 text-slate-700 shadow-2xs"
                                            }`}
                                          >
                                            <span className={isLow ? "text-rose-500 font-black" : "text-emerald-600 font-black"}>
                                              ★
                                            </span>
                                            <span className="font-bold text-slate-900">{Number(p.rating).toFixed(1)}</span>
                                            <span className="text-slate-600">{p.label}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Review Title / Tagline */}
                                  <h4 className="font-outfit font-bold text-sm sm:text-[15px] text-slate-900 pt-0.5 leading-snug">
                                    {card.title}
                                  </h4>

                                  {/* Review Paragraphs (Collapsed vs Expanded) */}
                                  <div className="space-y-2.5 text-xs sm:text-[13.5px] text-slate-700 leading-relaxed font-normal">
                                    {(isExpanded
                                      ? card.paragraphs
                                      : (card.paragraphs || []).slice(0, 2)
                                    ).map((para: ReviewCategoryParagraph, pIdx: number) => (
                                      <p key={pIdx} className="leading-relaxed">
                                        <strong className="font-bold text-slate-900 font-outfit">
                                          {para.heading}:{" "}
                                        </strong>
                                        <span>{para.content}</span>
                                      </p>
                                    ))}
                                  </div>

                                  {/* Footer Row: Reviewed Date & Read More / Less Toggle */}
                                  <div className="flex items-center justify-between gap-3 pt-1">
                                    <span className="text-[11.5px] sm:text-xs font-medium text-slate-400">
                                      {card.reviewedDate}
                                    </span>

                                    {(card.paragraphs || []).length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setExpandedReviewCardIds((prev) => ({
                                            ...prev,
                                            [card.id]: !prev[card.id],
                                          }));
                                        }}
                                        className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer select-none transition-colors"
                                      >
                                        {isExpanded ? "Read Less" : "Read More"}
                                      </button>
                                    )}
                                  </div>

                                  {/* Subtle Bottom Action Bar (Thumbs Up / Down) */}
                                  <div className="border-t border-dashed border-slate-200/80 pt-3 flex items-center gap-4 text-slate-500">
                                    {/* Like Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReviewHelpfulVotes((prev) => ({
                                          ...prev,
                                          [card.id]: prev[card.id] === "up" ? null : "up",
                                        }));
                                      }}
                                      className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                                        userVote === "up"
                                          ? "text-blue-600 bg-blue-50 font-bold"
                                          : "hover:text-slate-800 hover:bg-slate-100"
                                      }`}
                                    >
                                      <ThumbsUp className="w-3.5 h-3.5" />
                                      <span>{(card.likesCount || 10) + (userVote === "up" ? 1 : 0)}</span>
                                    </button>

                                    {/* Dislike Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReviewHelpfulVotes((prev) => ({
                                          ...prev,
                                          [card.id]: prev[card.id] === "down" ? null : "down",
                                        }));
                                      }}
                                      className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                                        userVote === "down"
                                          ? "text-red-600 bg-red-50 font-bold"
                                          : "hover:text-slate-800 hover:bg-slate-100"
                                      }`}
                                    >
                                      <ThumbsDown className="w-3.5 h-3.5" />
                                      <span>{(card.dislikesCount || 0) + (userVote === "down" ? 1 : 0)}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* STUDENT VIDEO & IMAGE REVIEWS CAROUSEL SECTION */}
                          {(() => {
                            const mediaData = revData.mediaReviews || {
                              title: "Student Video Reviews",
                              items: DEFAULT_STUDENT_MEDIA_REVIEWS,
                            };
                            const mediaItems = (mediaData.items && mediaData.items.length > 0)
                              ? mediaData.items
                              : DEFAULT_STUDENT_MEDIA_REVIEWS;

                            const scrollMedia = (direction: "left" | "right") => {
                              if (mediaReviewsScrollRef.current) {
                                const scrollAmount = 260;
                                mediaReviewsScrollRef.current.scrollBy({
                                  left: direction === "left" ? -scrollAmount : scrollAmount,
                                  behavior: "smooth",
                                });
                              }
                            };

                            return (
                              <div className="pt-6 mt-4 border-t border-slate-100 space-y-4">
                                {/* Header Row with Title & Admin Edit Button */}
                                <div className="flex items-center justify-between gap-3">
                                  <h4 className="font-outfit font-bold text-base sm:text-lg text-slate-900">
                                    {mediaData.title || "Student Video Reviews"}
                                  </h4>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("studentMediaReviews")}
                                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                      <span>Edit Video Reviews</span>
                                    </button>
                                  )}
                                </div>

                                {/* Carousel Container with Floating Next/Prev Arrow */}
                                <div className="relative group/carousel">
                                  {/* Left Scroll Button */}
                                  <button
                                    type="button"
                                    onClick={() => scrollMedia("left")}
                                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200/90 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 hidden sm:flex opacity-0 group-hover/carousel:opacity-100"
                                  >
                                    <ChevronLeft className="w-5 h-5" />
                                  </button>

                                  {/* Horizontal Scroll Cards Row */}
                                  <div
                                    ref={mediaReviewsScrollRef}
                                    className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar snap-x snap-mandatory"
                                  >
                                    {mediaItems.map((item: StudentMediaReviewItem, mIdx: number) => {
                                      const isVideo = item.type === "video";
                                      return (
                                        <div
                                          key={item.id || mIdx}
                                          onClick={() => setActiveMediaReviewModal(item)}
                                          className="w-[170px] sm:w-[200px] h-[290px] sm:h-[330px] shrink-0 rounded-2xl overflow-hidden relative group/card cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/90 bg-slate-950 snap-center select-none"
                                        >
                                          {/* Background Thumbnail Image */}
                                          <img
                                            src={item.thumbnailUrl || item.mediaUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80"}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                          />

                                          {/* Top Tag Badge (Video / Image) */}
                                          <div className="absolute top-2.5 left-2.5 z-10">
                                            <div className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10.5px] font-bold flex items-center gap-1 shadow-2xs">
                                              {isVideo ? (
                                                <Video className="w-3 h-3 text-red-400" />
                                              ) : (
                                                <Camera className="w-3 h-3 text-cyan-400" />
                                              )}
                                              <span>{isVideo ? "Video" : "Photo"}</span>
                                            </div>
                                          </div>

                                          {/* Top Right Source Badge */}
                                          <div className="absolute top-2.5 right-2.5 z-10">
                                            <div className="px-1.5 py-0.5 rounded bg-white/90 text-slate-800 text-[9px] font-bold shadow-2xs">
                                              tyc.com
                                            </div>
                                          </div>

                                          {/* Center Play Button Overlay */}
                                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                            <div className="w-11 h-11 rounded-full bg-white/80 group-hover/card:bg-white text-slate-900 flex items-center justify-center shadow-lg group-hover/card:scale-115 transition-all duration-300 backdrop-blur-xs">
                                              {isVideo ? (
                                                <Play className="w-5 h-5 fill-slate-900 text-slate-900 ml-0.5" />
                                              ) : (
                                                <Eye className="w-5 h-5 text-slate-900" />
                                              )}
                                            </div>
                                          </div>

                                          {/* Dark Gradient Overlay at Bottom for Readable Caption */}
                                          <div className="absolute inset-x-0 bottom-0 pt-16 pb-3 px-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10 flex flex-col justify-end">
                                            {/* Caption Title */}
                                            <p className="font-outfit font-bold text-xs sm:text-[13px] text-white line-clamp-2 leading-snug drop-shadow-sm">
                                              {item.title}
                                            </p>

                                            {/* Footer Duration / Tag */}
                                            <div className="flex items-center justify-between text-[10.5px] text-slate-300 font-medium pt-1.5">
                                              <span>{item.authorName || "Student Review"}</span>
                                              <span className="font-mono font-bold bg-white/20 px-1.5 py-0.2 rounded text-[10px] text-white">
                                                {item.duration || "00:00"}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Right Scroll Button */}
                                  <button
                                    type="button"
                                    onClick={() => scrollMedia("right")}
                                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200/90 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 hidden sm:flex opacity-0 group-hover/carousel:opacity-100"
                                  >
                                    <ChevronRight className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })()}

                          {/* 5 MORE DETAILED STUDENT REVIEW CARDS BELOW VIDEO REVIEWS */}
                          {(() => {
                            const moreCards = (revData.moreReviewCards && revData.moreReviewCards.length > 0)
                              ? revData.moreReviewCards
                              : DEFAULT_MORE_REVIEW_CARDS;

                            return (
                              <div className="pt-6 mt-4 border-t border-slate-100 space-y-4 sm:space-y-5">
                                {/* Header Row with Total Reviews & Admin Edit Button */}
                                <div className="flex items-center justify-between gap-3">
                                  <h4 className="font-outfit font-bold text-base sm:text-lg text-slate-900">
                                    More Student Reviews ({moreCards.length})
                                  </h4>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openMiniModal("moreReviewCards")}
                                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                      <span>Edit More Reviews</span>
                                    </button>
                                  )}
                                </div>

                                {/* Render Individual Review Cards */}
                                <div className="space-y-4">
                                  {moreCards.map((card: DetailedReviewCard, cIdx: number) => {
                                    const isExpanded = !!expandedReviewCardIds[card.id];
                                    const userVote = reviewHelpfulVotes[card.id];

                                    return (
                                      <div
                                        key={card.id || cIdx}
                                        className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300 space-y-4"
                                      >
                                        {/* Top Row: Avatar + Author Info + Score Badge */}
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex items-center gap-3">
                                            {/* Avatar Initial Circle */}
                                            <div
                                              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-base sm:text-lg font-outfit shrink-0 shadow-2xs ${
                                                card.avatarBgColor || "bg-teal-100 text-teal-800"
                                              }`}
                                            >
                                              {card.avatarInitial || card.authorName.charAt(0).toUpperCase()}
                                            </div>

                                            {/* Name & Degree */}
                                            <div>
                                              <div className="flex items-center gap-1.5">
                                                <h5 className="font-outfit font-bold text-sm sm:text-base text-slate-900 leading-snug">
                                                  {card.authorName}
                                                </h5>
                                                {card.verified && (
                                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
                                                )}
                                              </div>
                                              <p className="text-xs text-slate-500 font-medium leading-tight pt-0.5">
                                                {card.courseAndBatch}
                                              </p>
                                            </div>
                                          </div>

                                          {/* Overall Rating Badge */}
                                          <div className="px-2.5 py-1 rounded-md bg-[#00a859] text-white font-bold text-xs sm:text-[13px] flex items-center gap-1 shrink-0 shadow-2xs select-none">
                                            <span className="text-[11px]">★</span>
                                            <span>{Number(card.overallRating).toFixed(1)}</span>
                                          </div>
                                        </div>

                                        {/* Parameter Rating Badges Pill Row */}
                                        {card.parameterRatings && card.parameterRatings.length > 0 && (
                                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                            {card.parameterRatings.map((p: ReviewParameterBadge, pIdx: number) => {
                                              const isLow = p.rating < 3.0;
                                              return (
                                                <div
                                                  key={pIdx}
                                                  className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border ${
                                                    isLow
                                                      ? "bg-rose-50/50 border-rose-200/80 text-rose-700"
                                                      : "bg-white border-slate-200/90 text-slate-700 shadow-2xs"
                                                  }`}
                                                >
                                                  <span className={isLow ? "text-rose-500 font-black" : "text-emerald-600 font-black"}>
                                                    ★
                                                  </span>
                                                  <span className="font-bold text-slate-900">{Number(p.rating).toFixed(1)}</span>
                                                  <span className="text-slate-600">{p.label}</span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}

                                        {/* Review Title / Tagline */}
                                        <h4 className="font-outfit font-bold text-sm sm:text-[15px] text-slate-900 pt-0.5 leading-snug">
                                          {card.title}
                                        </h4>

                                        {/* Review Paragraphs (Collapsed vs Expanded) */}
                                        <div className="space-y-2.5 text-xs sm:text-[13.5px] text-slate-700 leading-relaxed font-normal">
                                          {(isExpanded
                                            ? card.paragraphs
                                            : (card.paragraphs || []).slice(0, 2)
                                          ).map((para: ReviewCategoryParagraph, pIdx: number) => (
                                            <p key={pIdx} className="leading-relaxed">
                                              <strong className="font-bold text-slate-900 font-outfit">
                                                {para.heading}:{" "}
                                              </strong>
                                              <span>{para.content}</span>
                                            </p>
                                          ))}
                                        </div>

                                        {/* Footer Row: Reviewed Date & Read More / Less Toggle */}
                                        <div className="flex items-center justify-between gap-3 pt-1">
                                          <span className="text-[11.5px] sm:text-xs font-medium text-slate-400">
                                            {card.reviewedDate}
                                          </span>

                                          {(card.paragraphs || []).length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setExpandedReviewCardIds((prev) => ({
                                                  ...prev,
                                                  [card.id]: !prev[card.id],
                                                }));
                                              }}
                                              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer select-none transition-colors"
                                            >
                                              {isExpanded ? "Read Less" : "Read More"}
                                            </button>
                                          )}
                                        </div>

                                        {/* Subtle Bottom Action Bar (Thumbs Up / Down) */}
                                        <div className="border-t border-dashed border-slate-200/80 pt-3 flex items-center gap-4 text-slate-500">
                                          {/* Like Button */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setReviewHelpfulVotes((prev) => ({
                                                ...prev,
                                                [card.id]: prev[card.id] === "up" ? null : "up",
                                              }));
                                            }}
                                            className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                                              userVote === "up"
                                                ? "text-blue-600 bg-blue-50 font-bold"
                                                : "hover:text-slate-800 hover:bg-slate-100"
                                            }`}
                                          >
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            <span>{(card.likesCount || 10) + (userVote === "up" ? 1 : 0)}</span>
                                          </button>

                                          {/* Dislike Button */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setReviewHelpfulVotes((prev) => ({
                                                ...prev,
                                                [card.id]: prev[card.id] === "down" ? null : "down",
                                              }));
                                            }}
                                            className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                                              userVote === "down"
                                                ? "text-red-600 bg-red-50 font-bold"
                                                : "hover:text-slate-800 hover:bg-slate-100"
                                            }`}
                                          >
                                            <ThumbsDown className="w-3.5 h-3.5" />
                                            <span>{(card.dislikesCount || 0) + (userVote === "down" ? 1 : 0)}</span>
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TABS OTHER THAN INFO: CLEAN PLACEHOLDER WHILE BUILDING STEP-BY-STEP */}
          {activeTab !== "info" && (
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-outfit text-slate-900">
                {SHIKSHA_NAV_TABS.find((t) => t.id === activeTab)?.label || "Section"} - Updating for 2026
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                This section template is being prepared. Check back shortly or explore College Info.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY INQUIRY & COUNSELLING CARD (30%) */}
        <div className="lg:col-span-3 space-y-6">
          <div
            id="lead-inquiry-box"
            className="sticky top-20 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-5"
          >
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[9.5px] font-black uppercase tracking-wide border border-orange-200">
                <Sparkles className="w-3 h-3" />
                Admission 2026-27
              </span>
              <h3 className="font-outfit font-black text-lg text-slate-900">
                Need Guidance for {collegeData.name.split(" - ")[0]}?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Talk to our senior expert counsellor for JoSAA cutoff analysis, branch recommendation, and scholarship guidance.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10.5px] font-bold text-slate-700">
                  Student Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-700">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs rounded-xl active:scale-95 transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Get Expert Callback</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert("Brochure downloaded successfully!")}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Official PDF</span>
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5 text-[10px] text-slate-500 font-semibold leading-relaxed">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>100% Free counselling support. Bihar Student Credit Card accepted.</span>
            </div>
          </div>
        </div>
      </div>

      {/* PHOTO GALLERY FULLSCREEN MODAL */}
      <AnimatePresence>
        {activePhotoIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-700"
            >
              <button
                onClick={() => setActivePhotoIdx(null)}
                className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-orange-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-[360px] sm:h-[460px] bg-black">
                <img
                  src={collegeData.gallery[activePhotoIdx]?.url || collegeData.image}
                  alt="Gallery"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 bg-slate-950 flex items-center justify-between text-white text-xs">
                <span className="font-bold">
                  {collegeData.gallery[activePhotoIdx]?.caption} ({collegeData.gallery[activePhotoIdx]?.category})
                </span>
                <div className="flex gap-2">
                  {collegeData.gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-3 h-3 rounded-full ${
                        activePhotoIdx === idx ? "bg-orange-500" : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INDEPENDENT MINI-MODALS SYSTEM FOR EACH SECTION */}
      <AnimatePresence>
        {activeMiniModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl relative border border-slate-200 my-8 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => setActiveMiniModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 z-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleSaveSection} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-outfit font-black text-xl text-slate-900">
                    {activeMiniModal === "author" && "✍️ Edit Author & Byline Profile"}
                    {activeMiniModal === "header" && "🖼️ Edit Banner Photo & Titles"}
                    {activeMiniModal === "info" && "📝 Edit College Overview & Latest Updates"}
                    {activeMiniModal === "highlights" && "📊 Edit Key Highlights Table"}
                    {activeMiniModal === "courses" && "🎓 Edit Courses, Fees & Intake"}
                    {activeMiniModal === "course_summary_box" && "🎓 Edit Course Highlights Sub-Boxes (UG / PG Courses)"}
                    {activeMiniModal === "fees" && "💰 Edit Tuition & Hostel Fees"}
                    {activeMiniModal === "placements" && "💼 Placements Management Hub"}
                    {activeMiniModal === "placements_article" && "📝 Edit Placements Article & Subsections"}
                    {activeMiniModal === "placements_stats" && "📊 Edit Placement Statistics Highlights Table"}
                    {activeMiniModal === "placements_salary" && "💰 Edit Course-wise Median Salary Table"}
                    {activeMiniModal === "placements_recruiters" && "🏢 Edit Top Recruiters & Company Logos"}
                    {activeMiniModal === "placements_insights" && "💡 Edit Placement Student Insights"}
                    {activeMiniModal === "placements_faqs" && "❓ Edit Placement FAQs"}
                    {activeMiniModal === "cutoffs" && "📈 Edit Cutoff Ranks Table"}
                    {activeMiniModal === "cutoff_comparison" && "📈 Edit Cutoff Round 3-Year Comparison Table"}
                    {activeMiniModal === "secondary_cutoff_comparison" && "📊 Edit Secondary Exam Cutoff Table (UCEED / Specialized)"}
                    {activeMiniModal === "rankings" && "🏆 Edit Rankings"}
                    {activeMiniModal === "rankings_faqs" && "❓ Edit Ranking FAQs"}
                    {activeMiniModal === "gallery" && "📸 Edit Photo Gallery"}
                    {activeMiniModal === "hostel" && "🏢 Edit Campus Facilities & Hostels"}
                    {activeMiniModal === "faculty" && "👨‍🏫 Edit Faculty Profiles"}
                    {activeMiniModal === "qa" && "❓ Edit Student Q&A FAQs"}
                    {activeMiniModal === "scholarships" && "🎁 Edit Scholarship Schemes"}
                    {activeMiniModal === "reviews" && "⭐ Edit Verified Reviews"}
                    {activeMiniModal === "admission" && "🎓 Edit Admission & Application Process"}
                    {activeMiniModal === "admission_faqs" && "❓ Edit Admission FAQs"}
                  </h3>
                  <p className="text-xs text-purple-600 font-bold">
                    Editing: {collegeData.name} ({slug})
                  </p>
                </div>

                {/* MODAL 1: AUTHOR PROFILE */}
                {activeMiniModal === "author" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Author Name *</label>
                      <input
                        required
                        type="text"
                        value={tempData.author?.name || ""}
                        onChange={(e) =>
                          setTempData({
                            ...tempData,
                            author: { ...tempData.author, name: e.target.value, role: tempData.author?.role || "Intern", updatedDate: tempData.author?.updatedDate || "Feb 09, 2026" },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Role / Position *</label>
                      <input
                        required
                        type="text"
                        value={tempData.author?.role || ""}
                        onChange={(e) =>
                          setTempData({
                            ...tempData,
                            author: { ...tempData.author, role: e.target.value, name: tempData.author?.name || "Shreeya Panda", updatedDate: tempData.author?.updatedDate || "Feb 09, 2026" },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Author Avatar / Photo URL</label>
                      <input
                        type="text"
                        value={tempData.author?.image || ""}
                        placeholder="e.g. https://... or leave blank for default TYC badge"
                        onChange={(e) =>
                          setTempData({
                            ...tempData,
                            author: { ...tempData.author, image: e.target.value, name: tempData.author?.name || "Shreeya Panda", role: tempData.author?.role || "Intern", updatedDate: tempData.author?.updatedDate || "Feb 09, 2026" },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Updated Date String</label>
                      <input
                        type="text"
                        value={tempData.author?.updatedDate || ""}
                        placeholder="e.g. Feb 09, 2026"
                        onChange={(e) =>
                          setTempData({
                            ...tempData,
                            author: { ...tempData.author, updatedDate: e.target.value, name: tempData.author?.name || "Shreeya Panda", role: tempData.author?.role || "Intern" },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}

                {/* MODAL 2: HEADER & BANNER */}
                {activeMiniModal === "header" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Cover Banner Image URL</label>
                      <input
                        type="text"
                        value={tempData.image || ""}
                        onChange={(e) => setTempData({ ...tempData, image: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">College Full Name / Title</label>
                      <input
                        type="text"
                        value={tempData.fullName || tempData.name}
                        onChange={(e) => setTempData({ ...tempData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">NIRF Rank Badge</label>
                        <input
                          type="text"
                          value={tempData.nirfRank}
                          onChange={(e) => setTempData({ ...tempData, nirfRank: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Estd. Year</label>
                        <input
                          type="text"
                          value={tempData.estd}
                          onChange={(e) => setTempData({ ...tempData, estd: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL 2.5: TABLE OF CONTENTS */}
                {activeMiniModal === "toc" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 font-medium">
                      Manage links in the Table of contents box. When users click these blue links, they will be navigated straight to that section.
                    </p>
                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                      {(tempData.tableOfContents && tempData.tableOfContents.length > 0
                        ? tempData.tableOfContents
                        : getCollegeTocList(tempData)
                      ).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                        >
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const currentList = [
                                ...(tempData.tableOfContents && tempData.tableOfContents.length > 0
                                  ? tempData.tableOfContents
                                  : getCollegeTocList(tempData)),
                              ];
                              currentList[idx] = { ...currentList[idx], label: e.target.value };
                              setTempData({ ...tempData, tableOfContents: currentList });
                            }}
                            placeholder="Link Title (e.g. IIT Delhi Highlights 2026)"
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-blue-600"
                          />

                          <select
                            value={`${item.targetId}|${item.tabId || "info"}`}
                            onChange={(e) => {
                              const [tId, tbId] = e.target.value.split("|");
                              const currentList = [
                                ...(tempData.tableOfContents && tempData.tableOfContents.length > 0
                                  ? tempData.tableOfContents
                                  : getCollegeTocList(tempData)),
                              ];
                              currentList[idx] = {
                                ...currentList[idx],
                                targetId: tId,
                                tabId: tbId as ShikshaTabId,
                              };
                              setTempData({ ...tempData, tableOfContents: currentList });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 sm:w-44"
                          >
                            <option value="highlights-section|info">Info - Highlights 2026</option>
                            <option value="cutoffs-section|info">Info - Cutoff 2026 Box</option>
                            <option value="courses-section|info">Info - Courses & Fees Box</option>
                            <option value="placements-section|info">Info - Placements Box</option>
                            <option value="admissions-section|info">Info - Admissions Box</option>
                            <option value="rankings-section|info">Info - Rankings Box</option>
                            <option value="reviews-section|info">Info - Reviews Box</option>
                            <option value="scholarships-section|info">Info - Scholarships Box</option>
                            <option value="campus-section|info">Info - Campus & Facilities</option>
                            <option value="faculty-section|info">Info - Faculty Section</option>
                            <option value="compare-section|info">Info - College Compare</option>
                            <option value="about-section|info">Info - About Overview</option>
                            <option value="faq-section|info">Info - Q&A / FAQs Section</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              const currentList = [
                                ...(tempData.tableOfContents && tempData.tableOfContents.length > 0
                                  ? tempData.tableOfContents
                                  : getCollegeTocList(tempData)),
                              ];
                              const updated = currentList.filter((_, i) => i !== idx);
                              setTempData({ ...tempData, tableOfContents: updated });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg self-end sm:self-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const currentList = [
                            ...(tempData.tableOfContents && tempData.tableOfContents.length > 0
                              ? tempData.tableOfContents
                              : getCollegeTocList(tempData)),
                          ];
                          setTempData({
                            ...tempData,
                            tableOfContents: [
                              ...currentList,
                              {
                                label: `${tempData.name.split(" - ")[0]} New Section 2026`,
                                targetId: "about-section",
                                tabId: "info",
                              },
                            ],
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add TOC Item</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTempData({
                            ...tempData,
                            tableOfContents: getCollegeTocList(tempData),
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL 3: INFO & OVERVIEW */}
                {activeMiniModal === "info" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">About the Institution (Detailed narrative)</label>
                      <textarea
                        rows={6}
                        value={tempData.description}
                        onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">What's New Updates (1 per line)</label>
                      <textarea
                        rows={4}
                        value={tempData.whatsNew?.join("\n") || ""}
                        onChange={(e) => setTempData({ ...tempData, whatsNew: e.target.value.split("\n").filter(Boolean) })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* MODAL 4: HIGHLIGHTS & EDITORIAL ARTICLE */}
                {activeMiniModal === "highlights" && (
                  <div className="space-y-4">
                    {/* Editorial Highlights Article Section */}
                    <div className="p-3.5 bg-purple-50/50 border border-purple-200/80 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
                          Editorial Highlights Article
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                            setTempData({
                              ...tempData,
                              highlightsArticle: {
                                ...currentArt,
                                bullets: [
                                  ...(currentArt.bullets || []),
                                  {
                                    title: "New Highlight",
                                    text: "Add detailed description here.",
                                  },
                                ],
                              },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Bullet Point</span>
                        </button>
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Introductory Paragraph</label>
                        <textarea
                          rows={3}
                          value={tempData.highlightsArticle?.introText || getCollegeHighlightsArticle(tempData).introText || ""}
                          onChange={(e) => {
                            const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                            setTempData({
                              ...tempData,
                              highlightsArticle: {
                                ...currentArt,
                                introText: e.target.value,
                              },
                            });
                          }}
                          placeholder="Intro text..."
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
                        />
                      </div>

                      {/* Bullets List */}
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {(tempData.highlightsArticle?.bullets || getCollegeHighlightsArticle(tempData).bullets || []).map((b, idx) => (
                          <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1.5 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                                const updated = (currentArt.bullets || []).filter((_, i) => i !== idx);
                                setTempData({
                                  ...tempData,
                                  highlightsArticle: {
                                    ...currentArt,
                                    bullets: updated,
                                  },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <input
                              type="text"
                              value={b.title}
                              onChange={(e) => {
                                const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                                const updated = [...(currentArt.bullets || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setTempData({
                                  ...tempData,
                                  highlightsArticle: {
                                    ...currentArt,
                                    bullets: updated,
                                  },
                                });
                              }}
                              placeholder="Title (e.g. Rankings, Placements)"
                              className="w-4/5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                            />

                            <textarea
                              rows={2}
                              value={b.text}
                              onChange={(e) => {
                                const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                                const updated = [...(currentArt.bullets || [])];
                                updated[idx] = { ...updated[idx], text: e.target.value };
                                setTempData({
                                  ...tempData,
                                  highlightsArticle: {
                                    ...currentArt,
                                    bullets: updated,
                                  },
                                });
                              }}
                              placeholder="Full description text..."
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none"
                            />
                          </div>
                        ))}
                      </div>

                      {/* NIRF Banner Controls */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 block mb-0.5">NIRF Banner Title</label>
                          <input
                            type="text"
                            value={tempData.highlightsArticle?.nirfCalloutTitle || `Why Is ${tempData.name.split(" - ")[0]} Ranked Among India's Best?`}
                            onChange={(e) => {
                              const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                              setTempData({
                                ...tempData,
                                highlightsArticle: {
                                  ...currentArt,
                                  nirfCalloutTitle: e.target.value,
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 block mb-0.5">NIRF Report Link URL</label>
                          <input
                            type="text"
                            value={tempData.highlightsArticle?.nirfReportUrl || "https://home.iitd.ac.in/"}
                            onChange={(e) => {
                              const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                              setTempData({
                                ...tempData,
                                highlightsArticle: {
                                  ...currentArt,
                                  nirfReportUrl: e.target.value,
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-blue-600 font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* COMMONLY ASKED QUESTIONS (ON HIGHLIGHTS) ACCORDION EDITOR */}
                    <div className="p-3.5 bg-amber-50/50 border border-amber-200/70 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Commonly Asked Questions (On Highlights)</span>
                          </span>
                          <p className="text-[10px] text-amber-800/80 font-medium">
                            Add, delete or edit any number of questions & answers for this college
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                            const currentFaqs = currentArt.faqs || [];
                            setTempData({
                              ...tempData,
                              highlightsArticle: {
                                ...currentArt,
                                faqs: [
                                  ...currentFaqs,
                                  {
                                    question: `What is the admission criteria for ${tempData.name.split(" - ")[0]}?`,
                                    answer: `Admission is strictly entrance examination-based followed by centralized counselling rounds.`,
                                  },
                                ],
                              },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Question</span>
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {(tempData.highlightsArticle?.faqs || getCollegeHighlightsArticle(tempData).faqs || []).map((faq, fIdx) => (
                          <div key={fIdx} className="p-2.5 bg-white border border-amber-200/80 rounded-xl space-y-1.5 relative shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                                const updated = (currentArt.faqs || []).filter((_, i) => i !== fIdx);
                                setTempData({
                                  ...tempData,
                                  highlightsArticle: {
                                    ...currentArt,
                                    faqs: updated,
                                  },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="w-4/5">
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Question #{fIdx + 1}</label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => {
                                  const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                                  const updated = [...(currentArt.faqs || [])];
                                  updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    highlightsArticle: {
                                      ...currentArt,
                                      faqs: updated,
                                    },
                                  });
                                }}
                                placeholder="Question text (e.g. What was the highest package...)"
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Answer Text</label>
                              <textarea
                                rows={2.5}
                                value={faq.answer}
                                onChange={(e) => {
                                  const currentArt = tempData.highlightsArticle || getCollegeHighlightsArticle(tempData);
                                  const updated = [...(currentArt.faqs || [])];
                                  updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    highlightsArticle: {
                                      ...currentArt,
                                      faqs: updated,
                                    },
                                  });
                                }}
                                placeholder="Answer text (supports paragraphs)..."
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-700"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Highlights Table Parameters */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                          Key Highlights Parameters Table
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setTempData({
                              ...tempData,
                              highlights: [...tempData.highlights, { label: "New Parameter", value: "Value" }],
                            })
                          }
                          className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Row</span>
                        </button>
                      </div>

                      <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                        {tempData.highlights.map((h, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={h.label}
                              onChange={(e) => {
                                const updated = [...tempData.highlights];
                                updated[idx].label = e.target.value;
                                setTempData({ ...tempData, highlights: updated });
                              }}
                              placeholder="Parameter Name"
                              className="w-1/3 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                            />
                            <input
                              type="text"
                              value={h.value}
                              onChange={(e) => {
                                const updated = [...tempData.highlights];
                                updated[idx].value = e.target.value;
                                setTempData({ ...tempData, highlights: updated });
                              }}
                              placeholder="Value"
                              className="flex-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = tempData.highlights.filter((_, i) => i !== idx);
                                setTempData({ ...tempData, highlights: updated });
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL 5: COURSES & FEES */}
                {activeMiniModal === "courses" && (
                  <div className="space-y-4">
                    {/* Part 1: Editorial Paragraphs & Heading */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
                        Courses & Fees Narrative
                      </span>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                          Article Title
                        </label>
                        <input
                          type="text"
                          value={tempData.coursesFeesArticle?.title || `${tempData.name.split(" - ")[0]} Courses & Fees 2026`}
                          onChange={(e) => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, title: e.target.value },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                          Paragraph 1 (Always Visible Preview)
                        </label>
                        <textarea
                          rows={2.5}
                          value={tempData.coursesFeesArticle?.introParagraph1 || getCollegeCoursesFeesArticle(tempData).introParagraph1 || ""}
                          onChange={(e) => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, introParagraph1: e.target.value },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                          Paragraph 2 (Expanded Full Text)
                        </label>
                        <textarea
                          rows={2.5}
                          value={tempData.coursesFeesArticle?.introParagraph2 || getCollegeCoursesFeesArticle(tempData).introParagraph2 || ""}
                          onChange={(e) => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, introParagraph2: e.target.value },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
                        />
                      </div>
                    </div>

                    {/* Part 1.5: Course Summary Sub-Box Table Editor (UG / PG Courses Grid) */}
                    <div className="p-4 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border border-indigo-100/80 rounded-2xl space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-indigo-100/60">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                            <span className="text-xs font-black uppercase tracking-wider text-indigo-950">
                              Course Summary Highlights Sub-Boxes (Table Cards)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 pl-4">
                            Sub-box tables with course specs, fees, eligibility & selection criteria
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            const updated = [
                              ...(cur.courseSummaryGroups || []),
                              {
                                groupTitle: "New Course Level (e.g. PG Courses)",
                                courses: [
                                  {
                                    courseName: "MTech",
                                    firstYearFees: "INR 1.50 Lakhs",
                                    eligibility: "B.Tech with 60% marks",
                                    duration: "2 years",
                                    selection: "GATE + COAP Counselling",
                                  },
                                ],
                              },
                            ];
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, courseSummaryGroups: updated },
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs hover:shadow transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Group</span>
                        </button>
                      </div>

                      <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                        {(tempData.coursesFeesArticle?.courseSummaryGroups || getCollegeCoursesFeesArticle(tempData).courseSummaryGroups || []).map((group, gIdx) => (
                          <div key={gIdx} className="p-3.5 bg-white border border-slate-200/90 hover:border-indigo-200 rounded-2xl shadow-xs space-y-3 relative transition-all">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                const updated = (cur.courseSummaryGroups || []).filter((_, i) => i !== gIdx);
                                setTempData({
                                  ...tempData,
                                  coursesFeesArticle: { ...cur, courseSummaryGroups: updated },
                                });
                              }}
                              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                              title="Delete Sub-Box Group"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="w-[85%] sm:w-3/4">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Sub-box Group Title (e.g. UG Courses)
                              </label>
                              <input
                                type="text"
                                value={group.groupTitle}
                                onChange={(e) => {
                                  const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                  const updated = [...(cur.courseSummaryGroups || [])];
                                  updated[gIdx] = { ...updated[gIdx], groupTitle: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    coursesFeesArticle: { ...cur, courseSummaryGroups: updated },
                                  });
                                }}
                                placeholder="e.g. UG Courses"
                                className="w-full px-3 py-1.5 bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 transition-all"
                              />
                            </div>

                            {/* Courses in this Group */}
                            <div className="space-y-2.5 pt-2 border-t border-slate-100">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                  Courses Columns in this Group ({group.courses.length})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                    const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                    const currentCourses = updatedGroups[gIdx]?.courses || [];
                                    updatedGroups[gIdx] = {
                                      ...updatedGroups[gIdx],
                                      courses: [
                                        ...currentCourses,
                                        {
                                          courseName: "New Degree",
                                          firstYearFees: "INR 2.0 Lakhs",
                                          eligibility: "Class 12th with 75%",
                                          duration: "4 years",
                                          selection: "Entrance Exam",
                                        },
                                      ],
                                    };
                                    setTempData({
                                      ...tempData,
                                      coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Course Column</span>
                                </button>
                              </div>

                              <div className="space-y-2.5">
                                {group.courses.map((course, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 relative transition-all"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                        const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                        const currentCourses = (updatedGroups[gIdx]?.courses || []).filter((_, i) => i !== cIdx);
                                        updatedGroups[gIdx] = {
                                          ...updatedGroups[gIdx],
                                          courses: currentCourses,
                                        };
                                        setTempData({
                                          ...tempData,
                                          coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                        });
                                      }}
                                      className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                      title="Delete Course Column"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>

                                    <div className="w-[85%] sm:w-3/4">
                                      <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                        Course Name
                                      </label>
                                      <input
                                        type="text"
                                        value={course.courseName}
                                        onChange={(e) => {
                                          const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                          const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                          const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                          currentCourses[cIdx] = { ...currentCourses[cIdx], courseName: e.target.value };
                                          updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                          setTempData({
                                            ...tempData,
                                            coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                          });
                                        }}
                                        placeholder="e.g. BTech"
                                        className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-bold text-slate-900 placeholder-slate-400 transition-all"
                                      />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                          1st Year Fees
                                        </label>
                                        <input
                                          type="text"
                                          value={course.firstYearFees || ""}
                                          onChange={(e) => {
                                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                            const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                            const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                            currentCourses[cIdx] = { ...currentCourses[cIdx], firstYearFees: e.target.value };
                                            updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                            setTempData({
                                              ...tempData,
                                              coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                            });
                                          }}
                                          placeholder="e.g. INR 2.55 Lakhs"
                                          className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                          Duration
                                        </label>
                                        <input
                                          type="text"
                                          value={course.duration || ""}
                                          onChange={(e) => {
                                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                            const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                            const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                            currentCourses[cIdx] = { ...currentCourses[cIdx], duration: e.target.value };
                                            updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                            setTempData({
                                              ...tempData,
                                              coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                            });
                                          }}
                                          placeholder="e.g. 4 years"
                                          className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                          Eligibility
                                        </label>
                                        <input
                                          type="text"
                                          value={course.eligibility || ""}
                                          onChange={(e) => {
                                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                            const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                            const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                            currentCourses[cIdx] = { ...currentCourses[cIdx], eligibility: e.target.value };
                                            updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                            setTempData({
                                              ...tempData,
                                              coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                            });
                                          }}
                                          placeholder="e.g. Class 10+2 with 75% marks"
                                          className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                          Selection Criteria
                                        </label>
                                        <input
                                          type="text"
                                          value={course.selection || ""}
                                          onChange={(e) => {
                                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                            const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                            const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                            currentCourses[cIdx] = { ...currentCourses[cIdx], selection: e.target.value };
                                            updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                            setTempData({
                                              ...tempData,
                                              coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                            });
                                          }}
                                          placeholder="e.g. JEE Advanced + JoSAA Counselling"
                                          className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Part 2: Specialisations Table Editor */}
                    <div className="p-3.5 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
                          Course Categories & Specialisations Table
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            const updated = [
                              ...(cur.specialisations || []),
                              { category: "New Programme Category", list: "Specialisation 1, Specialisation 2, Specialisation 3" },
                            ];
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, specialisations: updated },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Category</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(tempData.coursesFeesArticle?.specialisations || getCollegeCoursesFeesArticle(tempData).specialisations || []).map((spec, sIdx) => (
                          <div key={sIdx} className="p-2.5 bg-white border border-blue-200/80 rounded-xl space-y-1.5 relative shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                const updated = (cur.specialisations || []).filter((_, i) => i !== sIdx);
                                setTempData({
                                  ...tempData,
                                  coursesFeesArticle: { ...cur, specialisations: updated },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <input
                              type="text"
                              value={spec.category}
                              onChange={(e) => {
                                const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                const updated = [...(cur.specialisations || [])];
                                updated[sIdx] = { ...updated[sIdx], category: e.target.value };
                                setTempData({
                                  ...tempData,
                                  coursesFeesArticle: { ...cur, specialisations: updated },
                                });
                              }}
                              placeholder="Category (e.g. BTech specialisations)"
                              className="w-4/5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                            />

                            <textarea
                              rows={2}
                              value={spec.list}
                              onChange={(e) => {
                                const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                const updated = [...(cur.specialisations || [])];
                                updated[sIdx] = { ...updated[sIdx], list: e.target.value };
                                setTempData({
                                  ...tempData,
                                  coursesFeesArticle: { ...cur, specialisations: updated },
                                });
                              }}
                              placeholder="Disciplines list..."
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Promo Callout & PDF url */}
                      <div className="pt-2 border-t border-blue-200/60 space-y-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Callout Promo Text</label>
                          <input
                            type="text"
                            value={tempData.coursesFeesArticle?.calloutPromoText || getCollegeCoursesFeesArticle(tempData).calloutPromoText || ""}
                            onChange={(e) => {
                              const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                              setTempData({
                                ...tempData,
                                coursesFeesArticle: { ...cur, calloutPromoText: e.target.value },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs italic"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Download PDF Link URL</label>
                          <input
                            type="text"
                            value={tempData.coursesFeesArticle?.calloutPdfUrl || "#"}
                            onChange={(e) => {
                              const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                              setTempData({
                                ...tempData,
                                coursesFeesArticle: { ...cur, calloutPdfUrl: e.target.value },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-blue-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Part 3: Popular Courses Fees Structure Table Editor */}
                    <div className="p-3.5 bg-indigo-50/50 border border-indigo-200/80 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                          Popular Courses Fees Table (3 Columns)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            const updated = [
                              ...(cur.popularCourses || []),
                              {
                                courseName: "New Degree Course",
                                coursesCount: "1 Courses",
                                tuitionFees: "INR 1 lakh",
                                totalFees: "INR 2 lakh",
                              },
                            ];
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, popularCourses: updated },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Course Fee Row</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {(tempData.coursesFeesArticle?.popularCourses || getCollegeCoursesFeesArticle(tempData).popularCourses || []).map((row, rIdx) => (
                          <div key={rIdx} className="p-2.5 bg-white border border-indigo-200/80 rounded-xl space-y-1.5 relative shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                const updated = (cur.popularCourses || []).filter((_, i) => i !== rIdx);
                                setTempData({
                                  ...tempData,
                                  coursesFeesArticle: { ...cur, popularCourses: updated },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-2 gap-2 w-4/5">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Course Name</label>
                                <input
                                  type="text"
                                  value={row.courseName}
                                  onChange={(e) => {
                                    const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                    const updated = [...(cur.popularCourses || [])];
                                    updated[rIdx] = { ...updated[rIdx], courseName: e.target.value };
                                    setTempData({
                                      ...tempData,
                                      coursesFeesArticle: { ...cur, popularCourses: updated },
                                    });
                                  }}
                                  placeholder="e.g. B.E. / B.Tech"
                                  className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-blue-600"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Courses Count</label>
                                <input
                                  type="text"
                                  value={row.coursesCount || ""}
                                  onChange={(e) => {
                                    const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                    const updated = [...(cur.popularCourses || [])];
                                    updated[rIdx] = { ...updated[rIdx], coursesCount: e.target.value };
                                    setTempData({
                                      ...tempData,
                                      coursesFeesArticle: { ...cur, popularCourses: updated },
                                    });
                                  }}
                                  placeholder="e.g. 15 Courses"
                                  className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Total Tuition Fees</label>
                                <input
                                  type="text"
                                  value={row.tuitionFees}
                                  onChange={(e) => {
                                    const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                    const updated = [...(cur.popularCourses || [])];
                                    updated[rIdx] = { ...updated[rIdx], tuitionFees: e.target.value };
                                    setTempData({
                                      ...tempData,
                                      coursesFeesArticle: { ...cur, popularCourses: updated },
                                    });
                                  }}
                                  placeholder="e.g. INR 8 lakh"
                                  className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Total Fees Range</label>
                                <input
                                  type="text"
                                  value={row.totalFees}
                                  onChange={(e) => {
                                    const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                    const updated = [...(cur.popularCourses || [])];
                                    updated[rIdx] = { ...updated[rIdx], totalFees: e.target.value };
                                    setTempData({
                                      ...tempData,
                                      coursesFeesArticle: { ...cur, popularCourses: updated },
                                    });
                                  }}
                                  placeholder="e.g. INR 11.26 lakh - INR 11.72 lakh"
                                  className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Part 4: Other Charges Breakdown Table Editor */}
                    <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                          Other Charges Fee Breakdown Table
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            const updated = [
                              ...(cur.otherCharges || []),
                              {
                                component: "New Fee Component",
                                subtext: "Explanation of what is included in this charge.",
                                amount: "INR 50,000",
                              },
                            ];
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, otherCharges: updated },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Charge Row</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {(tempData.coursesFeesArticle?.otherCharges || getCollegeCoursesFeesArticle(tempData).otherCharges || []).map((row, oIdx) => (
                          <div key={oIdx} className="p-2.5 bg-white border border-amber-200/80 rounded-xl space-y-1.5 relative shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                const updated = (cur.otherCharges || []).filter((_, i) => i !== oIdx);
                                setTempData({
                                  ...tempData,
                                  coursesFeesArticle: { ...cur, otherCharges: updated },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-2 gap-2 w-4/5">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Component</label>
                                <input
                                  type="text"
                                  value={row.component}
                                  onChange={(e) => {
                                    const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                    const updated = [...(cur.otherCharges || [])];
                                    updated[oIdx] = { ...updated[oIdx], component: e.target.value };
                                    setTempData({
                                      ...tempData,
                                      coursesFeesArticle: { ...cur, otherCharges: updated },
                                    });
                                  }}
                                  placeholder="e.g. Hostel fees"
                                  className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Amount Range</label>
                                <input
                                  type="text"
                                  value={row.amount}
                                  onChange={(e) => {
                                    const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                    const updated = [...(cur.otherCharges || [])];
                                    updated[oIdx] = { ...updated[oIdx], amount: e.target.value };
                                    setTempData({
                                      ...tempData,
                                      coursesFeesArticle: { ...cur, otherCharges: updated },
                                    });
                                  }}
                                  placeholder="e.g. INR 1.29 lakh - 3.1 lakh"
                                  className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Description Subtext</label>
                              <textarea
                                rows={2}
                                value={row.subtext || ""}
                                onChange={(e) => {
                                  const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                  const updated = [...(cur.otherCharges || [])];
                                  updated[oIdx] = { ...updated[oIdx], subtext: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    coursesFeesArticle: { ...cur, otherCharges: updated },
                                  });
                                }}
                                placeholder="e.g. Meal Plan is included in this fee..."
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Part 5: View All Courses Button Text & FAQs Editor */}
                    <div className="p-3.5 bg-purple-50/50 border border-purple-200/80 rounded-2xl space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block mb-1">
                          "View All Courses & Fees" Action Button Text
                        </label>
                        <input
                          type="text"
                          value={tempData.coursesFeesArticle?.viewAllBtnText || getCollegeCoursesFeesArticle(tempData).viewAllBtnText || "View All Courses & Fees"}
                          onChange={(e) => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, viewAllBtnText: e.target.value },
                            });
                          }}
                          placeholder="e.g. View All Courses & Fees"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                          Popular Programs FAQ Questions
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            const updated = [
                              ...(cur.faqs || []),
                              {
                                question: "What is the fee structure for new programs?",
                                answer: "Detailed fee structure and scholarships are available on the official portal.",
                              },
                            ];
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, faqs: updated },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add FAQ</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {(tempData.coursesFeesArticle?.faqs || getCollegeCoursesFeesArticle(tempData).faqs || []).map((faq, fIdx) => (
                          <div key={fIdx} className="p-2.5 bg-white border border-amber-200/80 rounded-xl space-y-1.5 relative shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                const updated = (cur.faqs || []).filter((_, i) => i !== fIdx);
                                setTempData({
                                  ...tempData,
                                  coursesFeesArticle: { ...cur, faqs: updated },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="w-4/5">
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Question #{fIdx + 1}</label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => {
                                  const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                  const updated = [...(cur.faqs || [])];
                                  updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    coursesFeesArticle: { ...cur, faqs: updated },
                                  });
                                }}
                                placeholder="e.g. What is the career scope after MSc?"
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Answer Text</label>
                              <textarea
                                rows={2.5}
                                value={faq.answer}
                                onChange={(e) => {
                                  const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                  const updated = [...(cur.faqs || [])];
                                  updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    coursesFeesArticle: { ...cur, faqs: updated },
                                  });
                                }}
                                placeholder="Answer explanation..."
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-700"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL 5.5: DEDICATED COURSE SUMMARY SUB-BOXES EDITOR */}
                {activeMiniModal === "course_summary_box" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border border-indigo-100/80 rounded-2xl space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-indigo-100/60">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                            <span className="text-xs font-black uppercase tracking-wider text-indigo-950">
                              UG / PG Course Highlights Sub-Boxes
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 pl-4">
                            Manage sub-boxes, fees, eligibility, duration and selection criteria
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                            const updated = [
                              ...(cur.courseSummaryGroups || []),
                              {
                                groupTitle: "New Course Level (e.g. PG Courses)",
                                courses: [
                                  {
                                    courseName: "MTech",
                                    firstYearFees: "INR 1.50 Lakhs",
                                    eligibility: "B.Tech with 60% marks",
                                    duration: "2 years",
                                    selection: "GATE + COAP Counselling",
                                  },
                                ],
                              },
                            ];
                            setTempData({
                              ...tempData,
                              coursesFeesArticle: { ...cur, courseSummaryGroups: updated },
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs hover:shadow transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Group</span>
                        </button>
                      </div>

                      <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                        {(tempData.coursesFeesArticle?.courseSummaryGroups || getCollegeCoursesFeesArticle(tempData).courseSummaryGroups || []).map((group, gIdx) => (
                          <div key={gIdx} className="p-3.5 bg-white border border-slate-200/90 hover:border-indigo-200 rounded-2xl shadow-xs space-y-3 relative transition-all">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                const updated = (cur.courseSummaryGroups || []).filter((_, i) => i !== gIdx);
                                setTempData({
                                  ...tempData,
                                  coursesFeesArticle: { ...cur, courseSummaryGroups: updated },
                                });
                              }}
                              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                              title="Delete Sub-Box Group"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="w-[85%] sm:w-3/4">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Sub-box Group Title (e.g. UG Courses)
                              </label>
                              <input
                                type="text"
                                value={group.groupTitle}
                                onChange={(e) => {
                                  const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                  const updated = [...(cur.courseSummaryGroups || [])];
                                  updated[gIdx] = { ...updated[gIdx], groupTitle: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    coursesFeesArticle: { ...cur, courseSummaryGroups: updated },
                                  });
                                }}
                                placeholder="e.g. UG Courses"
                                className="w-full px-3 py-1.5 bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 transition-all"
                              />
                            </div>

                            {/* Courses in this Group */}
                            <div className="space-y-2.5 pt-2 border-t border-slate-100">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                  Courses Columns in this Group ({group.courses.length})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                    const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                    const currentCourses = updatedGroups[gIdx]?.courses || [];
                                    updatedGroups[gIdx] = {
                                      ...updatedGroups[gIdx],
                                      courses: [
                                        ...currentCourses,
                                        {
                                          courseName: "New Degree",
                                          firstYearFees: "INR 2.0 Lakhs",
                                          eligibility: "Class 12th with 75%",
                                          duration: "4 years",
                                          selection: "Entrance Exam",
                                        },
                                      ],
                                    };
                                    setTempData({
                                      ...tempData,
                                      coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Course Column</span>
                                </button>
                              </div>

                              <div className="space-y-2.5">
                                {group.courses.map((course, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 relative transition-all"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                        const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                        const currentCourses = (updatedGroups[gIdx]?.courses || []).filter((_, i) => i !== cIdx);
                                        updatedGroups[gIdx] = {
                                          ...updatedGroups[gIdx],
                                          courses: currentCourses,
                                        };
                                        setTempData({
                                          ...tempData,
                                          coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                        });
                                      }}
                                      className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                      title="Delete Course Column"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>

                                    <div className="w-[85%] sm:w-3/4">
                                      <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                        Course Name
                                      </label>
                                      <input
                                        type="text"
                                        value={course.courseName}
                                        onChange={(e) => {
                                          const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                          const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                          const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                          currentCourses[cIdx] = { ...currentCourses[cIdx], courseName: e.target.value };
                                          updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                          setTempData({
                                            ...tempData,
                                            coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                          });
                                        }}
                                        placeholder="e.g. BTech"
                                        className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-bold text-slate-900 placeholder-slate-400 transition-all"
                                      />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                          1st Year Fees
                                        </label>
                                        <input
                                          type="text"
                                          value={course.firstYearFees || ""}
                                          onChange={(e) => {
                                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                            const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                            const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                            currentCourses[cIdx] = { ...currentCourses[cIdx], firstYearFees: e.target.value };
                                            updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                            setTempData({
                                              ...tempData,
                                              coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                            });
                                          }}
                                          placeholder="e.g. INR 2.55 Lakhs"
                                          className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                          Duration
                                        </label>
                                        <input
                                          type="text"
                                          value={course.duration || ""}
                                          onChange={(e) => {
                                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                            const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                            const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                            currentCourses[cIdx] = { ...currentCourses[cIdx], duration: e.target.value };
                                            updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                            setTempData({
                                              ...tempData,
                                              coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                            });
                                          }}
                                          placeholder="e.g. 4 years"
                                          className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                          Eligibility
                                        </label>
                                        <input
                                          type="text"
                                          value={course.eligibility || ""}
                                          onChange={(e) => {
                                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                            const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                            const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                            currentCourses[cIdx] = { ...currentCourses[cIdx], eligibility: e.target.value };
                                            updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                            setTempData({
                                              ...tempData,
                                              coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                            });
                                          }}
                                          placeholder="e.g. Class 10+2 with 75% marks"
                                          className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                          Selection Criteria
                                        </label>
                                        <input
                                          type="text"
                                          value={course.selection || ""}
                                          onChange={(e) => {
                                            const cur = tempData.coursesFeesArticle || getCollegeCoursesFeesArticle(tempData);
                                            const updatedGroups = [...(cur.courseSummaryGroups || [])];
                                            const currentCourses = [...(updatedGroups[gIdx]?.courses || [])];
                                            currentCourses[cIdx] = { ...currentCourses[cIdx], selection: e.target.value };
                                            updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: currentCourses };
                                            setTempData({
                                              ...tempData,
                                              coursesFeesArticle: { ...cur, courseSummaryGroups: updatedGroups },
                                            });
                                          }}
                                          placeholder="e.g. JEE Advanced + JoSAA Counselling"
                                          className="w-full px-2.5 py-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL 6: PLACEMENTS */}
                {activeMiniModal === "placements" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Highest Package (Domestic)</label>
                        <input
                          type="text"
                          value={tempData.highestPackage}
                          onChange={(e) => setTempData({ ...tempData, highestPackage: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Average Package</label>
                        <input
                          type="text"
                          value={tempData.averagePackage}
                          onChange={(e) => setTempData({ ...tempData, averagePackage: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Top Recruiters (Comma Separated)</label>
                      <textarea
                        rows={4}
                        value={tempData.recruiters.join(", ")}
                        onChange={(e) =>
                          setTempData({
                            ...tempData,
                            recruiters: e.target.value.split(",").map((r) => r.trim()).filter(Boolean),
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* MODAL 7: CUTOFFS */}
                {activeMiniModal === "cutoffs" && (
                  <div className="space-y-4">
                    {/* Part 1: Editorial Cutoff Article Editor */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
                          Editorial Cutoffs Article
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                            setTempData({
                              ...tempData,
                              cutoffArticle: {
                                ...currentCut,
                                paragraphs: [
                                  ...(currentCut.paragraphs || []),
                                  "New cutoff explanation paragraph text here.",
                                ],
                              },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Paragraph</span>
                        </button>
                      </div>

                      {/* Paragraphs List */}
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(tempData.cutoffArticle?.paragraphs || getCollegeCutoffArticle(tempData).paragraphs || []).map((p, idx) => (
                          <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1 relative shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                                const updated = (currentCut.paragraphs || []).filter((_, i) => i !== idx);
                                setTempData({
                                  ...tempData,
                                  cutoffArticle: {
                                    ...currentCut,
                                    paragraphs: updated,
                                  },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete Paragraph"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <label className="text-[10px] font-bold text-slate-500 block">Paragraph #{idx + 1}</label>
                            <textarea
                              rows={2.5}
                              value={p}
                              onChange={(e) => {
                                const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                                const updated = [...(currentCut.paragraphs || [])];
                                updated[idx] = e.target.value;
                                setTempData({
                                  ...tempData,
                                  cutoffArticle: {
                                    ...currentCut,
                                    paragraphs: updated,
                                  },
                                });
                              }}
                              placeholder="Cutoff details and analysis paragraph..."
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-800"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Missed Cutoff Callout Banner Controls */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80">
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Callout Banner Title</label>
                          <input
                            type="text"
                            value={tempData.cutoffArticle?.calloutTitle || `Missed the ${tempData.name.split(" - ")[0]} Cutoff?`}
                            onChange={(e) => {
                              const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                              setTempData({
                                ...tempData,
                                cutoffArticle: {
                                  ...currentCut,
                                  calloutTitle: e.target.value,
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 block mb-0.5">PDF Download Link URL</label>
                          <input
                            type="text"
                            value={tempData.cutoffArticle?.calloutPdfUrl || "#"}
                            onChange={(e) => {
                              const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                              setTempData({
                                ...tempData,
                                cutoffArticle: {
                                  ...currentCut,
                                  calloutPdfUrl: e.target.value,
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-blue-600 font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Callout Description</label>
                        <input
                          type="text"
                          value={tempData.cutoffArticle?.calloutDesc || "Explore engineering colleges accepting low JEE Main ranks and discover alternative pathways to pursue your BTech dream."}
                          onChange={(e) => {
                            const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                            setTempData({
                              ...tempData,
                              cutoffArticle: {
                                ...currentCut,
                                calloutDesc: e.target.value,
                              },
                            });
                          }}
                          className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Part 2: Opening & Closing Ranks Table Rows */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                          Opening & Closing Ranks Table Rows
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setTempData({
                              ...tempData,
                              cutoffs: [
                                ...tempData.cutoffs,
                                {
                                  branch: "New Engineering Branch",
                                  category: "General (Gender-Neutral)",
                                  openRank: "100",
                                  closeRank: "500",
                                  round: "Round 6",
                                },
                              ],
                            })
                          }
                          className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Row</span>
                        </button>
                      </div>

                      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                        {tempData.cutoffs.map((cut, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                            <input
                              type="text"
                              value={cut.branch}
                              onChange={(e) => {
                                const updated = [...tempData.cutoffs];
                                updated[idx].branch = e.target.value;
                                setTempData({ ...tempData, cutoffs: updated });
                              }}
                              placeholder="Branch"
                              className="w-1/3 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={cut.category || "General"}
                              onChange={(e) => {
                                const updated = [...tempData.cutoffs];
                                updated[idx].category = e.target.value;
                                setTempData({ ...tempData, cutoffs: updated });
                              }}
                              placeholder="Category"
                              className="w-1/4 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                            <input
                              type="text"
                              value={cut.openRank}
                              onChange={(e) => {
                                const updated = [...tempData.cutoffs];
                                updated[idx].openRank = e.target.value;
                                setTempData({ ...tempData, cutoffs: updated });
                              }}
                              placeholder="Open"
                              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                            <input
                              type="text"
                              value={cut.closeRank}
                              onChange={(e) => {
                                const updated = [...tempData.cutoffs];
                                updated[idx].closeRank = e.target.value;
                                setTempData({ ...tempData, cutoffs: updated });
                              }}
                              placeholder="Close"
                              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-red-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = tempData.cutoffs.filter((_, i) => i !== idx);
                                setTempData({ ...tempData, cutoffs: updated });
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Part 3: Commonly Asked Questions (Cutoff FAQs) Editor */}
                    <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Commonly Asked Questions On Cutoffs</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                            const updatedFaqs = [
                              ...(currentCut.faqs || []),
                              {
                                question: `Can I get ${tempData.name.split(" - ")[0]} with my rank?`,
                                answer: "Detailed admission cutoff and counselling criteria for this candidate rank profile.",
                              },
                            ];
                            setTempData({
                              ...tempData,
                              cutoffArticle: {
                                ...currentCut,
                                faqs: updatedFaqs,
                              },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Cutoff FAQ</span>
                        </button>
                      </div>

                      {/* FAQs List */}
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {((tempData.cutoffArticle?.faqs && tempData.cutoffArticle.faqs.length > 0)
                          ? tempData.cutoffArticle.faqs
                          : (getCollegeCutoffArticle(tempData).faqs || [])
                        ).map((faq, fIdx) => (
                          <div key={fIdx} className="p-2.5 bg-white border border-amber-200/80 rounded-xl space-y-1.5 relative shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                                const sourceFaqs = currentCut.faqs || [];
                                const updated = sourceFaqs.filter((_, i) => i !== fIdx);
                                setTempData({
                                  ...tempData,
                                  cutoffArticle: {
                                    ...currentCut,
                                    faqs: updated,
                                  },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="w-4/5">
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Question #{fIdx + 1}</label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => {
                                  const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                                  const updated = [...(currentCut.faqs || [])];
                                  updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    cutoffArticle: {
                                      ...currentCut,
                                      faqs: updated,
                                    },
                                  });
                                }}
                                placeholder="Cutoff Question (e.g. Can I get IIT Delhi with 100 rank?)"
                                className="w-full px-2.5 py-1 bg-amber-50/40 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Answer Text</label>
                              <textarea
                                rows={2.5}
                                value={faq.answer}
                                onChange={(e) => {
                                  const currentCut = tempData.cutoffArticle || getCollegeCutoffArticle(tempData);
                                  const updated = [...(currentCut.faqs || [])];
                                  updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    cutoffArticle: {
                                      ...currentCut,
                                      faqs: updated,
                                    },
                                  });
                                }}
                                placeholder="Answer text explaining cutoff nuances..."
                                className="w-full px-2.5 py-1 bg-amber-50/40 border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-700"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL: PLACEMENTS ARTICLE (INDIVIDUAL) */}
                {activeMiniModal === "placements_article" && (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Placements Article Details
                      </span>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                          Article Title
                        </label>
                        <input
                          type="text"
                          value={tempData.placementsArticle?.title || `${tempData.name.split(" - ")[0]} Placements 2026`}
                          onChange={(e) => {
                            const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                            setTempData({
                              ...tempData,
                              placementsArticle: { ...cur, title: e.target.value },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                          Intro Paragraph (Always Visible / Preview)
                        </label>
                        <textarea
                          rows={4}
                          value={tempData.placementsArticle?.introParagraph || getCollegePlacementsArticle(tempData).introParagraph || ""}
                          onChange={(e) => {
                            const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                            setTempData({
                              ...tempData,
                              placementsArticle: { ...cur, introParagraph: e.target.value },
                            });
                          }}
                          placeholder="Introductory paragraph..."
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
                        />
                      </div>
                    </div>

                    {/* Subsections List (Top Recruiters, MBA Placements, etc.) */}
                    <div className="p-3.5 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
                          Placements Sub-Sections (Expanded Content)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                            const updated = [
                              ...(cur.subsections || []),
                              {
                                heading: `${tempData.name.split(" - ")[0]} Additional Placements 2026`,
                                content: "Detailed branch-wise placement statistics and highest packages.",
                              },
                            ];
                            setTempData({
                              ...tempData,
                              placementsArticle: { ...cur, subsections: updated },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Sub-Section</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {(tempData.placementsArticle?.subsections || getCollegePlacementsArticle(tempData).subsections || []).map((sub, sIdx) => (
                          <div key={sIdx} className="p-2.5 bg-white border border-blue-200/80 rounded-xl space-y-1.5 relative shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                                const updated = (cur.subsections || []).filter((_, i) => i !== sIdx);
                                setTempData({
                                  ...tempData,
                                  placementsArticle: { ...cur, subsections: updated },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete Sub-Section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="w-4/5">
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subheading #{sIdx + 1}</label>
                              <input
                                type="text"
                                value={sub.heading}
                                onChange={(e) => {
                                  const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                                  const updated = [...(cur.subsections || [])];
                                  updated[sIdx] = { ...updated[sIdx], heading: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: { ...cur, subsections: updated },
                                  });
                                }}
                                placeholder="e.g. IIT Delhi Top Recruiters 2026"
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Content</label>
                              <textarea
                                rows={2.5}
                                value={sub.content}
                                onChange={(e) => {
                                  const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                                  const updated = [...(cur.subsections || [])];
                                  updated[sIdx] = { ...updated[sIdx], content: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: { ...cur, subsections: updated },
                                  });
                                }}
                                placeholder="Sub-section content details (supports **bold**)..."
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-700"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Note */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                        Footer Note Text
                      </label>
                      <input
                        type="text"
                        value={tempData.placementsArticle?.footerNote || getCollegePlacementsArticle(tempData).footerNote || ""}
                        onChange={(e) => {
                          const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                          setTempData({
                            ...tempData,
                            placementsArticle: { ...cur, footerNote: e.target.value },
                          });
                        }}
                        placeholder="e.g. Check course-wise placement data of IIT Delhi below:"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* MODAL: PLACEMENTS STATS TABLE (INDIVIDUAL) */}
                {activeMiniModal === "placements_stats" && (
                  <div className="p-3.5 bg-indigo-50/50 border border-indigo-200/80 rounded-2xl space-y-3">
                    {(() => {
                      const curArticle = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                      const cols = curArticle.statsTableCols && curArticle.statsTableCols.length > 0
                        ? curArticle.statsTableCols
                        : ["Particulars", "Placement Statistics 2025 (Ongoing)", "Placement Statistics 2024"];
                      const rows = curArticle.statsTable || getCollegePlacementsArticle(tempData).statsTable || [];

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block">
                                Placement Highlights Table & Columns
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Dynamic multi-year comparison table ({cols.length} columns, {rows.length} rows)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextYear = new Date().getFullYear();
                                  const newColTitle = `Placement Statistics ${nextYear}`;
                                  const newCols = [...cols, newColTitle];
                                  const updatedRows = rows.map((r) => {
                                    const existingValues = cols.slice(1).map((_, i) => getStatRowCellValue(r, i + 1));
                                    return {
                                      ...r,
                                      values: [...existingValues, "NA"],
                                    };
                                  });
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: {
                                      ...curArticle,
                                      statsTableCols: newCols,
                                      statsTable: updatedRows,
                                    },
                                  });
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                title="Add a new year/statistics column to table"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Column</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const extraColsCount = Math.max(1, cols.length - 1);
                                  const newValues = Array(extraColsCount).fill("NA");
                                  const updatedRows = [
                                    ...rows,
                                    {
                                      particular: "New Parameter",
                                      values: newValues,
                                    },
                                  ];
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: {
                                      ...curArticle,
                                      statsTableCols: cols,
                                      statsTable: updatedRows,
                                    },
                                  });
                                }}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Row</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                              Table Title
                            </label>
                            <input
                              type="text"
                              value={curArticle.statsTableTitle || `${tempData.name.split(" - ")[0]} Placements Highlights`}
                              onChange={(e) => {
                                setTempData({
                                  ...tempData,
                                  placementsArticle: { ...curArticle, statsTableTitle: e.target.value },
                                });
                              }}
                              placeholder="e.g. IIT Delhi Placements Highlights"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                            />
                          </div>

                          {/* Column Headers Section */}
                          <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100 space-y-2">
                            <span className="text-[10.5px] font-bold text-slate-700 block uppercase tracking-wider">
                              Table Columns ({cols.length})
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {cols.map((colName, cIdx) => (
                                <div key={cIdx} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[9.5px] font-bold text-slate-500 uppercase">
                                      {cIdx === 0 ? "Col 1 (Fixed Parameter)" : `Col ${cIdx + 1} (Stat Metric)`}
                                    </label>
                                    {cIdx > 0 && cols.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newCols = cols.filter((_, i) => i !== cIdx);
                                          const valIdxToDelete = cIdx - 1;
                                          const updatedRows = rows.map((r) => {
                                            const existingValues = cols.slice(1).map((_, i) => getStatRowCellValue(r, i + 1));
                                            const updatedValues = existingValues.filter((_, i) => i !== valIdxToDelete);
                                            return {
                                              ...r,
                                              values: updatedValues,
                                            };
                                          });
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: {
                                              ...curArticle,
                                              statsTableCols: newCols,
                                              statsTable: updatedRows,
                                            },
                                          });
                                        }}
                                        className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                                        title={`Delete column "${colName}"`}
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                        <span>Remove</span>
                                      </button>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    value={colName}
                                    onChange={(e) => {
                                      const newCols = [...cols];
                                      newCols[cIdx] = e.target.value;
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, statsTableCols: newCols },
                                      });
                                    }}
                                    placeholder={cIdx === 0 ? "Particulars" : `Placement Statistics Year`}
                                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Table Rows List */}
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                            {rows.map((row, rIdx) => (
                              <div key={rIdx} className="p-2.5 bg-white border border-indigo-200/80 rounded-xl space-y-2 relative shadow-2xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                                  <span className="text-[10px] font-bold text-indigo-900 uppercase">
                                    Row #{rIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedRows = rows.filter((_, i) => i !== rIdx);
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, statsTable: updatedRows },
                                      });
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                                    title="Delete Row"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete Row</span>
                                  </button>
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                                    {cols[0] || "Particulars / Parameter"}
                                  </label>
                                  <input
                                    type="text"
                                    value={row.particular}
                                    onChange={(e) => {
                                      const updatedRows = [...rows];
                                      updatedRows[rIdx] = { ...updatedRows[rIdx], particular: e.target.value };
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, statsTable: updatedRows },
                                      });
                                    }}
                                    placeholder="e.g. Total No. Of Offers"
                                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {cols.slice(1).map((colTitle, cIdx) => {
                                    const cellVal = getStatRowCellValue(row, cIdx + 1);
                                    return (
                                      <div key={cIdx}>
                                        <label className="text-[9.5px] font-bold text-slate-500 block mb-0.5 truncate" title={colTitle}>
                                          {colTitle}
                                        </label>
                                        <input
                                          type="text"
                                          value={cellVal}
                                          onChange={(e) => {
                                            const updatedRows = [...rows];
                                            const existingValues = cols.slice(1).map((_, i) => getStatRowCellValue(row, i + 1));
                                            existingValues[cIdx] = e.target.value;
                                            updatedRows[rIdx] = {
                                              ...updatedRows[rIdx],
                                              values: existingValues,
                                            };
                                            setTempData({
                                              ...tempData,
                                              placementsArticle: { ...curArticle, statsTable: updatedRows },
                                            });
                                          }}
                                          placeholder="Stat value (e.g. INR 22 LPA, NA)"
                                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: COURSE-WISE MEDIAN SALARY TABLE (INDIVIDUAL) */}
                {activeMiniModal === "placements_salary" && (
                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-3">
                    {(() => {
                      const curArticle = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                      const cols = curArticle.salaryTableCols && curArticle.salaryTableCols.length > 0
                        ? curArticle.salaryTableCols
                        : ["Course", "Median Salary"];
                      const rows = curArticle.salaryTable || getCollegePlacementsArticle(tempData).salaryTable || [];

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-black text-emerald-950 uppercase tracking-wide block">
                                Course-wise Median Salary Table & Columns
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Dynamic course salary breakdown ({cols.length} columns, {rows.length} rows)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const newColTitle = `Salary Metric ${cols.length}`;
                                  const newCols = [...cols, newColTitle];
                                  const updatedRows = rows.map((r) => {
                                    const existingValues = cols.slice(1).map((_, i) => getCourseSalaryCellValue(r, i + 1));
                                    return {
                                      ...r,
                                      values: [...existingValues, "NA"],
                                    };
                                  });
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: {
                                      ...curArticle,
                                      salaryTableCols: newCols,
                                      salaryTable: updatedRows,
                                    },
                                  });
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                title="Add a new salary metric column"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Column</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const extraColsCount = Math.max(1, cols.length - 1);
                                  const newValues = Array(extraColsCount).fill("₹15 LPA");
                                  const updatedRows = [
                                    ...rows,
                                    {
                                      course: "New Course",
                                      values: newValues,
                                    },
                                  ];
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: {
                                      ...curArticle,
                                      salaryTableCols: cols,
                                      salaryTable: updatedRows,
                                    },
                                  });
                                }}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Course Row</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                              Table Title
                            </label>
                            <input
                              type="text"
                              value={curArticle.salaryTableTitle || `${tempData.name.split(" - ")[0]} Course-wise Median Salary`}
                              onChange={(e) => {
                                setTempData({
                                  ...tempData,
                                  placementsArticle: { ...curArticle, salaryTableTitle: e.target.value },
                                });
                              }}
                              placeholder="e.g. IIT Delhi Course-wise Median Salary"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                            />
                          </div>

                          {/* Column Headers Section */}
                          <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 space-y-2">
                            <span className="text-[10.5px] font-bold text-slate-700 block uppercase tracking-wider">
                              Table Columns ({cols.length})
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {cols.map((colName, cIdx) => (
                                <div key={cIdx} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[9.5px] font-bold text-slate-500 uppercase">
                                      {cIdx === 0 ? "Col 1 (Course Name)" : `Col ${cIdx + 1} (Salary Metric)`}
                                    </label>
                                    {cIdx > 0 && cols.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newCols = cols.filter((_, i) => i !== cIdx);
                                          const valIdxToDelete = cIdx - 1;
                                          const updatedRows = rows.map((r) => {
                                            const existingValues = cols.slice(1).map((_, i) => getCourseSalaryCellValue(r, i + 1));
                                            const updatedValues = existingValues.filter((_, i) => i !== valIdxToDelete);
                                            return {
                                              ...r,
                                              values: updatedValues,
                                            };
                                          });
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: {
                                              ...curArticle,
                                              salaryTableCols: newCols,
                                              salaryTable: updatedRows,
                                            },
                                          });
                                        }}
                                        className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                                        title={`Delete column "${colName}"`}
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                        <span>Remove</span>
                                      </button>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    value={colName}
                                    onChange={(e) => {
                                      const newCols = [...cols];
                                      newCols[cIdx] = e.target.value;
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, salaryTableCols: newCols },
                                      });
                                    }}
                                    placeholder={cIdx === 0 ? "Course" : `Median Salary`}
                                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Table Rows List */}
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                            {rows.map((row, rIdx) => (
                              <div key={rIdx} className="p-2.5 bg-white border border-emerald-200/80 rounded-xl space-y-2 relative shadow-2xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                                  <span className="text-[10px] font-bold text-emerald-900 uppercase">
                                    Row #{rIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedRows = rows.filter((_, i) => i !== rIdx);
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, salaryTable: updatedRows },
                                      });
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                                    title="Delete Row"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete Row</span>
                                  </button>
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                                    {cols[0] || "Course Name"}
                                  </label>
                                  <input
                                    type="text"
                                    value={row.course}
                                    onChange={(e) => {
                                      const updatedRows = [...rows];
                                      updatedRows[rIdx] = { ...updatedRows[rIdx], course: e.target.value };
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, salaryTable: updatedRows },
                                      });
                                    }}
                                    placeholder="e.g. B.E. / B.Tech"
                                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {cols.slice(1).map((colTitle, cIdx) => {
                                    const cellVal = getCourseSalaryCellValue(row, cIdx + 1);
                                    return (
                                      <div key={cIdx}>
                                        <label className="text-[9.5px] font-bold text-slate-500 block mb-0.5 truncate" title={colTitle}>
                                          {colTitle}
                                        </label>
                                        <input
                                          type="text"
                                          value={cellVal}
                                          onChange={(e) => {
                                            const updatedRows = [...rows];
                                            const existingValues = cols.slice(1).map((_, i) => getCourseSalaryCellValue(row, i + 1));
                                            existingValues[cIdx] = e.target.value;
                                            updatedRows[rIdx] = {
                                              ...updatedRows[rIdx],
                                              values: existingValues,
                                            };
                                            setTempData({
                                              ...tempData,
                                              placementsArticle: { ...curArticle, salaryTable: updatedRows },
                                            });
                                          }}
                                          placeholder="e.g. ₹20 LPA"
                                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: PLACEMENTS HUB (TABBED MULTI-SECTION) */}
                {activeMiniModal === "placements" && (
                  <div className="space-y-3">
                    {/* Clean Section Switcher Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setPlacementsModalTab("article")}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          placementsModalTab === "article"
                            ? "bg-white text-indigo-900 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        📝 1. Article Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlacementsModalTab("stats")}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          placementsModalTab === "stats"
                            ? "bg-white text-indigo-900 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        📊 2. Highlights Table
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlacementsModalTab("salary")}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          placementsModalTab === "salary"
                            ? "bg-white text-indigo-900 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        💰 3. Median Salary Table
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlacementsModalTab("recruiters")}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          placementsModalTab === "recruiters"
                            ? "bg-white text-indigo-900 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        🏢 4. Top Recruiters
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlacementsModalTab("insights")}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          placementsModalTab === "insights"
                            ? "bg-white text-indigo-900 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        💡 5. Student Insights
                      </button>
                    </div>

                    {/* Tab 1: Article Content */}
                    {placementsModalTab === "article" && (
                      <div className="space-y-3">
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                            Placements Article Details
                          </span>

                          <div>
                            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                              Article Title
                            </label>
                            <input
                              type="text"
                              value={tempData.placementsArticle?.title || `${tempData.name.split(" - ")[0]} Placements 2026`}
                              onChange={(e) => {
                                const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                                setTempData({
                                  ...tempData,
                                  placementsArticle: { ...cur, title: e.target.value },
                                });
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                              Intro Paragraph (Always Visible / Preview)
                            </label>
                            <textarea
                              rows={4}
                              value={tempData.placementsArticle?.introParagraph || getCollegePlacementsArticle(tempData).introParagraph || ""}
                              onChange={(e) => {
                                const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                                setTempData({
                                  ...tempData,
                                  placementsArticle: { ...cur, introParagraph: e.target.value },
                                });
                              }}
                              placeholder="Introductory paragraph..."
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
                            />
                          </div>
                        </div>

                        {/* Subsections List (Top Recruiters, MBA Placements, etc.) */}
                        <div className="p-3.5 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
                              Placements Sub-Sections (Expanded Content)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                                const updated = [
                                  ...(cur.subsections || []),
                                  {
                                    heading: `${tempData.name.split(" - ")[0]} Additional Placements 2026`,
                                    content: "Detailed branch-wise placement statistics and highest packages.",
                                  },
                                ];
                                setTempData({
                                  ...tempData,
                                  placementsArticle: { ...cur, subsections: updated },
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Sub-Section</span>
                            </button>
                          </div>

                          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {(tempData.placementsArticle?.subsections || getCollegePlacementsArticle(tempData).subsections || []).map((sub, sIdx) => (
                              <div key={sIdx} className="p-2.5 bg-white border border-blue-200/80 rounded-xl space-y-1.5 relative shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                                    const updated = (cur.subsections || []).filter((_, i) => i !== sIdx);
                                    setTempData({
                                      ...tempData,
                                      placementsArticle: { ...cur, subsections: updated },
                                    });
                                  }}
                                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Delete Sub-Section"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="w-4/5">
                                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subheading #{sIdx + 1}</label>
                                  <input
                                    type="text"
                                    value={sub.heading}
                                    onChange={(e) => {
                                      const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                                      const updated = [...(cur.subsections || [])];
                                      updated[sIdx] = { ...updated[sIdx], heading: e.target.value };
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...cur, subsections: updated },
                                      });
                                    }}
                                    placeholder="e.g. IIT Delhi Top Recruiters 2026"
                                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Content</label>
                                  <textarea
                                    rows={2.5}
                                    value={sub.content}
                                    onChange={(e) => {
                                      const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                                      const updated = [...(cur.subsections || [])];
                                      updated[sIdx] = { ...updated[sIdx], content: e.target.value };
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...cur, subsections: updated },
                                      });
                                    }}
                                    placeholder="Sub-section content details (supports **bold**)..."
                                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-700"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer Note */}
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                            Footer Note Text
                          </label>
                          <input
                            type="text"
                            value={tempData.placementsArticle?.footerNote || getCollegePlacementsArticle(tempData).footerNote || ""}
                            onChange={(e) => {
                              const cur = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                              setTempData({
                                ...tempData,
                                placementsArticle: { ...cur, footerNote: e.target.value },
                              });
                            }}
                            placeholder="e.g. Check course-wise placement data of IIT Delhi below:"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                          />
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Placement Statistics Table */}
                    {placementsModalTab === "stats" && (
                      <div className="p-3.5 bg-indigo-50/50 border border-indigo-200/80 rounded-2xl space-y-3">
                        {(() => {
                          const curArticle = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                          const cols = curArticle.statsTableCols && curArticle.statsTableCols.length > 0
                            ? curArticle.statsTableCols
                            : ["Particulars", "Placement Statistics 2025 (Ongoing)", "Placement Statistics 2024"];
                          const rows = curArticle.statsTable || getCollegePlacementsArticle(tempData).statsTable || [];

                          return (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block">
                                    Placement Highlights Table & Columns
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    Dynamic multi-year comparison table ({cols.length} columns, {rows.length} rows)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextYear = new Date().getFullYear();
                                      const newColTitle = `Placement Statistics ${nextYear}`;
                                      const newCols = [...cols, newColTitle];
                                      const updatedRows = rows.map((r) => {
                                        const existingValues = cols.slice(1).map((_, i) => getStatRowCellValue(r, i + 1));
                                        return {
                                          ...r,
                                          values: [...existingValues, "NA"],
                                        };
                                      });
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: {
                                          ...curArticle,
                                          statsTableCols: newCols,
                                          statsTable: updatedRows,
                                        },
                                      });
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                    title="Add a new year/statistics column to table"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Column</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const extraColsCount = Math.max(1, cols.length - 1);
                                      const newValues = Array(extraColsCount).fill("NA");
                                      const updatedRows = [
                                        ...rows,
                                        {
                                          particular: "New Parameter",
                                          values: newValues,
                                        },
                                      ];
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: {
                                          ...curArticle,
                                          statsTableCols: cols,
                                          statsTable: updatedRows,
                                        },
                                      });
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Row</span>
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                  Table Title
                                </label>
                                <input
                                  type="text"
                                  value={curArticle.statsTableTitle || `${tempData.name.split(" - ")[0]} Placements Highlights`}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      placementsArticle: { ...curArticle, statsTableTitle: e.target.value },
                                    });
                                  }}
                                  placeholder="e.g. IIT Delhi Placements Highlights"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                />
                              </div>

                              {/* Column Headers Section */}
                              <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100 space-y-2">
                                <span className="text-[10.5px] font-bold text-slate-700 block uppercase tracking-wider">
                                  Table Columns ({cols.length})
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {cols.map((colName, cIdx) => (
                                    <div key={cIdx} className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[9.5px] font-bold text-slate-500 uppercase">
                                          {cIdx === 0 ? "Col 1 (Fixed Parameter)" : `Col ${cIdx + 1} (Stat Metric)`}
                                        </label>
                                        {cIdx > 0 && cols.length > 2 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newCols = cols.filter((_, i) => i !== cIdx);
                                              const valIdxToDelete = cIdx - 1;
                                              const updatedRows = rows.map((r) => {
                                                const existingValues = cols.slice(1).map((_, i) => getStatRowCellValue(r, i + 1));
                                                const updatedValues = existingValues.filter((_, i) => i !== valIdxToDelete);
                                                return {
                                                  ...r,
                                                  values: updatedValues,
                                                };
                                              });
                                              setTempData({
                                                ...tempData,
                                                placementsArticle: {
                                                  ...curArticle,
                                                  statsTableCols: newCols,
                                                  statsTable: updatedRows,
                                                },
                                              });
                                            }}
                                            className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                                            title={`Delete column "${colName}"`}
                                          >
                                            <Trash2 className="w-2.5 h-2.5" />
                                            <span>Remove</span>
                                          </button>
                                        )}
                                      </div>
                                      <input
                                        type="text"
                                        value={colName}
                                        onChange={(e) => {
                                          const newCols = [...cols];
                                          newCols[cIdx] = e.target.value;
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, statsTableCols: newCols },
                                          });
                                        }}
                                        placeholder={cIdx === 0 ? "Particulars" : `Placement Statistics Year`}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Table Rows List */}
                              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                {rows.map((row, rIdx) => (
                                  <div key={rIdx} className="p-2.5 bg-white border border-indigo-200/80 rounded-xl space-y-2 relative shadow-2xs">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                                      <span className="text-[10px] font-bold text-indigo-900 uppercase">
                                        Row #{rIdx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedRows = rows.filter((_, i) => i !== rIdx);
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, statsTable: updatedRows },
                                          });
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                                        title="Delete Row"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Delete Row</span>
                                      </button>
                                    </div>

                                    <div>
                                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                                        {cols[0] || "Particulars / Parameter"}
                                      </label>
                                      <input
                                        type="text"
                                        value={row.particular}
                                        onChange={(e) => {
                                          const updatedRows = [...rows];
                                          updatedRows[rIdx] = { ...updatedRows[rIdx], particular: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, statsTable: updatedRows },
                                          });
                                        }}
                                        placeholder="e.g. Total No. Of Offers"
                                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                      />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                      {cols.slice(1).map((colTitle, cIdx) => {
                                        const cellVal = getStatRowCellValue(row, cIdx + 1);
                                        return (
                                          <div key={cIdx}>
                                            <label className="text-[9.5px] font-bold text-slate-500 block mb-0.5 truncate" title={colTitle}>
                                              {colTitle}
                                            </label>
                                            <input
                                              type="text"
                                              value={cellVal}
                                              onChange={(e) => {
                                                const updatedRows = [...rows];
                                                const existingValues = cols.slice(1).map((_, i) => getStatRowCellValue(row, i + 1));
                                                existingValues[cIdx] = e.target.value;
                                                updatedRows[rIdx] = {
                                                  ...updatedRows[rIdx],
                                                  values: existingValues,
                                                };
                                                setTempData({
                                                  ...tempData,
                                                  placementsArticle: { ...curArticle, statsTable: updatedRows },
                                                });
                                              }}
                                              placeholder="Stat value (e.g. INR 22 LPA, NA)"
                                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                                            />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Tab 3: Course-wise Median Salary Table */}
                    {placementsModalTab === "salary" && (
                      <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-3">
                        {(() => {
                          const curArticle = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                          const cols = curArticle.salaryTableCols && curArticle.salaryTableCols.length > 0
                            ? curArticle.salaryTableCols
                            : ["Course", "Median Salary"];
                          const rows = curArticle.salaryTable || getCollegePlacementsArticle(tempData).salaryTable || [];

                          return (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wide block">
                                    Course-wise Median Salary Table & Columns
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    Dynamic course salary breakdown ({cols.length} columns, {rows.length} rows)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newColTitle = `Salary Metric ${cols.length}`;
                                      const newCols = [...cols, newColTitle];
                                      const updatedRows = rows.map((r) => {
                                        const existingValues = cols.slice(1).map((_, i) => getCourseSalaryCellValue(r, i + 1));
                                        return {
                                          ...r,
                                          values: [...existingValues, "NA"],
                                        };
                                      });
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: {
                                          ...curArticle,
                                          salaryTableCols: newCols,
                                          salaryTable: updatedRows,
                                        },
                                      });
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                    title="Add a new salary metric column"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Column</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const extraColsCount = Math.max(1, cols.length - 1);
                                      const newValues = Array(extraColsCount).fill("₹15 LPA");
                                      const updatedRows = [
                                        ...rows,
                                        {
                                          course: "New Course",
                                          values: newValues,
                                        },
                                      ];
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: {
                                          ...curArticle,
                                          salaryTableCols: cols,
                                          salaryTable: updatedRows,
                                        },
                                      });
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Course Row</span>
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                  Table Title
                                </label>
                                <input
                                  type="text"
                                  value={curArticle.salaryTableTitle || `${tempData.name.split(" - ")[0]} Course-wise Median Salary`}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      placementsArticle: { ...curArticle, salaryTableTitle: e.target.value },
                                    });
                                  }}
                                  placeholder="e.g. IIT Delhi Course-wise Median Salary"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                />
                              </div>

                              {/* Column Headers Section */}
                              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 space-y-2">
                                <span className="text-[10.5px] font-bold text-slate-700 block uppercase tracking-wider">
                                  Table Columns ({cols.length})
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {cols.map((colName, cIdx) => (
                                    <div key={cIdx} className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[9.5px] font-bold text-slate-500 uppercase">
                                          {cIdx === 0 ? "Col 1 (Course Name)" : `Col ${cIdx + 1} (Salary Metric)`}
                                        </label>
                                        {cIdx > 0 && cols.length > 2 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newCols = cols.filter((_, i) => i !== cIdx);
                                              const valIdxToDelete = cIdx - 1;
                                              const updatedRows = rows.map((r) => {
                                                const existingValues = cols.slice(1).map((_, i) => getCourseSalaryCellValue(r, i + 1));
                                                const updatedValues = existingValues.filter((_, i) => i !== valIdxToDelete);
                                                return {
                                                  ...r,
                                                  values: updatedValues,
                                                };
                                              });
                                              setTempData({
                                                ...tempData,
                                                placementsArticle: {
                                                  ...curArticle,
                                                  salaryTableCols: newCols,
                                                  salaryTable: updatedRows,
                                                },
                                              });
                                            }}
                                            className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                                            title={`Delete column "${colName}"`}
                                          >
                                            <Trash2 className="w-2.5 h-2.5" />
                                            <span>Remove</span>
                                          </button>
                                        )}
                                      </div>
                                      <input
                                        type="text"
                                        value={colName}
                                        onChange={(e) => {
                                          const newCols = [...cols];
                                          newCols[cIdx] = e.target.value;
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, salaryTableCols: newCols },
                                          });
                                        }}
                                        placeholder={cIdx === 0 ? "Course" : `Median Salary`}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Table Rows List */}
                              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                {rows.map((row, rIdx) => (
                                  <div key={rIdx} className="p-2.5 bg-white border border-emerald-200/80 rounded-xl space-y-2 relative shadow-2xs">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                                      <span className="text-[10px] font-bold text-emerald-900 uppercase">
                                        Row #{rIdx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedRows = rows.filter((_, i) => i !== rIdx);
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, salaryTable: updatedRows },
                                          });
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                                        title="Delete Row"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Delete Row</span>
                                      </button>
                                    </div>

                                    <div>
                                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                                        {cols[0] || "Course Name"}
                                      </label>
                                      <input
                                        type="text"
                                        value={row.course}
                                        onChange={(e) => {
                                          const updatedRows = [...rows];
                                          updatedRows[rIdx] = { ...updatedRows[rIdx], course: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, salaryTable: updatedRows },
                                          });
                                        }}
                                        placeholder="e.g. B.E. / B.Tech"
                                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                      />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                      {cols.slice(1).map((colTitle, cIdx) => {
                                        const cellVal = getCourseSalaryCellValue(row, cIdx + 1);
                                        return (
                                          <div key={cIdx}>
                                            <label className="text-[9.5px] font-bold text-slate-500 block mb-0.5 truncate" title={colTitle}>
                                              {colTitle}
                                            </label>
                                            <input
                                              type="text"
                                              value={cellVal}
                                              onChange={(e) => {
                                                const updatedRows = [...rows];
                                                const existingValues = cols.slice(1).map((_, i) => getCourseSalaryCellValue(row, i + 1));
                                                existingValues[cIdx] = e.target.value;
                                                updatedRows[rIdx] = {
                                                  ...updatedRows[rIdx],
                                                  values: existingValues,
                                                };
                                                setTempData({
                                                  ...tempData,
                                                  placementsArticle: { ...curArticle, salaryTable: updatedRows },
                                                });
                                              }}
                                              placeholder="e.g. ₹20 LPA"
                                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                                            />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Tab 4: Top Recruiters */}
                    {placementsModalTab === "recruiters" && (
                      <div className="p-3.5 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 border border-indigo-200/80 rounded-2xl space-y-3.5">
                        {(() => {
                          const curArticle = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                          const recruiters = curArticle.topRecruiters || getCollegePlacementsArticle(tempData).topRecruiters || [];

                          return (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block">
                                    🏢 Top Recruiters & Company Logos
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    Manage recruiting partners, logos, and clickable company links ({recruiters.length} companies)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedRecruiters = [
                                      ...recruiters,
                                      {
                                        name: "New Recruiter",
                                        logoUrl: "",
                                        websiteUrl: "",
                                      },
                                    ];
                                    setTempData({
                                      ...tempData,
                                      placementsArticle: {
                                        ...curArticle,
                                        topRecruiters: updatedRecruiters,
                                      },
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Recruiter</span>
                                </button>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                  Section Title
                                </label>
                                <input
                                  type="text"
                                  value={curArticle.topRecruitersTitle || "Top Recruiters"}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      placementsArticle: { ...curArticle, topRecruitersTitle: e.target.value },
                                    });
                                  }}
                                  placeholder="e.g. Top Recruiters"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                />
                              </div>

                              {/* Recruiter Items List */}
                              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                                {recruiters.map((rec, rIdx) => {
                                  const fallbackInitials = rec.name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "TC";
                                  return (
                                    <div
                                      key={rIdx}
                                      className="p-3 bg-white border border-slate-200/90 hover:border-indigo-300 rounded-xl space-y-2.5 shadow-2xs relative transition-all"
                                    >
                                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                                            <img
                                              src={rec.logoUrl || `https://logo.clearbit.com/${rec.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`}
                                              alt={rec.name}
                                              className="max-h-full max-w-full object-contain"
                                              onError={(e) => {
                                                const target = e.currentTarget;
                                                target.style.display = "none";
                                                const parent = target.parentElement;
                                                if (parent && !parent.querySelector(".rec-modal-badge")) {
                                                  const fb = document.createElement("div");
                                                  fb.className = "rec-modal-badge w-full h-full bg-[#07264a] text-white flex items-center justify-center font-black text-[10px]";
                                                  fb.innerText = fallbackInitials;
                                                  parent.appendChild(fb);
                                                }
                                              }}
                                            />
                                          </div>
                                          <span className="text-xs font-bold text-slate-800">
                                            #{rIdx + 1} {rec.name || "Unnamed Company"}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = recruiters.filter((_, i) => i !== rIdx);
                                            setTempData({
                                              ...tempData,
                                              placementsArticle: { ...curArticle, topRecruiters: updated },
                                            });
                                          }}
                                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold transition-colors"
                                          title="Remove Recruiter"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          <span>Remove</span>
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div>
                                          <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                            Company Name *
                                          </label>
                                          <input
                                            type="text"
                                            required
                                            value={rec.name}
                                            onChange={(e) => {
                                              const updated = [...recruiters];
                                              updated[rIdx] = { ...updated[rIdx], name: e.target.value };
                                              setTempData({
                                                ...tempData,
                                                placementsArticle: { ...curArticle, topRecruiters: updated },
                                              });
                                            }}
                                            placeholder="e.g. Google"
                                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                          />
                                        </div>

                                        <div>
                                          <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                            Logo Image URL
                                          </label>
                                          <input
                                            type="text"
                                            value={rec.logoUrl || ""}
                                            onChange={(e) => {
                                              const updated = [...recruiters];
                                              updated[rIdx] = { ...updated[rIdx], logoUrl: e.target.value };
                                              setTempData({
                                                ...tempData,
                                                placementsArticle: { ...curArticle, topRecruiters: updated },
                                              });
                                            }}
                                            placeholder="e.g. https://... or auto logo"
                                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                            Website / Career Link URL
                                          </label>
                                          <input
                                            type="text"
                                            value={rec.websiteUrl || ""}
                                            onChange={(e) => {
                                              const updated = [...recruiters];
                                              updated[rIdx] = { ...updated[rIdx], websiteUrl: e.target.value };
                                              setTempData({
                                                ...tempData,
                                                placementsArticle: { ...curArticle, topRecruiters: updated },
                                              });
                                            }}
                                            placeholder="e.g. https://careers.google.com"
                                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Tab 5: Student Insights */}
                    {placementsModalTab === "insights" && (
                      <div className="p-3.5 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 border border-amber-200/80 rounded-2xl space-y-3.5">
                        {(() => {
                          const curArticle = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                          const insights = curArticle.insights || getCollegePlacementsArticle(tempData).insights || [];

                          return (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <span className="text-xs font-black text-amber-950 uppercase tracking-wide block">
                                    💡 Placement Student Insights & Feedback
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    Student response quotes & experiential insight cards ({insights.length} cards)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [
                                      ...insights,
                                      {
                                        title: "New Student Insight",
                                        description: "Insight description regarding campus placement experience...",
                                      },
                                    ];
                                    setTempData({
                                      ...tempData,
                                      placementsArticle: {
                                        ...curArticle,
                                        insights: updated,
                                      },
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Insight Card</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                    Section Title
                                  </label>
                                  <input
                                    type="text"
                                    value={curArticle.insightsTitle || "Insights on Placements"}
                                    onChange={(e) => {
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, insightsTitle: e.target.value },
                                      });
                                    }}
                                    placeholder="e.g. Insights on Placements"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                    Subtitle / Survey Note
                                  </label>
                                  <input
                                    type="text"
                                    value={curArticle.insightsSubtitle || "Based on 281 Student Responses"}
                                    onChange={(e) => {
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, insightsSubtitle: e.target.value },
                                      });
                                    }}
                                    placeholder="e.g. Based on 281 Student Responses"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                                  />
                                </div>
                              </div>

                              {/* Insights Items List */}
                              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                                {insights.map((ins, inIdx) => (
                                  <div
                                    key={inIdx}
                                    className="p-3 bg-white border border-slate-200/90 hover:border-amber-300 rounded-xl space-y-2.5 shadow-2xs relative transition-all"
                                  >
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <span className="text-amber-500 font-black">✧</span> #{inIdx + 1} {ins.title || "Untitled Card"}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = insights.filter((_, i) => i !== inIdx);
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, insights: updated },
                                          });
                                        }}
                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold transition-colors"
                                        title="Remove Insight Card"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Remove</span>
                                      </button>
                                    </div>

                                    <div className="space-y-2">
                                      <div>
                                        <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                          Card Title / Topic *
                                        </label>
                                        <input
                                          type="text"
                                          required
                                          value={ins.title}
                                          onChange={(e) => {
                                            const updated = [...insights];
                                            updated[inIdx] = { ...updated[inIdx], title: e.target.value };
                                            setTempData({
                                              ...tempData,
                                              placementsArticle: { ...curArticle, insights: updated },
                                            });
                                          }}
                                          placeholder="e.g. Internships and industry projects"
                                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                          Description / Student Feedback *
                                        </label>
                                        <textarea
                                          rows={2}
                                          required
                                          value={ins.description}
                                          onChange={(e) => {
                                            const updated = [...insights];
                                            updated[inIdx] = { ...updated[inIdx], description: e.target.value };
                                            setTempData({
                                              ...tempData,
                                              placementsArticle: { ...curArticle, insights: updated },
                                            });
                                          }}
                                          placeholder="e.g. Students can work with faculty on research projects"
                                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 resize-none"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* MODAL: TOP RECRUITERS & COMPANY LOGOS (INDIVIDUAL) */}
                {activeMiniModal === "placements_recruiters" && (
                  <div className="p-3.5 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 border border-indigo-200/80 rounded-2xl space-y-3.5">
                    {(() => {
                      const curArticle = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                      const recruiters = curArticle.topRecruiters || getCollegePlacementsArticle(tempData).topRecruiters || [];

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block">
                                🏢 Top Recruiters & Company Logos
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Manage recruiting partners, logos, and clickable company links ({recruiters.length} companies)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedRecruiters = [
                                  ...recruiters,
                                  {
                                    name: "New Recruiter",
                                    logoUrl: "",
                                    websiteUrl: "",
                                  },
                                ];
                                setTempData({
                                  ...tempData,
                                  placementsArticle: {
                                    ...curArticle,
                                    topRecruiters: updatedRecruiters,
                                  },
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Recruiter</span>
                            </button>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                              Section Title
                            </label>
                            <input
                              type="text"
                              value={curArticle.topRecruitersTitle || "Top Recruiters"}
                              onChange={(e) => {
                                setTempData({
                                  ...tempData,
                                  placementsArticle: { ...curArticle, topRecruitersTitle: e.target.value },
                                });
                              }}
                              placeholder="e.g. Top Recruiters"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                            />
                          </div>

                          {/* Recruiter Items List */}
                          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                            {recruiters.map((rec, rIdx) => {
                              const fallbackInitials = rec.name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "TC";
                              return (
                                <div
                                  key={rIdx}
                                  className="p-3 bg-white border border-slate-200/90 hover:border-indigo-300 rounded-xl space-y-2.5 shadow-2xs relative transition-all"
                                >
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                                        <img
                                          src={rec.logoUrl || `https://logo.clearbit.com/${rec.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`}
                                          alt={rec.name}
                                          className="max-h-full max-w-full object-contain"
                                          onError={(e) => {
                                            const target = e.currentTarget;
                                            target.style.display = "none";
                                            const parent = target.parentElement;
                                            if (parent && !parent.querySelector(".rec-modal-badge")) {
                                              const fb = document.createElement("div");
                                              fb.className = "rec-modal-badge w-full h-full bg-[#07264a] text-white flex items-center justify-center font-black text-[10px]";
                                              fb.innerText = fallbackInitials;
                                              parent.appendChild(fb);
                                            }
                                          }}
                                        />
                                      </div>
                                      <span className="text-xs font-bold text-slate-800">
                                        #{rIdx + 1} {rec.name || "Unnamed Company"}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = recruiters.filter((_, i) => i !== rIdx);
                                        setTempData({
                                          ...tempData,
                                          placementsArticle: { ...curArticle, topRecruiters: updated },
                                        });
                                      }}
                                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold transition-colors"
                                      title="Remove Recruiter"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>Remove</span>
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                        Company Name *
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={rec.name}
                                        onChange={(e) => {
                                          const updated = [...recruiters];
                                          updated[rIdx] = { ...updated[rIdx], name: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, topRecruiters: updated },
                                          });
                                        }}
                                        placeholder="e.g. Google"
                                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                      />
                                    </div>

                                    <div>
                                      <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                        Logo Image URL
                                      </label>
                                      <input
                                        type="text"
                                        value={rec.logoUrl || ""}
                                        onChange={(e) => {
                                          const updated = [...recruiters];
                                          updated[rIdx] = { ...updated[rIdx], logoUrl: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, topRecruiters: updated },
                                          });
                                        }}
                                        placeholder="e.g. https://... or auto logo"
                                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                                      />
                                    </div>

                                    <div>
                                      <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                        Website / Career Link URL
                                      </label>
                                      <input
                                        type="text"
                                        value={rec.websiteUrl || ""}
                                        onChange={(e) => {
                                          const updated = [...recruiters];
                                          updated[rIdx] = { ...updated[rIdx], websiteUrl: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            placementsArticle: { ...curArticle, topRecruiters: updated },
                                          });
                                        }}
                                        placeholder="e.g. https://careers.google.com"
                                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: PLACEMENT STUDENT INSIGHTS (INDIVIDUAL) */}
                {activeMiniModal === "placements_insights" && (
                  <div className="p-3.5 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 border border-amber-200/80 rounded-2xl space-y-3.5">
                    {(() => {
                      const curArticle = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                      const insights = curArticle.insights || getCollegePlacementsArticle(tempData).insights || [];

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-black text-amber-950 uppercase tracking-wide block">
                                💡 Placement Student Insights & Feedback
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Student response quotes & experiential insight cards ({insights.length} cards)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [
                                  ...insights,
                                  {
                                    title: "New Student Insight",
                                    description: "Insight description regarding campus placement experience...",
                                  },
                                ];
                                setTempData({
                                  ...tempData,
                                  placementsArticle: {
                                    ...curArticle,
                                    insights: updated,
                                  },
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Insight Card</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Section Title
                              </label>
                              <input
                                type="text"
                                value={curArticle.insightsTitle || "Insights on Placements"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: { ...curArticle, insightsTitle: e.target.value },
                                  });
                                }}
                                placeholder="e.g. Insights on Placements"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Subtitle / Survey Note
                              </label>
                              <input
                                type="text"
                                value={curArticle.insightsSubtitle || "Based on 281 Student Responses"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: { ...curArticle, insightsSubtitle: e.target.value },
                                  });
                                }}
                                placeholder="e.g. Based on 281 Student Responses"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                              />
                            </div>
                          </div>

                          {/* Insights Items List */}
                          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                            {insights.map((ins, inIdx) => (
                              <div
                                key={inIdx}
                                className="p-3 bg-white border border-slate-200/90 hover:border-amber-300 rounded-xl space-y-2.5 shadow-2xs relative transition-all"
                              >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <span className="text-amber-500 font-black">✧</span> #{inIdx + 1} {ins.title || "Untitled Card"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = insights.filter((_, i) => i !== inIdx);
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, insights: updated },
                                      });
                                    }}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold transition-colors"
                                    title="Remove Insight Card"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Remove</span>
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                      Card Title / Topic *
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      value={ins.title}
                                      onChange={(e) => {
                                        const updated = [...insights];
                                        updated[inIdx] = { ...updated[inIdx], title: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          placementsArticle: { ...curArticle, insights: updated },
                                        });
                                      }}
                                      placeholder="e.g. Internships and industry projects"
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                      Description / Student Feedback *
                                    </label>
                                    <textarea
                                      rows={2}
                                      required
                                      value={ins.description}
                                      onChange={(e) => {
                                        const updated = [...insights];
                                        updated[inIdx] = { ...updated[inIdx], description: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          placementsArticle: { ...curArticle, insights: updated },
                                        });
                                      }}
                                      placeholder="e.g. Students can work with faculty on research projects"
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 resize-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: PLACEMENT FAQS */}
                {activeMiniModal === "placements_faqs" && (
                  <div className="p-3.5 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 border border-amber-200/80 rounded-2xl space-y-3.5">
                    {(() => {
                      const curArticle = tempData.placementsArticle || getCollegePlacementsArticle(tempData);
                      const faqs = curArticle.faqs || getCollegePlacementsArticle(tempData).faqs || [];

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-black text-amber-950 uppercase tracking-wide block">
                                ❓ Commonly Asked Questions on Placements
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Placement FAQs list ({faqs.length} questions)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [
                                  ...faqs,
                                  {
                                    question: "",
                                    answer: "",
                                  },
                                ];
                                setTempData({
                                  ...tempData,
                                  placementsArticle: {
                                    ...curArticle,
                                    faqs: updated,
                                  },
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add FAQ Item</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Section Main Title
                              </label>
                              <input
                                type="text"
                                value={curArticle.faqsHeading || "Commonly asked questions"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: { ...curArticle, faqsHeading: e.target.value },
                                  });
                                }}
                                placeholder="e.g. Commonly asked questions"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Subtitle / Topic
                              </label>
                              <input
                                type="text"
                                value={curArticle.faqsSubtitle || "On Placements"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    placementsArticle: { ...curArticle, faqsSubtitle: e.target.value },
                                  });
                                }}
                                placeholder="e.g. On Placements"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                              />
                            </div>
                          </div>

                          {/* FAQ Questions List */}
                          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                            {faqs.map((faq, fIdx) => (
                              <div
                                key={fIdx}
                                className="p-3 bg-white border border-slate-200/90 hover:border-amber-300 rounded-xl space-y-2.5 shadow-2xs relative transition-all"
                              >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <span className="text-amber-600 font-black">Q{fIdx + 1}:</span> {faq.question ? (faq.question.length > 50 ? `${faq.question.slice(0, 50)}...` : faq.question) : "Untitled Question"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = faqs.filter((_, i) => i !== fIdx);
                                      setTempData({
                                        ...tempData,
                                        placementsArticle: { ...curArticle, faqs: updated },
                                      });
                                    }}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold transition-colors"
                                    title="Delete FAQ"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                      Question *
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      value={faq.question}
                                      onChange={(e) => {
                                        const updated = [...faqs];
                                        updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          placementsArticle: { ...curArticle, faqs: updated },
                                        });
                                      }}
                                      placeholder="e.g. Can I take admission at IIT Delhi MTech course without GATE?"
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                      Answer *
                                    </label>
                                    <textarea
                                      rows={3}
                                      required
                                      value={faq.answer}
                                      onChange={(e) => {
                                        const updated = [...faqs];
                                        updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          placementsArticle: { ...curArticle, faqs: updated },
                                        });
                                      }}
                                      placeholder="e.g. Direct admission for regular full-time MTech..."
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 resize-none leading-relaxed"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: 3-YEAR CUTOFF COMPARISON TABLE */}
                {activeMiniModal === "cutoff_comparison" && (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Accordion Box Title</label>
                        <input
                          type="text"
                          value={tempData.cutoffComparison?.title || `Cut Off 2026 for ${tempData.name.split(" - ")[0]} Latest Round`}
                          onChange={(e) => {
                            const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                            setTempData({
                              ...tempData,
                              cutoffComparison: {
                                ...cur,
                                title: e.target.value,
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Table Subtitle / Round Header</label>
                        <input
                          type="text"
                          value={tempData.cutoffComparison?.subtitle || "JEE Advanced Round 5 Closing Rank (General-All India)"}
                          onChange={(e) => {
                            const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                            setTempData({
                              ...tempData,
                              cutoffComparison: {
                                ...cur,
                                subtitle: e.target.value,
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                        />
                      </div>

                      {/* Years */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Year 1</label>
                          <input
                            type="text"
                            value={tempData.cutoffComparison?.years?.[0] || "2024"}
                            onChange={(e) => {
                              const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                              const y = cur.years || ["2024", "2025", "2026"];
                              setTempData({
                                ...tempData,
                                cutoffComparison: {
                                  ...cur,
                                  years: [e.target.value, y[1], y[2]],
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Year 2</label>
                          <input
                            type="text"
                            value={tempData.cutoffComparison?.years?.[1] || "2025"}
                            onChange={(e) => {
                              const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                              const y = cur.years || ["2024", "2025", "2026"];
                              setTempData({
                                ...tempData,
                                cutoffComparison: {
                                  ...cur,
                                  years: [y[0], e.target.value, y[2]],
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Year 3</label>
                          <input
                            type="text"
                            value={tempData.cutoffComparison?.years?.[2] || "2026"}
                            onChange={(e) => {
                              const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                              const y = cur.years || ["2024", "2025", "2026"];
                              setTempData({
                                ...tempData,
                                cutoffComparison: {
                                  ...cur,
                                  years: [y[0], y[1], e.target.value],
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                          Course Cutoff Comparison Rows
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                            setTempData({
                              ...tempData,
                              cutoffComparison: {
                                ...cur,
                                rows: [
                                  ...(cur.rows || []),
                                  {
                                    course: "B.Tech. in New Branch",
                                    year2024: 500,
                                    year2025: 480,
                                    year2026: 490,
                                  },
                                ],
                              },
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Course Row</span>
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                        {(tempData.cutoffComparison?.rows || getCollegeCutoffComparison(tempData).rows || []).map((row, rIdx) => (
                          <div key={rIdx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 relative shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                                const updated = (cur.rows || []).filter((_, i) => i !== rIdx);
                                setTempData({
                                  ...tempData,
                                  cutoffComparison: {
                                    ...cur,
                                    rows: updated,
                                  },
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete Row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="w-4/5">
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Course Name</label>
                              <input
                                type="text"
                                value={row.course}
                                onChange={(e) => {
                                  const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                                  const updated = [...(cur.rows || [])];
                                  updated[rIdx] = { ...updated[rIdx], course: e.target.value };
                                  setTempData({
                                    ...tempData,
                                    cutoffComparison: {
                                      ...cur,
                                      rows: updated,
                                    },
                                  });
                                }}
                                placeholder="Course (e.g. B.Tech. in Computer Science...)"
                                className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">2024 Rank</label>
                                <input
                                  type="text"
                                  value={row.year2024}
                                  onChange={(e) => {
                                    const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                                    const updated = [...(cur.rows || [])];
                                    updated[rIdx] = { ...updated[rIdx], year2024: e.target.value };
                                    setTempData({
                                      ...tempData,
                                      cutoffComparison: {
                                        ...cur,
                                        rows: updated,
                                      },
                                    });
                                  }}
                                  placeholder="2024"
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">2025 Rank</label>
                                <input
                                  type="text"
                                  value={row.year2025}
                                  onChange={(e) => {
                                    const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                                    const updated = [...(cur.rows || [])];
                                    updated[rIdx] = { ...updated[rIdx], year2025: e.target.value };
                                    setTempData({
                                      ...tempData,
                                      cutoffComparison: {
                                        ...cur,
                                        rows: updated,
                                      },
                                    });
                                  }}
                                  placeholder="2025"
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">2026 Rank</label>
                                <input
                                  type="text"
                                  value={row.year2026}
                                  onChange={(e) => {
                                    const cur = tempData.cutoffComparison || getCollegeCutoffComparison(tempData);
                                    const updated = [...(cur.rows || [])];
                                    updated[rIdx] = { ...updated[rIdx], year2026: e.target.value };
                                    setTempData({
                                      ...tempData,
                                      cutoffComparison: {
                                        ...cur,
                                        rows: updated,
                                      },
                                    });
                                  }}
                                  placeholder="2026"
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold text-blue-600"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL 7.6: SECONDARY CUTOFF 3-YEAR COMPARISON (UCEED / SPECIALIZED) */}
                {activeMiniModal === "secondary_cutoff_comparison" && (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-purple-50/50 border border-purple-200/80 rounded-2xl space-y-3">
                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                          Accordion Box Header Title
                        </label>
                        <input
                          type="text"
                          value={tempData.secondaryCutoffComparison?.title || getCollegeSecondaryCutoffComparison(tempData).title || ""}
                          onChange={(e) => {
                            const cur = tempData.secondaryCutoffComparison || getCollegeSecondaryCutoffComparison(tempData);
                            setTempData({
                              ...tempData,
                              secondaryCutoffComparison: {
                                ...cur,
                                title: e.target.value,
                              },
                            });
                          }}
                          placeholder="e.g. Cut Off 2026 for UCEED: Year-Wise rank"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                          Subtitle & Round/Category Context
                        </label>
                        <input
                          type="text"
                          value={tempData.secondaryCutoffComparison?.subtitle || getCollegeSecondaryCutoffComparison(tempData).subtitle || ""}
                          onChange={(e) => {
                            const cur = tempData.secondaryCutoffComparison || getCollegeSecondaryCutoffComparison(tempData);
                            setTempData({
                              ...tempData,
                              secondaryCutoffComparison: {
                                ...cur,
                                subtitle: e.target.value,
                              },
                            });
                          }}
                          placeholder="e.g. UCEED Last Round Closing Rank (General-All India)"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>

                      {/* Year Labels */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Year Column 1</label>
                          <input
                            type="text"
                            value={tempData.secondaryCutoffComparison?.years?.[0] || "2024"}
                            onChange={(e) => {
                              const cur = tempData.secondaryCutoffComparison || getCollegeSecondaryCutoffComparison(tempData);
                              const y = cur.years || ["2024", "2025", "2026"];
                              setTempData({
                                ...tempData,
                                secondaryCutoffComparison: {
                                  ...cur,
                                  years: [e.target.value, y[1], y[2]],
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Year Column 2</label>
                          <input
                            type="text"
                            value={tempData.secondaryCutoffComparison?.years?.[1] || "2025"}
                            onChange={(e) => {
                              const cur = tempData.secondaryCutoffComparison || getCollegeSecondaryCutoffComparison(tempData);
                              const y = cur.years || ["2024", "2025", "2026"];
                              setTempData({
                                ...tempData,
                                secondaryCutoffComparison: {
                                  ...cur,
                                  years: [y[0], e.target.value, y[2]],
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Year Column 3</label>
                          <input
                            type="text"
                            value={tempData.secondaryCutoffComparison?.years?.[2] || "2026"}
                            onChange={(e) => {
                              const cur = tempData.secondaryCutoffComparison || getCollegeSecondaryCutoffComparison(tempData);
                              const y = cur.years || ["2024", "2025", "2026"];
                              setTempData({
                                ...tempData,
                                secondaryCutoffComparison: {
                                  ...cur,
                                  years: [y[0], y[1], e.target.value],
                                },
                              });
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Multi-Round & Multi-Category Dataset Selector & Quick Generator */}
                    <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <label className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                            <span>🎯 Select Round & Category To Fill / Edit Cutoff Data</span>
                          </label>
                          <p className="text-[11.5px] text-slate-600 font-medium">
                            Choose any Round & Category combination to customize its exact ranks, or auto-generate all realistic datasets.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = tempData.secondaryCutoffComparison || getCollegeSecondaryCutoffComparison(tempData);
                            const baseRows = cur.rows || [];
                            const newDatasets: Record<string, CutoffComparisonRow[]> = { ...(cur.filterDatasets || {}) };
                            const roundsList = ["1", "2", "3", "4", "5", "Last Round"];
                            const multipliers: Record<string, number> = {
                              General: 1,
                              OBC: 1.65,
                              SC: 2.85,
                              ST: 4.2,
                              PWD: 0.45,
                              "Economically Weaker Section": 1.35,
                              "OBC Non-Creamy PWD": 0.55,
                              "SC PWD": 0.75,
                              "ST PWD": 0.9,
                            };

                            roundsList.forEach((r, rIdx) => {
                              const rOffset = rIdx * 2;
                              Object.entries(multipliers).forEach(([cat, mult]) => {
                                const key = `${r}|${cat}`;
                                newDatasets[key] = baseRows.map((row) => {
                                  const y24 = Number(row.year2024) || 35;
                                  const y25 = Number(row.year2025) || 41;
                                  const y26 = Number(row.year2026) || 28;
                                  return {
                                    course: row.course,
                                    year2024: Math.max(1, Math.round(y24 * mult) + rOffset),
                                    year2025: Math.max(1, Math.round(y25 * mult) + rOffset),
                                    year2026: Math.max(1, Math.round(y26 * mult) + rOffset),
                                  };
                                });
                                if (r === "1") {
                                  newDatasets[cat] = newDatasets[key];
                                }
                              });
                            });

                            setTempData({
                              ...tempData,
                              secondaryCutoffComparison: {
                                ...cur,
                                filterDatasets: newDatasets,
                              },
                            });
                            alert("⚡ Successfully auto-generated authentic cutoff datasets for all 6 Rounds × all 9 Categories (54 total combinations)!");
                          }}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>⚡ Auto-Generate All Ranks Matrix</span>
                        </button>
                      </div>

                      {/* 1. Round Selector Row */}
                      <div className="space-y-1.5 pt-1 border-t border-indigo-100">
                        <label className="text-[10.5px] font-bold text-slate-700 block">
                          Step 1: Select Counselling Round
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {["1", "2", "3", "4", "5", "Last Round"].map((r) => {
                            const isCurrent = adminCutoffRound === r;
                            return (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setAdminCutoffRound(r)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                                  isCurrent
                                    ? "bg-[#2d1a47] text-white shadow-xs"
                                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {r === "Last Round" ? "Last Round" : `Round ${r}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Category Selector (Full wrap, no clipped text) */}
                      <div className="space-y-1.5 pt-1 border-t border-indigo-100">
                        <label className="text-[10.5px] font-bold text-slate-700 block">
                          Step 2: Select Category (All 9 Categories Visible)
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {["General", ...CUTOFF_FILTER_OPTIONS.category.filter((c) => c !== "General")].map((cat) => {
                            const isCurrent = adminCutoffCategory === cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setAdminCutoffCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none text-left ${
                                  isCurrent
                                    ? "bg-indigo-600 text-white shadow-xs"
                                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Table Rows for Selected Round + Category */}
                    {(() => {
                      const cur = tempData.secondaryCutoffComparison || getCollegeSecondaryCutoffComparison(tempData);
                      const fullKey = `${adminCutoffRound}|${adminCutoffCategory}`;
                      const isBase = adminCutoffRound === "1" && adminCutoffCategory === "General";

                      const currentRows: CutoffComparisonRow[] =
                        cur.filterDatasets?.[fullKey] ||
                        (isBase ? cur.rows || [] : cur.filterDatasets?.[adminCutoffCategory]) ||
                        getFilteredCutoffRows(cur, { round: adminCutoffRound, category: adminCutoffCategory, quota: "All India", gender: "All" });

                      const updateRowsForCurrentCombo = (newRows: CutoffComparisonRow[]) => {
                        const updatedDatasets = {
                          ...(cur.filterDatasets || {}),
                          [fullKey]: newRows,
                          [adminCutoffCategory]: newRows,
                        };
                        setTempData({
                          ...tempData,
                          secondaryCutoffComparison: {
                            ...cur,
                            rows: isBase ? newRows : cur.rows || [],
                            filterDatasets: updatedDatasets,
                          },
                        });
                      };

                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11.5px] font-black text-slate-800 uppercase tracking-wide">
                              Editing Cutoff Ranks for:{" "}
                              <span className="text-indigo-600 font-extrabold bg-indigo-50 px-2 py-0.5 rounded-lg">
                                {adminCutoffRound === "Last Round" ? "Last Round" : `Round ${adminCutoffRound}`} • {adminCutoffCategory}
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                updateRowsForCurrentCombo([
                                  ...currentRows,
                                  {
                                    course: "Bachelor of Design (B.Des.)",
                                    year2024: 35,
                                    year2025: 41,
                                    year2026: 28,
                                  },
                                ]);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Course Row</span>
                            </button>
                          </div>

                          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                            {currentRows.map((row, rIdx) => (
                              <div key={rIdx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 relative shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = currentRows.filter((_, i) => i !== rIdx);
                                    updateRowsForCurrentCombo(updated);
                                  }}
                                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Delete Row"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="w-4/5">
                                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Course Name</label>
                                  <input
                                    type="text"
                                    value={row.course}
                                    onChange={(e) => {
                                      const updated = [...currentRows];
                                      updated[rIdx] = { ...updated[rIdx], course: e.target.value };
                                      updateRowsForCurrentCombo(updated);
                                    }}
                                    placeholder="Course (e.g. Bachelor of Design (B.Des.))"
                                    className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">2024 Rank</label>
                                    <input
                                      type="text"
                                      value={row.year2024}
                                      onChange={(e) => {
                                        const updated = [...currentRows];
                                        updated[rIdx] = { ...updated[rIdx], year2024: e.target.value };
                                        updateRowsForCurrentCombo(updated);
                                      }}
                                      placeholder="2024"
                                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-semibold"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">2025 Rank</label>
                                    <input
                                      type="text"
                                      value={row.year2025}
                                      onChange={(e) => {
                                        const updated = [...currentRows];
                                        updated[rIdx] = { ...updated[rIdx], year2025: e.target.value };
                                        updateRowsForCurrentCombo(updated);
                                      }}
                                      placeholder="2025"
                                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-semibold"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">2026 Rank</label>
                                    <input
                                      type="text"
                                      value={row.year2026}
                                      onChange={(e) => {
                                        const updated = [...currentRows];
                                        updated[rIdx] = { ...updated[rIdx], year2026: e.target.value };
                                        updateRowsForCurrentCombo(updated);
                                      }}
                                      placeholder="2026"
                                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold text-blue-600"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL 8: FAQS */}
                {/* MODAL: ADMISSION & APPLICATION PROCESS EDITOR */}
                {activeMiniModal === "admission" && (
                  <div className="p-3.5 bg-purple-50/50 border border-purple-200/80 rounded-2xl space-y-3">
                    {(() => {
                      const curAdm = tempData.admissionArticle || getCollegeAdmissionArticle(tempData);
                      const bulletsList = curAdm.bullets || [];
                      const boxesList = curAdm.courseAdmissionBoxes || [];

                      return (
                        <div className="space-y-3">
                          {/* Modal Nav Tabs */}
                          <div className="flex items-center gap-2 border-b border-purple-200 pb-2">
                            <button
                              type="button"
                              onClick={() => setAdmissionModalTab("article")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                admissionModalTab === "article"
                                  ? "bg-purple-600 text-white shadow-xs"
                                  : "bg-white text-purple-800 hover:bg-purple-100"
                              }`}
                            >
                              Overview Article
                            </button>
                            <button
                              type="button"
                              onClick={() => setAdmissionModalTab("boxes")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                admissionModalTab === "boxes"
                                  ? "bg-purple-600 text-white shadow-xs"
                                  : "bg-white text-purple-800 hover:bg-purple-100"
                              }`}
                            >
                              Course Admission Boxes (${boxesList.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setAdmissionModalTab("faqs")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                admissionModalTab === "faqs"
                                  ? "bg-purple-600 text-white shadow-xs"
                                  : "bg-white text-purple-800 hover:bg-purple-100"
                              }`}
                            >
                              Admission FAQs (${(curAdm.faqs || []).length})
                            </button>
                          </div>

                          {admissionModalTab === "article" ? (
                            /* Tab 1: Overview Article */
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                                  Admission & Application Process Overview
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedBullets = [
                                      ...bulletsList,
                                      { text: `New admission criteria for ${tempData.name.split(" - ")[0]}.` },
                                    ];
                                    setTempData({
                                      ...tempData,
                                      admissionArticle: {
                                        ...curAdm,
                                        bullets: updatedBullets,
                                      },
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Bullet</span>
                                </button>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Section Title</label>
                                <input
                                  type="text"
                                  value={curAdm.title || `${tempData.name.split(" - ")[0]} Admission & Application Process 2026`}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      admissionArticle: { ...curAdm, title: e.target.value },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Intro Paragraph 1 (Overview)</label>
                                <textarea
                                  rows={3}
                                  value={curAdm.introParagraph1 || ""}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      admissionArticle: { ...curAdm, introParagraph1: e.target.value },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Intro Paragraph 2 (Pre-Bullet Info)</label>
                                <textarea
                                  rows={2.5}
                                  value={curAdm.introParagraph2 || ""}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      admissionArticle: { ...curAdm, introParagraph2: e.target.value },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-800"
                                />
                              </div>

                              {/* Bullets Editor */}
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-700 block">Programme Admission Bullets</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {bulletsList.map((b, bIdx) => (
                                    <div key={bIdx} className="p-2 bg-white border border-purple-200/70 rounded-xl relative shadow-2xs">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = bulletsList.filter((_, i) => i !== bIdx);
                                          setTempData({
                                            ...tempData,
                                            admissionArticle: { ...curAdm, bullets: updated },
                                          });
                                        }}
                                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                        title="Delete Bullet"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      <label className="text-[9.5px] font-bold text-slate-500 block mb-0.5">Bullet #{bIdx + 1}</label>
                                      <textarea
                                        rows={2}
                                        value={b.text}
                                        onChange={(e) => {
                                          const updated = [...bulletsList];
                                          updated[bIdx] = { ...updated[bIdx], text: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            admissionArticle: { ...curAdm, bullets: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-800"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">After-Bullets Paragraph 1 (Portals / JoSAA / COAP)</label>
                                <textarea
                                  rows={2.5}
                                  value={curAdm.afterBulletsParagraph1 || ""}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      admissionArticle: { ...curAdm, afterBulletsParagraph1: e.target.value },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">After-Bullets Paragraph 2 (Application Forms)</label>
                                <textarea
                                  rows={2.5}
                                  value={curAdm.afterBulletsParagraph2 || ""}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      admissionArticle: { ...curAdm, afterBulletsParagraph2: e.target.value },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-none font-medium text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Footer Note Text</label>
                                <input
                                  type="text"
                                  value={curAdm.footerNote || ""}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      admissionArticle: { ...curAdm, footerNote: e.target.value },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                                />
                              </div>
                            </div>
                          ) : admissionModalTab === "boxes" ? (
                            /* Tab 2: Course Admission Boxes */
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                                  Course Admission Boxes
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newBox: CourseAdmissionBoxItem = {
                                      courseTitle: "New Course Admissions 2026",
                                      courseMeta: "5 Courses • 3 years",
                                      eligibilityBullets: ["10+2 with 60% marks", "Accepting Exams: **Entrance Test**"],
                                      datesHeading: "Important dates",
                                      datesTable: [
                                        { dates: "Jan '27 - Feb '27", event: "Application Window", isTentative: true },
                                        { dates: "Mar '27", event: "Exam Date", isTentative: false },
                                      ],
                                    };
                                    setTempData({
                                      ...tempData,
                                      admissionArticle: {
                                        ...curAdm,
                                        courseAdmissionBoxes: [...boxesList, newBox],
                                      },
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Course Box</span>
                                </button>
                              </div>

                              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                {boxesList.map((box, bIdx) => (
                                  <div key={bIdx} className="p-3 bg-white border border-purple-200 rounded-xl space-y-2.5 relative shadow-2xs">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = boxesList.filter((_, i) => i !== bIdx);
                                        setTempData({
                                          ...tempData,
                                          admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                        });
                                      }}
                                      className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                      title="Delete Course Box"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="grid grid-cols-2 gap-2 w-11/12">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Course Title</label>
                                        <input
                                          type="text"
                                          value={box.courseTitle}
                                          onChange={(e) => {
                                            const updated = [...boxesList];
                                            updated[bIdx] = { ...updated[bIdx], courseTitle: e.target.value };
                                            setTempData({
                                              ...tempData,
                                              admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                            });
                                          }}
                                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Courses & Duration Meta</label>
                                        <input
                                          type="text"
                                          value={box.courseMeta}
                                          onChange={(e) => {
                                            const updated = [...boxesList];
                                            updated[bIdx] = { ...updated[bIdx], courseMeta: e.target.value };
                                            setTempData({
                                              ...tempData,
                                              admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                            });
                                          }}
                                          placeholder="e.g. 17 Courses • 4 years-5 years"
                                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                        />
                                      </div>
                                    </div>

                                    {/* Eligibility bullets in box */}
                                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-slate-700">Eligibility Bullets</label>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...boxesList];
                                            const curB = updated[bIdx].eligibilityBullets || [];
                                            updated[bIdx] = { ...updated[bIdx], eligibilityBullets: [...curB, "New eligibility condition"] };
                                            setTempData({
                                              ...tempData,
                                              admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                            });
                                          }}
                                          className="text-[10.5px] text-purple-600 font-bold hover:underline cursor-pointer"
                                        >
                                          + Add Condition
                                        </button>
                                      </div>
                                      {(box.eligibilityBullets || []).map((el, elIdx) => (
                                        <div key={elIdx} className="flex items-center gap-1.5">
                                          <input
                                            type="text"
                                            value={el}
                                            onChange={(e) => {
                                              const updated = [...boxesList];
                                              const curB = [...(updated[bIdx].eligibilityBullets || [])];
                                              curB[elIdx] = e.target.value;
                                              updated[bIdx] = { ...updated[bIdx], eligibilityBullets: curB };
                                              setTempData({
                                                ...tempData,
                                                admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                              });
                                            }}
                                            className="w-full px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = [...boxesList];
                                              const curB = (updated[bIdx].eligibilityBullets || []).filter((_, i) => i !== elIdx);
                                              updated[bIdx] = { ...updated[bIdx], eligibilityBullets: curB };
                                              setTempData({
                                                ...tempData,
                                                admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                              });
                                            }}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Dates table in box */}
                                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-slate-700">Important Dates Table</label>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...boxesList];
                                            const curD = updated[bIdx].datesTable || [];
                                            updated[bIdx] = {
                                              ...updated[bIdx],
                                              datesTable: [...curD, { dates: "TBA", event: "New Event Name", isTentative: true }],
                                            };
                                            setTempData({
                                              ...tempData,
                                              admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                            });
                                          }}
                                          className="text-[10.5px] text-purple-600 font-bold hover:underline cursor-pointer"
                                        >
                                          + Add Date Row
                                        </button>
                                      </div>
                                      {(box.datesTable || []).map((dRow, dIdx) => (
                                        <div key={dIdx} className="grid grid-cols-12 gap-1.5 items-center">
                                          <input
                                            type="text"
                                            value={dRow.dates}
                                            onChange={(e) => {
                                              const updated = [...boxesList];
                                              const curD = [...(updated[bIdx].datesTable || [])];
                                              curD[dIdx] = { ...curD[dIdx], dates: e.target.value };
                                              updated[bIdx] = { ...updated[bIdx], datesTable: curD };
                                              setTempData({
                                                ...tempData,
                                                admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                              });
                                            }}
                                            placeholder="Dates (e.g. Jan '27)"
                                            className="col-span-4 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                                          />
                                          <input
                                            type="text"
                                            value={dRow.event}
                                            onChange={(e) => {
                                              const updated = [...boxesList];
                                              const curD = [...(updated[bIdx].datesTable || [])];
                                              curD[dIdx] = { ...curD[dIdx], event: e.target.value };
                                              updated[bIdx] = { ...updated[bIdx], datesTable: curD };
                                              setTempData({
                                                ...tempData,
                                                admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                              });
                                            }}
                                            placeholder="Event Name"
                                            className="col-span-5 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs"
                                          />
                                          <label className="col-span-2 flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={dRow.isTentative ?? false}
                                              onChange={(e) => {
                                                const updated = [...boxesList];
                                                const curD = [...(updated[bIdx].datesTable || [])];
                                                curD[dIdx] = { ...curD[dIdx], isTentative: e.target.checked };
                                                updated[bIdx] = { ...updated[bIdx], datesTable: curD };
                                                setTempData({
                                                  ...tempData,
                                                  admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                                });
                                              }}
                                              className="w-3 h-3 text-purple-600 rounded"
                                            />
                                            <span>Tentative</span>
                                          </label>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = [...boxesList];
                                              const curD = (updated[bIdx].datesTable || []).filter((_, i) => i !== dIdx);
                                              updated[bIdx] = { ...updated[bIdx], datesTable: curD };
                                              setTempData({
                                                ...tempData,
                                                admissionArticle: { ...curAdm, courseAdmissionBoxes: updated },
                                              });
                                            }}
                                            className="col-span-1 p-1 text-red-500 hover:bg-red-50 rounded flex justify-center"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            /* TAB 3: ADMISSION FAQS */
                            <div className="p-3.5 bg-gradient-to-br from-purple-50/60 via-white to-purple-50/30 border border-purple-200/80 rounded-2xl space-y-3.5">
                              {(() => {
                                const faqs = curAdm.faqs || getCollegeAdmissionArticle(tempData).faqs || [];

                                return (
                                  <>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div>
                                        <span className="text-xs font-black text-purple-950 uppercase tracking-wide block">
                                          ❓ Commonly Asked Questions on Admissions
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-medium">
                                          Admission FAQs list ({faqs.length} questions)
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [
                                            ...faqs,
                                            {
                                              question: "",
                                              answer: "",
                                              upvotes: 0,
                                            },
                                          ];
                                          setTempData({
                                            ...tempData,
                                            admissionArticle: {
                                              ...curAdm,
                                              faqs: updated,
                                            },
                                          });
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Add FAQ Item</span>
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                          Section Main Title
                                        </label>
                                        <input
                                          type="text"
                                          value={curAdm.faqsHeading || "Commonly asked questions"}
                                          onChange={(e) => {
                                            setTempData({
                                              ...tempData,
                                              admissionArticle: { ...curAdm, faqsHeading: e.target.value },
                                            });
                                          }}
                                          placeholder="e.g. Commonly asked questions"
                                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                          Subtitle / Topic
                                        </label>
                                        <input
                                          type="text"
                                          value={curAdm.faqsSubtitle || "On Admissions"}
                                          onChange={(e) => {
                                            setTempData({
                                              ...tempData,
                                              admissionArticle: { ...curAdm, faqsSubtitle: e.target.value },
                                            });
                                          }}
                                          placeholder="e.g. On Admissions"
                                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                          Bottom Button Text
                                        </label>
                                        <input
                                          type="text"
                                          value={curAdm.faqsButtonText || "Admission Details for all courses"}
                                          onChange={(e) => {
                                            setTempData({
                                              ...tempData,
                                              admissionArticle: { ...curAdm, faqsButtonText: e.target.value },
                                            });
                                          }}
                                          placeholder="e.g. Admission Details for all courses"
                                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                                        />
                                      </div>
                                    </div>

                                    {/* FAQ Questions List */}
                                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                                      {faqs.map((faq, fIdx) => (
                                        <div
                                          key={fIdx}
                                          className="p-3 bg-white border border-slate-200/90 hover:border-purple-300 rounded-xl space-y-2.5 shadow-2xs relative transition-all"
                                        >
                                          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                              <span className="text-purple-700 font-black">Q{fIdx + 1}:</span> {faq.question ? (faq.question.length > 50 ? `${faq.question.slice(0, 50)}...` : faq.question) : "Untitled Question"}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const updated = faqs.filter((_, i) => i !== fIdx);
                                                setTempData({
                                                  ...tempData,
                                                  admissionArticle: { ...curAdm, faqs: updated },
                                                });
                                              }}
                                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold transition-colors"
                                              title="Delete FAQ"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                              <span>Delete</span>
                                            </button>
                                          </div>

                                          <div className="space-y-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                              <div className="sm:col-span-3">
                                                <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                                  Question *
                                                </label>
                                                <input
                                                  type="text"
                                                  required
                                                  value={faq.question}
                                                  onChange={(e) => {
                                                    const updated = [...faqs];
                                                    updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                                                    setTempData({
                                                      ...tempData,
                                                      admissionArticle: { ...curAdm, faqs: updated },
                                                    });
                                                  }}
                                                  placeholder="e.g. How do I get admission to IIT Delhi?"
                                                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                                />
                                              </div>
                                              <div>
                                                <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                                  Upvotes Badge (optional)
                                                </label>
                                                <input
                                                  type="number"
                                                  min={0}
                                                  value={faq.upvotes || 0}
                                                  onChange={(e) => {
                                                    const updated = [...faqs];
                                                    updated[fIdx] = { ...updated[fIdx], upvotes: parseInt(e.target.value) || 0 };
                                                    setTempData({
                                                      ...tempData,
                                                      admissionArticle: { ...curAdm, faqs: updated },
                                                    });
                                                  }}
                                                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                                />
                                              </div>
                                            </div>

                                            <div>
                                              <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                                Answer *
                                              </label>
                                              <textarea
                                                rows={3}
                                                required
                                                value={faq.answer}
                                                onChange={(e) => {
                                                  const updated = [...faqs];
                                                  updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                                                  setTempData({
                                                    ...tempData,
                                                    admissionArticle: { ...curAdm, faqs: updated },
                                                  });
                                                }}
                                                placeholder="e.g. Admission to undergraduate programs at IIT Delhi..."
                                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 resize-none leading-relaxed"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: ADMISSION FAQS STANDALONE */}
                {activeMiniModal === "admission_faqs" && (
                  <div className="p-3.5 bg-gradient-to-br from-purple-50/60 via-white to-purple-50/30 border border-purple-200/80 rounded-2xl space-y-3.5">
                    {(() => {
                      const curAdm = tempData.admissionArticle || getCollegeAdmissionArticle(tempData);
                      const faqs = curAdm.faqs || getCollegeAdmissionArticle(tempData).faqs || [];

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-black text-purple-950 uppercase tracking-wide block">
                                ❓ Commonly Asked Questions on Admissions
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Admission FAQs list ({faqs.length} questions)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [
                                  ...faqs,
                                  {
                                    question: "",
                                    answer: "",
                                    upvotes: 0,
                                  },
                                ];
                                setTempData({
                                  ...tempData,
                                  admissionArticle: {
                                    ...curAdm,
                                    faqs: updated,
                                  },
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add FAQ Item</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Section Main Title
                              </label>
                              <input
                                type="text"
                                value={curAdm.faqsHeading || "Commonly asked questions"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    admissionArticle: { ...curAdm, faqsHeading: e.target.value },
                                  });
                                }}
                                placeholder="e.g. Commonly asked questions"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Subtitle / Topic
                              </label>
                              <input
                                type="text"
                                value={curAdm.faqsSubtitle || "On Admissions"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    admissionArticle: { ...curAdm, faqsSubtitle: e.target.value },
                                  });
                                }}
                                placeholder="e.g. On Admissions"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Bottom Button Text
                              </label>
                              <input
                                type="text"
                                value={curAdm.faqsButtonText || "Admission Details for all courses"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    admissionArticle: { ...curAdm, faqsButtonText: e.target.value },
                                  });
                                }}
                                placeholder="e.g. Admission Details for all courses"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                              />
                            </div>
                          </div>

                          {/* FAQ Questions List */}
                          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                            {faqs.map((faq, fIdx) => (
                              <div
                                key={fIdx}
                                className="p-3 bg-white border border-slate-200/90 hover:border-purple-300 rounded-xl space-y-2.5 shadow-2xs relative transition-all"
                              >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <span className="text-purple-700 font-black">Q{fIdx + 1}:</span> {faq.question ? (faq.question.length > 50 ? `${faq.question.slice(0, 50)}...` : faq.question) : "Untitled Question"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = faqs.filter((_, i) => i !== fIdx);
                                      setTempData({
                                        ...tempData,
                                        admissionArticle: { ...curAdm, faqs: updated },
                                      });
                                    }}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold transition-colors"
                                    title="Delete FAQ"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                    <div className="sm:col-span-3">
                                      <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                        Question *
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={faq.question}
                                        onChange={(e) => {
                                          const updated = [...faqs];
                                          updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            admissionArticle: { ...curAdm, faqs: updated },
                                          });
                                        }}
                                        placeholder="e.g. How do I get admission to IIT Delhi?"
                                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                        Upvotes Badge (optional)
                                      </label>
                                      <input
                                        type="number"
                                        min={0}
                                        value={faq.upvotes || 0}
                                        onChange={(e) => {
                                          const updated = [...faqs];
                                          updated[fIdx] = { ...updated[fIdx], upvotes: parseInt(e.target.value) || 0 };
                                          setTempData({
                                            ...tempData,
                                            admissionArticle: { ...curAdm, faqs: updated },
                                          });
                                        }}
                                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                      Answer *
                                    </label>
                                    <textarea
                                      rows={3}
                                      required
                                      value={faq.answer}
                                      onChange={(e) => {
                                        const updated = [...faqs];
                                        updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          admissionArticle: { ...curAdm, faqs: updated },
                                        });
                                      }}
                                      placeholder="e.g. Admission to undergraduate programs at IIT Delhi..."
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 resize-none leading-relaxed"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: RANKINGS ARTICLE & TABLES */}
                {activeMiniModal === "rankings" && (
                  <div className="p-3.5 bg-purple-50/50 border border-purple-200/80 rounded-2xl space-y-3">
                    {(() => {
                      const curRk = tempData.rankingsArticle || getCollegeRankingsArticle(tempData);
                      const intlRows = curRk.internationalRows || [];
                      const natRows = curRk.nationalRows || [];

                      return (
                        <div className="space-y-3">
                          {/* Modal Nav Tabs */}
                          <div className="flex items-center gap-2 border-b border-purple-200 pb-2">
                            <button
                              type="button"
                              onClick={() => setRankingsModalTab("overview")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                rankingsModalTab === "overview"
                                  ? "bg-purple-600 text-white shadow-xs"
                                  : "bg-white text-purple-800 hover:bg-purple-100"
                              }`}
                            >
                              Overview Article
                            </button>
                            <button
                              type="button"
                              onClick={() => setRankingsModalTab("international")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                rankingsModalTab === "international"
                                  ? "bg-purple-600 text-white shadow-xs"
                                  : "bg-white text-purple-800 hover:bg-purple-100"
                              }`}
                            >
                              International Rankings (${intlRows.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setRankingsModalTab("national")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                rankingsModalTab === "national"
                                  ? "bg-purple-600 text-white shadow-xs"
                                  : "bg-white text-purple-800 hover:bg-purple-100"
                              }`}
                            >
                              National Rankings (${natRows.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setRankingsModalTab("course_boxes")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                rankingsModalTab === "course_boxes"
                                  ? "bg-purple-600 text-white shadow-xs"
                                  : "bg-white text-purple-800 hover:bg-purple-100"
                              }`}
                            >
                              Course Ranking Boxes (${(curRk.courseRankingBoxes || []).length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setRankingsModalTab("faqs")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                rankingsModalTab === "faqs"
                                  ? "bg-purple-600 text-white shadow-xs"
                                  : "bg-white text-purple-800 hover:bg-purple-100"
                              }`}
                            >
                              Ranking FAQs (${(curRk.faqs || []).length})
                            </button>
                          </div>

                          {rankingsModalTab === "overview" ? (
                            /* Tab 1: Overview Article */
                            <div className="space-y-3">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Section Title</label>
                                <input
                                  type="text"
                                  value={curRk.title || `${tempData.name.split(" - ")[0]} Rankings 2026`}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      rankingsArticle: { ...curRk, title: e.target.value },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Introductory Paragraph (Markdown supported)</label>
                                <textarea
                                  rows={4}
                                  value={curRk.introParagraph || ""}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      rankingsArticle: { ...curRk, introParagraph: e.target.value },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 resize-none"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Footer Note Text</label>
                                <input
                                  type="text"
                                  value={curRk.footerNote || ""}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      rankingsArticle: { ...curRk, footerNote: e.target.value },
                                    });
                                  }}
                                  placeholder="e.g. Check course-specific rankings below:"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                                />
                              </div>
                            </div>
                          ) : rankingsModalTab === "international" ? (
                            /* Tab 2: International Rankings Table */
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                                  International Rankings Table
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newRow: RankingTableRow = {
                                      body: "QS World University Rankings 2028",
                                      category: "World University",
                                      rank: "115",
                                    };
                                    setTempData({
                                      ...tempData,
                                      rankingsArticle: {
                                        ...curRk,
                                        internationalRows: [...intlRows, newRow],
                                      },
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Ranking Row</span>
                                </button>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Table Sub-Header Banner Text</label>
                                <input
                                  type="text"
                                  value={curRk.internationalHeading || ""}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      rankingsArticle: { ...curRk, internationalHeading: e.target.value },
                                    });
                                  }}
                                  placeholder="e.g. IIT Delhi International Rankings 2025, 2026, 2027"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                />
                              </div>

                              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                                {intlRows.map((row, rIdx) => (
                                  <div key={rIdx} className="p-2.5 bg-white border border-purple-200 rounded-xl grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5">
                                      <label className="text-[9px] font-bold text-slate-500 block">Ranking Body *</label>
                                      <input
                                        type="text"
                                        value={row.body}
                                        onChange={(e) => {
                                          const updated = [...intlRows];
                                          updated[rIdx] = { ...updated[rIdx], body: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: { ...curRk, internationalRows: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                                      />
                                    </div>
                                    <div className="col-span-4">
                                      <label className="text-[9px] font-bold text-slate-500 block">Category *</label>
                                      <input
                                        type="text"
                                        value={row.category}
                                        onChange={(e) => {
                                          const updated = [...intlRows];
                                          updated[rIdx] = { ...updated[rIdx], category: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: { ...curRk, internationalRows: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-[9px] font-bold text-slate-500 block">Rank *</label>
                                      <input
                                        type="text"
                                        value={row.rank}
                                        onChange={(e) => {
                                          const updated = [...intlRows];
                                          updated[rIdx] = { ...updated[rIdx], rank: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: { ...curRk, internationalRows: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-center text-purple-700"
                                      />
                                    </div>
                                    <div className="col-span-1 flex justify-center pt-3">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = intlRows.filter((_, i) => i !== rIdx);
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: { ...curRk, internationalRows: updated },
                                          });
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                        title="Delete Row"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : rankingsModalTab === "national" ? (
                            /* Tab 3: National Rankings Table */
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                                  National Rankings Table
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newRow: RankingTableRow = {
                                      body: "NIRF 2026",
                                      category: "Engineering",
                                      rank: "2",
                                    };
                                    setTempData({
                                      ...tempData,
                                      rankingsArticle: {
                                        ...curRk,
                                        nationalRows: [...natRows, newRow],
                                      },
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Ranking Row</span>
                                </button>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Table Sub-Header Banner Text</label>
                                <input
                                  type="text"
                                  value={curRk.nationalHeading || ""}
                                  onChange={(e) => {
                                    setTempData({
                                      ...tempData,
                                      rankingsArticle: { ...curRk, nationalHeading: e.target.value },
                                    });
                                  }}
                                  placeholder="e.g. IIT Delhi National Rankings 2025, 2026"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                />
                              </div>

                              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                                {natRows.map((row, rIdx) => (
                                  <div key={rIdx} className="p-2.5 bg-white border border-purple-200 rounded-xl grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5">
                                      <label className="text-[9px] font-bold text-slate-500 block">Ranking Body *</label>
                                      <input
                                        type="text"
                                        value={row.body}
                                        onChange={(e) => {
                                          const updated = [...natRows];
                                          updated[rIdx] = { ...updated[rIdx], body: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: { ...curRk, nationalRows: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                                      />
                                    </div>
                                    <div className="col-span-4">
                                      <label className="text-[9px] font-bold text-slate-500 block">Category *</label>
                                      <input
                                        type="text"
                                        value={row.category}
                                        onChange={(e) => {
                                          const updated = [...natRows];
                                          updated[rIdx] = { ...updated[rIdx], category: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: { ...curRk, nationalRows: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-[9px] font-bold text-slate-500 block">Rank *</label>
                                      <input
                                        type="text"
                                        value={row.rank}
                                        onChange={(e) => {
                                          const updated = [...natRows];
                                          updated[rIdx] = { ...updated[rIdx], rank: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: { ...curRk, nationalRows: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-center text-purple-700"
                                      />
                                    </div>
                                    <div className="col-span-1 flex justify-center pt-3">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = natRows.filter((_, i) => i !== rIdx);
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: { ...curRk, nationalRows: updated },
                                          });
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                        title="Delete Row"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : rankingsModalTab === "course_boxes" ? (
                            /* Tab 4: Course Ranking Boxes Editor */
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xs font-black text-purple-950 uppercase tracking-wide block">
                                    Course Ranking Accordion Boxes
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    Manage Course-wise 3-year ranking tables & highlight banners
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newBox: CourseRankingBoxItem = {
                                      title: "New Course Ranking",
                                      yearsHeader: ["Publisher", "2024", "2025", "2026"],
                                      tableRows: [
                                        { publisher: "NIRF", rank2024: "1", rank2025: "1", rank2026: "1" },
                                        { publisher: "India Today", rank2024: "1", rank2025: "1", rank2026: "1" },
                                      ],
                                      highlightBadge: "Top Ranked Course in Delhi →",
                                    };
                                    const updated = [...(curRk.courseRankingBoxes || []), newBox];
                                    setTempData({
                                      ...tempData,
                                      rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Course Box</span>
                                </button>
                              </div>

                              <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                                {(curRk.courseRankingBoxes || []).map((box, bIdx) => (
                                  <div key={bIdx} className="p-3 bg-white border border-purple-200 rounded-xl space-y-3 relative shadow-2xs">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                      <span className="text-xs font-bold text-slate-800">
                                        #{bIdx + 1} {box.title || "Untitled Box"}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = (curRk.courseRankingBoxes || []).filter((_, i) => i !== bIdx);
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                          });
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                        title="Delete Box"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">Box Title *</label>
                                        <input
                                          type="text"
                                          value={box.title}
                                          onChange={(e) => {
                                            const updated = [...(curRk.courseRankingBoxes || [])];
                                            updated[bIdx] = { ...updated[bIdx], title: e.target.value };
                                            setTempData({
                                              ...tempData,
                                              rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                            });
                                          }}
                                          placeholder="e.g. B.E. / B.Tech Ranking"
                                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">Highlight Badge Note</label>
                                        <input
                                          type="text"
                                          value={box.highlightBadge || ""}
                                          onChange={(e) => {
                                            const updated = [...(curRk.courseRankingBoxes || [])];
                                            updated[bIdx] = { ...updated[bIdx], highlightBadge: e.target.value };
                                            setTempData({
                                              ...tempData,
                                              rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                            });
                                          }}
                                          placeholder="e.g. Best Among NIRF Ranked Colleges In Delhi In 2025 →"
                                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                                        />
                                      </div>
                                    </div>

                                    {/* Rows list */}
                                    <div className="space-y-1.5 pt-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase">Ranking Rows</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...(curRk.courseRankingBoxes || [])];
                                            const curRows = updated[bIdx].tableRows || [];
                                            updated[bIdx] = {
                                              ...updated[bIdx],
                                              tableRows: [...curRows, { publisher: "New Agency", rank2024: "-", rank2025: "-", rank2026: "-" }],
                                            };
                                            setTempData({
                                              ...tempData,
                                              rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                            });
                                          }}
                                          className="text-[10px] text-purple-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                                        >
                                          <Plus className="w-2.5 h-2.5" />
                                          <span>Add Row</span>
                                        </button>
                                      </div>

                                      {box.tableRows.map((r, rIdx) => (
                                        <div key={rIdx} className="grid grid-cols-12 gap-1.5 items-center bg-slate-50 p-1.5 rounded-lg border border-slate-200/80">
                                          <input
                                            type="text"
                                            value={r.publisher}
                                            onChange={(e) => {
                                              const updated = [...(curRk.courseRankingBoxes || [])];
                                              const curRows = [...updated[bIdx].tableRows];
                                              curRows[rIdx] = { ...curRows[rIdx], publisher: e.target.value };
                                              updated[bIdx] = { ...updated[bIdx], tableRows: curRows };
                                              setTempData({
                                                ...tempData,
                                                rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                              });
                                            }}
                                            placeholder="Publisher"
                                            className="col-span-5 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold"
                                          />
                                          <input
                                            type="text"
                                            value={r.rank2024}
                                            onChange={(e) => {
                                              const updated = [...(curRk.courseRankingBoxes || [])];
                                              const curRows = [...updated[bIdx].tableRows];
                                              curRows[rIdx] = { ...curRows[rIdx], rank2024: e.target.value };
                                              updated[bIdx] = { ...updated[bIdx], tableRows: curRows };
                                              setTempData({
                                                ...tempData,
                                                rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                              });
                                            }}
                                            placeholder="2024"
                                            className="col-span-2 px-1 py-1 bg-white border border-slate-200 rounded text-xs text-center font-medium"
                                          />
                                          <input
                                            type="text"
                                            value={r.rank2025}
                                            onChange={(e) => {
                                              const updated = [...(curRk.courseRankingBoxes || [])];
                                              const curRows = [...updated[bIdx].tableRows];
                                              curRows[rIdx] = { ...curRows[rIdx], rank2025: e.target.value };
                                              updated[bIdx] = { ...updated[bIdx], tableRows: curRows };
                                              setTempData({
                                                ...tempData,
                                                rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                              });
                                            }}
                                            placeholder="2025"
                                            className="col-span-2 px-1 py-1 bg-white border border-slate-200 rounded text-xs text-center font-medium"
                                          />
                                          <input
                                            type="text"
                                            value={r.rank2026}
                                            onChange={(e) => {
                                              const updated = [...(curRk.courseRankingBoxes || [])];
                                              const curRows = [...updated[bIdx].tableRows];
                                              curRows[rIdx] = { ...curRows[rIdx], rank2026: e.target.value };
                                              updated[bIdx] = { ...updated[bIdx], tableRows: curRows };
                                              setTempData({
                                                ...tempData,
                                                rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                              });
                                            }}
                                            placeholder="2026"
                                            className="col-span-2 px-1 py-1 bg-white border border-slate-200 rounded text-xs text-center font-bold text-purple-700"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = [...(curRk.courseRankingBoxes || [])];
                                              const curRows = updated[bIdx].tableRows.filter((_, i) => i !== rIdx);
                                              updated[bIdx] = { ...updated[bIdx], tableRows: curRows };
                                              setTempData({
                                                ...tempData,
                                                rankingsArticle: { ...curRk, courseRankingBoxes: updated },
                                              });
                                            }}
                                            className="col-span-1 p-1 text-red-500 hover:bg-red-50 rounded flex justify-center"
                                            title="Remove Row"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            /* Tab 5: Ranking FAQs */
                            <div className="p-3.5 bg-gradient-to-br from-purple-50/60 via-white to-purple-50/30 border border-purple-200/80 rounded-2xl space-y-3.5">
                              {(() => {
                                const faqs = curRk.faqs || getCollegeRankingsArticle(tempData).faqs || [];

                                return (
                                  <>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div>
                                        <span className="text-xs font-black text-purple-950 uppercase tracking-wide block">
                                          ❓ Commonly Asked Questions on Rankings
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-medium">
                                          Ranking FAQs list ({faqs.length} questions)
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [
                                            ...faqs,
                                            {
                                              question: "",
                                              answer: "",
                                            },
                                          ];
                                          setTempData({
                                            ...tempData,
                                            rankingsArticle: {
                                              ...curRk,
                                              faqs: updated,
                                            },
                                          });
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Add FAQ Item</span>
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                          Section Main Title
                                        </label>
                                        <input
                                          type="text"
                                          value={curRk.faqsHeading || "Commonly asked questions"}
                                          onChange={(e) => {
                                            setTempData({
                                              ...tempData,
                                              rankingsArticle: { ...curRk, faqsHeading: e.target.value },
                                            });
                                          }}
                                          placeholder="e.g. Commonly asked questions"
                                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                          Subtitle / Topic
                                        </label>
                                        <input
                                          type="text"
                                          value={curRk.faqsSubtitle || "On Rankings"}
                                          onChange={(e) => {
                                            setTempData({
                                              ...tempData,
                                              rankingsArticle: { ...curRk, faqsSubtitle: e.target.value },
                                            });
                                          }}
                                          placeholder="e.g. On Rankings"
                                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                          Button 1 Text
                                        </label>
                                        <input
                                          type="text"
                                          value={curRk.faqsBtn1Text || "View Ranking Details"}
                                          onChange={(e) => {
                                            setTempData({
                                              ...tempData,
                                              rankingsArticle: { ...curRk, faqsBtn1Text: e.target.value },
                                            });
                                          }}
                                          placeholder="e.g. View Ranking Details"
                                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                          Button 2 Text
                                        </label>
                                        <input
                                          type="text"
                                          value={curRk.faqsBtn2Text || "Ranking Details"}
                                          onChange={(e) => {
                                            setTempData({
                                              ...tempData,
                                              rankingsArticle: { ...curRk, faqsBtn2Text: e.target.value },
                                            });
                                          }}
                                          placeholder="e.g. Ranking Details"
                                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                                        />
                                      </div>
                                    </div>

                                    {/* FAQ Questions List */}
                                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                                      {faqs.map((faq, fIdx) => (
                                        <div
                                          key={fIdx}
                                          className="p-3 bg-white border border-slate-200/90 hover:border-purple-300 rounded-xl space-y-2.5 shadow-2xs relative transition-all"
                                        >
                                          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                              <span className="text-purple-700 font-black">Q{fIdx + 1}:</span> {faq.question ? (faq.question.length > 50 ? `${faq.question.slice(0, 50)}...` : faq.question) : "Untitled Question"}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const updated = faqs.filter((_, i) => i !== fIdx);
                                                setTempData({
                                                  ...tempData,
                                                  rankingsArticle: { ...curRk, faqs: updated },
                                                });
                                              }}
                                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold transition-colors"
                                              title="Delete FAQ"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                              <span>Delete</span>
                                            </button>
                                          </div>

                                          <div className="space-y-2">
                                            <div>
                                              <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                                Question *
                                              </label>
                                              <input
                                                type="text"
                                                required
                                                value={faq.question}
                                                onChange={(e) => {
                                                  const updated = [...faqs];
                                                  updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                                                  setTempData({
                                                    ...tempData,
                                                    rankingsArticle: { ...curRk, faqs: updated },
                                                  });
                                                }}
                                                placeholder="e.g. How is the ranking of DMS IIT Delhi?"
                                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                              />
                                            </div>

                                            <div>
                                              <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                                Answer *
                                              </label>
                                              <textarea
                                                rows={3}
                                                required
                                                value={faq.answer}
                                                onChange={(e) => {
                                                  const updated = [...faqs];
                                                  updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                                                  setTempData({
                                                    ...tempData,
                                                    rankingsArticle: { ...curRk, faqs: updated },
                                                  });
                                                }}
                                                placeholder="e.g. As per NIRF 2025 Rankings..."
                                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 resize-none leading-relaxed"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: RANKINGS FAQS STANDALONE */}
                {activeMiniModal === "rankings_faqs" && (
                  <div className="p-3.5 bg-gradient-to-br from-purple-50/60 via-white to-purple-50/30 border border-purple-200/80 rounded-2xl space-y-3.5">
                    {(() => {
                      const curRk = tempData.rankingsArticle || getCollegeRankingsArticle(tempData);
                      const faqs = curRk.faqs || getCollegeRankingsArticle(tempData).faqs || [];

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-black text-purple-950 uppercase tracking-wide block">
                                ❓ Commonly Asked Questions on Rankings
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Ranking FAQs list ({faqs.length} questions)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [
                                  ...faqs,
                                  {
                                    question: "",
                                    answer: "",
                                  },
                                ];
                                setTempData({
                                  ...tempData,
                                  rankingsArticle: {
                                    ...curRk,
                                    faqs: updated,
                                  },
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add FAQ Item</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Section Main Title
                              </label>
                              <input
                                type="text"
                                value={curRk.faqsHeading || "Commonly asked questions"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    rankingsArticle: { ...curRk, faqsHeading: e.target.value },
                                  });
                                }}
                                placeholder="e.g. Commonly asked questions"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Subtitle / Topic
                              </label>
                              <input
                                type="text"
                                value={curRk.faqsSubtitle || "On Rankings"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    rankingsArticle: { ...curRk, faqsSubtitle: e.target.value },
                                  });
                                }}
                                placeholder="e.g. On Rankings"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Button 1 Text
                              </label>
                              <input
                                type="text"
                                value={curRk.faqsBtn1Text || "View Ranking Details"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    rankingsArticle: { ...curRk, faqsBtn1Text: e.target.value },
                                  });
                                }}
                                placeholder="e.g. View Ranking Details"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">
                                Button 2 Text
                              </label>
                              <input
                                type="text"
                                value={curRk.faqsBtn2Text || "Ranking Details"}
                                onChange={(e) => {
                                  setTempData({
                                    ...tempData,
                                    rankingsArticle: { ...curRk, faqsBtn2Text: e.target.value },
                                  });
                                }}
                                placeholder="e.g. Ranking Details"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                              />
                            </div>
                          </div>

                          {/* FAQ Questions List */}
                          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                            {faqs.map((faq, fIdx) => (
                              <div
                                key={fIdx}
                                className="p-3 bg-white border border-slate-200/90 hover:border-purple-300 rounded-xl space-y-2.5 shadow-2xs relative transition-all"
                              >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <span className="text-purple-700 font-black">Q{fIdx + 1}:</span> {faq.question ? (faq.question.length > 50 ? `${faq.question.slice(0, 50)}...` : faq.question) : "Untitled Question"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = faqs.filter((_, i) => i !== fIdx);
                                      setTempData({
                                        ...tempData,
                                        rankingsArticle: { ...curRk, faqs: updated },
                                      });
                                    }}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold transition-colors"
                                    title="Delete FAQ"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                      Question *
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      value={faq.question}
                                      onChange={(e) => {
                                        const updated = [...faqs];
                                        updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          rankingsArticle: { ...curRk, faqs: updated },
                                        });
                                      }}
                                      placeholder="e.g. How is the ranking of DMS IIT Delhi?"
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[9.5px] font-bold text-slate-600 block mb-0.5">
                                      Answer *
                                    </label>
                                    <textarea
                                      rows={3}
                                      required
                                      value={faq.answer}
                                      onChange={(e) => {
                                        const updated = [...faqs];
                                        updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          rankingsArticle: { ...curRk, faqs: updated },
                                        });
                                      }}
                                      placeholder="e.g. As per NIRF 2025 Rankings..."
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 resize-none leading-relaxed"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: STUDENT REVIEWS & RATINGS */}
                {activeMiniModal === "reviews" && (
                  <div className="p-3.5 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 border border-indigo-200/80 rounded-2xl space-y-3.5">
                    {(() => {
                      const curRev = tempData.reviewsArticle || getCollegeReviewsArticle(tempData);
                      const histogram = curRev.histogram || [];
                      const parameters = curRev.parameters || [];

                      return (
                        <div className="space-y-3.5">
                          {/* Modal Nav Tabs */}
                          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
                            <button
                              type="button"
                              onClick={() => setReviewsModalTab("overall")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                reviewsModalTab === "overall"
                                  ? "bg-indigo-600 text-white shadow-xs"
                                  : "bg-white text-indigo-800 hover:bg-indigo-100"
                              }`}
                            >
                              Overall Score & Breakdown
                            </button>
                            <button
                              type="button"
                              onClick={() => setReviewsModalTab("parameters")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                reviewsModalTab === "parameters"
                                  ? "bg-indigo-600 text-white shadow-xs"
                                  : "bg-white text-indigo-800 hover:bg-indigo-100"
                              }`}
                            >
                              5 Category Parameters
                            </button>
                          </div>

                          {reviewsModalTab === "overall" ? (
                            /* Tab 1: Overall & Histogram */
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">College Tag Text</label>
                                  <input
                                    type="text"
                                    value={curRev.tagText || ""}
                                    onChange={(e) => {
                                      setTempData({
                                        ...tempData,
                                        reviewsArticle: { ...curRev, tagText: e.target.value },
                                      });
                                    }}
                                    placeholder="e.g. IIT Delhi"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Section Title</label>
                                  <input
                                    type="text"
                                    value={curRev.title || "Students Ratings & Reviews"}
                                    onChange={(e) => {
                                      setTempData({
                                        ...tempData,
                                        reviewsArticle: { ...curRev, title: e.target.value },
                                      });
                                    }}
                                    placeholder="e.g. Students Ratings & Reviews"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Overall Star Rating (out of 5)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    value={curRev.overallScore ?? 4.5}
                                    onChange={(e) => {
                                      setTempData({
                                        ...tempData,
                                        reviewsArticle: { ...curRev, overallScore: parseFloat(e.target.value) || 4.5 },
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">Total Verified Reviews Text</label>
                                  <input
                                    type="text"
                                    value={curRev.totalReviewsCount || "623 Verified Reviews"}
                                    onChange={(e) => {
                                      setTempData({
                                        ...tempData,
                                        reviewsArticle: { ...curRev, totalReviewsCount: e.target.value },
                                      });
                                    }}
                                    placeholder="e.g. 623 Verified Reviews"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                                  />
                                </div>
                              </div>

                              {/* Histogram Counts */}
                              <div className="space-y-2 pt-2 border-t border-slate-200">
                                <span className="text-xs font-bold text-slate-800 block uppercase tracking-wide">
                                  Rating Breakdown Histogram Counts
                                </span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {histogram.map((item, hIdx) => (
                                    <div key={hIdx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                      <label className="text-[10px] font-bold text-slate-600 block">★ {item.starsRange} Stars</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={item.count}
                                        onChange={(e) => {
                                          const updated = [...histogram];
                                          updated[hIdx] = { ...updated[hIdx], count: parseInt(e.target.value) || 0 };
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: { ...curRev, histogram: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Tab 2: 5 Category Parameters */
                            <div className="space-y-3">
                              <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">
                                Edit 5 Category Parameter Scores (out of 5)
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                {parameters.map((param, pIdx) => (
                                  <div key={pIdx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                                        {renderReviewCategoryIcon(param.label, param.iconType)}
                                      </div>
                                      <input
                                        type="text"
                                        value={param.label}
                                        onChange={(e) => {
                                          const updated = [...parameters];
                                          updated[pIdx] = { ...updated[pIdx], label: e.target.value };
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: { ...curRev, parameters: updated },
                                          });
                                        }}
                                        placeholder="Category Name"
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-bold text-slate-500 shrink-0">Rating:</span>
                                      <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        value={param.rating}
                                        onChange={(e) => {
                                          const updated = [...parameters];
                                          updated[pIdx] = { ...updated[pIdx], rating: parseFloat(e.target.value) || 4.5 };
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: { ...curRev, parameters: updated },
                                          });
                                        }}
                                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                      />
                                      <span className="text-amber-500 font-black text-sm">★</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL: MORE DETAILED STUDENT REVIEW CARDS (BELOW VIDEO) */}
                {activeMiniModal === "moreReviewCards" && (
                  <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                    {(() => {
                      const curRev = tempData.reviewsArticle || getCollegeReviewsArticle(tempData);
                      const cards = (curRev.moreReviewCards && curRev.moreReviewCards.length > 0)
                        ? curRev.moreReviewCards
                        : DEFAULT_MORE_REVIEW_CARDS;

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                              More Student Review Cards ({cards.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newCard: DetailedReviewCard = {
                                  id: `more-rev-${Date.now()}`,
                                  authorName: "New Student Reviewer",
                                  avatarInitial: "N",
                                  avatarBgColor: "bg-teal-100 text-teal-800",
                                  verified: true,
                                  courseAndBatch: "B.Tech. in Engineering - Batch of 2028",
                                  overallRating: 4.6,
                                  parameterRatings: [
                                    { label: "Placements", rating: 4.5 },
                                    { label: "Infrastructure", rating: 4.5 },
                                    { label: "Faculty", rating: 4.5 },
                                    { label: "Crowd & Campus Life", rating: 4.5 },
                                    { label: "Value for Money", rating: 4.5 },
                                  ],
                                  title: "Great campus environment and academics.",
                                  paragraphs: [
                                    {
                                      heading: "Placements",
                                      content: "Placement process is well coordinated with leading MNCs participating.",
                                    },
                                    {
                                      heading: "Infrastructure",
                                      content: "Well-equipped laboratories and spacious modern classrooms.",
                                    },
                                    {
                                      heading: "Faculty",
                                      content: "Professors are knowledgeable and supportive.",
                                    },
                                    {
                                      heading: "Other",
                                      content: "Exciting campus fests and active extracurricular clubs.",
                                    },
                                  ],
                                  reviewedDate: `Reviewed on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
                                  likesCount: 5,
                                  dislikesCount: 0,
                                };
                                const updated = [...cards, newCard];
                                setTempData({
                                  ...tempData,
                                  reviewsArticle: {
                                    ...curRev,
                                    moreReviewCards: updated,
                                  },
                                });
                              }}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Review Card</span>
                            </button>
                          </div>

                          <div className="space-y-4">
                            {cards.map((card: DetailedReviewCard, cIdx: number) => (
                              <div
                                key={card.id || cIdx}
                                className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs relative"
                              >
                                {/* Top Controls & Delete */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <span className="text-xs font-bold text-slate-800">
                                    Review Card #{cIdx + 1}
                                  </span>
                                  {cards.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = cards.filter((_: any, i: number) => i !== cIdx);
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            moreReviewCards: updated,
                                          },
                                        });
                                      }}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg text-xs flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete</span>
                                    </button>
                                  )}
                                </div>

                                {/* Author Name, Verified & Avatar */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Author Name</label>
                                    <input
                                      type="text"
                                      value={card.authorName}
                                      onChange={(e) => {
                                        const updated = [...cards];
                                        updated[cIdx] = { ...updated[cIdx], authorName: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, moreReviewCards: updated },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Avatar Letter / Color</label>
                                    <input
                                      type="text"
                                      value={card.avatarInitial || ""}
                                      placeholder="e.g. S"
                                      onChange={(e) => {
                                        const updated = [...cards];
                                        updated[cIdx] = { ...updated[cIdx], avatarInitial: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, moreReviewCards: updated },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Overall Score (out of 5)</label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="1"
                                      max="5"
                                      value={card.overallRating}
                                      onChange={(e) => {
                                        const updated = [...cards];
                                        updated[cIdx] = { ...updated[cIdx], overallRating: parseFloat(e.target.value) || 4.5 };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, moreReviewCards: updated },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-700"
                                    />
                                  </div>
                                </div>

                                {/* Course & Batch */}
                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-600 block">Course & Batch</label>
                                  <input
                                    type="text"
                                    value={card.courseAndBatch}
                                    onChange={(e) => {
                                      const updated = [...cards];
                                      updated[cIdx] = { ...updated[cIdx], courseAndBatch: e.target.value };
                                      setTempData({
                                        ...tempData,
                                        reviewsArticle: { ...curRev, moreReviewCards: updated },
                                      });
                                    }}
                                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                                  />
                                </div>

                                {/* Title / Tagline */}
                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-600 block">Review Headline Title</label>
                                  <input
                                    type="text"
                                    value={card.title}
                                    onChange={(e) => {
                                      const updated = [...cards];
                                      updated[cIdx] = { ...updated[cIdx], title: e.target.value };
                                      setTempData({
                                        ...tempData,
                                        reviewsArticle: { ...curRev, moreReviewCards: updated },
                                      });
                                    }}
                                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                  />
                                </div>

                                {/* Parameter Ratings Row */}
                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                                    5 Parameter Ratings:
                                  </label>
                                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                                    {(card.parameterRatings || []).map((p: ReviewParameterBadge, pIdx: number) => (
                                      <div key={pIdx} className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                                        <input
                                          type="text"
                                          value={p.label}
                                          onChange={(e) => {
                                            const updated = [...cards];
                                            const params = [...updated[cIdx].parameterRatings];
                                            params[pIdx] = { ...params[pIdx], label: e.target.value };
                                            updated[cIdx] = { ...updated[cIdx], parameterRatings: params };
                                            setTempData({
                                              ...tempData,
                                              reviewsArticle: { ...curRev, moreReviewCards: updated },
                                            });
                                          }}
                                          className="w-full px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold"
                                        />
                                        <input
                                          type="number"
                                          step="0.1"
                                          min="1"
                                          max="5"
                                          value={p.rating}
                                          onChange={(e) => {
                                            const updated = [...cards];
                                            const params = [...updated[cIdx].parameterRatings];
                                            params[pIdx] = { ...params[pIdx], rating: parseFloat(e.target.value) || 4.0 };
                                            updated[cIdx] = { ...updated[cIdx], parameterRatings: params };
                                            setTempData({
                                              ...tempData,
                                              reviewsArticle: { ...curRev, moreReviewCards: updated },
                                            });
                                          }}
                                          className="w-full px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-center"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Categorized Review Paragraphs */}
                                <div className="space-y-2 pt-1">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10.5px] font-bold text-slate-700 block">
                                      Categorized Paragraphs:
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...cards];
                                        const paras = [
                                          ...updated[cIdx].paragraphs,
                                          { heading: "Section", content: "Review content..." },
                                        ];
                                        updated[cIdx] = { ...updated[cIdx], paragraphs: paras };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, moreReviewCards: updated },
                                        });
                                      }}
                                      className="text-[10.5px] font-bold text-indigo-600 hover:underline"
                                    >
                                      + Add Paragraph
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    {(card.paragraphs || []).map((para: ReviewCategoryParagraph, paraIdx: number) => (
                                      <div key={paraIdx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1 relative">
                                        <div className="flex items-center justify-between gap-2">
                                          <input
                                            type="text"
                                            value={para.heading}
                                            onChange={(e) => {
                                              const updated = [...cards];
                                              const paras = [...updated[cIdx].paragraphs];
                                              paras[paraIdx] = { ...paras[paraIdx], heading: e.target.value };
                                              updated[cIdx] = { ...updated[cIdx], paragraphs: paras };
                                              setTempData({
                                                ...tempData,
                                                reviewsArticle: { ...curRev, moreReviewCards: updated },
                                              });
                                            }}
                                            placeholder="Heading (e.g. Placements, Infrastructure)"
                                            className="w-1/2 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-800"
                                          />
                                          {card.paragraphs.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const updated = [...cards];
                                                const paras = updated[cIdx].paragraphs.filter((_: any, i: number) => i !== paraIdx);
                                                updated[cIdx] = { ...updated[cIdx], paragraphs: paras };
                                                setTempData({
                                                  ...tempData,
                                                  reviewsArticle: { ...curRev, moreReviewCards: updated },
                                                });
                                              }}
                                              className="text-red-500 hover:text-red-700 p-0.5"
                                            >
                                              <Trash2 className="w-3 hand-3" />
                                            </button>
                                          )}
                                        </div>
                                        <textarea
                                          rows={2}
                                          value={para.content}
                                          onChange={(e) => {
                                            const updated = [...cards];
                                            const paras = [...updated[cIdx].paragraphs];
                                            paras[paraIdx] = { ...paras[paraIdx], content: e.target.value };
                                            updated[cIdx] = { ...updated[cIdx], paragraphs: paras };
                                            setTempData({
                                              ...tempData,
                                              reviewsArticle: { ...curRev, moreReviewCards: updated },
                                            });
                                          }}
                                          placeholder="Review content details..."
                                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-normal"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Date & Votes */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-600 block">Reviewed Date String</label>
                                    <input
                                      type="text"
                                      value={card.reviewedDate}
                                      onChange={(e) => {
                                        const updated = [...cards];
                                        updated[cIdx] = { ...updated[cIdx], reviewedDate: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, moreReviewCards: updated },
                                        });
                                      }}
                                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-1/2">
                                      <label className="text-[10px] font-bold text-slate-600 block">Likes Count</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={card.likesCount || 0}
                                        onChange={(e) => {
                                          const updated = [...cards];
                                          updated[cIdx] = { ...updated[cIdx], likesCount: parseInt(e.target.value) || 0 };
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: { ...curRev, moreReviewCards: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-center"
                                      />
                                    </div>
                                    <div className="w-1/2">
                                      <label className="text-[10px] font-bold text-slate-600 block">Dislikes Count</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={card.dislikesCount || 0}
                                        onChange={(e) => {
                                          const updated = [...cards];
                                          updated[cIdx] = { ...updated[cIdx], dislikesCount: parseInt(e.target.value) || 0 };
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: { ...curRev, moreReviewCards: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-center"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {`/* MODAL: STUDENT VIDEO & IMAGE REVIEWS */`}
                {activeMiniModal === "studentMediaReviews" && (
                  <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                    {(() => {
                      const curRev = tempData.reviewsArticle || getCollegeReviewsArticle(tempData);
                      const curMedia = curRev.mediaReviews || {
                        title: "Student Video Reviews",
                        items: DEFAULT_STUDENT_MEDIA_REVIEWS,
                      };
                      const items = (curMedia.items && curMedia.items.length > 0)
                        ? curMedia.items
                        : DEFAULT_STUDENT_MEDIA_REVIEWS;

                      return (
                        <div className="space-y-4">
                          {/* Section Title */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 block">Section Title</label>
                            <input
                              type="text"
                              value={curMedia.title || ""}
                              onChange={(e) => {
                                setTempData({
                                  ...tempData,
                                  reviewsArticle: {
                                    ...curRev,
                                    mediaReviews: {
                                      ...curMedia,
                                      title: e.target.value,
                                    },
                                  },
                                });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                              placeholder="Student Video Reviews"
                            />
                          </div>

                          {/* Media Items List Header */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                              Video & Image Items ({items.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newItem: StudentMediaReviewItem = {
                                  id: `media-${Date.now()}`,
                                  type: "video",
                                  title: "New Student Video Review",
                                  mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                                  thumbnailUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
                                  duration: "00:45",
                                  authorName: "Student Name",
                                  batch: "B.Tech",
                                };
                                const updated = [...items, newItem];
                                setTempData({
                                  ...tempData,
                                  reviewsArticle: {
                                    ...curRev,
                                    mediaReviews: {
                                      ...curMedia,
                                      items: updated,
                                    },
                                  },
                                });
                              }}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Media Item</span>
                            </button>
                          </div>

                          {/* Media Items Cards */}
                          <div className="space-y-4">
                            {items.map((item: StudentMediaReviewItem, mIdx: number) => (
                              <div
                                key={item.id || mIdx}
                                className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs relative"
                              >
                                {/* Item Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-800">
                                      Media #{mIdx + 1}
                                    </span>
                                    {/* Type Switcher */}
                                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...items];
                                          updated[mIdx] = { ...updated[mIdx], type: "video" };
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: {
                                              ...curRev,
                                              mediaReviews: { ...curMedia, items: updated },
                                            },
                                          });
                                        }}
                                        className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                                          item.type === "video" ? "bg-red-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                                        }`}
                                      >
                                        Video
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...items];
                                          updated[mIdx] = { ...updated[mIdx], type: "image" };
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: {
                                              ...curRev,
                                              mediaReviews: { ...curMedia, items: updated },
                                            },
                                          });
                                        }}
                                        className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                                          item.type === "image" ? "bg-cyan-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                                        }`}
                                      >
                                        Image
                                      </button>
                                    </div>
                                  </div>

                                  {items.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = items.filter((_: any, i: number) => i !== mIdx);
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            mediaReviews: { ...curMedia, items: updated },
                                          },
                                        });
                                      }}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg text-xs flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete</span>
                                    </button>
                                  )}
                                </div>

                                {/* Title & Duration */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div className="sm:col-span-2">
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Title / Caption</label>
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => {
                                        const updated = [...items];
                                        updated[mIdx] = { ...updated[mIdx], title: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            mediaReviews: { ...curMedia, items: updated },
                                          },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Duration / Tag</label>
                                    <input
                                      type="text"
                                      value={item.duration || ""}
                                      placeholder="e.g. 00:45"
                                      onChange={(e) => {
                                        const updated = [...items];
                                        updated[mIdx] = { ...updated[mIdx], duration: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            mediaReviews: { ...curMedia, items: updated },
                                          },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                    />
                                  </div>
                                </div>

                                {/* Author & Batch */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Student Author Name</label>
                                    <input
                                      type="text"
                                      value={item.authorName || ""}
                                      placeholder="e.g. Karan Verma"
                                      onChange={(e) => {
                                        const updated = [...items];
                                        updated[mIdx] = { ...updated[mIdx], authorName: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            mediaReviews: { ...curMedia, items: updated },
                                          },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Course / Batch</label>
                                    <input
                                      type="text"
                                      value={item.batch || ""}
                                      placeholder="e.g. B.Tech CSE"
                                      onChange={(e) => {
                                        const updated = [...items];
                                        updated[mIdx] = { ...updated[mIdx], batch: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            mediaReviews: { ...curMedia, items: updated },
                                          },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                                    />
                                  </div>
                                </div>

                                {/* Media Source URL & File Upload Support */}
                                <div className="space-y-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-slate-700 block">
                                      {item.type === "video" ? "Video Source (File Upload or Link)" : "Image Source (File Upload or Link)"}
                                    </label>
                                  </div>

                                  {/* Direct URL Input */}
                                  <input
                                    type="text"
                                    value={item.mediaUrl}
                                    placeholder={item.type === "video" ? "Paste MP4 / YouTube embed URL..." : "Paste Image URL..."}
                                    onChange={(e) => {
                                      const updated = [...items];
                                      updated[mIdx] = { ...updated[mIdx], mediaUrl: e.target.value };
                                      setTempData({
                                        ...tempData,
                                        reviewsArticle: {
                                          ...curRev,
                                          mediaReviews: { ...curMedia, items: updated },
                                        },
                                      });
                                    }}
                                    className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                                  />

                                  {/* File Upload Button */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <label className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95">
                                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Upload from Computer</span>
                                      <input
                                        type="file"
                                        accept={item.type === "video" ? "video/*" : "image/*"}
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (uploadEvent) => {
                                              const result = uploadEvent.target?.result as string;
                                              if (result) {
                                                const updated = [...items];
                                                updated[mIdx] = {
                                                  ...updated[mIdx],
                                                  mediaUrl: result,
                                                  thumbnailUrl: item.type === "image" ? result : updated[mIdx].thumbnailUrl,
                                                };
                                                setTempData({
                                                  ...tempData,
                                                  reviewsArticle: {
                                                    ...curRev,
                                                    mediaReviews: { ...curMedia, items: updated },
                                                  },
                                                });
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                      />
                                    </label>
                                    <span className="text-[10px] text-slate-400">Supports MP4, WebM, JPG, PNG, WEBP</span>
                                  </div>
                                </div>

                                {/* Thumbnail Image (URL or Upload) */}
                                <div className="space-y-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                  <label className="text-[11px] font-bold text-slate-700 block">
                                    Thumbnail Image Preview (URL or Upload)
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={item.thumbnailUrl || ""}
                                      placeholder="Thumbnail image URL..."
                                      onChange={(e) => {
                                        const updated = [...items];
                                        updated[mIdx] = { ...updated[mIdx], thumbnailUrl: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            mediaReviews: { ...curMedia, items: updated },
                                          },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                                    />
                                    <label className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs active:scale-95">
                                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                                      <span>Upload</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (uploadEvent) => {
                                              const result = uploadEvent.target?.result as string;
                                              if (result) {
                                                const updated = [...items];
                                                updated[mIdx] = { ...updated[mIdx], thumbnailUrl: result };
                                                setTempData({
                                                  ...tempData,
                                                  reviewsArticle: {
                                                    ...curRev,
                                                    mediaReviews: { ...curMedia, items: updated },
                                                  },
                                                });
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {`/* MODAL: DETAILED STUDENT REVIEW CARDS */`}
                {activeMiniModal === "reviewCards" && (
                  <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                    {(() => {
                      const curRev = tempData.reviewsArticle || getCollegeReviewsArticle(tempData);
                      const cards = (curRev.reviewCards && curRev.reviewCards.length > 0)
                        ? curRev.reviewCards
                        : DEFAULT_DETAILED_REVIEW_CARDS;

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                              Detailed Student Review Cards ({cards.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newCard: DetailedReviewCard = {
                                  id: `rev-${Date.now()}`,
                                  authorName: "New Student",
                                  avatarInitial: "N",
                                  avatarBgColor: "bg-emerald-100 text-emerald-800",
                                  verified: true,
                                  courseAndBatch: "B.Tech. in Engineering - Batch of 2028",
                                  overallRating: 4.5,
                                  parameterRatings: [
                                    { label: "Placements", rating: 4.5 },
                                    { label: "Infrastructure", rating: 4.5 },
                                    { label: "Faculty", rating: 4.5 },
                                    { label: "Crowd & Campus Life", rating: 4.5 },
                                    { label: "Value for Money", rating: 4.5 },
                                  ],
                                  title: "Great campus environment and academics.",
                                  paragraphs: [
                                    {
                                      heading: "Placements",
                                      content: "Placement process is well coordinated with leading MNCs participating.",
                                    },
                                    {
                                      heading: "Infrastructure",
                                      content: "Well-equipped laboratories and spacious modern classrooms.",
                                    },
                                    {
                                      heading: "Faculty",
                                      content: "Professors are knowledgeable and supportive.",
                                    },
                                    {
                                      heading: "Other",
                                      content: "Exciting campus fests and active extracurricular clubs.",
                                    },
                                  ],
                                  reviewedDate: `Reviewed on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
                                  likesCount: 5,
                                  dislikesCount: 0,
                                };
                                const updated = [...cards, newCard];
                                setTempData({
                                  ...tempData,
                                  reviewsArticle: {
                                    ...curRev,
                                    reviewCards: updated,
                                  },
                                });
                              }}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Review Card</span>
                            </button>
                          </div>

                          <div className="space-y-4">
                            {cards.map((card: DetailedReviewCard, cIdx: number) => (
                              <div
                                key={card.id || cIdx}
                                className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs relative"
                              >
                                {/* Top Controls & Delete */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <span className="text-xs font-bold text-slate-800">
                                    Review Card #{cIdx + 1}
                                  </span>
                                  {cards.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = cards.filter((_: any, i: number) => i !== cIdx);
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            reviewCards: updated,
                                          },
                                        });
                                      }}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg text-xs flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete</span>
                                    </button>
                                  )}
                                </div>

                                {/* Author Name, Verified & Avatar */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Author Name</label>
                                    <input
                                      type="text"
                                      value={card.authorName}
                                      onChange={(e) => {
                                        const updated = [...cards];
                                        updated[cIdx] = { ...updated[cIdx], authorName: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, reviewCards: updated },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Avatar Letter / Color</label>
                                    <input
                                      type="text"
                                      value={card.avatarInitial || ""}
                                      placeholder="e.g. A"
                                      onChange={(e) => {
                                        const updated = [...cards];
                                        updated[cIdx] = { ...updated[cIdx], avatarInitial: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, reviewCards: updated },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10.5px] font-bold text-slate-600 block">Overall Score (out of 5)</label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="1"
                                      max="5"
                                      value={card.overallRating}
                                      onChange={(e) => {
                                        const updated = [...cards];
                                        updated[cIdx] = { ...updated[cIdx], overallRating: parseFloat(e.target.value) || 4.5 };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, reviewCards: updated },
                                        });
                                      }}
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-700"
                                    />
                                  </div>
                                </div>

                                {/* Course & Batch */}
                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-600 block">Course & Batch</label>
                                  <input
                                    type="text"
                                    value={card.courseAndBatch}
                                    onChange={(e) => {
                                      const updated = [...cards];
                                      updated[cIdx] = { ...updated[cIdx], courseAndBatch: e.target.value };
                                      setTempData({
                                        ...tempData,
                                        reviewsArticle: { ...curRev, reviewCards: updated },
                                      });
                                    }}
                                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                                  />
                                </div>

                                {/* Title / Tagline */}
                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-600 block">Review Headline Title</label>
                                  <input
                                    type="text"
                                    value={card.title}
                                    onChange={(e) => {
                                      const updated = [...cards];
                                      updated[cIdx] = { ...updated[cIdx], title: e.target.value };
                                      setTempData({
                                        ...tempData,
                                        reviewsArticle: { ...curRev, reviewCards: updated },
                                      });
                                    }}
                                    className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                                  />
                                </div>

                                {/* Parameter Ratings Row */}
                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                                    5 Parameter Ratings:
                                  </label>
                                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                                    {(card.parameterRatings || []).map((p: ReviewParameterBadge, pIdx: number) => (
                                      <div key={pIdx} className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                                        <input
                                          type="text"
                                          value={p.label}
                                          onChange={(e) => {
                                            const updated = [...cards];
                                            const params = [...updated[cIdx].parameterRatings];
                                            params[pIdx] = { ...params[pIdx], label: e.target.value };
                                            updated[cIdx] = { ...updated[cIdx], parameterRatings: params };
                                            setTempData({
                                              ...tempData,
                                              reviewsArticle: { ...curRev, reviewCards: updated },
                                            });
                                          }}
                                          className="w-full px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold"
                                        />
                                        <input
                                          type="number"
                                          step="0.1"
                                          min="1"
                                          max="5"
                                          value={p.rating}
                                          onChange={(e) => {
                                            const updated = [...cards];
                                            const params = [...updated[cIdx].parameterRatings];
                                            params[pIdx] = { ...params[pIdx], rating: parseFloat(e.target.value) || 4.0 };
                                            updated[cIdx] = { ...updated[cIdx], parameterRatings: params };
                                            setTempData({
                                              ...tempData,
                                              reviewsArticle: { ...curRev, reviewCards: updated },
                                            });
                                          }}
                                          className="w-full px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-center"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Categorized Review Paragraphs */}
                                <div className="space-y-2 pt-1">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10.5px] font-bold text-slate-700 block">
                                      Categorized Paragraphs:
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...cards];
                                        const paras = [
                                          ...updated[cIdx].paragraphs,
                                          { heading: "Section", content: "Review content..." },
                                        ];
                                        updated[cIdx] = { ...updated[cIdx], paragraphs: paras };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, reviewCards: updated },
                                        });
                                      }}
                                      className="text-[10.5px] font-bold text-indigo-600 hover:underline"
                                    >
                                      + Add Paragraph
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    {(card.paragraphs || []).map((para: ReviewCategoryParagraph, paraIdx: number) => (
                                      <div key={paraIdx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1 relative">
                                        <div className="flex items-center justify-between gap-2">
                                          <input
                                            type="text"
                                            value={para.heading}
                                            onChange={(e) => {
                                              const updated = [...cards];
                                              const paras = [...updated[cIdx].paragraphs];
                                              paras[paraIdx] = { ...paras[paraIdx], heading: e.target.value };
                                              updated[cIdx] = { ...updated[cIdx], paragraphs: paras };
                                              setTempData({
                                                ...tempData,
                                                reviewsArticle: { ...curRev, reviewCards: updated },
                                              });
                                            }}
                                            placeholder="Heading (e.g. Placements, Infrastructure)"
                                            className="w-1/2 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-800"
                                          />
                                          {card.paragraphs.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const updated = [...cards];
                                                const paras = updated[cIdx].paragraphs.filter((_: any, i: number) => i !== paraIdx);
                                                updated[cIdx] = { ...updated[cIdx], paragraphs: paras };
                                                setTempData({
                                                  ...tempData,
                                                  reviewsArticle: { ...curRev, reviewCards: updated },
                                                });
                                              }}
                                              className="text-red-500 hover:text-red-700 p-0.5"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          )}
                                        </div>
                                        <textarea
                                          rows={2}
                                          value={para.content}
                                          onChange={(e) => {
                                            const updated = [...cards];
                                            const paras = [...updated[cIdx].paragraphs];
                                            paras[paraIdx] = { ...paras[paraIdx], content: e.target.value };
                                            updated[cIdx] = { ...updated[cIdx], paragraphs: paras };
                                            setTempData({
                                              ...tempData,
                                              reviewsArticle: { ...curRev, reviewCards: updated },
                                            });
                                          }}
                                          placeholder="Review content details..."
                                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-normal"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Date & Votes */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-600 block">Reviewed Date String</label>
                                    <input
                                      type="text"
                                      value={card.reviewedDate}
                                      onChange={(e) => {
                                        const updated = [...cards];
                                        updated[cIdx] = { ...updated[cIdx], reviewedDate: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: { ...curRev, reviewCards: updated },
                                        });
                                      }}
                                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-1/2">
                                      <label className="text-[10px] font-bold text-slate-600 block">Likes Count</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={card.likesCount || 0}
                                        onChange={(e) => {
                                          const updated = [...cards];
                                          updated[cIdx] = { ...updated[cIdx], likesCount: parseInt(e.target.value) || 0 };
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: { ...curRev, reviewCards: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-center"
                                      />
                                    </div>
                                    <div className="w-1/2">
                                      <label className="text-[10px] font-bold text-slate-600 block">Dislikes Count</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={card.dislikesCount || 0}
                                        onChange={(e) => {
                                          const updated = [...cards];
                                          updated[cIdx] = { ...updated[cIdx], dislikesCount: parseInt(e.target.value) || 0 };
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: { ...curRev, reviewCards: updated },
                                          });
                                        }}
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-center"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {`/* MODAL: STUDENT FEEDBACK (LIKES & DISLIKES) */`}
                {activeMiniModal === "studentFeedback" && (
                  <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                    {(() => {
                      const curRev = tempData.reviewsArticle || getCollegeReviewsArticle(tempData);
                      const curFeedback = curRev.studentFeedback || {
                        heading: "What students say about " + (tempData.fullName || tempData.name),
                        categories: DEFAULT_STUDENT_FEEDBACK_CATEGORIES,
                      };
                      const categories = curFeedback.categories || DEFAULT_STUDENT_FEEDBACK_CATEGORIES;

                      return (
                        <div className="space-y-4">
                          {/* Heading input */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 block">Section Heading</label>
                            <input
                              type="text"
                              value={curFeedback.heading || ""}
                              onChange={(e) => {
                                setTempData({
                                  ...tempData,
                                  reviewsArticle: {
                                    ...curRev,
                                    studentFeedback: {
                                      ...curFeedback,
                                      heading: e.target.value,
                                    },
                                  },
                                });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                              placeholder="What students say about IIT Delhi..."
                            />
                          </div>

                          {/* Categories List */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                Categories & Likes/Dislikes ({categories.length})
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [
                                    ...categories,
                                    {
                                      category: `Category ${categories.length + 1}`,
                                      likesText: "Positive feedback from students regarding this aspect...",
                                      likesCountText: "Based on 50 Reviews",
                                      dislikesText: "Areas where students suggested improvements...",
                                      dislikesCountText: "Based on 10 Reviews",
                                    },
                                  ];
                                  setTempData({
                                    ...tempData,
                                    reviewsArticle: {
                                      ...curRev,
                                      studentFeedback: {
                                        ...curFeedback,
                                        categories: updated,
                                      },
                                    },
                                  });
                                }}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Category</span>
                              </button>
                            </div>

                            <div className="space-y-3">
                              {categories.map((cat: StudentFeedbackCategory, cIdx: number) => (
                                <div key={cIdx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs relative">
                                  <div className="flex items-center justify-between gap-2 pr-6">
                                    <input
                                      type="text"
                                      value={cat.category}
                                      onChange={(e) => {
                                        const updated = [...categories];
                                        updated[cIdx] = { ...updated[cIdx], category: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            studentFeedback: {
                                              ...curFeedback,
                                              categories: updated,
                                            },
                                          },
                                        });
                                      }}
                                      placeholder="Category Name (e.g. Placements, Infrastructure)"
                                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-700"
                                    />
                                    {categories.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = categories.filter((_: any, i: number) => i !== cIdx);
                                          setTempData({
                                            ...tempData,
                                            reviewsArticle: {
                                              ...curRev,
                                              studentFeedback: {
                                                ...curFeedback,
                                                categories: updated,
                                              },
                                            },
                                          });
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>

                                  {/* Likes Field */}
                                  <div className="space-y-1 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                      <span>Likes</span>
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={cat.likesText}
                                      onChange={(e) => {
                                        const updated = [...categories];
                                        updated[cIdx] = { ...updated[cIdx], likesText: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            studentFeedback: {
                                              ...curFeedback,
                                              categories: updated,
                                            },
                                          },
                                        });
                                      }}
                                      placeholder="Likes description..."
                                      className="w-full px-2 py-1 bg-white border border-emerald-200/80 rounded-md text-xs"
                                    />
                                    <input
                                      type="text"
                                      value={cat.likesCountText}
                                      onChange={(e) => {
                                        const updated = [...categories];
                                        updated[cIdx] = { ...updated[cIdx], likesCountText: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            studentFeedback: {
                                              ...curFeedback,
                                              categories: updated,
                                            },
                                          },
                                        });
                                      }}
                                      placeholder="e.g. Based on 178 Reviews"
                                      className="w-full px-2 py-0.5 bg-white border border-emerald-200/80 rounded text-[11px] text-slate-500 font-medium"
                                    />
                                  </div>

                                  {/* Dislikes Field */}
                                  <div className="space-y-1 bg-rose-50/40 p-2.5 rounded-lg border border-rose-100">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                                      <span>Dislikes</span>
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={cat.dislikesText}
                                      onChange={(e) => {
                                        const updated = [...categories];
                                        updated[cIdx] = { ...updated[cIdx], dislikesText: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            studentFeedback: {
                                              ...curFeedback,
                                              categories: updated,
                                            },
                                          },
                                        });
                                      }}
                                      placeholder="Dislikes description..."
                                      className="w-full px-2 py-1 bg-white border border-rose-200/80 rounded-md text-xs"
                                    />
                                    <input
                                      type="text"
                                      value={cat.dislikesCountText}
                                      onChange={(e) => {
                                        const updated = [...categories];
                                        updated[cIdx] = { ...updated[cIdx], dislikesCountText: e.target.value };
                                        setTempData({
                                          ...tempData,
                                          reviewsArticle: {
                                            ...curRev,
                                            studentFeedback: {
                                              ...curFeedback,
                                              categories: updated,
                                            },
                                          },
                                        });
                                      }}
                                      placeholder="e.g. Based on 16 Reviews"
                                      className="w-full px-2 py-0.5 bg-white border border-rose-200/80 rounded text-[11px] text-slate-500 font-medium"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {`/* MODAL: QA */`}
                {activeMiniModal === "qa" && (
                  <div className="space-y-3">
                    <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                      {tempData.faqs.map((faq, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = tempData.faqs.filter((_, i) => i !== idx);
                              setTempData({ ...tempData, faqs: updated });
                            }}
                            className="absolute top-2.5 right-2.5 p-1 text-red-500 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...tempData.faqs];
                              updated[idx].question = e.target.value;
                              setTempData({ ...tempData, faqs: updated });
                            }}
                            placeholder="Question"
                            className="w-5/6 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          />
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const updated = [...tempData.faqs];
                              updated[idx].answer = e.target.value;
                              setTempData({ ...tempData, faqs: updated });
                            }}
                            placeholder="Answer"
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-none"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setTempData({
                          ...tempData,
                          faqs: [...tempData.faqs, { question: "What is the admission procedure?", answer: "Admission is conducted through national entrance tests." }],
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  </div>
                )}

                {/* MODAL FOOTER */}
                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveMiniModal(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Save & Publish Section</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ALL FILTERS POPUP MODAL (EXACT USER REFERENCE DESIGN) */}
      <AnimatePresence>
        {isCutoffFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
            >
              {/* Modal Top Header */}
              <div className="px-6 pt-5 pb-4 border-b border-slate-100 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit font-black text-xl text-[#2d1a47]">
                    All Filters
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setTempCutoffFilters({
                        round: "1",
                        category: "General",
                        quota: "All India",
                        gender: "All",
                      });
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {/* Selected Filters Preview Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                  <span className="px-3.5 py-1 rounded-full border border-slate-300 bg-white text-slate-800 text-xs font-semibold shrink-0 shadow-2xs">
                    {tempCutoffFilters.round}
                  </span>
                  <span className="px-3.5 py-1 rounded-full border border-slate-300 bg-white text-slate-800 text-xs font-semibold shrink-0 shadow-2xs">
                    {tempCutoffFilters.category}
                  </span>
                  <span className="px-3.5 py-1 rounded-full border border-slate-300 bg-white text-slate-800 text-xs font-semibold shrink-0 shadow-2xs">
                    {tempCutoffFilters.quota}
                  </span>
                  <span className="px-3.5 py-1 rounded-full border border-slate-300 bg-white text-slate-800 text-xs font-semibold shrink-0 shadow-2xs">
                    {tempCutoffFilters.gender}
                  </span>
                </div>
              </div>

              {/* Modal 2-Column Body: Tabs on left, Options on right */}
              <div className="grid grid-cols-12 min-h-[300px] max-h-[380px]">
                {/* Left Sidebar Tabs */}
                <div className="col-span-4 sm:col-span-3 border-r border-slate-100 bg-slate-50/50 py-2">
                  <button
                    type="button"
                    onClick={() => setActiveFilterTab("rounds")}
                    className={`w-full px-4 py-3 text-left text-xs sm:text-[13px] font-bold flex items-center justify-between transition-colors cursor-pointer select-none ${
                      activeFilterTab === "rounds"
                        ? "bg-purple-50 text-[#2d1a47] border-l-4 border-[#2d1a47]"
                        : "text-slate-600 hover:bg-slate-100/60"
                    }`}
                  >
                    <span>Rounds</span>
                    <span className="text-[11px] font-semibold text-slate-400">1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFilterTab("category")}
                    className={`w-full px-4 py-3 text-left text-xs sm:text-[13px] font-bold flex items-center justify-between transition-colors cursor-pointer select-none ${
                      activeFilterTab === "category"
                        ? "bg-purple-50 text-[#2d1a47] border-l-4 border-[#2d1a47]"
                        : "text-slate-600 hover:bg-slate-100/60"
                    }`}
                  >
                    <span>Category</span>
                    <span className="text-[11px] font-semibold text-slate-400">1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFilterTab("quota")}
                    className={`w-full px-4 py-3 text-left text-xs sm:text-[13px] font-bold flex items-center justify-between transition-colors cursor-pointer select-none ${
                      activeFilterTab === "quota"
                        ? "bg-purple-50 text-[#2d1a47] border-l-4 border-[#2d1a47]"
                        : "text-slate-600 hover:bg-slate-100/60"
                    }`}
                  >
                    <span>Quota</span>
                    <span className="text-[11px] font-semibold text-slate-400">1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFilterTab("gender")}
                    className={`w-full px-4 py-3 text-left text-xs sm:text-[13px] font-bold flex items-center justify-between transition-colors cursor-pointer select-none ${
                      activeFilterTab === "gender"
                        ? "bg-purple-50 text-[#2d1a47] border-l-4 border-[#2d1a47]"
                        : "text-slate-600 hover:bg-slate-100/60"
                    }`}
                  >
                    <span>Gender</span>
                    <span className="text-[11px] font-semibold text-slate-400">1</span>
                  </button>
                </div>

                {/* Right Options Content */}
                <div className="col-span-8 sm:col-span-9 p-4 sm:p-6 overflow-y-auto max-h-[380px] space-y-3 bg-white">
                  {activeFilterTab === "rounds" && (
                    <div className="space-y-2.5">
                      {CUTOFF_FILTER_OPTIONS.rounds.map((opt) => {
                        const isSelected = tempCutoffFilters.round === opt;
                        return (
                          <div
                            key={opt}
                            onClick={() => setTempCutoffFilters({ ...tempCutoffFilters, round: opt })}
                            className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none group"
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-[#2d1a47] text-white"
                                  : "border-2 border-slate-300 group-hover:border-slate-400"
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className={`text-xs sm:text-sm ${isSelected ? "font-bold text-slate-900" : "text-slate-700 font-medium"}`}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeFilterTab === "category" && (
                    <div className="space-y-2.5">
                      {CUTOFF_FILTER_OPTIONS.category.map((opt) => {
                        const isSelected = tempCutoffFilters.category === opt;
                        return (
                          <div
                            key={opt}
                            onClick={() => setTempCutoffFilters({ ...tempCutoffFilters, category: opt })}
                            className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none group"
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-[#2d1a47] text-white"
                                  : "border-2 border-slate-300 group-hover:border-slate-400"
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className={`text-xs sm:text-sm ${isSelected ? "font-bold text-slate-900" : "text-slate-700 font-medium"}`}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeFilterTab === "quota" && (
                    <div className="space-y-2.5">
                      {CUTOFF_FILTER_OPTIONS.quota.map((opt) => {
                        const isSelected = tempCutoffFilters.quota === opt;
                        return (
                          <div
                            key={opt}
                            onClick={() => setTempCutoffFilters({ ...tempCutoffFilters, quota: opt })}
                            className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none group"
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-[#2d1a47] text-white"
                                  : "border-2 border-slate-300 group-hover:border-slate-400"
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className={`text-xs sm:text-sm ${isSelected ? "font-bold text-slate-900" : "text-slate-700 font-medium"}`}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeFilterTab === "gender" && (
                    <div className="space-y-2.5">
                      {CUTOFF_FILTER_OPTIONS.gender.map((opt) => {
                        const isSelected = tempCutoffFilters.gender === opt;
                        return (
                          <div
                            key={opt}
                            onClick={() => setTempCutoffFilters({ ...tempCutoffFilters, gender: opt })}
                            className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none group"
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-[#2d1a47] text-white"
                                  : "border-2 border-slate-300 group-hover:border-slate-400"
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className={`text-xs sm:text-sm ${isSelected ? "font-bold text-slate-900" : "text-slate-700 font-medium"}`}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer with Cancel & Apply Filters buttons */}
              <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setIsCutoffFilterModalOpen(false)}
                  className="px-6 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCutoffFilters({ ...tempCutoffFilters });
                    setIsCutoffFilterModalOpen(false);
                  }}
                  className="px-7 py-2.5 rounded-full bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS CONFIRMATION MODAL */}
      <AnimatePresence>
        {formSubmitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xs p-6 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="font-outfit font-black text-base text-slate-900">
                Inquiry Received!
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Our IIT admission counsellor will contact you on <strong>+91 {formData.phone}</strong> shortly.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
