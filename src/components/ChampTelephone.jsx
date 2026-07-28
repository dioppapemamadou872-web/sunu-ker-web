function ChampTelephone({ value, onChange, placeholder, required }) {
  function gererChangement(e) {
    const chiffresUniquement = e.target.value.replace(/\D/g, '').slice(0, 9);
    onChange(chiffresUniquement);
  }

  return (
    <div>
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={gererChangement}
        placeholder={placeholder || '771234567'}
        required={required}
      />
      {value.length > 0 && value.length < 9 && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>
          Il manque {9 - value.length} chiffre(s)
        </span>
      )}
    </div>
  );
}

export default ChampTelephone;