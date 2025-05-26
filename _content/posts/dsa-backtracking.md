---
title: 'Backtracking'
date: '2025-05-25'
description: 'Backtracking é uma técnica de resolução de problemas que explora todas as soluções possíveis para encontrar a solução correta.'
topics: ['Algoritmos', 'Backtracking']
authors:
  - name: 'Giovanny Massuia'
    link: 'https://github.com/giovannymassuia'
---

## Introdução

Backtracking foi introduzido por **D. R. Knuth** em 1975 e é uma técnica de resolução de problemas que explora todas as soluções possíveis para encontrar a solução correta. Foi popularizado por **Donald Knuth** em seu livro "The Art of Computer Programming". O termo "backtracking" refere-se ao processo de retroceder para uma solução anterior quando uma solução parcial não leva a uma solução completa. Essa técnica é amplamente utilizada em problemas de busca, como quebra-cabeças, jogos e problemas de otimização.

O algoritmo funciona explorando todas as soluções possíveis, seguindo um caminho até encontrar uma solução completa ou até que não haja mais opções a serem exploradas. O algoritmo pode ser descrito como uma busca em profundidade, onde o algoritmo tenta construir uma solução parcial e, se essa solução não for válida, retrocede e tenta outra opção.

## Principais problemas resolvidos com Backtracking

- **Permutação**: Gerar todas as permutações de um conjunto de números.
  - _**Exemplo**: Gerar todas as permutações do conjunto {1, 2, 3} resulta em {1, 2, 3}, {1, 3, 2}, {2, 1, 3}, {2, 3, 1}, {3, 1, 2}, {3, 2, 1}._
- **Combinação**: Gerar todas as combinações de um conjunto de números.
  - _**Exemplo**: Gerar todas as combinações do conjunto {1, 2, 3} resulta em {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}._
- **Subconjunto**: Gerar todos os subconjuntos de um conjunto de números.
  - _**Exemplo**: Gerar todos os subconjuntos do conjunto {1, 2, 3} resulta em {}, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}._
- **Problema das N-rainhas**: Colocar N rainhas em um tabuleiro de xadrez de forma que nenhuma rainha ataque outra.
  - _**Exemplo**: Para N=4, uma solução é colocar as rainhas nas posições (0, 1), (1, 3), (2, 0), (3, 2)._
- **Problema do Sudoku**: Resolver um quebra-cabeça de Sudoku preenchendo os números de forma que cada linha, coluna e subgrade 3x3 contenha todos os números de 1 a 9.
  - _**Exemplo**: Resolver um quebra-cabeça de Sudoku 9x9 preenchendo os números de forma que cada linha, coluna e subgrade 3x3 contenha todos os números de 1 a 9._

## Backtracking na prática em problemas reais

- **Jogos**: Resolver quebra-cabeças, como Sudoku, e jogos de tabuleiro, como o problema das N-rainhas.
- **Otimização**: Encontrar a melhor solução para problemas de otimização, como o problema do caixeiro viajante.
- **Inteligência Artificial**: Resolver problemas de busca em inteligência artificial, como jogos de tabuleiro e quebra-cabeças.
- **Análise Combinatória**: Gerar combinações e permutações de conjuntos de dados.

## Conceitos importantes

- **Solução parcial**: Uma solução que não é completa, mas pode ser estendida para uma solução completa.
- **Solução completa**: Uma solução que atende a todos os requisitos do problema.
- **Espaço de busca**: O conjunto de todas as soluções possíveis para o problema.
- **Caminho**: Uma sequência de decisões que leva a uma solução parcial ou completa.
- **Corte**: Uma decisão que não leva a uma solução válida e, portanto, não precisa ser explorada.
- **Podas**: Técnicas usadas para eliminar partes do espaço de busca que não precisam ser exploradas.
- **Heurísticas**: Estratégias usadas para guiar a busca em direção a soluções mais promissoras.
- **Recursão**: Uma técnica de programação onde uma função chama a si mesma para resolver subproblemas.
- **Backtracking**: O processo de voltar atrás e tentar outra abordagem quando uma solução não é válida ou não leva a uma solução completa.

## Complexidade assintótica do Backtracking

A complexidade do algoritmo de **Backtracking** depende do problema específico e da implementação. No entanto, em geral, a complexidade pode ser expressa como:

```math
O(b^d)
```

onde:

- `b` é o fator de ramificação (o número de opções disponíveis em cada nível da árvore de busca).
- `d` é a profundidade da solução (o número máximo de níveis na árvore de busca).

Tabela com exemplos de complexidade, pior, média e melhor caso:
| Problema | Pior Caso | Melhor Caso | Caso Médio |
|--------------------------|-----------|-------------|------------|
| Permutação | O(n!) | O(1) | O(n!) |
| Combinação | O(2^n) | O(1) | O(2^n) |
| Subconjunto | O(2^n) | O(1) | O(2^n) |
| Problema das N-rainhas | O(N!) | O(1) | O(N!) |
| Problema do Sudoku | O(9^n) | O(1) | O(9^n) |

## Como funciona o Algoritmo

O algoritmo de **Backtracking** funciona explorando todas as soluções possíveis para um problema, seguindo um caminho até encontrar uma solução completa ou até que não haja mais opções a serem exploradas. O algoritmo pode ser descrito em três etapas principais:

