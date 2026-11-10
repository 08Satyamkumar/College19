import { Metadata } from "next";
import { cache } from "react";
import { supabase } from "@/lib/supabase";

interface CollegeDbRecord {
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
  description?: string;
  ownership?: string;
  tuition_fees?: string;
  exams_accepted?: string;
}

// Request-memoized college fetcher (deduplicated between generateMetadata & layout)
const getCollege = cache(async (slug: string): Promise<CollegeDbRecord | null> => {
  if (!slug) return null;
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();

  try {
    // 1. Try exact slug match
    let { data, error } = await supabase
      .from("colleges")
      .select(
        "id, name, slug, city, state, location, rating, nirf_rank, courses_count, image_url, description, ownership, tuition_fees, exams_accepted"
      )
      .eq("slug", cleanSlug)
      .maybeSingle();

    // 2. Fallback to partial slug match if not found
    if (!data) {
      const res = await supabase
        .from("colleges")
        .select(
          "id, name, slug, city, state, location, rating, nirf_rank, courses_count, image_url, description, ownership, tuition_fees, exams_accepted"
        )
        .ilike("slug", `%${cleanSlug}%`)
        .limit(1);

      if (res.data && res.data.length > 0) {
        data = res.data[0];
      }
    }

    if (error) {
      console.warn("Supabase layout load notice:", error.message);
    }

    return (data as CollegeDbRecord) || null;
  } catch (err) {
    console.error("Error in getCollege layout fetch:", err);
    return null;
  }
});

function formatSlugToTitle(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// Next.js 15 Server-Side Dynamic Metadata Generator
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollege(slug);

  const fallbackName = formatSlugToTitle(slug);
  const collegeName = college?.name || fallbackName;
  const city = college?.city || (college?.location ? college.location.split(",")[0].trim() : "");
  const state = college?.state || "India";
  const locationLabel = city ? `${city}, ${state}` : state;

  const currentYear = 2026;
  const pageUrl = `https://www.college19.com/colleges/${college?.slug || slug}`;
  const bannerImg =
    college?.image_url && college.image_url.startsWith("http")
      ? college.image_url
      : "https://www.college19.com/icon-512.png";

  const nirfSnippet = college?.nirf_rank && college.nirf_rank !== "N/A"
    ? `NIRF ${college.nirf_rank.startsWith("#") ? college.nirf_rank : `#${college.nirf_rank}`}, `
    : "";

  const feesSnippet = college?.tuition_fees && college.tuition_fees !== "N/A"
    ? `Fees (${college.tuition_fees}), `
    : "";

  const title = `${collegeName}${city ? ` (${city})` : ""}: Admission ${currentYear}, Cutoffs, Fees, Placements, Ranking | College 19`;

  const description = `Explore ${collegeName}, ${locationLabel}. Check ${currentYear} admission process, ${nirfSnippet}${feesSnippet}courses offered, accepted entrance exams, highest & average placement packages, cutoff ranks, and verified student reviews on College 19.`;

  return {
    title,
    description,
    keywords: [
      collegeName,
      `${collegeName} admission ${currentYear}`,
      `${collegeName} fees`,
      `${collegeName} cutoff`,
      `${collegeName} placements`,
      `${collegeName} ranking`,
      `${collegeName} reviews`,
      `colleges in ${city || state}`,
      "College 19",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${collegeName} - Admission ${currentYear}, Fees & Placements | College 19`,
      description,
      url: pageUrl,
      siteName: "College 19",
      images: [
        {
          url: bannerImg,
          width: 1200,
          height: 630,
          alt: `${collegeName} Campus & Details`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collegeName} - Admission ${currentYear} | College 19`,
      description,
      images: [bannerImg],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function CollegeDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = await getCollege(slug);

  const fallbackName = formatSlugToTitle(slug);
  const collegeName = college?.name || fallbackName;
  const city = college?.city || (college?.location ? college.location.split(",")[0].trim() : "");
  const state = college?.state || "India";
  const pageUrl = `https://www.college19.com/colleges/${college?.slug || slug}`;
  const bannerImg =
    college?.image_url && college.image_url.startsWith("http")
      ? college.image_url
      : "https://www.college19.com/icon-512.png";

  const ratingVal = college?.rating ? parseFloat(String(college.rating)) || 4.5 : 4.8;

  // 1. BreadcrumbList Schema for Google Search Hierarchy
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
      ...(city
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: `Colleges in ${city}`,
              item: `https://www.college19.com/colleges?city=${encodeURIComponent(city)}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: collegeName,
              item: pageUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: collegeName,
              item: pageUrl,
            },
          ]),
    ],
  };

  // 2. EducationalOrganization / CollegeOrUniversity Schema for Google Knowledge Graph
  const universitySchema = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: collegeName,
    url: pageUrl,
    logo: bannerImg,
    image: bannerImg,
    description: `${collegeName} is an institution located in ${city ? `${city}, ` : ""}${state}, offering undergraduate and postgraduate academic programs.`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city || "Delhi NCR",
      addressRegion: state || "Delhi",
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingVal.toFixed(1),
      reviewCount: "420",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <>
      {/* Google Structured Data / JSON-LD Schemas (SSR injected for Googlebot) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(universitySchema) }}
      />
      {children}
    </>
  );
}
