---
title: "Book Club DDIA: Capítulo 8. Transações - Parte 2"
description: "Segundo encontro sobre o Capítulo 8, 'Transações'. Vamos ver as três formas de obter serializabilidade (execução serial, two-phase locking e serializable snapshot isolation) e depois transações distribuídas: two-phase commit, falha do coordenador, XA, transações internas dos bancos NewSQL e exactly-once com idempotência."
date: "2026-11-23"
time: "20:00-21:30"
location: "Online via Zoom"
type: "online"
isLive: true
openSession: true
youtubeTitle: "Clube do Livro DDIA: Capítulo 8 - Transações - Parte 2"
banner: "book-club-ddia.png"
registrationLink: "{{discord-link}}"
recordingLink: ""
tags:
  - "book-club"
  - "ddia"
---

Segundo encontro sobre o Capítulo 8, "Transações". Depois do catálogo de anomalias, vamos às soluções: como garantir serializabilidade e como manter o "tudo ou nada" quando a transação envolve vários nós.

## O que vamos discutir

- **Execução serial de verdade:** uma transação por vez numa única thread, viável graças à RAM barata e a transações OLTP curtas. Stored procedures (prós, contras e o uso pelo VoltDB para replicação determinística) e o limite de um núcleo de CPU, contornado com sharding.
- **Two-phase locking (2PL):** leitores e escritores se bloqueando, locks compartilhados e exclusivos, deadlocks e latência instável. Predicate locks e index-range locks para impedir phantoms. E por que 2PL não tem nada a ver com 2PC.
- **Serializable snapshot isolation (SSI):** controle de concorrência pessimista vs. otimista, decisões baseadas numa premissa desatualizada e as duas formas de detectá-las (leituras MVCC obsoletas e escritas que afetam leituras anteriores).
- **Transações distribuídas e two-phase commit:**
  - *O problema do commit atômico:* por que mandar commit para todos os nós não basta.
  - *Um sistema de promessas:* prepare, voto "sim", commit point e retries até dar certo.
  - *Falha do coordenador:* transações "in doubt", locks presos e por que o three-phase commit não resolve na prática.
- **Transações entre sistemas diferentes:** XA, locks presos enquanto a transação está em dúvida, heuristic decisions e os problemas do XA, comparados às transações distribuídas internas de bancos como CockroachDB, Spanner e FoundationDB.
- **Exactly-once revisitado e resumo do capítulo:** como uma tabela de IDs de mensagens processadas dá idempotência sem transação distribuída, e a tabela final de anomalias por nível de isolamento.
