import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { isRequestAuthorized } from "@/lib/auth";

const dbClient = supabaseAdmin || supabase;
const PROTECTED_SLUGS = ["__homepage_colleges_config__"];

export async function POST(request: Request) {
  try {
    // 1. Verify admin/writer credentials strictly via signed session token
    const isAuthorized = await isRequestAuthorized(request);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access. Valid administrator session required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { slug, updatedFields } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "College slug is required to identify the record." },
        { status: 400 }
      );
    }

    const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();

    // Prevent direct editing of system configuration records via college update API
    if (PROTECTED_SLUGS.includes(cleanSlug)) {
      return NextResponse.json(
        { error: "Protected system configuration cannot be modified via college update API." },
        { status: 403 }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      return NextResponse.json(
        { error: "Invalid slug format. Slugs may only contain lowercase letters, numbers, and hyphens." },
        { status: 400 }
      );
    }

    if (!updatedFields || typeof updatedFields !== "object" || Array.isArray(updatedFields)) {
      return NextResponse.json(
        { error: "Invalid updatedFields payload." },
        { status: 400 }
      );
    }

    // 1. Check if a record already exists with this slug (exact or case-insensitive)
    let { data: existingRows, error: findError } = await dbClient
      .from("colleges")
      .select("id, slug, name, description")
      .eq("slug", cleanSlug)
      .limit(1);

    if (!existingRows || existingRows.length === 0) {
      const res = await dbClient
        .from("colleges")
        .select("id, slug, name, description")
        .ilike("slug", cleanSlug)
        .limit(1);
      if (res.data && res.data.length > 0) {
        existingRows = res.data;
      }
    }

    if (findError) {
      console.error("Error searching for existing college:", findError);
    }

    let parsedDesc: any = {};
    if (updatedFields?.description) {
      try {
        parsedDesc = typeof updatedFields.description === "string" 
          ? JSON.parse(updatedFields.description) 
          : updatedFields.description;
      } catch (e) {
        parsedDesc = {};
      }
    }

    const collegeName =
      (typeof updatedFields?.name === "string" && updatedFields.name.trim()) ||
      parsedDesc.name ||
      parsedDesc.fullName ||
      cleanSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase());

    const collegeCity = updatedFields?.city || parsedDesc.city || "Delhi NCR";
    const collegeState = updatedFields?.state || parsedDesc.state || "India";
    const collegeLocation =
      updatedFields?.location ||
      parsedDesc.location ||
      `${collegeCity}, ${collegeState}`;

    const collegeRating = (updatedFields?.rating || parsedDesc.rating || 4.8).toString();
    const collegeNirf =
      (updatedFields?.nirf_rank || parsedDesc.nirfRank || "N/A").toString().replace(/[^0-9]/g, "") || "N/A";

    const collegeOwnership =
      updatedFields?.ownership ||
      (parsedDesc.type?.includes("Private") ? "Private" : "Public");

    const collegeTuitionFees =
      updatedFields?.tuition_fees ||
      parsedDesc.totalFees ||
      "N/A";

    const collegeImageUrl =
      updatedFields?.image_url ||
      parsedDesc.image ||
      (parsedDesc.coverImages && parsedDesc.coverImages[0]) ||
      "/images/iitdelhi_real.jpg";

    // Ensure all custom objects (articles, arrays, coverImages, etc.) are safely packed inside the description JSON
    // Protect against prototype pollution
    let completeDescriptionObj: any = { ...parsedDesc };
    if (updatedFields) {
      Object.keys(updatedFields).forEach((key) => {
        if (!["id", "slug", "created_at", "__proto__", "constructor", "prototype"].includes(key)) {
          if (key === "description" && typeof updatedFields[key] === "string") {
            try {
              const innerParsed = JSON.parse(updatedFields[key]);
              completeDescriptionObj = { ...completeDescriptionObj, ...innerParsed };
            } catch (e) {}
          } else {
            completeDescriptionObj[key] = updatedFields[key];
          }
        }
      });
    }

    const fieldsToSave = {
      name: collegeName,
      location: collegeLocation,
      city: collegeCity,
      state: collegeState,
      ownership: collegeOwnership,
      rating: collegeRating,
      nirf_rank: collegeNirf,
      tuition_fees: collegeTuitionFees,
      image_url: collegeImageUrl,
      description: JSON.stringify(completeDescriptionObj),
    };

    let resultData = null;

    if (existingRows && existingRows.length > 0) {
      const existingId = existingRows[0].id;
      const { data, error } = await dbClient
        .from("colleges")
        .update(fieldsToSave)
        .eq("id", existingId)
        .select();

      if (error) throw error;
      resultData = data ? data[0] : null;
    } else {
      const newCollegeRecord = {
        slug: cleanSlug,
        courses_count: "Multiple Courses",
        exams_accepted: "Entrance Exam / Merit",
        ...fieldsToSave,
      };

      const { data, error } = await dbClient
        .from("colleges")
        .insert([newCollegeRecord])
        .select();

      if (error) throw error;
      resultData = data ? data[0] : null;
    }

    return NextResponse.json({
      success: true,
      message: "College details saved and synchronized successfully in database.",
      college: resultData,
    });
  } catch (error: any) {
    console.error("API error updating college:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update college details." },
      { status: 500 }
    );
  }
}
