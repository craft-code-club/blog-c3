---
title: 'Grafos: Dicas e Truques'
date: '2025-02-16'
description: 'O algoritmo A* (A-Star) é uma abordagem eficiente para encontrar o caminho mais curto em grafos, combinando heurísticas e custo real. Usado em jogos, IA e navegação, garante soluções ótimas quando a heurística é bem definida.'
topics: ['algoritmos', 'grafos']
authors:
  - name: 'Nelson Nobre'
    link: 'https://github.com/NelsonBN'
---

## Grafos no dia a dia

Grafos são um dos tópicos mais importantes da ciência da computação, com aplicações em diversas áreas, como redes, jogos, IA e navegação. E grafos também têm uma grande fundamentação em conceitos matemáticos, como teoria dos grafos e álgebra linear.

No entanto, por se tratar de um tópico mais avançado, muitas vezes é difícil identificar ou relacionar os grafos como solução para problemas do dia a dia. Por isso, neste artigo, vamos explorar algumas dicas e truques para facilitar a compreensão e aplicação de grafos em problemas práticos e treinarmos a nossa compreensão abstrata dos problemas e linkar com a opetinizade de uso de grafos.


## Formas de representação de grafos

Uma das primeiras coisas que devemos entender é que existem várias formas de representar um grafo, cada uma com suas vantagens e desvantagens. As mais comuns são:


### 1. Matriz de Adjacência
- Utiliza uma **matriz bidimensional (n x n)**, onde `n` é o número de vértices.
- Se existe uma aresta entre os vértices `u` e `v`, então `matrix[u][v] = 1`, caso contrário, `matrix[u][v] = 0`.
- Ou no caso de grafos ponderados, `matrix[u][v] = peso`, caso contrário, `matrix[u][v] = infinito` ou outro valor que represente a ausência de aresta.

**Vantagens**:
- Acesso rápido a uma aresta específica em **O(1)**.
- Simples de implementar.

**Desvantagens**:
- Ocupa **O(V²)** de espaço, mesmo que o grafo tenha poucas arestas (esparsos).
- Ineficiente para grafos esparsos.


#### Grafos não orientados

```mermaid
graph LR
  A((A)) <--> B
  A <--> D((D))
  B((B)) <--> C
  B <--> D
  C((C)) <--> D
```

|   | A | B | C | D |
|---|---|---|---|---|
| A | 0 | 1 | 0 | 1 |
| B | 1 | 0 | 1 | 1 |
| C | 0 | 1 | 0 | 1 |
| D | 1 | 1 | 1 | 0 |

**Observações**:
- Quando trabalhamos com grafos não orientados, podemos observar que a matriz de adjacência é simétrica em relação à diagonal principal. Isso ocorre porque a relação entre os vértices `u` e `v` é a mesma que entre `v` e `u`.

**Exemplo**:
```python
class GraphMatrix:
  def __init__(self, size):
    self.matrix = [[0] * size for _ in range(size)]
    self.size = size

  def add_edge(self, u, v):
    self.matrix[u][v] = 1
    self.matrix[v][u] = 1

  def remove_edge(self, u, v):
    self.matrix[u][v] = 0
    self.matrix[v][u] = 0

  def display_matrix(self):
    print("Adjacency Matrix:")

    for row in self.matrix:
      print(row)

  def display_edges(self):
    print("Edges:")

    for u in range(self.size):
      for v in range(self.size):
        if self.matrix[u][v] == 1:
          print(f"Edge {u} -> {v}")


graph = GraphMatrix(4)

graph.add_edge(0, 1)
graph.add_edge(1, 2)
graph.add_edge(2, 3)
graph.add_edge(3, 0)

graph.display_matrix()
graph.display_edges()
```

#### Grafos orientados

```mermaid
graph LR
  A((A)) --> B
  A --> D
  B((B)) --> A
  B --> C
  B --> D
  C((C)) --> B
  C --> D
  D((D)) --> C
```

|   | A | B | C | D |
|---|---|---|---|---|
| A | 0 | 1 | 0 | 1 |
| B | 1 | 0 | 1 | 1 |
| C | 0 | 1 | 0 | 1 |
| D | 0 | 0 | 1 | 0 |

**Exemplo**:
```python
class GraphMatrix:
  def __init__(self, size):
    self.matrix = [[0] * size for _ in range(size)]
    self.size = size

  def add_edge(self, u, v):
    self.matrix[u][v] = 1

  def display_matrix(self):
    print("Adjacency Matrix:")

    for row in self.matrix:
      print(row)

  def display_edges(self):
    print("Edges:")

    for u in range(self.size):
      for v in range(self.size):
        if self.matrix[u][v] == 1:
          print(f"Edge {u} -> {v}")


graph = GraphMatrix(4)

graph.add_edge(0, 1)
graph.add_edge(1, 2)
graph.add_edge(2, 3)
graph.add_edge(3, 0)

graph.display_matrix()
graph.display_edges()
```


