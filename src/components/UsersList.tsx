
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '@/lib/db';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Search, UserCircle } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Get all unique users with assigned assets
    const allUsers = getUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  }, []);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Usuarios con dispositivos asignados</p>
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
                  No se encontraron usuarios
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
