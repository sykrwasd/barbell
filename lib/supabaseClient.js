
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ravzxuywaoixqhsufkuv.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

if(supabase){
    console.log("supabase client created");
}else{
    console.log("supabase client not created");
}