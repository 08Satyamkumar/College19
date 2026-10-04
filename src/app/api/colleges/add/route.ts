import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";

const dbClient = supabaseAdmin || supabase;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, collegeData } = body;

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

    if (!collegeData || !collegeData.name) {
      return NextResponse.json(
        { error: "College Name is a required field." },
        { status: 400 }
      );
    }

    // Generate unique slug if not provided
    const slug = collegeData.slug || collegeData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const recordToInsert = {
      ...collegeData,
      slug,
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
      message: "New college inserted successfully in database.",
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
