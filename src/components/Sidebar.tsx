
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Computer, 
  Laptop, 
  Monitor, 
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
  FolderLock
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="bg-sidebar fixed left-0 top-0 h-full w-64 text-white overflow-y-auto">
      <div className="p-5 flex items-center justify-between">
        <h1 className="text-xl font-bold">Inventario Tech</h1>
        <Link to="/trash">
          <Trash2 
            className={`h-5 w-5 ${isActive('/trash') ? 'text-blue-300' : 'text-white hover:text-blue-300'} transition-colors`} 
            aria-label="Papelera"
          />
        </Link>
      </div>
      
      <div className="px-3 py-2">
        <Link 
          to="/assets/new" 
          className="w-full bg-tech-blue-light hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition-colors"
        >
          <PlusCircle size={16} />
          <span>Agregar Activo</span>
        </Link>
      </div>

      <nav className="mt-5">
        <Link 
          to="/" 
          className={isActive('/') ? "sidebar-item active" : "sidebar-item"}
        >
          <LayoutDashboard size={18} />
          <span>Panel Principal</span>
        </Link>
        
        <Link 
          to="/assets/computer" 
          className={isActive('/assets/computer') ? "sidebar-item active" : "sidebar-item"}
        >
          <Computer size={18} />
          <span>Computadoras</span>
        </Link>
        
        <Link 
          to="/assets/laptop"
          className={isActive('/assets/laptop') ? "sidebar-item active" : "sidebar-item"}
        >
          <Laptop size={18} />
          <span>Portátiles</span>
        </Link>
        
        <Link 
          to="/assets/monitor"
          className={isActive('/assets/monitor') ? "sidebar-item active" : "sidebar-item"}
        >
          <Monitor size={18} />
          <span>Monitores</span>
        </Link>
        
        <Link 
          to="/assets/mouse"
          className={isActive('/assets/mouse') ? "sidebar-item active" : "sidebar-item"}
        >
          <Mouse size={18} />
          <span>Ratones</span>
        </Link>
        
        <Link 
          to="/assets/keyboard"
          className={isActive('/assets/keyboard') ? "sidebar-item active" : "sidebar-item"}
        >
          <Keyboard size={18} />
          <span>Teclados</span>
        </Link>
        
        <Link 
          to="/assets/telephone"
          className={isActive('/assets/telephone') ? "sidebar-item active" : "sidebar-item"}
        >
          <Phone size={18} />
          <span>Teléfonos</span>
        </Link>
        
        <Link 
          to="/assets/mobile"
          className={isActive('/assets/mobile') ? "sidebar-item active" : "sidebar-item"}
        >
          <Smartphone size={18} />
          <span>Móviles</span>
        </Link>
        
        <Link 
          to="/assets/scanner"
          className={isActive('/assets/scanner') ? "sidebar-item active" : "sidebar-item"}
        >
          <ScanLine size={18} />
          <span>Escáneres</span>
        </Link>
        
        <Link 
          to="/assets/printer"
          className={isActive('/assets/printer') ? "sidebar-item active" : "sidebar-item"}
        >
          <Printer size={18} />
          <span>Impresoras</span>
        </Link>

        <Link 
          to="/assets/cable"
          className={isActive('/assets/cable') ? "sidebar-item active" : "sidebar-item"}
        >
          <Cable size={18} />
          <span>Cables</span>
        </Link>
        
        <Link 
          to="/assets/license"
          className={isActive('/assets/license') ? "sidebar-item active" : "sidebar-item"}
        >
          <FileText size={18} />
          <span>Licencias</span>
        </Link>
        
        <div className="mt-8 border-t border-gray-700 pt-6">
          <Link 
            to="/users"
            className={isActive('/users') ? "sidebar-item active" : "sidebar-item"}
          >
            <Users size={18} />
            <span>Usuarios</span>
          </Link>
          
          <Link 
            to="/admin"
            className={isActive('/admin') ? "sidebar-item active" : "sidebar-item"}
          >
            <FolderLock size={18} />
            <span>Administrador</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
