import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dvntgyohqrvbnfmblfug.supabase.co'
const supabaseAnonKey = 'sb_publishable_OvtQDWR8wnWNBXI9HLKomw_H5zrEXBI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
