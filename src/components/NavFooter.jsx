// Black footer strip with green BACK / NEXT controls. Either side can be
// omitted; the other stays pinned to its edge.
export function NavFooter({ onBack, onNext, backLabel = 'Back', nextLabel = 'Next' }) {
  return (
    <div className="nav-footer">
      {onBack ? (
        <button type="button" className="nav-btn" onClick={onBack}>
          <span className="nav-chevron">&lsaquo;</span>
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      {onNext ? (
        <button type="button" className="nav-btn" onClick={onNext}>
          {nextLabel}
          <span className="nav-chevron">&rsaquo;</span>
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
