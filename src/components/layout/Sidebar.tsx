
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Settings, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarProps {
  activePage: "home" | "dictionaries" | "dictionary-detail" | "create-dictionary" | "configuration";
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const { t } = useLanguage();

  return (
    <aside className="psum-sidebar">
      <div className="flex justify-between items-center mb-6">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
      
      <nav className="space-y-1">
        <Link 
          to="/" 
          className={activePage === "home" ? "psum-nav-item-active" : "psum-nav-item"}
        >
          <Home size={20} />
          <span>{t('nav.home')}</span>
        </Link>
        <Link 
          to="/dictionnaires" 
          className={activePage === "dictionaries" ? "psum-nav-item-active" : "psum-nav-item"}
        >
          <Library size={20} />
          <span>{t('nav.dictionaries')}</span>
        </Link>
        <Link 
          to="/creer-dictionnaire" 
          className={activePage === "create-dictionary" ? "psum-nav-item-active" : "psum-nav-item"}
        >
          <PlusCircle size={20} />
          <span>{t('nav.create')}</span>
        </Link>
        <Link 
          to="/configuration" 
          className={activePage === "configuration" ? "psum-nav-item-active" : "psum-nav-item"}
        >
          <Settings size={20} />
          <span>{t('nav.config')}</span>
        </Link>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60">{t('app.copyright')}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
