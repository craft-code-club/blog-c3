---
title: 'Skip List'
date: '2025-08-03'
description: 'Skip List é uma estrutura de dados que permite a pesquisa rápida em listas ordenadas, utilizando múltiplas camadas de listas encadeadas.'
topics: ['Algoritmos', 'Estruturas de Dados']
authors:
  - name: 'Nelson Nobre'
    link: 'https://github.com/NelsonBN'
---


## O que é uma Skip List?

Uma Skip List é uma estrutura de dados probabilística composta por múltiplas listas ligadas organizadas em níveis hierárquicos. Cada nível superior actua como um índice para os níveis inferiores, permitindo saltos maiores na navegação e acelerando a pesquisa por elementos. Esta estrutura consegue alcançar, em média, um desempenho semelhante ao da pesquisa binária, mas mantendo a flexibilidade das listas ligadas.

Foi criada por [William Pugh](https://en.wikipedia.org/wiki/Skip_list), em 1989, com o objectivo de oferecer uma alternativa simples, porém eficaz, para operações em conjuntos de dados ordenados.


### Motivação para o surgimento

Antes de mergulharmos na Skip List, vamos relembrar três estruturas fundamentais: Arrays, Listas Ligadas e Árvores Balanceadas. Cada uma delas resolve parte do problema de forma eficiente, mas também tem as suas limitações.

#### Array

- Estrutura que armazena elementos em posições contíguas de memória
- Permite acesso rápido por índice: `O(1)`
- Inserções e remoções têm custo `O(n)`, pois exigem o deslocamento linear dos elementos seguintes ou anteriores na memória, uma vez que os dados são armazenados de forma contígua
- Ideal para acesso aleatório, mas pouco flexível para modificações frequentes

#### Linked List

- Estrutura composta por nós com ponteiros para o próximo nó
- Acesso sequencial: `O(n)`, pois não permite acesso directo por índice, sendo necessário percorrer cada nó até encontrar o elemento pretendido
- Bastante flexível para inserções e remoções, pois basta ajustar os ponteiros para os nós adjacentes
- Boa para modificações dinâmicas, mas fraca em acesso aleatório

#### Árvores Balanceadas (AVL, Red-Black)

- Estruturas hierárquicas que garantem balanceamento com operações eficientes: `O(log n)`
- Suportam inserções, remoções e pesquisas com bom desempenho
- Apesar de oferecerem bom desempenho, são mais complexas de implementar e manter, pois requerem operações de rotação e manutenção de invariantes de balanceamento para garantir a eficácia das operações

E se fosse possível combinar o acesso eficiente dos arrays, a flexibilidade das listas ligadas e o balanceamento das árvores, mas com menor complexidade esperada de implementação? É precisamente aqui que surge a Skip List. Uma estrutura de dados probabilística que combina simplicidade de implementação com desempenho médio logarítmico, sem exigir os ajustes estruturais complexos das árvores balanceadas.

| Estrutura         | Acesso Direto | Inserção    | Remoção     | Conclusão                                                                  |
| ----------------- | ------------- | ----------- | ----------- | -------------------------------------------------------------------------- |
| Array             | `O(1)`        | `O(n)`      | `O(n)`      | Excelente para acesso rápido, fraca para modificações frequentes           |
| Linked List       | `O(n)`        | `O(n)`      | `O(n)`      | Flexível para inserções e remoções, mas ineficiente para acesso aleatório  |
| Árvore Balanceada | `O(log n)`    | `O(log n)`  | `O(log n)`  | Desempenho consistente, mas implementação mais complexa                    |
| Skip List         | `O(log n)`*   | `O(log n)`* | `O(log n)`* | Bom desempenho médio, ordenação automática com simplicidade probabilística |

> * Média esperada com aleatoriedade bem distribuída



## Estrutura

### Camadas/Níveis
- A Skip List é composta por múltiplas listas ligadas horizontais, organizadas em níveis empilhados
- O nível 0 contém todos os elementos, representando a lista base
- Cada nível superior contém apenas uma parte dos nós do nível imediatamente abaixo, actuando como índices que permitem saltos maiores na navegação, acelerando a pesquisa

### Nós com Múltiplos Ponteiros
- Cada nó pode conter múltiplos ponteiros "para a frente", um por cada nível em que participa
- A decisão de quantos níveis um nó integra (ou seja, quantos ponteiros terá) é feita de forma probabilística, geralmente simulando lançamentos de moeda. Esta aleatoriedade segue uma distribuição geométrica, que determina a altura do nó e, por consequência, quantos níveis o nó cobre

### Pesquisa com Saltos (skip search)

- A pesquisa inicia-se no nível mais alto, avançando horizontalmente enquanto o próximo nó tiver um valor inferior ou igual ao procurado
- Quando não é mais possível avançar nesse nível, desce-se para o nível seguinte e o processo repete-se
- Este mecanismo permite ignorar blocos inteiros de elementos, reduzindo significativamente o número de comparações necessárias em média

### Requisitos
- Os dados devem ser ordenáveis, ou seja, devem permitir comparações consistentes (`<`, `>`, `==`) com uma ordem total
- Esta ordenação é fundamental para garantir que a navegação entre níveis seja válida e as pesquisas funcionem correctamente

![Skip List](https://raw.githubusercontent.com/NelsonBN/algorithms-data-structures-skip-list/refs/heads/main/media/skip-list.svg)



## Vantagens e Desvantagens

### Vantagens
- Mais simples de implementar do que árvores balanceadas
- Suporta pesquisa, inserção e remoção eficientes (tempo médio logarítmico)
- Os dados permanecem ordenados automaticamente

### Desvantagens
- Ocupa mais memória, pois cada nó pode ter múltiplos ponteiros
- O desempenho depende de aleatoriedade (embora seja robusto na média)
- Um pouco mais complexa que uma Linked List tradicional



## Porque é que a Skip List é uma estrutura de dados probabilística?

A Skip List resolve de forma elegante os problemas das estruturas tradicionais ao recorrer a uma abordagem **probabilística**, evitando a complexidade dos algoritmos de balanceamento (como nas árvores AVL ou Red-Black). Em vez disso, utiliza **aleatoriedade** controlada para manter a estrutura equilibrada e eficiente em média.

- **Simplicidade**: Evita rotações e reestruturações complicadas
- **Eficiência média garantida**: A aleatoriedade distribui os elementos de forma que, em média, obtemos performance logarítmica
- **Menos código**: Implementação mais direta e fácil de entender comparada às árvores balanceadas
- **Flexibilidade**: Não requer conhecimento prévio da distribuição dos dados


### Como funciona?

Imagine que tens uma lista ordenada comum e queres acelerar as pesquisas. Uma abordagem seria criar "índices" que apontem para alguns elementos da lista original, permitindo saltar vários nós de uma vez. As Skip Lists fazem exatamente isso, mas de forma automática:

- Cada nó tem uma altura aleatória, definida por "lançamentos de moeda"
- Nós mais "altos" aparecem em mais níveis, criando atalhos horizontais
- A distribuição probabilística assegura que os nós estejam razoavelmente bem espalhados entre os níveis

Esta abordagem probabilística resolve elegantemente o trade-off entre simplicidade de implementação e eficiência de operações, oferecendo uma alternativa prática às estruturas de dados mais complexas.


### Fundamentos Probabilísticos

A altura dos nós numa Skip List é determinada por um processo probabilístico inspirado na [distribuição geométrica](https://en.wikipedia.org/wiki/Geometric_distribution) inversa, simula-se uma sequência de tentativas, onde cada uma tem uma probabilidade `p` de sucesso (subir de nível). O processo continua enquanto ocorrerem êxitos consecutivos e termina ao primeiro fracasso. Assim, a altura de um nó corresponde ao número de sucessos consecutivos obtidos

- **Probabilidade `p`**: Chance de um nó "subir" para o próximo nível (tipicamente `p = 0.5`)
- **Processo de decisão**: Para cada nível, gera-se um número aleatório entre 0 e 1
  - Se `random() < p`: nó continua no próximo nível
  - Caso contrário: nó para neste nível

#### Como funciona:

- Para cada nó, fazemos "lançamentos de moeda" sucessivos
- **Cara** = nó sobe para o próximo nível (sucesso)
- **Coroa** = nó para neste nível (fracasso)
- A altura final é determinada pelo número de "caras" consecutivas

**Exemplo prático:**
- Nó A: Coroa → altura = 1 (só nível 0)
- Nó B: Cara, Coroa → altura = 2 (níveis 0 e 1)
- Nó C: Cara, Cara, Cara, Coroa → altura = 4 (níveis 0, 1, 2, 3)

A probabilidade de um nó ter altura h é:

```math
P(altura=h) = p^(h−1) × (1−p)
```
- `p` é a probabilidade de "subir" para o próximo nível (normalmente `0.5`)
- A altura média de um nó, ou seja, o número de níveis em que participa, nível 0 incluído, segue a fórmula `1/(1-p)`, que corresponde à esperança da distribuição geométrica do número de sucessos antes da primeira falha
- Por exemplo, com `p = 0.5`, temos uma altura média de 2, o que significa que cada nó aparece, em média, em dois níveis da estrutura
- Já a altura total esperada da estrutura como um todo é `Θ(log n)`, pois a cada novo nível, espera-se que apenas uma fração `p` dos nós do nível anterior seja promovida ao próximo nível. Isso gera um efeito de pirâmide, onde o número de nós diminui exponencialmente conforme subimos. Ou seja, a altura esperada é a soma ponderada `Σ h × P(altura = h)`

**Distribuição resultante:**

Assumindo `p = 0.5`, a distribuição dos nós pelos níveis segue um padrão exponencial:

- **100%** dos nós aparecem no nível 0
- **50%** dos nós também aparecem no nível 1
- **25%** dos nós também aparecem no nível 2
- **12.5%** dos nós também aparecem no nível 3
- **6.25%** dos nós também aparecem no nível 4
- E assim por diante…

Para uma Skip List com `n` elementos, a altura total esperada é:

`E[altura_total] = Θ(log n)`

**Demonstração intuitiva:**
- Com `p = 0.5`, cada nível tem aproximadamente metade dos nós do nível anterior
- Para ter pelo menos 1 nó no nível `k`, precisamos: `n × (0.5)^k ≥ 1`
- Resolvendo: `k ≤ log₂(n)`
- Portanto, a altura máxima esperada é `O(log n)`

**Implicações práticas:**
- **Lista com 1.000 elementos**: altura esperada ≈ 10 níveis
- **Lista com 1.000.000 elementos**: altura esperada ≈ 20 níveis
- **Pesquisa eficiente**: Mesmo para conjuntos muito grandes, a profundidade da estrutura cresce de forma logarítmica, o que garante, em média, pesquisas rápidas com poucas comparações `O(log n)`, desde que a aleatoriedade esteja bem distribuída

#### Por que p = 0.5 é comum?

- **Balanceamento ótimo**: Cada nível tem aproximadamente metade dos elementos do anterior
- **Simplicidade**: Fácil de implementar (equivale a um bit aleatório)
- **Performance**: Oferece o melhor trade-off entre velocidade e uso de memória
- **Análise matemática**: Facilita cálculos e provas de complexidade



## Características principais

### Simulação da pesquisa binária

A Skip List **não implementa pesquisa binária no sentido tradicional** (como em arrays), mas simula o seu comportamento **ao permitir saltos progressivamente maiores através dos níveis superiores**, reduzindo significativamente o número de comparações, tal como uma pesquisa binária reduz o espaço de pesquisa.

* **Pesquisa binária em array**: Divide o espaço de pesquisa pela metade a cada comparação, saltando directamente para o meio
* **Skip List**: Usa níveis superiores para "saltar" grandes porções da lista, aproximando-se do comportamento de divisão do espaço de pesquisa

**Exemplo prático:**
Numa Skip List com elementos [1, 3, 7, 12, 19, 25, 31] procurando o valor 19:
- **Nível 2**: Pode saltar direto de 1 → 12 → 25 (detecta que 19 < 25)
- **Nível 1**: Desce e vai de 12 → 19 (encontrado!)
- **Resultado**: Apenas 3 comparações em vez de percorrer toda a lista sequencialmente


### Operações locais

- Inserção e remoção atuam localmente: **não há rotação nem reestruturação global**
- Apenas ajustam ponteiros em algumas posições (nos níveis em que o nó está presente)


### Tamanho esperado da estrutura

- O número esperado de níveis é `Θ(log n)`
- A altura média de um nó é `1 / (1 - p)` (com `p` como a probabilidade de subir de nível)



## Que tipo de problemas resolve?

- 1. **Pesquisas rápidas em dados ordenados**
  - Quando precisas encontrar rapidamente um valor dentro de uma sequência ordenada
  - **Exemplo**: Procurar um utilizador num sistema que armazena IDs em ordem crescente
- 2. **Inserções e remoções eficientes mantendo ordem**
  - Quando precisas **inserir ou remover elementos** e ainda manter tudo ordenado automaticamente
  - **Exemplo**: Adicionar ou remover transacções numa lista de histórico ordenada por data
- 3. **Pesquisas por intervalo (range queries)**
  - Quando precisas pesquisar **todos os elementos entre dois valores** (ex: entre `10` e `50`)
  - **Exemplo**: Pesquisa todos os preços entre €100 e €200 numa lista de produtos
- 4. **Cenários com leitura frequente e escrita moderada**
  - Ideal para situações em que há muitas pesquisas e algumas inserções ou remoções, mas não milhões por segundo
  - **Exemplo**: Sistema de ranking de jogadores com actualizações periódicas (não em tempo real absoluto), onde a leitura (ver posição) é constante e as inserções são moderadas. Para cargas de escrita muito intensas ou requisitos em tempo real, pode ser melhor recorrer a estruturas otimizadas para concorrência ou hardware especializado.


### Aplicações no Mundo Real

- **Redis**: Usa Skip Lists como estrutura base para os Sorted Sets ([documentação oficial](https://redis.io/docs/latest/develop/data-types/sorted-sets))
- **LevelDB/RocksDB**: Utilizam Skip Lists internamente para representar a MemTable, facilitando acesso e ordenação em memória ([referência](https://github.com/facebook/rocksdb/wiki/MemTable))
- **Java**: A biblioteca Java inclui a classe `ConcurrentSkipListMap`, que oferece um mapa ordenado e thread-safe baseado em Skip Lists ([documentação](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentSkipListMap.html))
- **Sistemas de ranking**: Leaderboards de jogos online em tempo real



## Complexidade Asintótica

**Tempo:**

| Operação  | Melhor Caso (Ω) | Caso Médio (Θ) | Pior Caso (O)                  |
|---------- |---------------- |--------------- |------------------------------- |
| Pesquisa  | Ω(1)            | Θ(log n)       | O(n) (muito raro de acontecer) |
| Inserção  | Ω(1)            | Θ(log n)       | O(n) (muito raro de acontecer) |
| Remoção   | Ω(1)            | Θ(log n)       | O(n) (muito raro de acontecer) |

- **Melhor caso (Ω)**: Acontece quando o valor está logo nos primeiros nós e num nível superior, salta directamente para ele
- **Caso médio (Θ)**: A distribuição aleatória dos níveis segue uma distribuição geométrica. Isso garante que, em média, o número de passos para pesquisar ou modificar é proporcional a `log n`
- **Pior caso (O)**: Embora o pior caso teórico possa atingir `O(n)`, a estrutura é projetada de forma que os tempos de inserção e remoção permanecem em `O(log n)` com alta probabilidade, assumindo uma fonte de aleatoriedade bem distribuída (como uma função `random()` confiável), devido à distribuição geométrica da altura dos nós. Isso é o que torna a Skip List eficiente na prática. Um exemplo onde isso pode acontecer, é se, por azar, todos os nós forem promovidos apenas ao nível 0 (sem 'atalhos'), a Skip List comporta-se como uma Linked List comum, e as operações degradam para tempo linear

**Espaço:**

- No pior cenário (muito improvável), o espaço pode crescer até `O(n log n)` se muitos nós forem promovidos a níveis superiores. Mas, em média, o espaço permanece linear `Θ(n)`, pois cada nível tem aproximadamente metade dos nós do nível abaixo.



## Implementação

### Como funciona

#### Pesquisa

1. Começa-se no nível mais alto da estrutura, a partir do nó cabeça
2. Em cada nível, avança-se para a frente enquanto o próximo nó existir e o seu valor for menor que o valor procurado
3. Quando não é mais possível avançar nesse nível, desce-se um nível e repete-se o processo
4. Ao chegar ao nível 0, verifica-se se o nó actual contém o valor desejado:
   - Se sim, a pesquisa foi bem-sucedida
   - Caso contrário, o valor não se encontra na estrutura

#### Inserção

1. Parte-se do nó cabeça e percorre-se a estrutura como numa pesquisa, guardando num vetor (`update[]`) os últimos nós visitados em cada nível
2. Depois de encontrar a posição correcta, determina-se a altura (ou nível) do novo nó. Essa altura é escolhida de forma aleatória, normalmente simulando o lançamento de moeda
3. Cria-se o novo nó com o número de níveis determinado
4. Em cada nível em que o novo nó vai participar:
   - O seu ponteiro passa a apontar para o próximo nó daquele nível
   - O nó anterior (registado em `update[]`) passa a apontar para o novo nó

#### Remoção

1. Assim como na inserção, percorre-se a estrutura e regista-se, em `update[]`, o último nó visitado em cada nível
2. Ao atingir o nível 0, verifica-se se o nó com o valor desejado existe
3. Se existir:
   - Em cada nível em que o nó aparece, ajusta-se o ponteiro do nó anterior para ignorar o nó a ser removido, apontando directamente para o próximo
4. Opcionalmente, pode-se reduzir a altura máxima da Skip List, se os níveis superiores ficarem vazios


### Implementação

[Segue aqui um exemplo de implementação em Python](https://github.com/NelsonBN/algorithms-data-structures-skip-list)



## Curiosidades

Algumas curiosidades interessantes sobre Skip Lists:

- **Origem do nome**: O termo "Skip List" refere-se à capacidade de "saltar" (skip) sobre vários elementos de uma vez, graças aos níveis superiores que se comportam como atalhos
- **Determinismo**: Mesmo que utilizemos os mesmo DataSet de entradas e multiplas execuções, a Skip List pode produzir diferentes estruturas devido à aleatoriedade na altura dos nós. Isso significa que a mesma lista de entrada pode resultar em Skip Lists diferentes em execuções distintas. No entanto, o output final (os elementos ordenados) será sempre o mesmo, pois a ordenação é garantida pela estrutura e o resultado de uma pesquisa também será consistente.
