
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FileText, Plus, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/', label: 'All Content', icon: Home },
  { path: '/create', label: 'New Content', icon: Plus },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Sidebar for desktop (persistent) and mobile (overlay)
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden h-screen w-64 flex-col border-r bg-background md:flex">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-y-0 left-0 z-50 h-full w-3/4 max-w-xs border-r bg-background md:hidden"
            >
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="font-semibold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SidebarContent onItemClick={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <div className="flex flex-1 flex-col gap-2 p-4">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onItemClick}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

// Bottom navigation for mobile
export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