1. **Escolha**: Seleciona uma opção do conjunto de soluções possíveis.
2. **Exploração**: Verifica se a opção escolhida leva a uma solução válida. Se sim, continua explorando essa opção.
3. **Retrocesso**: Se a opção escolhida não leva a uma solução válida, o algoritmo retrocede e tenta outra opção.

### Passo a Passo Teórico

1. **Inicialização**: Comece com uma solução parcial vazia.
2. **Escolha**: Se a solução parcial não é completa, escolha uma opção do conjunto de soluções possíveis.
3. **Verificação**: Verifique se a solução parcial é válida.
   - Se for válida, adicione a opção à solução parcial e continue explorando.
   - Se não for válida, retroceda e escolha outra opção.
4. **Solução Completa**: Se a solução parcial é completa, armazene ou imprima a solução.
5. **Retrocesso**: Se não houver mais opções a serem exploradas, retroceda para a última decisão e escolha outra opção.
6. **Repetição**: Repita os passos 2 a 5 até que todas as soluções possíveis tenham sido exploradas.
7. **Finalização**: Quando todas as opções tiverem sido exploradas, o algoritmo termina.

### Pseudocódigo e Template

```plaintext
function backtrack(solution):
    if isComplete(solution):
        store(solution)
        return

    for option in options:
        if isValid(option):
            add(option, solution)
            backtrack(solution)
            remove(option, solution)
```

### Implementação em JavaScript

Problema: Gerar todas as sub conjunto (subset) de um conjunto de números.

```javascript
function backtrack(nums, start, path, result) {
  result.push([...path]);
  for (let i = start; i < nums.length; i++) {
    path.push(nums[i]); // Adiciona o número atual ao caminho
    backtrack(nums, i + 1, path, result); // Chama recursivamente
    path.pop(); // Remove o último número do caminho (retrocesso)
  }
}

function generateSubSets(nums) {
  const result = [];
  backtrack(nums, 0, [], result);
  return result;
}

const nums = [1, 2, 3];
const result = generateSubSets(nums);
console.log(result); // Exibe todas os subconjuntos
// Exibe: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
```

## Variações do Backtracking

- **Backtracking com Podas**: Utiliza técnicas de poda para eliminar partes do espaço de busca que não precisam ser exploradas.
- **Backtracking com Heurísticas**: Utiliza heurísticas para guiar a busca em direção a soluções mais promissoras.
- **Backtracking com Recursão**: Utiliza recursão para explorar soluções parciais e completas.
- **Backtracking Iterativo**: Utiliza uma abordagem iterativa em vez de recursiva para explorar soluções.
- **Backtracking com Memorização**: Utiliza memorização para armazenar soluções parciais já calculadas e evitar cálculos repetidos.
- **Backtracking com Programação Dinâmica**: Combina técnicas de backtracking e programação dinâmica para resolver problemas complexos.
- **Backtracking com Algoritmos Genéticos**: Utiliza técnicas de algoritmos genéticos para explorar soluções em um espaço de busca complexo.
- **Backtracking com Algoritmos de Busca**: Combina técnicas de backtracking com algoritmos de busca para explorar soluções em um espaço de busca complexo.
- Entre muitas outras variações.

## Apendix

### Qual a diferença entre Backtracking e Programação Dinâmica?

A principal diferença entre **Backtracking** e **Programação Dinâmica** é a abordagem que cada técnica usa para resolver problemas. O **Backtracking** explora todas as soluções possíveis, enquanto a **Programação Dinâmica** divide o problema em subproblemas menores e resolve cada um deles apenas uma vez, armazenando os resultados para evitar cálculos repetidos.

### Qual a diferença entre Permutação, Combinação e Subconjunto?

- **Permutação**: Uma permutação é uma disposição de todos os elementos de um conjunto em uma ordem específica. Por exemplo, as permutações do conjunto {1, 2} são {1, 2} e {2, 1}.
- **Combinação**: Uma combinação é uma seleção de elementos de um conjunto, sem considerar a ordem. Por exemplo, as combinações do conjunto {1, 2} são {1, 2}.
- **Subconjunto**: Um subconjunto é qualquer conjunto que pode ser formado a partir de um conjunto original, incluindo o conjunto vazio e o próprio conjunto. Por exemplo, os subconjuntos do conjunto {1, 2} são {}, {1}, {2} e {1, 2}.

Em inglês:

- Permutacão: Permutation
- Combinação: Combination
- Subconjunto: Subset

## Referências

- [Repositorio com exemplos do encontro](https://github.com/giovannymassuia/DS-A/tree/main/node-dsa/backtracking)
- [Backtracking - Wikipedia](https://en.wikipedia.org/wiki/Backtracking)
- [Jeff Erickson Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/)
  - [Backtracking - Jeff Erickson](https://jeffe.cs.illinois.edu/teaching/algorithms/book/02-backtracking.pdf)
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-to-backtracking-2/)
- LeetCode
  - [257. Binary Tree Paths (easy)](https://leetcode.com/problems/binary-tree-paths/description/?envType=problem-list-v2&envId=backtracking)
  - [46. Permutations (medium)](https://leetcode.com/problems/permutations/description/?envType=problem-list-v2&envId=backtracking)
  - [78. Subsets (medium)](https://leetcode.com/problems/subsets/description/?envType=problem-list-v2&envId=backtracking)
  - [79. Word Search (medium)](https://leetcode.com/problems/word-search/description/?envType=problem-list-v2&envId=backtracking)
  - [37. Sudoku Solver (hard)](https://leetcode.com/problems/sudoku-solver/description/?envType=problem-list-v2&envId=backtracking)
