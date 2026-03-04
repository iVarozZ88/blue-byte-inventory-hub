// src/components/UsersList.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '@/lib/db'; // Asumimos que getUsers puede ser modificado para aceptar 'location'
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Search, UserCircle, Loader2 } from 'lucide-react';

// ¡¡IMPORTANTE!! Define la interfaz de props que este componente UsersList va a recibir.
interface UsersListProps {
  currentLocation: 'spain' | 'latam' | null;
}

// El componente UsersList ahora acepta 'currentLocation' como una prop.
const UsersList: React.FC<UsersListProps> = ({ currentLocation }) => {
  const [users, setUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true); // Siempre poner loading a true al iniciar la carga
      try {
        // Modificamos getUsers para que acepte la ubicación.
        // ¡Recordatorio: debes adaptar tu función getUsers en src/lib/db.ts para que realmente filtre por esta ubicación!
        const allUsers = await getUsers(currentLocation); // Pasamos currentLocation
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        console.log(`[UsersList] Usuarios cargados para la ubicación: ${currentLocation}`); // Para depuración
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Solo carga usuarios si hay una ubicación seleccionada.
    if (currentLocation) {
      loadUsers();
    } else {
      // Si currentLocation es null (ej. antes de seleccionar una ubicación inicial si no se inicializa),
      // puedes decidir si mostrar una lista vacía, un mensaje, o cargar todos los usuarios.
      // Por ahora, lo dejaremos en cargando y luego vacío.
      setLoading(false);
      setUsers([]);
      setFilteredUsers([]);
    }

  }, [currentLocation]); // Este useEffect ahora depende de currentLocation, se ejecutará cuando cambie.

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value) {
      const searchLower = value.toLowerCase();
      const filtered = users.filter(user => 
        user.toLowerCase().includes(searchLower)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {/* Mensaje de carga dinámico según la ubicación */}
        <span className="ml-2 text-lg">Cargando usuarios para {currentLocation === 'spain' ? 'España' : currentLocation === 'latam' ? 'LATAM' : 'la ubicación seleccionada'}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        {/* Título dinámico que muestra la ubicación actual */}
        <h1 className="text-2xl font-bold">Usuarios {currentLocation ? `(${currentLocation === 'spain' ? 'España' : 'LATAM'})` : ''}</h1>
        <p className="text-muted-foreground">Usuarios con dispositivos asignados para la ubicación seleccionada.</p>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  {/* Mensaje dinámico si no hay usuarios */}
                  No se encontraron usuarios para {currentLocation ? (currentLocation === 'spain' ? 'España' : 'LATAM') : 'la ubicación seleccionada'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <UserCircle size={20} className="text-gray-500" />
                    {user}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/users/${encodeURIComponent(user)}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver dispositivos
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersList;
