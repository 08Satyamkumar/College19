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
      .select("id, slug, name, description, image_url")
      .eq("slug", cleanSlug)
      .limit(1);

    if (!existingRows || existingRows.length === 0) {
      const res = await dbClient
        .from("colleges")
        .select("id, slug, name, description, image_url")
        .ilike("slug", cleanSlug)
        .limit(1);
      if (res.data && res.data.length > 0) {
        existingRows = res.data;
      }
    }

    if (findError) {
      console.error("Error searching for existing college:", findError);
    }

    // Parse existing description JSON from database so existing details (logo, coverImages, highlights, placements, etc.) are NEVER wiped out
    let existingDescObj: any = {};
    if (existingRows && existingRows[0]?.description) {
      try {
        existingDescObj =
          typeof existingRows[0].description === "string"
            ? JSON.parse(existingRows[0].description)
            : (existingRows[0].description || {});
      } catch (e) {
        if (typeof existingRows[0].description === "string" && existingRows[0].description.trim()) {
          existingDescObj = {
            about: existingRows[0].description,
            description: existingRows[0].description,
          };
        }
      }
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
      existingDescObj.name ||
      existingDescObj.fullName ||
      cleanSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase());

    const collegeCity = updatedFields?.city || parsedDesc.city || existingDescObj.city || "Delhi NCR";
    const collegeState = updatedFields?.state || parsedDesc.state || existingDescObj.state || "India";
    const collegeLocation =
      updatedFields?.location ||
      parsedDesc.location ||
      existingDescObj.location ||
      `${collegeCity}, ${collegeState}`;

    const collegeRating = (updatedFields?.rating || parsedDesc.rating || existingDescObj.rating || 4.8).toString();
    const collegeNirf =
      (updatedFields?.nirf_rank || parsedDesc.nirfRank || existingDescObj.nirfRank || "N/A").toString().replace(/[^0-9]/g, "") || "N/A";

    const collegeOwnership =
      updatedFields?.ownership ||
      (parsedDesc.type?.includes("Private") ? "Private" : existingDescObj.type?.includes("Private") ? "Private" : "Public");

    const collegeTuitionFees =
      updatedFields?.tuition_fees ||
      parsedDesc.totalFees ||
      existingDescObj.totalFees ||
      existingDescObj.feeRange ||
      "N/A";

    // Safe Deep Merge: Start with existing database description to PRESERVE all detailed college content
    let completeDescriptionObj: any = { ...existingDescObj };

    // 1. Merge in parsedDesc from updatedFields.description
    if (parsedDesc && typeof parsedDesc === "object") {
      Object.keys(parsedDesc).forEach((k) => {
        if (!["id", "slug", "created_at", "__proto__", "constructor", "prototype"].includes(k)) {
          if (parsedDesc[k] !== undefined && parsedDesc[k] !== null && parsedDesc[k] !== "") {
            completeDescriptionObj[k] = parsedDesc[k];
          }
        }
      });
    }

    // 2. Merge in direct updatedFields
    if (updatedFields && typeof updatedFields === "object") {
      Object.keys(updatedFields).forEach((key) => {
        if (!["id", "slug", "created_at", "__proto__", "constructor", "prototype"].includes(key)) {
          if (key === "description") {
            // Already handled above
          } else if (key === "logo" || key === "logo_url") {
            if (updatedFields[key]) {
              completeDescriptionObj.logo = updatedFields[key];
            }
          } else if (key === "coverImages") {
            if (Array.isArray(updatedFields[key]) && updatedFields[key].length > 0) {
              completeDescriptionObj.coverImages = updatedFields[key];
            }
          } else if (updatedFields[key] !== undefined && updatedFields[key] !== null) {
            completeDescriptionObj[key] = updatedFields[key];
          }
        }
      });
    }

    // 3. Absolute Safeguard for Logo: If updated payload didn't provide a logo, keep existing logo
    if (!completeDescriptionObj.logo && existingDescObj.logo) {
      completeDescriptionObj.logo = existingDescObj.logo;
    }

    // 4. Absolute Safeguard for Cover Images: If updated payload didn't provide coverImages, keep existing ones!
    if (
      (!completeDescriptionObj.coverImages || completeDescriptionObj.coverImages.length === 0) &&
      existingDescObj.coverImages &&
      existingDescObj.coverImages.length > 0
    ) {
      completeDescriptionObj.coverImages = existingDescObj.coverImages;
    }

    // 5. Preserve other deep sub-objects/arrays if they existed
    const preservedKeys = [
      "author",
      "highlights",
      "gallery",
      "campus_facilities",
      "facilities",
      "faculty",
      "alumni",
      "placements",
      "cutoffs",
      "scholarships",
      "reviews",
      "courses_offered_table",
      "fees_eligibility_table",
    ];
    preservedKeys.forEach((pk) => {
      if (
        (!completeDescriptionObj[pk] || (Array.isArray(completeDescriptionObj[pk]) && completeDescriptionObj[pk].length === 0)) &&
        existingDescObj[pk]
      ) {
        completeDescriptionObj[pk] = existingDescObj[pk];
      }
    });

    const collegeImageUrl =
      (typeof updatedFields?.image_url === "string" && updatedFields.image_url.trim()) ||
      (completeDescriptionObj.coverImages && completeDescriptionObj.coverImages[0]) ||
      completeDescriptionObj.image ||
      (existingRows && (existingRows[0] as any)?.image_url) ||
      "/images/iitdelhi_real.jpg";

    const fieldsToSave: any = {
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

    if (updatedFields?.courses_count) {
      fieldsToSave.courses_count = updatedFields.courses_count;
    }
    if (updatedFields?.exams_accepted) {
      fieldsToSave.exams_accepted = updatedFields.exams_accepted;
    }

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
