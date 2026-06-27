import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Cliente Supabase para uso no navegador (componentes client-side).
 * Usa a chave anônima — respeita as Row Level Security policies do banco.
 */
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
