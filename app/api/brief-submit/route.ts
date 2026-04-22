import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();

    const name    = (body.get("name")    as string) ?? "";
    const email   = (body.get("email")   as string) ?? "";
    const company = (body.get("company") as string) ?? "";
    const brief   = (body.get("brief")   as string) ?? "";
    const files   = body.getAll("files");

    if (!email.trim()) {
      return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    }

    // Log submission — replace with your email/CRM/storage integration
    console.log("[brief-submit]", {
      name, email, company,
      briefLength: brief.length,
      fileCount: files.length,
      fileNames: files
        .filter((f): f is File => f instanceof File)
        .map(f => f.name),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[brief-submit] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
