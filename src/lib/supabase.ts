import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Construct Supabase URL from project ID
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

console.log('✅ Supabase connected:', supabaseUrl);
console.log('📋 Next steps:');
console.log('   1. Create profiles table (see /SETUP_INSTRUCTIONS.md)');
console.log('   2. Enable Google OAuth in Supabase dashboard');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);