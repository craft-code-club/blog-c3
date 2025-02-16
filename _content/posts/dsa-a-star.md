---
title: 'Algoritmo de A*'
date: '2025-02-16'
description: 'O algoritmo A* (A-Star) é uma abordagem eficiente para encontrar o caminho mais curto em grafos, combinando heurísticas e custo real. Usado em jogos, IA e navegação, garante soluções ótimas quando a heurística é bem definida.'
topics: ['algoritmos', 'grafos']
authors:
  - name: 'Nelson Nobre'
    link: 'https://github.com/NelsonBN'
---

## O que é o Algoritmo de A* (A-Star)?

O **A*** **(A-Star)** é um algoritmo de pesquisa informada que encontra um caminho de custo mínimo em um grafo. Ele utiliza uma heurística para guiar a pesquisa, tornando-o mais eficiente que métodos de pesquisa não informados como o algoritmo de **Dijkstra**.
Embora o **A*** compartilhe semelhanças com o algoritmo de **Dijkstra**, ele pode ser considerado um algoritmo de SSSP (Single Source Shortest Path) quando utilizado sem uma heurística informada (ou seja, com `h(n) = 0`, tornando-se equivalente ao algoritmo de **Dijkstra**). No entanto, sua aplicação principal é encontrar o caminho ótimo entre um ponto inicial e um objetivo específico, utilizando uma heurística para guiar a pesquisa, o que faz com que algumas referências não o classifiquem como um algoritmo de **SSSP (Single Source Shortest Path)**.
Uma das características do **A*** é a capacidade de encontrar o caminho mais curto (se existir), desde que a heurística seja admissível e consistente. Caso contrário, o algoritmo pode não garantir a optimalidade do caminho. Se o caminho até o objetivo estiver bloqueado, o **A*** terminará a pesquisa após explorar todos os nós possíveis, concluindo que não existe um caminho válido.


## Aplicabilidade

- Videojogos
- Inteligência artificial - É um dos algoritmos de pesquisa mais importantes na área da inteligência artificial.
- Sistemas de navegação - O **A*** é amplamente utilizado para encontrar rotas eficientes.
- Robótica


## Conceitos importantes do A*

### Lista Aberta

A Lista Aberta contém nós que ainda precisam ser explorados e podem já ter sido visitados, mas ainda não foram processados completamente. Essa lista é atualizada à medida que o algoritmo avança, adicionando novos nós e removendo os nós que já foram explorados. Essa lista também deve ser ordenada com base no valor de `f(n)`. Sabendo que essa lista deve ser ordenada, é comum usar uma **Priority Queue** para implementar a Lista Aberta.

### Lista Fechada

A Lista Fechada contém nós que já foram completamente processados e não precisam ser explorados novamente. Quando um nó é removido da Lista Aberta, ele é adicionado à Lista Fechada. Isso impede que o algoritmo explore o mesmo nó mais de uma vez. A lista fechada é usada para evitar ciclos e garantir que o algoritmo não fique preso em um loop infinito. Sabendo que um nó não deve ser explorado mais que uma vez, é comum usar uma **Hash Table** para no momento de verificar se um nó já foi visitado, a operação seja feita em tempo constante ( O(1) ).

### Heurística

O **A*** faz uso de uma função heurística `h(n)` para estimar o custo restante do caminho até o objetivo, permitindo priorizar caminhos promissores e reduzir o número de nós explorados. Essa função heurística é usada para guiar a pesquisa de forma eficiente.

```math
f(n) = g(n) + h(n)
```
- `g` é o custo acumulado do nó inicial até o nó `n` nó atual. **(O custo real do caminho)**.
- `h` é o custo estimado do nó `n` nó atual até o nó final. **(A heurística)**.
- `f` é o custo total do nó atual. **(Função de avaliação)**. A função `f(n)` é a função de avaliação que determina a ordem de exploração dos nós. Ela é a soma do custo real `g(n)` e da heurística `h(n)`. O **A*** explora os nós com o menor valor de `f(n)` primeiro.

A função heurística `h(n)` é o que torna o **A*** mais inteligente do que outros algoritmos de pesquisa como o **Dijkstra**, porque ele usa uma estimativa do que falta para chegar ao objetivo. Se essa estimativa for boa, o **A*** encontra o caminho ótimo rapidamente.

É importante notar que o custo pode ser qualquer valor que represente o esforço necessário para se mover de um nó para outro. Por ser a distância entre dois pontos, o tempo, o custo monetário, a quantidade de combustível, a combinação de vários fatores, etc.

#### Por que usar uma heurística?

- Reduzir o número de nós explorados, tornando a pesquisa mais rápida.
- Priorizar os nós mais promissores, ao invés de explorar todos igualmente.
- Balancear entre pesquisa exata (Dijkstra) e pesquisa gulosa (Greedy Search).

### Heurísticas comuns

