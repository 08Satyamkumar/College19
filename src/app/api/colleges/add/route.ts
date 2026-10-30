import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { isRequestAuthorized } from "@/lib/auth";

const dbClient = supabaseAdmin || supabase;
const PROTECTED_SLUGS = ["__homepage_colleges_config__"];

export async function POST(request: Request) {
  try {
    // 1. Verify admin/writer session strictly
    const isAuthorized = await isRequestAuthorized(request);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access. Valid administrator session required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { collegeData } = body;

    if (!collegeData || typeof collegeData !== "object" || Array.isArray(collegeData)) {
      return NextResponse.json(
        { error: "Invalid payload. College data object is required." },
        { status: 400 }
      );
    }

    const collegeName = typeof collegeData.name === "string" ? collegeData.name.trim() : "";
    if (!collegeName || collegeName.length < 2 || collegeName.length > 250) {
      return NextResponse.json(
        { error: "College Name must be between 2 and 250 characters." },
        { status: 400 }
      );
    }

    // Generate and validate slug
    let slug = collegeData.slug;
    if (typeof slug === "string") {
      slug = slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
    }
    if (!slug) {
      slug = collegeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    if (PROTECTED_SLUGS.includes(slug)) {
      return NextResponse.json(
        { error: "Reserved slug cannot be used." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Invalid slug format. Slugs may only contain lowercase letters, numbers, and hyphens." },
        { status: 400 }
      );
    }

    // Check if college with this slug already exists to prevent duplicate overwrite
    const { data: existingRows } = await dbClient
      .from("colleges")
      .select("id, slug")
      .eq("slug", slug)
      .limit(1);

    if (existingRows && existingRows.length > 0) {
      return NextResponse.json(
        { error: `A college with slug '${slug}' already exists. Please choose a different name or edit the existing record.` },
        { status: 409 }
      );
    }

    // Sanitize rating
    let rating = 4.2;
    if (collegeData.rating) {
      const parsedRating = parseFloat(collegeData.rating);
      if (!isNaN(parsedRating) && parsedRating >= 1.0 && parsedRating <= 5.0) {
        rating = Math.round(parsedRating * 10) / 10;
      }
    }

    let descObj: any = {};
    if (typeof collegeData.description === "string") {
      try {
        descObj = JSON.parse(collegeData.description);
      } catch (e) {
        descObj = { description: collegeData.description };
      }
    } else if (collegeData.description && typeof collegeData.description === "object") {
      descObj = { ...collegeData.description };
    }

    if (collegeData.logo || collegeData.logo_url) {
      descObj.logo = collegeData.logo || collegeData.logo_url;
    }

    if (collegeData.image_url && collegeData.image_url.trim()) {
      descObj.image = collegeData.image_url.trim();
      if (!descObj.coverImages || descObj.coverImages.length === 0) {
        descObj.coverImages = [collegeData.image_url.trim()];
      }
    }

    const recordToInsert = {
      name: collegeName,
      slug,
      location: typeof collegeData.location === "string" ? collegeData.location.trim() : "India",
      city: typeof collegeData.city === "string" ? collegeData.city.trim() : "Delhi NCR",
      state: typeof collegeData.state === "string" ? collegeData.state.trim() : "Delhi",
      ownership: collegeData.ownership === "Public" ? "Public" : "Private",
      rating,
      nirf_rank: typeof collegeData.nirf_rank === "string" ? collegeData.nirf_rank.trim() : "N/A",
      courses_count: typeof collegeData.courses_count === "string" ? collegeData.courses_count.trim() : "Multiple Courses",
      exams_accepted: typeof collegeData.exams_accepted === "string" ? collegeData.exams_accepted.trim() : "Entrance Exam / Merit",
      tuition_fees: typeof collegeData.tuition_fees === "string" ? collegeData.tuition_fees.trim() : "N/A",
      image_url: typeof collegeData.image_url === "string" && collegeData.image_url.trim() ? collegeData.image_url.trim() : "/images/iitdelhi_real.jpg",
      description: JSON.stringify(descObj),
    };

    // Perform database insertion
    const { data, error } = await dbClient
      .from("colleges")
      .insert([recordToInsert])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `New college '${collegeName}' inserted successfully in database.`,
      college: data ? data[0] : null,
    });
  } catch (error: any) {
    console.error("API error adding college:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add new college." },
      { status: 500 }
    );
  }
}
