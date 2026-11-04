// Campo de busca controlado pelo estado do App.
function SearchBar({ busca, setBusca }) {
  return (
    <label className="campo">
      Buscar por nome ou e-mail
      <input
        type="search"
        placeholder="Digite para filtrar..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
    </label>
  );
}

export default SearchBar;
