import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, slug, updatedFields } = body;

    // Verify admin credentials
    if (username !== "Samrat1311" || password !== "1311161161") {
      return NextResponse.json(
        { error: "Unauthorized admin access." },
        { status: 401 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "College slug is required to identify the record." },
        { status: 400 }
      );
    }

    const cleanSlug = slug.trim();

    // 1. Check if a record already exists with this slug
    const { data: existingRows, error: findError } = await supabase
      .from("colleges")
      .select("id, slug, name")
      .eq("slug", cleanSlug)
      .limit(1);

    if (findError) {
      console.error("Error searching for existing college:", findError);
    }

    let resultData = null;

    if (existingRows && existingRows.length > 0) {
      // 2. Existing record found -> Perform Update
      const { data, error } = await supabase
        .from("colleges")
        .update(updatedFields)
        .eq("slug", cleanSlug)
        .select();

      if (error) throw error;
      resultData = data ? data[0] : null;
    } else {
      // 3. No existing record found -> Perform Smart Insert / Upsert
      let parsedDesc: any = {};
      if (updatedFields?.description) {
        try {
          parsedDesc = JSON.parse(updatedFields.description);
        } catch (e) {
          parsedDesc = {};
        }
      }

      const collegeName =
        parsedDesc.name ||
        cleanSlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
      const collegeCity = parsedDesc.city || "Delhi NCR";
      const collegeState = parsedDesc.state || "India";
      const collegeLocation =
        parsedDesc.location || `${collegeCity}, ${collegeState}`;
      const collegeRating = (parsedDesc.rating || 4.8).toString();
      const collegeNirf =
        parsedDesc.nirfRank?.toString().replace(/[^0-9]/g, "") || "N/A";
      const collegeOwnership = parsedDesc.type?.includes("Private")
        ? "Private"
        : "Public";

      const newCollegeRecord = {
        slug: cleanSlug,
        name: collegeName,
        location: collegeLocation,
        city: collegeCity,
        state: collegeState,
        ownership: collegeOwnership,
        rating: collegeRating,
        nirf_rank: collegeNirf,
        courses_count: "Multiple Courses",
        exams_accepted: "Entrance Exam / Merit",
        tuition_fees: updatedFields?.tuition_fees || parsedDesc.totalFees || "N/A",
        image_url:
          updatedFields?.image_url ||
          parsedDesc.image ||
          "/images/iitdelhi_real.jpg",
        description: updatedFields?.description || "{}",
        ...updatedFields,
      };

      const { data, error } = await supabase
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
