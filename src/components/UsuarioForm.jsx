// Formulário usado tanto para cadastrar (POST) quanto para editar (PUT).
// Ele não faz requisições: apenas atualiza o estado "form" do App e avisa no envio.
function UsuarioForm({ form, setForm, editando, salvando, onSubmit, onCancelar }) {
  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  return (
    <form onSubmit={onSubmit} className="formulario">
      <label className="campo">
        Nome
        <input
          name="nome"
          required
          value={form.nome}
          onChange={alterarCampo}
          placeholder="Maria Silva"
          autoComplete="off"
        />
      </label>

      <label className="campo">
        E-mail
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={alterarCampo}
          placeholder="maria@email.com"
          autoComplete="off"
        />
      </label>

      <div className="botoes">
        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar usuário"}
        </button>

        {editando && (
          <button type="button" className="secundario" onClick={onCancelar}>
            Cancelar edição
          </button>
        )}
      </div>
    </form>
  );
}

export default UsuarioForm;
