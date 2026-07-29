export function estNouveau(datePublication) {
  if (!datePublication) return false;
  const diffHeures = (Date.now() - new Date(datePublication).getTime()) / (1000 * 60 * 60);
  return diffHeures < 48;
}

const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

export function formaterDatePublication(datePublication) {
  if (!datePublication) return '';

  const date = new Date(datePublication);
  const maintenant = new Date();

  const dateJour = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const aujourdhui = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
  const diffJours = Math.round((aujourdhui - dateJour) / (1000 * 60 * 60 * 24));

  if (diffJours === 0) return 'Publié aujourd\'hui';
  if (diffJours === 1) return 'Publié hier';
  if (diffJours > 1 && diffJours <= 6) return `Publié il y a ${diffJours} jours`;

  return `Ajouté le ${date.getDate()} ${MOIS[date.getMonth()]} ${date.getFullYear()}`;
}