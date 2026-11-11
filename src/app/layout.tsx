import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.college19.com"),
  title: "College 19 - Top Colleges in Delhi NCR & India | Admission 2026, Fees, Cutoff & Placements",
  description:
    "Discover top colleges in Delhi NCR and across India on College 19. Check 2026 admissions, B.Tech & MBA course fees, JoSAA/JAC cutoffs, placement packages, NIRF rankings, and college comparison tools.",
  keywords: [
    "College 19",
    "colleges in delhi ncr",
    "engineering colleges in delhi",
    "mba colleges in noida",
    "college admission 2026",
    "college fees and cutoffs",
    "college predictor",
    "bihar student credit card colleges",
  ],
  alternates: {
    canonical: "https://www.college19.com",
  },
  openGraph: {
    title: "College 19 - Premium College Discovery & Admission Portal",
    description:
      "Find your ideal college in India. Dynamic search, engineering, medical, law, MBA courses, predictors, comparison tools, and credit card admission guidance.",
    url: "https://www.college19.com",
    siteName: "College 19",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "College 19 Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College 19 - Top Colleges in Delhi NCR & India",
    description:
      "Explore 2026 college admissions, courses, fees, cutoff benchmarks, and placement packages.",
    images: ["/icon-512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalWebsiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "College 19",
    url: "https://www.college19.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.college19.com/colleges?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "College 19",
    url: "https://www.college19.com",
    logo: "https://www.college19.com/icon-512.png",
    sameAs: [],
    description:
      "College 19 is a premier educational discovery portal guiding students through admissions, fee structures, cutoffs, and placements across Indian colleges.",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalWebsiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="antialiased min-h-screen overflow-x-clip bg-background">
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
