import React from 'react';

/**
 * Composant d'affichage direct des valeurs numériques sans animation de comptage.
 */
export default function AnimatedCounter({
  endValue,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const target = Number(endValue) || 0;

  return (
    <span className={className}>
      {prefix}{target.toLocaleString('fr-FR')}{suffix}
    </span>
  );
}
