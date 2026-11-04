# Cadastro de Usuários – CRUD com React + Vite

Aplicação que consome a API Spring Boot do roteiro (`/usuarios`) usando `useState`, `useEffect` e `fetch`.

## Como executar

Pré-requisitos: Node.js 18+ e a API Spring Boot rodando em `http://localhost:8080` (MySQL ligado).

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

## Estrutura

```
src/
├── App.jsx                  # Estados + TODAS as chamadas fetch (GET, POST, PUT, DELETE)
├── App.css
├── main.jsx
└── components/              # Somente apresentação (sem fetch)
    ├── SearchBar.jsx        # Campo de busca
    ├── UsuarioForm.jsx      # Formulário de cadastro/edição
    └── UserList.jsx         # Lista com botões Editar e Excluir
```

## Onde está cada conceito (tudo em `App.jsx`)

| Conceito | Função | Requisição |
|---|---|---|
| `useEffect(..., [])` | carrega os usuários ao abrir a aplicação | GET `/usuarios` |
| `useEffect(..., [usuarios])` | atualiza o título da aba quando a lista muda | — |
| `carregarUsuarios()` | lista (e botão "Recarregar usuários") | GET `/usuarios` |
| `cadastrar()` | cria um usuário | POST `/usuarios` |
| `atualizar()` | altera o usuário em edição | PUT `/usuarios/{id}` |
| `excluir()` | remove um usuário | DELETE `/usuarios/{id}` |

Estados: `usuarios`, `loading`, `erro` (dados da API); `form`, `editandoId`, `salvando` (formulário); `busca`, `aviso` (interface).

O mesmo formulário serve para cadastrar e editar: quando `editandoId` é `null` ele faz POST, caso contrário faz PUT.

## CORS

O proxy do `vite.config.js` encaminha `/usuarios` ao Spring Boot, então o back-end não precisa mudar. Alternativa: adicione `@CrossOrigin(origins = "http://localhost:5173")` no `UsuarioController` e troque `API_URL` em `App.jsx` por `"http://localhost:8080/usuarios"`.

## Observação sobre o back-end

O `PUT` com id inexistente gera `NullPointerException` no `UsuarioService` (resposta 500). A aplicação trata esse caso exibindo um aviso de erro.
