---
title: 'Os requisitos que o negócio não pede: o Capítulo 2 de DDIA (Parte 1)'
date: '2026-06-29'
description: 'Notas do segundo encontro do Clube do Livro da Craft Code Club sobre Designing Data-Intensive Applications (2ª edição): requisitos não funcionais, o estudo de caso da rede social, fan-out, views materializadas, performance (response time vs. throughput), percentis, SLO/SLA e o começo da conversa sobre confiabilidade.'
topics: ['System Design', 'Clube do Livro']
keywords: ['DDIA', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Requisitos não funcionais', 'Performance', 'Confiabilidade', 'Response Time', 'Throughput', 'Latência', 'Percentis', 'SLO', 'SLA', 'SLI', 'Fan-out', 'View Materializada', 'Cache', 'Circuit Breaker', 'Backoff Exponencial', 'Load Shedding', 'Rate Limiting', 'Retry Storm', 'Fault Tolerance', 'SPOF', 'Chaos Engineering']
authors: []
---

*Este post é um resumo da discussão do segundo encontro do Clube do Livro da [Craft Code Club](https://craftcodeclub.io/book-club/designing-data-intensive-applications) sobre o Capítulo 2 de Designing Data-Intensive Applications. O capítulo é grande e denso, então a turma decidiu quebrá-lo em dois encontros — este é o apanhado da **Parte 1**.*

Depois de abrir a série com o Capítulo 1 e sua frase-manifesto ([*"não existem soluções, só trade-offs"*](https://craftcodeclub.io/posts/ddia-trade-offs-arquitetura-de-sistemas)), o **Clube do Livro** da comunidade [Craft Code Club](https://craftcodeclub.io/book-club/designing-data-intensive-applications) chegou ao Capítulo 2 de **Designing Data-Intensive Applications** (DDIA), de Martin Kleppmann: *Defining Nonfunctional Requirements*.

A dinâmica continua a mesma: a cada quinze dias, um capítulo. Sem aula, sem palestra, sem ninguém "dono da razão". Só gente que vive esses problemas no dia a dia trocando experiências — concordando, discordando e trazendo cicatrizes de produção. A turma voltou ao [quadro no Excalidraw](https://link.excalidraw.com/l/ADMgGFVWISx/1ncjQemuKVK), foi descendo tópico por tópico, e o capítulo rendeu tanto que parou na metade: cobrimos **requisitos não funcionais**, o **estudo de caso da rede social**, **performance** e o começo de **confiabilidade**. O resto (manutenibilidade, escalabilidade e o lado humano) fica para a Parte 2.

Se você curte sistemas de alta escala, vem que tem bastante mapa mental para levar daqui.

---

## O requisito que o negócio não te conta

O capítulo abre com uma provocação que a turma abraçou logo de cara: antes de entrar em requisitos não funcionais, o que **são** requisitos funcionais e não funcionais?

A definição que nasceu da conversa foi bem direta:

- **Requisito funcional** é aquilo que **vem do negócio**. É o que está (ou deveria estar) no PRD, o que resolve um problema do cliente, o que vende. Se você não entrega, não entregou a funcionalidade.
- **Requisito não funcional** é aquilo que o negócio **não te pede**, mas que você sabe que precisa existir para a feature ter sucesso. Ninguém abre um card pedindo "que aguente Black Friday" — mas se não aguentar, a funcionalidade fracassa do mesmo jeito.

E aqui apareceu um padrão que muita gente reconheceu na própria carreira: **no começo, a gente só enxerga o funcional.** O requisito não funcional é aquele "efeito colateral" que só acontece depois que você implementa. Conforme você amadurece como engenheiro, o escopo do seu olhar vai abrindo: primeiro você só quer resolver o problema no código; depois começa a pensar no impacto daquele código na escalabilidade, na experiência do usuário, na capacidade de o sistema **evoluir**.

> Quando a gente deixa de se preocupar com a capacidade de evolução do software, a gente empurra o problema para o eu do futuro — e ele sempre cobra a conta.

O perigo mora no "vamos deixar isso para depois". Naquele momento de "só entregar feature", adiar arquitetura, organização de código e escalabilidade parece barato. Não é. Em algum momento isso puxa o seu pé, e o software que deveria resolver o problema passa a **não** resolver mais.

### O truque: amarrar o não funcional ao negócio

A parte difícil de requisito não funcional não é técnica — é **vender**. Como justificar que o time vai gastar capacidade em algo que o negócio nem pediu?

O caminho que funcionou para a turma é fazer um **gancho com o negócio**. Se hoje é um MVP com poucos usuários, ótimo — mas qual é a visão de produto no longo prazo? Se isso aqui der certo, vira carro-chefe? Vira diferencial competitivo? A partir daí você amarra a sua necessidade técnica (escalabilidade, tolerância a falhas numa dependência externa) a algo que o negócio **realmente entende como importante**. Quando a necessidade técnica se conecta com o valor de negócio, a conversa flui.

E há munição concreta para essa conversa: a relação entre **performance e dinheiro**. O livro cita [estudos clássicos](https://wpostats.com/) que cruzam requisito não funcional com ROI e conversão — do tipo "cada 100 ms a mais de lentidão derruba ~1% das compras no checkout". Quando você traduz milissegundos em receita perdida, gestão e produto passam a ouvir.

Alguns fios que apareceram na discussão:

- **Nem todo usuário pesa igual.** Existe aquele cliente que compra com frequência e gasta muito na plataforma. Ele tem muitos dados, mas são dados "quentes": a jornada dele precisa ser rápida e fluida, porque é ele que sustenta o MRR. Vale priorizar a experiência dessas estrelas.
- **Picos sazonais são o teste real.** Varejo em Black Friday, e-commerce na época de Copa do Mundo — são momentos em que "não pensei em performance" vira aplicação caindo e venda perdida. É o oposto de otimização prematura: é conhecer o seu negócio.
- **O MVP traz o usuário; a experiência o mantém.** A aplicação inicial atrai; o que segura o usuário dentro da plataforma (o *lifetime* dele) é a experiência — e experiência, aqui, é justamente o conjunto de requisitos não funcionais que a gente vai lapidando depois que o sistema já está no ar.

> Requisitos não funcionais são tão importantes quanto os funcionais — só que ficam escondidos. Não são visíveis para produto, e muitas vezes nem para a gente. Leva anos de cadeira para enxergá-los bem e fazer os julgamentos certos.

---

## Estudo de caso: a rede social

Para dar concretude a tudo isso, o capítulo abre com um estudo de caso de uma rede social parecida com o X/Twitter. É o típico exemplo "gigante, meio fora da nossa realidade" (com um cheiro forte de *System Design Interview*) — mas é ótimo para exercitar trade-offs.

Os números que ancoram o exemplo:

- Na casa de **500 milhões de posts por dia** — uma média de ~5.800 posts por segundo.
- Picos que passam de **150 mil posts por segundo**.
- Cada usuário **segue ~200 pessoas** e **é seguido por ~200**.

O primeiro rascunho é o óbvio: três tabelas num banco relacional (usuários, posts, quem-segue-quem) e, como o negócio quer algo "ao vivo", um **polling** a cada poucos segundos batendo na API para montar a timeline. Funciona no papel — e explode na escala. Fazendo a [conta de padeiro](https://gist.github.com/jboner/2841832), uma abordagem ingênua chega à casa de **centenas de milhões de lookups por segundo** (algo como 2 milhões de leituras de timeline por segundo, cada uma cruzando ~200 seguidos). Insustentável.

### A métrica-chave: a proporção de leitura

Aqui entrou um conceito que a primeira edição do livro nomeava explicitamente como **métrica-chave**: entre as várias métricas do sistema, algumas puxam a decisão arquitetural inteira. Neste caso, a chave é a **read ratio** — a proporção entre leituras e escritas.

E ela é brutalmente desequilibrada: **lê-se muito mais do que se escreve.** Isso muda tudo. Se a leitura é o gargalo e a escrita é rara, faz todo sentido **pagar mais caro na escrita** para deixar a leitura barata. É o *capacity planning* guiando a arquitetura.

### View materializada: pré-computar a timeline

A saída é a [**view materializada**](https://en.wikipedia.org/wiki/Materialized_view): em vez de montar a timeline na hora da leitura, você **pré-computa** a timeline de cada usuário. Cada vez que alguém acessa, a visualização dele já está pronta.

Um cuidado importante que a turma fez questão de frisar: aqui **"view materializada" é um conceito guarda-chuva**, não necessariamente aquela `MATERIALIZED VIEW` do banco relacional. É a ideia de **pré-processar e guardar pronto para leitura**. Onde você materializa — no próprio banco, num key-value em memória, onde for — depende dos seus outros trade-offs (escrita, disco, latência). Isso conecta direto com [um conceito do Capítulo 1](https://craftcodeclub.io/posts/ddia-trade-offs-arquitetura-de-sistemas): **quem define a natureza do dado é a aplicação, não a ferramenta.** Você tem liberdade para escolher o instrumento certo para o problema.

O trade-off fica explícito:

- **Ganho:** economiza um oceano de operações de leitura. A timeline chega pronta.
- **Custo:** cada novo post obriga a **recomputar** a timeline de cada seguidor. Você penaliza a escrita.

E é aí que mora a beleza da análise: **será que penalizar a escrita é mesmo um problema?** Neste domínio, não muito. Escrita mais lenta é aceitável, e o fato de um seguidor não ver o post no mesmo milissegundo (uma [**consistência eventual**](https://en.wikipedia.org/wiki/Eventual_consistency)) também é aceitável para uma timeline. Ou seja: o "trade-off" de penalizar a escrita, neste caso, quase não dói. Como diz o livro, tudo é trade-off — a graça é perceber **qual lado você pode pagar sem sentir.**

### O problema da celebridade (e a solução híbrida)

A view materializada tem um calcanhar de Aquiles: e quando alguém tem **10 milhões de seguidores**? Um único post viraria 10 milhões de escritas em 10 milhões de timelines. O barato saiu caro.

Mas a turma foi certeira: **isso é exceção, não regra.** A esmagadora maioria dos usuários não tem milhões de seguidores. A estratégia é trabalhar onde se ganha mais resultado — pré-computar para o caso comum — e tratar a celebridade **à parte**, com uma abordagem **híbrida**: o post da celebridade não é distribuído por escrita; ele é buscado sob demanda (fan-out on read) e mesclado na hora. Quase todas as soluções boas aqui acabam híbridas.

Ainda dá para ir além do livro com um insight de **regionalização**: uma celebridade brasileira não precisa escalar para o mundo inteiro ver. Quem segue a Anita está aqui — não tem um chinês do outro lado do mundo esperando aquela timeline. Você distribui o esforço por região e, olhando esse mesmo conceito no agregado, escala a nível mundo sem desperdiçar recurso guardado à toa.

### View materializada é a mesma coisa que cache?

Pergunta ótima que rendeu discussão: se a view materializada guarda algo pronto, qual a diferença para um **cache**?

O consenso: **os dois são conceitos, não ferramentas**, e têm interseção — mas não são a mesma coisa.

- A **view materializada** é sobre **pré-computar** uma operação cara e deixá-la pronta para leitura. Você paga o custo *antes*, de propósito.
- O **cache** normalmente atua **no momento da leitura**: o dado é processado, guardado, e a próxima leitura bate nele. É expor barato aquilo que é muito acessado.

E eles se **complementam**: você pré-computa a timeline (view materializada) e ainda coloca um cache na frente para não onerar o banco. Em camadas, fica mais rápido ainda. Aliás, "cache" também é palavra guarda-chuva — falamos de pelo menos quatro nesse encontro: cache de banco, cache da aplicação, [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) e browser. E há duas leituras do próprio termo: o cache "cru" (pré-computar uma operação cara e salvar) e o cache "implementado", com todas as suas estratégias (TTL, ordem de escrita, invalidação, *eviction*).

Um detalhe fino sobre por que, **neste caso**, a view materializada bate o cache puro: o cache pode ser pego de surpresa. Imagine 8h da manhã, todo mundo acordando e pegando o celular ao mesmo tempo — 20 milhões de requisições num piscar de olhos batendo num cache frio. Com a timeline já materializada, você não depende de "esquentar" nada na hora do pico. E o cache ainda te obrigaria a lidar com a dança da invalidação. Como sempre: cache tem ônus e bônus; comece pelo simples e vá complicando só quando precisar.

### Fan-out: um input que se espalha

Toda essa distribuição de posts tem um nome: **fan-out**. De modo geral, é um input que se **fragmenta e se distribui para vários pontos**. A Anita posta uma vez, e aquilo precisa chegar em milhões de timelines.

No domínio de redes sociais, as duas estratégias já apareceram implicitamente:

- **Fan-out on write:** na hora em que o post é escrito, você já distribui (materializa) nas timelines de todo mundo.
- **Fan-out on read:** você monta a timeline só quando alguém lê — que, como vimos, não segura a escala.

Por que fan-out on write costuma vencer aqui? **Controle de throughput.** Você conhece a vazão que o seu sistema aguenta e consegue limitar a distribuição a esse teto. Se fizesse tudo na leitura, os picos ficariam impossíveis de controlar. É contraintuitivo na primeira vez, mas fazer o trabalho na escrita te devolve previsibilidade.

E o conceito de fan-out extrapola a rede social — vale a pena guardar (inclusive para entrevistas):

- **Comunicação síncrona:** uma request na sua API que, para responder, dispara 3 ou 4 requests internos.
- **Mensageria:** uma mensagem chega num ponto (o *exchange* do RabbitMQ, por exemplo) e é roteada para vários consumidores.
- **Grafos:** a interação de um nó dispara N interações para outros nós adiante.

Fechando o link com o Capítulo 1: cada timeline pré-computada é um **dado derivado** da base principal (o **system of record**), onde os posts realmente moram. A view materializada é derivada; a fonte da verdade continua sendo o storage primário.

---

## Performance: response time vs. throughput

Com o estudo de caso resolvido, o capítulo formaliza o vocabulário de performance em torno de duas métricas:

- **Response time (tempo de resposta):** o tempo do fluxo **inteiro**, do ponto de vista do usuário. Da request sair do cliente até a resposta voltar.
- **Throughput (vazão):** a quantidade de coisas que acontecem num intervalo — requisições por segundo, dados por segundo, operações por segundo.

As duas se relacionam. O throughput mostra a **capacidade** do sistema. Quando você atinge o limite de vazão, só há dois caminhos: **reduzir o tempo de resposta** de cada operação individual **ou aumentar a capacidade de vazão**.

A analogia que colou foi a do **cano**: se você precisa de mais água dentro de casa, ou aumenta o diâmetro do cano (faz a água passar mais rápido) ou... coloca **mais canos**. O primeiro é escala vertical; o segundo é a escala **horizontal** que o livro deixa implícita na figura.

### A anatomia do tempo de resposta

O ponto mais rico dessa parte é entender que **response time não é um número atômico** — ele é a soma de várias etapas. Pensando numa request web, dentro daquele tempo cabem: a conexão de rede, a espera até o escalonador do sistema operacional dar CPU para a aplicação, a execução da aplicação em si, a espera pelo banco de dados, a espera pelo disco...

E é aqui que entra um alerta de vocabulário que pega muita gente (confissão coletiva na sala): **latência não é sinônimo de response time.** O livro diferencia:

- **Response time** é a experiência ponta a ponta, do cliente.
- **Latência** é, especificamente, o **tempo de rede** — o tempo que a request leva para sair do cliente e *chegar* ao serviço (e a resposta voltar).
- No meio ainda tem o **tempo de fila** (esperando ser processada), o **tempo de serviço** (processando de fato) e mais uma fila na volta.

Falar "minha latência está em 1 segundo" quase sempre é impreciso. Quando você quebra o balde, descobre que ele tem camadas — óleo, água, a borra do café — e o problema costuma estar só numa delas. Muitas vezes a seta da rede está quase reta (latência baixíssima) e o vilão real é a **fila** ou o **serviço** (um lock entre leitura e escrita, por exemplo). Dá até briga homérica com a cloud: você reclama de "latência altíssima" e, quando quebra o número, a latência de rede é ínfima — o problema é outro.

Ferramentas que ajudam a enxergar isso:

- [**Distributed tracing**](https://opentelemetry.io/docs/concepts/observability-primer/#distributed-traces) e **spans**: dentro de um mesmo código você cria spans para ver *exatamente* onde a operação está lenta — se é network, se é espera, se é banco, se é lógica, se está travando no event loop do JavaScript, se é CPU.
- **A métrica certa para escalar é a fila** — não a CPU nem a memória. Se a fila de requisições está crescendo, é sinal para escalar antes que o response time desande.

> Os gargalos nunca vão embora — eles mudam de lugar. Essas métricas servem justamente para achar onde o gargalo está agora e mover ele para o lugar certo.

E os números certos guiam a solução: **network** alta? Talvez a infra esteja deployada na região errada — pense em CDN ou numa nova região. **Fila** subindo? Escala horizontal do serviço. **Processamento** alto? Talvez o problema seja algorítmico, e a otimização é no código.

### Quando o throughput estoura: o retry storm

O que acontece quando você bate no teto da vazão? A fila dispara e tudo fica lento. Pior: você entra num **ciclo vicioso** — fila longa aumenta o tempo de resposta, tempo de resposta maior faz a fila crescer mais, e por aí vai. O livro chama isso de **retry storm**: uma tempestade de retentativas que alimenta a própria sobrecarga.

Um arsenal de estratégias apareceu para lidar com isso:

- **[Circuit breaker](https://martinfowler.com/bliki/CircuitBreaker.html):** se o serviço caiu por sobrecarga, não adianta subir mais instâncias — a carga continua lá esperando. O circuit breaker vai **recusando umas requisições e aceitando outras**, dando fôlego para o serviço recuperar a saúde aos poucos.
- **[Backoff exponencial](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/):** se você reenvia sempre a cada 1 segundo, continua martelando o sistema. A ideia é **aumentar o intervalo** a cada falha — 1s, 2s, 4s, 8s (idealmente com um componente aleatório) — dando tempo para o sistema respirar.
- **[Load shedding](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/):** o sistema detecta que a sobrecarga está chegando e **rejeita requisições proativamente** — "estou cheio, por enquanto não aceito".
- **[Back pressure](https://www.reactivemanifesto.org/glossary#Back-Pressure):** o sistema responde ao cliente pedindo para **diminuir o ritmo** de envio.
- **[Rate limiting (token bucket)](https://en.wikipedia.org/wiki/Token_bucket):** imagine um balde enchendo de fichas, com limite de, digamos, 10. O cliente gasta as fichas nas requisições; quando o balde esvazia, ele espera reencher. Distribui melhor a carga entre os usuários. Token bucket é só **uma** das várias estratégias de rate limit.
- **[Lock de idempotência](https://en.wikipedia.org/wiki/Idempotence):** antes de enfileirar, você "loca" o processamento (por exemplo, de um SKU). Se a mesma request chegar de novo enquanto a primeira está na fila, você **descarta** — já está sendo processada. Solta o lock ao terminar. Um relato de produção contou que isso levou a fila "da água para o vinho": de centenas de milhares para, no pior caso, algumas centenas.

Um lembrete elegante que o livro faz: nada disso é novo. O **[TCP](https://en.wikipedia.org/wiki/TCP_congestion_control)** já implementa controle de tráfego e de carga internamente, sem a gente perceber. A internet inteira está calcada nisso — decisões que a galera dos anos 80 e 90 já tomou por nós.

> A internet foi tão bem feita que ninguém tem noção da complexidade que ela é.

E, saindo um pouquinho do livro, tem a **fila virtual** (a "sala de espera") — aquela tela de "você está na posição X" em lançamento de Black Friday, ingresso de show, ou GTA 6. Não é *user-friendly* e não é recomendada como padrão, mas em casos raros de pico extremo é uma boa estratégia para cadenciar a galera e não derrubar tudo. (Bônus: costuma ter randomização, para não privilegiar quem está mais perto do servidor — e teve até quem lembrasse do sorteio de ingressos da Copa, que virou um fan-out só para os sorteados comprarem.)

---

## A média mente: a história dos percentis

Se tem um trecho para levar tatuado dessa parte, é este. Como você mede o response time do seu sistema? A resposta instintiva — **a média** — é justamente a armadilha.

Pegue cinco requisições: 8, 10, 11, 11 e 50 segundos. A média dá 18 segundos. Só que 18 **não representa quase ninguém**: quatro das cinco requisições foram rápidas (perto de 10s), e o número foi todo puxado por um único **outlier** de 50s — provavelmente um usuário numa conexão 3G. A média **suaviza os dados e cria uma máscara** sobre o que de fato aconteceu.

A escadinha de métricas ajuda a entender por quê:

- **Média:** soma tudo e divide. Some os dados num número só — e some, junto, a realidade.
- **Mediana (p50):** ordena os valores e pega o do meio. Já é melhor, mas ainda é um ponto só.
- **[Percentil](https://en.wikipedia.org/wiki/Percentile):** é uma mediana generalizada — você escolhe **qual pedaço da distribuição** quer olhar. O p50 é a mediana; o p95 te dá os 95% "de baixo" e joga fora a cauda esquisita; e assim por diante.

A grande sacada: **percentil e mediana não achatam os dados.** Eles dividem a distribuição em pacotes, mas os valores continuam originais, contando uma história real.

E que história? O **p50** te diz que 50% das requisições foram mais rápidas que aquele valor (e 50% mais lentas). O **p99** te diz que 1 em 100 requisições está mais lenta que aquilo — e 99 em 100 estão mais rápidas. Muito mais direto e honesto que uma média.

Vale a intuição das casas decimais que o livro passa de forma sutil:

- **p99** = 1 em 100.
- **p99,9** = 1 em 1.000.
- **p99,99** = 1 em 10.000.

E o percentil também informa **até onde vale a pena otimizar**. Uma Amazon da vida quer esses números baixos — mas ir de p99 para p99,999 pode ter um custo altíssimo para um ganho minúsculo. Será que compensa? Ter essa noção é parte do trabalho.

### Observabilidade: histogramas e as três siglas

Para trabalhar percentil em produção, a ferramenta são os [**histogramas**](https://prometheus.io/docs/concepts/metric_types/#histogram): eles acumulam as métricas em **buckets** por faixa, sem precisar recalcular média nenhuma. Aparecem o tempo todo nas ferramentas de observabilidade, e é o que permite ver o **movimento** dos percentis ao longo do tempo de forma isolada — não só o retrato agregado do dia inteiro. (Ficou combinado, inclusive, trazer um encontro dedicado a observabilidade e [OpenTelemetry](https://opentelemetry.io/) lá na frente.)

E tudo isso desemboca no trio que formaliza "o que é performance boa" para o seu sistema:

- **SLI (Service Level Indicator):** o **indicador** que você mede — por exemplo, o próprio response time.
- **[SLO (Service Level Objective)](https://sre.google/sre-book/service-level-objectives/):** o **objetivo** que você define em cima do indicador. Por exemplo, "99% das requisições abaixo de 200 ms". Serve de *guard rail* para a evolução do software: te empurra a pensar em observabilidade, otimizar banco, escalar horizontal ou verticalmente.
- **SLA (Service Level Agreement):** o **acordo** com o cliente, com dinheiro e obrigações no meio. Estourou o SLA? A fatura vem — pode virar crédito ou multa para o cliente.

Num provedor de cartões, por exemplo, esses números **ditam o sucesso do serviço**. E é exatamente essa ciência dos números que orienta a arquitetura — implementar um cache, partir para microsserviços, escalar horizontalmente — com um **norte bem definido**, em vez de no chute.

---

## Confiabilidade: falta (fault) vs. falha (failure)

A turma começou aqui a última seção do dia — e a diferença que mais chamou atenção foi entre **fault** e **failure**.

A analogia que fixou o conceito (em plena época de Copa) foi a do **futebol**: uma **falta** (fault) não para o jogo — ele segue capengando, tropeçando, mas segue. Já uma **falha** total (failure) é o jogo **parar**. No sistema é igual: um fault é um problema pontual que o sistema **contorna** e continua funcionando; um failure é quando ele **não consegue se recuperar**.

Daí vem o **fault tolerant**: um sistema que continua servindo o usuário **mesmo com faults acontecendo**. Um sistema tolerante a falhas é robusto e continua entregando valor; um que não tolera cai por inteiro ao menor problema — tem um ponto frágil. Mecanismos clássicos: **[RAID](https://en.wikipedia.org/wiki/RAID)** para discos (um disco falha, os outros seguem) e **múltiplas instâncias** para sistemas distribuídos (uma cai, as outras continuam).

*(Parêntese divertido: ninguém lembrou de bons termos em português para fault e failure — em PT tudo vira "falha". A Novatec está traduzindo a 2ª edição, então em breve saberemos a escolha oficial. Até lá, ficamos no inglês mesmo — melhor do que arriscar traduzir "pipeline" para "tubo" ou "shorts" para "bermudas".)*

### SPOF: o ponto único de falha

Conceito central quando se desenha arquitetura: o **[SPOF (Single Point of Failure)](https://en.wikipedia.org/wiki/Single_point_of_failure)**. É aquele elemento que, se cair, derruba **tudo**. Um banco de dados sem réplica nem segunda instância é o exemplo óbvio: ele falha, o sistema inteiro para. Identificar o SPOF na sua arquitetura é dever de casa.

E o SPOF não é só interno. Um **gateway de pagamento** único num e-commerce é um SPOF externo: se aquele provedor cai, e agora? Pensar em arquitetura é pensar também nos **serviços externos** que você integra — e no acoplamento que eles criam. Até um framework é uma forma de acoplamento: se o time do framework muda algo, sua manutenção sofre. Quanto mais você **desacopla** a aplicação de regras específicas de banco, de dependências externas e de frameworks, mais mitiga o ponto único de falha (e aqui o [DDD](https://martinfowler.com/bliki/DomainDrivenDesign.html) ajuda bastante). Cuidado clássico: o "microsserviço" que na verdade é um **monolito distribuído** com todos os serviços plugados no **mesmo banco** — se o banco cai, cai tudo junto.

### Gerar uma falta para evitar uma falha

O insight mais elegante da seção: às vezes você provoca um **fault de propósito para prevenir um failure**. Circuit breaker e load shedding fazem exatamente isso — "não vou conectar nessa API agora e já retorno um erro" ou "vou descartar esse processamento porque não consigo lidar com ele agora". É melhor um setor indisponível do que amarrar todos os outros e derrubar o sistema inteiro sem entregar valor nenhum.

O e-commerce ilustra bem: em vez de fazer tudo síncrono (onde qualquer tropeço vira uma **compra perdida** — o pior pesadelo do varejo), eles te dão o "compra feita, pode ficar tranquilo" na hora e jogam o resto para **background**. Fazem o fan-out do processamento: e-mail, aprovação de cartão, logística. Se a logística tropeça, remarcam a entrega para dois ou três dias e te avisam. Fazem de tudo para a venda se efetivar — transformando o que seria uma **falha** síncrona em uma **falta** controlada e assíncrona.

### Injeção de falhas e engenharia do caos

Como saber se o seu sistema é *de fato* tolerante a falhas? Você **quebra ele de propósito**. [**Fault injection**](https://en.wikipedia.org/wiki/Fault_injection) é induzir falhas deliberadas para avaliar a tolerância; a [**chaos engineering**](https://principlesofchaos.org/) (engenharia do caos) é a disciplina que faz isso de forma sistemática. Você bagunça as coisas para descobrir, no controlado, o que aconteceria no caos real: se um cloud provider cai, se o gateway de pagamento para — meu sistema cai junto ou continua funcionando minimamente? Isso reforça o valor de ter **mais de um fornecedor**, [**injeção de dependência**](https://martinfowler.com/articles/injection.html) para chavear qual serviço está em uso, e redundâncias físicas como o RAID.

> Esse livro é profundo: ele traz muita coisa de forma transversal. Um tópico bate no outro e faz o conhecimento se distribuir — um fan-out no grafo de conceitos.

---

## Os trade-offs desta metade (para consultar depois)

| Decisão | De um lado | Do outro lado |
|---|---|---|
| Funcional vs. não funcional | Entrega valor visível ao negócio | Sustenta o valor a longo prazo, mas é invisível e precisa ser "vendido" |
| Fan-out on write vs. on read | Leitura barata e pronta, throughput controlado | Escrita mais cara; problema com celebridades (exige híbrido) |
| View materializada vs. cálculo em tempo real | Timeline pronta, resiste a picos | Precisa recomputar na escrita; consistência eventual |
| View materializada vs. cache | Pré-computa antes, imune ao pico frio | Cache é on-read, mais simples, mas sujeito a surpresa e invalidação |
| Escala vertical vs. horizontal | Cano maior, mais simples | Mais canos, escala melhor, mas adiciona rede/complexidade |
| Média vs. percentis | Um número fácil de comunicar | Esconde outliers; percentil conta a história real |
| Otimizar p99 → p99,999 | Cauda melhor | Custo altíssimo para ganho marginal |
| Gerar fault vs. arriscar failure | Degrada de forma controlada, entrega valor parcial | Exige circuit breaker/load shedding e assincronismo |

---

## O que vem na Parte 2

Paramos no meio do Capítulo 2 de propósito — tinha muita coisa boa e a conversa renderia madrugada adentro. Ficou para o próximo encontro o restante de **confiabilidade** (erros de software, o fator **humano** e cultura), além de **escalabilidade** e **manutenibilidade**. É o tipo de assunto que fica "quente na cabeça" quando discutido logo em seguida — por isso a decisão de dividir em dois, com apenas uma semana de intervalo.

---

## Quer participar do próximo?

Este foi só o **Capítulo 2, Parte 1**. Os encontros acontecem **a cada quinze dias** (e, quando o capítulo é grande, viram dois).

O clube é aberto, descontraído e feito **da comunidade para a comunidade**: sem aula, sem cobrança, só gente que vive esses problemas trocando ideia (e cicatrizes de produção). Não precisa ter lido tudo nem ser especialista.

👉 **Participe do Clube do Livro:** [Designing Data-Intensive Applications da comunidade Craft Code Club](https://craftcodeclub.io/book-club/designing-data-intensive-applications)

Traga sua leitura, suas discordâncias e seus exemplos. A melhor parte nunca está só no livro, está na conversa em cima dele.

---

### Referências

**O livro**

- **Designing Data-Intensive Applications**, Martin Kleppmann e Chris Riccomini (2ª edição). Capítulo 2: *Defining Nonfunctional Requirements*. [Site oficial](https://dataintensive.net/).

**Post anterior da série**

- [Não existem soluções, só trade-offs: o que aprendemos no Capítulo 1 de DDIA](https://craftcodeclub.io/posts/ddia-trade-offs-arquitetura-de-sistemas)

**Gravação do encontro**

- [Assista no YouTube](https://youtu.be/1FyvJh315Xk)

**Links compartilhados na discussão**

- [Quadro da discussão (Excalidraw)](https://link.excalidraw.com/l/ADMgGFVWISx/1ncjQemuKVK)

**Para aprofundar (conceitos citados)**

- [Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html) (Martin Fowler)
- [Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) (AWS Architecture Blog)
- [Token Bucket](https://en.wikipedia.org/wiki/Token_bucket) · rate limiting
- [Load Shedding](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/) (Amazon Builders' Library)
- [SLIs, SLOs, SLAs](https://sre.google/sre-book/service-level-objectives/) (Google SRE Book)
- [Latency vs. Throughput](https://en.wikipedia.org/wiki/Latency_(engineering))
- [Chaos Engineering](https://principlesofchaos.org/)
- Outros termos para pesquisar: fan-out on write/read, materialized view, retry storm, back pressure, single point of failure (SPOF), RAID, fault injection, back-of-the-envelope estimation.
