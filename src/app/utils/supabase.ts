import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://tnaibgojyljpkwnujgyf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYWliZ29qeWxqcGt3bnVqZ3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDQ0NTUsImV4cCI6MjA5NTg4MDQ1NX0.I_qdFKq_tQAu8w-KMw7rMDwI8n3gQXwCmQGSO4pL6dE"
);