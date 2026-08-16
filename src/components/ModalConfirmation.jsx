import { useEffect } from 'react';
import { AlertTriangle, Trash2, X, Check } from 'lucide-react';

export default function ModalConfirmation({
  isOpen,
  onClose,
  onConfirm,
  titre = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  texteConfirmer = 'Confirmer',
  texteAnnuler = 'Annuler',
  variante = 'danger',
  chargement = false,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && !chargement) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, chargement, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom" onClick={chargement ? undefined : onClose}>
      <div
        className="modal-box-custom"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          disabled={chargement}
          title="Fermer"
        >
          <X size={18} />
        </button>

        <div className="modal-icon-header">
          <div className={`modal-icon-circle ${variante}`}>
            {variante === 'danger' ? <Trash2 size={26} /> : <AlertTriangle size={26} />}
          </div>
        </div>

        <div className="modal-body-custom">
          <h3 className="modal-title-custom">{titre}</h3>
          <p className="modal-desc-custom">{message}</p>
        </div>

        <div className="modal-actions-custom">
          <button
            type="button"
            className="modal-btn-cancel"
            onClick={onClose}
            disabled={chargement}
          >
            {texteAnnuler}
          </button>
          <button
            type="button"
            className={`modal-btn-confirm ${variante}`}
            onClick={onConfirm}
            disabled={chargement}
          >
            {chargement ? (
              <span className="btn-spinner" />
            ) : (
              <>
                {variante === 'danger' ? <Trash2 size={16} /> : <Check size={16} />}
                <span>{texteConfirmer}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
