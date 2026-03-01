# Cognition

Aplicação web com Next.js.

## Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm

## 1) Clonar o repositório

```bash
git clone https://github.com/jefersonprimer/cognition.git
cd cognition
```

## 2) Instalar dependências

```bash
npm install
```

## 3) Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Depois, abra o `.env` e preencha os valores.

Variáveis obrigatórias:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

Variáveis opcionais (necessárias para envio de e-mail de recuperação de senha):

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

## 4) Iniciar o projeto

```bash
npm run dev
```

Abra `http://localhost:3000` no navegador.
