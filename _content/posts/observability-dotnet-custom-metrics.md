---
title: 'Métricas Personalizadas em .NET'
date: '2025-02-15'
description: 'Aprenda a implementar métricas personalizadas em .NET. Contadores, UpDownCounters, Gauges e Histograms—para aprimorar a observabilidade em suas aplicações.'
tags: ['.NET', 'Observabilidade']
authors:
  - name: 'Nelson Nobre'
    link: 'https://github.com/NelsonBN'
---

# Observabilidade - Métricas Personalizadas em .NET

## API de Métricas do .NET

O .NET oferece suporte a quatro tipos de métricas: `Counter`, `UpDownCounter`, `Gauge` e `Histogram`. E também fornece duas abordagens para atualizar métricas: `Direct` e `Observer`.


### Counter

Um `Counter` é um tipo de métrica cumulativa que representa um valor monotonicamente crescente, que só pode aumentar.

#### Quando usar

* Número de requisições processadas
* Número de erros ocorridos
* Número de pagamentos processados

#### Abordagem Direta

```csharp
using System.Collections.Generic;
using System.Diagnostics.Metrics;

var meter = new Meter("App");
var requestCounter = meter.CreateCounter<int>("http_requests");

requestCounter.Add(1);
```

#### Abordagem de observação

```csharp
using System.Collections.Generic;
using System.Diagnostics.Metrics;

var meter = new Meter("App");

var messageProcessedCounter = 0;

meter.CreateObservableCounter<int>(
    name: "messages_processed",
    observeValue: () => messageProcessedCounter,
    unit: "items",
    description: "Total number of messages processed by the queue");

Interlocked.Increment(ref messageProcessedCounter);
```

