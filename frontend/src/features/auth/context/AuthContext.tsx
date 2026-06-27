import {
  useEffect,
  useState,
} from "react";

import type {
  Session,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { AuthContext } from "./auth-context";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
