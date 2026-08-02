---
title: "O modelo de dados muda como você pensa: o Capítulo 3 de DDIA"
date: "2026-07-27"
description: "Notas dos dois encontros do Clube do Livro da comunidade Craft Code Club sobre o Capítulo 3 de Designing Data-Intensive Applications (2ª edição): relacional vs. documento, normalização, ORM e impedance mismatch, esquemas analíticos (star schema, One Big Table, arquitetura medalhão), bancos de grafos e Cypher, GraphQL, event sourcing e dataframes."
topics: ["System Design", "Clube do Livro"]
keywords:
  [
    "DDIA",
    "Designing Data-Intensive Applications",
    "Martin Kleppmann",
    "Modelo de dados",
    "Modelo relacional",
    "Banco de documentos",
    "Normalização",
    "Desnormalização",
    "Schema-on-read",
    "Schema-on-write",
    "ORM",
    "Impedance mismatch",
    "CQRS",
    "Data Warehouse",
    "Star Schema",
    "Snowflake Schema",
    "One Big Table",
    "Arquitetura Medalhão",
    "Crypto-shredding",
    "Banco de grafos",
    "Neo4j",
    "Cypher",
    "Index-free adjacency",
    "RDF",
    "SPARQL",
    "GraphQL",
    "Event Sourcing",
    "Write-ahead log",
    "Dataframes",
  ]
authors: []
---

