import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { isRequestAuthorized } from "@/lib/auth";

const dbClient = supabaseAdmin || supabase;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, slug } = body;

    // Verify admin/writer credentials via session cookie or server-side env
    const isAuthorized = await isRequestAuthorized(request, { username, password });

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login with valid credentials." },
        { status: 401 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "College slug is required to identify the record." },
        { status: 400 }
      );
    }

    const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();

    // Perform database deletion
    const { error } = await dbClient
      .from("colleges")
      .delete()
      .eq("slug", cleanSlug);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "College deleted successfully from database.",
    });
  } catch (error: any) {
    console.error("API error deleting college:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete college." },
      { status: 500 }
    );
  }
}
