import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full border border-border bg-background hover:bg-accent text-foreground transition-all duration-200 outline-none hover:scale-105 active:scale-95 w-10 h-10 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-emerald-800" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};
