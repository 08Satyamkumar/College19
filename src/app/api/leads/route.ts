import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const dbClient = supabaseAdmin || supabase;

// Common repetitive fake phone patterns
const BLOCKED_PHONE_PATTERNS = [
  "1111111111",
  "2222222222",
  "3333333333",
  "4444444444",
  "5555555555",
  "6666666666",
  "7777777777",
  "8888888888",
  "9999999999",
  "1234567890",
  "9876543210",
  "0123456789",
];

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting (Generous: 20 submissions per 5 min to safely accommodate shared Wi-Fi)
    const clientIp = getClientIp(request);
    const ipRateLimit = checkRateLimit(`ip:${clientIp}`, 20, 5 * 60 * 1000);

    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many submissions from your network. Please wait ${ipRateLimit.resetInSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));

    // 2. Invisible Honeypot Trap
    // Bots usually fill hidden fields like 'website', 'company_name', 'honeypot', or 'fax'.
    // If any honeypot field is filled, silently return 200 without saving to DB.
    if (body.website || body.honeypot || body.company_name || body.fax || body.bot_check) {
      return NextResponse.json({
        success: true,
        message: "Lead submitted successfully! Our counselor will contact you soon.",
      });
    }

    const { name, email, phone, course_interest, state_interest, college_interest, status } = body;

    // 3. Name Validation & Sanitization
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Full Name is required." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters." },
        { status: 400 }
      );
    }

    // Reject spam containing web links or script tags in name
    if (/https?:\/\/|<script|www\./i.test(cleanName)) {
      return NextResponse.json(
        { error: "Please enter a valid human name." },
        { status: 400 }
      );
    }

    // 4. Phone Number Validation & Sanitization (Strict 10-digit Indian Mobile)
    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    const rawPhone = String(phone).trim();
    // Strip spaces, dashes, brackets, and leading +91 or 0
    let cleanPhone = rawPhone.replace(/[\s\-\(\)\+]/g, "");
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    } else if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.substring(1);
    }

    // Must be valid 10-digit starting with 6, 7, 8, or 9
    const isValidIndianMobile = /^[6-9]\d{9}$/.test(cleanPhone);
    if (!isValidIndianMobile || BLOCKED_PHONE_PATTERNS.includes(cleanPhone)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Per-Phone Rate Limit: Max 4 submissions per identical phone number per 5 minutes
    const phoneRateLimit = checkRateLimit(`phone:${cleanPhone}`, 4, 5 * 60 * 1000);
    if (!phoneRateLimit.allowed) {
      return NextResponse.json(
        { error: "An inquiry for this mobile number was recently submitted. Our counselors will reach out to you shortly." },
        { status: 429 }
      );
    }

    // 5. Optional Email Validation
    let cleanEmail: string | null = null;
    if (email && typeof email === "string" && email.trim()) {
      cleanEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return NextResponse.json(
          { error: "Please provide a valid email address." },
          { status: 400 }
        );
      }
    }

    // 6. Sanitize remaining fields
    const cleanCourse = typeof course_interest === "string" ? course_interest.trim().substring(0, 150) : null;
    const cleanState = typeof state_interest === "string" ? state_interest.trim().substring(0, 100) : null;
    const cleanCollege = typeof college_interest === "string" ? college_interest.trim().substring(0, 250) : null;
    const cleanStatus = status && typeof status === "string" ? status.trim().substring(0, 50) : "Pending";

    // 7. Insert lead safely into Supabase
    const { data, error } = await dbClient
      .from("leads")
      .insert([
        {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          course_interest: cleanCourse,
          state_interest: cleanState,
          college_interest: cleanCollege,
          status: cleanStatus,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully! Our counselor will contact you soon.",
      lead: data ? data[0] : null,
    });
  } catch (error: any) {
    console.error("API error submitting lead:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit lead." },
      { status: 500 }
    );
  }
}
