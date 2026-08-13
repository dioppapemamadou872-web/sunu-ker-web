function ChampTelephone({ value, valeur, onChange, placeholder, required, style, className }) {
  let val = '';
  if (typeof value === 'string') {
    val = value;
  } else if (typeof valeur === 'string') {
    val = valeur;
  } else if (value !== null && value !== undefined) {
    val = String(value);
  } else if (valeur !== null && valeur !== undefined) {
    val = String(valeur);
  }

  function gererChangement(e) {
    const raw = e && e.target ? e.target.value : '';
    const chiffresUniquement = raw.replace(/\D/g, '').slice(0, 9);
    if (typeof onChange === 'function') {
      onChange(chiffresUniquement);
    }
  }

  return (
    <div className={className || ''} style={{ width: '100%' }}>
      <input
        type="tel"
        inputMode="numeric"
        value={val}
        onChange={gererChangement}
        placeholder={placeholder || '77 123 45 67'}
        required={required}
        style={style || {
          width: '100%',
          padding: '0.75rem 0.85rem',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          fontSize: '0.9rem',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      {Boolean(val && val.length > 0 && val.length < 9) && (
        <span style={{ fontSize: '0.78rem', color: 'var(--color-error, #dc2626)', marginTop: '0.25rem', display: 'block' }}>
          Il manque {9 - val.length} chiffre(s) (9 chiffres requis)
        </span>
      )}
    </div>
  );
}

export default ChampTelephone;