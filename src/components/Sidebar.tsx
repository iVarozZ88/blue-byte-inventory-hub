import React, { useState } from 'react'; // Importa useState para el estado del desplegable
import { Link, useLocation, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Computer,
  Laptop,
  Monitor, // Se usará como icono para "Periféricos" y para el sub-menú
  Mouse,
  Keyboard,
  Phone,
  Smartphone,
  Printer,
  ScanLine,
  PlusCircle,
  Trash2,
  Cable,
  Users,
  FileText,
  FolderLock,
  MapPin,
  ChevronDown // Icono para el desplegable
} from 'lucide-react';

// Definición de las propiedades que el componente Sidebar recibirá
interface SidebarProps {
  onLocationSelect: (location: 'spain' | 'latam' | null) => void; // Función para notificar la selección de ubicación (puede ser null)
  currentLocation: 'spain' | 'latam' | null;              // Ubicación actual para mostrar y activar botones
  onAddAssetClick: () => void; // Añadimos esta prop para el botón "Agregar Activo"
}

const Sidebar: React.FC<SidebarProps> = ({ onLocationSelect, currentLocation, onAddAssetClick }) => {
  const location = useLocation();
  // Estado para controlar si el menú de Periféricos está abierto o cerrado
  const [isPeripheralsOpen, setIsPeripheralsOpen] = useState(false);

  const isActive = (path: string) => {
    // Para la ruta raíz, consideramos /dashboard como activo
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    // Para otras rutas, verifica si la ruta actual comienza con el path
    return location.pathname.startsWith(path);
  };

  // Función para verificar si alguna de las sub-rutas de periféricos está activa
  const isAnyPeripheralActive = () => {
    return (
      isActive('/assets/monitor') ||
      isActive('/assets/mouse') ||
      isActive('/assets/keyboard') ||
      isActive('/assets/cable') ||
      isActive('/assets/scanner') ||
      isActive('/assets/printer')
    );
  };

  return (
    <div className="bg-sidebar fixed left-0 top-0 h-full w-64 text-white overflow-y-auto">
      {/* Sección del Logo y Título (centrado verticalmente) */}
      {/* Se mantiene el div p-5 pero se ajusta para centrar el logo y el texto verticalmente */}
      <div className="p-5 flex flex-col items-center justify-center border-b border-gray-700">
        <Link to="/Dashboard" className="flex flex-col items-center text-center space-y-1"> {/* Usar flex-col para apilar */}
          {/* Asegúrate de que el archivo 'Logo MCI Group.jpg' esté en la carpeta 'public' */}
           <img src="/logo.jpg" alt="MCI Inventory Logo" className="h-20 w-15" /> 
          <span className="text-xl font-extrabold tracking-tight text-blue-400">
            INVENTORY
          </span>
        </Link>
        {/* La papelera ha sido movida de aquí */}
      </div>

      {/* Selector de Ubicación */}
      <div className="px-3 py-4 mb-6 border-b border-gray-700">
        <h3 className="text-gray-400 text-sm uppercase mb-3 flex items-center space-x-2">
          <MapPin size={16} />
          <span>Ubicación</span>
        </h3>
        <button
          className={`w-full text-left py-2 px-3 rounded mb-2 transition-colors duration-200
                      ${currentLocation === 'spain' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          onClick={() => onLocationSelect('spain')}
        >
          INVENTORY MCI (España)
        </button>
        <button
          className={`w-full text-left py-2 px-3 rounded transition-colors duration-200
                      ${currentLocation === 'latam' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          onClick={() => onLocationSelect('latam')}
        >
          INVENTORY MCI LATAM (Rep. Dominicana)
        </button>
      </div>

      {/* Botón "Agregar Activo" */}
      <div className="px-3 py-2 mb-4"> {/* Añadimos mb-4 para espacio inferior */}
        <button
          onClick={onAddAssetClick} // Usa la prop pasada desde Layout
          disabled={!currentLocation} // Deshabilita si no hay ubicación seleccionada
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusCircle size={16} />
          <span>Agregar Activo</span>
        </button>
      </div>

      {/* Menú de Categorías */}
      <nav className="mt-5 px-3"> {/* Añadimos px-3 para padding horizontal */}
        <NavLink
          to="/Dashboard"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive('/Dashboard') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
          }
        >
          <LayoutDashboard size={18} className="mr-3" /> {/* Añadimos margen derecho al icono */}
          <span>Panel Principal</span>
        </NavLink>

        {/* Grupo de Activos */}
        <div className="mt-4 mb-2 text-gray-400 text-xs uppercase font-semibold pl-3">Activos por Tipo</div>

        {/* Enlaces de activos que no son periféricos */}
        <NavLink
          to="/assets/computer"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive('/assets/computer') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
          }
        >
          <Computer size={18} className="mr-3" />
          <span>Computadoras</span>
        </NavLink>

        <NavLink
          to="/assets/laptop"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive('/assets/laptop') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
          }
        >
          <Laptop size={18} className="mr-3" />
          <span>Portátiles</span>
        </NavLink>

        <NavLink
          to="/assets/mobile"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive('/assets/mobile') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
          }
        >
          <Smartphone size={18} className="mr-3" />
          <span>Móviles</span>
        </NavLink>

        <NavLink
          to="/assets/telephone"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive('/assets/telephone') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
          }
        >
          <Phone size={18} className="mr-3" />
          <span>Teléfonos</span>
        </NavLink>

        {/* Nuevo menú desplegable para Periféricos */}
        <div className="relative">
          <button
            onClick={() => setIsPeripheralsOpen(!isPeripheralsOpen)}
            className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${isPeripheralsOpen || isAnyPeripheralActive() ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
          >
            <Monitor size={18} className="mr-3" /> {/* Icono representativo para Periféricos */}
            <span>Periféricos</span>
            <ChevronDown
              size={16}
              className={`ml-auto transition-transform duration-200 ${isPeripheralsOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {/* Contenido del menú desplegable, se muestra condicionalmente */}
          {isPeripheralsOpen && (
            <div className="pl-6 pt-1 pb-1 space-y-1"> {/* Indentación para sub-elementos */}
              <NavLink
                to="/assets/monitor"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/assets/monitor') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
              >
                <Monitor size={18} className="mr-3" />
                <span>Monitores</span>
              </NavLink>
              <NavLink
                to="/assets/mouse"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/assets/mouse') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
              >
                <Mouse size={18} className="mr-3" />
                <span>Ratones</span>
              </NavLink>
              <NavLink
                to="/assets/keyboard"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/assets/keyboard') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
              >
                <Keyboard size={18} className="mr-3" />
                <span>Teclados</span>
              </NavLink>
              <NavLink
                to="/assets/cable"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/assets/cable') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
              >
                <Cable size={18} className="mr-3" />
                <span>Cables</span>
              </NavLink>
              <NavLink
                to="/assets/scanner"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/assets/scanner') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
              >
                <ScanLine size={18} className="mr-3" />
                <span>Escáneres</span>
              </NavLink>
              <NavLink
                to="/assets/printer"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/assets/printer') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }
              >
                <Printer size={18} className="mr-3" />
                <span>Impresoras</span>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink
          to="/assets/license"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive('/assets/license') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
          }
        >
          <FileText size={18} className="mr-3" />
          <span>Licencias</span>
        </NavLink>

        <div className="mt-8 border-t border-gray-700 pt-6 px-3">
          <NavLink
            to="/users"
            className={({ isActive: navIsActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive('/users') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
            }
          >
            <Users size={18} className="mr-3" />
            <span>Usuarios</span>
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive: navIsActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive('/admin') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
          }
          >
            <FolderLock size={18} className="mr-3" />
            <span>Administrador</span>
          </NavLink>

          {/* Papelera movida aquí */}
          <NavLink to="/trash" aria-label="Papelera" className={({ isActive: navIsActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors mt-2
              ${isActive('/trash') ? 'bg-gray-700 text-blue-300' : 'text-white hover:bg-gray-700 hover:text-blue-300'}`
            }>
            <Trash2 className="h-5 w-5 mr-3" />
            <span>Papelera</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
