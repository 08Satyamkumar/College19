import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { isRequestAuthorized } from "@/lib/auth";

const dbClient = supabaseAdmin || supabase;
const HOMEPAGE_CONFIG_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    const { data, error } = await dbClient
      .from("colleges")
      .select("description")
      .eq("id", HOMEPAGE_CONFIG_ID)
      .maybeSingle();

    if (error) {
      console.error("Error fetching homepage colleges from Supabase:", error);
      return NextResponse.json({ success: false, trending: null, featured: null });
    }

    if (data && data.description) {
      try {
        const parsed = JSON.parse(data.description);
        if (parsed && (parsed.trending || parsed.featured)) {
          return NextResponse.json({
            success: true,
            trending: Array.isArray(parsed.trending) ? parsed.trending : null,
            featured: Array.isArray(parsed.featured) ? parsed.featured : null,
          });
        }
      } catch (e) {
        console.error("Error parsing homepage config JSON:", e);
      }
    }

    return NextResponse.json({ success: true, trending: null, featured: null });
  } catch (err: any) {
    console.error("API GET Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

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
    const { trending, featured } = body;

    // Validate that if trending or featured are passed, they are arrays
    const sanitizedTrending = Array.isArray(trending) ? trending.slice(0, 50) : [];
    const sanitizedFeatured = Array.isArray(featured) ? featured.slice(0, 50) : [];

    const payload = JSON.stringify({
      version: 1,
      updated_at: new Date().toISOString(),
      trending: sanitizedTrending,
      featured: sanitizedFeatured,
    });

    const record = {
      id: HOMEPAGE_CONFIG_ID,
      name: "Homepage Colleges Global Configuration",
      slug: "__homepage_colleges_config__",
      description: payload,
      location: "Global",
      city: "Global",
      state: "Global",
      ownership: "Private",
      rating: 5,
      nirf_rank: "1",
      courses_count: "0",
      exams_accepted: "None",
      tuition_fees: "0",
      image_url: "none",
    };

    const { error } = await dbClient
      .from("colleges")
      .upsert(record, { onConflict: "id" })
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Homepage colleges saved to cloud database successfully!",
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("API POST Error saving homepage colleges:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save homepage colleges to database." },
      { status: 500 }
    );
  }
}
