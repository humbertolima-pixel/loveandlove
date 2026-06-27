import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

/**
 * Cliente Supabase para uso exclusivo no servidor (API routes).
 * Usa a service role key — ignora RLS, nunca expor no client.
 * NUNCA importar este arquivo em um componente "use client".
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
