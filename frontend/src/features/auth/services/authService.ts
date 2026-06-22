import { supabase } from "@/lib/supabase";

export async function signUp(
  email: string,
  password: string,
  fullName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("AUTH ERROR:", error);
    throw error;
  }

  console.log("AUTH SUCCESS:", data);

  if (data.user) {
    const { error: profileError } =
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "owner",
      });

    console.log(
      "PROFILE INSERT ERROR:",
      profileError
    );
  }

  return data;
}

export async function signIn(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}