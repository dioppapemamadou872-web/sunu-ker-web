function SelecteurSecteur({ secteurs, secteurChoisi, onChoisir }) {
  return (
    <div className="sector-list">
      {secteurs.map((secteur) => (
        <button
          key={secteur}
          className={`sector-btn ${secteurChoisi === secteur ? 'active' : ''}`}
          onClick={() => onChoisir(secteur)}
        >
          {secteur}
        </button>
      ))}
    </div>
  );
}

export default SelecteurSecteur;