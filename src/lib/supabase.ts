import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://ujvqnzoevjnoawkinypn.supabase.co";
export const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdnFuem9ldmpub2F3a2lueXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjAxMjcsImV4cCI6MjA2NDA5NjEyN30.3ATSPDwWW0d4E0I8Y8iaKQJUL2BN_EKoG2MP76AJLEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
