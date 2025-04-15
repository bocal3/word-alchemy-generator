
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/logo";

interface SidebarProps {
  activePage: "home" | "dictionaries" | "dictionary-detail" | "create-dictionary" | "configuration";
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  return (
    <aside className="psum-sidebar">
      <div className="flex justify-between items-center mb-6">
        <Logo />
        <ThemeToggle />
      </div>
      
      <nav className="space-y-1">
        <Link 
          to="/" 
          className={activePage === "home" ? "psum-nav-item-active" : "psum-nav-item"}
        >
          <Home size={20} />
          <span>Accueil</span>
        </Link>
        <Link 
          to="/dictionnaires" 
          className={activePage === "dictionaries" ? "psum-nav-item-active" : "psum-nav-item"}
        >
          <Library size={20} />
          <span>Dictionnaires</span>
        </Link>
        <Link 
          to="/configuration" 
          className={activePage === "configuration" ? "psum-nav-item-active" : "psum-nav-item"}
        >
          <Settings size={20} />
          <span>Configuration</span>
        </Link>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60">© 2025 Psum - Générateur de texte</p>
      </div>
    </aside>
  );
};

export default Sidebar;
