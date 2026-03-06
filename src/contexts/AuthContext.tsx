import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "admin_spain" | "user_latam" | null;

export type LocationValue = "MCI_SPAIN" | "MCI_LATAM";

interface AuthContextValue {
  user: User | null;
  role: Role;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_STORAGE_KEY = "app_session";
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 horas

type LegacySession = { authenticated: boolean; loginTime: number };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileRole = useCallback(async (userId: string): Promise<Role> => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    const r = data?.role as string | null;
    if (r === "admin_spain" || r === "user_latam") return r;
    return "user_latam";
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        const r = await fetchProfileRole(session.user.id);
        setRole(r);
      } else {
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        if (adminPassword) {
          let legSession: LegacySession | null = null;
          try {
            const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
            legSession = raw ? (JSON.parse(raw) as LegacySession | null) : null;
          } catch {
            legSession = null;
          }
          const isValid =
            legSession?.authenticated &&
            legSession.loginTime + SESSION_TTL > Date.now();
          if (isValid) {
            setRole("admin_spain");
          }
        }
      }
      setLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setRole(null);
        return;
      }
      if (session?.user) {
        setUser(session.user);
        const r = await fetchProfileRole(session.user.id);
        setRole(r);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfileRole]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function usePermissions(currentLocation: LocationValue | null) {
  const { role } = useAuth();
  const canManageUsers = role === "admin_spain";
  const canWriteAssets =
    role === "admin_spain" ||
    (role === "user_latam" && currentLocation === "MCI_LATAM");
  const isReadOnly = !canWriteAssets && currentLocation === "MCI_SPAIN";
  return { canManageUsers, canWriteAssets, isReadOnly };
}
