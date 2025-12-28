
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hemskuneljzjcebgtjzn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbXNrdW5lbGp6amNlYmd0anpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODk0MTMsImV4cCI6MjA4MDk2NTQxM30.Lz31T8zID0rfa3KWr4OJILEp2WYcTXJt2WOBGnjRiNY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
