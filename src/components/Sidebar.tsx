
import React from 'react';
import { NavLink } from 'react-router-dom';
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
        <h1 className="text-xl font-bold">Tech Inventory</h1>
        <Globe className="h-5 w-5" />
      </div>
      
      <div className="px-3 py-2">
        <button 
          className="w-full bg-tech-blue-light hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition-colors"
          onClick={() => window.location.href = '/assets/new'}
        >
          <PlusCircle size={16} />
          <span>Add New Asset</span>
        </button>
      </div>

      <nav className="mt-5">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/assets/computers"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Computer size={18} />
          <span>Computers</span>
        </NavLink>
        
        <NavLink 
          to="/assets/laptops"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Laptop size={18} />
          <span>Laptops</span>
        </NavLink>
        
        <NavLink 
          to="/assets/monitors"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Monitor size={18} />
          <span>Monitors</span>
        </NavLink>
        
        <NavLink 
          to="/assets/mice"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Mouse size={18} />
          <span>Mice</span>
        </NavLink>
        
        <NavLink 
          to="/assets/keyboards"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Keyboard size={18} />
          <span>Keyboards</span>
        </NavLink>
        
        <NavLink 
          to="/assets/telephones"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Phone size={18} />
          <span>Telephones</span>
        </NavLink>
        
        <NavLink 
          to="/assets/mobiles"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Smartphone size={18} />
          <span>Mobile Phones</span>
        </NavLink>
        
        <NavLink 
          to="/assets/scanners"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <ScanLine size={18} />
          <span>Scanners</span>
        </NavLink>
        
        <NavLink 
          to="/assets/printers"
          className={({ isActive }) => 
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <Printer size={18} />
          <span>Printers</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
