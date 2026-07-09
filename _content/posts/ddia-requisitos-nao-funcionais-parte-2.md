---
title: "Escala destrói sonhos: o Capítulo 2 de DDIA (Parte 2)"
date: "2026-07-06"
description: "Notas do terceiro encontro do Clube do Livro da Craft Code Club sobre Designing Data-Intensive Applications (2ª edição): o fecho do Capítulo 2 com confiabilidade (fault vs. failure, tolerância a falhas, SPOF, chaos engineering), o fator humano, escalabilidade (vertical vs. horizontal, shared-nothing, o gargalo que só muda de lugar) e manutenibilidade (simplicidade, complexidade acidental, padrões e evolvability)."
topics: ["System Design", "Clube do Livro"]
keywords:
  [
    "DDIA",
    "Designing Data-Intensive Applications",
    "Martin Kleppmann",
    "Requisitos não funcionais",
    "Confiabilidade",
    "Tolerância a falhas",
    "Fault vs Failure",
    "SPOF",
    "Chaos Engineering",
    "Cell-based Architecture",
    "Blast Radius",
    "Disaster Recovery",
    "Escalabilidade",
    "Scale up",
    "Scale out",
    "Shared-nothing",
    "Manutenibilidade",
    "Simplicidade",
    "Complexidade acidental",
    "Evolvability",
    "Hyrum's Law",
    "DDD",
  ]
authors: []
---