![Counter](https://raw.githubusercontent.com/NelsonBN/observability-dotnet-custom-metrics/refs/heads/main/media/counter.svg)


### UpDownCounter

Um `UpDownCounter` é semelhante a um `Counter`, mas permite tanto incrementarmos quanto decrementarmos valores da metrica. Isso o torna útil para rastrear valores que podem flutuar ao longo do tempo. O valor seguinte sempre depende do valor anterior.

#### Quando usar

* Número de utilizadores online
* Quantidade de itens numa fila
* Número de threads ativas

#### Abordagem Direta

```csharp
using System.Collections.Generic;
using System.Diagnostics.Metrics;

var meter = new Meter("App");
var numberOfUsers = meter.CreateUpDownCounter<int>("number_users");

numberOfUsers.Add(1);
numberOfUsers.Add(-1);
```

#### Abordagem de observação

```csharp
using System.Collections.Generic;
using System.Diagnostics.Metrics;

var meter = new Meter("App");

var queuePendingItems = 0;

meter.CreateObservableUpDownCounter(
    name: "queue_pending",
    observeValue: () => queuePendingItems,
    unit: "items",
    description: "Number of items in the queue");

Interlocked.Increment(ref queuePendingItems);
Interlocked.Decrement(ref queuePendingItems);
```

![UpDownCounter](https://raw.githubusercontent.com/NelsonBN/observability-dotnet-custom-metrics/refs/heads/main/media/up-down-counter.svg)


### Gauge

Um `Gauge` é uma métrica que representa um único valor numérico que pode subir e descer de forma arbitrária. Um `Gauge` representa um snapshot de um valor. Cada valor registado é independente do anterior.

#### Quando usar

* Uso de memória
* Uso de CPU
* Temperatura

#### Abordagem Direta

```csharp
using System.Diagnostics;
using System.Diagnostics.Metrics;

var meter = new Meter("App");
var queueProcessingTime = meter.CreateGauge<double>(
    "queue_processing_time",
    unit: "ms",
    description: "Average processing time of items in the queue");

var stopwatch = Stopwatch.StartNew();

// Operation

stopwatch.Stop();
queueProcessingTime.Record(stopwatch.ElapsedMilliseconds);
```

#### Abordagem de observação

```csharp
using System.Diagnostics;
using System.Diagnostics.Metrics;

var meter = new Meter("App");
meter.CreateObservableGauge(
    name: "memory_used",
    observeValue: () =>
    {
        using var process = Process.GetCurrentProcess();
        return process.WorkingSet64;
    },
    unit: "bytes",
    description: "Amount of memory used by the current process in bytes");
```

![Gauge](https://raw.githubusercontent.com/NelsonBN/observability-dotnet-custom-metrics/refs/heads/main/media/gauge.svg)


### Histogram

O `Histogram` mede a distribuição de valores ao longo do tempo. Ele agrupa valores em intervalos (buckets) pré-definidos e conta quantos valores se encaixam em cada uma das faixas.

**Example:**

Imagine os seguintes tempos de requisição em milissegundos: `[ 9, 24, 47, 75, 113, 421, 591, 891, 912, 1050, 1120, 1300, 1771, 1881, 5991 ]`

E os buckets: `[ 10, 50, 100, 200, 500, 1000, 5000 ]`

| Bucket  | Count | Description        |
|---------|-------|--------------------|
| <= 10   | 1     | Ultra rápido       |
| <= 50   | 3     | Rápido             |
| <= 100  | 4     | Normal             |
| <= 200  | 5     | Lento              |
| <= 500  | 6     | Muito lento        |
| <= 1000 | 9     | Extremamente lento |
| <= 5000 | 14    | Hiper lento        |
| < +Inf  | 15    | Outlier            |

Basicamente, o `Histogram` determina o bucket apropriado para cada valor e incrementa sua contagem. Os buckets são ordenados de forma crescente, com o último bucket sendo sempre `+Inf`. Quando um valor é registado, todos os buckets maiores ou iguais ao valor coletado são incrementados.

Com isso, é possível medir quantas requisições estão abaixo de um determinado limite.

#### Quando usar

* Padrões dos tempos de requisições
* Distribuição do tamanho de um payload
* Distribuição de uso de CPU

#### Abordagem Direta

```csharp
using System.Diagnostics;
using System.Diagnostics.Metrics;

var meter = new Meter("App");
var requestDuration = meter.CreateHistogram<double>(
    name: "request_duration",
    unit: "ms",
    description: "Duration of HTTP requests in milliseconds");

requestDuration.Record(100);
requestDuration.Record(200);

....

builder.Services
    .AddOpenTelemetry()
    .ConfigureResource(...)
    .WithMetrics(options => options
        .AddView(
            "request_duration",
            new ExplicitBucketHistogramConfiguration { Boundaries = [10, 50, 100, 200, 500, 1000, 5000] }));
```

![Histogram](https://raw.githubusercontent.com/NelsonBN/observability-dotnet-custom-metrics/refs/heads/main/media/histogram.svg)


## Tags - A Importância das Tags em Métricas

Tags (ou Labels no Prometheus) são dimensões adicionais que podem ser anexadas a uma métrica para segmentar os dados e obter insights mais granulares.

Em vez de ter uma única métrica global, com a tag é possível filtrar a métrica por diferentes categorias como por exemplo:
- Método HTTP (`GET`, `POST`, `DELETE`)
- Status da requisição (`200`, `400`, `500`)
- Nome do serviço
- Região do datacenter
- Tipo de utilizador (`free`, `premium`)

Sem tags, só sabemos o valor total. Com tags, podemos analisar cada dimensão separadamente!

### Por que usar Tags em métricas?
- Possibilitam segmentação e filtragem de dados → Exemplo: Em vez de apenas medir o total de requisições, podemos ver quantas foram `GET` vs. `POST`;
- Ajudam a analisar problemas e tendências → Exemplo: É possível verificar se um aumento no tempo de resposta ocorre somente em uma região específica (por exemplo, `us-east-1`);
- Reduzem a necessidade de criar múltiplas métricas separadas → Em vez de criar `http_requests_get`, `http_requests_post`, `http_requests_delete`, podemos usar uma única métrica `http_requests_total` e filtrar por `method="GET"`.

### Exemplo:


```csharp
using System.Collections.Generic;
using System.Diagnostics.Metrics;

var meter = new Meter("App");
var requestCounter = meter.CreateCounter<int>("http_requests");

requestCounter.Add(
    1,
    KeyValuePair.Create<string, object?>("method", "GET"),
    KeyValuePair.Create<string, object?>("status", "200"));
```

#### Output no Prometheus
O Prometheus armazena os dados como **labels (tags)** para permitir consultas detalhadas.

```plaintext
# TYPE http_requests_total counter
http_requests_total{method="GET", status="200"} 150
http_requests_total{method="POST", status="500"} 30
http_requests_total{method="DELETE", status="404"} 5
```
**Agora podemos consultar métricas detalhadas!**
- `http_requests_total{method="GET"}` → Total number of `GET` requests.
- `http_requests_total{status="500"}` → Total number of failed requests (`500`).



## Tools

### Prometheus

Na perspectiva do Prometheus, existem quatro tipos de métricas: `Counter`, `Gauge`, `Histogram`, e `Summary`. No entanto, vamos focar apenas na perspectiva do .NET e em como isso se relaciona com o Prometheus.

Só iremos mencionar alguns detalhes específicos que ocorrem quando as métricas são passadas do .NET para o Prometheus.

Para habilitar o OTLP receiver, é necessário configurar tanto o Prometheus receiver quanto o OTLP exporter em sua aplicação .NET.

[Prometheus OTLP receiver Docs](https://prometheus.io/docs/guides/opentelemetry/)


#### Counter do .NET para o Prometheus

Quando um `Counter` é utilizado no .NET, ele passado também como um `Counter` no Prometheus, no entanto é adicionado automaticamente o sufixo `_total` ao nome da métrica.


**Por exemplo:**

```csharp
Meter.CreateCounter<int>("http_requests");
```

```text
http_requests_total
```


#### UpDownCounter do .NET para o Prometheus

Quando usamos o `UpDownCounter` no .NET, ele é traduzido em um `Gauge` no Prometheus, pois pode tanto aumentar quanto diminuir, o que corresponde ao comportamento suportado por um `Gauge` no Prometheus.


#### Gauge do .NET para o Prometheus

Quando um `Gauge` é usado no .NET, ele também é traduzido em um `Gauge` no Prometheus. Se for especificada uma unidade no .NET, o Prometheus adiciona essa unidade como sufixo no nome da métrica.

**Por exemplo:**

```csharp
Meter.CreateGauge<int>(
    name: "temperature",
    unit: "celsius");
```

```text
temperature_celsius
```



## Exemplos

![Metrics Generator](https://github.com/NelsonBN/observability-dotnet-custom-metrics/raw/main/media/MetricsGenerator.png)
![Products](https://github.com/NelsonBN/observability-dotnet-custom-metrics/raw/main/media/Products.png)


## Referências

- [Código utilizado neste Post](https://github.com/NelsonBN/observability-dotnet-custom-metrics)
