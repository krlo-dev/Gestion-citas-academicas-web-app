import "../../styles/ui.css";

/**
 * Select — desplegable con etiqueta opcional.
 * Acepta todas las props nativas de <select>.
 * @param {string} label - texto de la etiqueta (opcional)
 */
export default function Select({ label, id, children, ...props }) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="select-wrapper">
      {label && (
        <label htmlFor={selectId} className="field-label">
          {label}
        </label>
      )}
      <select id={selectId} className="select-field" {...props}>
        {children}
      </select>
    </div>
  );
}
