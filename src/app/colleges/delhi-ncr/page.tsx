import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Star,
  Award,
  BookOpen,
  DollarSign,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title:
    "Top Colleges in Delhi NCR 2026: Rankings, Fees, Cutoffs, Placements & Admission | College 19",
  description:
    "Comprehensive guide and rankings of the Top Colleges in Delhi NCR for 2026 admissions. Check NIRF rankings, B.Tech/MBA fees, JEE Main cutoff ranks, average placement packages, and admission processes in Delhi, Noida, Greater Noida, and Gurgaon.",
  keywords: [
    "top colleges in delhi ncr",
    "best engineering colleges in delhi",
    "colleges in greater noida",
    "mba colleges in noida",
    "top universities in gurgaon",
    "delhi ncr college admission 2026",
    "delhi engineering cutoffs",
    "College 19",
  ],
  alternates: {
    canonical: "https://www.college19.com/colleges/delhi-ncr",
  },
  openGraph: {
    title: "Top Colleges in Delhi NCR 2026 - College 19",
    description:
      "Explore and compare top engineering, MBA, medical, and law colleges in Delhi NCR. Check verified fees, NIRF rank, and placement stats.",
    url: "https://www.college19.com/colleges/delhi-ncr",
    siteName: "College 19",
    images: [
      {
        url: "https://www.college19.com/icon-512.png",
        width: 1200,
        height: 630,
        alt: "Top Colleges in Delhi NCR - College 19",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Colleges in Delhi NCR 2026 | College 19",
    description:
      "Comprehensive list of top colleges in Delhi NCR. Check 2026 fees, cutoff ranks, placement statistics, and admission procedures.",
    images: ["https://www.college19.com/icon-512.png"],
  },
};

interface CollegeItem {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  location?: string;
  rating?: string | number;
  nirf_rank?: string;
  courses_count?: string;
  image_url?: string;
  ownership?: string;
  tuition_fees?: string;
  exams_accepted?: string;
}

const FALLBACK_DELHI_COLLEGES: CollegeItem[] = [
  {
    id: "delhi-1",
    name: "IIT Delhi - Indian Institute of Technology",
    slug: "iit-delhi",
    city: "New Delhi",
    state: "Delhi",
    location: "Hauz Khas, New Delhi",
    rating: 4.9,
    nirf_rank: "2",
    courses_count: "8 Courses",
    image_url:
      "https://media.getmyuni.com/azure/college-image/small/indian-institute-of-technology-iit-delhi.webp",
    ownership: "Public",
    tuition_fees: "₹2.20 Lakhs / Yr",
    exams_accepted: "JEE Advanced, GATE, CAT",
  },
  {
    id: "delhi-2",
    name: "Galgotias University",
    slug: "galgotias-university",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    location: "Yamuna Expressway, Greater Noida",
    rating: 4.3,
    nirf_rank: "95",
    courses_count: "15 Courses",
    image_url:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=70",
    ownership: "Private",
    tuition_fees: "₹1.59 Lakhs / Yr",
    exams_accepted: "JEE Main, CUET, MAT",
  },
  {
    id: "delhi-3",
    name: "DTU - Delhi Technological University",
    slug: "-delhi-technological-university-dtu-",
    city: "New Delhi",
    state: "Delhi",
    location: "Rohini, New Delhi",
    rating: 4.7,
    nirf_rank: "29",
    courses_count: "12 Courses",
    image_url:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=70",
    ownership: "Public",
    tuition_fees: "₹2.20 Lakhs / Yr",
    exams_accepted: "JEE Main (JAC Delhi), GATE",
  },
  {
    id: "delhi-4",
    name: "Amity University, Noida",
    slug: "amity-university-noida",
    city: "Noida",
    state: "Uttar Pradesh",
    location: "Sector 125, Noida",
    rating: 4.5,
    nirf_rank: "35",
    courses_count: "25 Courses",
    image_url:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=70",
    ownership: "Private",
    tuition_fees: "₹2.80 - 3.50 Lakhs / Yr",
    exams_accepted: "Amity JEE, JEE Main, CAT",
  },
  {
    id: "delhi-5",
    name: "NSUT - Netaji Subhas University of Technology",
    slug: "nsut-netaji-subhas-university-of-technology",
    city: "New Delhi",
    state: "Delhi",
    location: "Dwarka, New Delhi",
    rating: 4.6,
    nirf_rank: "60",
    courses_count: "10 Courses",
    image_url:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=70",
    ownership: "Public",
    tuition_fees: "₹2.30 Lakhs / Yr",
    exams_accepted: "JEE Main (JAC Delhi), GATE",
  },
  {
    id: "delhi-6",
    name: "IIIT Delhi - Indraprastha Institute of Information Technology",
    slug: "iiit-delhi",
    city: "New Delhi",
    state: "Delhi",
    location: "Okhla, New Delhi",
    rating: 4.6,
    nirf_rank: "75",
    courses_count: "7 Courses",
    image_url:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=70",
    ownership: "Public",
    tuition_fees: "₹4.50 Lakhs / Yr",
    exams_accepted: "JEE Main (JAC Delhi), GATE",
  },
];

async function getDelhiNcrColleges(): Promise<CollegeItem[]> {
  try {
    const { data, error } = await supabase
      .from("colleges")
      .select(
        "id, name, slug, city, state, location, rating, nirf_rank, courses_count, image_url, tuition_fees, exams_accepted, ownership"
      )
      .or(
        "city.ilike.%Delhi%,city.ilike.%Noida%,city.ilike.%Gurgaon%,city.ilike.%Ghaziabad%,city.ilike.%Faridabad%,state.ilike.%Delhi%,location.ilike.%Delhi%,location.ilike.%Noida%"
      )
      .order("rating", { ascending: false })
      .limit(30);

    if (error || !data || data.length === 0) {
      return FALLBACK_DELHI_COLLEGES;
    }

    // Deduplicate by slug
    const seen = new Set<string>();
    const cleaned: CollegeItem[] = [];

    for (const item of data) {
      if (!item.slug || seen.has(item.slug.toLowerCase())) continue;
      seen.add(item.slug.toLowerCase());
      cleaned.push(item as CollegeItem);
    }

    return cleaned.length > 0 ? cleaned : FALLBACK_DELHI_COLLEGES;
  } catch {
    return FALLBACK_DELHI_COLLEGES;
  }
}

export default async function DelhiNcrCollegesHubPage() {
  const colleges = await getDelhiNcrColleges();

  // FAQ Schema for Google Rich Search Accordion
  const faqList = [
    {
      question: "Which are the best engineering colleges in Delhi NCR?",
      answer:
        "Top engineering colleges in Delhi NCR include IIT Delhi, DTU (Delhi Technological University), NSUT Delhi, IIIT Delhi, NIT Delhi, Galgotias University, and Amity University Noida, offering exceptional placement packages and research facilities.",
    },
    {
      question: "What is the average fee for MBA programs in Delhi NCR?",
      answer:
        "The average fee for MBA/PGDM programs in Delhi NCR ranges from ₹1.5 Lakhs per year in government universities (like FMS Delhi and DMS IIT Delhi) to ₹4.0 - ₹12.0 Lakhs in premier private institutions (such as MDI Gurgaon and SIBM).",
    },
    {
      question: "Which entrance exams are required for admission to Delhi NCR colleges?",
      answer:
        "B.Tech admissions primarily require JEE Main and JEE Advanced (conducted via JoSAA or JAC Delhi counseling). MBA programs accept CAT, XAT, MAT, and CMAT. Other undergraduate degrees accept CUET UG and state entrance scores.",
    },
    {
      question: "Can I get direct admission in colleges in Greater Noida and Noida?",
      answer:
        "Yes, many recognized private universities and AICTE-approved colleges in Greater Noida and Noida provide direct merit-based admissions through management quotas and institutional qualifying tests for eligible candidates.",
    },
    {
      question: "Are hostel and mess facilities available for outstation students in Delhi NCR colleges?",
      answer:
        "Yes, almost all premier government institutions and private universities in Delhi, Noida, and Greater Noida offer dedicated on-campus hostels with Wi-Fi, 24/7 security, mess dining, and bus transit facilities.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.college19.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Colleges",
        item: "https://www.college19.com/colleges",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Delhi NCR",
        item: "https://www.college19.com/colleges/delhi-ncr",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Google Structured Data / JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#002b49] via-[#003865] to-[#011c33] text-white py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/colleges" className="hover:text-white transition-colors">
              Colleges
            </Link>
            <span>/</span>
            <span className="text-orange-400 font-semibold">Delhi NCR</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              2026 Admission & Ranking Guide
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-outfit">
              Top Colleges in Delhi NCR (2026)
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Compare 295+ premier universities and colleges across New Delhi, Noida, Greater Noida, and Gurgaon. Check verified NIRF rankings, B.Tech and MBA fees, JoSAA/JAC Delhi cutoffs, highest placement packages, and counseling dates.
            </p>
          </div>

          {/* Quick Stream Badges */}
          <div className="flex flex-wrap gap-2.5 pt-6">
            <Link
              href="/colleges?stream=Engineering&city=Delhi"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-orange-400" />
              <span>Engineering (B.Tech)</span>
            </Link>
            <Link
              href="/colleges?stream=Management&city=Noida"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>Management (MBA)</span>
            </Link>
            <Link
              href="/colleges?stream=Medical&city=Delhi"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all flex items-center gap-1.5"
            >
              <Building className="w-4 h-4 text-orange-400" />
              <span>Medical (MBBS)</span>
            </Link>
            <Link
              href="/colleges?city=Greater+Noida"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Greater Noida Colleges</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Intro Overview Article */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-outfit text-slate-900">
            Higher Education & College Admissions in Delhi NCR
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The National Capital Region (Delhi NCR) is India&apos;s foremost educational hub, housing premier government universities (IIT Delhi, DTU, NSUT, Jamia Millia Islamia, Delhi University) alongside world-class private universities in Noida, Greater Noida, and Gurgaon (Galgotias, Amity, Bennett, Sharda). Students benefit from direct corporate exposure, modern incubation facilities, and top tier-1 placements.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-xl font-extrabold text-[#002b49]">295+</span>
              <span className="text-xs text-slate-500 font-medium">Colleges Listed</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-xl font-extrabold text-[#002b49]">₹1.20 Cr</span>
              <span className="text-xs text-slate-500 font-medium">Highest Package</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-xl font-extrabold text-[#002b49]">#2 NIRF</span>
              <span className="text-xs text-slate-500 font-medium">Top Rank (IITD)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-xl font-extrabold text-[#002b49]">100% Verified</span>
              <span className="text-xs text-slate-500 font-medium">Fee Structures</span>
            </div>
          </div>
        </section>

        {/* Colleges Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-outfit text-slate-900">
                Top Rated Colleges in Delhi NCR
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Showing top verified institutions with 2026 fees and placement packages
              </p>
            </div>
            <Link
              href="/colleges"
              className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
            >
              <span>Explore All Colleges with Filters</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((col) => {
              const ratingNum = col.rating ? parseFloat(String(col.rating)) : 4.5;
              const bannerImg =
                col.image_url && col.image_url.startsWith("http")
                  ? col.image_url
                  : "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=70";

              return (
                <div
                  key={col.id || col.slug}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image & Top Badges */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={bannerImg}
                      alt={`${col.name} Campus`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center gap-1 border border-white/20">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{ratingNum.toFixed(1)}</span>
                    </div>

                    {/* NIRF Badge */}
                    {col.nirf_rank && col.nirf_rank !== "N/A" && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-orange-600/90 text-white text-xs font-bold border border-orange-400/40">
                        NIRF #{col.nirf_rank.replace(/[^0-9]/g, "")}
                      </div>
                    )}

                    {/* Ownership Tag */}
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
                      {col.ownership || "University"}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-outfit line-clamp-2 group-hover:text-orange-600 transition-colors">
                        <Link href={`/colleges/${col.slug}`}>
                          {col.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{col.location || col.city || "Delhi NCR"}</span>
                      </p>
                    </div>

                    {/* Key Highlights Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[11px] text-slate-400 block font-medium">1st Year Fees</span>
                        <span className="font-bold text-slate-800 line-clamp-1">
                          {col.tuition_fees && col.tuition_fees !== "N/A" ? col.tuition_fees : "Contact College"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[11px] text-slate-400 block font-medium">Entrance Exam</span>
                        <span className="font-bold text-slate-800 line-clamp-1">
                          {col.exams_accepted && col.exams_accepted !== "N/A" ? col.exams_accepted.split(",")[0] : "JEE / CUET"}
                        </span>
                      </div>
                    </div>

                    {/* CTA Link */}
                    <Link
                      href={`/colleges/${col.slug}`}
                      className="w-full py-2.5 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 border border-orange-200 hover:border-orange-600 group-hover:shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>View Full Details & Cutoffs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Delhi NCR Fast Comparison Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-outfit text-slate-900">
              Quick Comparison: Top Delhi NCR Colleges 2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Side-by-side comparison of fees, NIRF rankings, and accepted entrance tests
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#002b49] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold">College Name</th>
                  <th className="py-3 px-4 font-bold">City / Location</th>
                  <th className="py-3 px-4 font-bold">Type</th>
                  <th className="py-3 px-4 font-bold">NIRF Rank</th>
                  <th className="py-3 px-4 font-bold">Tuition Fees</th>
                  <th className="py-3 px-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {colleges.slice(0, 8).map((c) => (
                  <tr key={c.slug} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <Link href={`/colleges/${c.slug}`} className="hover:text-orange-600">
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.city || "Delhi NCR"}</td>
                    <td className="py-3 px-4 text-slate-600">{c.ownership || "University"}</td>
                    <td className="py-3 px-4 font-bold text-orange-600">
                      {c.nirf_rank && c.nirf_rank !== "N/A" ? `#${c.nirf_rank.replace(/[^0-9]/g, "")}` : "—"}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {c.tuition_fees && c.tuition_fees !== "N/A" ? c.tuition_fees : "Contact"}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/colleges/${c.slug}`}
                        className="text-xs font-bold text-orange-600 hover:underline"
                      >
                        Explore &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs Section with FAQ Accordion */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Student Queries Answered
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-outfit text-slate-900 mt-1">
              Frequently Asked Questions: Colleges in Delhi NCR
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {faqList.map((faq, idx) => (
              <div key={idx} className="py-4 space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
