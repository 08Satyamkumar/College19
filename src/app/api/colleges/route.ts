import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function applyFilters(query: any, { search, course, state, city, ownership, exam }: any) {
  if (search) {
    query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%,description.ilike.%${search}%,courses_count.ilike.%${search}%`);
  }
  if (course) {
    const courseList = course.split(",").map((c: string) => c.trim()).filter(Boolean);
    if (courseList.length > 0) {
      const courseFilters = courseList
        .map((c: string) => `courses_count.ilike.%${c}%,description.ilike.%${c}%,name.ilike.%${c}%`)
        .join(",");
      query = query.or(courseFilters);
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
      delhiCountQuery = applyFilters(delhiCountQuery, { search, course, ownership, exam });
      const { count: delhiCount, error: dCountErr } = await delhiCountQuery;
      if (dCountErr) throw dCountErr;
      const dCount = delhiCount || 0;

      // 2. Fetch data based on current page offset
      if (offset < dCount) {
        // Query Delhi colleges first
        let delhiQuery = supabase.from("colleges").select("*");
        delhiQuery = applyFilters(delhiQuery, { search, course, ownership, exam })
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
          otherQuery = applyFilters(otherQuery, { search, course, ownership, exam });
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
        otherQuery = applyFilters(otherQuery, { search, course, ownership, exam });
        otherQuery = otherQuery
          .order("rating", { ascending: false, nullsFirst: false })
          .range(otherOffset, otherOffset + limit - 1);
        const { data: otherData, error: oErr } = await otherQuery;
        if (oErr) throw oErr;
        data = otherData || [];
      }

      // 3. Get total count of all colleges matching filters
      let totalQuery = supabase.from("colleges").select("id", { count: "exact", head: true });
      totalQuery = applyFilters(totalQuery, { search, course, ownership, exam });
      const { count: total, error: tErr } = await totalQuery;
      if (tErr) throw tErr;
      count = total || 0;
    } else {
      // Normal query logic (when specific state/city filters are selected)
      let query = supabase.from("colleges").select("*", { count: "exact" });
      query = applyFilters(query, { search, course, state, city, ownership, exam });
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
