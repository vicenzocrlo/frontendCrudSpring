// Pega as iniciais do nome para o círculo colorido (no lugar de ícones).
function iniciais(nome = "") {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

// Lista de usuários. Não faz requisições: chama onEditar/onExcluir, que ficam no App.
function UserList({ usuarios, totalGeral, editandoId, onEditar, onExcluir }) {
  if (usuarios.length === 0) {
    return (
      <p className="mensagem">
        {totalGeral === 0
          ? "Nenhum usuário cadastrado ainda. Use o formulário para criar o primeiro."
          : "Nenhum usuário encontrado."}
      </p>
    );
  }

  return (
    <ul className="lista">
      {usuarios.map((usuario) => (
        <li
          key={usuario.id}
          className={usuario.id === editandoId ? "item item-editando" : "item"}
        >
          <span className="avatar" aria-hidden="true">
            {iniciais(usuario.nome)}
          </span>

          <div className="dados">
            <strong>{usuario.nome}</strong>
            <span>{usuario.email}</span>
            <small>ID {usuario.id}</small>
          </div>

          <div className="acoes">
            <button type="button" className="secundario" onClick={() => onEditar(usuario)}>
              Editar
            </button>
            <button type="button" className="perigo" onClick={() => onExcluir(usuario)}>
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default UserList;