*Este post é um resumo da discussão do terceiro encontro do Clube do Livro da [Craft Code Club](https://craftcodeclub.io/book-clubs/designing-data-intensive-applications) sobre Designing Data-Intensive Applications. É a segunda metade do Capítulo 2, a continuação direta da [Parte 1](https://craftcodeclub.io/posts/ddia-requisitos-nao-funcionais-parte-1).*

O Capítulo 2 de **Designing Data-Intensive Applications** (DDIA), de Martin Kleppmann, rendeu tanto que a turma decidiu quebrá-lo em dois encontros. Na [Parte 1](https://craftcodeclub.io/posts/ddia-requisitos-nao-funcionais-parte-1) a gente passou por requisitos não funcionais, o estudo de caso da rede social e **performance**. Neste terceiro encontro fechamos o capítulo com os outros três pilares: **confiabilidade**, **escalabilidade** e **manutenibilidade** (e, no meio do caminho, o fator humano).

A dinâmica é sempre a mesma: a cada quinze dias, um capítulo. Sem aula, sem palestra, sem ninguém "dono da razão". Só gente que vive esses problemas trocando experiências, concordando, discordando e trazendo cicatrizes de produção. Teve gente nova na sessão, e a melhor parte da noite foi justamente ver os exemplos do dia a dia batendo com o que o livro descreve. A conversa girou em torno do mesmo [quadro no Excalidraw](https://app.excalidraw.com/s/ADMgGFVWISx/1ncjQemuKVK) da Parte 1.

> **Escala destrói sonhos.**

Essa frase, jogada no meio da conversa, virou o fio condutor da noite. Não existe fórmula mágica para nenhum desses requisitos: só trade-offs colados no contexto do negócio.

---

## De onde a gente parou

Antes de avançar, um recap rápido do que a [Parte 1](https://craftcodeclub.io/posts/ddia-requisitos-nao-funcionais-parte-1) deixou no ar:

- **Requisitos não funcionais** (rapidez, confiabilidade, segurança, conformidade, manutenibilidade) são tão importantes quanto os funcionais. De que adianta uma funcionalidade boa se o software é lento ou não é confiável?
- O **estudo de caso da rede social** (estilo X/Twitter) com ~500 milhões de posts/dia mostrou que, quando **a leitura é muito maior que a escrita**, faz sentido sacrificar recurso na escrita para baratear a leitura: a **view materializada**, pré-computando a timeline na hora do post.
- Em **performance**, separamos **response time** de **throughput**, e vimos por que a **média aritmética engana** enquanto os **percentis** contam uma história melhor (o p50 é a experiência típica; o p95/p99 revela a cauda).
- E a gente tinha *começado* a falar de **confiabilidade**, a diferença entre **fault** e **failure**, que é exatamente por onde este encontro retomou.

---

## Confiabilidade: fault não é failure

O livro trata essa distinção de um jeito mais claro do que qualquer outro que a turma já tinha visto, e vale a pena martelar:

- Uma **fault** é algo que deu errado num componente, mas o sistema **soube lidar** com aquilo de forma resiliente. Degradou uma parte pequena, mas o todo continua operando.
- Uma **failure** é quando o sistema **para de operar** como deveria, ou sai do ar por inteiro, o clássico `503 Service Unavailable`.

E o ponto mais elegante: muitas vezes a gente **provoca uma fault de propósito para evitar uma failure**. Circuit breaker, backpressure, load shedding, todos preferem degradar um pedacinho a derrubar tudo.

*(Parêntese das traduções: em português, "fault" e "failure" costumam virar as duas "falha", o que apaga justamente a distinção que importa. A Novatec, que está traduzindo a 2ª edição, vai manter os termos e diferenciar pelo contexto, e aqui no post fazemos o mesmo: seguimos com fault e failure em inglês.)*

### "Um erro tratado é uma fault?"

Surgiu uma pergunta ótima: se eu **valido um e-mail** malformado e trato o erro, isso é uma *fault*?

O consenso foi que **depende da perspectiva**, e isso é a cara de arquitetura em alto nível:

- Um input validado é mais um **guard rail** de negócio do que uma *fault*. A aplicação **esperava** aquilo e tinha um fluxo específico. Se você esperava, quase não era uma *failure*.
- Mas troque a lente: se a **sua** API não trata algo robustamente e **outra aplicação depende dela**, o teu erro pode virar uma *fault* para o consumidor. Se ele souber se recuperar, é tolerante a falhas; se não, vira *failure*.
- E dá para amarrar isso a métrica: dentro do **SLO**, é uma *fault* tolerável; **fora do SLO**, virou *failure*. (O livro reforça isso: *failure* é, em outras palavras, "não cumprir o SLO".)

A linha entre as definições é turva de propósito, e reconhecer isso é metade da maturidade.

### Tolerância a falhas e o ponto único de falha

Um dos requisitos não funcionais é a **capacidade do sistema de conviver com faults**, o *fault tolerant*. Um sistema é tolerante a falhas se **continua fornecendo o serviço mesmo quando algo interno falha**.

O exemplo do e-mail ficou didático:

- Sistema que **trava** porque o provedor de e-mail caiu → **não** é tolerante a falhas.
- Sistema que **detecta** e **chaveia para um segundo provedor**, ou que **joga o envio numa fila** para resolver depois → **é** tolerante a falhas. O fluxo principal não parou.

O oposto disso é o **[SPOF (Single Point of Failure)](https://fidelissauro.dev/single-point-of-failure/)**: aquele componente que, se cair, para tudo. Um banco de dados sem réplica é o exemplo canônico. E aqui entra o trade-off de escala: com **uma máquina só**, uma *fault* vira *failure*; com **dez máquinas** balanceadas, a mesma pane é só uma *fault*, dá para redistribuir.

> Boa parte da nossa atribuição como sênior/staff/arquiteto é fazer com que uma **fault não se torne uma failure**. System Design é muito sobre isso: distribuir em vários nós, colocar uma camada de cache que também vira amortecedor do banco, e ir **diminuindo as superfícies de possíveis pontos de falha**.

Curioso como os conceitos se entrelaçam: a gente coloca **cache** para melhorar a experiência do usuário, e ele acaba **protegendo o banco** de um volume de acessos que o derrubaria. Em System Design, quase nada serve para uma coisa só.

Uma forma de levar essa ideia adiante é a **[cell-based architecture](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/what-is-a-cell-based-architecture.html)**: em vez de um sistema único onde uma pane se alastra, você particiona tudo em **células** isoladas e independentes, de modo que uma *failure* fica contida numa célula em vez de derrubar todo mundo. É reduzir o *blast radius* (o raio de impacto) por design, o mesmo espírito de "diminuir as superfícies de falha", só que promovido a princípio de arquitetura.

### Quebrar de propósito: chaos engineering

Como saber se você é *de fato* tolerante a falhas? Você **quebra de propósito**. O **fault injection** injeta problemas (matar processos, por exemplo) para medir a capacidade de recuperação, e a **[chaos engineering](https://principlesofchaos.org/)** é a disciplina que faz isso de forma sistemática, o [Chaos Monkey](https://netflix.github.io/chaosmonkey/) da Netflix é o exemplo mais famoso.

No próprio caso da rede social, a tolerância a falhas tem um escopo bem definido: se a máquina que atualiza as **timelines materializadas** cai, o serviço tem que continuar **sem perder nenhuma publicação e sem duplicar nenhuma**. Resolver o problema sem criar outros problemas, esse é o teste.

E tem a camada física, que a gente esquece: um serviço de storage geralmente está calcado em **[RAID](https://en.wikipedia.org/wiki/RAID)** (um conjunto de discos que tolera a falha de um deles). O RAID já é tolerante a falhas por padrão, bem, *depende do tipo de RAID*. 😜

---

## A internet é boa demais - e por isso a gente esquece que ela falha, muito mais do que vemos

O capítulo começa com uma frase de Alan Kay que a turma adorou:

> A internet foi feita tão bem que a maioria das pessoas a enxerga como um recurso natural (tipo o Oceano Pacífico), em vez de algo feito pelo homem.

O **[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)** é o exemplo perfeito: um pacote se perde no meio do caminho, ele sabe qual foi, reenvia; os pacotes chegam fora de ordem, ele reordena. São **40 anos** de TCP/HTTP/SMTP tão bem resolvidos que a gente usa sem pensar. Parece assunto novo, "hype de livro", mas é engenharia madura embaixo do capô.

E com a **cloud** a abstração aumenta ainda mais, muita gente nem sabe o que são as quatro letras de RAID. Mas a nuvem não fez a física desaparecer: ela organiza **zonas de disponibilidade** (data centers fisicamente separados, mas próximos o suficiente para não perder latência) e **regiões** (distantes o bastante para tolerar um desastre natural). A interface esconde uma complexidade gigante, e é por isso que ainda vale entender esses conceitos: é o que permite arquitetar direito lá em cima.

E tem o lado frágil de toda essa dependência, capturado pela [tirinha xkcd 2347](https://xkcd.com/2347/): boa parte da infraestrutura digital moderna se apoia, sem a gente perceber, em algum projeto minúsculo mantido de graça por uma única pessoa. As abstrações que a gente venera escondem tanto a complexidade quanto os pontos únicos de falha embaixo delas, é aquela camada OSI inteira funcionando em silêncio até o dia em que não funciona.

O contraponto honesto: **"tolerante a falhas" é vago**. Não dá para dizer que o seu sistema é tolerante a falhas e ponto, sempre existe uma *fault* que ele não vai tolerar. Se um **cabo submarino** for cortado (um peixe grande mordeu o cabo, vá saber), nenhum retry salva. A gente é tolerante **até certas** *faults*, nunca a todas. O próprio livro brinca: se a catástrofe for grande, "é só botar tudo no espaço".

Por que isso importa? Porque **dita quão complexa (e cara) a arquitetura precisa ser**, e isso é uma conversa de negócio. Um sistema que roda das 9h às 18h talvez não sofra com downtime; um SaaS com milhões de usuários que não pode cair está em outra escala. Quanto o negócio perde parado por X tempo? A resposta define quanto vale investir em confiabilidade.

### Disaster Recovery: o músculo que ninguém treina

Um tema que o livro tangencia e a turma aprofundou: **Disaster Recovery (DR)**. Muita empresa não tem plano, e nunca testou. Sistemas críticos usam **multi-cloud**; a maioria espalha tudo e torce para nunca dar problema. Mas a AWS já ficou horas fora; se o seu sistema é crítico, como você recupera?

É aí que entra **infra as code**: ter tudo documentado, com **ciclos periódicos** de subir a infra inteira num cluster paralelo, para exercitar o "músculo" de recuperar o sistema a qualquer momento. É caro e trabalhoso, por isso as empresas desviam, mas é um dos melhores exercícios para **descobrir o que você não sabe** sobre a própria infraestrutura (e o quão difícil ela está de manter).

O fecho da seção amarrou com a senioridade: fazer a coisa **funcionar** é metade do problema. A outra metade é **o que pode dar errado depois** que está funcionando. *Faults* são, em boa parte, **previsíveis** (dá para saber quando o copo vai encher pela capacidade e pela carga esperada), e a tolerância é o **tratamento pré-definido** para elas, muitas vezes um mecanismo usado para conter uma *fault* acaba introduzindo outra, e o trabalho vira um malabarismo.

---

## O elo mais fraco (e mais humano)

O capítulo tem uma seção específica, *Humans and Reliability*, sobre o fato de que o ser humano **projeta, constrói e opera** o software. E a operação, mesmo bem-intencionada, causa *failures*.

Os exemplos de produção foram os melhores:

- **Abuso inocente:** um upload de arquivo sem limite de tamanho, tipo ou frequência. Ninguém mal-intencionado, alguém só disparou um *job* de integração que metralhou a API sem rate limit e a derrubou. Com IA no meio, o problema muitas vezes nem é a disponibilidade, é o **custo** que explode se você não põe cotas.
- **A brecha que virou caos:** por falta de uma validação, usuários conseguiram fazer um *bulk update* nos preços dos produtos, zerando tudo e gerando milhares de vendas em minutos. E o pior: **várias camadas de cache** atrapalharam a tirar o produto do ar, teve que sair caçando e limpando cada uma. O incidente gerou a pergunta certa: *a gente precisa mesmo de todas essas camadas de cache?*

A defesa é conhecida: seguir padrões e guidelines, rate limit em API pública, **validação no backend**, limites claros por usuário. Mas o livro vai além e fala do **controle do comportamento humano** por procedimentos e compliance: **rollback** para erros de configuração, **rollout gradual** e **observabilidade**. E crava uma verdade organizacional:

> A maioria dos erros é prevenível. Culpar quem errou não resolve, é um problema de **priorização** da organização. O ideal é adotar **[post-mortems sem culpa](https://sre.google/sre-book/postmortem-culture/)** (blameless), para entender o que aconteceu e melhorar o processo.

Como alguém resumiu no chat: **"se tem placa, tem história"**. Cada processo burocrático e cada guard rail é uma cicatriz de algo que já deu errado. Some a isso a aceitação de que **as coisas vão falhar**, e o foco passa a ser o **[MTTR](https://en.wikipedia.org/wiki/Mean_time_to_repair)** (quão rápido você se recupera), seja a falha humana ou de um parceiro.

### Hyrum's Law: o usuário se acopla ao seu bug

Um clássico apareceu aqui: a **[Lei de Hyrum](https://www.hyrumslaw.com/)**. Não importa o que você documenta, com usuários suficientes, **todo comportamento observável da sua API vira dependência de alguém**, inclusive o comportamento *errado*. Você corrige um bug e um cliente reclama que dependia dele. O mesmo vale para UX: o usuário acha a brecha que pula a página chata de burocracia, ou o upload um pouco maior, e se acopla a ela. É o velho **"bug que vira feature"**.

Isso conecta com uma provocação de produto: talvez você **não deva** entregar tanta feature. Botão novo todo dia, campo novo, página nova, isso tira a **sensação de estabilidade** do usuário, que acabou de aprender e já tem que reaprender. Some a **paralisia por análise**: opções demais sobrecarregam e o usuário nem usa (a estratégia do Steve Jobs de minimizar escolhas ao voltar para a Apple). No fim é **[Pareto](https://en.wikipedia.org/wiki/Pareto_principle)**: o usuário usa 20% das features 80% do tempo.

E tem o custo escondido de cada funcionalidade: mais feature = mais **entropia** de código, mais superfície para bug, mais manutenção, mais carga cognitiva em quem mantém. O que puxa direto para o último pilar.

*(E um lembrete sociotécnico: muitos "erros de configuração" não são bugs, são falhas de **comunicação/documentação**. A API filtra produtos marcados como "não vender online"; mas quem consome sabia disso? Escalar o conhecimento sobre o uso da ferramenta previne uma montanha de problemas "humanos".)*

---

## Escalabilidade: não existe bala de prata

Escalabilidade é a capacidade do sistema de lidar com **mais tráfego, mais demanda, mais processamento**. As duas formas clássicas:

- **Escala vertical (scale up):** aumentar CPU, memória, disco da máquina. Simples, até o custo ficar proibitivo.
- **Escala horizontal (scale out):** criar réplicas da aplicação e distribuir a carga.

Mas o insight que dá título a este post é que **escala destrói sonhos**: não tem fórmula mágica. O livro sugere **repensar a arquitetura a cada ordem de magnitude** de crescimento. Arquitetar para 1 milhão de usuários quando você tem 100 é queimar dinheiro; o ideal é entender o seu crescimento (quantos clientes por dia, como cresce o armazenamento, como sobem os requests) e evoluir a cada salto, olhando, **no máximo, para a próxima ordem de magnitude**, nunca duas à frente (você nem conhece os problemas que a terceira vai trazer).

### Otimizar é o primeiro passo (e o cartão de crédito é o teto)

Uma provocação da galera nova: **otimizar queries e usar filas**, sem scale up nem scale out, também é escalabilidade? **É.** Uma query lenta queima mais energia e empilha todo o resto, efeito cascata. Um relato de produção: depois de um refactor, o cálculo ficou tão rápido que **deu para remover o cache** (não havia mais requisição concorrente que justificasse o custo operacional dele). Deixar as coisas mais eficientes é uma forma de escalar.

Por isso, **otimização vem antes de comprar hardware**: cuidar do banco, achar código vazando, usar paralelismo numa máquina única (múltiplos processos/threads compartilhando memória). Como resumiu um participante:

> A sua escalabilidade é medida pelo seu **cartão de crédito**, é o quanto você consegue pagar.

E isso vira trade-off explícito: com a demanda de e-mails saindo de mil para cem mil por segundo, você **coloca mais pods** (mais dinheiro) **ou** joga numa **fila** e processa aos poucos. Dinheiro não é infinito; conhecer seus limites de custo é parte do jogo. E arquitetura importa: um **monolito** escala como um bloco só; **microsserviços** deixam você escalar só o que precisa.

### Shared-nothing e o gargalo que só muda de lugar

O livro nomeia: scale up é **shared-memory architecture**; scale out é **[shared-nothing architecture](https://en.wikipedia.org/wiki/Shared-nothing_architecture)** (vários nós, coordenados no nível de software por um load balancer). Os **benefícios** da escala horizontal: escalar de forma quase linear, usar **hardware commodity** (melhor custo-benefício), fine-tuning de recursos e **tolerância a falhas de brinde**. O **custo**: exige *sharding* explícito e adiciona complexidade. Aplicação + banco + web server na mesma máquina é muito mais fácil de manter; conforme você escala, fica mais difícil, e o trabalho é equilibrar escalável × confiável × complexo.

E a máxima que sempre pega a gente:

> O **gargalo nunca vai embora, ele só muda de lugar.**

Não adianta colocar 50 pods a mais se o banco só aceita 10 conexões. Aumentar a potência de um lado não melhora o todo, isso é a **[teoria das restrições](https://en.wikipedia.org/wiki/Theory_of_constraints)** aplicada a sistemas: é preciso a visão **holística**, escolher **onde** você quer que o gargalo fique.

Por isso o livro é enfático: arquiteturas de larga escala são **altamente específicas para a aplicação**. Não existe *one-size-fits-all scalable architecture*, a arquitetura da Netflix ou do Spotify não serve para você, porque não é a sua realidade. Os **princípios** que ficam: quebrar o sistema em componentes menores e independentes (microsserviços, sharding, stream processing, todos shared-nothing), definir bem as **fronteiras** desses pedaços (os *bounded contexts* do **[DDD](https://martinfowler.com/bliki/BoundedContext.html)**) e **não complicar**, uma máquina única com um banco resolve muito sistema previsível.

### Duas motivações diferentes para escalar

Uma provocação fechou o tema: escalabilidade **sazonal** (uma Black Friday, um pico de 3× a 10× a carga normal) é bem servida pela escala horizontal. Mas escalabilidade por **evolução do negócio** (sair de mil para um milhão de usuários) é outra coisa, talvez nem seja mais questão de "colocar máquina", e sim de **repensar a arquitetura**. A Google se reinventou várias vezes a cada ordem de magnitude; acrescentar nós não é solução para tudo, e a conta sempre vem.

E dois lembretes finais: pela **[Lei de Gall](https://en.wikipedia.org/wiki/John_Gall_%28author%29#Gall's_law)**, sistemas complexos que funcionam evoluíram de sistemas simples que funcionavam, quem começa complexo, quase sempre falha. E "meu sistema é escalável" é uma frase incompleta: escalável **em quê**? Throughput? Qual tipo de throughput? Não à toa o livro se chama *data-intensive applications*, quase todo sistema de alta escala é, no fundo, uma alta escala **de dados** (o Humberto lembrou dos **4 V's**: volume, velocidade, variedade e veracidade).

---

## Manutenibilidade: o custo de conviver com o código

O último pilar. Hoje a **operabilidade** (a facilidade de rodar) está descomplicada, `docker run`, um deployment no Kubernetes e pronto, mais uma abstração tão boa que a gente esquece a engenharia por trás dela.

Mas o grosso do custo de um software está **depois** do "funciona": corrigir bugs, manter o sistema no ar, investigar falhas, adaptar a novas plataformas, atender novos casos de uso, **pagar dívida técnica** e adicionar features. Cuidar do código hoje é evitar problema amanhã. E há um componente humano: o conhecimento sobre uma decisão arquitetural **se perde quando as pessoas saem**, às vezes o problema é mais de gente do que técnico. E, inevitavelmente, **todo software vira legado**.

O capítulo organiza a manutenibilidade em três princípios: **operabilidade**, **simplicidade** e **evolvability**.

Um recorte via DDD amarrou bem: onde a manutenibilidade **dói**? Num **domínio genérico**, talvez nem tanto. Mas no **domínio core**, o que move a empresa e gera a receita, ela é uma dor latente: vai chegar feature nova, legislação nova, e a rotatividade das pessoas exige que o código seja **simples de entender por qualquer um**. O *driver* do requisito não funcional é **em que parte do negócio você está mexendo**.

E o ciclo vicioso que todo mundo conhece: a empresa quer **comportamento** (features), o prazo não acompanha, o código **degrada**, o que dificulta a próxima feature, que degrada mais. O trade-off é entregar comportamento **sem** deixar o código apodrecer.

### Simplicidade: complexidade essencial vs. acidental

O que sinaliza um código degradado? Quando fica **difícil de entender**; quando o negócio não é intuitivo; quando você precisa entrar em três módulos para entender um. É o caminho para a **big ball of mud**, a grande bola de lama. E o vilão do prazo/custo empurra contra a Regra do Escoteiro (deixar o código melhor do que você pegou), como popularizada por [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin).

A chave é gerenciar complexidade, e a turma separou os tipos:

- **Complexidade essencial:** inerente ao negócio. Um sistema financeiro é complexo por natureza, não dá para deliberar não ter.
- **Complexidade acidental:** a que a gente **escolhe** adicionar. Dez camadas de indireção, sete ferramentas, acoplamento demais. Essa é a que a simplicidade tenta reduzir.
- E ainda a **cognitiva**: a falta de padrão entre módulos, um conceito de domínio escrito de um jeito no banco e de outro na entidade, puro esforço cognitivo desnecessário.

> Reduzir complexidade melhora significativamente a manutenção. Um bom código é aquele que, quando quebra em produção, os colegas conseguem olhar o fluxo e **entender o que ele faz sem se aprofundar** em cada detalhe.

A ferramenta contra a complexidade é a **abstração**. O SQL é o exemplo perfeito: você pede os dados e o banco resolve algoritmo, ordenação, memória vs. disco, você não precisa saber. Mas cuidado com a **pattern-itis**: querer aplicar todo padrão de System Design cobra o seu preço depois. Um exemplo real citado: um **Event Sourcing** em que cada mudança obrigava a mexer em um monte de camada, às vezes o **simples resolve**.

Nelson trouxe um insight afiado para responder a pergunta "Quando virou legado?": **quando a nossa capacidade e velocidade de adquirir dívida técnica passam a ser maiores do que as de pagá-la.** (Curioso como "legado" só tem conotação ruim em tecnologia, fora dela, deixar um legado é coisa boa.)

### Behavior vs. structure: achar o balanço

Todo código é uma tensão entre **comportamento** e **estrutura** (a discussão puxou o *Tidy First?*, do Kent Beck). Só comportamento, sem estrutura → dívida técnica. Só estrutura, de menos comportamento → *over-engineering* (as tais vinte camadas para entregar uma telinha). O balanço depende do **momento da carreira e da empresa**: uma startup queimando caixa vai de feature e deixa a estrutura para depois (talvez nem precise dela); uma empresa consolidada, com operações de alto valor, precisa cuidar da estrutura. Muitas vezes o mais valioso é o caminho **mais simples do ponto A ao ponto B**, é ele que valida a hipótese de negócio (porque quase todo requisito funcional **é uma hipótese**, que pode se provar errada). Na analogia que ficou: primeiro construa a **estrada**; faixa, luz e acostamento vêm depois, quando você já sabe que é a estrada certa.

### Padrões: um mal necessário

A conclusão mais forte da noite: **governança e padronização nunca são demais**. Use padrões de mercado (as **PSRs** do PHP, os *style guides* prontos de cada linguagem, código defensivo, dicionário de nomenclatura). O mundo real é todo padronizado, a tomada, a mesa, os produtos que a gente compra. Por que só o código não seria? Menos "expressão de arte", mais **pragmatismo** e uma esteira de produção minimamente previsível.

Como isso vive numa empresa grande: um **time de plataforma** com evangelistas de padrões e um **guia arquitetural** com quadrantes (**indicado / suportado / desencorajado / pare de usar**) para bibliotecas. Padrão bem-feito te deixa **pular para qualquer sistema da empresa e se sentir em casa**, o que reduz brutalmente a curva de **onboarding** (e onboarding é custo).

O padrão é um **mal necessário**: três times usando três libs de log diferentes = três CVEs para atualizar, três camadas de abstração, três vezes a carga cognitiva. É por isso que vale o **["Have Backbone; Disagree and Commit"](https://www.amazon.jobs/content/en/our-workplace/leadership-principles)** dos princípios de liderança da Amazon: mesmo que eu prefira PHP e você Node, a gente discute, decide **um** e todo mundo se compromete com a decisão, ganhando transições suaves. Menos emoção, mais pragmatismo, pela saúde do time.

Mas teve o contraponto honesto: **padrão de mercado adotado também pode virar armadilha**. O autor do **MediatR** avisou que a lib vai ser paga; o **FluentAssertions** virou pago do dia para a noite. A defesa é depender de **padrões abertos / protocolos** e abstrair com um **adapter**, para trocar a implementação por baixo sem dor, sem cair no extremo oposto de fazer tudo *in-house*. E vale citar a **[convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration)** do Rails (que inspirou o Laravel): stacks opinativas com **um** jeito de formatar e nomear matam o bikeshedding e reduzem o ruído, enquanto ecossistemas mais abertos (o .NET fora do que vem da Microsoft, por exemplo) ganham liberdade e perdem convergência.

### Evolvability e a abstração errada

O terceiro princípio, **evolvability**, é tornar o software **fácil de mudar** no futuro, o *ETC (Easier to Change)* do Pragmatic Programmer. Quase tudo que a gente faz (abstração, DDD) existe para acompanhar as mudanças de negócio com menos trauma. Simples e bem-feito **evolui** de forma saudável.

Mas o alerta de fechamento foi certeiro, citando a **[Sandi Metz](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction)**:

> A **abstração errada** é muito mais cara que a **duplicação**.

Nem toda duplicação precisa ser abstraída, às vezes ela é **intencional**, a mesma lógica vivendo em dois domínios diferentes. Assim como o dev sofre de *pattern-itis*, ele caça lugar para criar abstração onde não há sobreposição real. A regra prática: duplicou uma vez, ainda é barato; espere a **terceira ocorrência** antes de abstrair.

---

## Os trade-offs desta metade (para consultar depois)

Um apanhado das escolhas que apareceram na conversa, cada uma com o que se ganha de um lado e o que se paga do outro:

- **Gerar uma fault vs. arriscar uma failure:** de um lado, degrada de forma controlada e mantém o serviço; do outro, exige circuit breaker, backpressure ou fila e um desenho cuidadoso.
- **Tolerância a falhas:** de um lado, continua servindo mesmo com *faults*; do outro, custa complexidade e nunca cobre *todas* as *faults*.
- **Ter um Disaster Recovery testado:** de um lado, recuperação rápida de catástrofes; do outro, é caro e trabalhoso de manter e exercitar.
- **Escala vertical vs. horizontal:** a vertical é simples de manter; a horizontal escala melhor e traz tolerância a falhas de brinde, mas exige sharding e adiciona complexidade.
- **Escalar (mais máquina) vs. otimizar:** escalar resolve rápido o pico e o SLA; otimizar é mais barato a longo prazo, e máquina tem teto e custo.
- **Comportamento vs. estrutura:** priorizar comportamento entrega valor e valida hipótese rápido; sem estrutura vira dívida técnica, e estrutura demais vira over-engineering.
- **Padronizar a stack:** de um lado, menos ruído, onboarding rápido e menos CVEs; do outro, menos liberdade individual e o risco de uma lib adotada virar armadilha.
- **Abstrair vs. duplicar:** abstrair reduz repetição; mas a abstração errada custa mais que a duplicação, então espere a terceira ocorrência antes de abstrair.

---

## O fio que costura tudo: requisitos não funcionais são contextuais

O Capítulo 2 fecha com quatro grandes requisitos não funcionais, **performance, confiabilidade, escalabilidade e manutenibilidade**, e a lição é que **não existe receita que sirva para toda feature**:

- Um sistema de **trading**? Performance no topo.
- Um sistema onde a entrega pode esperar? Talvez **confiabilidade** valha mais que performance.
- Está mexendo no **domínio core**? Manutenibilidade vira requisito forte. No **genérico**, talvez nem tanto.

Cada domínio é um domínio, cada empresa é uma empresa. Como na frase que abre o livro, tudo é **trade-off**, e a graça é escolher sabendo o que você está pagando.

---

## Quer participar do próximo encontro?

Com isso a gente **fechou o Capítulo 2**. O próximo encontro é o **Capítulo 3, Data Models and Query Languages** (modelo de documentos vs. relacional, normalização, modelo de grafos, e por aí vai), marcado para **20 de julho**, mantendo a cadência de quinze dias.

O clube é aberto, descontraído e feito **da comunidade para a comunidade**: sem aula, sem cobrança, só gente que vive esses problemas trocando ideia. Não precisa ter lido tudo nem ser especialista, vários participantes desta noite pegaram o livro na véspera e contribuíram lindamente. A melhor forma de aprender é **participar**: quando você explica, anota, desenha um diagrama, o aprendizado deixa de ser passivo.

👉 **Participe do Clube do Livro:** [Designing Data-Intensive Applications da comunidade Craft Code Club](https://craftcodeclub.io/book-clubs/designing-data-intensive-applications)

Traga sua leitura, suas discordâncias e seus exemplos. A melhor parte nunca está só no livro, está na conversa em cima dele.

---

### Referências

**O livro**

- **Designing Data-Intensive Applications**, Martin Kleppmann e Chris Riccomini (2ª edição). Capítulo 2: *Defining Nonfunctional Requirements*. [Site oficial](https://dataintensive.net/).

**Posts anteriores da série**

- [Os requisitos que o negócio não pede: o Capítulo 2 de DDIA (Parte 1)](https://craftcodeclub.io/posts/ddia-requisitos-nao-funcionais-parte-1)
- [Não existem soluções, só trade-offs: o que aprendemos no Capítulo 1 de DDIA](https://craftcodeclub.io/posts/ddia-trade-offs-arquitetura-de-sistemas)

**Gravação do encontro**

- [Assista no YouTube](https://youtu.be/YEmTPYwv5NY)

**Links compartilhados na discussão**

- [Quadro da discussão (Excalidraw)](https://app.excalidraw.com/s/ADMgGFVWISx/1ncjQemuKVK)
- [Chaos Monkey](https://netflix.github.io/chaosmonkey/) (Netflix) · [Principles of Chaos Engineering](https://principlesofchaos.org/)
- [Cell-based architecture](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/what-is-a-cell-based-architecture.html) (AWS Well-Architected)
- [Storage e RAID](https://fidelissauro.dev/storage/) · [Single Point of Failure](https://fidelissauro.dev/single-point-of-failure/) (Matheus Fidelis)
- [Hyrum's Law](https://www.hyrumslaw.com/) · [xkcd 2347: Dependency](https://xkcd.com/2347/)

**Para aprofundar (conceitos citados)**

- [The Wrong Abstraction](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction) (Sandi Metz)
- [Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/) (Google SRE Book), sobre blameless post-mortems
- [Shared-nothing architecture](https://en.wikipedia.org/wiki/Shared-nothing_architecture) · [Theory of constraints](https://en.wikipedia.org/wiki/Theory_of_constraints)
- [Gall's Law](https://en.wikipedia.org/wiki/John_Gall_%28author%29#Gall's_law) · [Convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration)
- Outros termos para pesquisar: fault tolerance, fault injection, disaster recovery, RAID, scale up vs scale out, bounded context (DDD), MTTR, big ball of mud, essential vs accidental complexity, Pareto principle, os 4 V's dos dados.
