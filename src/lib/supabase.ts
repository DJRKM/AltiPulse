import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fwpjilisagvusbumcjsw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cGppbGlzYWd2dXNidW1janN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MzUyMjEsImV4cCI6MjEwNDExMTIyMX0.vGFjcHb4sjSzByDlHTNPtcmN_e0lGMWVQYmrMg9neZ8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
