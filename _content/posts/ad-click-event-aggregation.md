---
title: 'Desafios no Design de um Agregador de Eventos de Clicks em Ads'
date: '2025-01-21'
description: 'Artigo baseado em nossa discussão do Cápitulo 22 do Livro System Design Interview. Desenhando um sistema de Ad Click Event Aggregation'
topics: ['system-design', 'clube-do-livro']
---

> Este artigo foi escrito baseado em nossas discussões no último encontro do clube do livro da comunidade, que ocorreu dia 13 de Janeiro de 2025.
> Cápitulo 22 do Livro System Design Interview. Desenhando um sistema de Agregação de eventos de clicks em ads

Assista a gravação do encontro do clube do livro no cana da comunidade: \
[https://youtu.be/L4wUa4dXHDk](https://youtu.be/L4wUa4dXHDk)


O design de sistemas é uma área fascinante e desafiadora que envolve uma série de decisões críticas, capazes de influenciar a performance, a escalabilidade e a eficácia das aplicações. Baseado em discussões profundas, análises de casos práticos e reflexões sobre trade-offs, este artigo reúne os principais pontos discutidos sobre o tema, abordando desde a gestão de dados em larga escala até estratégias para balancear exatidão e performance.

## Armazenamento e Gestão de Dados em Larga Escala

### Dados Brutos vs. Dados Agregados

Uma das principais decisões no design de sistemas é a escolha entre armazenar dados brutos ou apenas dados agregados. Essa decisão afeta não apenas o custo de armazenamento, mas também a capacidade de realizar auditorias detalhadas ou análises retroativas.

- **Armazenamento de Dados Brutos:** Essencial para auditorias e Machine Learning, pois fornece detalhes completos. No entanto, requer maior espaço e recursos de armazenamento.
- **Dados Agregados:** Mais eficientes para consultas e análises regulares, mas limitam a capacidade de investigar ou auditar dados no nível mais granular.

Uma estratégia amplamente discutida foi o uso de **tiered storage**, onde dados de alta resolução são mantidos em sistemas de alto desempenho inicialmente e, após um período, transferidos para armazenamentos mais econômicos.

### Resolução e Retenção de Dados

Outra abordagem prática é ajustar a resolução dos dados com base no tempo. Por exemplo, manter dados em alta resolução para o mês atual e armazenar apenas agregados diários ou mensais para períodos mais antigos. Essa técnica reduz custos sem sacrificar a utilidade dos dados.

## Escolha de Bancos de Dados: Cassandra vs. Bancos de Séries Temporais

### Cassandra

O Cassandra foi frequentemente citado como a escolha ideal para aplicações que demandam **escalabilidade horizontal** e um **alto throughput de escrita**, como sistemas de métricas de cliques ou logs distribuídos. Contudo, essa escolha apresenta desafios:

- Requer modelagem de dados bem definida para otimizar consultas específicas.
- Pode ser menos eficiente para operações de leitura intensiva ou consultas ad-hoc.

### Bancos de Dados de Séries Temporais

Soluções como **InfluxDB** ou **TimescaleDB** foram apontadas como mais adequadas para operações baseadas em agregações temporais, especialmente em sistemas de monitoramento e métricas. No entanto, enfrentam limitações de escalabilidade horizontal comparadas ao Cassandra.

A escolha entre essas opções depende fortemente do padrão de acesso aos dados e dos requisitos específicos de cada aplicação.

## Consistência e Confiabilidade em Sistemas de Grande Escala

### Idempotência e "Exactly-Once Delivery"

A confiabilidade em sistemas distribuídos é fundamental, especialmente em cenários financeiros. Duas estratégias foram destacadas:

- **Idempotência:** Garante que operações repetidas produzam o mesmo resultado, prevenindo duplicação de dados.
- **Exactly-Once Delivery:** Embora desejável, é difícil de alcançar sem custos significativos. Ferramentas como Kafka Streams oferecem suporte parcial, mas com restrições de performance.

Essas abordagens ajudam a mitigar problemas comuns, como duplicidade de eventos ou inconsistências no processamento.

### Transações Atômicas

Em sistemas financeiros, a precisão é indispensável. Uma prática recomendada é o uso de transações atômicas em ferramentas como **Kafka**, garantindo que eventos sejam processados exatamente uma vez, preservando a consistência e evitando erros que possam levar a problemas graves.

## Exatidão vs. Performance: Encontrando o Equilíbrio

Em sistemas de grande escala, há sempre uma tensão entre a busca por exatidão e a necessidade de otimizar a performance:

- **Sistemas Críticos (Alta Exatidão):** Transações financeiras ou auditorias exigem precisão absoluta, mesmo com aumento nos custos operacionais.
- **Sistemas de Observabilidade (Alta Performance):** Aplicações como métricas de sistema podem sacrificar um pouco de precisão em prol de maior eficiência e menor custo.

Estratégias como o uso de **filas de mensagens** e **confirmações de processamento** são alternativas comuns para equilibrar esses dois extremos.

## Desafios no Reprocessamento e Análise de Dados

Reprocessar dados em larga escala, seja por necessidade de correção ou mudanças no sistema, é um desafio técnico significativo. Isso requer:

- Planejamento para preservar a ordem temporal dos eventos.
- Capacidade de lidar com grandes volumes de dados sem comprometer a integridade ou consistência.

## Conclusão

O design de sistemas é tanto uma ciência quanto uma arte. Cada decisão, desde a escolha do banco de dados até o gerenciamento de dados brutos e agregados, envolve trade-offs que impactam profundamente o comportamento e a eficiência do sistema. Discussões como as abordadas neste artigo ajudam a iluminar os desafios e as estratégias disponíveis, permitindo que engenheiros tomem decisões mais informadas e adequadas às necessidades específicas de seus projetos.

A troca de ideias e experiências é essencial para continuar evoluindo na criação de sistemas robustos e escaláveis. O futuro do design de sistemas depende dessa colaboração contínua, explorando novas tecnologias e abordagens para atender às demandas crescentes de complexidade e escala.
