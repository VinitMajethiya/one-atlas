'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, Menu, X, ChevronDown, 
  BookOpen, LifeBuoy, Bookmark, Bell, Video,
  Briefcase, Users, Sliders, BarChart2, Package, HelpCircle,
  Zap, CheckSquare, Terminal, GitMerge, FileText, Code, Layers,
  Activity, DollarSign, Heart, ShoppingBag, Cloud
} from 'lucide-react';
import { NAV_ITEMS } from '../../data/nav';
import { TEMPLATES } from '../../data/templates';
import { Badge } from '../shared/Badge';
import { NavDropdownItem, MegaMenuColumn } from '../../types/nav';
import { templateIconClass } from '@/lib/theme';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);

  // Close menus on path change
  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Scroll listener for navbar background
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 0);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const cls = `h-5 w-5 ${templateIconClass(iconName)}`;
    switch (iconName) {
      case 'BookOpen': return <BookOpen className={cls} />;
      case 'LifeBuoy': return <LifeBuoy className={cls} />;
      case 'Bookmark': return <Bookmark className={cls} />;
      case 'Bell': return <Bell className={cls} />;
      case 'Video': return <Video className={cls} />;
      case 'Briefcase': return <Briefcase className={cls} />;
      case 'Users': return <Users className={cls} />;
      case 'Sliders': return <Sliders className={cls} />;
      case 'BarChart2': return <BarChart2 className={cls} />;
      case 'Package': return <Package className={cls} />;
      case 'HelpCircle': return <HelpCircle className={cls} />;
      case 'Zap': return <Zap className={cls} />;
      case 'CheckSquare': return <CheckSquare className={cls} />;
      case 'Terminal': return <Terminal className={cls} />;
      case 'GitMerge': return <GitMerge className={cls} />;
      case 'FileText': return <FileText className={cls} />;
      case 'Code': return <Code className={cls} />;
      case 'Layers': return <Layers className={cls} />;
      case 'Activity': return <Activity className={cls} />;
      case 'DollarSign': return <DollarSign className={cls} />;
      case 'Heart': return <Heart className={cls} />;
      case 'ShoppingBag': return <ShoppingBag className={cls} />;
      case 'Cloud': return <Cloud className={cls} />;
      default: return <Compass className={cls} />;
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
      <div className="absolute top-full left-0 right-0 mx-auto max-w-7xl px-5 lg:px-8 mt-2 focus-trap animate-fade-in-up">
        <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] shadow-standard p-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          {/* Column 1: By Category */}
          <div className="col-span-3 border-r border-border-default pr-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">By Category</h3>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/templates?category=${cat.toLowerCase()}`}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-bg-default transition-standard"
                >
                  <span className="text-[15px] font-medium text-[#4B5563] group-hover:text-[#111111] transition-colors">{cat} Applications</span>
                  <span className="text-xs text-text-muted group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Featured Templates */}
          <div className="col-span-5 border-r border-border-default px-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Featured Templates</h3>
            <div className="space-y-4">
              {featuredTemplates.map((tpl) => (
                <Link
                  key={tpl.id}
                  href={`/templates?template=${tpl.slug}`}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border-default hover:border-[#FFB380] hover:bg-bg-default transition-standard"
                >
                  <div className="p-2.5 rounded-lg bg-bg-default text-primary">
                    {getIcon(tpl.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[15px] font-medium text-text-heading">{tpl.name}</h4>
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
                <Link href="/templates" className="inline-flex items-center gap-2 text-[15px] font-bold text-[#FF6600] hover:text-[#E65C00] transition-colors mb-3">
                  View all templates <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <div className="border-t border-border-default pt-3">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2">Recently Added</span>
                  <div className="space-y-2">
                    {recentTemplates.map((tpl) => (
                      <Link key={tpl.id} href={`/templates?template=${tpl.slug}`} className="block text-xs font-semibold text-text-heading hover:text-[#FF6600] transition-colors">
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
  const renderMegaMenu = (menuItems: MegaMenuColumn[]) => {
    const isThreeCol = menuItems.length === 3;
    return (
      <div className="absolute top-full left-0 right-0 mx-auto max-w-7xl px-5 lg:px-8 mt-2 animate-fade-in-up">
        <div 
          className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] shadow-standard min-w-[640px] p-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          style={{ gridTemplateColumns: `repeat(${menuItems.length}, minmax(0, 1fr))`, gap: '2rem' }}
        >
          {menuItems.map((col: MegaMenuColumn, idx: number) => {
            const isSpotlightCol = isThreeCol && idx === 2;

            return (
              <div 
                key={idx} 
                className={idx < menuItems.length - 1 ? 'border-r border-border-default pr-8' : 'pl-4'}
              >
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">{col.heading}</h3>
                <div className="flex flex-col gap-4">
                  {col.items.map((item: NavDropdownItem, itemIdx: number) => {
                    if (isSpotlightCol) {
                      return (
                        <a
                          key={itemIdx}
                          href={item.href}
                          className="block p-4 rounded-[var(--radius-sm)] transition-standard hover:opacity-90 shadow-standard bg-bg-default"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-[15px] text-text-heading">{item.label}</span>
                            {item.badge && (
                              <span className="bg-[#FF6600] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-text-body font-medium leading-normal">{item.description}</p>
                          )}
                        </a>
                      );
                    }

                    return (
                      <a
                        key={itemIdx}
                        href={item.href}
                        className="flex items-start gap-4 p-2 rounded-lg hover:bg-bg-default transition-standard"
                      >
                        <div className="p-2 rounded-lg bg-bg-default">
                          {getIcon(item.icon)}
                        </div>
                        <div>
                          <h4 className="text-[15px] font-medium text-text-heading">{item.label}</h4>
                          {item.description && (
                            <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render generic dropdown menu
  const renderDropdown = (items: NavDropdownItem[]) => {
    return (
      <div className="absolute top-full right-0 w-80 mt-2 bg-bg-card border border-border-default rounded-[var(--radius-sm)] shadow-standard p-4 text-left animate-fade-in-up">
        <div className="space-y-1">
          {items.map((item: NavDropdownItem, idx: number) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-default transition-standard"
            >
              {item.icon && (
                <div className="p-1.5 rounded-lg bg-bg-default mt-0.5">
                  {getIcon(item.icon)}
                </div>
              )}
              <div>
                <h4 className="text-[15px] font-medium text-text-heading">{item.label}</h4>
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
    <div
      ref={navRef}
      className="sticky top-0 z-50 w-full transition-standard"
      style={scrolled ? {
        backgroundColor: 'rgba(245, 245, 238, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E5E7EB',
      } : {
        backgroundColor: 'transparent',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-text-heading font-bold text-lg select-none">
            <Compass className="h-6 w-6 text-primary animate-pulse-slow" />
            <span className="tracking-tight">OneAtlas</span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const hasMega = item.megaMenu || item.label === 'Templates';
              const hasDropdown = item.dropdown;

              if (hasMega || hasDropdown) {
                return (
                  <div key={item.label} className={hasDropdown ? "relative" : ""}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center gap-1 px-3 py-2 text-[15px] font-medium rounded-lg hover:bg-bg-default hover:text-[#111111] transition-standard ${
                        activeDropdown === item.label ? 'text-[#FF6600] bg-bg-default' : 'text-[#4B5563]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180 text-[#FF6600]' : 'text-text-muted'}`} />
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
                  className={`px-3 py-2 text-[15px] font-medium rounded-lg hover:bg-bg-default hover:text-[#111111] transition-standard ${
                    pathname === item.href ? 'text-[#FF6600] bg-bg-default' : 'text-[#4B5563]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Login, Start Building */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/docs"
              className="text-[15px] font-medium text-[#4B5563] hover:text-[#111111] transition-colors"
            >
              Login
            </Link>
            
            <Link
              href="/generate"
              className="btn-primary font-bold text-sm"
            >
              Start Building
            </Link>
          </div>

          {/* Mobile Hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-body hover:bg-bg-default transition-standard"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full border-t border-border-default bg-bg-card px-5 pt-2 pb-6 space-y-3 shadow-standard animate-fade-in-up">
          {NAV_ITEMS.map((item) => {
            if (item.label === 'Templates') {
              return (
                <Link
                  key={item.label}
                  href="/templates"
                  className="block px-3 py-2 rounded-lg text-base font-bold text-text-heading hover:bg-bg-default hover:text-[#FF6600]"
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
                  {item.dropdown && item.dropdown.map((sub: NavDropdownItem) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="block px-6 py-1.5 rounded-lg text-[15px] font-medium text-[#4B5563] hover:bg-bg-default hover:text-[#FF6600]"
                    >
                      {sub.label}
                    </a>
                  ))}
                  {item.megaMenu && item.megaMenu.map((col: MegaMenuColumn) => (
                    <div key={col.heading} className="pl-3">
                      <div className="px-3 py-1 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                        {col.heading}
                      </div>
                      {col.items.map((sub: NavDropdownItem) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="block px-6 py-1.5 rounded-lg text-[15px] font-medium text-[#4B5563] hover:bg-bg-default hover:text-[#FF6600]"
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
                className="block px-3 py-2 rounded-lg text-base font-bold text-text-heading hover:bg-bg-default hover:text-[#FF6600]"
              >
                {item.label}
              </Link>
            );
          })}
          
          <div className="border-t border-border-default pt-4 space-y-2">
            <Link
              href="/docs"
              className="block w-full text-center px-4 py-2 rounded-[var(--radius-sm)] text-[15px] font-medium text-text-body border border-border-default hover:bg-bg-default"
            >
              Login
            </Link>
            <Link
              href="/generate"
              className="block w-full text-center btn-primary font-bold text-sm px-4 py-2"
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
