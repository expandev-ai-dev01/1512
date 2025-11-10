# TODO List - Sistema de Gerenciamento de Tarefas

## Descrição

Sistema completo de gerenciamento de tarefas com recursos avançados para organização e produtividade.

## Tecnologias

- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.11
- React Router DOM 6.26.2
- TanStack Query 5.59.20
- Tailwind CSS 3.4.14
- Axios 1.7.7
- Zustand 5.0.1
- React Hook Form 7.53.1
- Zod 3.23.8

## Funcionalidades

1. **Criação de Tarefas**: Crie tarefas com título, descrição, data de vencimento e prioridade
2. **Categorização**: Organize tarefas em categorias e listas personalizadas
3. **Prioridades**: Classifique tarefas por nível de importância (alta, média, baixa)
4. **Prazos**: Defina datas limite para conclusão das tarefas
5. **Marcação de Conclusão**: Marque tarefas como concluídas e visualize histórico
6. **Busca**: Encontre tarefas específicas por título, descrição ou categoria
7. **Notificações**: Receba alertas sobre tarefas próximas do vencimento
8. **Compartilhamento**: Compartilhe listas de tarefas com outros usuários
9. **Visualização em Calendário**: Veja suas tarefas em formato de calendário
10. **Sincronização**: Acesse suas tarefas em diferentes dispositivos

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx            # Componente raiz
│   └── router.tsx         # Configuração de rotas
├── pages/                 # Páginas da aplicação
│   ├── layouts/          # Layouts compartilhados
│   ├── Home/             # Página inicial
│   └── NotFound/         # Página 404
├── core/                  # Componentes e lógica compartilhada
│   ├── components/       # Componentes genéricos
│   ├── lib/              # Configurações de bibliotecas
│   ├── types/            # Tipos TypeScript globais
│   ├── utils/            # Funções utilitárias
│   └── constants/        # Constantes da aplicação
├── domain/               # Domínios de negócio (a serem implementados)
└── assets/               # Recursos estáticos
    └── styles/           # Estilos globais
```

## Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Configurar variáveis de ambiente no arquivo .env
```

## Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Lint do código
npm run lint
```

## Variáveis de Ambiente

- `VITE_API_URL`: URL base da API (padrão: http://localhost:3000)
- `VITE_API_VERSION`: Versão da API (padrão: v1)
- `VITE_API_TIMEOUT`: Timeout das requisições em ms (padrão: 30000)

## Arquitetura

O projeto segue uma arquitetura modular baseada em domínios:

- **App**: Configuração global e roteamento
- **Pages**: Componentes de página que orquestram domínios
- **Core**: Componentes e lógica compartilhada entre domínios
- **Domain**: Lógica de negócio organizada por domínio funcional

## Padrões de Código

- TypeScript strict mode habilitado
- ESLint para qualidade de código
- Tailwind CSS para estilização
- React Hook Form + Zod para formulários e validação
- TanStack Query para gerenciamento de estado do servidor
- Zustand para estado global (quando necessário)

## Integração com Backend

O frontend está configurado para integrar com a API REST do backend:

- **Endpoints Públicos**: `/api/v1/external/*` (sem autenticação)
- **Endpoints Autenticados**: `/api/v1/internal/*` (requer token)

A autenticação é gerenciada via tokens JWT armazenados no localStorage.

## Próximos Passos

A estrutura base está pronta para receber as implementações de features:

1. Implementar domínio de autenticação
2. Implementar domínio de tarefas
3. Implementar domínio de categorias
4. Implementar domínio de notificações
5. Implementar domínio de compartilhamento
6. Implementar visualização em calendário
7. Implementar sincronização multiplataforma

## Licença

Proprietary - Todos os direitos reservados