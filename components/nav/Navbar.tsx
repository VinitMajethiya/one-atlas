'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Compass, Menu, X, Sun, Moon, ChevronDown, 
  BookOpen, LifeBuoy, Bookmark, Bell, Video,
  Briefcase, Users, Sliders, BarChart2, Package, HelpCircle,
  Zap, CheckSquare, Terminal, GitMerge, FileText, Code, Layers,
  Activity, DollarSign, Heart, ShoppingBag, Cloud
} from 'lucide-react';
import { NAV_ITEMS } from '../../data/nav';
import { TEMPLATES } from '../../data/templates';
import { Badge } from '../shared/Badge';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const navRef = useRef<HTMLDivElement>(null);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamic Icon mapping for resources
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="h-5 w-5 text-primary" />;
      case 'LifeBuoy': return <LifeBuoy className="h-5 w-5 text-accent-pink" />;
      case 'Bookmark': return <Bookmark className="h-5 w-5 text-accent-orange" />;
      case 'Bell': return <Bell className="h-5 w-5 text-accent-teal" />;
      case 'Video': return <Video className="h-5 w-5 text-accent-blue" />;
      case 'Briefcase': return <Briefcase className="h-5 w-5 text-indigo-500" />;
      case 'Users': return <Users className="h-5 w-5 text-teal-500" />;
      case 'Sliders': return <Sliders className="h-5 w-5 text-amber-500" />;
      case 'BarChart2': return <BarChart2 className="h-5 w-5 text-rose-500" />;
      case 'Package': return <Package className="h-5 w-5 text-orange-500" />;
      case 'HelpCircle': return <HelpCircle className="h-5 w-5 text-sky-500" />;
      case 'Zap': return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'CheckSquare': return <CheckSquare className="h-5 w-5 text-emerald-500" />;
      case 'Terminal': return <Terminal className="h-5 w-5 text-gray-500" />;
      case 'GitMerge': return <GitMerge className="h-5 w-5 text-purple-500" />;
      case 'FileText': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'Code': return <Code className="h-5 w-5 text-indigo-500" />;
      case 'Layers': return <Layers className="h-5 w-5 text-rose-500" />;
      case 'Activity': return <Activity className="h-5 w-5 text-emerald-500" />;
      case 'DollarSign': return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'Heart': return <Heart className="h-5 w-5 text-red-500" />;
      case 'ShoppingBag': return <ShoppingBag className="h-5 w-5 text-orange-500" />;
      case 'Cloud': return <Cloud className="h-5 w-5 text-sky-500" />;
      default: return <Compass className="h-5 w-5 text-primary" />;
    }
  };

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  // Render the templates 3-column mega menu
  const renderTemplatesMegaMenu = () => {
    // Column 1: By Category
    const categories = ['CRM', 'HR', 'Admin', 'Analytics', 'Inventory', 'Support'];
    // Column 2: Featured Templates
    const featuredTemplates = TEMPLATES.slice(0, 2);
    // Column 3: Explore
    const recentTemplates = TEMPLATES.slice(2, 5);

    return (
      <div className="absolute top-full left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2 focus-trap animate-fade-in-up">
        <div className="bg-bg-card border border-border-default rounded-xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          {/* Column 1: By Category */}
          <div className="col-span-3 border-r border-border-default/50 pr-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">By Category</h3>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/templates?category=${cat.toLowerCase()}`}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-bg-subtle transition-all duration-200"
                >
                  <span className="text-sm font-semibold text-text-heading group-hover:text-primary transition-colors">{cat} Applications</span>
                  <span className="text-xs text-text-muted group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Featured Templates */}
          <div className="col-span-5 border-r border-border-default/50 px-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Featured Templates</h3>
            <div className="space-y-4">
              {featuredTemplates.map((tpl) => (
                <Link
                  key={tpl.id}
                  href={`/templates?template=${tpl.slug}`}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border-subtle hover:border-primary/30 hover:bg-bg-subtle transition-all duration-200"
                >
                  <div className="p-2.5 rounded-lg bg-bg-muted text-primary">
                    {getIcon(tpl.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-text-heading">{tpl.name}</h4>
                      <Badge label={tpl.complexity} />
                    </div>
                    <p className="text-xs text-text-muted line-clamp-2">{tpl.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Explore */}
          <div className="col-span-4 pl-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Explore</h3>
              <div className="space-y-3">
                <Link href="/templates" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-light transition-colors mb-3">
                  View all templates <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <div className="border-t border-border-subtle pt-3">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2">Recently Added</span>
                  <div className="space-y-2">
                    {recentTemplates.map((tpl) => (
                      <Link key={tpl.id} href={`/templates?template=${tpl.slug}`} className="block text-xs font-semibold text-text-heading hover:text-primary transition-colors">
                        {tpl.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render generic mega menu
  const renderMegaMenu = (menuItems: any[]) => {
    return (
      <div className="absolute top-full left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2 animate-fade-in-up">
        <div className="bg-bg-card border border-border-default rounded-xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {menuItems.map((col: any, idx: number) => (
            <div key={idx} className={idx === 0 ? 'border-r border-border-default/50 pr-8' : 'pl-4'}>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">{col.heading}</h3>
              <div className="grid grid-cols-1 gap-4">
                {col.items.map((item: any, itemIdx: number) => (
                  <a
                    key={itemIdx}
                    href={item.href}
                    className="flex items-start gap-4 p-2 rounded-lg hover:bg-bg-subtle transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-bg-muted">
                      {getIcon(item.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-heading">{item.label}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render generic dropdown menu
  const renderDropdown = (items: any[]) => {
    return (
      <div className="absolute top-full right-0 w-80 mt-2 bg-bg-card border border-border-default rounded-xl shadow-xl p-4 text-left animate-fade-in-up">
        <div className="space-y-1">
          {items.map((item: any, idx: number) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-subtle transition-all duration-200"
            >
              {item.icon && (
                <div className="p-1.5 rounded-lg bg-bg-muted mt-0.5">
                  {getIcon(item.icon)}
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-text-heading">{item.label}</h4>
                {item.description && (
                  <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={navRef} className="sticky top-0 z-50 w-full glass-nav transition-colors duration-300">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-text-heading font-bold text-lg select-none">
            <Compass className="h-6 w-6 text-primary animate-pulse-slow" />
            <span className="tracking-tight">OneAtlas</span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const hasMega = item.megaMenu || item.label === 'Templates';
              const hasDropdown = item.dropdown;

              if (hasMega || hasDropdown) {
                return (
                  <div key={item.label} className={hasDropdown ? "relative" : ""}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-bg-subtle hover:text-primary transition-all duration-200 ${
                        activeDropdown === item.label ? 'text-primary bg-bg-subtle' : 'text-text-body'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180 text-primary' : 'text-text-muted'}`} />
                    </button>

                    {activeDropdown === item.label && (
                      item.label === 'Templates' 
                        ? renderTemplatesMegaMenu()
                        : item.megaMenu 
                          ? renderMegaMenu(item.megaMenu) 
                          : item.dropdown 
                            ? renderDropdown(item.dropdown) 
                            : null
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href || '#'}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg hover:bg-bg-subtle hover:text-primary transition-all duration-200 ${
                    pathname === item.href ? 'text-primary bg-bg-subtle' : 'text-text-body'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions: theme, Login, Start Building */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-bg-subtle transition-all duration-200"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </button>

            <Link
              href="/docs"
              className="text-sm font-bold text-text-body hover:text-primary transition-colors"
            >
              Login
            </Link>
            
            <Link
              href="/templates"
              className="bg-primary hover:bg-primary-light text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Start Building
            </Link>
          </div>

          {/* Mobile Hamburguer button & Theme toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Dark Mode Toggle Mobile */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-bg-subtle transition-all duration-200"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-body hover:bg-bg-subtle transition-all"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full border-t border-border-default bg-bg-card px-4 pt-2 pb-6 space-y-3 shadow-lg animate-fade-in-up">
          {NAV_ITEMS.map((item) => {
            if (item.label === 'Templates') {
              return (
                <Link
                  key={item.label}
                  href="/templates"
                  className="block px-3 py-2 rounded-lg text-base font-bold text-text-heading hover:bg-bg-subtle hover:text-primary"
                >
                  Templates
                </Link>
              );
            }
            if (item.dropdown || item.megaMenu) {
              return (
                <div key={item.label} className="space-y-1">
                  <div className="px-3 py-1.5 text-xs font-bold text-text-muted uppercase tracking-wider">
                    {item.label}
                  </div>
                  {item.dropdown && item.dropdown.map((sub: any) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="block px-6 py-1.5 rounded-lg text-sm font-semibold text-text-body hover:bg-bg-subtle hover:text-primary"
                    >
                      {sub.label}
                    </a>
                  ))}
                  {item.megaMenu && item.megaMenu.map((col: any) => (
                    <div key={col.heading} className="pl-3">
                      <div className="px-3 py-1 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                        {col.heading}
                      </div>
                      {col.items.map((sub: any) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="block px-6 py-1.5 rounded-lg text-sm font-semibold text-text-body hover:bg-bg-subtle hover:text-primary"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href || '#'}
                className="block px-3 py-2 rounded-lg text-base font-bold text-text-heading hover:bg-bg-subtle hover:text-primary"
              >
                {item.label}
              </Link>
            );
          })}
          
          <div className="border-t border-border-subtle pt-4 space-y-2">
            <Link
              href="/docs"
              className="block w-full text-center px-4 py-2 rounded-lg text-sm font-bold text-text-body border border-border-default hover:bg-bg-subtle"
            >
              Login
            </Link>
            <Link
              href="/templates"
              className="block w-full text-center bg-primary hover:bg-primary-light text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm"
            >
              Start Building
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
