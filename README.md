# MUSA — Web

Frontend da plataforma MUSA. React 18 + Vite + React Router.

## Stack

- **Framework:** React 18
- **Build:** Vite 5
- **Routing:** React Router DOM 6
- **Data fetching:** TanStack Query 5
- **HTTP:** Axios
- **Deploy:** Vercel

## Setup local

### Pré-requisitos

- Node.js 18+
- API rodando em `http://localhost:3001` (ver [musa-api](https://github.com/pedromatheus2009-commits/Musa-api))

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Edite .env.local se necessário
```

Padrão: `VITE_API_URL=http://localhost:3001/api`

### 3. Iniciar servidor de desenvolvimento

```bash
npm run dev
# Site em http://localhost:5173
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (HMR) |
| `npm run build` | Build de produção (pasta `dist/`) |
| `npm run preview` | Preview do build de produção |

## Páginas

| Rota | Descrição |
|---|---|
| `/` | Landing page com grid de profissionais e busca |
| `/profissionais` | Lista completa com filtros |
| `/anunciar` | Formulário para anunciar serviços |
| `/feed` | Feed de conteúdo editorial |
| `/parcerias` | Página de parcerias |
| `/sobre` | Sobre a plataforma |
| `/planos` | Planos de assinatura |
| `/redefinir-senha` | Redefinição de senha |
| `/sucesso` | Confirmação de pagamento |

## Fluxo da profissional

1. Acessar o site → clicar em **Anunciar** ou **Entrar**
2. Criar conta (nome, email, senha) ou fazer login
3. Abrir o **Dashboard** (ícone de usuário na navbar)
4. Aba **Meu Perfil** → preencher portfólio (nome, serviços, cidade, foto, bio)
5. Aguardar aprovação admin
6. Perfil aparece na LP e na busca por nome

## Fluxo do admin

1. Logar com usuário admin
2. Dashboard → abas **Gerenciar Perfis**, **Feed MUSA**, **Parcerias**, **Resultados**
3. Aprovar/rejeitar perfis cadastrados

## Deploy (Vercel)

O arquivo `vercel.json` configura o rewrite de SPA automaticamente. Na primeira vez:

1. Importar repositório no [Vercel](https://vercel.com)
2. Configurar variável: `VITE_API_URL=https://sua-api.railway.app/api`
3. Deploy automático a cada push

## Protótipo original

O HTML estático original (referência de design) está em [`docs/prototype.html`](docs/prototype.html).
