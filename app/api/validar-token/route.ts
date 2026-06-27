import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valido: false }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select("usado, bumps")
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ valido: false });
  }

  if (data.usado) {
    return NextResponse.json({ valido: false, motivo: "ja_usado" });
  }

  return NextResponse.json({ valido: true, bumps: data.bumps });
}
