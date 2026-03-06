import React, { useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
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
  FolderLock,
  ChevronDown,
  BookOpen,
  Building2,
} from "lucide-react";
import type { LocationValue } from "@/contexts/AuthContext";

interface SidebarProps {
  onLocationSelect: (location: LocationValue) => void;
  currentLocation: LocationValue | null;
  onAddAssetClick: () => void;
  canWriteAssets: boolean;
  canManageUsers: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onLocationSelect,
  currentLocation,
  onAddAssetClick,
  canWriteAssets,
  canManageUsers,
}) => {
  const location = useLocation();
  const [isPeripheralsOpen, setIsPeripheralsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const isAnyPeripheralActive = () => {
    return (
      isActive("/assets/monitor") ||
      isActive("/assets/mouse") ||
      isActive("/assets/keyboard") ||
      isActive("/assets/cable") ||
      isActive("/assets/scanner") ||
      isActive("/assets/printer")
    );
  };

  return (
    <div className="bg-sidebar fixed left-0 top-0 h-full w-64 text-white overflow-y-auto">
      <div className="p-5 flex flex-col items-center justify-center border-b border-gray-700">
        <Link
          to="/Dashboard"
          className="flex flex-col items-center text-center space-y-1"
        >
          <img src="/logo.jpg" alt="MCI Inventory Logo" className="h-20 w-15" />
          <span className="text-xl font-extrabold tracking-tight text-blue-400">
            INVENTORY
          </span>
        </Link>
      </div>

      {/* Nivel 0: Sede */}
      <div className="px-3 py-4 mb-4 border-b border-gray-700 bg-blue-900/40 rounded-lg mx-2" data-testid="sidebar-sede">
        <h3 className="text-blue-300 text-xs uppercase mb-3 font-semibold tracking-wider">
          Sede
        </h3>
        <button
          className={`w-full text-left py-2 px-3 rounded mb-2 transition-colors duration-200
                      ${currentLocation === "MCI_SPAIN" ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}
          onClick={() => onLocationSelect("MCI_SPAIN")}
        >
          MCI SPAIN
        </button>
        <button
          className={`w-full text-left py-2 px-3 rounded transition-colors duration-200
                      ${currentLocation === "MCI_LATAM" ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}
          onClick={() => onLocationSelect("MCI_LATAM")}
        >
          MCI LATAM
        </button>
      </div>

      {/* Menú de inventario (contextualizado a sede seleccionada) */}
      {currentLocation && (
        <>
      <div className="px-3 py-2 mb-4">
        <button
          onClick={onAddAssetClick}
          disabled={!currentLocation || !canWriteAssets}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusCircle size={16} />
          <span>Agregar Activo</span>
        </button>
      </div>

      <nav className="mt-5 px-3">
        <NavLink
          to="/Dashboard"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive("/Dashboard") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <LayoutDashboard size={18} className="mr-3" />
          <span>Panel Principal</span>
        </NavLink>

        <div className="mt-4 mb-2 text-gray-400 text-xs uppercase font-semibold pl-3">
          Activos por Tipo
        </div>

        <NavLink
          to="/assets/computer"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive("/assets/computer") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <Computer size={18} className="mr-3" />
          <span>Computadoras</span>
        </NavLink>

        <NavLink
          to="/assets/laptop"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive("/assets/laptop") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <Laptop size={18} className="mr-3" />
          <span>Portátiles</span>
        </NavLink>

        <NavLink
          to="/assets/mobile"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive("/assets/mobile") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <Smartphone size={18} className="mr-3" />
          <span>Móviles</span>
        </NavLink>

        <NavLink
          to="/assets/telephone"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive("/assets/telephone") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <Phone size={18} className="mr-3" />
          <span>Teléfonos</span>
        </NavLink>

        <div className="relative">
          <button
            onClick={() => setIsPeripheralsOpen(!isPeripheralsOpen)}
            className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${isPeripheralsOpen || isAnyPeripheralActive() ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
          >
            <Monitor size={18} className="mr-3" />
            <span>Periféricos</span>
            <ChevronDown
              size={16}
              className={`ml-auto transition-transform duration-200 ${isPeripheralsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isPeripheralsOpen && (
            <div className="pl-6 pt-1 pb-1 space-y-1">
              <NavLink
                to="/assets/monitor"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive("/assets/monitor") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
                }
              >
                <Monitor size={18} className="mr-3" />
                <span>Monitores</span>
              </NavLink>
              <NavLink
                to="/assets/mouse"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive("/assets/mouse") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
                }
              >
                <Mouse size={18} className="mr-3" />
                <span>Ratones</span>
              </NavLink>
              <NavLink
                to="/assets/keyboard"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive("/assets/keyboard") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
                }
              >
                <Keyboard size={18} className="mr-3" />
                <span>Teclados</span>
              </NavLink>
              <NavLink
                to="/assets/cable"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive("/assets/cable") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
                }
              >
                <Cable size={18} className="mr-3" />
                <span>Cables</span>
              </NavLink>
              <NavLink
                to="/assets/scanner"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive("/assets/scanner") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
                }
              >
                <ScanLine size={18} className="mr-3" />
                <span>Escáneres</span>
              </NavLink>
              <NavLink
                to="/assets/printer"
                className={({ isActive: navIsActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive("/assets/printer") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
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
            ${isActive("/assets/license") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <FileText size={18} className="mr-3" />
          <span>Licencias</span>
        </NavLink>

        <NavLink
          to="/trash"
          aria-label="Papelera"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors mt-4
            ${isActive("/trash") ? "bg-gray-700 text-blue-300" : "text-gray-300 hover:bg-gray-700 hover:text-blue-300"}`
          }
        >
          <Trash2 className="h-5 w-5 mr-3" />
          <span>Papelera</span>
        </NavLink>

        <div className="mt-4 mb-2 text-gray-400 text-xs uppercase font-semibold pl-3">
          Recursos
        </div>
        <NavLink
          to="/documentacion"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive("/documentacion") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <BookOpen size={18} className="mr-3" />
          <span>Documentación</span>
        </NavLink>
        <NavLink
          to="/b2com"
          className={({ isActive: navIsActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive("/b2com") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <Building2 size={18} className="mr-3" />
          <span>B2COM</span>
        </NavLink>
      </nav>
        </>
      )}

      {/* Nivel 0: Administrador (solo admin_spain) */}
      {canManageUsers && (
        <div className="mt-6 border-t border-gray-700 pt-6 px-3">
          <h3 className="text-gray-400 text-xs uppercase mb-3 font-semibold tracking-wider">
            Administrador
          </h3>
          <NavLink
            to="/users"
            className={({ isActive: navIsActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive("/users") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <Users size={18} className="mr-3" />
            <span>Usuarios</span>
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive: navIsActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive("/admin") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <FolderLock size={18} className="mr-3" />
            <span>Administrador</span>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
