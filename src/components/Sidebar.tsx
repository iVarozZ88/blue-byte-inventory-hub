
import React from 'react';
import { Link } from 'react-router-dom';
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
  Globe
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-sidebar fixed left-0 top-0 h-full w-64 text-white overflow-y-auto">
      <div className="p-5 flex items-center justify-between">
        <h1 className="text-xl font-bold">Inventario Tech</h1>
        <Globe className="h-5 w-5" />
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
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <LayoutDashboard size={18} />
          <span>Panel Principal</span>
        </Link>
        
        <Link 
          to="/assets/computer" 
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Computer size={18} />
          <span>Computadoras</span>
        </Link>
        
        <Link 
          to="/assets/laptop"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Laptop size={18} />
          <span>Portátiles</span>
        </Link>
        
        <Link 
          to="/assets/monitor"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Monitor size={18} />
          <span>Monitores</span>
        </Link>
        
        <Link 
          to="/assets/mouse"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Mouse size={18} />
          <span>Ratones</span>
        </Link>
        
        <Link 
          to="/assets/keyboard"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Keyboard size={18} />
          <span>Teclados</span>
        </Link>
        
        <Link 
          to="/assets/telephone"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Phone size={18} />
          <span>Teléfonos</span>
        </Link>
        
        <Link 
          to="/assets/mobile"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Smartphone size={18} />
          <span>Móviles</span>
        </Link>
        
        <Link 
          to="/assets/scanner"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <ScanLine size={18} />
          <span>Escáneres</span>
        </Link>
        
        <Link 
          to="/assets/printer"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Printer size={18} />
          <span>Impresoras</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
