import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";

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
            trending: parsed.trending || null,
            featured: parsed.featured || null,
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
    const body = await request.json();
    const { username, password, trending, featured } = body;

    // Verify admin/writer credentials
    const isAuthorized =
      (username === "Samrat1311" && password === "1311161161") ||
      (username?.toLowerCase() === "writer" && password === "Writer2026");

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login with valid credentials." },
        { status: 401 }
      );
    }

    const payload = JSON.stringify({
      version: 1,
      updated_at: new Date().toISOString(),
      trending: trending || [],
      featured: featured || [],
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

    const { data, error } = await dbClient
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
