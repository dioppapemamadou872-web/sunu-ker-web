import React from 'react';

/**
 * Composant conteneur pour afficher directement les éléments sans animation fade-in ou scroll.
 */
export default function ScrollReveal({
  children,
  className = '',
  style = {},
  animation,
  delay,
  duration,
  ...rest
}) {
  return (
    <div className={className} style={style} {...rest}>
      {children}
    </div>
  );
}
