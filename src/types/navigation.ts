export interface NavItem {
  label: string;
  href: string;
  description?: string;
  /**
   * Voce figlia di quella che la precede. Su Global Portal tre servizi sono
   * dettagli di "Servizi partner": presentarli come fratelli faceva leggere
   * l'elenco come casuale. Chi la consuma la rientra invece di riordinarla.
   */
  child?: boolean;
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
