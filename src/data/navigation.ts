import type { BranchConfig, NavItem } from '../types/navigation';

export const BRANCHES: BranchConfig[] = [
  {
    id: 'services',
    name: 'WTC Services',
    tagline: 'Assistenza IT per aziende e istituti di credito',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/services',
    localNav: [
      { label: 'Servizi', href: '/services', description: 'Cosa facciamo' },
      { label: 'Intervento urgente', href: '/services/emergency-it', description: 'Risposta immediata' },
      { label: 'Partner IT', href: '/services/managed-support', description: 'Il secondo team' },
      { label: 'Reti e sicurezza', href: '/services/network-security', description: 'Infrastrutture enterprise' },
      { label: 'Come lavoriamo', href: '/services/method', description: 'Il nostro approccio' },
      { label: 'Casi reali', href: '/services/vault', description: 'Interventi documentati' },
      { label: 'Partner e clienti', href: '/services/partners', description: 'Chi ci sceglie' },
    ],
  },
  {
    id: 'team',
    name: 'WTC Team',
    tagline: 'Sport, passione ed esperienze condivise',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/team',
    localNav: [
      { label: 'Partecipa', href: '/team#partecipa', description: 'Vieni al prossimo evento' },
    ],
  },
  {
    id: 'global-portal',
    name: 'WTC Global Portal',
    tagline: 'Sourcing e importazione internazionale',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/global-portal',
    localNav: [
      { label: 'Scouting internazionale', href: '/global-portal/international-scouting', description: 'Fiere e fornitori mondiali' },
      { label: 'Audit fabbriche', href: '/global-portal/factory-audit', description: 'Verifica delle fabbriche' },
      { label: 'Importazione completa', href: '/global-portal/import-turnkey', description: 'Dalla fabbrica al magazzino' },
    ],
  },
  {
    id: 'pitter',
    name: 'Pitter Italy',
    tagline: 'Macchinari industriali per l\'agroalimentare',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/pitter-italy',
    localNav: [
      { label: 'Macchinari', href: '/pitter-italy/machinery', description: 'Linee di produzione in acciaio inox' },
      { label: 'Cosa produciamo', href: '/pitter-italy#prova', description: 'Testato sul campo' },
    ],
  },
  {
    id: 'wtc-food',
    name: 'WTC Food',
    tagline: 'Produzione agroalimentare diretta',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/wtc-food',
    localNav: [
      { label: 'Le nostre colture', href: '/wtc-food', description: 'Visciole, Ciliegie, Susine, Nocciole' },
    ],
  },
];

export const GLOBAL_NAV_ITEMS: NavItem[] = BRANCHES.map((b) => ({
  label: b.name,
  href: b.rootHref,
  description: b.tagline,
}));

export function getBranch(id: BranchConfig['id']): BranchConfig {
  return BRANCHES.find((b) => b.id === id)!;
}
