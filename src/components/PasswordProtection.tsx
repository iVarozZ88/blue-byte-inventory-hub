
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const CORRECT_PASSWORD = "Inventory@@12345@";
const PASSWORD_STORAGE_KEY = "inventory-app-authenticated";

const PasswordProtection = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem(PASSWORD_STORAGE_KEY) === "true";
    if (isAuthenticated) {
      // If authenticated, redirect to the intended page
      if (location.pathname === "/login") {
        navigate("/");
      }
    }
  }, [navigate, location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      // Store authentication status
      localStorage.setItem(PASSWORD_STORAGE_KEY, "true");
      
      toast({
        title: "Acceso correcto",
        description: "Bienvenido al sistema de inventario",
      });
      
      // Redirect to home page
      navigate("/");
    } else {
      setError(true);
      toast({
        variant: "destructive",
        title: "Contraseña incorrecta",
        description: "Por favor intente nuevamente",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sistema de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className={error ? "border-red-500" : ""}
                  placeholder="Ingrese la contraseña"
                  autoComplete="current-password"
                />
                {error && (
                  <p className="text-sm text-red-500">Contraseña incorrecta</p>
                )}
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit" className="w-full">
                Acceder
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Ingrese la contraseña para acceder al sistema
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordProtection;
