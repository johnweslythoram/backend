const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wwkyansqtrrjjdahefmq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3a3lhbnNxdHJyampkYWhlZm1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzc0MDM4OCwiZXhwIjoyMDU5MzE2Mzg4fQ.EvefG7tvRTwAE1JEA17ZHcNzeK5c9P7LObNeyXYdmG0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
