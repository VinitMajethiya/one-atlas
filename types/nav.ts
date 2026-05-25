export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavMegaMenuColumn {
  heading: string;
  items: NavDropdownItem[];
}

export interface NavItem {
  label: string;
  href?: string;
  dropdown?: NavDropdownItem[];
  megaMenu?: NavMegaMenuColumn[];
}
