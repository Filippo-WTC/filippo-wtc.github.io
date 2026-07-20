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
      { label: 'Apple Partner', href: '/services/apple', description: "L'ecosistema Apple in azienda" },
      { label: 'Come lavoriamo', href: '/services/method', description: 'Il nostro approccio' },
      { label: 'Partner e clienti', href: '/services/partners', description: 'Chi ci sceglie' },
    ],
  },
  {
    id: 'team',
    name: 'WTC Team',
    tagline: 'Sponsorizzazioni, eventi e relazioni di business',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/team',
    localNav: [
      { label: 'Eventi e inviti', href: '/team/eventi', description: 'Vieni con noi agli eventi' },
      { label: 'Software & consulting', href: '/team/software-consulting', description: 'Il metodo per la tua azienda' },
    ],
  },
  {
    id: 'global-portal',
    name: 'WTC Global Portal',
    tagline: 'Connessione diretta tra aziende e produttori',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/global-portal',
    localNav: [
      { label: 'Per le aziende', href: '/global-portal/aziende', description: 'Cerca e acquista contatti' },
      { label: 'Per i produttori', href: '/global-portal/produttori', description: 'Iscrizione gratuita' },
      { label: 'Come funziona', href: '/global-portal/come-funziona', description: 'Ricerca, contatti e FAQ' },
      { label: 'Servizi partner', href: '/global-portal/servizi-partner', description: 'Audit, import e logistica' },
      { label: 'Primo contatto', href: '/global-portal/international-scouting', description: 'Traduzione e mediazione' },
      { label: 'Audit fabbriche', href: '/global-portal/factory-audit', description: 'Verifiche sul posto' },
      { label: 'Importazione completa', href: '/global-portal/import-turnkey', description: 'Dogana, spedizioni e consegna' },
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
      { label: 'Cosa produciamo', href: '/pitter-italy', description: 'Panoramica e prova sul campo' },
      { label: 'Macchinari', href: '/pitter-italy/machinery', description: 'Linee di produzione in acciaio inox' },
    ],
  },
  {
    id: 'wtc-food',
    name: 'WTC Food',
    tagline: 'Specialità agroalimentari italiane di nicchia',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/wtc-food',
    localNav: [
      { label: 'Le visciole', href: '/wtc-food', description: 'La linea di specialità' },
      { label: 'Eccellenze di Regedano', href: '/wtc-food/regedano', description: 'Tartufi, zafferano e altro' },
      { label: 'Export e regali', href: '/wtc-food/export', description: 'Mercati esteri e corporate gift' },
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
