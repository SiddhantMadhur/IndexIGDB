const { createClient } = require("@supabase/supabase-js");
const { supabaseAPI, supabaseURL } = require("./variables");

module.exports.supabase = createClient(supabaseURL, supabaseAPI, {
    "auth": {
        "persistSession": false
    }
});
