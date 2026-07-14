export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface BranchConfig {
  id: 'services' | 'team' | 'global-portal' | 'pitter' | 'wtc-food';
  name: string;
  tagline: string;
  accentColor: string;
  glowColor: string;
  localNav: NavItem[];
  rootHref: string;
}
