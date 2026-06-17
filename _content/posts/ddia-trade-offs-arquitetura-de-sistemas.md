---
title: 'Não existem soluções, só trade-offs: o que aprendemos no Capítulo 1 de DDIA'
date: '2026-06-15'
description: 'Notas do primeiro encontro do Clube do Livro da Craft Code Club sobre Designing Data-Intensive Applications (2ª edição): trade-offs, OLTP vs. OLAP, nuvem vs. self-hosting, sistemas distribuídos, serverless e privacidade.'
topics: ['System Design', 'Clube do Livro']
keywords: ['DDIA', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Trade-offs', 'OLTP', 'OLAP', 'Sistemas Distribuídos', 'Cloud vs Self-hosting', 'Serverless', 'Privacidade de Dados', 'LGPD', 'High Scalability', 'Data Lake', 'Data Warehouse']
authors: []
---

*Este post é um resumo da discussão do encontro do Clube do Livro da [Craft Code Club](https://craftcodeclub.io/book-club/designing-data-intensive-applications) sobre o Capítulo 1 de Designing Data-Intensive Applications.*

> *There are no solutions, only trade-offs.*

É com essa frase (literalmente a primeira do livro) que começa **Designing Data-Intensive Applications** (DDIA), de Martin Kleppmann, e foi também por ela que começou a primeira conversa do nosso **Clube do Livro** da comunidade [Craft Code Club](https://craftcodeclub.io/book-club/designing-data-intensive-applications).

A proposta do clube é simples: a cada quinze dias, um capítulo. Sem aula, sem palestra, sem ninguém "dono da razão". A ideia é juntar gente que vive esses problemas no dia a dia e **trocar experiências**: concordar, discordar, trazer cicatrizes de produção. Este post é um apanhado das melhores discussões do encontro sobre o Capítulo 1, *Trade-offs in Data Systems Architecture*. Para organizar a conversa, a turma montou um [quadro no Excalidraw](https://link.excalidraw.com/l/ADMgGFVWISx/9G9VQCCv2rL) com os tópicos do capítulo.

Se você curte sistemas de alta escala, vai sair daqui com um bom mapa mental e, quem sabe, com vontade de aparecer no próximo encontro.

---

## O capítulo que prepara o terreno

A segunda edição do livro veio **repaginada**: terminologia atualizada, vocabulário dos dias de hoje e dezenas de referências bibliográficas para quem quiser se aprofundar. O Capítulo 1 não tenta resolver nada: ele **organiza o vocabulário** e prepara o leitor para o resto da obra.

E talvez seja justamente aí que esteja o maior valor: Kleppmann fala de **conceitos**, não de ferramentas. Ele descreve o *como pensar*, não o *como fazer*. Em quase nenhum momento ele diz "use a tecnologia X". Ele cita o conceito o tempo todo e deixa as decisões (e os trade-offs) na sua mão.

Esse foi um fio condutor da noite inteira: **a gente não estava discutindo sistemas ou ferramentas, estava discutindo conceitos.** O conceito é o que importa; a ferramenta é só o instrumento que você escolhe para materializá-lo.

---

## Operacional vs. analítico: o relatório que derruba o sistema

O primeiro grande tema do capítulo é a diferença entre sistemas **transacionais/operacionais (OLTP)** e **analíticos (OLAP)**. Parece básico, mas é exatamente o tipo de coisa que passa despercebida quando a gente está com a mão na massa.

O exemplo clássico (e dolorosamente real) apareceu logo:

> *A equipe inteira clica em 'gerar relatório' e o sistema fica lento.*

A história se repete em toda empresa: o time decide que "está lento, vamos aumentar o poder de processamento", mistura carga transacional e analítica **na mesma base, no mesmo lugar**, e aí o cliente fica minutos esperando um relatório sair enquanto o sistema operacional sofre. Faltou dar dois passos atrás e enxergar que ali existem **duas demandas completamente diferentes** competindo pelos mesmos recursos:

- **OLTP**: muitas escritas, leituras por `id` ou por pequenos conjuntos, baixa latência, transações confiáveis. Precisa de dado **atual**.
- **OLAP**: varre o mês inteiro para agregar em uma média, uma mediana, um ticket médio. Pode esperar dez minutos se o resultado for bom. Quase nunca precisa de tempo real; um retrato de ontem, do último mês ou do último ano resolve.

São, na prática, "parafuso e prego": parecem servir para a mesma coisa, mas a mecânica por baixo é outra.

### O caminho do meio que o livro pula

Uma crítica afiada surgiu na conversa: o livro vai direto do banco transacional para uma **stack analítica dedicada** (data warehouse, pipelines de ETL, etc.), sem comentar o **meio do caminho**. E é justamente o meio do caminho que atende a maioria das empresas por um bom tempo:

- **Read replicas** para rodar os relatórios fora do banco principal.
- **Views materializadas** e **agregações pré-computadas** no próprio banco.

Você não precisa de maturidade de big tech para isso. Esse intermediário segura as pontas até você *de fato* precisar de uma stack só para o analítico, com toda a complexidade e os trade-offs que ela carrega.

### HTAP: o híbrido que não substitui ninguém

O livro menciona o **HTAP** (*Hybrid Transactional/Analytical Processing*), e a turma foi certeira na leitura: **ele não substitui** ter a ferramenta certa para cada coisa. Por baixo dos panos continuam existindo **duas estruturas e duas mecânicas**: uma performada para transacionar, outra para agregar petabytes. O híbrido existe mais para **simplificar** a vida de quem está começando do que para ser a resposta final. O ideal continua sendo "uma coisa para cada coisa".

---

## System of Record vs. dados derivados

Uma das definições mais elogiadas do capítulo separa o mundo dos dados em dois pacotinhos:

- **System of Record** (sistema de registro): a *golden source*, o dono da informação, onde mora a última versão da verdade.
- **Derived Data Systems** (dados derivados): tudo que pode ser **reconstruído** a partir do system of record. Se você perder, tudo bem, você regenera.

O **cache** é o exemplo canônico de dado derivado (e o livro coloca ele exatamente nessa categoria). Mas o poder dessa distinção não é meramente acadêmico: na hora de desenhar a arquitetura, **categorizar cada dado** em "fonte da verdade" ou "derivado" melhora a comunicação do time e melhora o próprio design.

E vale o lembrete do livro: **um banco de dados não é intrinsecamente um nem outro**. Depende de como você o usa. O mesmo Postgres pode ser system of record num contexto e fonte derivada em outro. É aquele exercício de "voltar à base do conceito": assim como um *Application Load Balancer*, lá no fundo, ainda é só um load balancer.

Esses conceitos conversam diretamente com padrões que a comunidade já discutiu bastante:

- **Event Sourcing**: você registra os eventos (o system of record imutável) e projeta visões/bancos por aplicação (dados derivados).
- **CQRS**: você separa a responsabilidade de escrita da de leitura, escrevendo no seu registro e derivando os dados para a camada de leitura.

---

## Data Lake, Data Warehouse e o "princípio do sushi"

Subindo um nível, o capítulo entra em **onde** os dados analíticos vivem e traz um princípio com nome engraçado, mas ideia séria:

> **[O princípio do sushi](https://www.datasapiens.co.uk/blog/the-sushi-principle)**: *raw data is better than cooked data.* Dado cru é melhor do que dado cozido.

A interpretação que prevaleceu: guarde o dado **no estado mais cru possível**, do jeitinho que ele chegou. Recebeu um arquivo, um relatório, um JSON? Persista a versão bruta. Assim, no futuro, você pode fazer **quantas transformações quiser, sempre a partir da origem**. Descobriu que uma projeção foi calculada errada? Volta ao dado cru e refaz a transformação inteira. A reversibilidade fica garantida porque o original está sempre lá. (Teve também a leitura bem-humorada da "esteira de sushi", em que dados de vários tipos vão entrando sem categorização rígida, e, no fundo, as duas imagens se encaixam.)

Daí saem as duas figuras clássicas:

- **Data Lake**: mais livre, schema-on-read, guarda qualquer coisa (arquivos, JSON, o que for). É onde o dado cru mora.
- **Data Warehouse**: mais estruturado, fácil de consultar para BI e análise de negócio (pense num Power BI conectado fazendo *queries* complexas).

### Por que centralizar?

Um ponto sutil mas importante: por que os dados analíticos tendem a ser **centralizados**? Porque num cenário distribuído, com vários microsserviços e vários bancos operacionais, **agregar informação cross-domínio é difícil**. Cada serviço tem seu banco; mas o data warehouse costuma ser **único**, e é exatamente ele que viabiliza perguntas que cruzam domínios diferentes da empresa.

---

## Quando o analítico vira operacional (e a dor começa)

Aqui a discussão esquentou e rendeu um dos melhores trechos da noite.

O Data Lake parece perfeito: todas as bases a um `SELECT` de distância. Até que alguém de negócio aponta para lá e fala *"mas o dado está bem aqui, ó"*, e começa a usar o data warehouse como **base operacional, para consulta em tempo real**. Quando você vê, o DW virou a fonte da verdade de toda a empresa, e aí começam as dores. Aquele banco, que existe para consultas pesadas, passa a impactar diretamente a aplicação do outro lado, porque os dois sistemas têm demandas opostas competindo entre si. **É o problema que gerou a separação, refeito ao contrário.**

E por que isso acontece tanto? Muitas vezes por uma **divisão errada de microsserviços**: o serviço não tem os dados que deveria ter, ninguém quer "duplicar dado porque é muita informação", e quando você percebe não tem microsserviço, tem um **monolito distribuído** com o DW fazendo papel de banco operacional.

### ETL reverso: o bom e o mau

Existe o movimento legítimo de levar dados **do warehouse de volta para a aplicação**, e a turma separou bem os dois casos:

- **Bom**: a parte transacional gerou muito dado, o analítico trabalhou em cima dele e devolveu algo útil, como um **modelo treinado para detectar fraude**, ou um modelo de recomendação do tipo "quem comprou isso também, usualmente, compra aquilo". O *output* da camada analítica pode se tornar um artefato incluído e usado na camada operacional.
- **Mau**: usar o warehouse como **atalho** porque dá menos trabalho. Isto com certeza vai gerar problemas adiante.

### A defesa: engenharia forte

A conclusão prática foi quase unânime: esse tipo de aberração nasce quando **falta engenharia forte** para segurar a barra. Quando quem não entende de engenharia começa a dar pitaco ("tem gráfico? então vira BI, joga dentro do sistema operacional"), você usa a ferramenta errada no lugar errado, achando que tudo é prego e tudo é martelo. Produto quer entregar valor e cobrar por isso; é papel da engenharia explicar, com embasamento (e às vezes escalando politicamente), por que aquela fonte de dados **não pode** alimentar o operacional. Não é fácil, mas é o trabalho.

---

## Nuvem vs. self-hosting: o capítulo que "envelheceu mal"?

Esse tópico gerou um bom debate, inclusive sobre se o capítulo já nasceu datado.

Um lado argumentou que **envelheceu mal**: a regra histórica era "a nuvem começa barata e termina cara; servidor próprio começa caro e termina barato". Só que hardware hoje está caro. O resultado é que infra própria **começa cara e termina cara também**, ou seja, a comparação mudou em relação a alguns anos atrás.

O contraponto foi igualmente forte: essa visão olha o mundo pela **lente de sistemas web, escaláveis e online**. Mas ainda existe (e é forte) todo um universo de **chão de fábrica, sensores e sistemas internos** que não são públicos e não rodam na nuvem *by design*. Some a isso restrições de **compliance e regulação**, em que a empresa simplesmente **não tem escolha** a não ser self-hosting. Às vezes o self-hosting sai mais barato, às vezes viabiliza uma certificação que mantém a empresa competitiva.

Alguns vetores que apareceram para guiar a decisão:

- **CapEx vs. OpEx**: comprar servidor é CapEx alto e OpEx menor; a nuvem inverte: CapEx quase zero, OpEx maior ao longo do tempo.
- **Know-how e ociosidade**: nem toda empresa tem gente para atualizar SO, trocar hardware que se degrada em ~2 anos, manter time de infra. Recurso ocioso e máquina desatualizada custam.
- **Estabilidade da carga**: se a carga é linear, sem picos, talvez você **não precise** da elasticidade da nuvem, e on-premise faz sentido.
- **Capacity planning**: o ponto não é só o tamanho da empresa, é a capacidade de **crescer rápido**. Carga estável e pequena? Faz em casa, bem feito, e sustenta. Precisa escalar do dia para a noite? A nuvem brilha.

### "Construir o seu ouro": build vs. buy

Surgiu um exemplo concreto e revelador: empresas grandes que tentaram **reinventar a roda** montando suas próprias plataformas de dados com open source (Spark, e companhia) e agora querem **rollback** para um produto gerenciado mais "redondo", porque não tinham especialistas para segurar a estrutura quando dava problema.

Do outro lado, o movimento inverso: organizações que crescem tanto numa plataforma gerenciada (tipo Databricks) que o **custo explode** e passa a compensar internalizar, contratar gente de altíssimo nível e construir o próprio. Bancos, por exemplo, não gostam de "dividir o ouro": quando os dados viram ativo central, faz sentido trazer tudo para dentro.

A síntese: **não existe certo ou errado, existem momentos diferentes.** Uma empresa de longo prazo fica trafegando entre *build* e *buy* a vida inteira. Saber se adaptar é a habilidade.

### O espectro IaaS → PaaS → SaaS e o conceito de "core"

A famosa tabela **[on-premise → IaaS → PaaS → SaaS](https://cloud.google.com/learn/paas-vs-iaas-vs-saas)** (passando por FaaS, DBaaS e companhia) é menos sobre decorar siglas e mais sobre entender um **espectro**:

- Quanto mais à **esquerda** (bare metal, on-premise tradicional), mais controle, e mais responsabilidade (atualizar SO, trocar hardware, dimensionar demanda).
- Quanto mais à **direita** (SaaS), menos controle e menor investimento inicial, você delega para quem entende do negócio.

E a verdade é que **toda empresa grande vive um misto**: VMs aqui, funções ali, um SaaS integrado acolá. O critério que amarra tudo isso é o conceito de **core**, e aqui o capítulo cruza lindamente com **DDD**: o que **não é** seu core, empurre para a direita do espectro (menos controle, baixo investimento, joga na nuvem). O que **é** seu core merece atenção, investimento e, às vezes, infra própria. (É plausível, por exemplo, que uma empresa cujo core é guardar dados de clientes desenvolva tecnologia própria tão boa que prefira **não** deixá-la na nuvem, seja por custo, segurança ou porque virou produto que ela mesma vende.)

---

## Tudo é distribuído (basta confiar na rede)

Um dos insights mais elegantes do capítulo: **no momento em que você confia na rede, já tem um sistema distribuído.** Não precisa de microsserviço nenhum. Aplicação de um lado, banco de dados do outro, conversando por rede: pronto, você já está sujeito a falha de partição. E hoje em dia é raríssimo, em ambiente profissional, ver aplicação + banco rodando juntinhos numa única VM. O banco numa VM ao lado **já** é rede no meio.

Isso puxa o **teorema CAP**: a **partição** é a parte com que você não consegue fazer muita coisa: é rede, e se a rede falhar, falhou.

Veio também uma das imagens mais bonitas da noite, parafraseando o próprio livro: **a internet foi tão bem feita que as pessoas a enxergam como algo natural** (quase como o Oceano Pacífico) em vez de algo construído por humanos. A gente nem cogita que a rede pode cair e derrubar tudo. Por baixo dos panos, porém, tem pacote falhando, retry rolando solto, servidor caindo, só que é tudo tão bem amarrado que não vemos.

E é por aí que o capítulo nos lembra de **apreciar as abstrações**. Conceitos que tomamos como resolvidos (CPU, memória, banda, pacotes, TCP/UDP, HTTP) são camadas e camadas de engenharia que a gente nem pensa mais. Fica a provocação: *você já agradeceu seu framework hoje?* Vai lá traduzir pacote TCP na mão, transformar em HTTP, resolver a rota e chamar seu código, depois reclama que o framework é opinativo demais. É a abstração do carro: você gira a chave, quer que o motor ligue e o carro ande; o resto fica embaixo do capô.

O alerta que fecha o tema: **distribuído parece mais simples hoje** por causa da familiaridade e das abstrações, mas adotar distribuído é **comprar um pacote de problemas** (retry, timeout, tratamento de falha) que você não tem quando a memória vai direto de um processo para o outro.

---

## Um nó só, às vezes, ganha

Contraintuitivo, mas verdadeiro: **uma única máquina pode ser muito mais rápida que vinte máquinas horizontais**, dependendo do que você faz. A gente tem o vício de "ir colocando máquina, colocando máquina" quando, às vezes, **reduzir** traria benefício.

- Em sistemas de **baixíssima latência** (um sistema de trading, por exemplo), um **single thread** pode bater o multi thread, porque o custo de a CPU coordenar paralelismo não compensa quando você controla até o nível do core.
- **Rede é sempre gargalo.** Não importa quão perto estejam os servidores; na nuvem, você nem sabe ao certo *onde* eles estão. Você nunca terá a latência de dentro da própria CPU. (Aqui vale resgatar o exercício de *back-of-the-envelope estimation*: o custo de um byte no cache, na CPU e na rede é de ordens de grandeza diferentes.)
- **Escala vertical tem teto.** Em algum ponto, adicionar memória fica caríssimo, e pode até **piorar**. Um exemplo real contado na conversa: uma máquina com 64 GB de RAM que, ao receber 120 GB, ficou *mais lenta*, porque passou a depender de swap para o resto. Memória, CPU e rede de um nó só sempre vão topar em algum limite.

A analogia que ficou: é mais fácil fazer um carro simples correr mais rápido ou um Ferrari topo de linha?

---

## Serverless e microsserviços: separando o conceito da pegadinha

**Serverless** era para ser "sem servidor"; virou, no fim, **pagar sob demanda / por uso**. Banco serverless: você paga pelo processamento que usa. Lambda: você paga pelas vezes que ela roda, vezes tempo, vezes memória/CPU. Conceitualmente, é elegante: você é cobrado apenas pelo **trecho de código** que rodou, quando rodou. É "vender o tempo ocioso do processador", e isso faz todo sentido para quem oferece.

Mas veio o contraponto sincero: serverless também é uma **pegadinha**. É como a promoção da picanha pela metade do preço: você entra por causa dela e sai com o carrinho cheio de coisa cara. O princípio é rodar **em momentos pontuais, sob demanda**; mas é comum ver gente quebrando tudo em "nanosserviços" que ficam rodando 100% do tempo (um serverless para Pix que está girando o tempo inteiro já fere o princípio). E o custo real costuma estar **em volta**: para conectar numa função você acaba pagando o secret manager, a observabilidade (um CloudWatch da vida), o gateway... Te dão um milhão de lambdas "de graça" e cobram o rim no entorno.

Tem ainda o paradoxo do **cold start**: para a função responder rápido, você liga *provisioned concurrency* / instâncias provisionadas, mantém tudo "quente" o tempo todo e, no fim, **voltou a ser servidor**. Uma falsa sensação de engenharia sofisticada.

### Microsserviço escala equipes, não tecnologia

O ponto que mais ressoou: **microsserviços foram criados para escalar equipes, não para resolver problema técnico.** É um problema de **pessoas** que resolvemos de forma técnica. Quem já tentou colocar vinte equipes cuidando de um monolito sabe a dor: agendar quem sobe deploy primeiro, esperar dias para ver se não quebra, descobrir que o que quebrou era "o de menor risco". Microsserviço veio dar a essas equipes a chance de escalar **rápido e independente**.

E é exatamente aí que mora um ótimo **termômetro de maturidade**: se, para entregar uma feature no *seu* serviço, você precisa **alinhar roadmap com quatro ou cinco outras equipes**, a independência que justificava os microsserviços evaporou. Virou um Tetris de roadmap.

O irmão gêmeo do problema é o **distribuído falso**: o "monolito distribuído", distribuído **sem resiliência**. Se cair um serviço e cair o sistema inteiro, você só aumentou a sua superfície de falha. **Distribuído tem que ser distribuído com resiliência**; senão, vá de nó único, que resolve o seu problema: se cai, cai tudo; se está de pé, está tudo de pé.

### Nem tudo é ciência de foguete

Um tempero saudável de ceticismo fechou o tema. Muita coisa que a gente imagina ser "do outro mundo" é, na real, **simples**: a diferença é que alguém teve coragem de fazer acontecer. Isolamento multi-tenant que parece um inferno de gerenciar pode ser, no fundo, um campo com o `id` do usuário replicado por containers. E muito do que está em produção por aí é mais **gambiarra** do que obra de arte (o caso citado: um serviço de *streaming* que era, por baixo, um *service bus* falando protocolo de Kafka).

Isso não é elogio à bagunça, é reconhecimento de que **validar a hipótese pela via mais simples** é, muitas vezes, a melhor engenharia. Soltar o produto "mascarado", ver se tem demanda e gente pagando, e *depois* investir em fazer redondo. A fronteira entre "gambiarra" e "decisão consciente" é uma só: **conhecer o trade-off**. A diferença entre júnior e sênior não é não errar, é **saber quando está fazendo o atalho e por quê**. O perigo mora em fazer errado sem saber, e ficar perdido quando dá ruim. Como diz o início do livro: trade-off é você **saber**. Se você só enxerga vantagens, tem algo escondido ali.

E, para fechar com um clássico de praticidade: **spot instances**, ou seja, leilão de máquina ociosa, bem mais barata, mas que pode cair a qualquer momento. Ótima para *jobs* que toleram interrupção; para APIs que precisam responder, mantenha um percentual de máquinas garantidas fora do modelo spot. (Fargate trabalha numa linha parecida.)

---

## Dados e sociedade: o capítulo cresceu

A parte final do capítulo é a que mais mudou em relação à primeira edição, e trata de algo que engenharia antigamente ignorava: **responsabilidade social e privacidade**. Tecnologia hoje é tão intrínseca à sociedade que pode mudar hábitos e (exemplo em alta) até influenciar eleições conforme o algoritmo de uma rede social. Com isso entram GDPR, **LGPD**, CCPA e o **direito ao esquecimento**.

E aí mora uma tensão deliciosa de engenharia: muitos sistemas foram construídos pensando em **imutabilidade** (eventos, logs, Kafka), e depois veio uma lei dizendo que o usuário pode **pedir para apagar os dados**. Como apagar de um log imutável? Algumas estratégias discutidas:

- **Não persistir o dado sensível** no evento; guardar só um `id`/referência.
- **Crypto-shredding**: uma **chave de criptografia por usuário**. O dado trafega e repousa criptografado; quando o usuário quer ir embora, você **apaga a chave privada** e o dado vira lixo anonimizado para sempre. Elegante, mas com trade-offs reais: precisa criptografar/descriptografar muitas vezes (cache, latência conforme o volume) e ainda tem o problema dos **backups** (como garantir que a chave sumiu de todas as cópias?).
- **Anonimização / desassociação**: muitas vezes "esquecer" não é deletar tudo, é **desassociar a pessoa do dado**. Numa instituição financeira, a transação **não pode** sumir (o *general ledger* precisa continuar consolidado, e há leis que obrigam a guardar por anos), o que se apaga é o vínculo com a pessoa física.

Dois princípios atravessaram a discussão:

1. **Data minimization vs. Big Data.** O instinto histórico do Big Data é "guarde tudo, em algum momento a gente tira ouro disso". As leis empurram para o lado oposto: **guarde só o que você realmente precisa**. Por que perguntar a idade da pessoa se você não vai usar? É um ideal em tensão eterna com a realidade (todo mundo guarda tudo) e com a briga clássica entre **UX** (quer o cadastro mais simples) e **Segurança** (quer o mínimo de exposição).

2. **Consentimento *e* finalidade.** Não basta a pessoa consentir com a coleta de um dado; você só pode usá-lo para o **propósito declarado**. Coletou a idade para uma análise preditiva específica? Legalmente, não pode reaproveitar o mesmo dado para outra finalidade. (Na prática, nem toda empresa cumpre, e todo mundo tem um palpite de quais.)

O exemplo que fez a sala parar foi o de um **app de mobilidade**: guardar para onde a pessoa foi pode virar um problemão se esse dado vazar: pense em alguém que foi a uma clínica em uma situação sensível, ilegal ou estigmatizada em certos lugares. Conclusão de design: às vezes você **nem precisa** desse dado. Quer saber *quantas* pessoas fizeram tal rota? Colete a contagem sem **linkar à entidade**. O melhor dado pessoal é o que você decidiu **não guardar**.

E há o pano de fundo incômodo: parte das empresas simplesmente **assume o risco da multa** ("se der ruim, a gente paga"), porque fiscalizar milhões de empresas é quase impossível. Pior ainda quando há **leis conflitantes** (uma obriga a reter, outra obriga a apagar) e você precisa decidir qual prevalece. Tudo isso deveria estar previsto desde a **modelagem do sistema**, não remendado depois.

---

## O fio que costura tudo: trade-offs conscientes

Se há uma lição única que atravessa todos esses temas (OLTP vs. OLAP, lake vs. warehouse, nuvem vs. on-premise, distribuído vs. nó único, serverless, privacidade), é a frase de abertura:

> **Não existem soluções, só trade-offs.**

Toda decisão tem um lado bom *e* um lado ruim. Se você só enxerga benefícios, provavelmente ainda não achou o custo escondido. Engenharia sênior não é evitar o atalho, é **escolher o atalho sabendo exatamente o que está pagando por ele**.

### Trade-offs recorrentes (para consultar depois)

| Decisão | De um lado | Do outro lado |
|---|---|---|
| OLTP vs. OLAP | Latência baixa, muita escrita, leitura pontual | Agregação pesada, tolera espera, varre tudo |
| Caminho do meio (view materializada/read replica) | Simples, atende por mais tempo | Não substitui stack analítica dedicada na escala |
| System of record vs. derivado | Fonte da verdade, proteja | Reconstruível, pode descartar |
| Data Lake (raw) vs. Warehouse | Flexível, schema-on-read | Estruturado, fácil para BI |
| Nuvem vs. self-hosting | CapEx ~0, elástica, OpEx maior | CapEx alto, controle, compliance, OpEx menor |
| Distribuído vs. nó único | Escala e isolamento | Sem rede no meio, menor latência, menos problemas |
| Serverless | Paga pelo uso, conceito elegante | Custo no entorno, cold start, vira servidor se mal usado |
| Guardar dado vs. minimizar | Mais "ouro" potencial | Menos risco legal e de vazamento |

---

## Quer participar do próximo?

Este foi só o **Capítulo 1**. Os encontros acontecem *a cada quinze dias**.

O clube é aberto, descontraído e feito **da comunidade para a comunidade**: sem aula, sem cobrança, só gente que vive esses problemas trocando ideia (e cicatrizes de produção). Não precisa ter lido tudo nem ser especialista.

👉 **Participe do Clube do Livro:** [Designing Data-Intensive Applications da comunidade Craft Code Club](https://craftcodeclub.io/book-club/designing-data-intensive-applications)

Traga sua leitura, suas discordâncias e seus exemplos. A melhor parte nunca está só no livro, está na conversa em cima dele.

---

### Referências

**O livro**

- **Designing Data-Intensive Applications**, Martin Kleppmann e Chris Riccomini (2ª edição). Capítulo 1: *Trade-offs in Data Systems Architecture*. [Site oficial](https://dataintensive.net/).

**Gravação do encontro**
- [Assista no YouTube](https://youtu.be/53TFZSe-IGw)


**Links compartilhados na discussão**

- [Quadro da discussão (Excalidraw)](https://link.excalidraw.com/l/ADMgGFVWISx/9G9VQCCv2rL)
- [The Sushi Principle](https://www.datasapiens.co.uk/blog/the-sushi-principle) (*raw data is better than cooked data*)
- [Postgres for Everything](https://postgresforeverything.com/) · [artigo no amazingcto](https://www.amazingcto.com/postgres-for-everything/)
- [PaaS vs. IaaS vs. SaaS](https://cloud.google.com/learn/paas-vs-iaas-vs-saas) (Google Cloud)

**Para aprofundar (conceitos citados)**

- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) (Martin Fowler)
- [CQRS](https://martinfowler.com/bliki/CQRS.html) (Martin Fowler)
- [Teorema CAP](https://en.wikipedia.org/wiki/CAP_theorem)
- [Crypto-shredding](https://en.wikipedia.org/wiki/Crypto-shredding)
- Outros termos para pesquisar: HTAP, Data Lakehouse, CapEx/OpEx, Spot Instances, back-of-the-envelope estimation, LGPD/GDPR/CCPA.
