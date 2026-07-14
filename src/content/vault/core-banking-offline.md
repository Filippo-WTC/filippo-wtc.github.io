---
title: "Core banking offline: 4 ore di fermo evitate in 47 minuti"
sector: "Banking"
tag: "Istituto Bancario"
summary: "Un istituto bancario lombardo con 12 filiali ha subito un crash del database core banking alle 08:14 di un lunedì mattina. L'intera operatività sportellistica era bloccata. WTC è intervenuta entro 11 minuti dalla chiamata con un team di 3 tecnici in parallelo."
costAvoided: "€ 280.000"
costLabel: "costo stimato del fermo evitato"
date: "2024-09"
duration: "47 minuti"
featured: true
tags: ["banking", "database", "disaster-recovery", "core-banking"]
---

## Il Problema

Lunedì 9 settembre 2024, ore 08:14. Il sistema core banking di un istituto con 12 filiali in Lombardia va offline. La causa: un'operazione di manutenzione del weekend su un nodo Oracle RAC ha corrotto il tablespace primario durante il riavvio.

**Impatto immediato:**
- 12 filiali senza accesso ai conti dei clienti
- Coda agli sportelli in crescita esponenziale
- Sistema di pagamenti interbancari bloccato
- Responsabile IT contattato in ferie, rientro impossibile prima di 3 ore

## L'Intervento WTC

Chiamata ricevuta alle 08:14. Team operativo entro le 08:25 (11 minuti).

**Struttura del team:**
- **DBA senior** (remoto): analisi e recovery del tablespace Oracle
- **Tecnico on-site** (filiale principale): accesso diretto ai sistemi, bypass VPN
- **Coordinatore**: comunicazione costante con Direzione e Contact Center

**Timeline intervento:**

| Ora | Azione |
|-----|--------|
| 08:14 | Ricezione chiamata emergency |
| 08:25 | Team operativo, accesso remoto attivo |
| 08:31 | Identificazione causa: tablespace corrotto post-maintenance |
| 08:44 | Recovery da RMAN backup notturno avviato |
| 08:58 | Tablespace ripristinato, verifica integrità transazioni |
| 09:01 | Sistema core banking online, filiali operative |

## Il Risultato

**47 minuti** dal blocco totale al ripristino completo, contro le 4+ ore stimate internamente.

Zero transazioni perse: l'ultimo backup RMAN era delle 03:00, tutte le operazioni delle mattinata sono state recuperate dal redo log.

## Calcolo del Costo Evitato

Un'ora di fermo per un istituto di questa dimensione costa mediamente **€ 70.000** tra mancate operazioni, costi di gestione clienti, penali interbancarie e rischio reputazionale.

4 ore di fermo (stima realistica senza intervento specializzato) = **€ 280.000** evitati.