_Este post é um resumo da discussão dos dois encontros do Clube do Livro da comunidade [Craft Code Club](https://craftcodeclub.io/book-clubs/designing-data-intensive-applications) sobre o Capítulo 3 de Designing Data-Intensive Applications: "Data Models and Query Languages"._

O Capítulo 3 rendeu tanto que a turma precisou de duas noites para fechar. Na [Parte 1](https://www.youtube.com/watch?v=56Vb5r5HjfQ) ficamos no chão de fábrica do dia a dia: relacional, documento, normalização, ORM e relações N:1 e N:N. Na [Parte 2](https://www.youtube.com/watch?v=ofCUEWI6aPc), subimos para o analítico, mergulhamos em grafos, passamos por GraphQL, event sourcing e terminamos em dataframes e machine learning. Este post junta as duas conversas em um fio só. Os dois encontros giraram em torno do mesmo [quadro no Excalidraw](https://link.excalidraw.com/l/ADMgGFVWISx/4HF9psGkCyZ).

A frase que abre o capítulo e que guiou a noite inteira veio logo no primeiro minuto:

> _O modelo de dados é a parte mais importante do desenvolvimento de software, porque ele afeta como a gente pensa na solução do problema._

Não é sobre qual banco vence. É sobre **qual pergunta o seu sistema precisa responder**.

---

## Camadas em cima de camadas

A abertura do capítulo é uma daquelas ideias simples que reorganizam a cabeça: **aplicações são camadas de modelos de dados construídas sobre outras camadas de modelos de dados**.

Você tem o mundo real (pessoas, produtos, ações). Isso vira estrutura de dados e API na sua aplicação. Isso vira modelo relacional, documento ou grafo. Isso vira tabelas, registros, vértices e arestas. Isso vira bytes em memória, em disco e na rede. E isso, lá no fim, vira corrente elétrica, pulso de luz e campo magnético.

E **cada camada esconde a complexidade da anterior**. Quando você lida com um JSON, não está pensando em como o sistema operacional busca aquele bloco no disco. Quando escreve um `SELECT`, não está pensando em qual algoritmo de junção o motor escolheu. É a mesma apreciação pelas abstrações que apareceu no [Capítulo 1](https://craftcodeclub.io/posts/ddia-trade-offs-arquitetura-de-sistemas), agora aplicada a dados.

Um ponto que atravessou toda a conversa: **o comportamento da aplicação muda o tempo todo, mas os dados ficam**. A aplicação pode ser reescrita três vezes em dez anos; os dados que estão lá continuam sendo os mesmos dados. Por isso modelar bem é tão desproporcionalmente importante.

Alguém trouxe uma analogia que ficou: pense em como você organiza os objetos da sua mesa de trabalho. O que você usa toda hora fica à mão; o que você usa uma vez por ano está numa caixa fechada no armário. Modelo de dados é isso, só que para o seu **padrão de acesso**.

---

## Declarativo, imperativo e o otimizador que ninguém vê

Um trecho do capítulo que quase passa batido rendeu uma boa discussão: **linguagens de consulta declarativas**.

- Em uma **linguagem declarativa**, você diz **o que** quer, quais são as regras e as transformações. Não diz como buscar.
- Em uma **linguagem imperativa**, você diz **como**: qual algoritmo de busca, qual ordenação, em que ordem.

A vantagem do declarativo não é só sintaxe mais curta. É **esconder detalhes de implementação**. Se o Postgres lançar uma otimização nova no motor de busca, a sua query continua igual e simplesmente fica mais rápida. Se o banco quiser paralelizar aquilo entre CPUs ou máquinas, ele paraleliza, e você não escreve uma linha a mais.

Veio a pergunta certeira: isso é coisa só de banco relacional?

A resposta foi não, e ela vale para todo mundo:

- No **MongoDB** existe o _aggregation pipeline_, com plano e otimização de consulta.
- O **Spark** não é banco, é engine de processamento, e também tem plano de execução.
- Até o **Redis** tem sua camada de índices e otimização.

O paralelo mais bonito veio dos compiladores: qualquer linguagem, compilada ou interpretada, tem uma etapa de otimização antes de virar código de máquina. É razoável supor que qualquer SGBD sério tenha o equivalente disso para consultas.

E, no fundo, isso reforça o que a turma repetiu a noite inteira:

> Um banco de dados nada mais é do que um **conjunto muito sofisticado de estruturas de dados e algoritmos**, com uma interface bonita e amigável na frente.

A linguagem de consulta é o **contrato público** desse conjunto. É exatamente como uma API: você otimiza do seu lado, o cliente do outro lado não muda nada.

---

## Relacional: mais velho e mais complexo do que parece

O modelo relacional foi proposto por **Edgar F. Codd em 1970**, popularizou-se nos anos 80 e reinou praticamente sozinho por trinta anos, até a onda **NoSQL de 2010** balançar a hegemonia. Modelos de rede, hierárquicos, orientados a objeto e baseados em XML tentaram, mas nenhum emplacou.

Uma curiosidade que agradou a plateia: o "relacional" do nome **não vem** de "tabelas se relacionam". Vem da **álgebra relacional**. O que a gente chama de tabela é, formalmente, uma _relação_, e o que a gente chama de registro é uma _tupla_. As formas normais de Boyce-Codd que a gente decorou na faculdade vêm daí.

E um lembrete honesto: o banco relacional é **um dos softwares mais complexos que existem**, e a maioria das pessoas usa ele só com as configurações padrão. No dia em que você precisa entender transação atômica, níveis de isolamento e durabilidade de verdade, a coisa fica complexa muito rápido.

A grande vantagem que ninguém discutiu foi o **ACID**: atomicidade, consistência, isolamento e durabilidade. Quando várias entidades conversam entre si e você precisa garantir que ou tudo é salvo ou nada é, você **tira essa complexidade da aplicação e delega para o banco**. Em bancos não relacionais, esse controle costuma voltar para o seu código.

Mas ficou o alerta: escolher relacional **não te dá modelagem boa de graça**. Nada impede alguém de criar uma tabela única com trezentas colunas e chamar aquilo de modelo relacional.

---

## Relacional vs. documento: consistência de um lado, localidade do outro

O exemplo que a turma construiu ao vivo foi ótimo por ser banal.

Você tem pessoas e a região delas.

- **Relacional**: tabela `pessoa` e tabela `regiao`, com join. Se amanhã "Rio Grande do Sul" precisa virar "RS", você muda **em um lugar só**. Precisa traduzir para outro idioma? Um lugar só.
- **Documento**: cada documento carrega a região dentro dele. Um documento tem "Rio Grande do Sul", outro tem "RS", e a inconsistência entra pela porta da frente. Para atualizar, você percorre todos os documentos.

O ganho do documento é o que o livro chama de **localidade**: você faz um lookup só, na infraestrutura, e traz o objeto inteiro. Sem join, leitura mais barata.

O ganho do relacional é **consistência e flexibilidade de consulta**. E aqui apareceu um critério prático muito bom para decidir:

> Se você **sabe** exatamente qual vai ser a projeção, o documento tende a servir bem. Se você **não sabe** de quantas direções vão te perguntar, o relacional te dá a versatilidade.

Num banco de documentos, a consulta normalmente parte do documento raiz para dentro. Se você precisa entrar por qualquer dimensão (usuário para compras, compras para usuário, e por aí vai), o relacional é mais dinâmico.

E veio um complemento importante: no relacional, dependendo do caso, **o dado já pode estar no próprio índice**. Você resolve a consulta na busca do índice e nem chega no disco de dados.

### Schema-on-write e schema-on-read

O livro dá nome a um fenômeno que todo mundo já viveu sem saber nomear:

- **Schema-on-write**: o esquema é imposto pelo banco na escrita. Equivale a uma linguagem estaticamente tipada, em que o código precisa compilar.
- **Schema-on-read**: o dado é salvo com mais flexibilidade e o esquema é interpretado na leitura. Equivale a uma linguagem dinâmica, em que a checagem acontece na execução.

A observação afiada da turma: **"schemaless" é um nome ruim**. O esquema existe, ele só não está no banco. Ele está na sua aplicação, no momento em que você lê `firstName` e espera uma string. Se o dado mudar, o banco não explode. **Explode a aplicação.**

Isso puxou uma ponta interessante: a **programação orientada a dados**, em que você não hidrata a entidade inteira, só verifica e transforma as propriedades de que precisa. É uma forma de reduzir o acoplamento com a forma exata do dado.

---

## Quando a escala destrói o by the book

Uma pergunta veio pelo chat do YouTube e mereceu parada: **quando vale a pena não modelar pelo domínio, por questão de otimização?**

A resposta que a comunidade já repetiu em capítulos anteriores voltou aqui:

> **A escala destrói sonhos.**

O consenso ficou mais ou menos assim: em aplicações de alta escala, o **DDD estratégico continua intacto**. Os limites de contexto, a linguagem ubíqua, a divisão do domínio: nada disso cai por causa de performance. Já o **DDD tático é negociável**. As entidades continuam existindo conceitualmente, na comunicação do time, mas o código e o banco podem não refletir aquilo linha a linha.

O próprio livro dá o exemplo perfeito no estudo de caso da rede social: a **view materializada do feed carrega só os IDs**. Esse conceito não existe no domínio. Ele existe porque a leitura precisa ser barata.

Dois complementos amarraram bem:

- Isso é exatamente o **impedance mismatch**: o modelo do domínio e o modelo relacional são coisas diferentes por natureza, e não há problema nisso.
- Existem padrões para isolar essa diferença. O **repository pattern** é o mais óbvio: em aplicações com carga alta, você foca a estrutura no banco (onde está o ganho) e abstrai numa caixinha separada como busca e como grava.

E um contraponto elegante veio de quem ainda estava se acostumando com a ideia: o impulso de aprender algo e querer aplicar é natural, mas esse é o **solution space**. O exercício mais útil é migrar para o **problem space**: quais problemas essa ferramenta resolve? A hora certa de usar tende a aparecer sozinha; o que você precisa é ter a caixinha bem munida quando ela aparecer.

---

## ORM: o assunto que rendeu réplica e tréplica

Nenhum tema esquentou tanto quanto ORM. Vale registrar os dois lados, porque os dois estavam certos.

O autor lista prós e contras, e a turma acertou praticamente todos antes de ver a lista:

**Contras**

- ORMs são complexos e **não escondem completamente** a diferença entre os modelos. O Django tem ferramenta para resolver N+1, mas você precisa saber que o N+1 existe.
- Podem gerar consultas ineficazes na tradução.
- São, na prática, ferramentas de **OLTP**. Não existe ORM para carga analítica.
- Funcionam com bancos relacionais. O "R" está no nome.

**Prós**

- Você não escreve SQL bruto para o caminho feliz.
- **Change tracking**: o Entity Framework sabe qual campo mudou e monta o update.
- **Unit of Work**: ou salva tudo, ou não salva nada.
- Cache de resultado de consulta, muitas vezes sem você saber.
- Gestão de **migrations**.
- Em query dinâmica (aquela que muda conforme o parâmetro), o SQL gerado sai bem formado e você escreve muito menos código.

O melhor momento do debate foi uma provocação e a frase que a respondeu:

> Se o ORM virou o seu problema, é porque você está espremendo a ferramenta além do que ela foi feita para fazer.

> **Quando a ferramenta é o problema, não é a ferramenta que é o problema.**

O exemplo concreto: gente resolvendo carga analítica com ORM transacional. A consulta fica macarrônica, você atropela o ORM com SQL customizado, joga o resultado de volta na hidratação e ainda culpa a ferramenta. O problema não era o ORM, era estar **resolvendo problema de OLAP com estrutura de OLTP**.

Outros aprendizados que saíram da conversa:

- **O caminho do meio existe.** Os _micro-ORMs_ (Dapper no .NET, por exemplo) fazem só o mapeamento do resultado para o objeto e devolvem o controle da query para você. Muita gente migrou do Entity Framework para Dapper exatamente para ficar em cima dos índices e do plano de execução.
- **Lazy load** não é ruim por natureza, mas é a origem clássica do N+1 quando alguém itera sobre a coleção sem eager load.
- Existem dois padrões dominantes: **Active Record** (o objeto sabe se persistir, como o Eloquent no PHP) e **Data Mapper** (um gerenciador central sabe persistir, como o Doctrine).
- A maior libertação para muita gente foi abandonar o **database centric**: uma tabela não precisa ter um objeto equivalente. Um objeto de domínio pode escrever em uma, duas ou meia tabela.
- E o irmão dessa ideia: não esprema o ORM para hidratar uma entidade completa quando você só quer ler. Crie um **DTO / read model** com projection e deixe a query complexa escondida na implementação do repositório.
- Por fim, conhecer o ORM não basta. Às vezes está lento e **um índice resolve**. Ou um vacuum. O ORM só estava carregando a culpa do banco.

---

## Relações N:1, N:N e a obsessão por normalizar

Aqui o capítulo fica prático.

Em uma relação **um para muitos**, o documento se sai muito bem: você busca o perfil inteiro em um acesso só. O livro usa o exemplo de um perfil estilo LinkedIn, e a árvore de JSON cai como uma luva, porque **um documento é literalmente uma árvore**: cada subdocumento é mais uma ramificação.

Em uma relação **muitos para muitos**, o documento começa a sofrer. O exemplo do livro: uma empresa tem vários funcionários, e um funcionário passou por várias empresas. No relacional, você tem a tabela de junção. No documento, você acaba com o **link de ida e volta duplicado** nos dois lados, e a manutenção vira um problema.

E quando a árvore começa a virar um **grafo** grande de verdade, aí nem o documento nem o relacional se sentem em casa. É exatamente o gancho para a segunda noite.

Mas antes disso veio uma provocação que virou um dos melhores debates:

> Existe uma **obsessão por normalização**.

Vale mesmo a pena criar uma tabela só para endereço? Só para cargo? A justificativa histórica da normalização era o **custo de armazenamento**, que era caríssimo. Hoje o armazenamento é barato, e o **tempo de processamento do join** costuma custar mais do que o dado repetido.

O critério prático que apareceu foi ótimo: olhe a **cardinalidade**. Estado tem cardinalidade baixa e muda raramente? Talvez não precise de tabela. Combine isso com a **frequência de modificação** e você tem uma decisão informada, não um reflexo.

E ficou o alerta na direção contrária: **normalizar demais também tem preço**. Se uma consulta importante do e-commerce precisa de doze joins, e a carga é 70% ou 80% de leitura, você está pagando processamento à toa em todo request. Prepare o modelo para o padrão de acesso que você tem.

Isso desemboca naturalmente em **CQRS**, e aqui veio o recado mais pragmático da noite:

> Para fazer CQRS de verdade você **não precisa de dois bancos diferentes**.

Pode ser o mesmo Postgres, o mesmo SQL Server. Um lado modelado para escrita, com atomicidade e validação; outro lado achatado, materializado, preparado para leitura rápida. O que descaracteriza CQRS não é usar um banco só, é **ler e escrever com o mesmo modelo**.

---

## O autor desconstrói tudo no fim (de propósito)

Um dos comentários mais perspicazes da noite: o capítulo constrói o trade-off entre relacional e documento com cuidado, e aí, no final, meio que derruba tudo. Os bancos modernos são **híbridos**. O relacional já tem suporte a JSON. O documento já tem transação. Você fica com a sensação de "então tanto faz?".

A leitura da turma foi que a desconstrução é **intencional**. A pergunta que sobra não é "qual banco", é:

> **Qual é o seu padrão de leitura e de escrita?**

E o Postgres virou o símbolo dessa conversa. Ele é o camaleão: relacional, documento dentro da relação, mecanismos de cache, busca vetorial via extensão, e _property graph_ chegando na versão de setembro. O que apareceu no chat resume bem:

> _Ninguém nunca foi demitido por escolher Postgres._

O que **não** significa "sempre Postgres". Significa: comece simples, prove a necessidade, e evolua quando a dor aparecer. Como alguém colocou, o Google já refez a caixinha de busca uma dezena de vezes, arquitetura inteira remontada. Não se apegue.

---

## A virada analítica: warehouse, star schema e One Big Table

Na segunda noite, a conversa mudou de lado do sistema.

Quando você organiza dados para **OLTP**, quer transacionar: escrita e leitura frequentes, consultas **previsíveis** (afinal, elas estão no seu repositório), dado normalizado.

Quando organiza para **OLAP**, quer agregar: muito mais leitura do que escrita, dado desnormalizado e, o detalhe mais interessante, **consultas imprevisíveis**. Você não faz ideia da pergunta que o analista vai fazer amanhã.

Daí nascem as convenções de modelagem:

- **Tabela fato**: registra as ocorrências ao longo do tempo. Eventos de venda, por exemplo.
- **Tabela dimensão**: descreve as características de cada coluna do fato. O ID da loja e a descrição da loja.
- **Star schema**: o fato no centro, as dimensões ao redor, parecendo uma estrela. É o que viabiliza o _drill down_ e _drill up_ das ferramentas de análise.
- **Snowflake schema**: uma extensão do star, em que dimensões têm subdimensões, e o desenho começa a parecer um floco de neve.

Um ponto que vale gravar: **a tabela fato é desnormalizada por função**. Não é descuido. Ela é assim para facilitar filtro e agregação e evitar join. E, por isso mesmo, ela pode ter **centenas de colunas**.

O extremo dessa lógica é o **One Big Table**: junte tudo numa tabela só e evite join, porque join é caro computacionalmente em base grande. A dúvida óbvia é "mas não fica gigante com dado repetido?". Fica, e não é problema, porque os bancos analíticos **não armazenam como um OLTP**. Eles fazem mapeamento e compressão do valor repetido, guardam algo como um ID interno e ficam extremamente performáticos na leitura. O BigQuery trabalha assim, e a maioria dos data warehouses também.

### Arquitetura medalhão: bronze, prata, ouro (e às vezes diamante)

Uma dúvida honesta abriu um dos melhores trechos: onde entra a **arquitetura medalhão** do Databricks nessa história?

A resposta esclareceu bastante gente:

- Você extrai o dado do banco transacional e joga cru num storage barato (um bucket S3 da vida). Essa é a camada **raw**.
- Aí ele vai subindo por camadas: **bronze**, **prata**, **ouro**. Cada camada é um nível de tratamento, limpeza e enriquecimento.
- Quanto mais perto do ouro, mais perto de ser consumido por um dashboard ou por um modelo.
- Algumas empresas criam uma camada **diamante**, ainda mais curada do que a ouro.

E o esclarecimento que amarrou tudo: **o medalhão não concorre** com star schema, snowflake ou One Big Table. Ele é um **processo**, uma forma de organizar o pipeline em etapas. A modelagem (fato e dimensão, ou OBT) normalmente acontece na camada ouro. É como desenvolvimento de software: você tem a arquitetura e tem os patterns que aplica dentro dela.

Outro esclarecimento importante: **medalhão não é do Databricks**. Você aplica o mesmo conceito num DuckDB se quiser. É metodologia, não produto.

### Anonimização, hash e crypto-shredding

Uma confusão comum apareceu e virou aprendizado: **normalização e criptografia são coisas completamente diferentes**, e o que os times de dados costumam chamar de "criptografar na subida das camadas" é, na verdade, **anonimização**.

A camada bruta tem tudo, inclusive nome e CPF. Ao promover para as camadas analíticas, a boa prática é remover ou substituir o dado pessoal por um **hash**, para que engenheiros e cientistas de dados trabalhem só com o que importa para a análise.

E apareceu uma técnica mais elegante para o cenário de LGPD: o **crypto-shredding**. Em vez de anonimizar tudo (o que custa processamento e, em larga escala, deprecia), você mantém o dado criptografado com uma chave associada ao dono. Quando o usuário exerce o direito de exclusão, **você destrói a chave**. O dado continua fisicamente lá, mas se torna permanentemente indecifrável. Você trabalha o dado de ponta a ponta sem perder o que é importante para o tratamento.

### E o lembrete que salva produção

**Não consulte o banco transacional direto para analytics.** Uma consulta pesada pode derrubar o banco e, junto com ele, a aplicação. Use uma réplica, ou exporte o dado para um engine de processamento. Consulta pontual e básica, tudo bem. Trabalho analítico de verdade, não.

É exatamente a dor descrita no [Capítulo 1](https://craftcodeclub.io/posts/ddia-trade-offs-arquitetura-de-sistemas), agora vista pelo lado de quem constrói o pipeline.

---

## Grafos: quando a ergonomia vira performance

Essa foi a parte que mais dividiu opiniões na leitura. Muita gente achou o trecho frustrante por parecer preso demais à sintaxe. Foi preciso ir atrás de material extra para o clique acontecer.

### O básico, primeiro

Grafos são **nós** (ou vértices) conectados por **arestas**. E eles estão em todo lugar:

- A internet é um grafo: páginas são vértices, links são arestas. É daí que sai o **PageRank**.
- A rede em si é um grafo com peso, escolhendo o menor caminho para o seu pacote.
- Redes sociais, malha rodoviária, malha ferroviária, rotas aéreas.

E existem duas formas clássicas de representar um grafo, que a turma revisitou porque já tinham aparecido nos [encontros de algoritmos](https://craftcodeclub.io/topics/grafos):

- **Lista de adjacência**: um dicionário em que cada nó aponta para os nós a que se conecta (e, se houver peso, o custo dessa aresta). É a melhor estrutura para **percorrer** o grafo, porque o salto de um nó para o outro é O(1).
- **Matriz de adjacência**: uma matriz bidimensional de todos contra todos, com 1 onde há relação e 0 onde não há. É ineficiente em espaço (você gasta memória para dizer que **não** existe relação), mas é o formato certo quando o destino é **álgebra linear e machine learning**.

A conclusão que fecha o ciclo do capítulo: a mesma informação, representada de duas formas, resolve dois problemas diferentes. Menor caminho pede lista. Rede neural pede matriz.

### Property graphs e triple-stores

O livro apresenta os dois modelos de armazenamento:

- **Property graph**: você adiciona propriedades tanto nos nós quanto nas arestas. O nó `Person` tem nome e idade; a aresta `CONHECEU` tem a data em que aconteceu. Cada vértice tem identificador único, um rótulo descrevendo o tipo, um conjunto de arestas de entrada, um de saída e um mapa de propriedades. Usado por Neo4j, Memgraph e companhia.
- **Triple-store**: o dado é uma tupla de três posições, **sujeito, predicado e objeto**. "Marcel trabalha com Wilson" é uma tripla. Usado por Datomic, AllegroGraph e Blazegraph.

O detalhe elegante das triplas é que a **mesma estrutura serve para três coisas diferentes**. Na primeira linha você define o tipo (`lucy a Person`). Na segunda, adiciona uma propriedade (`lucy name "Lucy"`). Na terceira, relaciona dois vértices (`lucy bornIn idaho`). Três linhas, três semânticas, uma estrutura só.

Vale a nota de que implementações reais estendem isso: o **AWS Neptune** usa uma quádrupla (adiciona um graph ID) e o **Datomic** usa uma quíntupla (guarda o ID da transação e uma flag de exclusão).

E há um degrau anterior que o livro só tangencia e que a turma sentiu falta: **ontologia**. Antes de modelar um texto como grafo, você precisa decidir quais são as classes, os objetos e as relações do seu domínio. Sem esse passo, você só está ligando palavras. É a mesma ideia que sustenta a **web semântica** e o **RDF**.

### O clique: index-free adjacency

Aqui veio a pergunta que muita gente teve lendo o capítulo:

> Se a vantagem é só ergonomia de sintaxe, o que me impede de colocar uma abstração em cima de um banco relacional?

Nada impede. Essa abstração inclusive existe. Mas a resposta que faz o clique é que **a ergonomia da linguagem costuma vir acompanhada de uma implementação diferente embaixo**.

Num banco de grafos como o Neo4j existe o conceito de **index-free adjacency**: o nó já carrega o ponteiro para os nós vizinhos. Pular de um nó para o outro é praticamente **tempo constante**. Não há consulta ao índice para descobrir onde o vizinho está.

Num banco relacional, a mesma navegação escala mal em **duas dimensões ao mesmo tempo**: no tamanho da tabela **e** na quantidade de saltos. Numa rede social com bilhões de nós, "quem são os amigos dos amigos do Marcelo" é uma pergunta barata no grafo e cara no relacional.

O contraponto sensato também apareceu: o Postgres vai passar a ter property graph, e isso é ótimo. Mas é um recurso construído em cima de um motor cujo **modelo natural não é grafo**. Em baixa e média escala, resolve muito bem. Em escala de grafo de verdade, o banco especializado ainda ganha.

### Cypher contra SQL: uma linha contra trinta

O exemplo do livro é a melhor propaganda do capítulo. A criação dos dados em **Cypher**, a linguagem do Neo4j (hoje um padrão aberto, suportado por Memgraph, Amazon Neptune, Apache AGE e outros):

```text
CREATE
  (namerica :Location {name: 'North America', type: 'continent'}),
  (usa      :Location {name: 'United States', type: 'country'}),
  (idaho    :Location {name: 'Idaho', type: 'state'}),
  (lucy     :Person   {name: 'Lucy'}),
  (lucy) -[:WITHIN]-> (usa) -[:WITHIN]-> (namerica),
  (lucy) -[:BORN_IN]-> (idaho)
```

E a consulta que busca pessoas que nasceram nos Estados Unidos e moram na Europa:

```text
MATCH
  (person) -[:BORN_IN]->  () -[:WITHIN*0..]-> (:Location {name: 'United States'}),
  (person) -[:LIVES_IN]-> () -[:WITHIN*0..]-> (:Location {name: 'Europe'})
RETURN person.name
```

Repare na sintaxe: **o nó é um parêntese, a aresta é uma setinha**. É quase ASCII art. E a mágica está no `*0..`: não importa quantos saltos existem entre a cidade e o país. Nasceu direto nos Estados Unidos? Pega. Nasceu em San Diego, dentro de Orange County, dentro da Califórnia, dentro dos Estados Unidos? Pega também.

O equivalente em SQL exige `CREATE TABLE` para vértices e arestas e um **common table expression recursivo**, com várias views intermediárias, para chegar no mesmo resultado. **Uma linha de Cypher contra dezenas de linhas de SQL**, com o custo extra em manutenção, legibilidade e, muito provavelmente, desempenho.

E aqui entrou a melhor analogia da noite. Durante muito tempo, a matemática foi escrita por extenso. As equações diofantinas pareciam charadas. Quando os **números indo-arábicos** chegaram à Europa, as pessoas passaram a **enxergar** propriedades que estavam lá o tempo todo, mas que a notação escondia.

> A representação que a gente dá para alguma coisa facilita a ergonomia e facilita a gente trabalhar aquela informação.

É exatamente isso que uma _query language_ faz por um modelo de dados.

### Onde grafos brilham de verdade

Dois casos de uso concretos apareceram:

- **Detecção de fraude.** O Nubank e outros bancos usam grafos para isso. Pense num IP que se comunica com a conta do Marcel, com a do David e com a do Nelson. Modelado como grafo, existem algoritmos que apontam "esse nó está se conectando de forma diferente de todos os outros usuários". A anomalia **salta aos olhos na topologia**.
- **Inferência e grafos de conhecimento.** Você consegue fazer suposições sobre um nó ou uma aresta com base na estrutura. É a base de boa parte do que se faz hoje em IA quando se quer extrair conhecimento de dado não estruturado.

E vale registrar uma limitação que o livro cita: **uma aresta liga exatamente dois vértices**. Se você precisa de uma relação entre três ou mais, precisa recorrer a hipergrafos, ou modelar aquilo de outro jeito. Numa tabela relacional, várias chaves estrangeiras na mesma tupla resolvem isso naturalmente.

### E quando NÃO usar grafo

Esse foi o momento de sanidade da noite, e ele merece destaque:

> É importante saber **quando não usar** um banco de grafos.

Se a carga é predominantemente transacional, se os relacionamentos são simples e previsíveis, se você precisa **descobrir** relacionamentos em vez de percorrê-los, o relacional resolve. Não comece o MVP com banco de grafo achando que o grafo é a solução.

E o argumento decisivo não é técnico, é humano: **toda decisão de arquitetura empurra carga cognitiva para o time**. Se a equipe inteira entende Postgres, talvez a ergonomia não seja perfeita, mas é OK. Como a turma colocou, sem rodeios:

> Você não vai ser o Nubank. Em 80%, 90% do tempo, você não vai ser o Nubank. Calma.

O que **não** significa que estudar seja perda de tempo. Muito pelo contrário: você estuda justamente para **saber argumentar** quando um top down chegar dizendo "usa grafo porque o Nubank usa". Dominar o repertório é o que te dá o direito de dizer não com embasamento.

---

## GraphQL: grafo na API, e o problema do cache

O livro coloca GraphQL logo depois de grafos, e a leitura da turma foi que ele está ali menos como banco de grafos e mais como **query language**: uma sintaxe que dá ao cliente da web o poder de pedir exatamente o que precisa, numa única ida e volta.

O ganho principal é combater o **over-fetching**. Se você tem vários clientes e cada um precisa de uma tela diferente, o REST te empurra para um endpoint que devolve um JSON com setenta propriedades. Se o cara está num 3G e só precisa de três, você está gastando banda dele à toa. Com GraphQL, cada cliente pede o que quer. Não à toa, quem criou foi o **Facebook**, que tinha exatamente esse problema em escala planetária, com um grafo social gigantesco por baixo e endpoints REST cada vez mais difíceis de manter.

O caso de uso onde GraphQL ficou mais elogiado foi como **BFF** ou API gateway, principalmente na versão **grafo federado**: o `profilePicture` vem de um serviço, `findConnection` de outro, os dados do usuário de um terceiro, e o **Apollo Federation** faz o roteamento. Você para de mudar contrato toda semana; o frontend busca o que precisa. O GitHub, inclusive, vem empurrando parte da API nessa direção por questões de carga.

E aí veio a pergunta espinhosa:

> Como fica o **cache** nisso, já que GraphQL vai por POST?

A discussão foi boa:

- **Semanticamente, POST não é cacheável.** Nas camadas intermediárias da rede, em proxy e CDN, você provavelmente não vai contar com cache. Essa é a perda real.
- **Do lado do cliente**, ferramentas como Apollo Client e React Query cacheiam normalmente.
- **Do lado do gateway**, o Apollo consegue cachear por resolver: ele sabe que `profilePicture` vem daquele serviço, busca pelo ID e cacheia naquele ponto. A próxima query que pedir o mesmo campo já aproveita.
- E **a chave de cache** é a solução geral do problema: tudo que vai numa consulta pode virar um **hash**. Você pega o corpo da query, gera o hash, e tem uma chave de cache única.

Foi aí que a conversa cruzou com um assunto que a comunidade acabou de cobrir: o novo método **HTTP QUERY** ([RFC 10008](https://www.rfc-editor.org/info/rfc10008)). Ele resolve exatamente o dilema de mandar corpo numa requisição de leitura sem mentir para a infraestrutura usando POST. E o cache, no QUERY, passa a depender de cruzar URL, corpo e metadados: o mesmo hash que já se faz na mão hoje com GraphQL.

---

## Event Sourcing: o banco de dados virado do avesso

Event sourcing é a parte do capítulo que **não existia na primeira edição**, junto com GraphQL e dataframes.

A inversão é o ponto: normalmente a gente salva o **estado atual** da entidade. No event sourcing, os eventos são cidadãos de primeira classe e a **fonte da verdade é o log de eventos**. O estado é derivado.

O exemplo do livro é uma conferência. No modelo tradicional você tem a conferência, o local, os inscritos. No event sourcing você tem um log _append-only_: "conferência criada", "inscrições abertas", "assento reservado", "assento reservado", e assim por diante.

As vantagens que apareceram:

- **É a forma mais eficiente de escrever.** Você só faz append num arquivo. Não passou pelo agregado, não calculou nada, só registrou o fato.
- **Você conta a história completa.** É uma máquina do tempo: dá para reconstruir o estado do agregado em qualquer ponto.
- **Projeções são descartáveis.** Se a view materializada não serve mais, você joga fora e cria outra. Se tinha um bug no código da projeção, você corrige o código, **recomputa tudo desde o início** e o dado sai correto.
- **Snapshots resolvem o custo de recomputar.** Para uma entidade com milhões de eventos (uma celebridade numa rede social, por exemplo), você consolida o estado periodicamente e recomputa só o delta.

E as dores, que foram contadas com cicatriz:

- **Consulta é o inferno na terra.** Você sempre vai precisar de uma vista materializada, uma tabela materializada, algum mecanismo auxiliar. É por isso que event sourcing quase sempre vem acompanhado de **CQRS**: um mecanismo de persistência com todas as validações de domínio, e um mecanismo de leitura completamente separado, pré-calculado, direto na fonte.
- **Dado externo não volta no tempo com você.** Alguém contou o tropeço: o evento dependia da cotação do dólar naquele instante. Na hora de reprocessar, a cotação de hoje não é a de então. A regra prática que ficou: se você precisa de um dado que vem de fora e não consegue recuperar depois, **coloque esse dado dentro do evento**.
- **Versionamento de esquema de evento é dor de verdade.** Quando já existem milhões de eventos com o esquema antigo, você precisa de uma nova versão e de um handler cheio de `if` para V1, V2, V3. **Sempre versione o evento desde o começo.** Existe um livro inteiro do Greg Young, com umas duzentas páginas, só sobre versionamento de eventos.
- **Depois que funciona, dá vontade de fazer tudo com evento.** E aí você começa a comprar complexidade onde não precisava. O sistema precisa ter **complexidade inerente** e uma natureza **linear e temporal** para justificar a modelagem. O que não é core resolve muito melhor com CRUD, e qualquer pessoa mexe sem onboarding.

Duas distinções importantes fecharam o tema:

- **Event sourcing não é audit trail.** O audit trail registra o que aconteceu, mas **não é a fonte da verdade**, e pode nem carregar todas as propriedades do comando. No event sourcing, o evento é a verdade e carrega tudo.
- **Isso não é exclusividade de sistemas distribuídos.** O seu banco relacional já faz event sourcing por baixo dos panos: é o **write-ahead log**. Antes de mexer na árvore do índice, ele garante que o evento está escrito. É o jeito mais eficiente e mais seguro de escrever, e o sistema de arquivos faz o mesmo. Como alguém colocou, o **Kafka é um banco de dados virado do avesso**: em vez de estrutura com log ao lado, é o log a partir do qual você monta a estrutura.

E, no meio disso, um comentário que capturou o desenho do livro inteiro:

> Ele inverteu a ordem para você entender a base antes. É tipo um **caminho de pão**.

O livro vem dando doses homeopáticas: dados derivados no Capítulo 1, view materializada no Capítulo 2, CQRS e event sourcing aqui. Quando você chega, já tem o racional montado.

---

## Dataframes: o modelo de dados que vive do outro lado

O último modelo do capítulo vive num espaço bem específico: **dataframes só aparecem do lado OLAP**. Você não vai ter um caso de uso de API mexendo com dataframe. Eles vivem em contexto científico e analítico, suportados por R, pandas, Polars, Spark e afins.

A estrutura lembra uma tabela, e você consegue aplicar filtro, agrupamento, agregação e junção. Mas **a linguagem não é declarativa** como SQL. É imperativa: em vez de `SELECT DISTINCT`, você chama `drop_duplicates()`. Você opera transformações sobre a estrutura.

A operação que o livro destaca é a **transposição**: pegar o dado de uma relação (usuário, filme, nota) e reorganizar numa **matriz esparsa** com usuários em uma dimensão e filmes na outra. É o formato clássico de sistema de recomendação, e é o formato que a álgebra linear entende.

Porque o ponto é esse: modelos de machine learning **não entendem** "comprou o livro tal na Amazon". Eles entendem número. Então você transforma:

- **One-hot encoding**: cada categoria vira uma coluna com 0 ou 1, indicando pertencimento.
- **Label encoding**: cada categoria vira um número (amarelo 1, azul 2, vermelho 3).

E a conversa foi além do livro, com quem trabalha com dados no dia a dia:

- Dataframes vivem **em memória**, mas também escalam de forma distribuída. Base grande demais para um cluster? Você processa distribuído e unifica depois.
- Nada te obriga a ficar em duas dimensões. Data, país, o que fizer sentido: cada uma é mais uma dimensão. Se aquilo é uma _feature_ relevante para o modelo, entra.
- E, quando as dimensões explodem, existe o problema da **dimensionalidade**. Você monta uma **matriz de correlação**, descobre que duas variáveis estão fortemente correlacionadas e elimina uma, porque manter as duas **atrapalha** o modelo em vez de ajudar.

Veio um exemplo real e muito bom: um projeto de simuladores de corrida que calculava a **volta perfeita**. Temperatura de pneu, do ambiente, do asfalto, do combustível, pressão. Cada componente era mais uma dimensão, até chegar num ponto em que já era impossível visualizar aquilo num gráfico. A correlação entre os aspectos é que definia a performance da volta.

---

## O fechamento: um mapa, não uma receita

O resumo que a turma montou no fim vale como cola do capítulo:

- **Relacional**: dados em relações e tuplas. Normalizado para transacional, desnormalizado para analítico. Vantagem em consistência e em consultas por qualquer dimensão. Custo em join quando o dado está espalhado.
- **Documento**: árvore. Ótima **localidade**: você traz o perfil inteiro num acesso. Sofre em muitos para muitos e quando você precisa consultar um galho específico da árvore. E **não é schemaless**: é schema-on-read.
- **Grafo**: para quando a estrutura é uma rede e a pergunta envolve **percorrer** relações. Ganha em travessia, perde em agregação sobre todos os nós.
- **Event sourcing**: eventos como fonte da verdade, projeções como dado derivado. Escrita ótima, leitura só via projeção, e complexidade que precisa ser justificada.
- **Dataframes**: OLAP, memória, álgebra linear, machine learning.

O capítulo **não aprofunda nenhum deles**, e isso é proposital. Ele te dá a foto e o vocabulário. E, no processo, faz duas coisas que amarram a série inteira:

1. **Devolve a pergunta para você.** Não é "qual banco é melhor", é "qual é o meu padrão de leitura e de escrita, e qual pergunta esse sistema precisa responder".
2. **Mostra que a representação importa.** A mesma informação, guardada de duas formas diferentes, resolve dois problemas diferentes e falha em dois outros.

Se a dúvida persistir, a piada da noite continua valendo: vai de Postgres, ninguém nunca foi demitido por isso. Mas **saiba defender por que você não escolheu a outra estrutura**. Como alguém fechou:

> Você tem que dominar os dois lados para saber defender a sua decisão.

No próximo encontro, o **Capítulo 4: Storage and Retrieval**. Saímos dos modelos de dados e descemos para como o banco realmente guarda e busca isso no disco. E, spoiler do próprio livro: no final das contas, continua tudo sendo trade-off.

---

### Referências

**O livro**

- **Designing Data-Intensive Applications**, Martin Kleppmann e Chris Riccomini (2ª edição). Capítulo 3: _Data Models and Query Languages_. [Site oficial](https://dataintensive.net/).

**Posts anteriores da série**

- [Escala destrói sonhos: o Capítulo 2 de DDIA (Parte 2)](https://craftcodeclub.io/posts/ddia-requisitos-nao-funcionais-parte-2)
- [Os requisitos que o negócio não pede: o Capítulo 2 de DDIA (Parte 1)](https://craftcodeclub.io/posts/ddia-requisitos-nao-funcionais-parte-1)
- [Não existem soluções, só trade-offs: o que aprendemos no Capítulo 1 de DDIA](https://craftcodeclub.io/posts/ddia-trade-offs-arquitetura-de-sistemas)

**Gravações dos encontros**

- [Capítulo 3, Parte 1: relacional, documento, normalização e ORM](https://www.youtube.com/watch?v=56Vb5r5HjfQ)
- [Capítulo 3, Parte 2: analítico, grafos, GraphQL, event sourcing e dataframes](https://www.youtube.com/watch?v=ofCUEWI6aPc)
- [Playlist completa do Clube do Livro DDIA](https://www.youtube.com/playlist?list=PLl10TyPY67JjuLZNG7o2HbBJyAkX2zGc3)

**Links compartilhados na discussão**

- [Quadro da discussão (Excalidraw)](https://link.excalidraw.com/l/ADMgGFVWISx/4HF9psGkCyZ)
- [Database Engines Crash Course](https://www.udemy.com/course/database-engines-crash-course/) (Hussein Nasser), sobre como o banco funciona por baixo do capô
- [Como escolher o banco de dados correto para a sua aplicação](https://youtu.be/bhw4-Kq_RPs) (Renato Augusto)
- [Arquitetando o placar ao vivo da Copa do Mundo](https://www.youtube.com/watch?v=GwK9hxNS7l4) (Renato Augusto), event sourcing na prática
- [Data-Oriented Programming with Python](https://towardsdatascience.com/data-oriented-programming-with-python-ef478c43a874/)
- [DataFrame no .NET](https://learn.microsoft.com/pt-br/dotnet/machine-learning/how-to-guides/getting-started-dataframe) (Microsoft Learn)
- Grafos na comunidade: [tópico completo](https://craftcodeclub.io/topics/grafos) · [dicas de grafos](https://craftcodeclub.io/posts/dsa-graph-tips) · [playlist de Algoritmos & Estruturas de Dados](https://www.youtube.com/playlist?list=PLl10TyPY67Jgbh4QdRlRKr-7PjB9i5hWg)
- **Aprenda Domain-Driven Design**, Vlad Khononov, citado pelo Capítulo 16 (Data Mesh) e pelo _event-sourced domain model_

**Para aprofundar (conceitos citados)**

- [A Relational Model of Data for Large Shared Data Banks](https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf), o artigo original de E. F. Codd (1970)
- [Active Record](https://martinfowler.com/eaaCatalog/activeRecord.html) · [Data Mapper](https://martinfowler.com/eaaCatalog/dataMapper.html) · [Unit of Work](https://martinfowler.com/eaaCatalog/unitOfWork.html) · [Repository](https://martinfowler.com/eaaCatalog/repository.html) (Martin Fowler)
- [Star schema](https://learn.microsoft.com/pt-br/power-bi/guidance/star-schema) (Microsoft Learn) · [Arquitetura Medalhão](https://www.databricks.com/glossary/medallion-architecture) (Databricks) · [Armazenamento do BigQuery](https://cloud.google.com/bigquery/docs/storage_overview)
- [Crypto-shredding](https://en.wikipedia.org/wiki/Crypto-shredding) e a [LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Cypher Manual](https://neo4j.com/docs/cypher-manual/current/) (Neo4j) · [openCypher](https://opencypher.org/) · [Apache AGE](https://age.apache.org/) · [Amazon Neptune](https://docs.aws.amazon.com/neptune/) · [Datomic](https://docs.datomic.com/)
- [RDF 1.1 Primer](https://www.w3.org/TR/rdf11-primer/) · [Turtle](https://www.w3.org/TR/turtle/) · [SPARQL 1.1](https://www.w3.org/TR/sparql11-query/) (W3C)
- [Especificação do GraphQL](https://spec.graphql.org/) · [Apollo Federation](https://www.apollographql.com/docs/federation/) · [HTTP QUERY (RFC 10008)](https://www.rfc-editor.org/info/rfc10008)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) · [CQRS](https://martinfowler.com/bliki/CQRS.html) (Martin Fowler) · [Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html) (PostgreSQL)
- [pandas](https://pandas.pydata.org/docs/reference/frame.html) · [Polars](https://pola.rs/) · [Spark DataFrames](https://spark.apache.org/docs/latest/sql-programming-guide.html) · [pré-processamento no scikit-learn](https://scikit-learn.org/stable/modules/preprocessing.html)
- Outros termos para pesquisar: object-relational impedance mismatch, N+1 query problem, schema-on-read, drill down, ETL, index-free adjacency, hipergrafo, over-fetching, snapshot de agregado, one-hot encoding.
