---
title: "Deep Dive - Relógios Lógicos: de Lamport a Bloom Clocks"
description: "Em sistemas distribuídos não existe um relógio global confiável. Neste deep dive, o Edward Ribeiro vai de Lamport Clocks a Bloom Clocks, passando por Vector Clocks, Hybrid Logical Clocks, Version Vectors, Dotted Version Vectors e Matrix Clocks, com exemplos do mundo real e os trade-offs de cada abordagem. É o primeiro de dois encontros. O segundo será sobre CRDTs e Operational Transformation."
date: "2026-10-19"
time: "20:00-21:30"
location: "Online via Zoom"
type: "online"
isLive: true
openSession: true
banner: "deep-dive-relogios-logicos-de-lamport-a-bloom-clocks.png"
registrationLink: "{{discord-link}}"
recordingLink: "https://www.youtube.com/watch?v=K5avXPf_hO8"
speakers:
  - name: "Edward Ribeiro"
    link: "https://www.linkedin.com/in/edward-ribeiro-6530b82/"
tags:
  - "distributed-systems"
---

Em sistemas distribuídos não existe um relógio global confiável. Como então saber a ordem em que as coisas aconteceram, detectar conflitos e concorrência, ou decidir qual versão de um dado é a mais recente?

Neste deep dive, vamos navegar pelo mundo dos relógios lógicos, partindo dos fundamentos e chegando até as estruturas que rodam dentro de bancos de dados distribuídos reais:

- **Lamport Clocks**: a ideia que começou tudo, e por que ela não é suficiente
- **Vector Clocks**: como detectar que duas coisas aconteceram “ao mesmo tempo”
- **Hybrid Logical Clocks**: o compromisso que bancos distribuídos modernos adotaram
- **Version Vectors e Dotted Version Vectors**: o que realmente roda dentro de um KV store leaderless
- **Matrix Clocks e Bloom Clocks**: o que acontece quando você tem milhares de nós e o vetor não cabe mais

Ao longo do caminho, vamos falar sobre exemplos de uso em sistemas do mundo real e os trade-offs entre cada abordagem.

Esse é o primeiro de dois encontros sobre o tema. No segundo, aprofundamos em **CRDTs e OT/Operational Transformation**.

O link da sala do Zoom será compartilhado no dia do evento na [comunidade]({{discord-link}}).

**Sobre o palestrante**

**Edward Ribeiro** é Senior Software Engineer, com passagem por Amazon e DataStax e experiência com grandes projetos open source. Hoje constrói sistemas em escala no Interlegis (Senado Federal).

LinkedIn: [linkedin.com/in/edward-ribeiro-6530b82](https://www.linkedin.com/in/edward-ribeiro-6530b82/)