### 2. Lista de Adjacência
- Utiliza uma **lista de listas**, onde cada índice representa um vértice e a lista contém seus vizinhos.
- Ou uma **Hash Table** onde a chave é o vértice e o valor é uma outra Hash Table ou lista com os vizinhos.

**Vantagens**:
- Economiza espaço **O(V + E)** (ótimo para grafos esparsos).
- Melhor para percorrer vizinhos de um nó (**O(k)** onde `k` é o número de vizinhos).
  - No caso de utilizarmos uma Hash Table, podemos acessar diretamente a um vizinho, reduzindo a complexidade para **O(1)**.

**Desvantagens**:
- Acesso a uma aresta específica é **O(E)** (precisa percorrer a lista).
  - Mas como mencionado anteriormente, quando é utilizado uma Hash Table, o acesso é **O(1)**.

**Exemplo**:
```mermaid
graph LR
  A((A)) --> |3| B
  A --> |2| D
  B((B)) --> |1| A
  B --> |3| C
  B --> |4| D
  C((C)) --> |2| B
  C --> |1| D
  D((D)) --> |2| C
```
```python
graph = {
  'A': { 'B': 3, 'D': 2 },
  'B': { 'A': 1, 'C': 3, 'D': 4 },
  'C': { 'B': 2, 'D': 1 },
  'D': { 'C': 2 }
}
```
```python
class Graph:
  def __init__(self):
    self.graph = {}

  def add_edge(self, u, v, weight):
    if u not in self.graph:
      self.graph[u] = {}

    if v not in self.graph:
      self.graph[v] = {}

    self.graph[u][v] = weight

  def display_edges(self):
    print("Edges:")

    for node in self.graph:
      for (neighbor, cost) in self.graph[node].items():
        print(f"Edge {node} --{cost}-> {neighbor}")


graph = Graph()

graph.add_edge('A', 'B', 3)
graph.add_edge('A', 'D', 2)
graph.add_edge('B', 'A', 1)
graph.add_edge('B', 'C', 3)
graph.add_edge('B', 'D', 4)
graph.add_edge('C', 'B', 2)
graph.add_edge('C', 'D', 1)
graph.add_edge('D', 'C', 2)

graph.display_edges()
```


### 3. Lista de Arestas
- Armazena o grafo como uma lista de tuplas `(u, v, peso)`, onde `u` e `v` são vértices e `peso` é opcional. A ordem dos elementos na tupla pode variar dependendo da implementação.

**Vantagens**:
- Compacta (mais útil em algoritmos como Kruskal).
- Simples de implementar.

**Desvantagens**:
- Ineficiente para buscar vizinhos de um nó específico.

**Exemplo**:
```mermaid
graph LR
  A((A)) <--> |3| B
  A <--> |2| D
  B((B)) <--> |3| C
  B <--> |4| D
  C((C)) <--> |2| D((D))
```
```python
edges = [
  (3, 'A', 'B'),
  (2, 'A', 'D'),
  (3, 'B', 'C'),
  (4, 'B', 'D'),
  (2, 'C', 'D')
]
```
```python
class Graph:
  def __init__(self):
    self.edges = []

  def add_edge(self, u, v, weight):
    self.edges.append((weight, u, v))

  def remove_edge(self, u, v):
    for edge in self.edges:
      if edge[1] == u and edge[2] == v:
        self.edges.remove(edge)
        break
      elif edge[1] == v and edge[2] == u:
        self.edges.remove(edge)
        break

  def display_edges(self):
    print("Edges:")

    for edge in self.edges:
      print(f"Edge {edge[1]} --{edge[0]}-> {edge[2]}")


graph = Graph()

graph.add_edge('A', 'B', 3)
graph.add_edge('A', 'D', 2)

graph.add_edge('A', 'C', 9)
graph.remove_edge('A', 'C')

graph.add_edge('B', 'C', 3)
graph.add_edge('B', 'D', 4)
graph.add_edge('D', 'C', 2)

graph.display_edges()
```


### Comparação das Representações

| Representação            | Espaço | Inserção | Remoção | pesquicar de Aresta |
|--------------------------|--------|----------|---------|---------------------|
| **Matriz de Adjacência** | O(V^2) | O(1)     | O(1)    | O(1)                |
| **Lista de Adjacência**  | O(V+E) | O(1)     | O(E)    | O(1)                |
| **Lista de Arestas**     | O(E)   | O(1)     | O(E)    | O(E)                |

**Quando usar cada uma?**
- **Matriz de Adjacência**: Quando o grafo for **denso** (muitas arestas) e precisarmos de pesquisas rápidas em `O(1)`.
- **Lista de Adjacência**: Quando o grafo for **esparso** (poucas arestas) e queremos eficiência no uso de memória.
- **Lista de Arestas**: Quando estivermos a trabalhar com **algoritmos de grafos como Kruskal**, onde a lista de arestas é essencial.



## Referências
- [Código com exemplos](https://github.com/NelsonBN/algorithms-data-structures-graphs)
