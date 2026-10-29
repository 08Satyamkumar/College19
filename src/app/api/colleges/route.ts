import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function getStreamFilterClauses(s: string): string[] {
  const clean = s.trim();
  const lower = clean.toLowerCase();
  const clauses: string[] = [
    `description.ilike.%${clean}%`,
    `name.ilike.%${clean}%`,
    `courses_count.ilike.%${clean}%`,
  ];

  if (lower.includes("manage") || lower === "mba" || lower === "pgdm") {
    clauses.push(
      "description.ilike.%Management%",
      "description.ilike.%MBA%",
      "description.ilike.%PGDM%",
      "name.ilike.%Management%",
      "name.ilike.%Business%",
      "name.ilike.%MBA%",
      "name.ilike.%PGDM%",
      "courses_count.ilike.%Management%",
      "courses_count.ilike.%MBA%",
      "courses_count.ilike.%PGDM%",
      "courses_count.ilike.%BBA%"
    );
  } else if (lower.includes("engineer") || lower.includes("tech")) {
    clauses.push(
      "description.ilike.%Engineering%",
      "description.ilike.%Technology%",
      "description.ilike.%BTech%",
      "name.ilike.%Engineering%",
      "name.ilike.%Technology%",
      "name.ilike.%Tech%",
      "courses_count.ilike.%Engineering%",
      "courses_count.ilike.%B.Tech%",
      "courses_count.ilike.%BTech%"
    );
  } else if (lower.includes("medic") || lower.includes("health")) {
    clauses.push(
      "description.ilike.%Medical%",
      "description.ilike.%MBBS%",
      "name.ilike.%Medical%",
      "name.ilike.%Hospital%",
      "name.ilike.%Health%",
      "courses_count.ilike.%Medical%",
      "courses_count.ilike.%MBBS%",
      "courses_count.ilike.%BDS%"
    );
  } else if (lower.includes("law") || lower.includes("legal")) {
    clauses.push(
      "description.ilike.%Law%",
      "description.ilike.%LLB%",
      "name.ilike.%Law%",
      "name.ilike.%Legal%",
      "courses_count.ilike.%Law%",
      "courses_count.ilike.%LLB%"
    );
  } else if (lower.includes("pharm")) {
    clauses.push(
      "description.ilike.%Pharmacy%",
      "description.ilike.%Pharma%",
      "name.ilike.%Pharmacy%",
      "name.ilike.%Pharma%",
      "courses_count.ilike.%Pharmacy%",
      "courses_count.ilike.%Pharma%",
      "courses_count.ilike.%B.Pharm%"
    );
  } else if (lower.includes("design")) {
    clauses.push(
      "description.ilike.%Design%",
      "description.ilike.%Fashion%",
      "name.ilike.%Design%",
      "name.ilike.%Fashion%",
      "courses_count.ilike.%Design%",
      "courses_count.ilike.%B.Des%"
    );
  } else if (lower.includes("computer") || lower === "ca" || lower === "it") {
    clauses.push(
      "description.ilike.%Computer%",
      "name.ilike.%Computer%",
      "name.ilike.%Information Technology%",
      "courses_count.ilike.%BCA%",
      "courses_count.ilike.%MCA%"
    );
  } else if (lower.includes("commerce")) {
    clauses.push(
      "description.ilike.%Commerce%",
      "name.ilike.%Commerce%",
      "courses_count.ilike.%Commerce%",
      "courses_count.ilike.%B.Com%",
      "courses_count.ilike.%BCom%",
      "courses_count.ilike.%MCom%"
    );
  } else if (lower.includes("science")) {
    clauses.push(
      "description.ilike.%Science%",
      "name.ilike.%Science%",
      "courses_count.ilike.%Science%",
      "courses_count.ilike.%B.Sc%",
      "courses_count.ilike.%BSc%",
      "courses_count.ilike.%MSc%"
    );
  } else if (lower.includes("art") || lower.includes("humanit")) {
    clauses.push(
      "description.ilike.%Arts%",
      "name.ilike.%Arts%",
      "courses_count.ilike.%Arts%",
      "courses_count.ilike.%BA%",
      "courses_count.ilike.%MA%"
    );
  }
  return clauses;
}

