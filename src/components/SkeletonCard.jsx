import React from 'react';

/**
 * Composant de carte d'attente (Skeleton Loader) animé avec un effet brillant.
 */
export default function SkeletonCard() {
  return (
    <div className="logement-card skeleton-card">
      <div className="skeleton-image skeleton-shimmer"></div>
      <div className="logement-card-body" style={{ padding: '16px' }}>
        <div className="skeleton-line skeleton-shimmer" style={{ width: '40%', height: '14px', marginBottom: '12px', borderRadius: '6px' }}></div>
        <div className="skeleton-line skeleton-shimmer" style={{ width: '85%', height: '20px', marginBottom: '12px', borderRadius: '6px' }}></div>
        <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', height: '14px', marginBottom: '16px', borderRadius: '6px' }}></div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div className="skeleton-line skeleton-shimmer" style={{ width: '30%', height: '14px', borderRadius: '6px' }}></div>
          <div className="skeleton-line skeleton-shimmer" style={{ width: '30%', height: '14px', borderRadius: '6px' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
          <div className="skeleton-line skeleton-shimmer" style={{ width: '45%', height: '22px', borderRadius: '6px' }}></div>
          <div className="skeleton-line skeleton-shimmer" style={{ width: '35%', height: '32px', borderRadius: '8px' }}></div>
        </div>
      </div>
    </div>
  );
}
