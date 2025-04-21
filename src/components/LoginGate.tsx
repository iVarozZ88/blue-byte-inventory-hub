
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const ADMIN_PASSWORD = "Inventory@@12345@";
const SESSION_KEY = "app_is_authenticated";

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "yes") {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "yes");
      setAuthenticated(true);
    } else {
      setShowError(true);
      toast({
        title: "Contraseña incorrecta",
        description: "La contraseña introducida no es válida.",
        variant: "destructive"
      });
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Acceso Administrador</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">Introduce la contraseña para acceder.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input 
              type="password" 
              placeholder="Contraseña"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setShowError(false);
              }}
              data-testid="admin-password-input"
              autoFocus
              onKeyDown={e => {
                if (e.key === "Enter") handleSubmit(e);
              }}
            />
            <Button type="submit">Acceder</Button>
            {showError && (
              <div className="text-red-600 text-sm">Contraseña incorrecta</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