function getCourseFilterClauses(c: string): string[] {
  const clean = c.trim();
  const lower = clean.toLowerCase();
  const clauses: string[] = [
    `courses_count.ilike.%${clean}%`,
    `description.ilike.%${clean}%`,
    `name.ilike.%${clean}%`,
  ];

  if (lower === "btech" || lower === "b.tech") {
    clauses.push(
      "courses_count.ilike.%B.Tech%",
      "courses_count.ilike.%BTech%",
      "description.ilike.%BTech%",
      "description.ilike.%B.Tech%",
      "name.ilike.%Engineering%",
      "name.ilike.%Technology%"
    );
  } else if (lower === "mtech" || lower === "m.tech") {
    clauses.push(
      "courses_count.ilike.%M.Tech%",
      "courses_count.ilike.%MTech%",
      "description.ilike.%MTech%"
    );
  } else if (lower === "mba" || lower === "pgdm") {
    clauses.push(
      "courses_count.ilike.%MBA%",
      "courses_count.ilike.%PGDM%",
      "description.ilike.%MBA%",
      "description.ilike.%PGDM%",
      "name.ilike.%Management%",
      "name.ilike.%Business%"
    );
  } else if (lower === "bba") {
    clauses.push("courses_count.ilike.%BBA%", "description.ilike.%BBA%");
  } else if (lower === "bca" || lower === "mca") {
    clauses.push(
      "courses_count.ilike.%BCA%",
      "courses_count.ilike.%MCA%",
      "description.ilike.%BCA%",
      "description.ilike.%MCA%"
    );
  } else if (lower === "mbbs") {
    clauses.push("courses_count.ilike.%MBBS%", "name.ilike.%Medical%");
  } else if (lower === "llb" || lower === "ba llb") {
    clauses.push("courses_count.ilike.%LLB%", "name.ilike.%Law%");
  }

  return clauses;
}

