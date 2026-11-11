import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Colleges in Delhi NCR (2026): Engineering, MBA, Medical, Fees & Cutoffs | College 19",
  description:
    "Explore and compare 295+ top colleges in Delhi NCR, Noida, Greater Noida, and Gurgaon for 2026 admissions. Check NIRF rankings, tuition fees, entrance exams (JEE/CAT/CUET), and placement packages on College 19.",
  keywords: [
    "colleges in delhi ncr",
    "top engineering colleges in delhi",
    "mba colleges in noida",
    "colleges in greater noida",
    "top colleges in gurgaon",
    "delhi ncr college admission 2026",
    "College 19",
  ],
  alternates: {
    canonical: "https://www.college19.com/colleges",
  },
  openGraph: {
    title: "Top Colleges in Delhi NCR (2026) - College 19",
    description:
      "Explore and compare 295+ top colleges in Delhi NCR, Noida, Greater Noida, and Gurgaon. Find courses, fees, cutoffs, and placements.",
    url: "https://www.college19.com/colleges",
    siteName: "College 19",
    images: [
      {
        url: "https://www.college19.com/icon-512.png",
        width: 1200,
        height: 630,
        alt: "College 19 - College Discovery Portal",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Colleges in Delhi NCR (2026) | College 19",
    description:
      "Find and compare top colleges in Delhi NCR. Check fees, cutoff ranks, placement packages, and admission criteria.",
    images: ["https://www.college19.com/icon-512.png"],
  },
};

export default function CollegesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
