import type { BranchConfig, NavItem } from '../types/navigation';

export const BRANCHES: BranchConfig[] = [
  {
    id: 'services',
    name: 'WTC Services',
    tagline: 'Assistenza IT per aziende e istituti di credito',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/services/',
    localNav: [
      { label: 'Servizi', href: '/services/', description: 'Cosa facciamo' },
      { label: 'Intervento urgente', href: '/services/assistenza-urgente/', description: 'Risposta immediata' },
      { label: 'Supporto continuativo', href: '/services/supporto-continuativo/', description: 'Il secondo team' },
      { label: 'Reti e sicurezza', href: '/services/sicurezza-informatica/', description: 'Infrastrutture enterprise' },
      { label: 'Apple Partner', href: '/services/apple/', description: "L'ecosistema Apple in azienda" },
      { label: 'Come lavoriamo', href: '/services/come-lavoriamo/', description: 'Il nostro approccio' },
      { label: 'Partner e clienti', href: '/services/partner-e-clienti/', description: 'Chi ci sceglie' },
    ],
  },
  {
    id: 'team',
    name: 'WTC Team',
    tagline: 'Relazioni commerciali attraverso lo sport',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/team/',
    localNav: [
      // La home della divisione va in elenco come per le altre BU: senza,
      // atterrando su /team/ la barra non evidenziava nulla e la pagina
      // sembrava fuori dalla propria sezione.
      { label: 'WTC Team', href: '/team/', description: 'Sport e relazioni di business' },
      { label: 'Eventi e inviti', href: '/team/eventi/', description: 'Vieni con noi agli eventi' },
      { label: 'Software e consulenza', href: '/team/software-e-consulenza/', description: 'Il metodo per la tua azienda' },
    ],
  },
  {
    id: 'global-portal',
    name: 'WTC Global Portal',
    tagline: 'Connessione diretta tra aziende e produttori',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/global-portal/',
    // Ordine per intento, non di costruzione. L'explainer viene PRIMO: è un
    // prodotto che nessuno conosce, quindi "Come funziona" non è una pagina di
    // supporto ma la pagina di vendita. Poi la scelta di pubblico (azienda o
    // produttore: intenti opposti sulla stessa sezione). Le ultime tre sono
    // FIGLIE di "Servizi partner", non sue sorelle: marcarle evita che l'elenco
    // si legga come casuale.
    localNav: [
      // La home della divisione, come per le altre quattro. È anche l'unica
      // pagina che pone la domanda "sei un'azienda o un produttore?": senza
      // questa voce, da /global-portal/aziende/ non c'era modo di tornarci
      // dal menu.
      { label: 'WTC Global Portal', href: '/global-portal/', description: 'Come funziona il portale' },
      { label: 'Come funziona', href: '/global-portal/come-funziona/', description: 'Ricerca, contatti e FAQ' },
      { label: 'Per le aziende', href: '/global-portal/aziende/', description: 'Cerca e acquista contatti' },
      { label: 'Per i produttori', href: '/global-portal/produttori/', description: 'Iscrizione gratuita' },
      { label: 'Servizi partner', href: '/global-portal/servizi-partner/', description: 'Audit, import e logistica' },
      { label: 'Primo contatto', href: '/global-portal/ricerca-fornitori/', description: 'Traduzione e mediazione', child: true },
      { label: 'Audit fabbriche', href: '/global-portal/audit-fabbriche/', description: 'Verifiche sul posto', child: true },
      { label: 'Importazione completa', href: '/global-portal/importazione-completa/', description: 'Dogana, spedizioni e consegna', child: true },
    ],
  },
  {
    id: 'pitter',
    name: 'Pitter Italy',
    tagline: 'Macchinari industriali per l\'agroalimentare',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/pitter-italy/',
    localNav: [
      { label: 'Cosa produciamo', href: '/pitter-italy/', description: 'Panoramica e prova sul campo' },
      { label: 'Macchinari', href: '/pitter-italy/macchinari/', description: 'Linee di produzione in acciaio inox' },
    ],
  },
  {
    id: 'wtc-food',
    name: 'WTC Food',
    tagline: 'Specialità agroalimentari italiane di nicchia',
    accentColor: '#F26522',
    glowColor: 'rgba(242,101,34,0.25)',
    rootHref: '/wtc-food/',
    localNav: [
      { label: 'Le visciole', href: '/wtc-food/', description: 'La linea di specialità' },
      { label: 'Eccellenze di Regedano', href: '/wtc-food/regedano/', description: 'Tartufi, zafferano e altro' },
      { label: 'Export e regali', href: '/wtc-food/export/', description: 'Mercati esteri e corporate gift' },
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

/** Marchio (logomark + nome) di ogni divisione, già bianco/arancio per fondo scuro. */
export const BRANCH_MARKS: Record<BranchConfig['id'], string> = {
  services: '/images/logos/wtc-logo-white.png',
  team: '/images/logos/wtc-team-mark.png',
  'global-portal': '/images/logos/wtc-global-portal-mark.png',
  pitter: '/images/logos/wtc-pitter-italy-mark.png',
  'wtc-food': '/images/logos/wtc-food-mark.png',
};

/**
 * Dimensioni intrinseche dei marchi. Servono a riservare la scatola dell'<img>
 * prima che il file arrivi: senza, il logo passa da 0 alla sua larghezza a
 * caricamento finito. Le proporzioni variano molto (Global Portal è 5.28:1,
 * Team 2.75:1), quindi la scatola non si può indovinare con un valore unico.
 */
export const BRANCH_MARK_DIMS: Record<BranchConfig['id'], { w: number; h: number }> = {
  services: { w: 800, h: 212 },
  team: { w: 512, h: 186 },
  'global-portal': { w: 512, h: 97 },
  pitter: { w: 512, h: 169 },
  'wtc-food': { w: 512, h: 182 },
};

/** Larghezza del marchio a una data altezza in px, arrotondata. */
export function markWidthAt(id: BranchConfig['id'], height: number): number {
  const d = BRANCH_MARK_DIMS[id] ?? BRANCH_MARK_DIMS.services;
  return Math.round((height * d.w) / d.h);
}

/**
 * Percorso → marchio, per l'overlay di transizione: appena parte la
 * navigazione si sa già dove si sta andando, quindi il marchio giusto può
 * entrare subito invece di aspettare che la pagina arrivi. La chiave "/" è
 * il fondo scala e intercetta le pagine di gruppo (home, contatti, legali),
 * dove il marchio corretto è proprio quello del gruppo.
 * Serializzata in RootLayout: resta una sola fonte di verità, questa.
 */
export const MARK_BY_PATH: Record<string, [src: string, w: number, h: number]> = {
  '/': [BRANCH_MARKS.services, BRANCH_MARK_DIMS.services.w, BRANCH_MARK_DIMS.services.h],
  ...Object.fromEntries(
    BRANCHES.map((b) => [
      b.rootHref,
      [BRANCH_MARKS[b.id], BRANCH_MARK_DIMS[b.id].w, BRANCH_MARK_DIMS[b.id].h],
    ]),
  ),
};

/** Pagina contatti della divisione; senza divisione, il contatto di gruppo. */
export function contactHrefFor(id?: BranchConfig['id']): string {
  const map: Record<BranchConfig['id'], string> = {
    services: '/services/contatti/',
    team: '/team/contatti/',
    'global-portal': '/global-portal/contatti/',
    pitter: '/pitter-italy/contatti/',
    'wtc-food': '/wtc-food/contatti/',
  };
  return id ? (map[id] ?? '/contatti/') : '/contatti/';
}
