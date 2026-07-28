export function estNouveau(datePublication) {
  if (!datePublication) return false;
  const diffHeures = (Date.now() - new Date(datePublication).getTime()) / (1000 * 60 * 60);
  return diffHeures < 48;
}