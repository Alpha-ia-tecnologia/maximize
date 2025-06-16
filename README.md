# SAG - Sistema de Avaliação e Gerenciamento

Um sistema completo para gerenciamento de escolas, turmas, alunos e avaliações escolares, com análise de desempenho e geração de relatórios.

## Tecnologias Utilizadas

- **Backend**: Node.js, TypeScript, Express
- **ORM**: Prisma
- **Banco de Dados**: MySQL 
- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS

## Estrutura do Projeto

```
sag-sistema/
├── prisma/               # Configuração do Prisma ORM
│   ├── schema.prisma     # Modelo de dados Prisma
│   ├── migrations/       # Migrações de banco de dados
│   └── seed.ts           # Dados iniciais para o banco
├── src/                  # Código fonte do backend
│   ├── api/              # Implementação da API
│   ├── config/           # Configurações da aplicação
│   ├── controllers/      # Controladores da API
│   ├── models/           # Modelos de dados
│   ├── routes/           # Rotas da API
│   ├── app.ts            # Configuração do Express
│   └── server.ts         # Ponto de entrada da aplicação
├── .env                  # Variáveis de ambiente
├── package.json          # Dependências do projeto
└── tsconfig.json         # Configuração do TypeScript
```

## Funcionalidades

- Gerenciamento de escolas, turmas e alunos
- Criação e aplicação de avaliações
- Geração de gabaritos para correção
- Relatórios de desempenho por aluno, turma e habilidades
- Análise de proficiência baseada na BNCC (Base Nacional Comum Curricular)
- Autenticação e controle de acesso por perfil

## Requisitos

- Node.js 18+ instalado localmente
- MySQL 8+ (instalado localmente ou em container)
- npm ou yarn

## Como Executar o Projeto

### 1. Verificar a Disponibilidade do MySQL

Certifique-se de que o MySQL está instalado e rodando localmente ou em um container. A conexão deve estar configurada no arquivo `.env` como:

```
DATABASE_URL="mysql://sag_user:sag_password@localhost:3306/sag_sistema"
```

Ajuste os valores conforme suas credenciais locais.

### 2. Instalar as Dependências

```bash
npm install
```

### 3. Aplicar as Migrações do Banco de Dados

```bash
# Gerar o cliente Prisma
npm run prisma:generate

# Aplicar migrações
npm run prisma:migrate

# Popular o banco com dados iniciais (opcional)
npm run prisma:seed
```

### 4. Compilar e Executar a API

```bash
# Compilar o TypeScript
npm run build

# Iniciar a API em modo produção
npm start

# OU para desenvolvimento com hot reload
npm run dev
```

A API estará disponível em http://localhost:3000/api/v1

## Resolução de Problemas

Se encontrar problemas com o Prisma:

```bash
# Limpar cache do Prisma e regenerar
npm run prisma:reset

# Reconstruir o projeto
npm run rebuild
```

### Problemas com MySQL

Verifique se:
1. O MySQL está rodando (serviço ativo)
2. A porta 3306 está liberada
3. O usuário e senha no DATABASE_URL estão corretos
4. O banco de dados `sag_sistema` existe

Para visualizar e gerenciar o banco de dados via Prisma:
```bash
npm run prisma:studio
```

## API RESTful

A API segue o padrão RESTful com os seguintes endpoints principais:

- `/api/v1/escolas` - Gerenciamento de escolas
- `/api/v1/turmas` - Gerenciamento de turmas
- `/api/v1/alunos` - Gerenciamento de alunos
- `/api/v1/provas` - Gerenciamento de provas
- `/api/v1/usuarios` - Gerenciamento de usuários
- `/api/v1/auth` - Autenticação e controle de acesso

## Licença

Este projeto é licenciado sob a licença ISC. 