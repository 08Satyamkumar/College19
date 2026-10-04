import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";

const dbClient = supabaseAdmin || supabase;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, slug } = body;

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
