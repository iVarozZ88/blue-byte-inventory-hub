import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SESSION_STORAGE_KEY = "app_session";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, role, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const authenticated = !!user || !!role;

  const handleLegacyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ authenticated: true, loginTime: Date.now() })
      );
      window.location.reload();
    } else {
      setShowError(true);
      toast({
        title: "Contraseña incorrecta",
        description: "La contraseña introducida no es válida.",
        variant: "destructive",
      });
    }
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setShowError(false);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
      toast({
        title: "Error de acceso",
        description: msg,
        variant: "destructive",
      });
      setShowError(true);
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (authenticated) return <>{children}</>;

  const useLegacyAuth = !user && ADMIN_PASSWORD;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Acceso</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            {useLegacyAuth
              ? "Introduce la contraseña para acceder."
              : "Inicia sesión con tu cuenta."}
          </p>
        </CardHeader>
        <CardContent>
          {useLegacyAuth ? (
            <form onSubmit={handleLegacyLogin} className="flex flex-col gap-4">
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowError(false);
                }}
                data-testid="admin-password-input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLegacyLogin(e);
                }}
              />
              <Button type="submit">Acceder</Button>
            </form>
          ) : (
            <form onSubmit={handleSupabaseLogin} className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setShowError(false);
                }}
                autoComplete="email"
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowError(false);
                }}
                autoComplete="current-password"
              />
              <Button type="submit" disabled={signingIn}>
                {signingIn ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>
          )}
          {showError && (
            <div className="text-red-600 text-sm mt-2">
              Credenciales incorrectas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
