# Exchange Rate API

API para consultar e armazenar taxas de câmbio, com processamento assíncrono via fila, cache em Redis e persistência em PostgreSQL usando Prisma. Projetada com separação clara entre camadas de domínio, aplicação e infraestrutura.

## O que foi feito

- Integração com API de taxas de câmbio Open Exchange Rates para obter taxas mais recentes e históricas.
- Criação do caso de uso para busca e processamento: salva todas as moedas retornadas e também a moeda base com taxa 1.0.
- Processamento assíncrono de eventos via RabbitMQ (publicação/consumo).
- Cache de resultados em Redis para acelerar respostas subsequentes.
- Ajuste de precisão no campo `rate` para evitar overflow numérico (Decimal(20,10)).
- Correções de DI e inicialização de componentes (Prisma, Worker de fila).
- Endpoint passa de `PROCESSING` para `SUCCESS` quando os dados são processados e disponíveis.

## Tecnologias

- Node.js, TypeScript, NestJS.
- PostgreSQL + Prisma ORM.
- Redis (ioredis) para cache.
- RabbitMQ (amqp-connection-manager / amqplib) para filas.
- Docker para infraestrutura local (Postgres, Redis, RabbitMQ).

## Arquitetura

- Domain: contratos e tokens de repositórios/eventos.
- Application: casos de uso orquestram cache, filas e persistência.
- Infra: implementações concretas (DB, HTTP client, Cache, Queue).
- Event-driven: requisições publicam eventos; workers consomem e processam.
- Cache-first: tenta Redis, senão publica evento e consulta BD em seguida.

Estrutura de fluxo:
1. `GET /exchange/:currency` verifica cache. Se não houver, publica evento e retorna `PROCESSING`.
2. Worker consome o evento, busca taxas na API, salva todas as moedas e a moeda base, popula Redis.
3. Próxima chamada retorna `SUCCESS` com dados.

## Endpoints

- `GET /exchange/:currency` — última taxa para a moeda solicitada.
- `GET /exchange/history/:currency/:date` — taxa histórica (YYYY-MM-DD).

## Variáveis de ambiente

Exemplo de `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/exchange_db
REDIS_HOST=localhost
REDIS_PORT=6379
RABBITMQ_URL=amqp://myuser:mypassword@localhost:5673
```

## Execução

Infraestrutura:
```bash
docker compose up -d
```

Aplicação:
```bash
npm install
npx prisma migrate dev
npm run start
```

## Princípios e boas práticas

- Separação de camadas (Domain/Application/Infra) e DI via tokens.
- SOLID (responsabilidade única nos casos de uso e repositórios).
- Resiliência: processamento assíncrono, cache e reprocessamento simples.
- Observabilidade mínima via logs.

## Notas sobre a API externa

- Open Exchange Rates retorna todas as taxas relativas à moeda base informada (`from=USD`, por exemplo).
- O sistema salva todas as moedas retornadas e também persiste a moeda base com `rate = 1.0`.
- Isso evita que a consulta da moeda base fique em `PROCESSING` indefinidamente.
