import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { isRequestAuthorized } from "@/lib/auth";

const dbClient = supabaseAdmin || supabase;
const PROTECTED_SLUGS = ["__homepage_colleges_config__"];

export async function POST(request: Request) {
  try {
    // 1. Verify admin/writer session strictly via signed session token
    const isAuthorized = await isRequestAuthorized(request);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access. Valid administrator session required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "College slug is required to identify the record." },
        { status: 400 }
      );
    }

    const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();

    // Prevent deletion of protected system configurations
    if (PROTECTED_SLUGS.includes(cleanSlug)) {
      return NextResponse.json(
        { error: "Cannot delete protected system configuration." },
        { status: 403 }
      );
    }

    // Validate slug format: alphanumeric and hyphens only
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      return NextResponse.json(
        { error: "Invalid slug format. Slugs may only contain lowercase letters, numbers, and hyphens." },
        { status: 400 }
      );
    }

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
      message: `College '${cleanSlug}' deleted successfully from database.`,
    });
  } catch (error: any) {
    console.error("API error deleting college:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete college." },
      { status: 500 }
    );
  }
}
