# Documentação do Projeto Notion

## 1. Visão Geral

Este é um aplicativo de anotações full-stack, construído com um backend em Node.js e um frontend mobile em React Native (Expo). O projeto permite que usuários se cadastrem, façam login, gerenciem notas (CRUD), e recuperem suas contas. As funcionalidades incluem um sistema de lixeira, busca de notas e exclusão de conta.

---

## 2. Tech Stack

**Backend:**
- **Node.js**
- **Express**: Framework web.
- **TypeScript**: Para tipagem estática.
- **Supabase**: Usado como banco de dados (PostgreSQL) e para autenticação (GoTrue).

**Frontend:**
- **React Native**
- **Expo**: Para desenvolvimento e build do aplicativo.
- **TypeScript**
- **Expo Router**: Para roteamento baseado em arquivos.
- **Axios**: Para chamadas à API.

---

## 3. Estrutura do Projeto

O projeto é um monorepo com duas pastas principais:

- `/backend`: Contém a API em Node.js.
  - `src/domain`: Lógica de negócio principal (entidades, casos de uso, interfaces de repositório).
  - `src/application`: Implementação dos casos de uso.
  - `src/infrastructure`: Implementação dos repositórios que interagem com o Supabase.
  - `src/presentation`: A camada da API (controllers, rotas e middlewares).
  - `src/main`: Ponto de entrada do servidor e as "fábricas" que conectam as dependências.

- `/notion`: Contém o aplicativo mobile em Expo.
  - `app`: As telas do aplicativo, usando o roteamento do Expo Router.
  - `components`: Componentes reutilizáveis (ex: cabeçalho, itens de lista).
  - `context`: Contexto de autenticação para gerenciamento de estado global.
  - `hooks`: Hooks customizados (ex: `useDebounce`).
  - `lib`: Configuração de bibliotecas (ex: `axios`).

---

## 4. Setup e Instalação

### Backend

1.  Navegue até a pasta `backend`:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` na raiz da pasta `backend`.
4.  Preencha o arquivo `.env` com as suas chaves do Supabase. Você pode encontrá-las no painel do seu projeto em **Project Settings > API**.

    ```dotenv
    # URL do seu projeto Supabase
    SUPABASE_URL=SUA_URL_AQUI

    # Chave ANÔNIMA PÚBLICA do seu projeto
    SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI

    # Chave secreta JWT para validar os tokens de usuário
    # Encontrada em Project Settings > API > JWT Settings
    JWT_SECRET=SUA_CHAVE_SECRETA_JWT_AQUI
    ```

### Frontend

1.  Navegue até a pasta `notion`:
    ```bash
    cd notion
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```

---

## 5. Como Executar

Você precisará de dois terminais abertos.

1.  **Para iniciar o Backend:**
    ```bash
    cd backend
    npm run dev
    ```
    O servidor backend estará rodando em `http://localhost:3000`.

2.  **Para iniciar o Frontend:**
    ```bash
    cd notion
    npm start
    ```
    O Expo Dev Client abrirá. Você pode então escolher rodar o aplicativo no seu celular (via QR code) ou em um emulador de Android/iOS.

---

## 6. Endpoints da API

A URL base da API é `http://localhost:3000/api`.

### Rotas de Usuário (`/users`)

- `POST /signup`: Cria um novo usuário.
- `POST /login`: Autentica um usuário e retorna um token.
- `POST /forgot-password`: Inicia o fluxo de recuperação de senha.
- `POST /reset-password`: Finaliza o fluxo de recuperação de senha.
- `DELETE /me` **(Protegida)**: Deleta a conta do usuário autenticado.

### Rotas de Notas (`/notes`)

**Todas as rotas de notas são protegidas e exigem autenticação.**

- `GET /`: Lista todas as notas ativas do usuário.
- `POST /`: Cria uma nova nota.
- `GET /search`: Busca notas por título ou descrição (ex: `/search?q=texto`).
- `GET /trash`: Lista as notas na lixeira.
- `GET /:id`: Retorna uma nota específica.
- `PUT /:id`: Atualiza uma nota.
- `DELETE /:id`: Move uma nota para a lixeira (soft delete).
- `POST /:id/restore`: Restaura uma nota da lixeira.
- `DELETE /:id/permanent`: Deleta uma nota permanentemente da lixeira.
