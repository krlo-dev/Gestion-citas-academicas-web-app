import "../../styles/ui.css";

/**
 * Input — campo de texto con etiqueta opcional.
 * Acepta todas las props nativas de <input>.
 * @param {string} label - texto de la etiqueta (opcional)
 */
export default function Input({ label, id, ...props }) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <input id={inputId} className="input-field" {...props} />
    </div>
  );
}
