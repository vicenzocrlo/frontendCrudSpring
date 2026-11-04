import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import UsuarioForm from "./components/UsuarioForm";
import UserList from "./components/UserList";

// Endereço da API. O proxy do Vite (vite.config.js) encaminha "/usuarios" ao Spring Boot.
// Para chamar direto, troque por "http://localhost:8080/usuarios" e use @CrossOrigin no controller.
const API_URL = "/usuarios";

const FORM_VAZIO = { nome: "", email: "" };

// Todas as chamadas fetch da aplicação ficam neste arquivo:
//   carregarUsuarios() → GET
//   cadastrar()        → POST
//   atualizar()        → PUT
//   excluir()          → DELETE
// Os componentes em /components apenas exibem dados e avisam o App quando algo acontece.
function App() {
  // --- Dados da API ---
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // --- Formulário ---
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null); // null = cadastrando | número = editando
  const [salvando, setSalvando] = useState(false);

  // --- Busca e avisos ---
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState(null); // { tipo: "sucesso" | "erro", texto: "..." }

  // ---------------------------------------------------------------
  // GET /usuarios → lista todos os usuários
  // ---------------------------------------------------------------
  function carregarUsuarios() {
    setLoading(true);
    setErro("");

    fetch(API_URL)
      .then((res) => {
        // fetch só dá erro em falha de rede; status 4xx/5xx precisamos checar manualmente
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((dados) => {
        setUsuarios(dados);
        setLoading(false);
      })
      .catch(() => {
        setErro("Não foi possível carregar os usuários. Confira se a API está rodando na porta 8080.");
        setLoading(false);
      });
  }

  // Array de dependência vazio: executa uma única vez, quando a aplicação abre.
  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Executa sempre que a lista muda e mostra o total na aba do navegador.
  useEffect(() => {
    document.title = `Usuários (${usuarios.length})`;
  }, [usuarios]);

  // ---------------------------------------------------------------
  // POST /usuarios → cadastra um novo usuário
  // ---------------------------------------------------------------
  function cadastrar() {
    setSalvando(true);

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form), // sem id: o banco gera (auto incremento)
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json(); // a API devolve o usuário salvo, já com id
      })
      .then((criado) => {
        setUsuarios((anterior) => [...anterior, criado]);
        limparFormulario();
        setAviso({ tipo: "sucesso", texto: `${criado.nome} foi cadastrado.` });
        setSalvando(false);
      })
      .catch(() => {
        setAviso({ tipo: "erro", texto: "Não foi possível cadastrar. Tente novamente." });
        setSalvando(false);
      });
  }

  // ---------------------------------------------------------------
  // PUT /usuarios/{id} → atualiza um usuário existente
  // ---------------------------------------------------------------
  function atualizar() {
    setSalvando(true);

    fetch(`${API_URL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((atualizado) => {
        // troca na lista apenas o usuário alterado
        setUsuarios((anterior) =>
          anterior.map((u) => (u.id === atualizado.id ? atualizado : u))
        );
        limparFormulario();
        setAviso({ tipo: "sucesso", texto: `${atualizado.nome} foi atualizado.` });
        setSalvando(false);
      })
      .catch(() => {
        setAviso({ tipo: "erro", texto: "Não foi possível atualizar. O usuário ainda existe?" });
        setSalvando(false);
      });
  }

  // ---------------------------------------------------------------
  // DELETE /usuarios/{id} → exclui um usuário
  // ---------------------------------------------------------------
  function excluir(usuario) {
    if (!window.confirm(`Excluir ${usuario.nome}?`)) return;

    fetch(`${API_URL}/${usuario.id}`, { method: "DELETE" })
      .then((res) => {
        // A API responde sem corpo, então não chamamos res.json() aqui.
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setUsuarios((anterior) => anterior.filter((u) => u.id !== usuario.id));
        if (editandoId === usuario.id) limparFormulario();
        setAviso({ tipo: "sucesso", texto: `${usuario.nome} foi excluído.` });
      })
      .catch(() => {
        setAviso({ tipo: "erro", texto: "Não foi possível excluir. Tente novamente." });
      });
  }

  // ---------------------------------------------------------------
  // Funções de apoio (sem fetch)
  // ---------------------------------------------------------------
  function limparFormulario() {
    setForm(FORM_VAZIO);
    setEditandoId(null);
  }

  function iniciarEdicao(usuario) {
    setForm({ nome: usuario.nome, email: usuario.email });
    setEditandoId(usuario.id);
    setAviso(null);
  }

  function enviarFormulario(evento) {
    evento.preventDefault();
    setAviso(null);
    if (editandoId === null) {
      cadastrar();
    } else {
      atualizar();
    }
  }

  // Filtro da busca (mesma ideia do Exemplo 4 da aula)
  const filtrados = usuarios.filter(
    (u) =>
      (u.nome ?? "").toLowerCase().includes(busca.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(busca.toLowerCase())
  );

  // ---------------------------------------------------------------
  // Tela
  // ---------------------------------------------------------------
  return (
    <main className="pagina">
      <header className="cabecalho">
        <h1>Cadastro de usuários</h1>
        <p>Cadastre, edite e exclua usuários da API Spring Boot.</p>
      </header>

      <div className="layout">
        <section className="painel">
          <h2>{editandoId === null ? "Novo usuário" : `Editando usuário ${editandoId}`}</h2>

          <UsuarioForm
            form={form}
            setForm={setForm}
            editando={editandoId !== null}
            salvando={salvando}
            onSubmit={enviarFormulario}
            onCancelar={limparFormulario}
          />

          {aviso && (
            <p className={`aviso aviso-${aviso.tipo}`} role="status">
              {aviso.texto}
            </p>
          )}
        </section>

        <section className="painel">
          <div className="painel-topo">
            <h2>Usuários ({usuarios.length})</h2>
            <button type="button" className="secundario" onClick={carregarUsuarios} disabled={loading}>
              Recarregar usuários
            </button>
          </div>

          <SearchBar busca={busca} setBusca={setBusca} />

          {/* Padrão da aula: Loading → Erro → Dados */}
          {loading && <p className="mensagem">Carregando...</p>}

          {!loading && erro && (
            <p className="mensagem mensagem-erro" role="alert">
              {erro}
            </p>
          )}

          {!loading && !erro && (
            <UserList
              usuarios={filtrados}
              totalGeral={usuarios.length}
              editandoId={editandoId}
              onEditar={iniciarEdicao}
              onExcluir={excluir}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
