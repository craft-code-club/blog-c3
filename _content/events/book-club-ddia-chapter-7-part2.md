---
title: "Book Club DDIA: Capítulo 7. Sharding - Parte 2"
description: "Segundo encontro sobre o Capítulo 7, 'Sharding'. Vamos fechar o capítulo com workloads com skew e hot spots, rebalanceamento automático vs. manual, roteamento de requisições (ZooKeeper, etcd, Raft e gossip) e índices secundários locais vs. globais, terminando com os principais trade-offs do capítulo e o problema das escritas entre shards."
date: "2026-11-02"
time: "20:00-21:30"
location: "Online via Zoom"
type: "online"
isLive: true
openSession: true
youtubeTitle: "Clube do Livro DDIA: Capítulo 7 - Sharding - Parte 2"
banner: "book-club-ddia.png"
registrationLink: "{{discord-link}}"
recordingLink: "https://www.youtube.com/watch?v=kbKChBNwUsw"
tags:
  - "book-club"
  - "ddia"
---

Segundo encontro sobre o Capítulo 7, "Sharding". Vamos fechar o capítulo saindo de como dividir os dados para como operar um sistema shardeado.

## O que vamos discutir

- **Workloads com skew e hot spots:** distribuição uniforme de chaves não garante carga uniforme, como no post de uma celebridade com milhões de seguidores. Como isolar uma chave quente num shard só ou dividir as escritas com prefixos aleatórios, o custo disso na leitura e as soluções automáticas dos serviços de nuvem.
- **Rebalanceamento automático vs. manual:** o automático é conveniente e permite autoscaling, mas é imprevisível, caro e, junto com detecção automática de falhas, pode causar falhas em cascata. Por que um humano no loop (ou o meio-termo de sugerir e aprovar) costuma ser mais seguro.
- **Roteamento de requisições:** falar com qualquer nó, usar uma camada de roteamento ou clientes que conhecem os shards. Quem decide a atribuição dos shards, como os roteadores ficam sabendo das mudanças e o uso de serviços de coordenação (ZooKeeper, etcd), Raft embutido, config servers do MongoDB e gossip.
- **Sharding e índices secundários:**
  - *Índices locais:* escrita em um shard só, mas leitura em todos (scatter/gather) e amplificação da latência de cauda.
  - *Índices globais:* leitura em um shard só, mas escritas em vários shards, com transações distribuídas ou atualização assíncrona.
- **Principais lições do capítulo:** shardear só quando uma máquina não dá conta, key range vs. hash, chaves quentes, uma fonte confiável para a atribuição dos shards e o problema em aberto das escritas entre shards, que leva aos próximos capítulos sobre transações.