function applyFilters(query: any, { search, stream, course, state, city, ownership, exam }: any) {
  if (search) {
    query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%,description.ilike.%${search}%,courses_count.ilike.%${search}%`);
  }
  if (stream) {
    const streamList = stream.split(",").map((s: string) => s.trim()).filter(Boolean);
    if (streamList.length > 0) {
      const streamClauses: string[] = [];
      for (const s of streamList) {
        streamClauses.push(...getStreamFilterClauses(s));
      }
      query = query.or(Array.from(new Set(streamClauses)).join(","));
    }
  }
  if (course) {
    const courseList = course.split(",").map((c: string) => c.trim()).filter(Boolean);
    if (courseList.length > 0) {
      const courseFilters: string[] = [];
      for (const c of courseList) {
        courseFilters.push(...getCourseFilterClauses(c));
      }
      query = query.or(Array.from(new Set(courseFilters)).join(","));
    }
  }
  if (state) {
    query = query.in("state", state.split(","));
  }
  if (city) {
    query = query.in("city", city.split(","));
  }
  if (ownership) {
    const ownershipValues = ownership.split(",").map((val: string) => val.trim().toLowerCase());
    const mappedValues = [];
    for (const val of ownershipValues) {
      if (val.includes("public") || val.includes("govt") || val.includes("government")) {
        mappedValues.push("Public");
      } else if (val.includes("private")) {
        mappedValues.push("Private");
      } else {
        mappedValues.push(val);
      }
    }
    if (mappedValues.length > 0) {
      query = query.in("ownership", mappedValues);
    }
  }
  if (exam) {
    const examList = exam.split(",");
    const filters = examList.map((ex: string) => `exams_accepted.ilike.%${ex.trim()}%`).join(",");
    query = query.or(filters);
  }
  return query;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const search = searchParams.get("search") || "";
    const stream = searchParams.get("stream") || "";
    const course = searchParams.get("course") || "";
    const state = searchParams.get("state") || "";
    const city = searchParams.get("city") || "";
    const ownership = searchParams.get("ownership") || "";
    const exam = searchParams.get("exam") || "";
    const featuredPgdm = searchParams.get("featured_pgdm") === "true";

    if (featuredPgdm) {
      const { data: featuredData, error: featErr } = await supabase
        .from("colleges")
        .select("*")
        .or('description.ilike.%"is_featured_pgdm":true%,name.ilike.%GIMS%')
        .order("created_at", { ascending: false })
        .limit(limit);

      if (featErr) throw featErr;
      return NextResponse.json({
        colleges: featuredData || [],
        total: (featuredData || []).length,
        page: 1,
        limit,
        pages: 1,
      });
    }

    const offset = (page - 1) * limit;

    let data: any[] = [];
    let count = 0;

    // Check if no state/city filters are active to prioritize Delhi NCR
    if (!state && !city) {
      // 1. Get count of Delhi colleges matching active search, course, ownership, exam filters
      let delhiCountQuery = supabase
        .from("colleges")
        .select("id", { count: "exact", head: true })
        .or("state.ilike.%Delhi%,city.ilike.%Delhi%,location.ilike.%Delhi%");
      delhiCountQuery = applyFilters(delhiCountQuery, { search, stream, course, ownership, exam });
      const { count: delhiCount, error: dCountErr } = await delhiCountQuery;
      if (dCountErr) throw dCountErr;
      const dCount = delhiCount || 0;

      // 2. Fetch data based on current page offset
      if (offset < dCount) {
        // Query Delhi colleges first
        let delhiQuery = supabase.from("colleges").select("*");
        delhiQuery = applyFilters(delhiQuery, { search, stream, course, ownership, exam })
          .or("state.ilike.%Delhi%,city.ilike.%Delhi%,location.ilike.%Delhi%");
        delhiQuery = delhiQuery
          .order("rating", { ascending: false, nullsFirst: false })
          .range(offset, offset + limit - 1);
        const { data: delhiData, error: dErr } = await delhiQuery;
        if (dErr) throw dErr;
        data = delhiData || [];

        // If we got less than limit, fill the remaining slots with non-Delhi colleges starting from offset 0
        if (data.length < limit) {
          const needed = limit - data.length;
          let otherQuery = supabase
            .from("colleges")
            .select("*")
            .not("state", "ilike", "%Delhi%")
            .not("city", "ilike", "%Delhi%")
            .not("location", "ilike", "%Delhi%");
          otherQuery = applyFilters(otherQuery, { search, stream, course, ownership, exam });
          otherQuery = otherQuery
            .order("rating", { ascending: false, nullsFirst: false })
            .range(0, needed - 1);
          const { data: otherData, error: oErr } = await otherQuery;
          if (oErr) throw oErr;
          if (otherData) data = [...data, ...otherData];
        }
      } else {
        // Query non-Delhi colleges only
        const otherOffset = offset - dCount;
        let otherQuery = supabase
          .from("colleges")
          .select("*")
          .not("state", "ilike", "%Delhi%")
          .not("city", "ilike", "%Delhi%")
          .not("location", "ilike", "%Delhi%");
        otherQuery = applyFilters(otherQuery, { search, stream, course, ownership, exam });
        otherQuery = otherQuery
          .order("rating", { ascending: false, nullsFirst: false })
          .range(otherOffset, otherOffset + limit - 1);
        const { data: otherData, error: oErr } = await otherQuery;
        if (oErr) throw oErr;
        data = otherData || [];
      }

      // 3. Get total count of all colleges matching filters
      let totalQuery = supabase.from("colleges").select("id", { count: "exact", head: true });
      totalQuery = applyFilters(totalQuery, { search, stream, course, ownership, exam });
      const { count: total, error: tErr } = await totalQuery;
      if (tErr) throw tErr;
      count = total || 0;
    } else {
      // Normal query logic (when specific state/city filters are selected)
      let query = supabase.from("colleges").select("*", { count: "exact" });
      query = applyFilters(query, { search, stream, course, state, city, ownership, exam });
      query = query
        .order("rating", { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1);
      const { data: resultData, count: resultCount, error: err } = await query;
      if (err) throw err;
      data = resultData || [];
      count = resultCount || 0;
    }

    return NextResponse.json({
      colleges: data || [],
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    });
  } catch (error: any) {
    console.error("API error fetching colleges:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
