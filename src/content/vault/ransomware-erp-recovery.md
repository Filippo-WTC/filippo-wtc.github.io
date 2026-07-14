---
title: "Ransomware su ERP: ripristino totale senza pagare il riscatto"
sector: "Industry"
tag: "Manifatturiero"
summary: "Un'azienda manifatturiera con 280 dipendenti ha subito un attacco ransomware LockBit 3.0 che ha cifrato l'ERP SAP e i NAS di reparto. WTC ha condotto l'incident response completa, isolato la rete, ripristinato i sistemi da backup air-gapped e bloccat l'esfiltrazione dei dati."
costAvoided: "€ 450.000"
costLabel: "riscatto + fermo produzione evitati"
date: "2024-06"
duration: "18 ore"
featured: true
tags: ["ransomware", "incident-response", "erp", "manifatturiero", "cybersecurity"]
---

## Il Problema

Venerdì sera, ore 22:47. Il reparto IT di un'azienda manifatturiera nel bergamasco scopre che i server di produzione sono inaccessibili. Sui monitor appare il messaggio di LockBit 3.0: **"All your files are encrypted."**

**Perimetro colpito:**
- Server SAP ERP (produzione e logistica)
- 6 NAS di reparto (disegni tecnici, ordini, distinte base)
- 3 workstation amministrative
- Backup primario on-site (cifrato anch'esso)
- Riscatto richiesto: **€ 280.000** in Bitcoin entro 72 ore

## L'Intervento WTC

**Fase 1 — Contenimento (ore 0-2)**

Arrivo on-site entro 40 minuti dalla chiamata. Azione immediata: isolamento di tutta la rete aziendale dal perimetro internet, spegnimento controllato dei sistemi non ancora cifrati. Preservato il backup air-gapped su nastro LTO (non collegato alla rete in quel momento).

**Fase 2 — Analisi forense (ore 2-6)**

Identificato il vettore di ingresso: una credenziale RDP esposta su porta non standard, bruteforced nel corso di 3 giorni. Trovato il beacon C2 attivo su un workstation amministrativa. Esfiltrazione parziale: circa 12GB di dati inviati prima del blocco.

**Fase 3 — Recovery (ore 6-18)**

Ripristino da backup LTO air-gapped (ultima scrittura: giovedì ore 03:00). Riconfigurazione da zero dell'architettura di rete con segmentazione VLAN. Implementazione MFA su tutti gli accessi remoti.

**Fase 4 — Hardening e monitoraggio**

Deploy di EDR su tutti gli endpoint, firewall next-gen con deep packet inspection, notifica al Garante Privacy per l'esfiltrazione parziale.

## Il Risultato

- **Riscatto non pagato**: € 280.000 risparmiati
- **Lunedì mattina**: linee di produzione operative con dati allineati a giovedì
- **Dati personali**: notifica corretta al Garante evita sanzione GDPR
- **Perdita dati reale**: solo 2 giorni di ordini ricostruiti manualmente dai cartacei

## Calcolo del Costo Evitato

| Voce | Importo |
|------|---------|
| Riscatto non pagato | € 280.000 |
| Fermo produzione (weekend + settimana) evitato | € 120.000 |
| Sanzione GDPR evitata grazie a notifica corretta | € 50.000 |
| **Totale** | **€ 450.000** |