- **Distância de Manhattan**: A distância de Manhattan é a distância entre dois pontos em um grid, movendo-se apenas em direções ortogonais (cima, baixo, esquerda, direita). É chamada assim porque representa a distância percorrida em ruas organizadas em grade, como em Manhattan. A distância de Manhattan é uma heurística comum para problemas de pesquisa em um grid.

```math
h(n) = |x2 - x1| + |y2 - y1|
```

- **Distância Euclidiana**: A distância euclidiana é a distância em linha reta entre dois pontos. Quando precisamos admitir movimentos diagonais, ou os nós são representados por coordenadas no espaço, a distância euclidiana é uma heurística comum.

```math
h(n) = sqrt((x2 - x1)^2 + (y2 - y1)^2)
```

![Manhattan vs Euclidean](https://i0.wp.com/vivaelsoftwarelibre.com/wp-content/uploads/2021/12/image-75.png?ssl=1)

- **Distância de Chebyshev**: A distância de Chebyshev é a distância entre dois pontos em um grid, movendo-se em qualquer direção (cima, baixo, esquerda, direita, diagonal). A distância de Chebyshev é uma heurística comum para problemas de pesquisa em um grid.

```math
h(n) = max(|x2 - x1|, |y2 - y1|)
```

- **Distância diagonal**: A distância diagonal é a distância em linha reta entre dois pontos, movendo-se em qualquer direção (cima, baixo, esquerda, direita, diagonal). A distância diagonal é uma heurística comum para problemas de pesquisa em um grid.

```math
h(n) = (dx + dy) + (sqrt(2) - 2) * min(dx, dy)
```

**Onde:**
- `dx` é a diferença entre as coordenadas x dos dois pontos.
- `dy` é a diferença entre as coordenadas y dos dois pontos.
- `sqrt(2)` é a raiz quadrada de 2. Que é `sqrt(2) ≈ 1.41421356237`.

| Heurística                 | Aplicação                                             | Ótima para                                                           |
|----------------------------|-------------------------------------------------------|----------------------------------------------------------------------|
| **Distância de Manhattan** | Movimentos ortogonais (sem diagonais)                 | Grades onde apenas movimentos verticais e horizontais são permitidos |
| **Distância Euclidiana**   | Movimentos livres em qualquer direção                 | Ambientes contínuos ou mapas 2D sem restrições                       |
| **Distância de Chebyshev** | Movimentos ortogonais e diagonais                     | Movimentos em grids, quando diagonais são permitidas                 |
| **Distância Diagonal**     | Movimentos ortogonais e diagonais com custo otimizado | Movimentos em grids com diagonais permitidas e custo mais realista   |


#### Heurística admissível vs. Heurística inconsistente

Uma  **heurística é admissível** se, para qualquer nó `n`, `h(n) <= h*(n)`, onde `h*(n)` é o custo real do caminho ótimo de `n` até o objetivo. Isso garante que o **A*** encontre o caminho mais curto, mas não necessariamente de forma eficiente. Podemos então dizer que a função `h(n)` deve ser uma **estimativa otimista** do custo real do caminho e que quanto mais próxima a função `h(n)` for do custo real do caminho, mais eficiente e rápido o algoritmo será.

Por outro lado, uma **heurística inconsistente** pode superestimar ou subestimar o custo para alcançar o objetivo. Nesse caso, o **A*** não é garantido para encontrar o caminho mais curto, mas ainda pode encontrar um caminho válido.

### Completude

O **A*** é considerado completo quando, ao pesquisar um caminho de um `nó` inicial até um `nó` final em um espaço de pesquisa finito, ele sempre encontra uma solução, se uma solução existir.

Para garantir a completude, o **A*** deve satisfazer algumas condições:
- O espaço de pesquisa deve ser finito – Se o espaço de pesquisa for infinito ou tiver ciclos infinitos, o **A*** pode nunca terminar.
- O fator de ramificação é finito – O número de nós filhos gerados a partir de cada nó deve ser finito.
- O custo de cada ação é maior que zero – Se houver custos negativos ou zero, o algoritmo pode entrar em loops infinitos.
- A heurística `h(n)` é admissível – Ou seja, a heurística nunca pode superestimar o custo real para chegar ao objetivo.

### Consistência

A consistência (também chamada de monotonicidade) é uma propriedade fundamental das heurísticas usadas em algoritmos de pesquisa como o **A***. Ela garante que a estimativa do custo de um nó até o objetivo nunca supera o custo real de um caminho ótimo.

Uma heurística é considerada consistente (ou monotônica) se, para cada nó `n` e cada sucessor `n'` de `n` gerado por qualquer ação `a`, o custo estimado de alcançar o objetivo a partir de `n` é no máximo o custo real de chegar ao `n'` mais o custo estimado de alcançar o objetivo a partir de `n'`. Em outras palavras, a heurística é consistente se:

```math
h(n) ≤ c(n,n') + h(n')
```
**Onde:**
- `h(n)` é a heurística estimada do custo de `n` até o objetivo.
- `h(n')` é a heurística estimada do custo de `n'` até o objetivo.
- `c(n,n')` é o custo real da transição de `n` para `n'`.
- `a` é a ação que leva de `n` para `n'`.

#### Por que a consistência é importante?
- **Garante a optimalidade**: Se a heurística for consistente, o **A*** reduz significativamente a necessidade de reexpansão de nós, garantindo que o primeiro caminho encontrado seja ótimo.
- **Mantém a ordem crescente do custo**: O valor total do custo `f(n) = g(n) + h(n)` nunca diminui ao longo do caminho, garantindo que o primeiro caminho encontrado seja o melhor.
- **Evita reexpansões desnecessárias**: Isso torna o **A*** mais eficiente, pois não precisa reavaliar nós já processados.

### Optimalidade

O **A*** é considerado ótimo quando é garantido que encontra o caminho mais curto. O **A*** é garantido para ser ótimo se a heurística `h(n)` for admissível. Se a heurística `h(n)` for inconsistente, o **A*** ainda pode encontrar um caminho válido, mas não é garantido que seja o caminho mais curto.

> **Conclusão:** O **A*** pode ser completo, mas não necessariamente ótimo (caso a heurística seja mal projetada). Porém, se a heurística for admissível e consistente, o **A*** é completo e ótimo.


## Complexidade assintótica

A complexidade de tempo do **A*** pode variar dependendo da heurística escolhida.

#### Caso Pior `O(b^d)` (Heurística ruim ou `h(n) = 0`)

Quando `h(n) = 0`, o **A*** se comporta como o algoritmo de **Dijkstra**, expandindo todos os nós antes de encontrar a solução, resultando em uma complexidade exponencial `O(b^d)`, onde `b` é o fator de ramificação e `d` é a profundidade da solução ótima.

```math
O(b^d)
```

#### Caso Médio `Θ(n)` (Heurística informativa)

Se a heurística `h(n)` for bem projetada e informativa, a complexidade do **A*** pode ser significativamente menor que `O(b^d)`. O comportamento exato depende do espaço de pesquina e da qualidade da heurística. Em alguns casos, a complexidade pode se aproximar de `O(d log d)`, semelhante a um algoritmo de ordenação eficiente, se a heurística reduzir drasticamente o número de nós expandidos. No entanto, no pior caso, ainda pode ser exponencial.

```math
O(b^m)
```
Onde:
- `m` é a profundidade até a melhor solução, mas com um crescimento menor que `O(b^d)`, pois a heurística reduz a quantidade de nós expandidos.

#### Caso Melhor `Ω(n)` (Heurística Perfeita)

Se a heurística `h(n)` for perfeita (ou seja, sempre retorna o custo exato até o objetivo), o **A*** expande apenas os nós no caminho ótimo, resultando em complexidade linear:

```math
O(d)
```

> **Nota:** Se a heurística `h(n) = 0` isto significa que `f(n) = g(n) + h(n)` é igual a `f(n) = g(n)`, ou seja, o **A*** se comporta como o algoritmo de Dijkstra. E nesse caso, o **Dijkstra** pode ser uma melhor solução devido ao maior consumo de memória do **A***.



## Como funciona o Algoritmo de A*?

```plaintext
1. Inicializar a Lista Aberta (Open List)
2. Inicializar a Lista Fechada (Closed List)
  2.1 Adicionar o nó inicial na Open List (com f(n) = 0 )
3. Enquanto a Open List não estiver vazia, faça:
  3.1. Encontrar o nó com o menor valor de f na Open List, chamá-lo de q
  3.2. Remover q da Open List
  3.3. Gerar os sucessores de q e definir q como o pai de cada um deles
  3.4. Para cada sucessor:
    3.4.1. Se o sucessor for o nó objetivo, encerrar a pesquisa
    3.4.2. Caso contrário, calcular os valores de custo:
      3.4.2.1. g(n) do sucessor: g = gq + distância entre q e o sucessor
      3.4.2.2. h(n) do sucessor: distância heurística do sucessor até o objetivo
      3.4.2.3. f(n) do sucessor: f(n) = g(n) + h(n)
    3.4.3. Se um nó com a mesma posição do sucessor já estiver na Open List com um menor valor de f, ignorar este sucessor
    3.4.4. Se um nó com a mesma posição do sucessor já estiver na Closed List com um menor valor de f, ignorar este sucessor
    3.4.5. Caso contrário, adicionar o sucessor à Open List
  3.5. Adicionar q à Closed List
4. Fim do loop
```


## Variações do Algoritmo de A*

- JPS (Jump Point Search)
- D (Dynamic A*)
- IDA* (Iterative Deepening A*)
- WA* (Weighted A*)


## Referências

- [Wikipedia](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [GeeksforGeeks](https://www.geeksforgeeks.org/a-search-algorithm/)
- [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance)
- [Manhattan distance](https://simple.wikipedia.org/wiki/Manhattan_distance)
- [Chebyshev distance](https://en.wikipedia.org/wiki/Chebyshev_distance)
- [Diagonal distance](https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#diagonal-distance)
