import { getAllWorks } from "@/lib/works";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const works = getAllWorks()
      .sort((a, b) => new Date(b.inputDate) - new Date(a.inputDate))
      .slice(0, 3);

    return NextResponse.json(works);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 });
  }
}
