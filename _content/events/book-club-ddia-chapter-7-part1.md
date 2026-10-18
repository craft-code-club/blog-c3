---
title: "Book Club DDIA: Capítulo 7. Sharding - Parte 1"
description: "Vamos abrir o Capítulo 7, 'Sharding': a diferença entre sharding e replicação, quando vale (ou não) dividir os dados entre vários nós, shards por tenant em sistemas multitenant e as formas de dividir dados chave-valor: key range, hash mod N (e por que é ruim), número fixo de shards, hash range e consistent hashing."
date: "2026-10-26"
time: "20:00-21:30"
location: "Online via Zoom"
type: "online"
isLive: true
openSession: true
youtubeTitle: "Clube do Livro DDIA: Capítulo 7 - Sharding - Parte 1"
banner: "book-club-ddia.png"
registrationLink: "{{discord-link}}"
recordingLink: "https://www.youtube.com/watch?v=-Psv-g4nneQ"
tags:
  - "book-club"
  - "ddia"
---

Vamos abrir o Capítulo 7, "Sharding", vendo como dividir os dados entre vários nós e como espalhar a carga de forma uniforme.

## O que vamos discutir

- **Sharding vs. replicação:** replicação copia os mesmos dados em vários nós; sharding divide os dados em pedaços. Na prática os dois andam juntos, e cada sistema dá um nome diferente ao shard (partition, range, region, vnode, tablet).
- **Prós e contras:** o motivo principal é escalar volume de dados e throughput de escrita. O custo é alto: escolher a chave de partição, consultas que precisam ir a todos os shards, joins, índices secundários e transações entre shards.
- **Sharding para multitenancy:** um shard por tenant traz isolamento de recursos, permissões e falhas, backup por cliente e residência de dados, mas também desafios com tenants grandes demais ou pequenos demais.
- **Sharding de dados chave-valor:**
  - *Key range sharding:* range scans eficientes, mas risco de hot spots em chaves próximas (como timestamps); split e merge de shards.
  - *Hash sharding:* por que `hash mod N` é ruim, número fixo de shards, hash range sharding e a variante do Cassandra/ScyllaDB.
  - *Consistent hashing:* mover o mínimo de chaves quando o número de shards muda.

Na segunda parte, seguimos com hot spots, rebalanceamento, roteamento de requisições e índices secundários.
