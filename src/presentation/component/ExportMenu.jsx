import { useEffect, useRef, useState } from "react";

export default function ExportMenu({ onPdf, onCsv, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="exportMenu" ref={ref}>
      <button
        type="button"
        className="btn tiny"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        ⬇ تصدير
      </button>

      {open && !disabled && (
        <div className="exportDropdown">
          <button type="button" onClick={() => { setOpen(false); onPdf?.(); }}>
            PDF
          </button>
          <button type="button" onClick={() => { setOpen(false); onCsv?.(); }}>
            CSV
          </button>
        </div>
      )}
    </div>
  );
}
