# TODO List - Backend API

Sistema de gerenciamento de tarefas - API REST

## Tecnologias

- Node.js
- Express
- TypeScript
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # API controllers
├── routes/           # Route definitions
├── middleware/       # Express middleware
├── services/         # Business logic
├── utils/            # Utility functions
├── constants/        # Application constants
├── instances/        # Service instances
└── server.ts         # Application entry point
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente necessárias

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Produção

```bash
npm start
```

## Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## API Endpoints

### Health Check

```
GET /health
```

### API v1

Todos os endpoints da API estão disponíveis em `/api/v1`

- **External (Public)**: `/api/v1/external/*`
- **Internal (Authenticated)**: `/api/v1/internal/*`

## Estrutura de Resposta

### Sucesso

```json
{
  "success": true,
  "data": {}
}
```

### Erro

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Contribuição

Este projeto segue os padrões definidos na documentação de arquitetura backend.

## Licença

ISC