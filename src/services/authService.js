import { getSupabase } from "./supabaseClient.js";

async function getAdminUser() {
  const supabase = getSupabase();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) return null;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  return profile?.role === "admin" ? user : null;
}

export const authService = {
  async signIn(email, password) {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const user = await getAdminUser();
    if (!user) {
      await supabase.auth.signOut({ scope: "local" });
      throw new Error("This account does not have admin access.");
    }
    return user;
  },
  getCurrentAdmin: getAdminUser,
  onAuthStateChange(callback) {
    return getSupabase().auth.onAuthStateChange(callback);
  },
  async signOut() {
    const { error } = await getSupabase().auth.signOut({ scope: "local" });
    if (error) throw error;
  },
  async requestPasswordReset(email) {
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin.html`
    });
    if (error) throw error;
  }
};