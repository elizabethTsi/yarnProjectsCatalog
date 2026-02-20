import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    "https://uvznqzvaclgxtcbkqnoe.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2em5xenZhY2xneHRjYmtxbm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NTkzMjksImV4cCI6MjA4MTMzNTMyOX0.mB66YJI4kWzb5Qs3bw0GefABKcCkVnTiRj30woNgmWM"
    );