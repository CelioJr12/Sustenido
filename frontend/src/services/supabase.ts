import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qsayzspxrzdbkgdyngav.supabase.co'
const supabaseKey = 'sb_publishable_-Qqw9PCHSs-r_EHCHXxMGg__Mb-vMtl'

export const supabase = createClient(supabaseUrl, supabaseKey)