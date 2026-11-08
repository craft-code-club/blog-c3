---
title: "Book Club DDIA: Capítulo 8. Transações - Parte 1"
description: "Vamos abrir o Capítulo 8, 'Transações': o que ACID realmente garante, operações de um objeto vs. vários objetos, erros e retries, e os níveis de isolamento fracos (read committed e snapshot isolation com MVCC), passando por lost updates, write skew e phantoms."
date: "2026-11-16"
time: "20:00-21:30"
location: "Online via Zoom"
type: "online"
isLive: true
openSession: true
youtubeTitle: "Clube do Livro DDIA: Capítulo 8 - Transações - Parte 1"
banner: "book-club-ddia.png"
registrationLink: "{{discord-link}}"
recordingLink: ""
tags:
  - "book-club"
  - "ddia"
---

Vamos abrir o Capítulo 8, "Transações", vendo o que uma transação promete de verdade e quais condições de corrida ainda escapam de cada nível de isolamento fraco.

## O que vamos discutir

- **O que é uma transação:** agrupar leituras e escritas numa unidade que faz commit ou abort, para que a aplicação possa simplesmente tentar de novo. De System R aos NoSQL que abandonaram transações e aos NewSQL (CockroachDB, TiDB, Spanner) que mostraram que elas escalam.
- **O significado de ACID:**
  - *Atomicidade:* não tem a ver com concorrência, e sim com poder abortar (o livro sugere "abortabilidade").
  - *Consistência:* invariantes da aplicação, que o banco só garante se você declarar como constraints.
  - *Isolamento e durabilidade:* serializabilidade como ideal, e por que nenhuma técnica de durabilidade (disco, replicação, backup) é perfeita sozinha.
- **Operações de um objeto vs. vários objetos:** o contador de e-mails não lidos, chaves estrangeiras, dados desnormalizados e índices secundários. Quando um retry é seguro e quando ele duplica efeitos, piora sobrecarga ou repete side effects externos.
- **Read committed:** sem dirty reads e sem dirty writes (o caso da venda do carro entre Aaliyah e Bryce), como os bancos implementam com locks de linha e versões antigas, e por que isso ainda não impede o contador de perder incrementos.
- **Snapshot isolation e MVCC:** read skew (os $100 que "somem"), backups e consultas analíticas, versões de linha com transaction IDs, regras de visibilidade, B-trees imutáveis e a confusão de nomes ("repeatable read" significa coisas diferentes em PostgreSQL, MySQL, Oracle e Db2).
- **Prevenindo lost updates:** operações atômicas, `SELECT ... FOR UPDATE`, detecção automática (que o MySQL/InnoDB não faz), compare-and-set e resolução de conflitos com réplicas.
- **Write skew e phantoms:** os médicos de plantão, reserva de salas, nomes de usuário e gasto duplo. Por que travar linhas não resolve quando a condição é a ausência de linhas, e a materialização de conflitos como último recurso.
