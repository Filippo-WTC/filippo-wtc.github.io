---
title: "Migrazione VPN enterprise: zero interruzione di servizio in 34 sedi"
sector: "Enterprise"
tag: "Corporate Multisite"
summary: "Una multinazionale con 34 sedi in Italia ha richiesto la migrazione completa dell'infrastruttura VPN da Cisco ASA a Fortinet NGFW, mantenendo la continuità operativa di 1.200 utenti. WTC ha progettato e eseguito la migrazione in parallelo all'operatività, con rollover notturno sito per sito."
costAvoided: "8 giorni"
costLabel: "di fermo produttivo evitato"
date: "2024-03"
duration: "21 giorni"
featured: true
tags: ["vpn", "migration", "fortinet", "enterprise", "network", "multisite"]
---

## Il Progetto

Una holding con sede a Milano e 34 filiali distribuite su tutto il territorio nazionale operava su un'infrastruttura VPN Cisco ASA con più di 8 anni di vita. End-of-life del vendor, vulnerabilità note non patchabili, performance degradate: la migrazione non era più rinviabile.

**Il vincolo principale:** zero interruzione operativa. Con 1.200 utenti in smartworking e accessi critici ai sistemi ERP centralizzati, anche 2 ore di downtime rappresentavano un rischio inaccettabile.

## La Strategia WTC

**Approccio:** Dual-stack temporaneo + rollover notturno sito per sito

Invece di migrare in blocco (approccio tradizionale = settimana di downtime), WTC ha progettato un'architettura di transizione dove ASA e Fortinet operano in parallelo per 3 settimane. Ogni sito viene migrato autonomamente di notte, testato al mattino, e rimosso dal vecchio stack.

**Fasi:**

1. **Settimana 1**: Design architettura Fortinet, configurazione hub centrale Milano, lab test su sito pilota (sede di Bergamo)
2. **Settimane 2-3**: Rollover notturno delle 34 sedi (media: 2,3 sedi/notte), monitoring 24/7 durante la transizione
3. **Settimana 4** (non necessaria): il progetto si è completato in 21 giorni invece dei 28 pianificati

**Dettaglio tecnico:**
- 34 Fortinet FortiGate configurati con template standardizzato
- SD-WAN attivata su 12 sedi con doppio ISP
- Segmentazione VLAN riconfigturata secondo framework zero-trust
- ZTNA per gli accessi ERP in sostituzione del VPN tradizionale

## Il Risultato

- **Downtime effettivo**: 0 ore per gli utenti
- **Ogni rollover notturno**: finestra 23:00-05:00, nessuna sede ha richiesto rollback
- **Performance**: latenza media ridotta del 34% grazie a SD-WAN
- **Sicurezza**: 127 vulnerabilità CVE risolte con la dismissione degli ASA

## Calcolo del Valore

L'approccio tradizionale di migrazione in blocco avrebbe richiesto almeno **8 giorni lavorativi** di fermo pianificato, con un impatto produttivo stimato di **€ 340.000** per l'azienda. La strategia dual-stack di WTC ha azzerato questo costo.
