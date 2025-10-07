import { useState } from "react";
import { LayoutDashboard, Map, FileText, Zap, Newspaper, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "map", icon: Map, label: "Mapa Regional" },
  { id: "simulator", icon: FileText, label: "Simulador" },
  { id: "news", icon: Newspaper, label: "Noticias" },
];

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleMenuClick = (id: string) => {
    setActiveView(id);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-sidebar border-sidebar-border"
        size="icon"
        variant="outline"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Desktop toggle */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex fixed top-4 left-4 z-50 bg-sidebar border-sidebar-border"
        size="icon"
        variant="outline"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed md:relative w-64 bg-sidebar border-r border-sidebar-border min-h-screen p-6 z-40"
          >
            <div className="flex items-center gap-3 mb-8 mt-12 md:mt-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--energy-electric))] to-[hsl(var(--energy-green))] flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Solaris</h1>
                <p className="text-xs text-muted-foreground">Glow</p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-[hsl(var(--energy-electric))]/20 to-[hsl(var(--energy-green))]/20 border border-[hsl(var(--energy-electric))]/30">
              <p className="text-sm text-sidebar-foreground font-semibold mb-1">
                Gestión Energética
              </p>
              <p className="text-xs text-muted-foreground">
                Santander y Norte de Santander
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
